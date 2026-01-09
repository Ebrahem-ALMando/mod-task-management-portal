"use client"

/**
 * AddUserModal - Modal for adding/editing users
 * 
 * Responsibilities:
 * - Display form for adding/editing users
 * - Handle form validation
 * - Submit user data
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserPlus, X, Mail, Phone, Lock, User, Eye, EyeOff, CheckCircle, Loader2, Power, PowerOff } from "lucide-react"
import { toast } from "@/components/ui/custom-toast-with-icons"
import { roleConfig } from "@/components/layout/UserProfile/roleConfig"
import { cn } from "@/lib/utils"
import type { UserResource } from "@/features/users"
import type { ApiError } from "@/lib/api/api.types"

export interface AddUserFormData {
  username: string
  name: string
  password: string
  role: "admin" | "department"
  is_active: boolean
}

export interface AddUserModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  user?: UserResource | null
  mode?: "add" | "edit"
  onSubmit: (userData: AddUserFormData) => Promise<void>
  isLoading?: boolean
}

export function AddUserModal({
  open,
  onOpenChange,
  user,
  mode = "add",
  onSubmit,
  isLoading = false,
}: AddUserModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const openState = open !== undefined ? open : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState<AddUserFormData>({
    username: "",
    name: "",
    password: "",
    role: "department",
    is_active: true,
  })

  const isEditing = mode === "edit"

  useEffect(() => {
    if (user && openState) {
      setFormData({
        username: user.username || "",
        name: user.name || "",
        password: "",
        role: user.role || "department",
        is_active: user.is_active ?? true,
      })
    } else if (openState) {
      setFormData({
        username: "",
        name: "",
        password: "",
        role: "department",
        is_active: true,
      })
    }
  }, [user, openState])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      return
    }

    if (!formData.username.trim()) {
      return
    }

    if (!isEditing && !formData.password.trim()) {
      return
    }

    if (formData.password && formData.password.length < 8) {
      return
    }

    try {
      // Prepare data - don't send password if empty in edit mode
      const dataToSubmit = { ...formData }
      if (isEditing && !dataToSubmit.password) {
        // Remove password from data if empty in edit mode
        const { password, ...rest } = dataToSubmit
        await onSubmit(rest as AddUserFormData)
      } else {
        await onSubmit(dataToSubmit)
      }
      
      setOpen(false)
      // Reset form
      setFormData({
        username: "",
        name: "",
        password: "",
        role: "department",
        is_active: true,
      })
    } catch (err) {
      // Error handling: Show toast for 4xx errors (422, etc.)
      // ActionToastListener only shows toast for 500+ errors
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
        
        // Show toast for client errors (4xx) - like "اسم المستخدم مستخدم بالفعل"
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
      username: "",
      name: "",
      password: "",
      role: "department",
      is_active: true,
    })
    setOpen(false)
  }

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
        <div className="sticky top-0 z-10 bg-gradient-to-r from-primary via-primary/90 to-primary dark:from-primary dark:via-primary/80 dark:to-primary p-6 text-primary-foreground shadow-lg ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3 shadow-lg border border-[#E2C992]/30">
                <UserPlus className="h-6 w-6 drop-shadow-[0_0_4px_rgba(226,201,146,0.6)]" />
              </div>
              <div >
                <DialogTitle className="text-2xl font-bold">
                  {isEditing ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80 mt-1">
                  {isEditing
                    ? "قم بتعديل بيانات المستخدم"
                    : "أضف مستخدم جديد إلى النظام"}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              {formData.is_active && (
                <div className="flex items-center gap-2 bg-green-500/30 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/30 shadow-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">نشط</span>
                </div>
              )}
              {!formData.is_active && (
                <div className="flex items-center gap-2 bg-red-500/30 backdrop-blur-sm px-4 py-2 rounded-full border border-red-400/30 shadow-lg">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm font-semibold">غير نشط</span>
                </div>
              )}
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
        </div>

        {/* Scrollable Content */}
        <div className="p-6 pb-20 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form id="user-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6">
              {/* Name */}
              <div className="group space-y-3">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-[#E2C992] transition-colors"
                >
                  <div className="p-1 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
                    <User className="h-4 w-4 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.5)]" />
                  </div>
                  الاسم
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="أدخل الاسم..."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-12 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                    required
                    disabled={isLoading}
                  />
                  {formData.name && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="group space-y-3">
                <Label
                  htmlFor="username"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-[#E2C992] transition-colors"
                >
                  <div className="p-1 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
                    <User className="h-4 w-4 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.5)]" />
                  </div>
                  اسم المستخدم
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="أدخل اسم المستخدم..."
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="h-12 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                    required
                    disabled={isLoading}
                  />
                  {formData.username && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="group space-y-3">
                <Label
                  htmlFor="password"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-[#E2C992] transition-colors"
                >
                  <div className="p-1 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
                    <Lock className="h-4 w-4 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.5)]" />
                  </div>
                  كلمة المرور
                  {!isEditing && <span className="text-red-500">*</span>}
                  {isEditing && (
                    <span className="text-xs text-gray-500">
                      (اتركه فارغاً إذا لم تريد تغييره)
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.3)]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      isEditing
                        ? "اتركه فارغاً إذا لم تريد تغييره..."
                        : "أدخل كلمة المرور (8 أحرف على الأقل)..."
                    }
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="h-12 pr-10 pl-10 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                    required={!isEditing}
                    disabled={isLoading}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-primary dark:text-[#E2C992] hover:text-primary/80 dark:hover:text-[#E2C992]/80 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {formData.password && formData.password.length >= 8 && (
                    <div className="absolute left-12 top-1/2 -translate-y-1/2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className="group space-y-3">
                <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-[#E2C992] transition-colors">
                  <div className="p-1 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
                    <CheckCircle className="h-4 w-4 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.5)]" />
                  </div>
                  الصلاحية
                  <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value: "admin" | "department") =>
                    setFormData({ ...formData, role: value })
                  }
                  disabled={isLoading}
                  className="grid grid-cols-2 gap-4"
                >
                  {Object.entries(roleConfig).map(([roleKey, role]) => {
                    const RoleIcon = role.icon
                    const isSelected = formData.role === roleKey
                    return (
                      <label
                        key={roleKey}
                        className={cn(
                          "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all duration-300",
                          isSelected
                            ? "border-primary bg-primary/10 dark:border-[#E2C992] dark:bg-primary/20 shadow-lg shadow-primary/20 dark:shadow-[#E2C992]/20"
                            : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:border-primary/50 dark:hover:border-[#E2C992]/50 hover:bg-primary/5 dark:hover:bg-primary/10",
                          isLoading && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <RadioGroupItem
                          value={roleKey}
                          id={`role-${roleKey}`}
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            "rounded-lg p-3 transition-all duration-300",
                            isSelected
                              ? role.bgColor + " " + role.hoverBgColor
                              : "bg-gray-100 dark:bg-gray-700"
                          )}
                        >
                          <RoleIcon
                            className={cn(
                              "h-6 w-6 transition-all duration-300",
                              isSelected
                                ? role.iconColor
                                : "text-gray-500 dark:text-gray-400"
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-sm font-semibold transition-colors",
                            isSelected
                              ? role.textColor
                              : "text-gray-600 dark:text-gray-400"
                          )}
                        >
                          {role.label}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 left-2">
                            <CheckCircle className="h-5 w-5 text-primary dark:text-[#E2C992]" />
                          </div>
                        )}
                      </label>
                    )
                  })}
                </RadioGroup>
              </div>

              {/* Status */}
              <div className="group space-y-3">
                <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-[#E2C992] transition-colors">
                  <div className="p-1 rounded-md bg-gradient-to-br from-primary/10 to-[#E2C992]/10 dark:from-primary/20 dark:to-[#E2C992]/20 border border-[#E2C992]/20">
                    <CheckCircle className="h-4 w-4 text-primary dark:text-[#E2C992] drop-shadow-[0_0_2px_rgba(226,201,146,0.5)]" />
                  </div>
                  الحالة
                </Label>
                <RadioGroup
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={(value: "active" | "inactive") =>
                    setFormData({
                      ...formData,
                      is_active: value === "active",
                    })
                  }
                  disabled={isLoading}
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Active Status */}
                  <label
                    className={cn(
                      "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all duration-300",
                      formData.is_active
                        ? "border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/20 shadow-lg shadow-green-500/20 dark:shadow-green-400/20"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:border-green-500/50 dark:hover:border-green-400/50 hover:bg-green-50/50 dark:hover:bg-green-900/10",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <RadioGroupItem
                      value="active"
                      id="status-active"
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "rounded-lg p-3 transition-all duration-300",
                        formData.is_active
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-gray-100 dark:bg-gray-700"
                      )}
                    >
                      <Power
                        className={cn(
                          "h-6 w-6 transition-all duration-300",
                          formData.is_active
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold transition-colors",
                        formData.is_active
                          ? "text-green-700 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400"
                      )}
                    >
                      نشط
                    </span>
                    {formData.is_active && (
                      <div className="absolute top-2 left-2">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                  </label>

                  {/* Inactive Status */}
                  <label
                    className={cn(
                      "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all duration-300",
                      !formData.is_active
                        ? "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/20 shadow-lg shadow-red-500/20 dark:shadow-red-400/20"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:border-red-500/50 dark:hover:border-red-400/50 hover:bg-red-50/50 dark:hover:bg-red-900/10",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <RadioGroupItem
                      value="inactive"
                      id="status-inactive"
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "rounded-lg p-3 transition-all duration-300",
                        !formData.is_active
                          ? "bg-red-100 dark:bg-red-900/30"
                          : "bg-gray-100 dark:bg-gray-700"
                      )}
                    >
                      <PowerOff
                        className={cn(
                          "h-6 w-6 transition-all duration-300",
                          !formData.is_active
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-500 dark:text-gray-400"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold transition-colors",
                        !formData.is_active
                          ? "text-red-700 dark:text-red-400"
                          : "text-gray-600 dark:text-gray-400"
                      )}
                    >
                      غير نشط
                    </span>
                    {!formData.is_active && (
                      <div className="absolute top-2 left-2">
                        <CheckCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                  </label>
                </RadioGroup>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="sticky z-10 bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
          <div className="p-6 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between gap-4">
              {/* Status Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                {formData.is_active ? (
                  <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-green-700 dark:text-green-400">
                      المستخدم سيتم إنشاؤه كحساب نشط
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-full border border-red-200 dark:border-red-800">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-red-700 dark:text-red-400">
                      المستخدم سيتم إنشاؤه كحساب غير نشط
                    </span>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="h-11 px-6 border-2 border-gray-300  dark:border-gray-600 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium"
                  disabled={isLoading}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  form="user-form"
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
                      <UserPlus className="h-4 w-4" />
                      {isEditing ? "حفظ التغييرات" : "إضافة المستخدم"}
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
