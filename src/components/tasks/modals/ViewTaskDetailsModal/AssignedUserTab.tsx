"use client"

/**
 * AssignedUserTab - Assigned user information tab
 * 
 * Responsibilities:
 * - Display assigned user profile and details
 * 
 * Rules:
 * - UI only - no business logic
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserCheck, User, Mail, Phone, Building, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { roleConfig } from "./constants"
import { getInitials } from "./utils"
import { UserTasksStatistics } from "@/components/users/UserTasksStatistics"
import type { TaskResource } from "@/features/tasks"

export interface AssignedUserTabProps {
  task: TaskResource | null
}

export function AssignedUserTab({ task }: AssignedUserTabProps) {
  if (!task || !task.assigned_to) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full blur-xl animate-pulse"></div>
          <UserCheck className="relative h-16 w-16 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">لا يوجد مستخدم مسند</p>
      </div>
    )
  }

  const user = task.assigned_to
  const roleInfo = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.department
  const RoleIcon = roleInfo.icon

  return (
    <div className="space-y-6">
      {/* User Header Card */}
      <Card className="border-2 border-primary/20 dark:border-primary/40 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20 p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 dark:bg-primary/40 rounded-full blur-2xl"></div>
              <Avatar className="relative h-24 w-24 ring-4 ring-primary/20 dark:ring-primary/40 shadow-xl">
                {user.avatar_url ? (
                  <AvatarImage src={user.avatar_url} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-2xl font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-primary dark:text-[#E2C992] mb-2">
                {user.name}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className={cn("px-3 py-1", roleInfo.color)}>
                  <RoleIcon className="w-3 h-3 mr-1" />
                  {roleInfo.label}
                </Badge>
                {user.is_active ? (
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                    نشط
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20">
                    غير نشط
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @{user.username}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* User Details */}
      <Card className="border-2 border-primary/20 dark:border-primary/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary dark:text-[#E2C992]">
            <div className="p-1.5 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
              <User className="h-4 w-4 text-primary dark:text-[#E2C992]" />
            </div>
            معلومات المستخدم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(user as any).email && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
                <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                  <Mail className="h-5 w-5 text-primary dark:text-[#E2C992]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">البريد الإلكتروني</p>
                  <p className="text-gray-900 dark:text-white font-medium">{(user as any).email}</p>
                </div>
              </div>
            )}
            {(user as any).phone && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
                <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                  <Phone className="h-5 w-5 text-primary dark:text-[#E2C992]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">رقم الهاتف</p>
                  <p className="text-gray-900 dark:text-white font-medium">{(user as any).phone}</p>
                </div>
              </div>
            )}
            {(user as any).department && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
                <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                  <Building className="h-5 w-5 text-primary dark:text-[#E2C992]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">القسم</p>
                  <p className="text-gray-900 dark:text-white font-medium">{(user as any).department}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-primary/10">
              <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                <Shield className="h-5 w-5 text-primary dark:text-[#E2C992]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">معرف المستخدم</p>
                <p className="text-gray-900 dark:text-white font-medium">#{user.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Statistics */}
      <UserTasksStatistics
        statistics={(user as any).tasks_statistics}
        variant="card"
      />
    </div>
  )
}
