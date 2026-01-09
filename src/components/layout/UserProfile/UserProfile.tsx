"use client"

/**
 * UserProfile - User profile section in sidebar
 * 
 * Responsibilities:
 * - Display user avatar (circular with beautiful shadow and blur)
 * - Display user name
 * - Display user role badge with icon and color
 * 
 * Rules:
 * - UI only - no auth logic
 * - No hooks
 * - No API calls
 * - Static user data (passed as props)
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { roleConfig, type UserRole } from "./roleConfig"

export interface UserProfileProps {
  /**
   * User name (mock data)
   */
  name?: string
  
  /**
   * User avatar URL (optional)
   */
  avatar?: string | null
  
  /**
   * User role (mock data)
   * Based on API: "admin" | "department"
   */
  role?: UserRole
  
  /**
   * Optional className
   */
  className?: string
}

export function UserProfile({
  name = "أحمد محمد",
  avatar = null,
  role = "admin",
  className,
}: UserProfileProps) {
  const config = roleConfig[role]
  const RoleIcon = config.icon

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 p-6 border-b border-sidebar-border",
        className
      )}
    >
      {/* Avatar with beautiful shadow and blur effect */}
      <div className="relative group">
        {/* Glow effect on hover with blur */}
        <div className="absolute inset-0 rounded-full bg-primary/30 dark:bg-primary/40 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-125" />
        
        {/* Beautiful shadow with blur - multiple layers */}
        <div className="absolute inset-0 rounded-full">
          {/* Outer shadow layer */}
          <div className="absolute inset-[-4px] rounded-full bg-primary/20 dark:bg-primary/30 blur-md opacity-60" />
          {/* Inner shadow layer */}
          <div className="absolute inset-[-2px] rounded-full bg-primary/10 dark:bg-primary/20 blur-sm opacity-80" />
        </div>
        
        {/* Shadow ring that intensifies on hover */}
        <div className="absolute inset-0 rounded-full ring-2 ring-primary/30 dark:ring-primary/40 group-hover:ring-primary/50 dark:group-hover:ring-primary/60 transition-all duration-500 shadow-[0_8px_32px_rgba(5,66,57,0.25)] dark:shadow-[0_8px_32px_rgba(143,201,188,0.3)] group-hover:shadow-[0_12px_48px_rgba(5,66,57,0.35)] dark:group-hover:shadow-[0_12px_48px_rgba(143,201,188,0.4)]" />
        
        {/* Avatar */}
        <Avatar className="relative h-20 w-20 ring-2 ring-sidebar-border group-hover:ring-primary/60 dark:group-hover:ring-primary/50 transition-all duration-500 group-hover:scale-105 cursor-pointer z-10">
          {avatar ? (
            <AvatarImage src={avatar} alt={name} />
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      {/* User Name */}
      <div className="text-center">
        <h3 className="text-sm font-semibold text-sidebar-foreground">{name}</h3>
      </div>

      {/* Role Badge with hover effect - rounded rectangle like the image */}
      <div
        className={cn(
          "group/badge flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer",
          "shadow-sm group-hover/badge:shadow-md",
          config.bgColor,
          config.hoverBgColor
        )}
      >
        <RoleIcon className={cn("h-4 w-4 transition-transform duration-300 group-hover/badge:scale-110", config.iconColor)} />
        <span className={cn("text-xs font-medium", config.textColor)}>
          {config.label}
        </span>
      </div>
    </div>
  )
}
