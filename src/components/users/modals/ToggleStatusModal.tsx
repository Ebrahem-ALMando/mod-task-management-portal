"use client"

/**
 * ToggleStatusModal - Modal for toggling user active status
 * 
 * Responsibilities:
 * - Display confirmation dialog for toggling user status
 * - Show user information and status change
 * - Handle status toggle confirmation
 * 
 * Rules:
 * - UI only - no business logic
 * - Uses onConfirm callback for status toggle
 */

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Power, PowerOff, User, X } from "lucide-react"

export interface ToggleStatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  isActive: boolean
  isLoading: boolean
  onConfirm: () => void
}

export function ToggleStatusModal({
  open,
  onOpenChange,
  userName,
  isActive,
  isLoading,
  onConfirm,
}: ToggleStatusModalProps) {
  const isActivating = !isActive
  const title = isActivating ? "تنشيط المستخدم" : "إلغاء تنشيط المستخدم"
  const description = isActivating
    ? `هل أنت متأكد من تنشيط المستخدم "${userName}"؟`
    : `هل أنت متأكد من إلغاء تنشيط المستخدم "${userName}"؟`
  const confirmText = isActivating ? "تنشيط" : "إلغاء التنشيط"
  const Icon = isActivating ? Power : PowerOff
  const iconColor = isActivating ? "text-green-600" : "text-red-600"
  const bgColor = isActivating
    ? "bg-green-50 dark:bg-green-900/20"
    : "bg-red-50 dark:bg-red-900/20"
  const borderColor = isActivating
    ? "border-green-200 dark:border-green-800"
    : "border-red-200 dark:border-red-800"
  const textColor = isActivating
    ? "text-green-800 dark:text-green-200"
    : "text-red-800 dark:text-red-200"
  const headerGradient = isActivating
    ? "bg-gradient-to-r from-green-600 via-green-700 to-green-800"
    : "bg-gradient-to-r from-red-600 via-red-700 to-red-800"
  const buttonGradient = isActivating
    ? "bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900"
    : "bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Fixed Header with Gradient Background */}
        <div className={`sticky top-0 z-10 ${headerGradient} p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3 shadow-lg border border-[#E2C992]/30">
                <Icon className="h-6 w-6 drop-shadow-[0_0_4px_rgba(226,201,146,0.6)]" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
                <DialogDescription className="text-white/80 mt-1">
                  {description}
                </DialogDescription>
              </div>
            </div>
            {/* Close Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-200"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className={`p-4 ${bgColor} rounded-lg border ${borderColor}`}>
            <div className="flex items-center gap-2">
              <User className={`h-5 w-5 ${iconColor}`} />
              <span className={`text-sm font-medium ${textColor}`}>
                {isActivating
                  ? "سيتمكن المستخدم من الوصول إلى النظام بعد التنشيط."
                  : "لن يتمكن المستخدم من الوصول إلى النظام بعد إلغاء التنشيط."}
              </span>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="sticky z-10 bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
          <div className="p-6 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="h-11 px-6 border-2 border-gray-300  dark:border-gray-600  rounded-xl transition-all duration-200 font-medium"
              >
                إلغاء
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className={`h-11 px-8 ${buttonGradient} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium relative overflow-hidden group`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                {isLoading ? (
                  <div className="flex items-center gap-2 relative z-10">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>جاري المعالجة...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 relative z-10">
                    <Icon className="h-4 w-4" />
                    <span>{confirmText}</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
