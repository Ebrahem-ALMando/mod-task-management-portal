"use client"

/**
 * Header - Dashboard header component
 * 
 * Responsibilities:
 * - Display page title with icon (right side)
 * - Display date below title (right side)
 * - Display ministry logo and titles (center)
 * - Display notifications, theme toggle, connection status (left side)
 * 
 * Rules:
 * - UI only - no auth logic
 * - Uses usePathname to get current page
 * - No API calls
 * - Dynamic page title based on route
 * - Logic delegated to helper files
 */

import { usePathname } from "next/navigation"
import { NotificationsBell } from "../NotificationsBell"
import ThemeToggle from "@/components/status/ThemeToggle"
import OfflineIndicator from "@/components/status/OfflineIndicator/OfflineIndicator"
import Logo from "@/components/branding/Logo"
import MinistryTitle from "@/components/branding/MinistryTitle"
import { getPageInfo } from "./helpers"
import { formatDateInArabic } from "@/lib/utils/date"
import { cn } from "@/lib/utils"

export interface HeaderProps {
  /**
   * Page title (optional, auto-detected from pathname if not provided)
   */
  title?: string
  
  /**
   * Page icon (optional, auto-detected from pathname if not provided)
   */
  icon?: React.ComponentType<{ className?: string }>
  
  /**
   * Optional className
   */
  className?: string
}

export function Header({ 
  title,
  icon,
  className 
}: HeaderProps) {
  const pathname = usePathname()
  
  // Get page info from pathname
  const pageInfo = getPageInfo(pathname)
  const displayTitle = title || pageInfo.title
  const Icon = icon || pageInfo.icon

  return (
    <header
      className={cn(
        "sticky top-0  w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
        className
      )}
    >
      <div className="flex h-20 md:h-24 items-center justify-between px-4 md:px-6">
        {/* Right Side - Page Title with Icon and Date */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">
              {displayTitle}
            </h1>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            {formatDateInArabic()}
          </p>
        </div>

        {/* Center - Logo and Titles */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 px-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Logo size="sm" />
            <div className="flex flex-col items-center gap-0.5">
              <MinistryTitle className="h-5 md:h-6" />
              <div className="qomra-header-text  text-xs md:text-xl text-muted-foreground text-center">
                نظام إدارة المهام
              </div>
            </div>
          </div>
        </div>

        {/* Left Side - Notifications, Theme, Connection Status */}
        <div className="flex items-center gap-2 ">
          <NotificationsBell count={3} />
          <ThemeToggle />
          <OfflineIndicator />
        </div>
      </div>
    </header>
  )
}
