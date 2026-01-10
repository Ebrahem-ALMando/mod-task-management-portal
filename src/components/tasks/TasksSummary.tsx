"use client"

/**
 * TasksSummary - Summary statistics cards for tasks
 * 
 * Responsibilities:
 * - Display task statistics in summary cards
 * - Use SummaryCards component
 * - Pass theme to SummaryCards
 * 
 * Rules:
 * - UI only - no logic
 */

import { useState, useEffect } from "react"
import { SummaryCards, type SummaryCard } from "@/components/ui/summary-cards"
import { getThemeById, summaryCardsThemes, type Theme } from "@/components/ui/summary-cards-themes"
import { CheckSquare, Clock, CheckCircle2, XCircle, AlertCircle, Tag, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Palette, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TasksSummaryStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  cancelled: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
  pendingPercentage: number
  inProgressPercentage: number
  completedPercentage: number
  cancelledPercentage: number
  highPriorityPercentage: number
  mediumPriorityPercentage: number
  lowPriorityPercentage: number
}

export interface TasksSummaryProps {
  stats: TasksSummaryStats
  isLoading?: boolean
}

export function TasksSummary({ stats, isLoading }: TasksSummaryProps) {
  // Load theme from localStorage or use default
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('tasks-summary-theme')
      return savedTheme || 'default'
    }
    return 'default'
  })
  const [isThemeOpen, setIsThemeOpen] = useState(false)

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks-summary-theme', selectedTheme)
    }
  }, [selectedTheme])

  const currentTheme = getThemeById(selectedTheme)

  const cards: SummaryCard[] = [
    {
      title: "إجمالي المهام",
      value: stats.total,
      icon: CheckSquare,
      colorKey: "primary",
      showPercentage: false,
      showProgress: false,
    },
    {
      title: "المهام المعلقة",
      value: stats.pending,
      icon: Clock,
      colorKey: "warning",
      percentage: stats.pendingPercentage,
      showPercentage: true,
      showProgress: true,
    },
    {
      title: "قيد التنفيذ",
      value: stats.inProgress,
      icon: CheckCircle2,
      colorKey: "info",
      percentage: stats.inProgressPercentage,
      showPercentage: true,
      showProgress: true,
    },
    {
      title: "المكتملة",
      value: stats.completed,
      icon: CheckCircle2,
      colorKey: "success",
      percentage: stats.completedPercentage,
      showPercentage: true,
      showProgress: true,
    },
    {
      title: "الملغاة",
      value: stats.cancelled,
      icon: XCircle,
      colorKey: "danger",
      percentage: stats.cancelledPercentage,
      showPercentage: true,
      showProgress: true,
    },
    {
      title: "عالية الأولوية",
      value: stats.highPriority,
      icon: AlertCircle,
      colorKey: "danger",
      percentage: stats.highPriorityPercentage,
      showPercentage: true,
      showProgress: true,
    },
    {
      title: "متوسطة الأولوية",
      value: stats.mediumPriority,
      icon: Tag,
      colorKey: "info",
      percentage: stats.mediumPriorityPercentage,
      showPercentage: true,
      showProgress: true,
    },
    {
      title: "منخفضة الأولوية",
      value: stats.lowPriority,
      icon: Circle,
      colorKey: "secondary",
      percentage: stats.lowPriorityPercentage,
      showPercentage: true,
      showProgress: true,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Theme Selector */}
      <div className="flex items-center justify-end">
        <Popover open={isThemeOpen} onOpenChange={setIsThemeOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-primary/10 gap-2 border-primary/20 hover:border-primary/40 dark:border-primary/40 dark:hover:border-primary/60"
            >
              <Palette className="h-4 w-4 text-primary dark:text-primary" />
              <span className="text-sm font-medium text-primary dark:text-primary">
                تغيير الثيم
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-primary dark:text-primary" />
                <h4 className="font-semibold text-primary dark:text-primary">
                  اختر ثيم الألوان
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {summaryCardsThemes.map((theme) => {
                  const isSelected = selectedTheme === theme.id
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setSelectedTheme(theme.id)
                        setIsThemeOpen(false)
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('tasks-summary-theme', theme.id)
                        }
                      }}
                      className={cn(
                        "relative p-4 rounded-xl border-2 transition-all duration-200",
                        "hover:scale-105 hover:shadow-lg",
                        isSelected
                          ? "border-primary dark:border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="h-5 w-5 rounded-full bg-primary dark:bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {theme.name}
                        </div>
                        <div className="flex gap-1.5">
                          {theme.colors.primary.preview?.map((colorClass, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "h-6 w-6 rounded-full border-2 border-white dark:border-gray-800 shadow-sm",
                                colorClass
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Cards Grid */}
      <SummaryCards cards={cards} isLoading={isLoading} theme={currentTheme} />
    </div>
  )
}
