"use client"

/**
 * TasksCardsView - Display tasks as cards
 * 
 * Responsibilities:
 * - Render task cards in grid layout
 * - Display loading skeleton
 * - Display empty state
 * - Display pagination
 * 
 * Rules:
 * - UI only - no logic
 */

import { TaskCard } from "./TaskCard"
import { TasksPagination } from "./TasksPagination"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckSquare as TaskIcon, Sparkles } from "lucide-react"
import type { TaskResource, PaginationMeta } from "@/features/tasks"

export interface TasksCardsViewProps {
  tasks: TaskResource[]
  meta?: PaginationMeta
  currentPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  onStatusChange?: (taskId: number, newStatus: "pending" | "in_progress" | "completed" | "cancelled") => Promise<void>
  isSubmitting?: boolean
  onEdit?: (task: TaskResource) => void
  onDelete?: (task: TaskResource) => void
  onChangeStatus?: (task: TaskResource, newStatus: "pending" | "in_progress" | "completed" | "cancelled") => void
  onViewDetails?: (task: TaskResource) => void
}

export function TasksCardsView({
  tasks,
  meta,
  currentPage,
  onPageChange,
  isLoading,
  onStatusChange,
  isSubmitting,
  onEdit,
  onDelete,
  onChangeStatus,
  onViewDetails,
}: TasksCardsViewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, idx) => (
          <Card key={idx} className="overflow-hidden animate-pulse">
            <CardHeader className="pb-3">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <TaskIcon className="w-16 h-16 text-primary/40 dark:text-[#E2C992]/40 mb-4 animate-bounce" strokeWidth={1.5} />
          <Sparkles className="w-6 h-6 text-[#E2C992] absolute -top-2 -right-2 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-primary dark:text-[#E2C992] mb-2">لا توجد مهام لعرضها</h3>
        <p className="text-muted-foreground text-sm">لم يتم العثور على مهام مطابقة للفلتر الحالي.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
            onChangeStatus={onChangeStatus}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <TasksPagination
          meta={meta}
          currentPage={currentPage}
          onPageChange={onPageChange}
          isLoading={isSubmitting}
        />
      )}
    </div>
  )
}
