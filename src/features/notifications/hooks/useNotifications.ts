"use client"

/**
 * Hook for fetching notifications
 * 
 * Endpoints:
 * - GET /notifications
 * - GET /notifications/unread-count
 * 
 * Responsibilities:
 * - Call useApiQuery
 * - Map response to typed data
 * - Expose notifications, unreadCount, isLoading, error
 * 
 * Rules:
 * - No auto-mark-as-read
 * - No mutation logic
 * - Return errors explicitly
 */

import { useApiQuery } from "@/hooks/useApiQuery"
import type {
  NotificationResource,
  UnreadCountResponse,
} from "../types/notification.types"
import type { ApiResponse } from "@/hooks/useApiQuery"
import type { PaginationMeta } from "../../tasks/types/task.types"

/**
 * Query parameters for notifications list
 */
export interface UseNotificationsParams {
  unread?: boolean
  type?: "task_created" | "task_status_changed" | "task_reassigned" | "task_reminder"
  from?: string
  to?: string
  filter_field?: "status" | "read_at" | "metadata->type"
  filter_value?: string | number
}

/**
 * Return type of useNotifications hook
 */
export interface UseNotificationsReturn {
  /**
   * Array of notifications
   */
  notifications: NotificationResource[] | undefined

  /**
   * Pagination metadata
   */
  meta: PaginationMeta | undefined

  /**
   * Whether data is being fetched
   */
  isLoading: boolean

  /**
   * Whether data is being revalidated
   */
  isValidating: boolean

  /**
   * Error if request failed
   */
  error: import("@/lib/api/api.types").ApiError | null

  /**
   * Manually trigger revalidation
   */
  mutate: () => Promise<NotificationResource[] | undefined>
}

/**
 * Return type of useUnreadCount hook
 */
export interface UseUnreadCountReturn {
  /**
   * Unread notifications count
   */
  count: number | undefined

  /**
   * Whether data is being fetched
   */
  isLoading: boolean

  /**
   * Error if request failed
   */
  error: import("@/lib/api/api.types").ApiError | null

  /**
   * Manually trigger revalidation
   */
  mutate: () => Promise<number | undefined>
}

/**
 * Hook for fetching notifications list
 * 
 * @param params - Query parameters
 * @param options - Additional query options
 * @returns Notifications data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { notifications, isLoading, error } = useNotifications({
 *   unread: true,
 *   type: "task_created"
 * })
 * ```
 */
export function useNotifications(
  params?: UseNotificationsParams,
  options?: { enabled?: boolean }
): UseNotificationsReturn {
  // Build SWR key
  const key = params ? `/notifications?${JSON.stringify(params)}` : "/notifications"

  // Fetch using useApiQuery
  const { data, meta, isLoading, isValidating, error, mutate } = useApiQuery<
    ApiResponse<NotificationResource[]>
  >(key, "/notifications", {
    params: params as Record<string, unknown>,
    enabled: options?.enabled,
  })

  // Extract notifications from response
  const notifications = Array.isArray(data) ? data : undefined

  return {
    notifications,
    meta: meta as PaginationMeta | undefined,
    isLoading,
    isValidating,
    error,
    mutate: async () => {
      const result = await mutate()
      return Array.isArray(result) ? result : undefined
    },
  }
}

/**
 * Hook for fetching unread notifications count
 * 
 * @param options - Additional query options
 * @returns Unread count, loading state, and error
 * 
 * @example
 * ```tsx
 * const { count, isLoading } = useUnreadCount()
 * ```
 */
export function useUnreadCount(
  options?: { enabled?: boolean }
): UseUnreadCountReturn {
  // Fetch using useApiQuery
  const { data, isLoading, error, mutate } = useApiQuery<ApiResponse<UnreadCountResponse>>(
    "/notifications/unread-count",
    "/notifications/unread-count",
    {
      enabled: options?.enabled,
    }
  )

  // Extract count from response
  const count = data?.count

  return {
    count,
    isLoading,
    error,
    mutate: async () => {
      const result = await mutate()
      return result?.count
    },
  }
}
