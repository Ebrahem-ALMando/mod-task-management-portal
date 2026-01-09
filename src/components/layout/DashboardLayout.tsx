"use client"

/**
 * DashboardLayout - Main dashboard layout component
 * 
 * Responsibilities:
 * - Grid layout with Sidebar and Header
 * - Content area for pages
 * - Responsive design
 * - RTL support
 * - Dark/Light mode support
 * 
 * Rules:
 * - UI only - no logic
 * - No hooks
 * - No API calls
 */

import { Sidebar } from "./Sidebar"
// import { Header } from "./Header"
import { Header } from "./Header/Header"
import { cn } from "@/lib/utils"
import { useState } from "react"

export interface DashboardLayoutProps {
  /**
   * Page title for header
   */
  pageTitle?: string
  
  /**
   * Active route for sidebar (UI state only)
   */
  activeRoute?: string
  
  /**
   * Main content
   */
  children: React.ReactNode
  
  /**
   * Optional className
   */
  className?: string
}

export function DashboardLayout({
  pageTitle = "لوحة التحكم",
  activeRoute = "dashboard",
  children,
  className,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className={cn("flex h-screen overflow-hidden bg-background dashboard-layout", className)}>
      {/* Sidebar */}
      <Sidebar 
        activeRoute={activeRoute} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area - adjusts based on sidebar state */}
      <div 
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out",
          isSidebarOpen ? "mr-64" : "mr-0"
        )}
      >
        {/* Header */}
        <Header title={pageTitle} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
