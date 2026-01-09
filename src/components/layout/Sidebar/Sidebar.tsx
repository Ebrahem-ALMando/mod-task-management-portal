"use client"

/**
 * Sidebar - Dashboard sidebar navigation
 * 
 * Responsibilities:
 * - Display navigation menu items
 * - Show active state (UI only)
 * - Toggle open/close state
 * 
 * Rules:
 * - UI only - no routing logic
 * - No API calls
 * - Static menu items from config
 */

import { useState } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { SidebarItem } from "../SidebarItem"
import { UserProfile } from "../UserProfile"
import { menuItems } from "./menuItems"
import { cn } from "@/lib/utils"

export interface SidebarProps {
  /**
   * Currently active route (for UI state only)
   */
  activeRoute?: string
  
  /**
   * Whether sidebar is open
   */
  isOpen?: boolean
  
  /**
   * Toggle sidebar open/close
   */
  onToggle?: () => void
  
  /**
   * Optional className
   */
  className?: string
}

export function Sidebar({ 
  activeRoute = "dashboard", 
  isOpen = true,
  onToggle,
  className 
}: SidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(true)
  
  // Use controlled state if provided, otherwise use internal state
  const sidebarIsOpen = isOpen !== undefined ? isOpen : internalIsOpen
  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setInternalIsOpen(!internalIsOpen)
    }
  }

  return (
    <>
      {/* Toggle Button - Always visible */}
      {/* <button
        onClick={handleToggle}
        className={cn(
          "fixed top-4 z-[60] p-3 rounded-lg transition-all duration-300",
          "bg-sidebar border-2 border-primary/30 dark:border-[#E2C992]/30 shadow-lg",
          "hover:bg-primary/10 dark:hover:bg-[#E2C992]/10",
          "hover:border-primary dark:hover:border-[#E2C992]",
          "hover:shadow-xl hover:scale-105",
          "active:scale-95",
          "text-primary dark:text-[#E2C992]",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          sidebarIsOpen ? "right-[272px]" : "right-4"
        )}
        aria-label={sidebarIsOpen ? "إغلاق القائمة" : "فتح القائمة"}
        type="button"
      >
        {sidebarIsOpen ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button> */}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-screen bg-sidebar border-l border-sidebar-border z-40",
          "flex flex-col transition-all duration-300 ease-in-out",
          sidebarIsOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full overflow-hidden",
          className
        )}
      >
        {/* User Profile Section */}
        {sidebarIsOpen && <UserProfile name="أحمد محمد" role="admin" />}

        {/* Navigation Menu */}
        {sidebarIsOpen && (
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeRoute === item.id}
                badge={item.badge}
                onClick={() => {
                  // UI only - no routing logic
                  // This will be handled by parent component or router
                }}
              />
            ))}
          </nav>
        )}
      </aside>
    </>
  )
}
