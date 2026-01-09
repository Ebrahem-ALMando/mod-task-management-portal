"use client"

/**
 * ViewUserDetailsModal - Modal for viewing user details
 * 
 * Responsibilities:
 * - Display comprehensive user information
 * - Show user profile, role, and account information
 * 
 * Rules:
 * - UI only - no business logic
 * - Read-only display
 */

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  UserCheck,
  UserX,
  AlertCircle,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDateInArabic } from "@/lib/utils/date"
import { getRelativeTime } from "@/lib/utils/formatRelativeTime"
import { roleConfig } from "@/components/layout/UserProfile/roleConfig"
import { cn } from "@/lib/utils"
import type { UserResource } from "@/features/users"

export interface ViewUserDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserResource | null
  isLoading?: boolean
}

// Generic empty state component
const EmptyTabState = ({
  icon: Icon,
  title,
  description,
  color = "amber",
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color?: "amber" | "blue" | "violet" | "rose" | "emerald" | "indigo"
}) => {
  const colorClasses = {
    amber: {
      bg: "from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20",
      bg2: "from-amber-200 to-orange-200 dark:from-amber-800/30 dark:to-orange-800/30",
      main: "from-amber-400 to-orange-500",
      dots: "bg-amber-400",
    },
    blue: {
      bg: "from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20",
      bg2: "from-blue-200 to-cyan-200 dark:from-blue-800/30 dark:to-cyan-800/30",
      main: "from-blue-400 to-cyan-500",
      dots: "bg-blue-400",
    },
    violet: {
      bg: "from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20",
      bg2: "from-violet-200 to-purple-200 dark:from-violet-800/30 dark:to-purple-800/30",
      main: "from-violet-400 to-purple-500",
      dots: "bg-violet-400",
    },
    rose: {
      bg: "from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20",
      bg2: "from-rose-200 to-pink-200 dark:from-rose-800/30 dark:to-pink-800/30",
      main: "from-rose-400 to-pink-500",
      dots: "bg-rose-400",
    },
    emerald: {
      bg: "from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20",
      bg2: "from-emerald-200 to-green-200 dark:from-emerald-800/30 dark:to-green-800/30",
      main: "from-emerald-400 to-green-500",
      dots: "bg-emerald-400",
    },
    indigo: {
      bg: "from-indigo-100 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20",
      bg2: "from-indigo-200 to-blue-200 dark:from-indigo-800/30 dark:to-indigo-800/30",
      main: "from-indigo-400 to-blue-500",
      dots: "bg-indigo-400",
    },
  }

  const colors = colorClasses[color]

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      <div className="relative mb-8">
        {/* Animated background circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-32 h-32 bg-gradient-to-r ${colors.bg} rounded-full animate-pulse`}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-24 h-24 bg-gradient-to-r ${colors.bg2} rounded-full animate-bounce`}></div>
        </div>
        {/* Main icon */}
        <div className={`relative z-10 flex items-center justify-center w-20 h-20 bg-gradient-to-r ${colors.main} rounded-full shadow-lg`}>
          <Icon className="h-10 w-10 text-white animate-pulse" />
        </div>
        {/* Floating elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-400 rounded-full animate-ping animation-delay-1000"></div>
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// Overview Tab Component
const UserOverviewTab = ({ user }: { user: UserResource | null }) => {
  if (!user) return null

  const roleConfigItem = roleConfig[user.role]
  const RoleIcon = roleConfigItem.icon

  return (
    <div className="space-y-6">
      {/* User Header Card */}
      <Card className="border-2 border-primary/20 dark:border-primary/40">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20 dark:ring-primary/40 shadow-lg">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-2xl font-bold">
                  {user.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-primary dark:text-[#E2C992] mb-2">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">@{user.username}</p>
              <div className="flex gap-2 flex-wrap">
                <Badge
                  className={cn(
                    "border border-[#E2C992]/30",
                    user.is_active
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  )}
                >
                  {user.is_active ? (
                    <>
                      <UserCheck className="h-3 w-3 mr-1" />
                      نشط
                    </>
                  ) : (
                    <>
                      <UserX className="h-3 w-3 mr-1" />
                      غير نشط
                    </>
                  )}
                </Badge>
                <Badge
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#E2C992]/30",
                    roleConfigItem.bgColor,
                    roleConfigItem.textColor
                  )}
                >
                  <RoleIcon className={cn("h-3.5 w-3.5", roleConfigItem.iconColor)} />
                  <span>{roleConfigItem.label}</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="border-2 border-primary/20 dark:border-primary/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary dark:text-[#E2C992]">
            <div className="p-1.5 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
              <Clock className="h-4 w-4 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.5)]" />
            </div>
            معلومات الحساب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
              <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                <Clock className="h-5 w-5 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.3)]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">تاريخ التسجيل</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDateInArabic(new Date(user.created_at))}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {getRelativeTime(user.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
              <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                <Clock className="h-5 w-5 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.3)]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">آخر تحديث</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDateInArabic(new Date(user.updated_at))}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {getRelativeTime(user.updated_at)}
                </p>
              </div>
            </div>

            {user.last_login_at && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
                <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                  <Clock className="h-5 w-5 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.3)]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">آخر دخول</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {formatDateInArabic(new Date(user.last_login_at))}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getRelativeTime(user.last_login_at)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
              <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                <User className="h-5 w-5 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.3)]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">معرف المستخدم</p>
                <p className="text-gray-900 dark:text-white font-mono font-medium text-lg">#{user.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ViewUserDetailsModal({
  open,
  onOpenChange,
  user,
  isLoading = false,
}: ViewUserDetailsModalProps) {
  const [activeTab, setActiveTab] = React.useState("overview")

  const LoadingSkeleton = () => (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    </div>
  )

  const getUserDisplayName = () => {
    if (!user) return "المستخدم"
    return user.name || "المستخدم"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl max-h-[94vh] min-h-[90vh] overflow-hidden" dir="rtl">
        <DialogHeader className="bg-gradient-to-r from-primary/10 via-primary/10 to-primary/10 dark:from-primary/30 dark:via-primary/30 dark:to-primary/30 -mx-6 -mt-8 px-6 py-4 border-b border-primary/20 h-[70px] flex justify-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg border border-[#E2C992]/30">
                <User className="h-5 w-5 text-primary-foreground drop-shadow-[0_0_4px_rgba(226,201,146,0.6)]" />
              </div>
              <div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </>
                ) : (
                  <>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent">
                      تفاصيل المستخدم - {getUserDisplayName()}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                      عرض شامل لتفاصيل المستخدم ومعلومات الحساب
                    </DialogDescription>
                  </>
                )}
              </div>
            </div>

            {!isLoading && user && (
              <div className="ml-6 flex items-center gap-4">
                <Avatar className="h-10 w-10 border-2 border-primary/30 dark:border-primary/50">
                  {user.avatar_url ? (
                    <AvatarImage src={user.avatar_url} alt={getUserDisplayName()} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                      {user.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-semibold text-primary dark:text-[#E2C992]">{getUserDisplayName()}</p>
                  <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                </div>
              </div>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full -mt-[20px]">
            <TabsList className="grid w-full grid-cols-1 bg-muted/50 pt-1 pb-1" dir="rtl">
              <TabsTrigger
                value="overview"
                className="gap-2 transition-all duration-300 data-[state=active]:scale-105 data-[state=active]:shadow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Eye className="h-4 w-4" />
                نظرة عامة
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(92vh-150px)] pr-1">
              <TabsContent
                value="overview"
                className="space-y-6 mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <UserOverviewTab user={user} />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
