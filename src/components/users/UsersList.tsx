"use client"

/**
 * UsersList - Display users in cards or table view
 * 
 * Responsibilities:
 * - Render users based on view mode
 * - Handle pagination
 * - Display loading and error states
 * 
 * Rules:
 * - UI only - no logic
 */

import { UsersCardsView } from "./UsersCardsView"
import { UsersTableView } from "./UsersTableView"
import type { ViewMode } from "./UsersView"
import type { UserResource, PaginationMeta } from "@/features/users"
import type { ApiError } from "@/lib/api/api.types"

export interface UsersListProps {
  users: UserResource[]
  viewMode: ViewMode
  meta?: PaginationMeta
  currentPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  error?: ApiError | null
  onRefresh?: () => Promise<UserResource[] | undefined>
  onEdit?: (user: UserResource) => void
  onDelete?: (user: UserResource) => void
  onToggleStatus?: (user: UserResource) => void
  onViewDetails?: (user: UserResource) => void
}

export function UsersList({
  users,
  viewMode,
  meta,
  currentPage,
  onPageChange,
  isLoading,
  error,
  onRefresh,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
}: UsersListProps) {
  // Error State
  if (error && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-4">
          <p className="font-medium text-lg">حدث خطأ أثناء جلب البيانات</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
        {onRefresh && (
          <button
            onClick={() => onRefresh()}
            className="text-sm text-primary hover:underline"
          >
            إعادة المحاولة
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      {viewMode === "cards" ? (
        <UsersCardsView
          users={users}
          meta={meta}
          currentPage={currentPage}
          onPageChange={onPageChange}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onViewDetails={onViewDetails}
        />
      ) : (
        <UsersTableView
          users={users}
          meta={meta}
          currentPage={currentPage}
          onPageChange={onPageChange}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onViewDetails={onViewDetails}
        />
      )}
    </>
  )
}
