"use client"

/**
 * StatusLogsTab - Status logs tab with professional tree design
 * 
 * Responsibilities:
 * - Display status logs in a timeline tree format
 * - Show numbered events with status transitions
 * 
 * Rules:
 * - UI only - no business logic
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { History, ArrowRight, ArrowLeft } from "lucide-react"
import { formatDateInArabic } from "@/lib/utils/date"
import { getRelativeTime } from "@/lib/utils/formatRelativeTime"
import { cn } from "@/lib/utils"
import { statusConfig } from "./constants"
import { getInitials } from "./utils"
import type { TaskResource } from "@/features/tasks"

export interface StatusLogsTabProps {
  task: TaskResource | null
}

export function StatusLogsTab({ task }: StatusLogsTabProps) {
  if (!task || !task.status_logs || task.status_logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full blur-xl animate-pulse"></div>
          <History className="relative h-16 w-16 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">لا يوجد سجل تغييرات</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Timeline Tree */}
      <div className="relative pr-8">
        {/* Vertical Line */}
        <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/60 to-primary/30 dark:from-primary/60 dark:via-primary/40 dark:to-primary/20"></div>

        <div className="space-y-6">
          {task.status_logs.reverse().map((log, index) => {
            const fromStatusInfo = log.from_status ? statusConfig[log.from_status as keyof typeof statusConfig] : null
            const toStatusInfo = statusConfig[log.to_status as keyof typeof statusConfig]
            const ToStatusIcon = toStatusInfo.icon

            return (
              <div key={log.id} className="relative flex items-start gap-4">
                {/* Timeline Node */}
                <div className="relative z-10 shrink-0">
                  <div className={cn(
                    "relative flex items-center justify-center h-10 w-10 rounded-full border-4 border-white dark:border-gray-900 shadow-lg",
                    toStatusInfo.bgColor
                  )}>
                    <ToStatusIcon className="h-5 w-5" />
                    {/* Number Badge */}
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-md border-2 border-white dark:border-gray-900">
                      {(task.status_logs?.length || 0) - index}
                    </div>
                  </div>
                </div>

                {/* Content Card */}
                <div className={cn(
                  "flex-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border-2 border-primary/20 dark:border-primary/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden",
                  "before:absolute before:right-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b",
                  toStatusInfo.bgColor.includes("yellow") && "before:from-yellow-500 before:to-yellow-400",
                  toStatusInfo.bgColor.includes("blue") && "before:from-blue-500 before:to-blue-400",
                  toStatusInfo.bgColor.includes("green") && "before:from-green-500 before:to-green-400",
                  toStatusInfo.bgColor.includes("red") && "before:from-red-500 before:to-red-400"
                )}>
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {fromStatusInfo ? (
                            <>
                              <Badge variant="outline" className={cn("text-xs", fromStatusInfo.bgColor)}>
                                {fromStatusInfo.label}
                              </Badge>
                              <ArrowLeft className="h-4 w-4 text-gray-400" />
                            </>
                          ) : (
                            <span className="text-xs text-gray-500 dark:text-gray-400">بداية المهمة</span>
                          )}
                          <Badge variant="outline" className={cn("text-xs font-semibold", toStatusInfo.bgColor)}>
                            {toStatusInfo.label}
                          </Badge>
                        </div>
                        {log.reason && (
                          <div className="mt-2 p-3 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg border-r-4 border-primary/30">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {log.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer - User and Time */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 ring-2 ring-primary/20 dark:ring-primary/40">
                          {log.changed_by.avatar_url ? (
                            <AvatarImage src={log.changed_by.avatar_url} alt={log.changed_by.name} />
                          ) : (
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                              {getInitials(log.changed_by.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {log.changed_by.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {getRelativeTime(log.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateInArabic(new Date(log.created_at))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
