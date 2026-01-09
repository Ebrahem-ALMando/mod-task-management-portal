"use client"

/**
 * Hook to get device token (FCM) for push notifications
 * 
 * Responsibilities:
 * - Read device token if available
 * - Return undefined if not available
 * - No storage logic (read-only)
 * 
 * Rules:
 * - UI component only
 * - No mutations
 * - No API calls
 * - Returns undefined if token not available
 * 
 * Note: This is a placeholder hook. Actual FCM token retrieval
 * should be implemented when FCM is fully integrated.
 */

import { useState, useEffect } from "react"

/**
 * Return type of useDeviceToken hook
 */
export interface UseDeviceTokenReturn {
  /**
   * Device token (FCM token) if available
   * Undefined if not available or not yet retrieved
   */
  deviceToken: string | undefined

  /**
   * Whether device token is being retrieved
   */
  isLoading: boolean
}

/**
 * Hook to get device token for push notifications
 * 
 * Currently returns undefined as FCM integration is pending.
 * This hook can be extended later to actually retrieve FCM token.
 * 
 * @returns Device token and loading state
 * 
 * @example
 * ```tsx
 * const { deviceToken, isLoading } = useDeviceToken()
 * 
 * await login({
 *   username,
 *   password,
 *   device_token: deviceToken, // undefined if not available
 * })
 * ```
 */
export function useDeviceToken(): UseDeviceTokenReturn {
  const [deviceToken, setDeviceToken] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // TODO: Implement actual FCM token retrieval when FCM is integrated
    // For now, return undefined
    // Example future implementation:
    // 
    // setIsLoading(true)
    // getMessaging()
    //   .getToken({ vapidKey: VAPID_KEY })
    //   .then((token) => {
    //     setDeviceToken(token)
    //     setIsLoading(false)
    //   })
    //   .catch(() => {
    //     setDeviceToken(undefined)
    //     setIsLoading(false)
    //   })
    
    // Placeholder: token is undefined
    setDeviceToken(undefined)
    setIsLoading(false)
  }, [])

  return {
    deviceToken,
    isLoading,
  }
}
