"use client"

/**
 * UsersFilters - Filter controls for users list
 * 
 * Responsibilities:
 * - Display filter inputs (search, role, is_active, date range)
 * - Handle filter changes with debouncing
 * - Show skeleton loader during filtering/searching
 * 
 * Rules:
 * - UI only - no logic
 * - Filters passed as props
 */

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Search, X, Filter, ChevronDown, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { formatDateRange } from "@/lib/utils/formatDateRange"
import type { UseUsersParams } from "@/features/users"
import type { DateRange } from "react-day-picker"
import { ar } from "date-fns/locale"

export interface UsersFiltersProps {
  filters: UseUsersParams
  onFiltersChange: (filters: UseUsersParams) => void
  isLoading?: boolean
}

export function UsersFilters({ filters, onFiltersChange, isLoading = false }: UsersFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || "")
  const [role, setRole] = useState<"admin" | "department" | "all">(
    filters.role || "all"
  )
  const [isActive, setIsActive] = useState<boolean | "all">(
    filters.is_active ?? "all"
  )
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (filters.from || filters.to) {
      return {
        from: filters.from ? new Date(filters.from) : undefined,
        to: filters.to ? new Date(filters.to) : undefined,
      }
    }
    return undefined
  })

  // Options for selects
  const roleOptions = [
    { value: "all", label: "جميع الصلاحيات" },
    { value: "admin", label: "مدير النظام" },
    { value: "department", label: "مستخدم" },
  ]

  const statusOptions = [
    { value: "all", label: "جميع الحالات" },
    { value: "active", label: "النشطين فقط" },
    { value: "inactive", label: "الغير نشطين" },
  ]

  // Update parent when local state changes (debounced for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      const newFilters: UseUsersParams = {}
      if (localSearch.trim()) newFilters.search = localSearch.trim()
      if (role !== "all") newFilters.role = role
      if (isActive !== "all") newFilters.is_active = isActive as boolean
      if (dateRange?.from) {
        newFilters.from = dateRange.from.toISOString()
      }
      if (dateRange?.to) {
        newFilters.to = dateRange.to.toISOString()
      }
      onFiltersChange(newFilters)
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearch, role, isActive, dateRange, onFiltersChange])

  const handleClear = () => {
    setLocalSearch("")
    setRole("all")
    setIsActive("all")
    setDateRange(undefined)
    onFiltersChange({})
  }

  const hasActiveFilters =
    Boolean(localSearch.trim()) ||
    role !== "all" ||
    isActive !== "all" ||
    Boolean(dateRange?.from) ||
    Boolean(dateRange?.to)

  const selectedRoleLabel = () => {
    const found = roleOptions.find((r) => r.value === role)
    return found?.label
  }

  const selectedStatusLabel = () => {
    if (isActive === "all") return undefined
    const found = statusOptions.find((s) => 
      (isActive === true && s.value === "active") ||
      (isActive === false && s.value === "inactive")
    )
    return found?.label
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          {isLoading ? (
            <Skeleton className="w-full h-10 rounded-md" />
          ) : (
            <Input
              placeholder="البحث في المستخدمين..."
              className="w-full pr-10"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              dir="rtl"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="h-4 w-4" />
            بحث متقدم
            <ChevronDown className={cn("h-4 w-4 transition-transform", showAdvanced && "rotate-180")} />
          </Button>
          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <X className="h-4 w-4 ml-1" />
              مسح الفلاتر
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          showAdvanced ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="grid grid-cols-1 gap-4 pt-8 pb-4 pr-4 md:grid-cols-2 border-t border-gray-200 dark:border-gray-700">
          {/* Role Filter */}
          <div className="space-y-2">
            <Select
              value={role}
              onValueChange={(value) =>
                setRole(value as "admin" | "department" | "all")
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="دور المستخدم" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Status Filter */}
          <div className="space-y-2">
            <Select
              value={isActive === "all" ? "all" : isActive ? "active" : "inactive"}
              onValueChange={(value) => {
                if (value === "all") setIsActive("all")
                else setIsActive(value === "active")
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="حالة المستخدم" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          {/* <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-right font-normal h-10",
                    !dateRange && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {formatDateRange(dateRange?.from, dateRange?.to)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div> */}
        </div>
      </div>

      {/* Active Filters Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">الفلاتر النشطة:</span>
          {localSearch.trim() && (
            <Badge variant="secondary" className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
              البحث: {localSearch}
              <button
                onClick={() => setLocalSearch("")}
                className="mr-1 hover:bg-violet-200 dark:hover:bg-violet-800 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {role !== "all" && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              الدور: {selectedRoleLabel() || role}
              <button
                onClick={() => setRole("all")}
                className="mr-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {isActive !== "all" && (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
              الحالة: {selectedStatusLabel() || (isActive ? "نشط" : "غير نشط")}
              <button
                onClick={() => setIsActive("all")}
                className="mr-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(dateRange?.from || dateRange?.to) && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              التاريخ: {dateRange?.from && new Intl.DateTimeFormat("ar-EG").format(dateRange.from)}
              {dateRange?.to && ` - ${new Intl.DateTimeFormat("ar-EG").format(dateRange.to)}`}
              <button
                onClick={() => setDateRange(undefined)}
                className="mr-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
