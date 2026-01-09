"use client"

/**
 * Hook for fetching a single user by ID (Admin only)
 * 
 * Endpoint: GET /users/{id}
 * 
 * Responsibilities:
 * - Call useApiQuery
 * - Map response to typed data
 * - Expose user, isLoading, error
 * 
 * Rules:
 * - No hardcoded strings outside this hook
 * - No UI logic
 * - No toast
 * - No mutation logic
 * - Errors must be returned, not swallowed
 */

import { useApiQuery } from "@/hooks/useApiQuery"
import type { UserResource } from "../types/user.types"
import type { ApiResponse } from "@/hooks/useApiQuery"

/**
 * Return type of useUser hook
 */
export interface UseUserReturn {
  /**
   * User data
   */
  user: UserResource | undefined

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
  mutate: () => Promise<UserResource | undefined>
}

/**
 * Hook for fetching a single user by ID
 * 
 * @param id - User ID
 * @param options - Additional query options
 * @returns User data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { user, isLoading, error } = useUser(123)
 * ```
 */
export function useUser(
  id: number | string | null,
  options?: { enabled?: boolean }
): UseUserReturn {
  // Build endpoint and key
  const endpoint = id !== null ? `/users/${id}` : null
  const key = endpoint

  // Fetch using useApiQuery
  const { data, isLoading, isValidating, error, mutate } = useApiQuery<
    ApiResponse<UserResource>
  >(key, endpoint || "", {
    enabled: options?.enabled !== false && id !== null,
  })

  // Extract user from response (useApiQuery already extracts data from wrapper)
  const user = data as UserResource | undefined

  return {
    user,
    isLoading,
    isValidating,
    error,
    mutate: async () => {
      const result = await mutate()
      return result as UserResource | undefined
    },
  }
}
