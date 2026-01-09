"use client"

/**
 * DeleteUserModal - Modal for confirming user deletion
 * 
 * Responsibilities:
 * - Display confirmation dialog for user deletion
 * - Show user information
 * - Handle deletion confirmation
 * 
 * Rules:
 * - UI only - no business logic
 * - Uses onConfirm callback for deletion
 */

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, User, X, AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface DeleteUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  userAvatar?: string | null
  isLoading: boolean
  onConfirm: () => void
}

export function DeleteUserModal({
  open,
  onOpenChange,
  userName,
  userAvatar,
  isLoading,
  onConfirm,
}: DeleteUserModalProps) {
  const getUserInitials = () => {
    const names = userName.split(" ")
    if (names.length >= 2) {
      return `${names[0]?.charAt(0) || ""}${names[1]?.charAt(0) || ""}`.toUpperCase()
    }
    return userName.charAt(0).toUpperCase()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Fixed Header with Gradient Background */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3 shadow-lg border border-[#E2C992]/30">
                <Trash2 className="h-6 w-6 drop-shadow-[0_0_4px_rgba(226,201,146,0.6)]" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  حذف المستخدم
                </DialogTitle>
                <DialogDescription className="text-white/80 mt-1">
                  تأكيد حذف المستخدم من النظام
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
        <div className="p-6 space-y-6">
          {/* Warning Message */}
          <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 shadow-sm">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 drop-shadow-[0_0_2px_rgba(226,201,146,0.3)]" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                تحذير: هذا الإجراء لا يمكن التراجع عنه
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                سيتم حذف المستخدم بشكل نهائي من النظام. لا يمكن استعادة البيانات المحذوفة.
              </p>
            </div>
          </div>

          {/* User Info Card */}
          <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-red-200 dark:ring-red-800 shadow-lg">
                <AvatarImage src={userAvatar || ""} alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white text-xl font-bold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">المستخدم</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {userName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  سيتم حذف هذا المستخدم بشكل نهائي
                </p>
              </div>
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
                className="h-11 px-6 border-2 border-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium"
              >
                إلغاء
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className="h-11 px-8 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-red-600/50 transition-all duration-300 font-medium relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                {isLoading ? (
                  <div className="flex items-center gap-2 relative z-10">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>جاري الحذف...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 relative z-10">
                    <Trash2 className="h-4 w-4" />
                    <span>حذف المستخدم</span>
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
