"use client"

/**
 * UsersCardsView - Display users as cards
 * 
 * Responsibilities:
 * - Render user cards in grid layout
 * - Display loading skeleton
 * - Display empty state
 * - Display pagination
 * 
 * Rules:
 * - UI only - no logic
 */

import { UserCard } from "./UserCard"
import { UsersPagination } from "./UsersPagination"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { User as UserIcon, Sparkles } from "lucide-react"
import type { UserResource, PaginationMeta } from "@/features/users"

export interface UsersCardsViewProps {
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

export function UsersCardsView({
  users,
  meta,
  currentPage,
  onPageChange,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
}: UsersCardsViewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, idx) => (
          <Card key={idx} className="overflow-hidden animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <UserIcon className="w-16 h-16 text-primary/40 dark:text-[#E2C992]/40 mb-4 animate-bounce" strokeWidth={1.5} />
          <Sparkles className="w-6 h-6 text-[#E2C992] absolute -top-2 -right-2 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-primary dark:text-[#E2C992] mb-2">لا يوجد مستخدمين لعرضهم</h3>
        <p className="text-muted-foreground text-sm">لم يتم العثور على مستخدمين مطابقين للفلتر الحالي.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <UsersPagination
          meta={meta}
          currentPage={currentPage}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
