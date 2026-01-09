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
 * - No hooks (except for date formatting)
 * - No API calls
 * - Static page title
 */

import { NotificationsBell } from "../NotificationsBell"
import ThemeToggle from "@/components/status/ThemeToggle"
import OfflineIndicator from "@/components/status/OfflineIndicator/OfflineIndicator"
import Logo from "@/components/branding/Logo"
import MinistryTitle from "@/components/branding/MinistryTitle"
import { LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

export interface HeaderProps {
  /**
   * Page title (static)
   */
  title?: string
  
  /**
   * Page icon (optional, defaults to LayoutDashboard)
   */
  icon?: React.ComponentType<{ className?: string }>
  
  /**
   * Optional className
   */
  className?: string
}

export function Header({ 
  title = "لوحة التحكم", 
  icon: Icon = LayoutDashboard,
  className 
}: HeaderProps) {
  // Format date in Arabic
  const formatDate = () => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return now.toLocaleDateString('ar-SA', options)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-[55] w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
        className
      )}
    >
      <div className="flex h-20 md:h-24 items-center justify-between px-4 md:px-6">
        {/* Right Side - Page Title with Icon and Date */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">
              {title}
            </h1>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            {formatDate()}
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
