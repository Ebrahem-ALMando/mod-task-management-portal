"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Edit3, List } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomDatePickerProps {
  value?: Date | null
  onChange: (date: Date | null) => void
  label?: string
  required?: boolean
  className?: string
  disabled?: boolean
  fromYear?: number
  toYear?: number
}

export function CustomDatePicker({
  value,
  onChange,
  label,
  required = false,
  className,
  disabled = false,
  fromYear = 1900,
  toYear = new Date().getFullYear(),
}: CustomDatePickerProps) {
  const [day, setDay] = React.useState<string>(value ? value.getDate().toString().padStart(2, "0") : "")
  const [month, setMonth] = React.useState<string>(value ? (value.getMonth() + 1).toString().padStart(2, "0") : "")
  const [year, setYear] = React.useState<string>(value ? value.getFullYear().toString() : "")
  const [useInput, setUseInput] = React.useState<boolean>(false)

  // تحديث القيم عند تغيير value من الخارج
  React.useEffect(() => {
    if (value) {
      setDay(value.getDate().toString().padStart(2, "0"))
      setMonth((value.getMonth() + 1).toString().padStart(2, "0"))
      setYear(value.getFullYear().toString())
    } else {
      setDay("")
      setMonth("")
      setYear("")
    }
  }, [value])

  // إنشاء قائمة الأيام حسب الشهر والسنة
  const getDaysInMonth = (monthNum: number, yearNum: number) => {
    if (!monthNum || !yearNum) return []
    const days = new Date(yearNum, monthNum, 0).getDate()
    return Array.from({ length: days }, (_, i) => i + 1)
  }

  // إنشاء قائمة السنوات
  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i).reverse()

  // معالجة تغيير القيم
  const handleDayChange = (newDay: string) => {
    setDay(newDay)
    if (month && year) {
      updateDate(newDay, month, year)
    }
  }

  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth)
    if (day && newMonth && year) {
      // إعادة تعيين اليوم إذا كان غير صالح
      const maxDay = new Date(parseInt(year), parseInt(newMonth), 0).getDate()
      const currentDay = parseInt(day) || 1
      const validDay = currentDay > maxDay ? maxDay.toString().padStart(2, "0") : day
      setDay(validDay)
      updateDate(validDay, newMonth, year)
    } else if (newMonth && year) {
      updateDate("", newMonth, year)
    }
  }

  const handleYearChange = (newYear: string) => {
    setYear(newYear)
    if (day && month && newYear) {
      // إعادة تعيين اليوم إذا كان غير صالح
      const maxDay = new Date(parseInt(newYear), parseInt(month), 0).getDate()
      const currentDay = parseInt(day) || 1
      const validDay = currentDay > maxDay ? maxDay.toString().padStart(2, "0") : day
      setDay(validDay)
      updateDate(validDay, month, newYear)
    } else if (month && newYear) {
      updateDate("", month, newYear)
    }
  }

  const updateDate = (d: string, m: string, y: string) => {
    if (d && m && y) {
      const dayNum = parseInt(d)
      const monthNum = parseInt(m)
      const yearNum = parseInt(y)

      if (
        !isNaN(dayNum) &&
        !isNaN(monthNum) &&
        !isNaN(yearNum) &&
        dayNum >= 1 &&
        dayNum <= 31 &&
        monthNum >= 1 &&
        monthNum <= 12 &&
        yearNum >= fromYear &&
        yearNum <= toYear
      ) {
        const maxDay = new Date(yearNum, monthNum, 0).getDate()
        if (dayNum <= maxDay) {
          const date = new Date(yearNum, monthNum - 1, dayNum)
          if (date.getDate() === dayNum && date.getMonth() === monthNum - 1 && date.getFullYear() === yearNum) {
            onChange(date)
            return
          }
        }
      }
    }
    onChange(null)
  }

  const handleInputChange = (type: "day" | "month" | "year", value: string) => {
    // السماح فقط بالأرقام
    const numericValue = value.replace(/\D/g, "")
    
    if (type === "day") {
      const dayValue = numericValue.slice(0, 2)
      setDay(dayValue)
      updateDate(dayValue, month, year)
    } else if (type === "month") {
      const monthValue = numericValue.slice(0, 2)
      if (parseInt(monthValue) <= 12 || monthValue === "") {
        setMonth(monthValue)
        updateDate(day, monthValue, year)
      }
    } else if (type === "year") {
      const yearValue = numericValue.slice(0, 4)
      setYear(yearValue)
      updateDate(day, month, yearValue)
    }
  }

  const months = [
    { value: "01", label: "يناير" },
    { value: "02", label: "فبراير" },
    { value: "03", label: "مارس" },
    { value: "04", label: "أبريل" },
    { value: "05", label: "مايو" },
    { value: "06", label: "يونيو" },
    { value: "07", label: "يوليو" },
    { value: "08", label: "أغسطس" },
    { value: "09", label: "سبتمبر" },
    { value: "10", label: "أكتوبر" },
    { value: "11", label: "نوفمبر" },
    { value: "12", label: "ديسمبر" },
  ]

  const days = getDaysInMonth(parseInt(month) || 1, parseInt(year) || new Date().getFullYear())

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-violet-600 transition-colors">
          <div className="p-1 rounded-md bg-violet-100 dark:bg-violet-900/30">
            <Calendar className="h-4 w-4 text-violet-600" />
          </div>
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      {/* Toggle Button */}
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setUseInput(!useInput)}
          className="h-9 px-3 text-xs border border-gray-200 dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-all duration-200"
          disabled={disabled}
        >
          {useInput ? (
            <>
              <List className="h-3 w-3 ml-2" />
              اختيار من القوائم
            </>
          ) : (
            <>
              <Edit3 className="h-3 w-3 ml-2" />
              كتابة مباشرة
            </>
          )}
        </Button>
      </div>

      {useInput ? (
        // وضع الكتابة المباشرة
        <div className="flex items-center gap-3" dir="ltr">
          <div className="flex-1 space-y-2">
            <Label className="text-xs text-muted-foreground text-right block">اليوم</Label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="01"
              value={day}
              onChange={(e) => handleInputChange("day", e.target.value)}
              maxLength={2}
              disabled={disabled}
              className="h-12 text-center border-2 border-gray-200 dark:border-gray-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-xs text-muted-foreground text-right block">الشهر</Label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="01"
              value={month}
              onChange={(e) => handleInputChange("month", e.target.value)}
              maxLength={2}
              disabled={disabled}
              className="h-12 text-center border-2 border-gray-200 dark:border-gray-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-xs text-muted-foreground text-right block">السنة</Label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="2000"
              value={year}
              onChange={(e) => handleInputChange("year", e.target.value)}
              maxLength={4}
              disabled={disabled}
              className="h-12 text-center border-2 border-gray-200 dark:border-gray-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
            />
          </div>
        </div>
      ) : (
        // وضع الاختيار من القوائم
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground text-right block">اليوم</Label>
            <Select
              value={day}
              onValueChange={handleDayChange}
              disabled={disabled || !month || !year}
            >
              <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md">
                <SelectValue placeholder="اليوم" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                {days.map((d) => (
                  <SelectItem key={d} value={d.toString().padStart(2, "0")} className="rounded-lg">
                    {d.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground text-right block">الشهر</Label>
            <Select
              value={month}
              onValueChange={handleMonthChange}
              disabled={disabled}
            >
              <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md">
                <SelectValue placeholder="الشهر" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="rounded-lg">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground text-right block">السنة</Label>
            <Select
              value={year}
              onValueChange={handleYearChange}
              disabled={disabled}
            >
              <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md">
                <SelectValue placeholder="السنة" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()} className="rounded-lg">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {value && (
        <div className="flex items-center gap-2 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
          <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
          <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
            {value.toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      )}
    </div>
  )
}
