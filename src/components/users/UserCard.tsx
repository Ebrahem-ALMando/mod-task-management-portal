"use client"

/**
 * UserCard - Individual user card component
 * 
 * Responsibilities:
 * - Display user information in card format with advanced styling
 * - Show avatar, name, role, status
 * - Action buttons as icons
 * 
 * Rules:
 * - UI only - no logic
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { roleConfig } from "@/components/layout/UserProfile/roleConfig"
import { formatDateInArabic } from "@/lib/utils/date"
import { 
  Edit, 
  Trash2, 
  Power, 
  PowerOff, 
  FileText,
  Calendar,
  Activity,
  Sparkles,
  User as UserIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getRelativeTime } from "@/lib/utils/formatRelativeTime"
import { UserTasksStatistics } from "./UserTasksStatistics"
import type { UserResource } from "@/features/users"

export interface UserCardProps {
  user: UserResource
  onEdit?: (user: UserResource) => void
  onDelete?: (user: UserResource) => void
  onToggleStatus?: (user: UserResource) => void
  onViewDetails?: (user: UserResource) => void
}

export function UserCard({ 
  user,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
}: UserCardProps) {
  const roleConfigItem = roleConfig[user.role]
  const RoleIcon = roleConfigItem.icon
  const isActive = user.is_active

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Format date
 

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "group overflow-hidden transition-all duration-500 hover:shadow-2xl dark:hover:shadow-gray-900/30 shadow-xl dark:shadow-gray-900/20 relative flex flex-col justify-between",
          isActive 
            ? "bg-gradient-to-br from-white via-primary/5 to-primary/10 dark:from-card dark:via-primary/20 dark:to-primary/20 hover:scale-105 border-2 border-primary/30 dark:border-primary/50" 
            : "bg-gradient-to-br from-white via-red-50/50 to-red-100/30 dark:from-card dark:via-red-950/20 dark:to-red-900/10 hover:scale-105 border-2 border-red-600/50"
        )}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full blur-xl transform translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#E2C992]/20 to-primary/30 rounded-full blur-lg transform -translate-x-8 translate-y-8"></div>
          {/* Wave pattern */}
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-primary/10 to-transparent dark:from-primary/20 transform rotate-180"></div>
          <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-primary/10 to-transparent dark:from-primary/20"></div>
        </div>

        {/* Status indicator */}
        <div className={cn(
          "absolute top-3 right-3 w-3 h-3 rounded-full animate-pulse",
          isActive ? "bg-primary shadow-lg shadow-primary/50" : "bg-red-400 shadow-lg shadow-red-400/50"
        )} />

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-4 ring-primary/10 dark:ring-primary/30 group-hover:ring-primary/20 dark:group-hover:ring-primary/40 transition-all duration-300">
                  {user.avatar_url ? (
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isActive && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-[#E2C992] transition-colors duration-300">
                  {user.name}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  @{user.username}
                </span>
              </div>
            </div>
            <Badge
            variant="outline"
              className={cn(
                "px-3 py-1 w-[max-content] text-xs font-medium transition-all duration-300 transform group-hover:scale-110 absolute top-[5px] left-4",
                isActive
                  ? "bg-gradient-to-r from-primary/20 to-primary/30 text-primary group-hover:from-primary/30 group-hover:to-primary/40 shadow-lg shadow-primary/20 dark:shadow-primary/20 border-2 border-primary/50"
                  : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 group-hover:from-red-200 group-hover:to-pink-200 shadow-lg shadow-red-200/50 dark:shadow-red-900/20 border-2 border-red-600/50"
              )}
            >
              <Activity className="w-3 h-3 mr-1" />
              {isActive ? "نشط" : "غير نشط"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* Role Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium",
                  roleConfigItem.bgColor,
                  roleConfigItem.textColor
                )}
              >
                <RoleIcon className={cn("h-3.5 w-3.5", roleConfigItem.iconColor)} />
                <span>{roleConfigItem.label}</span>
              </div>
            </div>
          </div>

          {/* Last Login */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary dark:text-[#E2C992] group-hover:text-primary/80 dark:group-hover:text-[#E2C992]/80 transition-colors" />
              <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                {user.last_login_at ? formatDateInArabic(new Date(user.last_login_at)) : "لم يسجل دخول"}
              </span>
            </div>
          </div>

          {/* Tasks Statistics */}
          {user.tasks_statistics && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <UserTasksStatistics
                statistics={user.tasks_statistics}
                variant="compact"
              />
            </div>
          )}

          {/* Created Date and Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs text-muted-foreground group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
              {getRelativeTime(user.created_at)}
            </span>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-[#E2C992] transition-all duration-200 group-hover:scale-110"
                    onClick={() => onEdit?.(user)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>تعديل</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-[#E2C992] transition-all duration-200 group-hover:scale-110"
                    onClick={() => onToggleStatus?.(user)}
                  >
                    {isActive ? (
                      <PowerOff className="h-3 w-3" />
                    ) : (
                      <Power className="h-3 w-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isActive ? "إلغاء التنشيط" : "تنشيط"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#dca93b] hover:bg-[#E2C992]/10 hover:text-[#E2C992] dark:hover:bg-[#E2C992]/20 transition-all duration-200 group-hover:scale-110"
                    onClick={() => onViewDetails?.(user)}
                  >
                    <FileText className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>عرض التفاصيل</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200 group-hover:scale-110"
                    onClick={() => onDelete?.(user)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>حذف</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
