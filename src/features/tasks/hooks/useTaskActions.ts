"use client"

/**
 * Tasks feature mutations hook
 * 
 * Responsibilities:
 * - Expose task mutation functions
 * - Decide per-operation: Online-only OR queueable
 * - Report action results to Toast Architecture
 * - Bridge: useAction → ActionToastContext
 * 
 * Rules:
 * - NO UI components
 * - NO SWR usage
 * - NO direct toast usage
 * - NO business logic outside this hook
 * - NO optimistic updates
 * - NO retry logic
 */

import { useCallback, useRef } from "react"
import { useAction } from "@/hooks/useAction"
import { useActionToast } from "@/components/status"
import { isOnline } from "@/lib/network"
import type { TaskResource } from "../types/task.types"
import type { ApiError } from "@/lib/api/api.types"
import type { ApiResponse } from "@/hooks/useApiQuery"

/**
 * Generate unique action ID
 */
function generateActionId(): string {
  return `task-action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Extract success message from API response
 */
function extractSuccessMessage<T>(response: T | null): string | undefined {
  if (!response || typeof response !== "object") {
    return undefined
  }

  const responseObj = response as Record<string, unknown>

  // Check if response has message field (from API_CONTRACT.md structure)
  if ("message" in responseObj && typeof responseObj.message === "string") {
    return responseObj.message
  }

  return undefined
}

/**
 * Create network error for offline operations
 */
function createOfflineError(): ApiError {
  return {
    status: 0,
    message: "فقدان الاتصال بالشبكة. يرجى الاتصال بالإنترنت والمحاولة مرة أخرى",
  }
}

/**
 * Return type of useTaskActions hook
 */
export interface UseTaskActionsReturn {
  /**
   * Change task status (QUEUE ALLOWED)
   * 
   * PATCH /tasks/{id}/status
   * 
   * Allowed offline - will be queued when offline
   */
  changeTaskStatus: (params: {
    id: number | string
    status: "pending" | "in_progress" | "completed" | "cancelled"
    reason?: string
  }) => Promise<TaskResource | null>

  /**
   * Create task (ONLINE ONLY)
   * 
   * POST /tasks
   * 
   * Must be online - will fail immediately if offline
   */
  createTask: (params: {
    title: string
    description?: string
    priority: "low" | "medium" | "high" | "urgent"
    due_date: string
    assigned_to_user_id: number
  }) => Promise<TaskResource | null>

  /**
   * Update task (ONLINE ONLY)
   * 
   * PUT /tasks/{id}
   * 
   * Must be online - will fail immediately if offline
   */
  updateTask: (params: {
    id: number | string
    title?: string
    description?: string
    priority?: "low" | "medium" | "high" | "urgent"
    due_date?: string
  }) => Promise<TaskResource | null>

  /**
   * Delete task (ONLINE ONLY)
   * 
   * DELETE /tasks/{id}
   * 
   * Must be online - will fail immediately if offline
   */
  deleteTask: (params: { id: number | string }) => Promise<null>

  /**
   * Reassign task (ONLINE ONLY)
   * 
   * PATCH /tasks/{id}/reassign
   * 
   * Must be online - will fail immediately if offline
   */
  reassignTask: (params: {
    id: number | string
    assigned_to_user_id: number
    reason?: string
  }) => Promise<TaskResource | null>

  /**
   * Restore task (ONLINE ONLY)
   * 
   * POST /tasks/{id}/restore
   * 
   * Must be online - will fail immediately if offline
   */
  restoreTask: (params: { id: number | string }) => Promise<TaskResource | null>
}

/**
 * Hook for task mutations
 * 
 * Provides mutation functions with proper offline handling and toast reporting
 */
export function useTaskActions(): UseTaskActionsReturn {
  const { execute, status, error } = useAction<ApiResponse<TaskResource>>()
  const { reportAction } = useActionToast()
  const actionIdRef = useRef<string | null>(null)

  /**
   * Change task status (QUEUE ALLOWED)
   * 
   * Per API_CONTRACT.md: Can be queued with caution
   */
  const changeTaskStatus = useCallback(
    async (params: {
      id: number | string
      status: "pending" | "in_progress" | "completed" | "cancelled"
      reason?: string
    }): Promise<TaskResource | null> => {
      const actionId = generateActionId()
      actionIdRef.current = actionId

      try {
        const response = await execute({
          endpoint: `/tasks/${params.id}/status`,
          method: "PATCH",
          payload: {
            status: params.status,
            reason: params.reason,
          },
        })

        // Check if action was queued (offline)
        if (response === null) {
          // Action was queued - useAction already handled it
          // Report queued status (ActionToastListener will show info toast)
          reportAction({
            id: actionId,
            status: "queued",
            error: null,
          })
          return null
        }

        // Extract data and message from API response wrapper
        const apiResponse = response as ApiResponse<TaskResource> | null
        const task = apiResponse?.data || null
        const successMessage = apiResponse?.message || extractSuccessMessage(response)

        // Report success
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          successMessage,
        })

        return task
      } catch (err) {
        const apiError = err as ApiError

        // Report failure
        reportAction({
          id: actionId,
          status: "failed",
          error: apiError,
        })

        throw apiError
      }
    },
    [execute, reportAction]
  )

  /**
   * Create task (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: NOT recommended for queue (non-idempotent)
   */
  const createTask = useCallback(
    async (params: {
      title: string
      description?: string
      priority: "low" | "medium" | "high" | "urgent"
      due_date: string
      assigned_to_user_id: number
    }): Promise<TaskResource | null> => {
      // Offline guard: fail immediately if offline
      if (!isOnline()) {
        const actionId = generateActionId()
        const offlineError = createOfflineError()

        // Report failure immediately
        reportAction({
          id: actionId,
          status: "failed",
          error: offlineError,
        })

        throw offlineError
      }

      const actionId = generateActionId()
      actionIdRef.current = actionId

      try {
        const response = await execute({
          endpoint: "/tasks",
          method: "POST",
          payload: {
            title: params.title,
            description: params.description,
            priority: params.priority,
            due_date: params.due_date,
            assigned_to_user_id: params.assigned_to_user_id,
          },
        })

        // Extract data and message from API response wrapper
        const apiResponse = response as ApiResponse<TaskResource> | null
        const task = apiResponse?.data || null
        const successMessage = apiResponse?.message || extractSuccessMessage(response)

        // Report success
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          successMessage,
        })

        return task
      } catch (err) {
        const apiError = err as ApiError

        // Report failure
        reportAction({
          id: actionId,
          status: "failed",
          error: apiError,
        })

        throw apiError
      }
    },
    [execute, reportAction]
  )

  /**
   * Update task (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: Can queue with caution, but user requirement: ONLINE ONLY
   */
  const updateTask = useCallback(
    async (params: {
      id: number | string
      title?: string
      description?: string
      priority?: "low" | "medium" | "high" | "urgent"
      due_date?: string
    }): Promise<TaskResource | null> => {
      // Offline guard: fail immediately if offline
      if (!isOnline()) {
        const actionId = generateActionId()
        const offlineError = createOfflineError()

        // Report failure immediately
        reportAction({
          id: actionId,
          status: "failed",
          error: offlineError,
        })

        throw offlineError
      }

      const actionId = generateActionId()
      actionIdRef.current = actionId

      try {
        const response = await execute({
          endpoint: `/tasks/${params.id}`,
          method: "PUT",
          payload: {
            title: params.title,
            description: params.description,
            priority: params.priority,
            due_date: params.due_date,
          },
        })

        // Extract data and message from API response wrapper
        const apiResponse = response as ApiResponse<TaskResource> | null
        const task = apiResponse?.data || null
        const successMessage = apiResponse?.message || extractSuccessMessage(response)

        // Report success
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          successMessage,
        })

        return task
      } catch (err) {
        const apiError = err as ApiError

        // Report failure
        reportAction({
          id: actionId,
          status: "failed",
          error: apiError,
        })

        throw apiError
      }
    },
    [execute, reportAction]
  )

  /**
   * Delete task (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: NOT suitable for queue (destructive)
   */
  const deleteTask = useCallback(
    async (params: { id: number | string }): Promise<null> => {
      // Offline guard: fail immediately if offline
      if (!isOnline()) {
        const actionId = generateActionId()
        const offlineError = createOfflineError()

        // Report failure immediately
        reportAction({
          id: actionId,
          status: "failed",
          error: offlineError,
        })

        throw offlineError
      }

      const actionId = generateActionId()
      actionIdRef.current = actionId

      try {
        await execute({
          endpoint: `/tasks/${params.id}`,
          method: "DELETE",
        })

        // Report success
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          successMessage: "تم حذف المهمة بنجاح",
        })

        return null
      } catch (err) {
        const apiError = err as ApiError

        // Report failure
        reportAction({
          id: actionId,
          status: "failed",
          error: apiError,
        })

        throw apiError
      }
    },
    [execute, reportAction]
  )

  /**
   * Reassign task (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: NOT recommended for queue (sensitive admin decision)
   */
  const reassignTask = useCallback(
    async (params: {
      id: number | string
      assigned_to_user_id: number
      reason?: string
    }): Promise<TaskResource | null> => {
      // Offline guard: fail immediately if offline
      if (!isOnline()) {
        const actionId = generateActionId()
        const offlineError = createOfflineError()

        // Report failure immediately
        reportAction({
          id: actionId,
          status: "failed",
          error: offlineError,
        })

        throw offlineError
      }

      const actionId = generateActionId()
      actionIdRef.current = actionId

      try {
        const response = await execute({
          endpoint: `/tasks/${params.id}/reassign`,
          method: "PATCH",
          payload: {
            assigned_to_user_id: params.assigned_to_user_id,
            reason: params.reason,
          },
        })

        // Extract data and message from API response wrapper
        const apiResponse = response as ApiResponse<TaskResource> | null
        const task = apiResponse?.data || null
        const successMessage = apiResponse?.message || extractSuccessMessage(response)

        // Report success
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          successMessage,
        })

        return task
      } catch (err) {
        const apiError = err as ApiError

        // Report failure
        reportAction({
          id: actionId,
          status: "failed",
          error: apiError,
        })

        throw apiError
      }
    },
    [execute, reportAction]
  )

  /**
   * Restore task (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: NOT suitable for queue
   */
  const restoreTask = useCallback(
    async (params: { id: number | string }): Promise<TaskResource | null> => {
      // Offline guard: fail immediately if offline
      if (!isOnline()) {
        const actionId = generateActionId()
        const offlineError = createOfflineError()

        // Report failure immediately
        reportAction({
          id: actionId,
          status: "failed",
          error: offlineError,
        })

        throw offlineError
      }

      const actionId = generateActionId()
      actionIdRef.current = actionId

      try {
        const response = await execute({
          endpoint: `/tasks/${params.id}/restore`,
          method: "POST",
        })

        // Extract data and message from API response wrapper
        const apiResponse = response as ApiResponse<TaskResource> | null
        const task = apiResponse?.data || null
        const successMessage = apiResponse?.message || extractSuccessMessage(response)

        // Report success
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          successMessage,
        })

        return task
      } catch (err) {
        const apiError = err as ApiError

        // Report failure
        reportAction({
          id: actionId,
          status: "failed",
          error: apiError,
        })

        throw apiError
      }
    },
    [execute, reportAction]
  )

  return {
    changeTaskStatus,
    createTask,
    updateTask,
    deleteTask,
    reassignTask,
    restoreTask,
  }
}
