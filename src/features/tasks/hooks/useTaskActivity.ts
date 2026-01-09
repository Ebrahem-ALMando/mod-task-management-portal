"use client"

/**
 * Task activity log hook (READ-ONLY)
 * 
 * Responsibilities:
 * - Extract activity from task data
 * - Provide timeline of status changes and reassignments
 * - No mutations
 * - No toast
 * - No transformation that hides data
 * 
 * Rules:
 * - Uses useTask(id) internally
 * - Extracts status_logs from TaskResource
 * - Returns activity items in chronological order
 */

import { useMemo } from "react"
import { useTask } from "./useTask"
import type { TaskStatusLogResource } from "../types/task.types"

/**
 * Task activity item
 */
export interface TaskActivityItem {
  /**
   * Activity ID (from status log)
   */
  id: number

  /**
   * Activity type
   */
  type: "status_change" | "reassignment" | "other"

  /**
   * From status (for status changes)
   */
  from_status: string | null

  /**
   * To status (for status changes)
   */
  to_status: string | null

  /**
   * Reason (if available)
   */
  reason: string | null

  /**
   * User who performed the action
   */
  changed_by: {
    id: number
    name: string
    username: string
    avatar_url: string | null
  }

  /**
   * Timestamp
   */
  created_at: string
}

/**
 * Return type of useTaskActivity hook
 */
export interface UseTaskActivityReturn {
  /**
   * Activity items (chronologically ordered)
   */
  activity: TaskActivityItem[]

  /**
   * Whether data is being fetched
   */
  isLoading: boolean

  /**
   * Error if request failed
   */
  error: import("@/lib/api/api.types").ApiError | null
}

/**
 * Hook for task activity log
 * 
 * Extracts activity timeline from task data (status_logs).
 * 
 * @param id - Task ID
 * @param options - Additional query options
 * @returns Activity items, loading state, and error
 * 
 * @example
 * ```tsx
 * const { activity, isLoading } = useTaskActivity(123)
 * 
 * return (
 *   <Timeline>
 *     {activity.map(item => (
 *       <TimelineItem key={item.id} {...item} />
 *     ))}
 *   </Timeline>
 * )
 * ```
 */
export function useTaskActivity(
  id: number | string | null,
  options?: { enabled?: boolean }
): UseTaskActivityReturn {
  const { task, isLoading, error } = useTask(id, options)

  // Extract activity from status_logs
  const activity = useMemo<TaskActivityItem[]>(() => {
    if (!task?.status_logs) {
      return []
    }

    // Convert status_logs to activity items
    return task.status_logs
      .map((log: TaskStatusLogResource) => ({
        id: log.id,
        type: "status_change" as const,
        from_status: log.from_status,
        to_status: log.to_status,
        reason: log.reason,
        changed_by: {
          id: log.changed_by.id,
          name: log.changed_by.name,
          username: log.changed_by.username,
          avatar_url: log.changed_by.avatar_url,
        },
        created_at: log.created_at,
      }))
      .sort((a, b) => {
        // Sort chronologically (oldest first)
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })
  }, [task])

  return {
    activity,
    isLoading,
    error,
  }
}
