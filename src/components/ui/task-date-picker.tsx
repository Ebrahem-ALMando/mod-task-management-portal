"use client"

/**
 * TaskDatePicker - Custom date picker component for tasks
 * 
 * Responsibilities:
 * - Display beautiful date picker matching visual identity
  * - Handle date selection with quick presets
 * - Disable past dates
 * 
 * Rules:
 * - UI only - no business logic
 * - Reusable component
 */

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDateInArabic } from "@/lib/utils/date"

export interface TaskDatePickerProps {
  value?: Date | null
  onChange: (date: Date | null) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

const quickPresets = [
  { label: "3 أيام", days: 3 },
  { label: "أسبوع", days: 7 },
  { label: "شهر", days: 30 },
] as const

export function TaskDatePicker({
  value,
  onChange,
  disabled = false,
  className,
  placeholder = "اختر تاريخ الاستحقاق",
}: TaskDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [showCustom, setShowCustom] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(value || undefined)

  React.useEffect(() => {
    if (value) {
      setMonth(value)
    } else {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      setMonth(tomorrow)
    }
  }, [value, open])

  const handlePresetClick = (days: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const futureDate = new Date(today)
    futureDate.setDate(today.getDate() + days)
    onChange(futureDate)
    setOpen(false)
    setShowCustom(false)
  }

  const handleCustomDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date)
      setOpen(false)
      setShowCustom(false)
    }
  }

  const getTomorrow = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  }

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) {
        setShowCustom(false)
      }
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full h-12 text-sm justify-start text-right font-normal border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md bg-white dark:bg-gray-900",
            !value && "text-muted-foreground",
            value && "text-gray-900 dark:text-white",
            className
          )}
        >
          <CalendarIcon className={cn(
            "ml-2 h-4 w-4 transition-colors",
            value ? "text-primary dark:text-[#E2C992]" : "text-gray-400 dark:text-gray-500"
          )} />
          <span className={cn(
            "flex-1 text-right",
            value ? "font-medium" : "font-normal"
          )}>
            {value ? formatDateInArabic(value) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-white dark:bg-gray-900 border-2 border-primary/20 shadow-2xl" 
        align="start" 
        dir="rtl"
      >
        {!showCustom ? (
          <>
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 dark:from-primary/10 dark:via-primary/5 dark:to-primary/10 border-b border-primary/10">
              <div className="flex items-center justify-center gap-2 text-primary dark:text-[#E2C992]">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm font-semibold">اختر تاريخ الاستحقاق</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <Clock className="h-3 w-3" />
                <span>اختيار سريع</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {quickPresets.map((preset) => {
                  const presetDate = new Date()
                  presetDate.setDate(presetDate.getDate() + preset.days)
                  presetDate.setHours(0, 0, 0, 0)
                  
                  return (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => handlePresetClick(preset.days)}
                      disabled={disabled}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all duration-200 text-center",
                        "hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10",
                        "border-gray-200 dark:border-gray-700",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {preset.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateInArabic(presetDate).split("،")[0]}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Custom Date Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCustom(true)}
                disabled={disabled}
                className="w-full h-10 text-sm border-2 border-primary/30 hover:border-primary"
              >
                <CalendarIcon className="ml-2 h-4 w-4 " />
                اختيار تاريخ مخصص
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Header with Back Button */}
            <div className="p-4 bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 dark:from-primary/10 dark:via-primary/5 dark:to-primary/10 border-b border-primary/10">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustom(false)}
                  className="h-8 px-2 text-xs mt-4"
                >
                  ← رجوع
                </Button>
                <div className="flex items-center gap-2 text-primary dark:text-[#E2C992]">
                  <CalendarIcon className="h-4 w-4 mt-4" />
                  <span className="text-sm font-semibold mt-4">اختيار تاريخ مخصص</span>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <Calendar
              mode="single"
              selected={value || undefined}
              onSelect={handleCustomDateSelect}
              disabled={(date) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                date.setHours(0, 0, 0, 0)
                return date <= today
              }}
              month={month}
              onMonthChange={setMonth}
              captionLayout="dropdown"
              fromYear={new Date().getFullYear()}
              toYear={new Date().getFullYear() + 10}
              formatters={{
                formatMonthDropdown: (date) => {
                  return date.toLocaleString("ar-SA", { month: "short" })
                },
                formatYearDropdown: (date) => {
                  return date.getFullYear().toString()
                },
              }}
              initialFocus
              className="p-4"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center mb-4",
                caption_label: "hidden",
                nav: "flex items-center justify-between absolute top-2 left-0 right-0 px-1",
                nav_button: cn(
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-md transition-all",
                  "border border-gray-200 dark:border-gray-700"
                ),
                nav_button_previous: "absolute left-0",
                nav_button_next: "absolute right-0",
                dropdowns: "flex items-center gap-2 justify-center",
                dropdown_root: "border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-900 text-sm",
                dropdown: "text-sm",
                table: "w-full border-collapse space-y-1",
                head_row: "flex mb-2",
                head_cell: "text-muted-foreground rounded-md w-9 font-medium text-xs text-gray-600 dark:text-gray-400",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-r-md last:[&:has([aria-selected])]:rounded-l-md focus-within:relative focus-within:z-20",
                day: cn(
                  "h-9 w-9 p-0 font-normal rounded-md transition-all hover:bg-primary/10 dark:hover:bg-primary/20",
                  "aria-selected:opacity-100"
                ),
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold shadow-md",
                day_today: "bg-accent text-accent-foreground font-semibold border-2 border-primary/30",
                day_outside: "day-outside text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed hover:bg-transparent",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
