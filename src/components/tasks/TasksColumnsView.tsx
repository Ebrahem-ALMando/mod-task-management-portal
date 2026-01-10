"use client"

/**
 * TasksColumnsView - Display tasks in Trello-like columns with drag and drop
 * 
 * Responsibilities:
 * - Render tasks in columns by status
 * - Handle drag and drop
 * - Display loading skeleton
 * - Display empty state
 * 
 * Rules:
 * - UI only - no logic
 * - Uses HTML5 Drag and Drop API
 */

import { useState, useRef } from "react"
import { TaskCard } from "./TaskCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CheckSquare as TaskIcon, Sparkles, Clock, PlayCircle, CheckCircle2, XCircle, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TaskResource } from "@/features/tasks"

const statusColumns = [
  { 
    id: "pending", 
    label: "معلقة", 
    icon: Clock,
    color: "border-yellow-500/30 dark:border-yellow-500/50",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    headerBgColor: "bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-950/30 dark:to-yellow-900/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  },
  { 
    id: "in_progress", 
    label: "قيد التنفيذ", 
    icon: PlayCircle,
    color: "border-blue-500/30 dark:border-blue-500/50",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    headerBgColor: "bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-950/30 dark:to-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  { 
    id: "completed", 
    label: "مكتملة", 
    icon: CheckCircle2,
    color: "border-green-500/30 dark:border-green-500/50",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    headerBgColor: "bg-gradient-to-r from-green-100 to-green-50 dark:from-green-950/30 dark:to-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
    badgeColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
  },
  { 
    id: "cancelled", 
    label: "ملغاة", 
    icon: XCircle,
    color: "border-red-500/30 dark:border-red-500/50",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    headerBgColor: "bg-gradient-to-r from-red-100 to-red-50 dark:from-red-950/30 dark:to-red-900/20",
    iconColor: "text-red-600 dark:text-red-400",
    badgeColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
  },
] as const

export interface TasksColumnsViewProps {
  tasks: TaskResource[]
  isLoading?: boolean
  onStatusChange?: (taskId: number, newStatus: "pending" | "in_progress" | "completed" | "cancelled") => Promise<void>
  isSubmitting?: boolean
  onEdit?: (task: TaskResource) => void
  onDelete?: (task: TaskResource) => void
  onChangeStatus?: (task: TaskResource, newStatus: "pending" | "in_progress" | "completed" | "cancelled") => void
  onViewDetails?: (task: TaskResource) => void
}

export function TasksColumnsView({
  tasks,
  isLoading,
  onStatusChange,
  isSubmitting,
  onEdit,
  onDelete,
  onChangeStatus,
  onViewDetails,
}: TasksColumnsViewProps) {
  const [draggedTask, setDraggedTask] = useState<TaskResource | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const dragCounterRef = useRef(0)

  // Group tasks by status
  const tasksByStatus = {
    pending: tasks.filter((t) => t.status === "pending"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    completed: tasks.filter((t) => t.status === "completed"),
    cancelled: tasks.filter((t) => t.status === "cancelled"),
  }

  const handleDragStart = (e: React.DragEvent, task: TaskResource) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", task.id.toString())
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5"
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1"
    }
    setDraggedTask(null)
    setDragOverColumn(null)
    dragCounterRef.current = 0
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(columnId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    dragCounterRef.current--
    if (dragCounterRef.current <= 0) {
      setDragOverColumn(null)
    }
  }

  const handleDragEnter = () => {
    dragCounterRef.current++
  }

  const handleDrop = async (e: React.DragEvent, columnId: "pending" | "in_progress" | "completed" | "cancelled") => {
    e.preventDefault()
    dragCounterRef.current = 0
    setDragOverColumn(null)

    if (!draggedTask || draggedTask.status === columnId) {
      setDraggedTask(null)
      return
    }

    // Call status change handler
    if (onStatusChange) {
      await onStatusChange(draggedTask.id, columnId)
    }

    setDraggedTask(null)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusColumns.map((column) => (
          <Card key={column.id} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
                ))}
              </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusColumns.map((column) => {
        const columnTasks = tasksByStatus[column.id]
        const isDragOver = dragOverColumn === column.id

        return (
          <Card
            key={column.id}
            className={cn(
              "flex flex-col h-[calc(100vh-300px)] min-h-[600px] max-h-[calc(100vh-200px)] overflow-hidden",
              column.color,
              isDragOver && "ring-2 ring-primary ring-offset-2"
            )}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDragEnter={handleDragEnter}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <CardHeader className={cn("pb-3 border-b shrink-0", column.headerBgColor)}>
              <CardTitle className="text-lg font-semibold flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <column.icon className={cn("h-5 w-5", column.iconColor)} />
                  <span className={cn("font-semibold", column.iconColor)}>{column.label}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn("text-sm font-semibold px-3 py-1", column.badgeColor)}
                >
                  {columnTasks.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-hidden min-h-0">
              <ScrollArea className="h-full">
                <div className="space-y-3 pr-2">
                  {columnTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <div className="relative mb-4">
                        {/* Animated icon with glow effect */}
                        <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full blur-xl animate-pulse"></div>
                        <Inbox 
                          className="relative h-12 w-12 text-gray-400 dark:text-gray-500 animate-bounce"
                          strokeWidth={1.5}
                        />
                        {/* Floating particles effect */}
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-primary/40 rounded-full animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 h-1.5 w-1.5 bg-primary/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        لا توجد مهام في هذه الحالة
                      </p>
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "transition-all duration-200",
                          draggedTask?.id === task.id && "opacity-50"
                        )}
                      >
                        <TaskCard
                          task={task}
                          isDragging={draggedTask?.id === task.id}
                          disableHoverScale={true}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onChangeStatus={onChangeStatus}
                          onViewDetails={onViewDetails}
                        />
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
