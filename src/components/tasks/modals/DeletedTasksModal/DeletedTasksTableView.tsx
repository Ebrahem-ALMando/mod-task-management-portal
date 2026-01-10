"use client"

/**
 * DeletedTasksTableView - Display deleted tasks in table format
 * 
 * Responsibilities:
 * - Render tasks table
 * - Display restore button only
 * - Display pagination
 * 
 * Rules:
 * - UI only - no logic
 */

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDateInArabic } from "@/lib/utils/date"
import type { TaskResource, PaginationMeta } from "@/features/tasks"

export interface DeletedTasksTableViewProps {
  tasks: TaskResource[]
  meta?: PaginationMeta
  currentPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  isRestoring?: boolean
  onRestore: (task: TaskResource) => void
}

const statusConfig = {
  pending: { label: "معلقة", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" },
  in_progress: { label: "قيد التنفيذ", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
  completed: { label: "مكتملة", color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
  cancelled: { label: "ملغاة", color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
}

const priorityConfig = {
  low: { label: "منخفضة", color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20" },
  medium: { label: "متوسطة", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
  high: { label: "عالية", color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20" },
  urgent: { label: "عاجلة", color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
}

export function DeletedTasksTableView({
  tasks,
  meta,
  currentPage,
  onPageChange,
  isLoading,
  isRestoring,
  onRestore,
}: DeletedTasksTableViewProps) {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-medium">العنوان</th>
              <th className="px-4 py-3 text-center text-sm font-medium">الحالة</th>
              <th className="px-4 py-3 text-center text-sm font-medium">الأولوية</th>
              <th className="px-4 py-3 text-center text-sm font-medium">تاريخ الاستحقاق</th>
              <th className="px-4 py-3 text-center text-sm font-medium">المسند إلى</th>
              <th className="px-4 py-3 text-center text-sm font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const isOverdue = new Date(task.due_date) < new Date() && task.status !== "completed" && task.status !== "cancelled"
              const statusInfo = statusConfig[task.status]
              const priorityInfo = priorityConfig[task.priority]

              return (
                <tr key={task.id} className="border-t hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline" className={cn("px-3 py-1", statusInfo.color)}>
                      {statusInfo.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline" className={cn("px-3 py-1", priorityInfo.color)}>
                      {priorityInfo.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "text-sm",
                      isOverdue ? "text-red-600 dark:text-red-400 font-medium" : "text-muted-foreground"
                    )}>
                      {formatDateInArabic(new Date(task.due_date))}
                      {isOverdue && " (متأخرة)"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm">{task.assigned_to.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onRestore(task)}
                        disabled={isRestoring}
                        className="h-8 bg-green-600 hover:bg-green-700 text-white gap-2"
                      >
                        <RotateCw className="h-4 w-4" />
                        استعادة
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
