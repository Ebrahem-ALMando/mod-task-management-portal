"use client"

/**
 * ChangeTaskStatusModal - Modal for changing task status
 * 
 * Responsibilities:
 * - Display confirmation dialog for changing task status
 * - Show task information and status change
 * - Handle status change confirmation
 * 
 * Rules:
 * - UI only - no business logic
 * - Uses onConfirm callback for status change
 */

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, X, Clock, CheckCircle2, XCircle, AlertCircle, PlayCircle, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

export interface ChangeTaskStatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskTitle: string
  currentStatus: "pending" | "in_progress" | "completed" | "cancelled"
  newStatus?: "pending" | "in_progress" | "completed" | "cancelled"
  isLoading: boolean
  onConfirm: (newStatus: "pending" | "in_progress" | "completed" | "cancelled", reason?: string) => void
}

const statusConfig = {
  pending: {
    label: "معلقة",
    icon: Clock,
    bgColor: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    headerGradient: "bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800",
    buttonGradient: "bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 hover:from-yellow-700 hover:via-yellow-800 hover:to-yellow-900",
    hoverColor: "hover:bg-yellow-500/20",
  },
  in_progress: {
    label: "قيد التنفيذ",
    icon: PlayCircle,
    bgColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    headerGradient: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800",
    buttonGradient: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900",
    hoverColor: "hover:bg-blue-500/20",
  },
  completed: {
    label: "مكتملة",
    icon: CheckCircle2,
    bgColor: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    headerGradient: "bg-gradient-to-r from-green-600 via-green-700 to-green-800",
    buttonGradient: "bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900",
    hoverColor: "hover:bg-green-500/20",
  },
  cancelled: {
    label: "ملغاة",
    icon: XCircle,
    bgColor: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    headerGradient: "bg-gradient-to-r from-red-600 via-red-700 to-red-800",
    buttonGradient: "bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900",
    hoverColor: "hover:bg-red-500/20",
  },
}

type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled"

export function ChangeTaskStatusModal({
  open,
  onOpenChange,
  taskTitle,
  currentStatus,
  newStatus: initialNewStatus,
  isLoading,
  onConfirm,
}: ChangeTaskStatusModalProps) {
  const [reason, setReason] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(initialNewStatus || currentStatus)

  // Update selected status when modal opens or initialNewStatus changes
  useEffect(() => {
    if (open) {
      setSelectedStatus(initialNewStatus || currentStatus)
      setReason("")
    }
  }, [open, initialNewStatus, currentStatus])

  const currentStatusInfo = statusConfig[currentStatus]
  const newStatusInfo = statusConfig[selectedStatus]
  const CurrentIcon = currentStatusInfo.icon
  const NewIcon = newStatusInfo.icon

  // Get available status options based on current status
  const getAvailableStatuses = (): TaskStatus[] => {
    const allStatuses: TaskStatus[] = ["pending", "in_progress", "completed", "cancelled"]
    return allStatuses.filter((status) => status !== currentStatus)
  }

  const availableStatuses = getAvailableStatuses()

  const handleConfirm = () => {
    if (selectedStatus === currentStatus) return
    onConfirm(selectedStatus, reason.trim() || undefined)
    setReason("")
  }

  const handleClose = () => {
    setReason("")
    setSelectedStatus(initialNewStatus || currentStatus)
    onOpenChange(false)
  }

  const handleStatusSelect = (status: TaskStatus) => {
    setSelectedStatus(status)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Fixed Header with Gradient Background */}
        <div className={cn("sticky top-0 z-10", newStatusInfo.headerGradient, "p-4 text-white shadow-lg")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-white/20 backdrop-blur-sm p-2 shadow-lg border border-[#E2C992]/30">
                <ArrowRight className="h-5 w-5 drop-shadow-[0_0_4px_rgba(226,201,146,0.6)]" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  تغيير حالة المهمة
                </DialogTitle>
                <DialogDescription className="text-white/80 mt-0.5 text-sm">
                  {taskTitle}
                </DialogDescription>
              </div>
            </div>
            {/* Close Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-200"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Status Selection Buttons */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              اختر الحالة الجديدة
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {availableStatuses.map((status) => {
                const statusInfo = statusConfig[status]
                const StatusIcon = statusInfo.icon
                const isSelected = selectedStatus === status

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusSelect(status)}
                    disabled={isLoading}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-200 text-right",
                      "flex items-center gap-2",
                      isSelected
                        ? cn("ring-2 ring-primary shadow-md", statusInfo.bgColor, statusInfo.hoverColor)
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <StatusIcon className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isSelected ? statusInfo.bgColor.split(" ")[1] : "text-gray-500 dark:text-gray-400"
                    )} />
                    <div className="flex-1 text-right">
                      <p className={cn(
                        "text-sm font-semibold",
                        isSelected ? statusInfo.bgColor.split(" ")[1] : "text-gray-700 dark:text-gray-300"
                      )}>
                        {statusInfo.label}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="h-4 w-4 rounded-full bg-primary dark:bg-[#E2C992] flex items-center justify-center">
                          <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Status Change Visualization */}
          {selectedStatus !== currentStatus && (
            <div className="flex items-center justify-between gap-3 p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              {/* Current Status */}
              <div className="flex-1 text-center">
                <div className={cn("p-2 rounded-lg border mb-1", currentStatusInfo.bgColor)}>
                  <CurrentIcon className="h-5 w-5 mx-auto mb-1" />
                  <p className="text-xs font-semibold">{currentStatusInfo.label}</p>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">الحالة الحالية</p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                <ArrowLeft className="h-5 w-5 text-primary dark:text-[#E2C992]" />
              </div>

              {/* New Status */}
              <div className="flex-1 text-center">
                <div className={cn("p-2 rounded-lg border mb-1 ring-2 ring-primary", newStatusInfo.bgColor)}>
                  <NewIcon className="h-5 w-5 mx-auto mb-1" />
                  <p className="text-xs font-semibold">{newStatusInfo.label}</p>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">الحالة الجديدة</p>
              </div>
            </div>
          )}

          {/* Reason (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-semibold">
              السبب (اختياري)
            </Label>
            <Textarea
              id="reason"
              placeholder="أدخل سبب تغيير الحالة..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px] text-sm"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="sticky z-10 bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
          <div className="p-4 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="h-10 px-5 border-2 border-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium text-sm"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isLoading || selectedStatus === currentStatus}
                className={cn(
                  "h-10 px-6 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium relative overflow-hidden group text-sm",
                  newStatusInfo.buttonGradient,
                  (isLoading || selectedStatus === currentStatus) && "opacity-50 cursor-not-allowed"
                )}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                {isLoading ? (
                  <div className="flex items-center gap-2 relative z-10">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>جاري المعالجة...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 relative z-10">
                    <ArrowRight className="h-4 w-4" />
                    <span>تغيير الحالة</span>
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
