"use client"

/**
 * Notifications feature mutations hook
 * 
 * Responsibilities:
 * - Expose notification mutation functions
 * - Decide per-operation: Queueable OR online-only
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
import type { NotificationResource } from "../types/notification.types"
import type { ApiError } from "@/lib/api/api.types"
import type { ApiResponse } from "@/hooks/useApiQuery"

/**
 * Generate unique action ID
 */
function generateActionId(): string {
  return `notification-action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
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
 * Return type of useNotificationActions hook
 */
export interface UseNotificationActionsReturn {
  /**
   * Mark notification as read (QUEUE ALLOWED)
   * 
   * PATCH /notifications/{id}/read
   * 
   * Idempotent - allowed offline, will be queued when offline
   * Success: NO toast (silent success)
   */
  markAsRead: (params: { id: number | string }) => Promise<NotificationResource | null>

  /**
   * Mark all notifications as read (QUEUE ALLOWED)
   * 
   * PATCH /notifications/read-all
   * 
   * Idempotent - allowed offline, will be queued when offline
   * Success: NO toast (silent success)
   */
  markAllAsRead: () => Promise<{ count: number } | null>
}

/**
 * Hook for notification mutations
 * 
 * Provides mutation functions with proper offline handling and toast reporting
 * 
 * Note: Success operations are reported but ActionToastListener will NOT show toast
 * (silent success per requirements)
 */
export function useNotificationActions(): UseNotificationActionsReturn {
  const { execute: executeNotification } = useAction<ApiResponse<NotificationResource>>()
  const { execute: executeCount } = useAction<ApiResponse<{ count: number }>>()
  const { reportAction } = useActionToast()
  const actionIdRef = useRef<string | null>(null)

  /**
   * Mark notification as read (QUEUE ALLOWED)
   * 
   * Per API_CONTRACT.md: Idempotent, suitable for offline queue
   */
  const markAsRead = useCallback(
    async (params: { id: number | string }): Promise<NotificationResource | null> => {
      const actionId = generateActionId()
      actionIdRef.current = actionId

      try {
        const response = await executeNotification({
          endpoint: `/notifications/${params.id}/read`,
          method: "PATCH",
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

        // Extract data from API response wrapper
        const apiResponse = response as ApiResponse<NotificationResource> | null
        const notification = apiResponse?.data || null

        // Report success (NO toast will be shown - silent success per requirements)
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          // No successMessage - silent success
        })

        return notification
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
    [executeNotification, reportAction]
  )

  /**
   * Mark all notifications as read (QUEUE ALLOWED)
   * 
   * Per API_CONTRACT.md: Idempotent, can queue with caution
   * Note: Count may differ when executed (due to new notifications)
   */
  const markAllAsRead = useCallback(async (): Promise<{ count: number } | null> => {
    const actionId = generateActionId()
    actionIdRef.current = actionId

      try {
        const response = await executeCount({
          endpoint: "/notifications/read-all",
          method: "PATCH",
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

        // Extract data from API response wrapper
        // Response format: { status, message, data: { count: number } }
        const apiResponse = response as ApiResponse<{ count: number }> | null
        const countData = apiResponse?.data || null

      // Report success (NO toast will be shown - silent success per requirements)
      reportAction({
        id: actionId,
        status: "success",
        error: null,
        // No successMessage - silent success
      })

      return countData
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
  }, [executeCount, reportAction])

  return {
    markAsRead,
    markAllAsRead,
  }
}
