"use client"

/**
 * Hook for fetching users list (Admin only)
 * 
 * Endpoint: GET /users
 * 
 * Responsibilities:
 * - Call useApiQuery
 * - Map response to typed data
 * - Expose users, meta, isLoading, error
 * 
 * Rules:
 * - No hardcoded strings outside this hook
 * - No UI logic
 * - No toast
 * - No mutation logic
 * - Errors must be returned, not swallowed
 */

import { useApiQuery } from "@/hooks/useApiQuery"
import type { UserResource, PaginationMeta } from "../types/user.types"
import type { ApiResponse } from "@/hooks/useApiQuery"

/**
 * Query parameters for users list
 */
export interface UseUsersParams {
  role?: "admin" | "department"
  is_active?: boolean
  search?: string
  from?: string
  to?: string
  filter_field?: string
  filter_value?: string | number
  page?: number
}

/**
 * Return type of useUsers hook
 */
export interface UseUsersReturn {
  /**
   * Array of users
   */
  users: UserResource[] | undefined

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
  mutate: () => Promise<UserResource[] | undefined>
}

/**
 * Hook for fetching users list
 * 
 * @param params - Query parameters
 * @param options - Additional query options
 * @returns Users data, pagination meta, loading state, and error
 * 
 * @example
 * ```tsx
 * const { users, meta, isLoading, error } = useUsers({ role: "admin" })
 * ```
 */
export function useUsers(
  params?: UseUsersParams,
  options?: { enabled?: boolean }
): UseUsersReturn {
  // Build endpoint and key
  const endpoint = "/users"
  const key = params ? JSON.stringify({ endpoint, params }) : endpoint

  // Fetch using useApiQuery
  const { data, meta, isLoading, isValidating, error, mutate } = useApiQuery<
    ApiResponse<UserResource[]>
  >(key, endpoint, {
    params: params as Record<string, unknown>,
    enabled: options?.enabled !== false,
  })

  // Extract users from response (useApiQuery already extracts data from wrapper)
  const users = Array.isArray(data) ? data : undefined

  return {
    users,
    meta,
    isLoading,
    isValidating,
    error,
    mutate: async () => {
      const result = await mutate()
      return result as UserResource[] | undefined
    },
  }
}
