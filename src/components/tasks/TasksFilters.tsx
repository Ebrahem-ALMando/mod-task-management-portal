"use client"

/**
 * TasksFilters - Filter controls for tasks list
 * 
 * Responsibilities:
 * - Display filter inputs (search, status, priority, date range, assigned user)
 * - Handle filter changes with debouncing
 * - Show skeleton loader during filtering/searching
 * 
 * Rules:
 * - UI only - no logic
 * - Filters passed as props
 */

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TaskDatePicker } from "@/components/ui/task-date-picker"
import { SelectUserModal } from "./modals/SelectUserModal"
import { Search, X, User, Filter } from "lucide-react"
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "./modals/DeletedTasksModal/constants"
import { formatDateInArabic } from "@/lib/utils/date"
import type { UseTasksParams } from "@/features/tasks"
import type { UserResource } from "@/features/users"

export interface TasksFiltersProps {
  filters: UseTasksParams
  onFiltersChange: (filters: UseTasksParams) => void
  isLoading?: boolean
  assignedUser?: UserResource | null
  onAssignedUserChange?: (user: UserResource | null) => void
}

export function TasksFilters({
  filters,
  onFiltersChange,
  isLoading = false,
  assignedUser,
  onAssignedUserChange,
}: TasksFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || "")
  const [status, setStatus] = useState<"pending" | "in_progress" | "completed" | "cancelled" | "all">(
    filters.status || "all"
  )
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent" | "all">(
    filters.priority || "all"
  )
  const [dateFrom, setDateFrom] = useState<Date | null>(
    filters.from ? new Date(filters.from) : null
  )
  const [dateTo, setDateTo] = useState<Date | null>(
    filters.to ? new Date(filters.to) : null
  )
  const [selectUserModalOpen, setSelectUserModalOpen] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const newFilters: UseTasksParams = {}
      
      if (localSearch.trim()) {
        newFilters.search = localSearch.trim()
      }
      
      onFiltersChange(newFilters)
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearch, onFiltersChange])

  // Update filters when other filters change
  useEffect(() => {
    const newFilters: UseTasksParams = {}

    // Status
    if (status !== "all") {
      newFilters.status = status
    } else {
      delete newFilters.status
    }

    // Priority
    if (priority !== "all") {
      newFilters.priority = priority
    } else {
      delete newFilters.priority
    }

    // Date range
    if (dateFrom) {
      newFilters.from = dateFrom.toISOString()
    } else {
      delete newFilters.from
    }

    if (dateTo) {
      newFilters.to = dateTo.toISOString()
    } else {
      delete newFilters.to
    }

    // Assigned user
    if (assignedUser) {
      newFilters.filter_field = "assigned_to_user_id"
      newFilters.filter_value = assignedUser.id
    } else {
      delete newFilters.filter_field
      delete newFilters.filter_value
    }

    onFiltersChange(newFilters)
  }, [status, priority, dateFrom, dateTo, assignedUser, onFiltersChange])

  const handleClear = () => {
    setLocalSearch("")
    setStatus("all")
    setPriority("all")
    setDateFrom(null)
    setDateTo(null)
    if (onAssignedUserChange) {
      onAssignedUserChange(null)
    }
    onFiltersChange({})
  }

  const handleUserSelect = (user: UserResource) => {
    if (onAssignedUserChange) {
      onAssignedUserChange(user)
    }
    setSelectUserModalOpen(false)
  }

  const activeFilters = useMemo(() => {
    const filters: Array<{ key: string; label: string; onRemove: () => void }> = []
    
    if (localSearch.trim()) {
      filters.push({
        key: "search",
        label: `بحث: ${localSearch.trim()}`,
        onRemove: () => setLocalSearch(""),
      })
    }
    
    if (status !== "all") {
      const statusLabel = STATUS_OPTIONS.find((o) => o.value === status)?.label || status
      filters.push({
        key: "status",
        label: `الحالة: ${statusLabel}`,
        onRemove: () => setStatus("all"),
      })
    }
    
    if (priority !== "all") {
      const priorityLabel = PRIORITY_OPTIONS.find((o) => o.value === priority)?.label || priority
      filters.push({
        key: "priority",
        label: `الأولوية: ${priorityLabel}`,
        onRemove: () => setPriority("all"),
      })
    }
    
    if (dateFrom) {
      filters.push({
        key: "dateFrom",
        label: `من: ${formatDateInArabic(dateFrom)}`,
        onRemove: () => setDateFrom(null),
      })
    }
    
    if (dateTo) {
      filters.push({
        key: "dateTo",
        label: `إلى: ${formatDateInArabic(dateTo)}`,
        onRemove: () => setDateTo(null),
      })
    }
    
    if (assignedUser) {
      filters.push({
        key: "assignedUser",
        label: `المستخدم: ${assignedUser.name}`,
        onRemove: () => {
          if (onAssignedUserChange) {
            onAssignedUserChange(null)
          }
        },
      })
    }
    
    return filters
  }, [localSearch, status, priority, dateFrom, dateTo, assignedUser, onAssignedUserChange])

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          {isLoading ? (
            <Skeleton className="w-full h-10 rounded-md" />
          ) : (
            <Input
              placeholder="البحث في المهام..."
              className="w-full pr-10"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              dir="rtl"
            />
          )}
          {localSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => setLocalSearch("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-4 gap-2">
          {/* Status Filter */}
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as typeof status)}
            disabled={isLoading}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as typeof priority)}
            disabled={isLoading}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="الأولوية" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Filters - Combined in one column */}
          <div className="grid grid-cols-2 gap-2 col-span-1">
            <TaskDatePicker
              value={dateFrom}
              onChange={(date) => setDateFrom(date)}
              placeholder="من تاريخ"
              disabled={isLoading}
            />
            <TaskDatePicker
              value={dateTo}
              onChange={(date) => setDateTo(date)}
              placeholder="إلى تاريخ"
              disabled={isLoading}
            />
          </div>

          {/* Assigned User Filter */}
          <Button
            variant="outline"
            onClick={() => setSelectUserModalOpen(true)}
            disabled={isLoading}
            className="h-9 justify-start"
          >
            <User className="h-4 w-4 ml-2" />
            <span className="truncate">{assignedUser ? assignedUser.name : "المسند إلى"}</span>
          </Button>
        </div>

        {/* Active Filters Badges */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">الفلاتر المطبقة:</span>
            {activeFilters.map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="gap-1 pr-2 pl-1"
              >
                {filter.label}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-transparent"
                  onClick={filter.onRemove}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={isLoading}
              className="h-7 text-xs gap-1"
            >
              <X className="h-3 w-3" />
              مسح الكل
            </Button>
          </div>
        )}
      </div>

      {/* Select User Modal */}
      <SelectUserModal
        open={selectUserModalOpen}
        onOpenChange={setSelectUserModalOpen}
        selectedUserId={assignedUser?.id}
        onSelect={handleUserSelect}
        isLoading={isLoading}
      />
    </>
  )
}
