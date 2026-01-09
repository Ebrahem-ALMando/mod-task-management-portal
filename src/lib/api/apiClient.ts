/**
 * Low-level HTTP client
 * 
 * Handles:
 * - HTTP requests (fetch)
 * - Headers (including Authorization)
 * - Timeout management
 * - Response parsing
 * 
 * Delegates to:
 * - apiConfig for base URL
 * - auth for token
 * - errors for error parsing
 * 
 * Contains ZERO logic for:
 * - storage
 * - token retrieval details
 * - error formatting
 */

import { getApiBaseUrl } from "../config/apiConfig"
import { getAuthToken } from "../auth"
import { parseApiError, createNetworkError } from "../errors/parseApiError"
import type { ApiError, RequestConfig, HttpMethod } from "./api.types"

/**
 * Low-level HTTP client
 * 
 * @param endpoint - API endpoint (e.g., "/tasks" or "/users/123")
 * @param method - HTTP method
 * @param body - Request body (will be JSON stringified)
 * @param config - Additional request configuration
 * @returns Parsed JSON response
 * @throws ApiError on failure
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  method: HttpMethod = "GET",
  body?: unknown,
  config: RequestConfig = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const token = getAuthToken()

  // Normalize endpoint (remove leading slash if present, we'll add it)
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  const url = `${baseUrl}${normalizedEndpoint}`

  // Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.headers,
  }

  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  // Prepare request options
  const requestOptions: RequestInit = {
    method,
    headers,
    signal: config.signal,
  }

  // Add body for non-GET requests
  if (body !== undefined && method !== "GET") {
    requestOptions.body = JSON.stringify(body)
  }

  // Create abort controller for timeout if not provided
  let abortController: AbortController | undefined
  let timeoutId: NodeJS.Timeout | undefined

  if (!config.signal && config.timeout) {
    abortController = new AbortController()
    requestOptions.signal = abortController.signal

    timeoutId = setTimeout(() => {
      abortController?.abort()
    }, config.timeout)
  }

  try {
    const response = await fetch(url, requestOptions)

    // Clear timeout if request completed
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Handle non-OK responses - delegate to error parsing layer
    if (!response.ok) {
      const error = await parseApiError(response)
      throw error
    }

    // Parse JSON response
    // Handle empty responses (204 No Content, etc.)
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const text = await response.text()
      return text ? (JSON.parse(text) as T) : ({} as T)
    }

    // Return empty object for non-JSON responses
    return {} as T
  } catch (error) {
    // Clear timeout on error
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Re-throw ApiError as-is (from parseApiError)
    if (error && typeof error === "object" && "status" in error) {
      throw error
    }

    // Handle network errors, timeouts, etc. - delegate to error layer
    throw createNetworkError(error)
  }
}
