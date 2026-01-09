"use client"

/**
 * Dashboard Layout - Route group layout
 * 
 * Responsibilities:
 * - Wrap dashboard pages with DashboardLayout
 * - Provide layout structure
 * 
 * Rules:
 * - UI only - no logic
 * - No hooks
 * - No API calls
 */

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { usePathname } from "next/navigation"

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Determine active route from pathname (UI only)
  const getActiveRoute = () => {
    if (pathname === "/" || pathname === "/dashboard") return "dashboard"
    if (pathname.startsWith("/users")) return "users"
    if (pathname.startsWith("/tasks")) return "tasks"
    if (pathname.startsWith("/profile")) return "profile"
    if (pathname.startsWith("/settings")) return "settings"
    return "dashboard"
  }

  // Get page title from pathname (UI only)
  const getPageTitle = () => {
    if (pathname === "/" || pathname === "/dashboard") return "لوحة التحكم"
    if (pathname.startsWith("/users")) return "المستخدمون"
    if (pathname.startsWith("/tasks")) return "المهام"
    if (pathname.startsWith("/profile")) return "البروفايل"
    if (pathname.startsWith("/settings")) return "الإعدادات"
    return "لوحة التحكم"
  }

  return (
    <DashboardLayout
      pageTitle={getPageTitle()}
      activeRoute={getActiveRoute()}
    >
      {children}
    </DashboardLayout>
  )
}
