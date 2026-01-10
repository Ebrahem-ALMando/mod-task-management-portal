"use client"

/**
 * TasksList - Display tasks in cards, table, or columns view
 * 
 * Responsibilities:
 * - Render tasks based on view mode
 * - Handle pagination
 * - Display loading and error states
 * 
 * Rules:
 * - UI only - no logic
 */

import { TasksCardsView } from "./TasksCardsView"
import { TasksTableView } from "./TasksTableView"
import { TasksColumnsView } from "./TasksColumnsView"
import type { ViewMode } from "./TasksView"
import type { TaskResource, PaginationMeta } from "@/features/tasks"
import type { ApiError } from "@/lib/api/api.types"
import { ErrorState } from "@/components/status/ErrorState"

export interface TasksListProps {
  tasks: TaskResource[]
  viewMode: ViewMode
  meta?: PaginationMeta
  currentPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  error?: ApiError | null
  onRefresh?: () => Promise<TaskResource[] | undefined>
  onStatusChange?: (taskId: number, newStatus: "pending" | "in_progress" | "completed" | "cancelled") => Promise<void>
  isSubmitting?: boolean
  onEdit?: (task: TaskResource) => void
  onDelete?: (task: TaskResource) => void
  onChangeStatus?: (task: TaskResource, newStatus: "pending" | "in_progress" | "completed" | "cancelled") => void
  onViewDetails?: (task: TaskResource) => void
}

export function TasksList({
  tasks,
  viewMode,
  meta,
  currentPage,
  onPageChange,
  isLoading,
  error,
  onRefresh,
  onStatusChange,
  isSubmitting,
  onEdit,
  onDelete,
  onChangeStatus,
  onViewDetails,
}: TasksListProps) {
  // Error State
  if (error && !isLoading) {
    return (
      <ErrorState
        message={error.message}
        onRetry={onRefresh ? () => onRefresh() : undefined}
        isRetrying={isLoading}
      />
    )
  }

  if (viewMode === "columns") {
    return (
      <TasksColumnsView
        tasks={tasks}
        isLoading={isLoading}
        onStatusChange={onStatusChange}
        isSubmitting={isSubmitting}
        onEdit={onEdit}
        onDelete={onDelete}
        onChangeStatus={onChangeStatus}
        onViewDetails={onViewDetails}
      />
    )
  }

  if (viewMode === "cards") {
    return (
      <TasksCardsView
        tasks={tasks}
        meta={meta}
        currentPage={currentPage}
        onPageChange={onPageChange}
        isLoading={isLoading}
        onStatusChange={onStatusChange}
        isSubmitting={isSubmitting}
        onEdit={onEdit}
        onDelete={onDelete}
        onChangeStatus={onChangeStatus}
        onViewDetails={onViewDetails}
      />
    )
  }

  return (
    <TasksTableView
      tasks={tasks}
      meta={meta}
      currentPage={currentPage}
      onPageChange={onPageChange}
      isLoading={isLoading}
      onStatusChange={onStatusChange}
      isSubmitting={isSubmitting}
      onEdit={onEdit}
      onDelete={onDelete}
      onChangeStatus={onChangeStatus}
      onViewDetails={onViewDetails}
    />
  )
}
