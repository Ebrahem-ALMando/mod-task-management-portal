"use client"

/**
 * DeletedTasksModal - Main modal component for viewing and restoring deleted tasks
 * 
 * Responsibilities:
 * - Manage modal state and data fetching
 * - Coordinate between filters, views, and actions
 * - Handle restore action
 * 
 * Rules:
 * - Business logic only - delegates UI to sub-components
 */

import { useState, useEffect, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Grid3x3, Table as TableIcon, Trash2, X } from "lucide-react"
import { useTasks, type UseTasksParams, useTaskActions, type TaskResource } from "@/features/tasks"
import type { UserResource } from "@/features/users"
import { ErrorState } from "@/components/status/ErrorState"
import { DeletedTasksFilters } from "./DeletedTasksFilters"
import { DeletedTasksCardsView } from "./DeletedTasksCardsView"
import { DeletedTasksTableView } from "./DeletedTasksTableView"

export interface DeletedTasksModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ViewMode = "cards" | "table"

export function DeletedTasksModal({
  open,
  onOpenChange,
}: DeletedTasksModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [filters, setFilters] = useState<UseTasksParams>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [isRestoring, setIsRestoring] = useState(false)
  const [assignedUser, setAssignedUser] = useState<UserResource | null>(null)

  // Build final filters with deleted=true
  const finalFilters: UseTasksParams = useMemo(() => {
    return {
      ...filters,
      deleted: true,
      page: currentPage,
    }
  }, [filters, currentPage])

  // Fetch deleted tasks
  const { tasks, meta, isLoading, error, mutate } = useTasks(finalFilters, {
    enabled: open,
  })

  const { restoreTask } = useTaskActions()

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setFilters({})
      setCurrentPage(1)
      setAssignedUser(null)
    }
  }, [open])

  const handleRestore = async (task: TaskResource) => {
    setIsRestoring(true)
    try {
      await restoreTask({ id: task.id })
      mutate() // Refresh deleted tasks list
    } catch (error) {
      // Error handling is done by useTaskActions hook via toast
    } finally {
      setIsRestoring(false)
    }
  }

  const handleFiltersChange = useCallback((newFilters: UseTasksParams) => {
    setFilters((prevFilters) => {
      // Only update if filters actually changed
      const filtersChanged = JSON.stringify(prevFilters) !== JSON.stringify(newFilters)
      return filtersChanged ? newFilters : prevFilters
    })
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filters.search ||
      filters.status ||
      filters.priority ||
      filters.overdue !== undefined ||
      filters.from ||
      filters.to ||
      filters.filter_field
    )
  }, [filters])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl max-h-[94vh] min-h-[90vh] overflow-hidden" dir="rtl">
        <DialogHeader className="bg-gradient-to-r from-red-500/10 via-red-500/10 to-red-500/10 dark:from-red-500/30 dark:via-red-500/30 dark:to-red-500/30 -mx-6 -mt-8 px-6 py-4 border-b border-red-500/20 h-[70px] flex justify-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg border border-red-400/30">
                <Trash2 className="h-5 w-5 text-white drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-600 via-red-600/90 to-red-600 bg-clip-text text-transparent">
                  المهام المحذوفة
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                  عرض واستعادة المهام المحذوفة
                </DialogDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 -mt-[20px]">
          {/* Filters */}
          <div className="pt-4">
            <DeletedTasksFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isLoading={isLoading}
              assignedUser={assignedUser}
              onAssignedUserChange={setAssignedUser}
            />
          </div>

          {/* View Toggle and Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="gap-2"
              >
                <Grid3x3 className="h-4 w-4" />
                كروت
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="gap-2"
              >
                <TableIcon className="h-4 w-4" />
                جدول
              </Button>
            </div>
            {meta && (
              <Badge 
                variant="outline" 
                className="text-sm bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 px-3 py-1.5 font-semibold"
              >
                <Trash2 className="h-3.5 w-3.5 ml-1.5" />
                {meta.total} مهمة محذوفة
              </Badge>
            )}
          </div>

          {/* Content */}
          <ScrollArea className="h-[calc(92vh-350px)] pr-1">
            {isLoading ? (
              <div className="space-y-4">
                {viewMode === "cards" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="border-2 border-primary/20 dark:border-primary/40 rounded-xl p-4 space-y-3">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                )}
              </div>
            ) : error ? (
              <ErrorState
                message={error.message}
                onRetry={() => mutate()}
                isRetrying={isLoading}
              />
            ) : !tasks || tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-red-500/20 dark:bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
                  <Trash2 className="relative h-16 w-16 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                  {hasActiveFilters
                    ? "لا توجد مهام محذوفة مطابقة للفلتر"
                    : "لا توجد مهام محذوفة"}
                </p>
              </div>
            ) : viewMode === "cards" ? (
              <DeletedTasksCardsView
                tasks={tasks}
                meta={meta}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
                isRestoring={isRestoring}
                onRestore={handleRestore}
              />
            ) : (
              <DeletedTasksTableView
                tasks={tasks}
                meta={meta}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
                isRestoring={isRestoring}
                onRestore={handleRestore}
              />
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
