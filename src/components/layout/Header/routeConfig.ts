/**
 * Header Route Configuration
 * 
 * Responsibilities:
 * - Define route-to-title mappings
 * - Define route-to-icon mappings
 * - Provide route information for Header component
 * 
 * Rules:
 * - Static configuration only
 * - No logic
 * - No side effects
 */

import { LayoutDashboard, Users, ClipboardList, User, Settings } from "lucide-react"
import type { LucideIcon } from "lucide-react"

/**
 * Route configuration interface
 */
export interface RouteConfig {
  title: string
  icon: LucideIcon
}

/**
 * Map route paths to page titles and icons
 */
export const routeConfig: Record<string, RouteConfig> = {
  "/dashboard": { title: "لوحة التحكم", icon: LayoutDashboard },
  "/dashboard/users": { title: "المستخدمون", icon: Users },
  "/dashboard/tasks": { title: "المهام", icon: ClipboardList },
  "/dashboard/profile": { title: "البروفايل", icon: User },
  "/dashboard/settings": { title: "الإعدادات", icon: Settings },
}

/**
 * Default route configuration (fallback)
 */
export const defaultRouteConfig: RouteConfig = {
  title: "لوحة التحكم",
  icon: LayoutDashboard,
}
