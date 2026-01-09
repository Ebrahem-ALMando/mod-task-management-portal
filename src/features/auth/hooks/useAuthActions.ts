"use client"

/**
 * Authentication actions hook
 * 
 * Responsibilities:
 * - Expose login/logout functions
 * - Handle token storage
 * - Report action results to Toast Architecture
 * - Clear SWR cache on logout
 * 
 * Rules:
 * - NO UI components
 * - NO direct toast usage
 * - NO business logic outside this hook
 * - NO offline queue
 */

import { useCallback } from "react"
import { useAction } from "@/hooks/useAction"
import { useActionToast } from "@/components/status"
import { isOnline } from "@/lib/network"
import { setAuthToken, clearAuthToken } from "@/lib/auth"
import { useSWRConfig } from "swr"
import type { ApiError } from "@/lib/api/api.types"
import type { ApiResponse } from "@/hooks/useApiQuery"
import type { LoginRequest, LoginResponse } from "../types/auth.types"

/**
 * Generate unique action ID
 */
function generateActionId(): string {
  return `auth-action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
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
 * Return type of useAuthActions hook
 */
export interface UseAuthActionsReturn {
  /**
   * Login (ONLINE ONLY)
   * 
   * POST /auth/login
   * 
   * Must be online - will fail immediately if offline
   * On success: stores token and shows success toast
   */
  login: (params: LoginRequest) => Promise<LoginResponse | null>

  /**
   * Logout (ONLINE ONLY)
   * 
   * POST /auth/logout
   * 
   * Clears token and SWR cache
   * Redirect handled by UI, not here
   */
  logout: () => Promise<void>
}

/**
 * Hook for authentication mutations
 * 
 * Provides login/logout functions with proper offline handling and toast reporting
 */
export function useAuthActions(): UseAuthActionsReturn {
  const { execute } = useAction<ApiResponse<LoginResponse>>()
  const { reportAction } = useActionToast()
  const { mutate: mutateSWR } = useSWRConfig()

  /**
   * Login (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: NOT allowed to queue
   */
  const login = useCallback(
    async (params: LoginRequest): Promise<LoginResponse | null> => {
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

      try {
        const response = await execute({
          endpoint: "/auth/login",
          method: "POST",
          payload: {
            username: params.username,
            password: params.password,
            device_token: params.device_token,
          },
        })

        // Extract data from API response wrapper
        const apiResponse = response as ApiResponse<LoginResponse> | null
        const loginData = apiResponse?.data || null

        if (loginData?.token) {
          // Store token
          setAuthToken(loginData.token)
        }

        // Report success
        reportAction({
          id: actionId,
          status: "success",
          error: null,
          successMessage: apiResponse?.message || "تم تسجيل الدخول بنجاح",
        })

        return loginData
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
   * Logout (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: Prefer not to queue
   * Offline: Clear token locally, then send logout "best-effort" when online
   */
  const logout = useCallback(async (): Promise<void> => {
    const actionId = generateActionId()

    // Clear token immediately (local logout)
    clearAuthToken()

    // Clear SWR cache
    mutateSWR(() => true, undefined, { revalidate: false })

    // If offline, don't try to call API
    if (!isOnline()) {
      // Silent success for offline logout
      return
    }

    try {
      await execute({
        endpoint: "/auth/logout",
        method: "POST",
      })

      // Report success (silent - logout should not block)
      reportAction({
        id: actionId,
        status: "success",
        error: null,
        successMessage: "تم تسجيل الخروج بنجاح",
      })
    } catch (err) {
      // Silent error - logout should not block even if API call fails
      // Token is already cleared, so user is logged out locally
      const apiError = err as ApiError

      // Only report if it's not a 401 (401 means already logged out)
      if (apiError.status !== 401) {
        reportAction({
          id: actionId,
          status: "failed",
          error: apiError,
        })
      }
    }
  }, [execute, reportAction, mutateSWR])

  return {
    login,
    logout,
  }
}
