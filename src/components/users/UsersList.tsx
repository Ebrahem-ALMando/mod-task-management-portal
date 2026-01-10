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
import { ErrorState } from "@/components/status/ErrorState" 

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
      <ErrorState
        message={error.message}
        onRetry={onRefresh ? () => onRefresh() : undefined}
        isRetrying={isLoading}
      />
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
