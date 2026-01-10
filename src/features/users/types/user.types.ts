/**
 * User types based on API_CONTRACT.md
 * 
 * These types match the UserResource structure from the API
 */

/**
 * Tasks statistics for a user
 */
export interface UserTasksStatistics {
  total_assigned: number
  completed: number
  incomplete: number
}

/**
 * User resource (from API_CONTRACT.md)
 */
export interface UserResource {
  id: number
  name: string
  username: string
  avatar: string | null
  avatar_url: string | null
  role: "admin" | "department"
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
  tasks_statistics?: UserTasksStatistics
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}
