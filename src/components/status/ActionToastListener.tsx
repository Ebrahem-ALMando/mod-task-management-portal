"use client"

/**
 * ActionToastListener - Centralized toast management for actions
 * 
 * Responsibilities:
 * - Observe action states (from ActionToastContext)
 * - Decide WHEN to show toast
 * - Decide WHICH toast to show
 * - Use custom toast UI internally
 * 
 * Rules:
 * - NO API calls
 * - NO fetch
 * - NO SWR
 * - NO mutations
 * - NO storage access
 * 
 * Toast Rules (per API_CONTRACT.md):
 * ✅ SHOW TOAST:
 *   - Action status = "queued" → Info toast
 *   - Action status = "success" → Success toast
 *   - Action status = "failed" AND (error.status >= 500 OR status = 0) → Error toast
 * 
 * ❌ DO NOT SHOW TOAST:
 *   - 401 Unauthorized
 *   - 403 Forbidden
 *   - 404 Not Found
 *   - 422 Validation Error
 */

import { useEffect, useRef } from "react"
import { toast } from "@/components/ui/custom-toast-with-icons"
import { useActionToast, type ActionToastState } from "./ActionToastContext"
import type { ApiError } from "@/lib/api/api.types"

/**
 * Check if error should show toast
 * 
 * Per API_CONTRACT.md:
 * - 401, 403, 404, 422: NO toast
 * - 500+ or network errors (status 0): YES toast
 */
function shouldShowErrorToast(error: ApiError | null): boolean {
  if (!error) return false

  const status = error.status

  // Don't show toast for client errors (4xx)
  if (status >= 400 && status < 500) {
    return false
  }

  // Show toast for server errors (500+) and network errors (0)
  return status >= 500 || status === 0
}

/**
 * Get error message for toast
 */
function getErrorMessage(error: ApiError | null): string {
  if (!error) return "حدث خطأ غير متوقع"

  // Use error message from API if available
  if (error.message) {
    return error.message
  }

  // Fallback messages
  if (error.status === 0) {
    return "فقدان الاتصال بالشبكة. يرجى المحاولة لاحقاً"
  }

  if (error.status >= 500) {
    return "حدث خطأ في الخادم. يرجى المحاولة لاحقاً"
  }

  return "حدث خطأ غير متوقع"
}

/**
 * ActionToastListener component
 * 
 * Observes action states from ActionToastContext and shows appropriate toasts
 * based on API_CONTRACT.md rules
 */
export function ActionToastListener() {
  const { actions } = useActionToast()
  // Track shown toasts to prevent duplicates
  const shownToastsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    actions.forEach((action: ActionToastState) => {
      const toastId = `${action.id}-${action.status}`

      // Skip if already shown
      if (shownToastsRef.current.has(toastId)) {
        return
      }

      // Handle queued status
      if (action.status === "queued") {
        shownToastsRef.current.add(toastId)
        toast({
          title: "قيد الانتظار",
          description: "سيتم تنفيذ العملية عند توفر الاتصال",
          variant: "info",
        })
        return
      }

      // Handle success status
      if (action.status === "success") {
        // Silent success for notification actions (per requirements)
        // Notification actions have IDs starting with "notification-action-"
        if (action.id.startsWith("notification-action-")) {
          // Don't show toast for notification success (silent success)
          return
        }

        shownToastsRef.current.add(toastId)
        const message = action.successMessage || "تمت العملية بنجاح"
        toast({
          title: "نجاح",
          description: message,
          variant: "success",
        })
        return
      }

      // Handle failed status
      if (action.status === "failed" && action.error) {
        // Only show toast if error is retryable (500+ or network error)
        if (shouldShowErrorToast(action.error)) {
          shownToastsRef.current.add(toastId)
          const errorMessage = getErrorMessage(action.error)
          toast({
            title: "خطأ",
            description: errorMessage,
            variant: "error",
          })
        }
        // For 401, 403, 404, 422: NO toast (per API_CONTRACT.md)
        // These errors should be handled inline by UI
        return
      }
    })

    // Clean up old toast IDs (keep only recent ones to prevent memory leak)
    // Keep last 50 toast IDs
    if (shownToastsRef.current.size > 50) {
      const idsArray = Array.from(shownToastsRef.current)
      shownToastsRef.current = new Set(idsArray.slice(-50))
    }
  }, [actions])

  // This component doesn't render anything
  return null
}
