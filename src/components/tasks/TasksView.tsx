"use client"

/**
 * TasksView - Tasks page layout component
 * 
 * Responsibilities:
 * - Page layout and filters
 * - View toggle (cards/table/columns)
 * - Data fetching via useTasks hook
 * - Render TasksList component
 * - Manage modals state
 * 
 * Rules:
 * - UI only - no business logic
 * - Uses hooks for data fetching
 * - Toast errors handled by hooks
 */

import { useState, useMemo, useRef } from "react"
import { useTasks, type UseTasksParams, useTaskActions, type TaskResource } from "@/features/tasks"
import { TasksList } from "./TasksList"
import { TasksFilters } from "./TasksFilters"
import { TasksViewToggle } from "./TasksViewToggle"
import { TasksSummary } from "./TasksSummary"
import {
  AddTaskModal,
  DeleteTaskModal,
  ChangeTaskStatusModal,
  type AddTaskFormData,
} from "./modals"
import { ViewTaskDetailsModal } from "./modals/ViewTaskDetailsModal"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { DeletedTasksModal } from "./modals/DeletedTasksModal"

export type ViewMode = "cards" | "table" | "columns"

export function TasksView() {
  const [viewMode, setViewMode] = useState<ViewMode>("columns")
  const [filters, setFilters] = useState<UseTasksParams>({})
  const [currentPage, setCurrentPage] = useState(1)

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false)
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false)
  const [viewDetailsTaskId, setViewDetailsTaskId] = useState<number | string | null>(null)
  const [deletedTasksModalOpen, setDeletedTasksModalOpen] = useState(false)
  const [assignedUser, setAssignedUser] = useState<import("@/features/users").UserResource | null>(null)

  // Selected task for modals
  const [selectedTask, setSelectedTask] = useState<TaskResource | null>(null)
  const [newStatus, setNewStatus] = useState<"pending" | "in_progress" | "completed" | "cancelled" | null>(null)

  // Loading states for modals
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hooks
  const { tasks, meta, isLoading, error, mutate } = useTasks({
    ...filters,
    page: currentPage,
  })
  const { createTask, updateTask, deleteTask, changeTaskStatus, reassignTask } = useTaskActions()

  const handleFilterChange = (newFilters: UseTasksParams) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Action handlers
  const handleAddNew = () => {
    setSelectedTask(null)
    setAddModalOpen(true)
  }

  const handleEdit = (task: TaskResource) => {
    setSelectedTask(task)
    setEditModalOpen(true)
  }

  const handleDelete = (task: TaskResource) => {
    setSelectedTask(task)
    setDeleteModalOpen(true)
  }

  const handleChangeStatus = (task: TaskResource, status?: "pending" | "in_progress" | "completed" | "cancelled") => {
    setSelectedTask(task)
    // If status is provided and different from current, use it; otherwise open modal to select
    if (status && status !== task.status) {
      setNewStatus(status)
    } else {
      setNewStatus(null) // Will show all available statuses in modal
    }
    setChangeStatusModalOpen(true)
  }

  const handleViewDetails = (task: TaskResource) => {
    setViewDetailsTaskId(task.id)
    setViewDetailsModalOpen(true)
  }

  // Handle drag and drop status change
  const handleStatusChange = async (taskId: number, newStatus: "pending" | "in_progress" | "completed" | "cancelled") => {
    setIsSubmitting(true)
    try {
      await changeTaskStatus({
        id: taskId,
        status: newStatus,
      })
      mutate() // Refresh tasks list
    } catch (error) {
      // Error handling is done by useTaskActions hook via toast
    } finally {
      setIsSubmitting(false)
    }
  }

  // Modal submit handlers
  const handleAddTaskSubmit = async (formData: AddTaskFormData) => {
    setIsSubmitting(true)
    try {
      await createTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        due_date: formData.due_date,
        assigned_to_user_id: formData.assigned_to_user_id,
      })
      setAddModalOpen(false)
      mutate() // Refresh tasks list
    } catch (error) {
      // Re-throw error to let AddTaskModal handle it (show toast for 422)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditTaskSubmit = async (formData: AddTaskFormData) => {
    if (!selectedTask) return

    setIsSubmitting(true)
    try {
      // If assigned_to_user_id changed, use reassignTask
      if (formData.assigned_to_user_id !== selectedTask.assigned_to.id) {
        await reassignTask({
          id: selectedTask.id,
          assigned_to_user_id: formData.assigned_to_user_id,
        })
      }
      
      // Check if due_date changed
      const originalDueDate = selectedTask.due_date || ""
      let dueDateChanged = false
      let normalizedDueDate: string | undefined = undefined
      
      if (formData.due_date) {
        // Normalize dates to YYYY-MM-DD for comparison
        const currentDate = new Date(formData.due_date)
        const originalDate = originalDueDate ? new Date(originalDueDate) : null
        
        if (originalDate) {
          const currentDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`
          const originalDateStr = `${originalDate.getFullYear()}-${String(originalDate.getMonth() + 1).padStart(2, "0")}-${String(originalDate.getDate()).padStart(2, "0")}`
          dueDateChanged = currentDateStr !== originalDateStr
        } else {
          // Original had no due_date, so this is a change
          dueDateChanged = true
        }
        
        if (dueDateChanged) {
          normalizedDueDate = formData.due_date
        }
      } else if (originalDueDate) {
        // Form has no due_date but original had one - this is a change (removal)
        dueDateChanged = true
        normalizedDueDate = formData.due_date // undefined
      }
      
      // Update other fields (only include due_date if it changed)
      const updatePayload: {
        id: number | string
        title?: string
        description?: string
        priority?: "low" | "medium" | "high" | "urgent"
        due_date?: string
      } = {
        id: selectedTask.id,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
      }
      
      // Only include due_date if it actually changed
      if (dueDateChanged) {
        updatePayload.due_date = normalizedDueDate
      }
      
      await updateTask(updatePayload)
      setEditModalOpen(false)
      setSelectedTask(null)
      mutate() // Refresh tasks list
    } catch (error) {
      // Re-throw error to let AddTaskModal handle it (show toast for 422)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedTask) return

    setIsSubmitting(true)
    try {
      await deleteTask({ id: selectedTask.id })
      setDeleteModalOpen(false)
      setSelectedTask(null)
      mutate() // Refresh tasks list
    } catch (error) {
      // Error handling is done by useTaskActions hook via toast
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangeStatusConfirm = async (newStatus: "pending" | "in_progress" | "completed" | "cancelled", reason?: string) => {
    if (!selectedTask) return

    setIsSubmitting(true)
    try {
      await changeTaskStatus({
        id: selectedTask.id,
        status: newStatus,
        reason,
      })
      setChangeStatusModalOpen(false)
      setSelectedTask(null)
      setNewStatus(null)
      mutate() // Refresh tasks list
    } catch (error) {
      // Error handling is done by useTaskActions hook via toast
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate summary stats from tasks data
  const summaryStats = useMemo(() => {
    if (!tasks) return null

    const total = tasks.length
    const pending = tasks.filter((t) => t.status === "pending").length
    const inProgress = tasks.filter((t) => t.status === "in_progress").length
    const completed = tasks.filter((t) => t.status === "completed").length
    const cancelled = tasks.filter((t) => t.status === "cancelled").length
    const highPriority = tasks.filter((t) => t.priority === "high" || t.priority === "urgent").length
    const mediumPriority = tasks.filter((t) => t.priority === "medium").length
    const lowPriority = tasks.filter((t) => t.priority === "low").length

    // Calculate from meta if available (for accurate totals)
    const totalFromMeta = meta?.total || total
    const pendingPercentage = totalFromMeta > 0 ? (pending / totalFromMeta) * 100 : 0
    const inProgressPercentage = totalFromMeta > 0 ? (inProgress / totalFromMeta) * 100 : 0
    const completedPercentage = totalFromMeta > 0 ? (completed / totalFromMeta) * 100 : 0
    const cancelledPercentage = totalFromMeta > 0 ? (cancelled / totalFromMeta) * 100 : 0
    const highPriorityPercentage = totalFromMeta > 0 ? (highPriority / totalFromMeta) * 100 : 0
    const mediumPriorityPercentage = totalFromMeta > 0 ? (mediumPriority / totalFromMeta) * 100 : 0
    const lowPriorityPercentage = totalFromMeta > 0 ? (lowPriority / totalFromMeta) * 100 : 0

    return {
      total: totalFromMeta,
      pending,
      inProgress,
      completed,
      cancelled,
      highPriority,
      mediumPriority,
      lowPriority,
      pendingPercentage,
      inProgressPercentage,
      completedPercentage,
      cancelledPercentage,
      highPriorityPercentage,
      mediumPriorityPercentage,
      lowPriorityPercentage,
    }
  }, [tasks, meta])

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 dark:from-primary dark:via-primary/90 dark:to-primary dark:hover:from-primary/90 dark:hover:via-primary dark:hover:to-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded-sm shadow-lg hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 relative overflow-hidden group gap-2"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <Plus className="h-4 w-4 relative z-10" />
              <span className="relative z-10">إضافة مهمة</span>
            </Button>
            <Button
              onClick={() => setDeletedTasksModalOpen(true)}
              variant="outline"
              className="border-red-500/30 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 font-semibold px-4 py-2 rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              المهام المحذوفة
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <TasksViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>

        {/* Summary Cards */}
        {summaryStats && (
          <TasksSummary stats={summaryStats} isLoading={isLoading} />
        )}

        {/* Filters Section */}
        <TasksFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
          isLoading={isLoading}
          assignedUser={assignedUser}
          onAssignedUserChange={setAssignedUser}
        />

        {/* Tasks List */}
        <TasksList
          tasks={tasks || []}
          viewMode={viewMode}
          meta={meta}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          error={error}
          onRefresh={mutate}
          onStatusChange={handleStatusChange}
          isSubmitting={isSubmitting}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onChangeStatus={handleChangeStatus}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Modals */}
      <AddTaskModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        mode="add"
        onSubmit={handleAddTaskSubmit}
        isLoading={isSubmitting}
      />

      <AddTaskModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        task={selectedTask}
        mode="edit"
        onSubmit={handleEditTaskSubmit}
        isLoading={isSubmitting}
      />

      <DeleteTaskModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        taskTitle={selectedTask?.title || ""}
        taskStatus={selectedTask?.status}
        taskPriority={selectedTask?.priority}
        isLoading={isSubmitting}
        onConfirm={handleDeleteConfirm}
      />

      <ChangeTaskStatusModal
        open={changeStatusModalOpen}
        onOpenChange={setChangeStatusModalOpen}
        taskTitle={selectedTask?.title || ""}
        currentStatus={selectedTask?.status || "pending"}
        newStatus={newStatus || undefined}
        isLoading={isSubmitting}
        onConfirm={handleChangeStatusConfirm}
      />

      <ViewTaskDetailsModal
        open={viewDetailsModalOpen}
        onOpenChange={(open) => {
          setViewDetailsModalOpen(open)
          if (!open) {
            setViewDetailsTaskId(null)
          }
        }}
        taskId={viewDetailsTaskId}
      />

      <DeletedTasksModal
        open={deletedTasksModalOpen}
        onOpenChange={setDeletedTasksModalOpen}
      />
    </>
  )
}
