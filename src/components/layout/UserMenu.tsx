"use client"

/**
 * UserMenu - User menu component (Avatar + name)
 * 
 * Responsibilities:
 * - Display user avatar and name
 * - Show dropdown menu (UI only)
 * 
 * Rules:
 * - UI only - no auth logic
 * - No hooks
 * - No API calls
 * - Static user data
 */

import { useState } from "react"
import { User, LogOut, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export interface UserMenuProps {
  /**
   * User name (mock data)
   */
  name?: string
  
  /**
   * User avatar URL (optional)
   */
  avatar?: string | null
  
  /**
   * Optional className
   */
  className?: string
}

export function UserMenu({ 
  name = "المستخدم",
  avatar = null,
  className 
}: UserMenuProps) {
  const [open, setOpen] = useState(false)

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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
            "hover:bg-secondary hover:text-secondary-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
          )}
        >
          <Avatar className="h-8 w-8">
            {avatar ? (
              <img src={avatar} alt={name} />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(name)}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="hidden md:block text-sm font-medium">{name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">مستخدم النظام</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>البروفايل</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>الإعدادات</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
