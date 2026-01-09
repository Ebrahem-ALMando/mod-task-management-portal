/**
 * Authentication token provider
 * 
 * Responsibilities:
 * - Decide where the auth token comes from
 * - Use storage layer ONLY (no direct localStorage/cookies access)
 * - Export functions: getAuthToken(), setAuthToken(), clearAuthToken()
 * 
 * This layer MUST be replaceable later without touching apiClient
 */

import { cookie } from "../storage"

/**
 * Storage key for authentication token
 */
const TOKEN_KEY = "auth_token"

/**
 * Get authentication token from storage
 * 
 * This function decides where the token is stored.
 * Currently uses cookies with secure settings.
 * 
 * @returns The authentication token, or null if not authenticated
 */
export function getAuthToken(): string | null {
  // Use storage layer - no direct cookie access
  return cookie.get(TOKEN_KEY)
}

/**
 * Set authentication token in storage
 * 
 * @param token - The authentication token to store
 */
export function setAuthToken(token: string): void {
  // Store in cookie with secure settings
  cookie.set(TOKEN_KEY, token, {
    path: "/",
    sameSite: "strict",
    secure: true, // Assume HTTPS
    // Not HttpOnly - frontend needs access
  })
}

/**
 * Clear authentication token from storage
 */
export function clearAuthToken(): void {
  // Remove cookie with same path
  cookie.remove(TOKEN_KEY, {
    path: "/",
  })
}
