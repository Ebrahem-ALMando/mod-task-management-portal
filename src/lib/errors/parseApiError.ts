/**
 * API error parsing and normalization
 * 
 * Responsibilities:
 * - Parse API error responses
 * - Normalize them into ApiError shape
 * 
 * Rules:
 * - NO fetch
 * - NO storage
 * - NO auth
 * - NO UI
 * - Pure functions ONLY
 */

import type { ApiError } from "./apiError"

/**
 * Create a normalized ApiError
 * 
 * @param status - HTTP status code
 * @param message - Error message
 * @param errors - Optional validation errors
 * @returns Normalized ApiError
 */
export function createApiError(
  status: number,
  message: string,
  errors?: Record<string, string[]>
): ApiError {
  return {
    status,
    message,
    errors,
  }
}

/**
 * Parse error response from API
 * 
 * @param response - Fetch Response object
 * @returns Normalized ApiError
 */
export async function parseApiError(response: Response): Promise<ApiError> {
  let message = `Request failed with status ${response.status}`
  let errors: Record<string, string[]> | undefined

  try {
    const data = await response.json()

    // Try to extract message from common error response formats
    if (typeof data === "object" && data !== null) {
      message = data.message || data.error || data.errorMessage || message

      // Extract validation errors if present
      if (data.errors && typeof data.errors === "object") {
        errors = data.errors
      } else if (data.validationErrors) {
        errors = data.validationErrors
      }
    }
  } catch {
    // If JSON parsing fails, use response status text
    message = response.statusText || message
  }

  return createApiError(response.status, message, errors)
}

/**
 * Create ApiError from network/unknown errors
 * 
 * @param error - Error object or message
 * @returns Normalized ApiError
 */
export function createNetworkError(error: unknown): ApiError {
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return createApiError(408, "Request timeout. Please try again.")
    }

    return createApiError(
      0,
      error.message || "Network error. Please check your connection."
    )
  }

  return createApiError(0, "An unexpected error occurred.")
}
