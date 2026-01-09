import { apiClient } from "./apiClient"
import type { HttpMethod, QueryParams, RequestConfig, ApiError } from "./api.types"

/**
 * Build query string from params object
 */
function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}

/**
 * Generic API request executor
 * 
 * This is the single entry point for all API requests.
 * It replaces the need for entity-specific API functions like:
 * - addCourse()
 * - deleteTask()
 * - updateUser()
 * 
 * Instead, use:
 * - apiExecutor("/courses", "POST", courseData)
 * - apiExecutor("/tasks/123", "DELETE")
 * - apiExecutor("/users/456", "PUT", userData)
 * 
 * @param endpoint - API endpoint path (e.g., "/tasks" or "/users/123")
 * @param method - HTTP method (default: "GET")
 * @param payload - Request body for POST/PUT/PATCH requests
 * @param queryParams - Query parameters for GET requests (or any method)
 * @param config - Additional request configuration (headers, timeout, signal)
 * @returns Typed response data
 * @throws ApiError on failure
 * 
 * @example
 * // GET request
 * const tasks = await apiExecutor<Task[]>("/tasks")
 * 
 * @example
 * // GET with query params
 * const tasks = await apiExecutor<Task[]>("/tasks", "GET", undefined, { status: "active", page: 1 })
 * 
 * @example
 * // POST request
 * const newTask = await apiExecutor<Task>("/tasks", "POST", { title: "New Task", status: "pending" })
 * 
 * @example
 * // PUT request
 * const updated = await apiExecutor<Task>("/tasks/123", "PUT", { title: "Updated Task" })
 * 
 * @example
 * // DELETE request
 * await apiExecutor("/tasks/123", "DELETE")
 */
export async function apiExecutor<T = unknown>(
  endpoint: string,
  method: HttpMethod = "GET",
  payload?: unknown,
  queryParams?: QueryParams,
  config?: RequestConfig
): Promise<T> {
  // Build full endpoint with query params
  let fullEndpoint = endpoint
  
  if (queryParams && Object.keys(queryParams).length > 0) {
    const queryString = buildQueryString(queryParams)
    fullEndpoint = `${endpoint}${queryString}`
  }

  // Determine if this is a request that can have a body
  const canHaveBody = method !== "GET" && method !== "DELETE"
  
  // Call apiClient
  return apiClient<T>(
    fullEndpoint,
    method,
    canHaveBody ? payload : undefined,
    config
  )
}
