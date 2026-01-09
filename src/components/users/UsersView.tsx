"use client"

/**
 * UsersView - Users page layout component
 * 
 * Responsibilities:
 * - Page layout and filters
 * - View toggle (cards/table)
 * - Data fetching via useUsers hook
 * - Render UsersList component
 * - Manage modals state
 * 
 * Rules:
 * - UI only - no business logic
 * - Uses hooks for data fetching
 * - Toast errors handled by hooks
 */

import { useState, useMemo } from "react"
import { useUsers, type UseUsersParams, useUserActions, type UserResource } from "@/features/users"
import { UsersList } from "./UsersList"
import { UsersFilters } from "./UsersFilters"
import { UsersViewToggle } from "./UsersViewToggle"
import { UsersSummary } from "./UsersSummary"
import {
  AddUserModal,
  DeleteUserModal,
  ToggleStatusModal,
  ViewUserDetailsModal,
  type AddUserFormData,
} from "./modals"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export type ViewMode = "cards" | "table"

export function UsersView() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [filters, setFilters] = useState<UseUsersParams>({})
  const [currentPage, setCurrentPage] = useState(1)

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [toggleStatusModalOpen, setToggleStatusModalOpen] = useState(false)
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false)

  // Selected user for modals
  const [selectedUser, setSelectedUser] = useState<UserResource | null>(null)

  // Loading states for modals
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hooks
  const { users, meta, isLoading, error, mutate } = useUsers({
    ...filters,
    page: currentPage,
  })
  const { createUser, updateUser, toggleActive, deleteUser } = useUserActions()

  const handleFilterChange = (newFilters: UseUsersParams) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Action handlers
  const handleAddNew = () => {
    setSelectedUser(null)
    setAddModalOpen(true)
  }

  const handleEdit = (user: UserResource) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleDelete = (user: UserResource) => {
    setSelectedUser(user)
    setDeleteModalOpen(true)
  }

  const handleToggleStatus = (user: UserResource) => {
    setSelectedUser(user)
    setToggleStatusModalOpen(true)
  }

  const handleViewDetails = (user: UserResource) => {
    setSelectedUser(user)
    setViewDetailsModalOpen(true)
  }

  // Modal submit handlers
  const handleAddUserSubmit = async (formData: AddUserFormData) => {
    setIsSubmitting(true)
    try {
      await createUser({
        username: formData.username,
        name: formData.name,
        password: formData.password,
        role: formData.role,
        is_active: formData.is_active,
      })
      setAddModalOpen(false)
      mutate() // Refresh users list
    } catch (error) {
      // Re-throw error to let AddUserModal handle it (show toast for 422)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUserSubmit = async (formData: AddUserFormData) => {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      await updateUser({
        id: selectedUser.id,
        username: formData.username,
        name: formData.name,
        password: formData.password || undefined,
        role: formData.role,
        is_active: formData.is_active,
      })
      setEditModalOpen(false)
      setSelectedUser(null)
      mutate() // Refresh users list
    } catch (error) {
      // Re-throw error to let AddUserModal handle it (show toast for 422)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      await deleteUser({ id: selectedUser.id })
      setDeleteModalOpen(false)
      setSelectedUser(null)
      mutate() // Refresh users list
    } catch (error) {
      // Error handling is done by useUserActions hook via toast
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatusConfirm = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      await toggleActive({ id: selectedUser.id })
      setToggleStatusModalOpen(false)
      setSelectedUser(null)
      mutate() // Refresh users list
    } catch (error) {
      // Error handling is done by useUserActions hook via toast
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate summary stats from users data
  const summaryStats = useMemo(() => {
    if (!users) return null

    const total = users.length
    const active = users.filter((u) => u.is_active).length
    const inactive = users.filter((u) => !u.is_active).length
    const admin = users.filter((u) => u.role === "admin").length
    // const department = users.filter((u) => u.role === "department").length

    // Calculate from meta if available (for accurate totals)
    const totalFromMeta = meta?.total || total
    const activePercentage = totalFromMeta > 0 ? (active / totalFromMeta) * 100 : 0
    const inactivePercentage = totalFromMeta > 0 ? (inactive / totalFromMeta) * 100 : 0
    const adminPercentage = totalFromMeta > 0 ? (admin / totalFromMeta) * 100 : 0
    // const departmentPercentage = totalFromMeta > 0 ? (department / totalFromMeta) * 100 : 0

    return {
      total: totalFromMeta,
      active,
      inactive,
      admin,
    //   department,
      activePercentage,
      inactivePercentage,
      adminPercentage,
    //   departmentPercentage,
    }
  }, [users, meta])

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 dark:from-primary dark:via-primary/90 dark:to-primary dark:hover:from-primary/90 dark:hover:via-primary dark:hover:to-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded-sm shadow-lg hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 relative overflow-hidden group gap-2"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <Plus className="h-4 w-4 relative z-10" />
              <span className="relative z-10">إضافة مستخدم</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <UsersViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>

        {/* Summary Cards */}
        {summaryStats && (
          <UsersSummary stats={summaryStats} isLoading={isLoading} />
        )}

        {/* Filters Section */}
        <UsersFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
          isLoading={isLoading}
        />

        {/* Users List */}
        <UsersList
          users={users || []}
          viewMode={viewMode}
          meta={meta}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          error={error}
          onRefresh={mutate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Modals */}
      <AddUserModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        mode="add"
        onSubmit={handleAddUserSubmit}
        isLoading={isSubmitting}
      />

      <AddUserModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        user={selectedUser}
        mode="edit"
        onSubmit={handleEditUserSubmit}
        isLoading={isSubmitting}
      />

      <DeleteUserModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        userName={selectedUser?.name || ""}
        userAvatar={selectedUser?.avatar_url || null}
        isLoading={isSubmitting}
        onConfirm={handleDeleteConfirm}
      />

      <ToggleStatusModal
        open={toggleStatusModalOpen}
        onOpenChange={setToggleStatusModalOpen}
        userName={selectedUser?.name || ""}
        isActive={selectedUser?.is_active ?? false}
        isLoading={isSubmitting}
        onConfirm={handleToggleStatusConfirm}
      />

      <ViewUserDetailsModal
        open={viewDetailsModalOpen}
        onOpenChange={setViewDetailsModalOpen}
        user={selectedUser}
        isLoading={false}
      />
    </>
  )
}
