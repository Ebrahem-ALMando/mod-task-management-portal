"use client"

/**
 * SidebarItem - Individual sidebar menu item
 * 
 * Responsibilities:
 * - Display menu item with icon and label
 * - Show active state (UI only)
 * 
 * Rules:
 * - UI only - no routing logic
 * - No hooks
 * - No API calls
 */

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface SidebarItemProps {
  /**
   * Icon component from lucide-react
   */
  icon: LucideIcon
  
  /**
   * Label text
   */
  label: string
  
  /**
   * Whether this item is active
   */
  isActive?: boolean
  
  /**
   * Optional badge count
   */
  badge?: number
  
  /**
   * Click handler (optional)
   */
  onClick?: () => void
}

export function SidebarItem({
  icon: Icon,
  label,
  isActive = false,
  badge,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full flex items-center gap-3 px-4 py-3 rounded-lg",
        "transition-all duration-300 ease-out text-right cursor-pointer",
        "hover:translate-x-[-4px] hover:shadow-md",
        isActive
          ? "bg-primary/20 dark:bg-[#E2C992]/20 text-primary dark:text-[#E2C992] font-medium shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Active indicator bar - Green in light mode, Gold in dark mode */}
      {isActive && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary dark:bg-[#E2C992] rounded-l-full" />
      )}

      {/* Icon with hover effect - Green in light mode, Gold in dark mode */}
      <div
        className={cn(
          "relative flex items-center justify-center shrink-0",
          "transition-all duration-300",
          isActive
            ? "text-primary dark:text-[#E2C992]"
            : "text-sidebar-foreground group-hover:text-primary dark:group-hover:text-[#E2C992]"
        )}
      >
        {/* Icon glow on hover - Green in light, Gold in dark */}
        <div className="absolute inset-0 rounded-lg bg-primary/20 dark:bg-[#E2C992]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Icon className="relative h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* Label */}
      <span className="flex-1 text-sm transition-colors duration-300">{label}</span>

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium bg-primary dark:bg-[#E2C992] text-primary-foreground dark:text-[#032d23] shadow-sm group-hover:shadow-md transition-shadow duration-300">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  )
}
