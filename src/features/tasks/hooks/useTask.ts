"use client"

/**
 * Hook for fetching a single task by ID
 * 
 * Endpoint: GET /tasks/{id}
 * 
 * Responsibilities:
 * - Call useApiQuery
 * - Map response to typed data
 * - Expose task, isLoading, error
 * 
 * Rules:
 * - No hardcoded strings outside this hook
 * - No UI logic
 * - No toast
 * - No mutation logic
 * - Errors must be returned, not swallowed
 */

import { useApiQuery } from "@/hooks/useApiQuery"
import type { TaskResource } from "../types/task.types"
import type { ApiResponse } from "@/hooks/useApiQuery"

/**
 * Return type of useTask hook
 */
export interface UseTaskReturn {
  /**
   * Task data (includes status_logs)
   */
  task: TaskResource | undefined

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
  mutate: () => Promise<TaskResource | undefined>
}

/**
 * Hook for fetching a single task by ID
 * 
 * @param id - Task ID
 * @param options - Additional query options
 * @returns Task data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { task, isLoading, error } = useTask(123)
 * ```
 */
export function useTask(
  id: number | string | null,
  options?: { enabled?: boolean }
): UseTaskReturn {
  // Build endpoint and key
  const endpoint = id !== null ? `/tasks/${id}` : null
  const key = endpoint

  // Fetch using useApiQuery
  const { data, isLoading, isValidating, error, mutate } = useApiQuery<
    ApiResponse<TaskResource>
  >(key, endpoint || "", {
    enabled: options?.enabled !== false && id !== null,
  })

  // Extract task from response
  const task = data as TaskResource | undefined

  return {
    task,
    isLoading,
    isValidating,
    error,
    mutate: async () => {
      const result = await mutate()
      return result as TaskResource | undefined
    },
  }
}
