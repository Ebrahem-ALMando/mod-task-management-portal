"use client"

/**
 * UserTasksStatistics - Reusable component for displaying user tasks statistics
 * 
 * Responsibilities:
 * - Display user tasks statistics with icons and badges
 * - Show total assigned, completed, and incomplete tasks
 * 
 * Rules:
 * - UI only - no business logic
 * - Reusable across different components
 */

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ClipboardList, CheckCircle2, Clock, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserTasksStatistics as UserTasksStatisticsType } from "@/features/users/types/user.types"

export interface UserTasksStatisticsProps {
  statistics: UserTasksStatisticsType | null | undefined
  variant?: "default" | "compact" | "card"
  className?: string
}

export function UserTasksStatistics({
  statistics,
  variant = "default",
  className,
}: UserTasksStatisticsProps) {
  // Always show statistics even if null/undefined (will show 0s)
  const stats = statistics || {
    total_assigned: 0,
    completed: 0,
    incomplete: 0,
  }

  const completionRate = stats.total_assigned > 0
    ? Math.round((stats.completed / stats.total_assigned) * 100)
    : 0

  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
          >
            <ClipboardList className="w-3 h-3 ml-1" />
            {stats.total_assigned} مهام
          </Badge>
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
          >
            <CheckCircle2 className="w-3 h-3 ml-1" />
            {stats.completed} مكتملة
          </Badge>
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20"
          >
            <Clock className="w-3 h-3 ml-1" />
            {stats.incomplete} غير مكتملة
          </Badge>
        </div>
        {/* Completion Rate Progress Bar */}
        {stats.total_assigned > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">نسبة الإنجاز</span>
              <span className="text-xs font-semibold text-primary dark:text-[#E2C992]">
                {completionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  if (variant === "card") {
    return (
      <Card className={cn("border-2 border-primary/20 dark:border-primary/40", className)}>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
                <BarChart3 className="h-4 w-4 text-primary dark:text-[#E2C992]" />
              </div>
              <h4 className="font-semibold text-primary dark:text-[#E2C992]">إحصائيات المهام</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Total Assigned */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-500/20">
                <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                  <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-0.5">إجمالي المهام</p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    {stats.total_assigned}
                  </p>
                </div>
              </div>

              {/* Completed */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-500/20">
                <div className="p-2 rounded-lg bg-green-500/10 dark:bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400 mb-0.5">مكتملة</p>
                  <p className="text-lg font-bold text-green-900 dark:text-green-100">
                    {stats.completed}
                  </p>
                </div>
              </div>

              {/* Incomplete */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-500/20">
                <div className="p-2 rounded-lg bg-orange-500/10 dark:bg-orange-500/20">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mb-0.5">غير مكتملة</p>
                  <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                    {stats.incomplete}
                  </p>
                </div>
              </div>
            </div>

            {/* Completion Rate */}
            {stats.total_assigned > 0 && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">نسبة الإنجاز</span>
                  <span className="text-sm font-semibold text-primary dark:text-[#E2C992]">
                    {completionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 rounded-full"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
          <BarChart3 className="h-4 w-4 text-primary dark:text-[#E2C992]" />
        </div>
        <h4 className="font-semibold text-primary dark:text-[#E2C992]">إحصائيات المهام</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Assigned */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
          <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
            <ClipboardList className="h-5 w-5 text-primary dark:text-[#E2C992]" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">إجمالي المهام</p>
            <p className="text-gray-900 dark:text-white font-medium text-lg">
              {stats.total_assigned}
            </p>
          </div>
        </div>

        {/* Completed */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
          <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">مكتملة</p>
            <p className="text-gray-900 dark:text-white font-medium text-lg">
              {stats.completed}
            </p>
          </div>
        </div>

        {/* Incomplete */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
          <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
            <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">غير مكتملة</p>
            <p className="text-gray-900 dark:text-white font-medium text-lg">
              {stats.incomplete}
            </p>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      {stats.total_assigned > 0 && (
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">نسبة الإنجاز</span>
            <span className="text-sm font-semibold text-primary dark:text-[#E2C992]">
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
