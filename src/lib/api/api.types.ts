/**
 * HTTP method types
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
}

/**
 * Request configuration options
 */
export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  signal?: AbortSignal
}

/**
 * Query parameters (for GET requests)
 */
export type QueryParams = Record<string, string | number | boolean | null | undefined>

// Re-export ApiError from errors layer for backward compatibility
export type { ApiError } from "../errors/apiError"
