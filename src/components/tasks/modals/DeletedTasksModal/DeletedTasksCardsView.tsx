"use client"

/**
 * DeletedTasksCardsView - Display deleted tasks as cards
 * 
 * Responsibilities:
 * - Render task cards in grid layout
 * - Display restore button only
 * - Display pagination
 * 
 * Rules:
 * - UI only - no logic
 */

import { TaskCard } from "../../TaskCard"
import { Button } from "@/components/ui/button"
import { RotateCw } from "lucide-react"
import type { TaskResource, PaginationMeta } from "@/features/tasks"

export interface DeletedTasksCardsViewProps {
  tasks: TaskResource[]
  meta?: PaginationMeta
  currentPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  isRestoring?: boolean
  onRestore: (task: TaskResource) => void
}

export function DeletedTasksCardsView({
  tasks,
  meta,
  currentPage,
  onPageChange,
  isLoading,
  isRestoring,
  onRestore,
}: DeletedTasksCardsViewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex flex-col gap-2">
            <TaskCard
              task={task}
              disableHoverScale={true}
            />
            {/* Restore Button */}
            <Button
              variant="default"
              size="sm"
              onClick={() => onRestore(task)}
              disabled={isRestoring}
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg"
            >
              <RotateCw className="h-4 w-4" />
              استعادة
            </Button>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            السابق
          </Button>
          <span className="text-sm text-muted-foreground">
            صفحة {currentPage} من {meta.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(meta.last_page, currentPage + 1))}
            disabled={currentPage === meta.last_page || isLoading}
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  )
}
