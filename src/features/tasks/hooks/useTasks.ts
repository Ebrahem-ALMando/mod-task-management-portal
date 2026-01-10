"use client"

/**
 * Hook for fetching tasks list
 * 
 * Endpoint: GET /tasks
 * 
 * Responsibilities:
 * - Call useApiQuery
 * - Map response to typed data
 * - Expose tasks, meta, isLoading, error
 * 
 * Rules:
 * - No hardcoded strings outside this hook
 * - No UI logic
 * - No toast
 * - No mutation logic
 * - Errors must be returned, not swallowed
 */

import { useApiQuery } from "@/hooks/useApiQuery"
import type { TaskResource, PaginationMeta } from "../types/task.types"

/**
 * Query parameters for tasks list
 */
export interface UseTasksParams {
  status?: "pending" | "in_progress" | "completed" | "cancelled"
  priority?: "low" | "medium" | "high" | "urgent"
  overdue?: boolean
  search?: string
  from?: string
  to?: string
  filter_field?: "status" | "priority" | "assigned_to_user_id" | "created_by_user_id"
  filter_value?: string | number
  page?: number
  deleted?: boolean
}

/**
 * Return type of useTasks hook
 */
export interface UseTasksReturn {
  /**
   * Array of tasks
   */
  tasks: TaskResource[] | undefined

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
  mutate: () => Promise<TaskResource[] | undefined>
}

/**
 * Hook for fetching tasks list
 * 
 * @param params - Query parameters
 * @param options - Additional query options
 * @returns Tasks data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { tasks, isLoading, error } = useTasks({
 *   status: "pending",
 *   priority: "high"
 * })
 * ```
 */
export function useTasks(
  params?: UseTasksParams,
  options?: { enabled?: boolean }
): UseTasksReturn {
  // Build SWR key
  const key = params ? `/tasks?${JSON.stringify(params)}` : "/tasks"

  // Fetch using useApiQuery
  const { data, meta, isLoading, isValidating, error, mutate } = useApiQuery<
    TaskResource[]
  >(key, "/tasks", {
    params: params as Record<string, unknown>,
    enabled: options?.enabled,
  })

  // Extract tasks from response
  // useApiQuery already extracts data from response.data
  const tasks = Array.isArray(data) ? data : undefined

  return {
    tasks,
    meta,
    isLoading,
    isValidating,
    error,
    mutate: async () => {
      const result = await mutate()
      return Array.isArray(result) ? result : undefined
    },
  }
}
