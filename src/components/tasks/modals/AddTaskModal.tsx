"use client"

/**
 * AddTaskModal - Modal for adding/editing tasks
 * 
 * Responsibilities:
 * - Display form for adding/editing tasks
 * - Handle form validation
 * - Submit task data
 * 
 * Rules:
 * - UI only - no business logic
 * - Uses onSubmit callback for data submission
 */

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Plus, X, CheckCircle, Loader2, CalendarIcon, AlertCircle, User, FileText, Clock, Circle, Tag } from "lucide-react"
import { toast } from "@/components/ui/custom-toast-with-icons"
import { cn } from "@/lib/utils"
import { formatDateInArabic, getDaysBetween, formatDaysRemaining } from "@/lib/utils/date"
import { useUsers } from "@/features/users"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TaskDatePicker } from "@/components/ui/task-date-picker"
import { SelectUserModal } from "./SelectUserModal"
import type { TaskResource } from "@/features/tasks"
import type { ApiError } from "@/lib/api/api.types"
import type { UserResource } from "@/features/users"

export interface AddTaskFormData {
  title: string
  description?: string
  priority: "low" | "medium" | "high" | "urgent"
  due_date: string
  assigned_to_user_id: number
}

export interface AddTaskModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  task?: TaskResource | null
  mode?: "add" | "edit"
  onSubmit: (taskData: AddTaskFormData) => Promise<void>
  isLoading?: boolean
}

