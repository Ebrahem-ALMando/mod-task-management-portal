"use client"

/**
 * TasksTableView - Display tasks in table format using DataTable
 * 
 * Responsibilities:
 * - Render tasks table using reusable DataTable component
 * - Display pagination
 * - Display action icons
 * 
 * Rules:
 * - UI only - no logic
 */

import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckSquare as TaskIcon, Edit, Trash2, RefreshCw, FileText } from "lucide-react"
import { TasksPagination } from "./TasksPagination"
import { cn } from "@/lib/utils"
import { formatDateInArabic } from "@/lib/utils/date"
import type { TaskResource, PaginationMeta } from "@/features/tasks"

const statusConfig = {
  pending: {
    label: "معلقة",
    bgColor: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  },
  in_progress: {
    label: "قيد التنفيذ",
    bgColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  completed: {
    label: "مكتملة",
    bgColor: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  },
  cancelled: {
    label: "ملغاة",
    bgColor: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  },
}

const priorityConfig = {
  low: {
    label: "منخفضة",
    color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  },
  medium: {
    label: "متوسطة",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  high: {
    label: "عالية",
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  },
  urgent: {
    label: "عاجلة",
    color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  },
}

export interface TasksTableViewProps {
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

export function TasksTableView({
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
}: TasksTableViewProps) {
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return formatDateInArabic(date)
  }

  // Calculate row number based on pagination
  const getRowNumber = (index: number) => {
    const perPage = meta?.per_page || 15
    return (currentPage - 1) * perPage + index + 1
  }

  // Check if task is overdue
  const isOverdue = (task: TaskResource) => {
    return new Date(task.due_date) < new Date() && task.status !== "completed" && task.status !== "cancelled"
  }

  // Define columns
  const columns: DataTableColumn<TaskResource>[] = [
    {
      key: "number",
      label: "#",
      width: "60px",
      align: "center",
      render: (task, index) => (
        <span className="text-sm font-medium text-muted-foreground">
          {getRowNumber(index)}
        </span>
      ),
    },
    {
      key: "title",
      label: "العنوان",
      render: (task) => (
        <div>
          <div className="font-medium">{task.title}</div>
          {task.description && (
            <div className="text-sm text-muted-foreground line-clamp-1">
              {task.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      align: "center",
      render: (task) => {
        const statusInfo = statusConfig[task.status]
        return (
          <Badge
            variant="outline"
            className={cn("px-3 py-1", statusInfo.bgColor)}
          >
            {statusInfo.label}
          </Badge>
        )
      },
    },
    {
      key: "priority",
      label: "الأولوية",
      align: "center",
      render: (task) => {
        const priorityInfo = priorityConfig[task.priority]
        return (
          <Badge
            variant="outline"
            className={cn("px-3 py-1", priorityInfo.color)}
          >
            {priorityInfo.label}
          </Badge>
        )
      },
    },
    {
      key: "assigned_to",
      label: "المسند إلى",
      align: "center",
      render: (task) => (
        <div className="flex items-center justify-center gap-2">
          <Avatar className="h-8 w-8 ring-2 ring-sidebar-border">
            {task.assigned_to.avatar_url ? (
              <AvatarImage src={task.assigned_to.avatar_url} alt={task.assigned_to.name} />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(task.assigned_to.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm">{task.assigned_to.name}</span>
        </div>
      ),
    },
    {
      key: "due_date",
      label: "تاريخ الاستحقاق",
      align: "center",
      render: (task) => (
        <span className={cn(
          "text-sm",
          isOverdue(task) ? "text-red-600 dark:text-red-400 font-medium" : "text-muted-foreground"
        )}>
          {formatDate(task.due_date)}
          {isOverdue(task) && " (متأخرة)"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "تاريخ الإنشاء",
      align: "center",
      render: (task) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(task.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "الإجراءات",
      width: "180px",
      align: "center",
      render: (task) => (
        <TooltipProvider>
          <div className="flex items-center justify-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-[#E2C992] transition-all duration-200"
                  onClick={() => onEdit?.(task)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>تعديل</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-all duration-200"
                  onClick={() => {
                    // Open modal to select status
                    onChangeStatus?.(task, task.status)
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>تغيير الحالة</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#dca93b] hover:bg-[#E2C992]/10 hover:text-[#E2C992] dark:hover:bg-[#E2C992]/20 transition-all duration-200"
                  onClick={() => onViewDetails?.(task)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>عرض التفاصيل</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200"
                  onClick={() => onDelete?.(task)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>حذف</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Table */}
      <DataTable
        columns={columns}
        data={tasks}
        isLoading={isLoading}
        emptyMessage="لا توجد مهام"
        emptyIcon={TaskIcon}
        getRowKey={(task) => task.id}
      />

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
