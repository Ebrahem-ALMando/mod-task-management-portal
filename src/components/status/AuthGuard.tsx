"use client"

/**
 * Authentication guard component
 * 
 * Responsibilities:
 * - Wrap protected routes
 * - Redirect to /login if unauthenticated
 * - No API calls
 * - No mutations
 * - Uses useAuth() for state
 * 
 * Rules:
 * - UI ONLY component
 * - No business logic
 * - No toast
 */

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth"

interface AuthGuardProps {
  /**
   * Children to render if authenticated
   */
  children: React.ReactNode

  /**
   * Redirect path if unauthenticated (default: /login)
   */
  redirectTo?: string
}

/**
 * Authentication guard component
 * 
 * Wraps protected routes and redirects to login if user is not authenticated.
 * 
 * @param children - Content to render if authenticated
 * @param redirectTo - Path to redirect to if unauthenticated (default: /login)
 * 
 * @example
 * ```tsx
 * <AuthGuard>
 *   <Dashboard />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait for auth state to be determined
    if (isLoading) {
      return
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, redirectTo, router])

  // Show nothing while loading or redirecting
  if (isLoading || !isAuthenticated) {
    return null
  }

  // Render children if authenticated
  return <>{children}</>
}
