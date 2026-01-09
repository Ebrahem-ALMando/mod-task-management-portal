"use client"

/**
 * Hook for fetching current user profile
 * 
 * Endpoint: GET /profile
 * 
 * Responsibilities:
 * - Call useApiQuery
 * - Map response to typed data
 * - Expose profile, isLoading, error
 * 
 * Rules:
 * - No hardcoded strings outside this hook
 * - No UI logic
 * - No toast
 * - No mutation logic
 * - Errors must be returned, not swallowed
 */

import { useApiQuery } from "@/hooks/useApiQuery"
import type { ProfileResource } from "../hooks/useProfileActions"
import type { ApiResponse } from "@/hooks/useApiQuery"

/**
 * Return type of useProfile hook
 */
export interface UseProfileReturn {
  /**
   * Profile data
   */
  profile: ProfileResource | undefined

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
  mutate: () => Promise<ProfileResource | undefined>
}

/**
 * Hook for fetching current user profile
 * 
 * @param options - Additional query options
 * @returns Profile data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { profile, isLoading, error } = useProfile()
 * ```
 */
export function useProfile(options?: { enabled?: boolean }): UseProfileReturn {
  const endpoint = "/profile"
  const key = endpoint

  // Fetch using useApiQuery
  const { data, isLoading, isValidating, error, mutate } = useApiQuery<
    ApiResponse<ProfileResource>
  >(key, endpoint, {
    enabled: options?.enabled !== false,
  })

  // Extract profile from response (useApiQuery already extracts data from wrapper)
  const profile = data as ProfileResource | undefined

  return {
    profile,
    isLoading,
    isValidating,
    error,
    mutate: async () => {
      const result = await mutate()
      return result as ProfileResource | undefined
    },
  }
}
