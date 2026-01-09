/**
 * Notification types based on API_CONTRACT.md
 * 
 * These types match the NotificationResource structure from the API
 */

import type { UserResource } from "../../tasks/types/task.types"

/**
 * Notification metadata
 */
export interface NotificationMetadata {
  type: "task_created" | "task_status_changed" | "task_reassigned" | "task_reminder"
  resource_type: "task"
  resource_id: number
  redirect_page: string
}

/**
 * Task resource (partial, embedded in notification)
 */
export interface TaskResourcePartial {
  id: number
  title: string
  status: string
  priority: string
  due_date: string
  assigned_to: UserResource
  created_by: UserResource
}

/**
 * Notification resource (from API_CONTRACT.md)
 */
export interface NotificationResource {
  id: number
  title: string
  message: string
  metadata: NotificationMetadata
  redirect_page: string
  status: "pending" | "sent" | "failed"
  scheduled_at: string | null
  sent_at: string | null
  read_at: string | null
  error: string | null
  created_at: string
  updated_at: string
  notificationable: TaskResourcePartial | null
  user: UserResource
}

/**
 * Unread count response
 */
export interface UnreadCountResponse {
  count: number
}
