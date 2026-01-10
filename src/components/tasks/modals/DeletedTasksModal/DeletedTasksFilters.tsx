"use client"

/**
 * DeletedTasksFilters - Filter controls for deleted tasks
 * 
 * Responsibilities:
 * - Display search input
 * - Display 4 filters: status, priority, overdue, date range, assigned user
 * - Handle filter changes
 * 
 * Rules:
 * - UI only - no business logic
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
import { SelectUserModal } from "../SelectUserModal"
import { Search, X, User, Calendar, Filter } from "lucide-react"
import { STATUS_OPTIONS, PRIORITY_OPTIONS, OVERDUE_OPTIONS } from "./constants"
import { formatDateInArabic } from "@/lib/utils/date"
import type { UseTasksParams } from "@/features/tasks"
import type { UserResource } from "@/features/users"

export interface DeletedTasksFiltersProps {
  filters: UseTasksParams
  onFiltersChange: (filters: UseTasksParams) => void
  isLoading?: boolean
  assignedUser?: UserResource | null
  onAssignedUserChange?: (user: UserResource | null) => void
}

export function DeletedTasksFilters({
  filters,
  onFiltersChange,
  isLoading = false,
  assignedUser,
  onAssignedUserChange,
}: DeletedTasksFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || "")
  const [status, setStatus] = useState<"pending" | "in_progress" | "completed" | "cancelled" | "all">(
    filters.status || "all"
  )
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent" | "all">(
    filters.priority || "all"
  )
  const [overdue, setOverdue] = useState<"true" | "false" | "all">(
    filters.overdue !== undefined ? String(filters.overdue) : "all"
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

    // Overdue
    if (overdue !== "all") {
      newFilters.overdue = overdue === "true"
    } else {
      delete newFilters.overdue
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
  }, [status, priority, overdue, dateFrom, dateTo, assignedUser, onFiltersChange])

  const handleClear = () => {
    setLocalSearch("")
    setStatus("all")
    setPriority("all")
    setOverdue("all")
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
    
    if (overdue !== "all") {
      const overdueLabel = OVERDUE_OPTIONS.find((o) => o.value === overdue)?.label || overdue
      filters.push({
        key: "overdue",
        label: `التأخير: ${overdueLabel}`,
        onRemove: () => setOverdue("all"),
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
  }, [localSearch, status, priority, overdue, dateFrom, dateTo, assignedUser, onAssignedUserChange])

  return (
    <>
      <div className="space-y-3">
        {/* Search and Date Range Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في المهام المحذوفة..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pr-9"
              disabled={isLoading}
            />
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

          {/* Date From */}
         <div className="grid grid-cols-2 gap-3">
         <TaskDatePicker
            value={dateFrom}
            onChange={(date) => setDateFrom(date)}
            placeholder="من تاريخ"
            disabled={isLoading}
          />

          {/* Date To */}
          <TaskDatePicker
            value={dateTo}
            onChange={(date) => setDateTo(date)}
            placeholder="إلى تاريخ"
            disabled={isLoading}
          />

         </div>
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

          {/* Overdue Filter */}
          <Select
            value={overdue}
            onValueChange={(value) => setOverdue(value as typeof overdue)}
            disabled={isLoading}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="التأخير" />
            </SelectTrigger>
            <SelectContent>
              {OVERDUE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Assigned User Filter */}
          <Button
            variant="outline"
            onClick={() => setSelectUserModalOpen(true)}
            disabled={isLoading}
            className="h-9 justify-start"
          >
            <User className="h-4 w-4 ml-2" />
            {assignedUser ? assignedUser.name : "المسند إلى"}
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
