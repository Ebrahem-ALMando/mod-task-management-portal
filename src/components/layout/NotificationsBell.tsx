"use client"

/**
 * NotificationsBell - Notification bell icon component
 * 
 * Responsibilities:
 * - Display notification bell icon
 * - Show badge count (UI only)
 * 
 * Rules:
 * - UI only - no notification logic
 * - No hooks
 * - No API calls
 * - Static badge count
 */

import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NotificationsBellProps {
  /**
   * Badge count (mock data)
   */
  count?: number
  
  /**
   * Optional className
   */
  className?: string
  
  /**
   * Click handler (optional)
   */
  onClick?: () => void
}

export function NotificationsBell({ 
  count = 3, 
  className,
  onClick 
}: NotificationsBellProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "cursor-pointer relative p-2 rounded-lg transition-colors mt-1 ",
        "hover:bg-secondary hover:text-secondary-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      aria-label={`الإشعارات${count > 0 ? ` (${count} غير مقروء)` : ""}`}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="text-[#f8f6f2] absolute top-0 left-0 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-medium bg-destructive text-destructive-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  )
}
