/**
 * Menu Items Configuration
 * 
 * Defines static menu items for sidebar navigation
 * Separated from UI component for clean architecture
 */

import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  User, 
  Settings 
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface MenuItem {
  id: string
  label: string
  icon: LucideIcon
  href: string
  badge?: number
}

/**
 * Static menu items configuration
 */
export const menuItems: readonly MenuItem[] = [
  {
    id: "dashboard",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    href: "/dashboard",
    badge: undefined,
  },
  {
    id: "users",
    label: "المستخدمون",
    icon: Users,
    href: "/dashboard/users",
    badge: undefined,
  },
  {
    id: "tasks",
    label: "المهام",
    icon: ClipboardList,
    href: "/dashboard/tasks",
    badge: undefined,
  },
  {
    id: "profile",
    label: "البروفايل",
    icon: User,
    href: "/dashboard/profile",
    badge: undefined,
  },
  {
    id: "settings",
    label: "الإعدادات",
    icon: Settings,
    href: "/dashboard/settings",
    badge: undefined,
  },
] as const
