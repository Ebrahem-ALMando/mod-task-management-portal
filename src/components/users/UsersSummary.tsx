"use client"

/**
 * UsersSummary - Summary statistics cards for users
 * 
 * Responsibilities:
 * - Display user statistics in summary cards
 * - Use SummaryCards component
 * - Pass theme to SummaryCards
 * 
 * Rules:
 * - UI only - no logic
 */

import { useState, useEffect } from "react"
import { SummaryCards, type SummaryCard } from "@/components/ui/summary-cards"
import { getThemeById, summaryCardsThemes, type Theme } from "@/components/ui/summary-cards-themes"
import { Users, UserCheck, UserX, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Palette, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UsersSummaryStats {
  total: number
  active: number
  inactive: number
  admin: number
  // department: number
  activePercentage: number
  inactivePercentage: number
  adminPercentage: number
  // departmentPercentage: number
}

export interface UsersSummaryProps {
  stats: UsersSummaryStats
  isLoading?: boolean
}

export function UsersSummary({ stats, isLoading }: UsersSummaryProps) {
  // Load theme from localStorage or use default
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('users-summary-theme')
      return savedTheme || 'default'
    }
    return 'default'
  })
  const [isThemeOpen, setIsThemeOpen] = useState(false)

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('users-summary-theme', selectedTheme)
    }
  }, [selectedTheme])

  const currentTheme = getThemeById(selectedTheme)

  const cards: SummaryCard[] = [
    {
      title: "إجمالي المستخدمين",
      value: stats.total,
      icon: Users,
      colorKey: "primary",
      showPercentage: false,
      showProgress: false,
    },
    {
      title: "المستخدمين النشطين",
      value: stats.active,
      icon: UserCheck,
      colorKey: "success",
      percentage: stats.activePercentage,
      showPercentage: true,
      showProgress: true,
    },
    {
      title: "المستخدمين غير النشطين",
      value: stats.inactive,
      icon: UserX,
      colorKey: "warning",
      percentage: stats.inactivePercentage,
      showPercentage: true,
      showProgress: true,
    },
    {
      title: "مديري النظام",
      value: stats.admin,
      icon: Crown,
      colorKey: "info",
      percentage: stats.adminPercentage,
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
                          localStorage.setItem('users-summary-theme', theme.id)
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
