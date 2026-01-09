"use client"

/**
 * Profile feature mutations hook
 * 
 * Responsibilities:
 * - Expose profile mutation functions
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
import type { ApiError } from "@/lib/api/api.types"
import type { ApiResponse } from "@/hooks/useApiQuery"

/**
 * Profile resource (from API_CONTRACT.md)
 */
export interface ProfileResource {
  id: number
  username: string
  name: string
  avatar: string | null
  avatar_url: string | null
  role: "admin" | "department"
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Generate unique action ID
 */
function generateActionId(): string {
  return `profile-action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
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
 * Return type of useProfileActions hook
 */
export interface UseProfileActionsReturn {
  /**
   * Update profile (ONLINE ONLY)
   * 
   * PUT /profile
   * 
   * Must be online - will fail immediately if offline
   */
  updateProfile: (params: {
    name?: string
    password?: string
    current_password?: string
  }) => Promise<ProfileResource | null>

  /**
   * Set avatar filename (ONLINE ONLY)
   * 
   * POST /profile/avatar
   * 
   * Must be online - will fail immediately if offline
   * Note: File must be uploaded first via Image Uploads endpoint
   */
  updateAvatar: (params: { avatar: string }) => Promise<ProfileResource | null>

  /**
   * Remove avatar (ONLINE ONLY)
   * 
   * DELETE /profile/avatar
   * 
   * Must be online - will fail immediately if offline
   */
  removeAvatar: () => Promise<ProfileResource | null>
}

/**
 * Hook for profile mutations
 * 
 * Provides mutation functions with strict online-only enforcement and toast reporting
 */
export function useProfileActions(): UseProfileActionsReturn {
  const { execute } = useAction<ApiResponse<ProfileResource>>()
  const { reportAction } = useActionToast()
  const actionIdRef = useRef<string | null>(null)

  /**
   * Update profile (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: Queue allowed with caution for name only,
   * but user requirement: ONLINE-ONLY (strict enforcement)
   */
  const updateProfile = useCallback(
    async (params: {
      name?: string
      password?: string
      current_password?: string
    }): Promise<ProfileResource | null> => {
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
          endpoint: "/profile",
          method: "PUT",
          payload: {
            name: params.name,
            password: params.password,
            current_password: params.current_password,
          },
        })

        // Extract data and message from API response wrapper
        const apiResponse = response as ApiResponse<ProfileResource> | null
        const profile = apiResponse?.data || null
        const successMessage = apiResponse?.message || extractSuccessMessage(response)

        // Report success
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          successMessage,
        })

        return profile
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
   * Set avatar filename (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: NOT recommended for queue
   * User requirement: ONLINE-ONLY (strict enforcement)
   */
  const updateAvatar = useCallback(
    async (params: { avatar: string }): Promise<ProfileResource | null> => {
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
          endpoint: "/profile/avatar",
          method: "POST",
          payload: {
            avatar: params.avatar,
          },
        })

        // Extract data and message from API response wrapper
        const apiResponse = response as ApiResponse<ProfileResource> | null
        const profile = apiResponse?.data || null
        const successMessage = apiResponse?.message || extractSuccessMessage(response)

        // Report success
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          successMessage,
        })

        return profile
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
   * Remove avatar (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: NOT suitable for queue
   * User requirement: ONLINE-ONLY (strict enforcement)
   */
  const removeAvatar = useCallback(async (): Promise<ProfileResource | null> => {
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
        endpoint: "/profile/avatar",
        method: "DELETE",
      })

      // Extract data and message from API response wrapper
      const apiResponse = response as ApiResponse<ProfileResource> | null
      const profile = apiResponse?.data || null
      const successMessage = apiResponse?.message || extractSuccessMessage(response)

      // Report success
      reportAction({
        id: actionId,
        status: "success",
        error: null,
        successMessage,
      })

      return profile
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
  }, [execute, reportAction])

  return {
    updateProfile,
    updateAvatar,
    removeAvatar,
  }
}
