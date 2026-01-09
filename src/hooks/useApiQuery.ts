"use client"

/**
 * Generic API query hook using SWR
 * 
 * Responsibilities:
 * - Wrap SWR for API queries
 * - Enforce Online-First behavior
 * - Use apiExecutor ONLY
 * 
 * Rules:
 * - NO domain logic
 * - NO UI logic
 * - NO mutations
 * - Always try network first
 * - Cache as fallback only
 */

import useSWR from "swr"
import { apiExecutor } from "@/lib/api"
import type { ApiError } from "@/lib/api/api.types"

/**
 * API response wrapper (from API_CONTRACT.md)
 */
export interface ApiResponse<T> {
  status: number
  message: string
  data: T
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

/**
 * Options for useApiQuery
 */
export interface UseApiQueryOptions {
  /**
   * Query parameters for GET request
   */
  params?: Record<string, unknown>

  /**
   * Whether the query is enabled
   * If false, no fetch will be made
   */
  enabled?: boolean

  /**
   * SWR revalidation options
   */
  revalidateOnFocus?: boolean
  revalidateOnReconnect?: boolean
}

/**
 * Return type of useApiQuery
 */
export interface UseApiQueryReturn<T> {
  /**
   * The data from API response (extracted from data field)
   */
  data: T | undefined

  /**
   * Pagination metadata (if present)
   */
  meta: ApiResponse<T>["meta"] | undefined

  /**
   * Whether data is being fetched
   */
  isLoading: boolean

  /**
   * Whether data is being revalidated
   */
  isValidating: boolean

  /**
   * Error if request failed
   */
  error: ApiError | null

  /**
   * Manually trigger revalidation
   */
  mutate: () => Promise<T | undefined>
}

/**
 * Generic API query hook
 * 
 * Fetches data using apiExecutor and wraps it with SWR.
 * Enforces Online-First behavior: always tries network first,
 * falls back to cache if network fails.
 * 
 * @param key - SWR key (null = no fetch)
 * @param endpoint - API endpoint path
 * @param options - Query options
 * @returns Query result with data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useApiQuery<Task[]>(
 *   "/tasks",
 *   "/tasks",
 *   { params: { status: "pending" } }
 * )
 * ```
 */
export function useApiQuery<T = unknown>(
  key: string | null,
  endpoint: string,
  options: UseApiQueryOptions = {}
): UseApiQueryReturn<T> {
  const {
    params,
    enabled = true,
    revalidateOnFocus = false,
    revalidateOnReconnect = true,
  } = options

  // Build SWR key
  const swrKey = enabled && key !== null ? [key, endpoint, params] : null

  // Fetcher function using apiExecutor
  const fetcher = async (): Promise<{ data: T; meta?: ApiResponse<T>["meta"] }> => {
    const response = await apiExecutor<ApiResponse<T>>(
      endpoint,
      "GET",
      undefined,
      params as Record<string, string | number | boolean | null | undefined>
    )

    // Return both data and meta for feature hooks to extract
    return {
      data: response.data,
      meta: response.meta,
    }
  }

  // Use SWR with Online-First configuration
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: T; meta?: ApiResponse<T>["meta"] },
    ApiError
  >(swrKey, fetcher,
    {
      // Online-First: always revalidate on mount and focus
      revalidateOnFocus,
      revalidateOnReconnect,
      revalidateOnMount: true,
      // Keep previous data while revalidating (stale-while-revalidate)
      keepPreviousData: true,
      // Don't retry on 401, 403, 404, 422 (per API_CONTRACT.md)
      shouldRetryOnError: (error) => {
        if (!error) return true
        const status = error.status
        // Don't retry on client errors (4xx) except 500-like network errors
        if (status >= 400 && status < 500) {
          return false
        }
        // Retry on 500 and network errors (status 0)
        return true
      },
      // Error retry count (only for retryable errors)
      errorRetryCount: 3,
      // Error retry interval (exponential backoff)
      errorRetryInterval: 1000,
    }
  )

  // Extract data and meta from response wrapper
  const extractedData = data?.data
  const meta = data?.meta

  return {
    data: extractedData,
    meta,
    isLoading: isLoading && !extractedData,
    isValidating,
    error: error || null,
    mutate: async () => {
      const result = await mutate()
      return result?.data
    },
  }
}
