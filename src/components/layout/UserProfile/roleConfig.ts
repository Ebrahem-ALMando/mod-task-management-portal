/**
 * Role Configuration
 * 
 * Defines role types, labels, icons, and colors
 * Based on API Contract: roles are "admin" | "department"
 */

import { Crown, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type UserRole = "admin" | "department"

export interface RoleConfig {
  label: string
  icon: LucideIcon
  bgColor: string
  textColor: string
  iconColor: string
  hoverBgColor: string
}

/**
 * Role configuration with icon and colors matching visual identity
 * Based on API Contract: roles are "admin" | "department"
 */
export const roleConfig: Record<UserRole, RoleConfig> = {
  admin: {
    label: "مدير النظام",
    icon: Crown,
    bgColor: "bg-primary/10 dark:bg-primary/20",
    textColor: "text-primary dark:text-primary",
    iconColor: "text-primary dark:text-primary",
    hoverBgColor: "hover:bg-primary/15 dark:hover:bg-primary/25",
  },
  department: {
    label: "مستخدم",
    icon: Users,
    bgColor: "bg-[#B5985A]/10 dark:bg-[#E2C992]/20",
    textColor: "text-[#B5985A] dark:text-[#E2C992]",
    iconColor: "text-[#B5985A] dark:text-[#E2C992]",
    hoverBgColor: "hover:bg-[#B5985A]/15 dark:hover:bg-[#E2C992]/25",
  },
}
