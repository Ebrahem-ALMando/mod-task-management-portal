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
    badge: undefined,
  },
  {
    id: "users",
    label: "المستخدمون",
    icon: Users,
    badge: undefined,
  },
  {
    id: "tasks",
    label: "المهام",
    icon: ClipboardList,
    badge: undefined,
  },
  {
    id: "profile",
    label: "البروفايل",
    icon: User,
    badge: undefined,
  },
  {
    id: "settings",
    label: "الإعدادات",
    icon: Settings,
    badge: undefined,
  },
] as const
