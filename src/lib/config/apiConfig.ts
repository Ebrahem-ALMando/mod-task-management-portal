/**
 * API configuration
 * 
 * Responsibilities:
 * - Read environment variables
 * - Export configuration getters
 * 
 * Rules:
 * - Throw explicit error if base URL is missing
 * - NO fetch
 * - NO auth
 * - NO storage
 */

/**
 * Get the base API URL from environment variables
 * 
 * @returns Base API URL (without trailing slash)
 * @throws Error if NEXT_PUBLIC_API_BASE_URL is not defined
 */
export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not defined. Please set it in your .env file."
    )
  }

  // Remove trailing slash if present
  return baseUrl.replace(/\/$/, "")
}

/**
 * Get default request timeout in milliseconds
 * 
 * @returns Default timeout in milliseconds (default: 30000 = 30 seconds)
 */
export function getDefaultTimeout(): number {
  const timeout = process.env.NEXT_PUBLIC_API_TIMEOUT

  if (timeout) {
    const parsed = parseInt(timeout, 10)
    if (!isNaN(parsed) && parsed > 0) {
      return parsed
    }
  }

  return 30000 // Default: 30 seconds
}
