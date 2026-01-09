"use client"

/**
 * UsersTableView - Display users in table format using DataTable
 * 
 * Responsibilities:
 * - Render users table using reusable DataTable component
 * - Display pagination
 * - Display action icons
 * 
 * Rules:
 * - UI only - no logic
 */

import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { roleConfig } from "@/components/layout/UserProfile/roleConfig"
import { Edit, Trash2, Power, PowerOff, FileText } from "lucide-react"
import { UsersPagination } from "./UsersPagination"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserResource, PaginationMeta } from "@/features/users"

export interface UsersTableViewProps {
  users: UserResource[]
  meta?: PaginationMeta
  currentPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  onEdit?: (user: UserResource) => void
  onDelete?: (user: UserResource) => void
  onToggleStatus?: (user: UserResource) => void
  onViewDetails?: (user: UserResource) => void
}

export function UsersTableView({
  users,
  meta,
  currentPage,
  onPageChange,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
}: UsersTableViewProps) {
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
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "لم يسجل دخول"
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate row number based on pagination
  const getRowNumber = (index: number) => {
    const perPage = meta?.per_page || 15
    return (currentPage - 1) * perPage + index + 1
  }

  // Define columns
  const columns: DataTableColumn<UserResource>[] = [
    {
      key: "number",
      label: "#",
      width: "60px",
      align: "center",
      render: (user, index) => (
        <span className="text-sm font-medium text-muted-foreground">
          {getRowNumber(index)}
        </span>
      ),
    },
    {
      key: "avatar",
      label: "الصورة",
      width: "80px",
      align: "center",
      render: (user) => (
        <Avatar className="h-10 w-10 ring-2 ring-sidebar-border mx-auto">
          {user.avatar_url ? (
            <AvatarImage src={user.avatar_url} alt={user.name} />
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {getInitials(user.name)}
            </AvatarFallback>
          )}
        </Avatar>
      ),
    },
    {
      key: "name",
      label: "الاسم",
      render: (user) => (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">@{user.username}</div>
        </div>
      ),
    },
    {
      key: "role",
      label: "الصلاحية",
      align: "center",
      render: (user) => {
        const roleConfigItem = roleConfig[user.role]
        const RoleIcon = roleConfigItem.icon
        return (
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
              roleConfigItem.bgColor,
              roleConfigItem.textColor
            )}
          >
            <RoleIcon
              className={cn("h-3.5 w-3.5", roleConfigItem.iconColor)}
            />
            <span>{roleConfigItem.label}</span>
          </div>
        )
      },
    },
    {
      key: "is_active",
      label: "الحالة",
      align: "center",
      render: (user) => (
        <Badge
          variant="outline"
          className={cn(
            user.is_active
              ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
              : "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
          )}
        >
          {user.is_active ? "نشط" : "غير نشط"}
        </Badge>
      ),
    },
    {
      key: "last_login_at",
      label: "آخر دخول",
      align: "center",
      render: (user) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(user.last_login_at)}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "تاريخ الإنشاء",
      align: "center",
      render: (user) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(user.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "الإجراءات",
      width: "180px",
      align: "center",
      render: (user) => (
        <TooltipProvider>
          <div className="flex items-center justify-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-[#E2C992] transition-all duration-200"
                  onClick={() => onEdit?.(user)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>تعديل</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-[#E2C992] transition-all duration-200"
                  onClick={() => onToggleStatus?.(user)}
                >
                  {user.is_active ? (
                    <PowerOff className="h-4 w-4" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {user.is_active ? "إلغاء التنشيط" : "تنشيط"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#dca93b] hover:bg-[#E2C992]/10 hover:text-[#E2C992] dark:hover:bg-[#E2C992]/20 transition-all duration-200"
                  onClick={() => onViewDetails?.(user)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>عرض التفاصيل</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200"
                  onClick={() => onDelete?.(user)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>حذف</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Table */}
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        emptyMessage="لا يوجد مستخدمون"
        emptyIcon={User}
        getRowKey={(user) => user.id}
      />

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <UsersPagination
          meta={meta}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}
