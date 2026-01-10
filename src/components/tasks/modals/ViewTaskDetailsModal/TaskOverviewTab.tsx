"use client"

/**
 * TaskOverviewTab - Overview tab component for task details
 * 
 * Responsibilities:
 * - Display task header with title, description, status, and priority
 * - Display task information (due date, created date, assigned to, created by)
 * 
 * Rules:
 * - UI only - no business logic
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Calendar, User, Clock } from "lucide-react"
import { formatDateInArabic, getDaysBetween, formatDaysRemaining } from "@/lib/utils/date"
import { getRelativeTime } from "@/lib/utils/formatRelativeTime"
import { cn } from "@/lib/utils"
import { statusConfig, priorityConfig } from "./constants"
import { getInitials } from "./utils"
import type { TaskResource } from "@/features/tasks"

export interface TaskOverviewTabProps {
  task: TaskResource | null
}

export function TaskOverviewTab({ task }: TaskOverviewTabProps) {
  if (!task) return null

  const statusInfo = statusConfig[task.status]
  const StatusIcon = statusInfo.icon
  const priorityInfo = priorityConfig[task.priority]
  const isOverdue = new Date(task.due_date) < new Date() && task.status !== "completed" && task.status !== "cancelled"

  return (
    <div className="space-y-6">
      {/* Task Header Card */}
      <Card className="border-2 border-primary/20 dark:border-primary/40">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-primary dark:text-[#E2C992] mb-2">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={cn("px-3 py-1", statusInfo.bgColor)}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusInfo.label}
              </Badge>
              <Badge
                variant="outline"
                className={cn("px-3 py-1", priorityInfo.color)}
              >
                {priorityInfo.label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Information */}
      <Card className="border-2 border-primary/20 dark:border-primary/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary dark:text-[#E2C992]">
            <div className="p-1.5 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
              <FileText className="h-4 w-4 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.5)]" />
            </div>
            معلومات المهمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
              <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                <Calendar className={cn(
                  "h-5 w-5",
                  isOverdue ? "text-red-600 dark:text-red-400" : "text-primary dark:text-[#E2C992]"
                )} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">تاريخ الاستحقاق</p>
                <p className={cn(
                  "text-gray-900 dark:text-white font-medium",
                  isOverdue && "text-red-600 dark:text-red-400"
                )}>
                  {formatDateInArabic(new Date(task.due_date))}
                </p>
                {(() => {
                  const daysRemaining = getDaysBetween(new Date(task.due_date), new Date())
                  return (
                    <p className={cn(
                      "text-xs mt-1 font-medium",
                      daysRemaining < 0 
                        ? "text-red-600 dark:text-red-400" 
                        : daysRemaining === 0
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-green-600 dark:text-green-400"
                    )}>
                      {daysRemaining < 0 
                        ? `متأخرة ${Math.abs(daysRemaining)} يوم` 
                        : formatDaysRemaining(daysRemaining)
                      }
                    </p>
                  )
                })()}
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
              <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                <Clock className="h-5 w-5 text-primary dark:text-[#E2C992]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">تاريخ الإنشاء</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDateInArabic(new Date(task.created_at))}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {getRelativeTime(task.created_at)}
                </p>
              </div>
            </div>

            {/* Assigned To */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
              <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                <User className="h-5 w-5 text-primary dark:text-[#E2C992]" />
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20 dark:ring-primary/40">
                  {task.assigned_to.avatar_url ? (
                    <AvatarImage src={task.assigned_to.avatar_url} alt={task.assigned_to.name} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs">
                      {getInitials(task.assigned_to.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">المسند إليه</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {task.assigned_to.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Created By */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
              <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                <User className="h-5 w-5 text-primary dark:text-[#E2C992]" />
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20 dark:ring-primary/40">
                  {task.created_by.avatar_url ? (
                    <AvatarImage src={task.created_by.avatar_url} alt={task.created_by.name} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs">
                      {getInitials(task.created_by.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">أنشأها</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {task.created_by.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
