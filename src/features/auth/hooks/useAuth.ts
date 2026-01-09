"use client"

/**
 * Hook for authentication state (READ-ONLY)
 * 
 * Responsibilities:
 * - Determine isAuthenticated status
 * - Provide user data from profile
 * - Expose loading state
 * 
 * Rules:
 * - No API calls directly
 * - No mutations
 * - No toast
 * - Uses useProfile() internally
 * - If profile exists → authenticated
 * - If 401 → unauthenticated
 */

import { useProfile } from "@/features/profile"
import type { ProfileResource } from "@/features/profile"

/**
 * Return type of useAuth hook
 */
export interface UseAuthReturn {
  /**
   * Whether user is authenticated
   * True if profile exists and no 401 error
   */
  isAuthenticated: boolean

  /**
   * Current user profile (if authenticated)
   */
  user: ProfileResource | undefined

  /**
   * Whether auth state is being determined
   */
  isLoading: boolean

  /**
   * Error if profile fetch failed
   */
  error: import("@/lib/api/api.types").ApiError | null
}

/**
 * Hook for authentication state
 * 
 * Determines authentication status by checking if profile exists.
 * Uses useProfile() internally - if profile exists, user is authenticated.
 * If 401 error, user is unauthenticated.
 * 
 * @returns Authentication state, user data, and loading state
 * 
 * @example
 * ```tsx
 * const { isAuthenticated, user, isLoading } = useAuth()
 * 
 * if (isLoading) return <div>Loading...</div>
 * if (!isAuthenticated) return <LoginPage />
 * return <Dashboard user={user} />
 * ```
 */
export function useAuth(): UseAuthReturn {
  const { profile, isLoading, error } = useProfile()

  // Determine authentication status
  // If profile exists → authenticated
  // If 401 error → unauthenticated
  // Otherwise → still loading or error
  const isAuthenticated = profile !== undefined
  const isUnauthenticated = error?.status === 401

  return {
    isAuthenticated: isAuthenticated && !isUnauthenticated,
    user: profile,
    isLoading,
    error: isUnauthenticated ? null : error, // Don't expose 401 as error
  }
}
