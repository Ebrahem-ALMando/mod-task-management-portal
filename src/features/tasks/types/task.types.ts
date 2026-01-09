/**
 * Task types based on API_CONTRACT.md
 * 
 * These types match the TaskResource structure from the API
 */

/**
 * User resource (embedded in Task)
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
}

/**
 * Task status log entry
 */
export interface TaskStatusLogResource {
  id: number
  from_status: string | null
  to_status: string
  reason: string | null
  created_at: string
  changed_by: UserResource
}

/**
 * Task resource (from API_CONTRACT.md)
 */
export interface TaskResource {
  id: number
  title: string
  description: string | null
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  due_date: string
  completed_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  created_at: string
  updated_at: string
  assigned_to: UserResource
  created_by: UserResource
  /**
   * Status logs are included in GET /tasks/{id} but not in GET /tasks
   */
  status_logs?: TaskStatusLogResource[]
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
