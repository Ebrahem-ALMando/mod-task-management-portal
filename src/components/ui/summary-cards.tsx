"use client"

/**
 * SummaryCards - Reusable summary cards component
 * 
 * Responsibilities:
 * - Display summary statistics in card grid
 * - Support up to 8 cards
 * - Custom icons and colors
 * - Loading states
 * - Beautiful hover effects and golden accents
 * 
 * Rules:
 * - UI only - no logic
 * - Generic and reusable
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { Theme, ThemeColorSet } from "./summary-cards-themes"
import { defaultTheme } from "./summary-cards-themes"

export interface SummaryCard {
  /**
   * Card title
   */
  title: string
  
  /**
   * Card value (number or string)
   */
  value: number | string
  
  /**
   * Card icon
   */
  icon: LucideIcon
  
  /**
   * Optional description
   */
  description?: string
  
  /**
   * Optional badge text
   */
  badge?: string
  
  /**
   * Optional percentage (for progress display)
   */
  percentage?: number | string | null
  
  /**
   * Whether to show percentage badge
   */
  showPercentage?: boolean
  
  /**
   * Whether to show progress bar
   */
  showProgress?: boolean
  
  /**
   * Color key for theme (primary, success, warning, danger, info, secondary, accent, muted)
   */
  colorKey?: "primary" | "success" | "warning" | "danger" | "info" | "secondary" | "accent" | "muted"
  
  /**
   * Custom className (optional)
   */
  className?: string
}

export interface SummaryCardsProps {
  /**
   * Array of summary cards (max 8)
   */
  cards: SummaryCard[]
  
  /**
   * Loading state
   */
  isLoading?: boolean
  
  /**
   * Optional className
   */
  className?: string
  
  /**
   * Theme to use (optional, defaults to defaultTheme)
   */
  theme?: Theme
}

export function SummaryCards({
  cards,
  isLoading = false,
  className,
  theme = defaultTheme,
}: SummaryCardsProps) {
  // Limit to 8 cards max
  const displayCards = cards.slice(0, 8)

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn("grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", className)}>
        {Array.from({ length: Math.min(displayCards.length || 4, 8) }).map((_, i) => (
          <Card key={i} className="animate-pulse border-0 shadow-md dark:shadow-gray-900/10">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (displayCards.length === 0) {
    return null
  }

  return (
    <div className={cn("grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {displayCards.map((card, index) => {
        const colorKey = card.colorKey || "primary"
        const colors = theme.colors[colorKey]
        const Icon = card.icon
        const percentage = card.percentage
        const showPercentage = card.showPercentage !== false && percentage !== null && percentage !== undefined
        const showProgress = card.showProgress !== false && percentage !== null && percentage !== undefined

        return (
          <Card
            key={index}
            className={cn(
              "overflow-hidden relative group transition-all duration-300 border-2 shadow-md",
              "hover:shadow-xl hover:scale-[1.02] dark:shadow-gray-900/10",
              "hover:border-[#fbbf24]/30 dark:hover:border-[#fbbf24]/20",
              `bg-gradient-to-br ${colors.bg} ${colors.bgDark}`,
              colors.border,
              card.className
            )}
          >
            {/* Golden gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-[#fbbf24]/5 to-transparent dark:from-white/5 dark:via-[#fbbf24]/10 dark:to-transparent pointer-events-none" />
            
            {/* Large background icon with golden effect */}
            <div className="absolute -left-4 -bottom-6 opacity-10 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110 group-hover:rotate-12">
              <div className="relative">
                <Icon className={cn("h-24 w-24 md:h-28 md:w-28", colors.icon)} />
                {/* Golden glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#fbbf24]/20 to-transparent blur-xl" />
              </div>
            </div>

            {/* Sparkles icon on hover */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles className="h-4 w-4 text-[#fbbf24] animate-pulse" />
            </div>

            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <div className="flex-1">
                <CardTitle className={cn("text-sm font-medium truncate", colors.text)}>
                  {card.title}
                </CardTitle>
                {card.badge && (
                  <Badge className={cn("mt-1 text-[10px] px-2 py-0.5 bg-[#fbbf24]/20 text-[#f59e0b] dark:bg-[#fbbf24]/10 dark:text-[#fcd34d] border-[#fbbf24]/30")}>
                    {card.badge}
                  </Badge>
                )}
              </div>
              <div className={cn(
                "rounded-xl p-2.5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6",
                "group-hover:shadow-lg group-hover:shadow-[#fbbf24]/20",
                `bg-gradient-to-br ${colors.iconBg}`,
                colors.icon,
                "shrink-0 shadow-sm border border-[#fbbf24]/20"
              )}>
                <Icon className="h-5 w-5 drop-shadow-[0_0_2px_rgba(251,191,36,0.3)]" />
              </div>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="flex items-end justify-between">
                <div className={cn("text-3xl font-bold transition-all group-hover:scale-105", colors.text)}>
                  {typeof card.value === "number"
                    ? card.value.toLocaleString("ar-EG")
                    : card.value}
                </div>
                
                {showPercentage && (
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs font-semibold px-2 py-0.5 border-2",
                        colors.icon,
                        `bg-gradient-to-br ${colors.iconBg}`,
                        "border-[#fbbf24]/30"
                      )}
                    >
                      {typeof percentage === "number" ? percentage.toFixed(1) : percentage}%
                    </Badge>
                    {index > 0 && index < 8 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span>من الكل</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Progress bar with golden glow */}
              {showProgress && (
                <div className="mt-3 h-1.5 bg-white/50 dark:bg-gray-800/50 rounded-full overflow-hidden relative">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000 relative",
                      `bg-gradient-to-r ${colors.iconBg}`
                    )}
                    style={{ width: `${Math.min(typeof percentage === "number" ? percentage : parseFloat(percentage as string) || 0, 100)}%` }}
                  >
                    {/* Golden glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fbbf24]/30 to-transparent animate-pulse" />
                  </div>
                </div>
              )}

              {/* Golden decorative line for first card */}
              {index === 0 && (
                <div className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-[#fbbf24]/40 to-transparent" />
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
