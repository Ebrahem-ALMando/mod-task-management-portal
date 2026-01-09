"use client"

/**
 * Users feature mutations hook (Admin only)
 * 
 * Responsibilities:
 * - Expose user mutation functions
 * - Enforce online-only behavior strictly
 * - Report action results to Toast Architecture
 * - Bridge: useAction → ActionToastContext
 * 
 * Rules:
 * - NO UI components
 * - NO SWR usage
 * - NO direct toast usage
 * - NO business logic outside this hook
 * - NO offline queue
 * - NO optimistic updates
 * - NO retry logic
 */

import { useCallback, useRef } from "react"
import { useAction } from "@/hooks/useAction"
import { useActionToast } from "@/components/status"
import { isOnline } from "@/lib/network"
import type { UserResource } from "../types/user.types"
import type { ApiError } from "@/lib/api/api.types"
import type { ApiResponse } from "@/hooks/useApiQuery"

/**
 * Generate unique action ID
 */
function generateActionId(): string {
  return `user-action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
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
 * Return type of useUserActions hook
 */
export interface UseUserActionsReturn {
  /**
   * Create user (ONLINE ONLY)
   * 
   * POST /users
   * 
   * Must be online - will fail immediately if offline
   */
  createUser: (params: {
    username: string
    name: string
    password: string
    role: "admin" | "department"
    is_active?: boolean
  }) => Promise<UserResource | null>

  /**
   * Update user (ONLINE ONLY)
   * 
   * PUT /users/{id}
   * 
   * Must be online - will fail immediately if offline
   */
  updateUser: (params: {
    id: number | string
    username?: string
    name?: string
    password?: string
    role?: "admin" | "department"
    is_active?: boolean
  }) => Promise<UserResource | null>

  /**
   * Toggle user active status (ONLINE ONLY)
   * 
   * PATCH /users/{id}/toggle-active
   * 
   * Must be online - will fail immediately if offline
   */
  toggleActive: (params: { id: number | string }) => Promise<UserResource | null>

  /**
   * Delete user (ONLINE ONLY)
   * 
   * DELETE /users/{id}
   * 
   * Must be online - will fail immediately if offline
   */
  deleteUser: (params: { id: number | string }) => Promise<void>
}

/**
 * Hook for user mutations
 * 
 * Provides mutation functions with strict online-only enforcement and toast reporting
 */
export function useUserActions(): UseUserActionsReturn {
  const { execute } = useAction<ApiResponse<UserResource>>()
  const { reportAction } = useActionToast()
  const actionIdRef = useRef<string | null>(null)

  /**
   * Create user (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: NOT recommended for queue (non-idempotent)
   */
  const createUser = useCallback(
    async (params: {
      username: string
      name: string
      password: string
      role: "admin" | "department"
      is_active?: boolean
    }): Promise<UserResource | null> => {
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
          endpoint: "/users",
          method: "POST",
          payload: {
            username: params.username,
            name: params.name,
            password: params.password,
            role: params.role,
            is_active: params.is_active,
          },
        })

        // Extract data and message from API response wrapper
        const apiResponse = response as ApiResponse<UserResource> | null
        const user = apiResponse?.data || null
        const successMessage = apiResponse?.message || extractSuccessMessage(response)

        // Report success
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          successMessage,
        })

        return user
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
   * Update user (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: Can queue with caution, but user requirement: ONLINE-ONLY
   */
  const updateUser = useCallback(
    async (params: {
      id: number | string
      username?: string
      name?: string
      password?: string
      role?: "admin" | "department"
      is_active?: boolean
    }): Promise<UserResource | null> => {
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
          endpoint: `/users/${params.id}`,
          method: "PUT",
          payload: {
            username: params.username,
            name: params.name,
            password: params.password,
            role: params.role,
            is_active: params.is_active,
          },
        })

        // Extract data and message from API response wrapper
        const apiResponse = response as ApiResponse<UserResource> | null
        const user = apiResponse?.data || null
        const successMessage = apiResponse?.message || extractSuccessMessage(response)

        // Report success
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          successMessage,
        })

        return user
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
   * Toggle user active status (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: NOT suitable for queue (toggle-based, state-dependent)
   */
  const toggleActive = useCallback(
    async (params: { id: number | string }): Promise<UserResource | null> => {
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
          endpoint: `/users/${params.id}/toggle-active`,
          method: "PATCH",
        })

        // Extract data and message from API response wrapper
        const apiResponse = response as ApiResponse<UserResource> | null
        const user = apiResponse?.data || null
        const successMessage = apiResponse?.message || extractSuccessMessage(response)

        // Report success
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          successMessage,
        })

        return user
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
   * Delete user (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: NOT suitable for queue (destructive action)
   */
  const deleteUser = useCallback(
    async (params: { id: number | string }): Promise<void> => {
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
          endpoint: `/users/${params.id}`,
          method: "DELETE",
        })

        // Extract message from API response wrapper
        const successMessage = extractSuccessMessage(response) || "تم حذف المستخدم بنجاح"

        // Report success
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          successMessage,
        })
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
    createUser,
    updateUser,
    toggleActive,
    deleteUser,
  }
}