const priorityOptions = [
  { 
    value: "low", 
    label: "منخفضة", 
    color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    hoverColor: "hover:bg-gray-500/20",
    icon: Circle,
    iconColor: "text-gray-600 dark:text-gray-400",
  },
  { 
    value: "medium", 
    label: "متوسطة", 
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    hoverColor: "hover:bg-blue-500/20",
    icon: Tag,
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  { 
    value: "high", 
    label: "عالية", 
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
    hoverColor: "hover:bg-orange-500/20",
    icon: AlertCircle,
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  { 
    value: "urgent", 
    label: "عاجلة", 
    color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    hoverColor: "hover:bg-red-500/20",
    icon: AlertCircle,
    iconColor: "text-red-600 dark:text-red-400",
  },
]

export function AddTaskModal({
  open,
  onOpenChange,
  task,
  mode = "add",
  onSubmit,
  isLoading = false,
}: AddTaskModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const openState = open !== undefined ? open : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const [dueDateInput, setDueDateInput] = useState<string>("")
  const [selectUserModalOpen, setSelectUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserResource | null>(null)
  const [originalDueDate, setOriginalDueDate] = useState<string | null>(null) // Store original due date for edit mode

  const [formData, setFormData] = useState<AddTaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    assigned_to_user_id: 0,
  })

  const isEditing = mode === "edit"

  // Fetch users for assignment (only department role, active) - only for initial load
  const { users } = useUsers({
    role: "department",
    is_active: true,
  })

  useEffect(() => {
    if (task && openState) {
      const taskDueDate = task.due_date || ""
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        due_date: taskDueDate,
        assigned_to_user_id: task.assigned_to?.id || 0,
      })
      // Store original due date for comparison
      setOriginalDueDate(taskDueDate)
      if (task.due_date) {
        // Convert ISO date to YYYY-MM-DD format for input
        const date = new Date(task.due_date)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        setDueDateInput(`${year}-${month}-${day}`)
      } else {
        setDueDateInput("")
      }
      // Set selected user if exists
      if (task.assigned_to) {
        setSelectedUser(task.assigned_to)
      }
    } else if (openState) {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        assigned_to_user_id: 0,
      })
      setDueDateInput("")
      setSelectedUser(null)
      setOriginalDueDate(null) // Reset original due date for add mode
    }
  }, [task, openState])

  // Update due_date when date input changes
  useEffect(() => {
    if (dueDateInput) {
      // Convert YYYY-MM-DD to ISO string
      const date = new Date(dueDateInput + "T00:00:00")
      if (!isNaN(date.getTime())) {
        setFormData((prev) => ({ ...prev, due_date: date.toISOString() }))
      }
    } else {
      setFormData((prev) => ({ ...prev, due_date: "" }))
    }
  }, [dueDateInput])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim()) {
      return
    }

    if (!formData.due_date) {
      return
    }

    if (!formData.assigned_to_user_id) {
      return
    }

    // Check if due_date is in the future (only if date was changed or in add mode)
    if (formData.due_date) {
      // Only validate if:
      // 1. We're in add mode (originalDueDate is null), OR
      // 2. The date has actually changed from the original
      let dateChanged = true
      
      if (isEditing && originalDueDate) {
        // Compare dates by normalizing them to YYYY-MM-DD format
        const currentDate = new Date(formData.due_date)
        const originalDate = new Date(originalDueDate)
        
        // Normalize to YYYY-MM-DD for comparison
        const currentDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`
        const originalDateStr = `${originalDate.getFullYear()}-${String(originalDate.getMonth() + 1).padStart(2, "0")}-${String(originalDate.getDate()).padStart(2, "0")}`
        
        dateChanged = currentDateStr !== originalDateStr
      }
      
      if (dateChanged) {
        const selectedDate = new Date(formData.due_date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        selectedDate.setHours(0, 0, 0, 0)
        if (selectedDate <= today) {
          toast({
            title: "خطأ في التحقق",
            description: "تاريخ الاستحقاق يجب أن يكون في المستقبل",
            variant: "error",
          })
          return
        }
      }
    }

    try {
      await onSubmit(formData)
      setOpen(false)
      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        assigned_to_user_id: 0,
      })
      setDueDateInput("")
    } catch (err) {
      // Error handling: Show toast for 4xx errors (422, etc.)
      const apiError = err as ApiError

      if (apiError?.status >= 400 && apiError.status < 500) {
        // Extract error message from validation errors if available
        let errorMessage = apiError.message || "حدث خطأ في التحقق من البيانات"

        // If there are field-specific errors, use the first one
        if (apiError.errors) {
          const firstErrorField = Object.keys(apiError.errors)[0]
          const firstErrorMessages = apiError.errors[firstErrorField]
          if (firstErrorMessages && firstErrorMessages.length > 0) {
            errorMessage = firstErrorMessages[0]
          }
        }

        // Show toast for client errors (4xx)
        toast({
          title: "خطأ في التحقق",
          description: errorMessage,
          variant: "error",
        })
      }
      // For 500+ errors, ActionToastListener will show toast automatically
    }
  }

  const handleClose = () => {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        assigned_to_user_id: 0,
      })
      setDueDateInput("")
      setSelectedUser(null)
      setOpen(false)
  }

  const handleUserSelect = (user: UserResource) => {
    setSelectedUser(user)
    setFormData((prev) => ({ ...prev, assigned_to_user_id: user.id }))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const selectedPriority = priorityOptions.find((p) => p.value === formData.priority)

  return (
    <Dialog
      open={openState}
      onOpenChange={(open) => {
        if (!open) {
          setOpen(false)
        }
      }}
    >
      <DialogContent className="xl:max-w-[60%] max-h-[90vh] p-0 overflow-hidden">
        {/* Fixed Header with Gradient Background */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-primary via-primary/90 to-primary dark:from-primary dark:via-primary/80 dark:to-primary p-6 text-primary-foreground shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3 shadow-lg border border-[#E2C992]/30">
                <Plus className="h-6 w-6 drop-shadow-[0_0_4px_rgba(226,201,146,0.6)]" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {isEditing ? "تعديل المهمة" : "إضافة مهمة جديدة"}
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80 mt-1">
                  {isEditing
                    ? "قم بتعديل بيانات المهمة"
                    : "أضف مهمة جديدة إلى النظام"}
                </DialogDescription>
              </div>
            </div>
            {/* Close Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-200"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 pb-20 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form id="task-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6">
              {/* Title */}
              <div className="group space-y-3">
                <Label
                  htmlFor="title"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-[#E2C992] transition-colors"
                >
                  <div className="p-1 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
                    <FileText className="h-4 w-4 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.5)]" />
                  </div>
                  العنوان
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="title"
                    placeholder="أدخل عنوان المهمة..."
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="h-12 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                    required
                    disabled={isLoading}
                  />
                  {formData.title && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="group space-y-3">
                <Label
                  htmlFor="description"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-[#E2C992] transition-colors"
                >
                  <div className="p-1 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
                    <FileText className="h-4 w-4 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.5)]" />
                  </div>
                  الوصف
                </Label>
                <Textarea
                  id="description"
                  placeholder="أدخل وصف المهمة..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="min-h-[100px] text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                  disabled={isLoading}
                />
              </div>

              {/* Priority */}
              <div className="group space-y-3">
                <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-[#E2C992] transition-colors">
                  <div className="p-1 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
                    <AlertCircle className="h-4 w-4 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.5)]" />
                  </div>
                  الأولوية
                  <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {priorityOptions.map((option) => {
                    const OptionIcon = option.icon
                    const isSelected = formData.priority === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: option.value as "low" | "medium" | "high" | "urgent" })}
                        disabled={isLoading}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all duration-200 text-center relative",
                          "flex flex-col items-center gap-2",
                          isSelected
                            ? cn("ring-2 ring-primary shadow-lg", option.color, option.hoverColor)
                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50",
                          isLoading && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <OptionIcon className={cn(
                          "h-6 w-6",
                          isSelected ? option.iconColor : "text-gray-500 dark:text-gray-400"
                        )} />
                        <span className={cn(
                          "text-sm font-semibold",
                          isSelected ? option.color.split(" ")[1] : "text-gray-700 dark:text-gray-300"
                        )}>
                          {option.label}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <div className="h-5 w-5 rounded-full bg-primary dark:bg-[#E2C992] flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Due Date */}
              <div className="group space-y-3">
                <Label 
                  htmlFor="due_date"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-[#E2C992] transition-colors"
                >
                  <div className="p-1 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
                    <CalendarIcon className="h-4 w-4 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.5)]" />
                  </div>
                  تاريخ الاستحقاق
                  <span className="text-red-500">*</span>
                </Label>
                <TaskDatePicker
                  value={dueDateInput ? new Date(dueDateInput + "T00:00:00") : null}
                  onChange={(date) => {
                    if (date) {
                      const year = date.getFullYear()
                      const month = String(date.getMonth() + 1).padStart(2, "0")
                      const day = String(date.getDate()).padStart(2, "0")
                      setDueDateInput(`${year}-${month}-${day}`)
                    } else {
                      setDueDateInput("")
                    }
                  }}
                  disabled={isLoading}
                  placeholder="اختر تاريخ الاستحقاق"
                />
                {dueDateInput && (() => {
                  const selectedDate = new Date(dueDateInput + "T00:00:00")
                  const daysRemaining = getDaysBetween(selectedDate, new Date())
                  return (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                      {formatDaysRemaining(daysRemaining)}
                    </p>
                  )
                })()}
              </div>

              {/* Assigned To */}
              <div className="group space-y-3">
                <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-[#E2C992] transition-colors">
                  <div className="p-1 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
                    <User className="h-4 w-4 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.5)]" />
                  </div>
                  المسند إليه
                  <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectUserModalOpen(true)}
                  disabled={isLoading}
                  className={cn(
                    "w-full h-12 text-sm justify-start text-right font-normal border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md bg-white dark:bg-gray-900",
                    !selectedUser && "text-muted-foreground",
                    selectedUser && "text-gray-900 dark:text-white"
                  )}
                >
                  {selectedUser ? (
                    <div className="flex items-center gap-2 w-full">
                      <Avatar className="h-6 w-6">
                        {selectedUser.avatar_url ? (
                          <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.name} />
                        ) : (
                          <AvatarFallback className="text-xs">
                            {getInitials(selectedUser.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="flex-1 text-right font-medium">{selectedUser.name}</span>
                    </div>
                  ) : (
                    <>
                      <User className={cn(
                        "ml-2 h-4 w-4 transition-colors",
                        "text-gray-400 dark:text-gray-500"
                      )} />
                      <span className="flex-1 text-right">اختر المستخدم</span>
                    </>
                  )}
                </Button>
                {selectedUser && (
                  <div className="mt-2 p-3 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-primary">
                        {selectedUser.avatar_url ? (
                          <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.name} />
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(selectedUser.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {selectedUser.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedUser.username}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="sticky z-10 bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
          <div className="p-6 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between gap-4">
              {/* Status Info */}
              {selectedPriority && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full border", selectedPriority.color)}>
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">الأولوية: {selectedPriority.label}</span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="h-11 px-6 border-2 border-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium"
                  disabled={isLoading}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  form="task-form"
                  className="h-11 px-8 bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 dark:from-primary dark:via-primary/90 dark:to-primary dark:hover:from-primary/90 dark:hover:via-primary dark:hover:to-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 font-medium relative overflow-hidden group"
                  disabled={isLoading}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  {isLoading ? (
                    <div className="flex items-center gap-2 relative z-10">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>جاري الحفظ...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 relative z-10">
                      <Plus className="h-4 w-4" />
                      {isEditing ? "حفظ التغييرات" : "إضافة المهمة"}
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Select User Modal */}
      <SelectUserModal
        open={selectUserModalOpen}
        onOpenChange={setSelectUserModalOpen}
        selectedUserId={formData.assigned_to_user_id || undefined}
        onSelect={handleUserSelect}
        isLoading={isLoading}
      />
    </Dialog>
  )
}
