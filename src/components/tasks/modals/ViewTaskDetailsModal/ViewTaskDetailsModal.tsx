"use client"

/**
 * ViewTaskDetailsModal - Main modal component for viewing task details
 * 
 * Responsibilities:
 * - Fetch task data using useTask hook
 * - Display modal with tabs for different views
 * - Manage tab state
 * 
 * Rules:
 * - Uses useTask hook to fetch data from backend
 * - UI only - no business logic
 */

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Eye, History, UserCheck, UserCog, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTask } from "@/features/tasks"
import { statusConfig } from "./constants"
import { TaskOverviewTab } from "./TaskOverviewTab"
import { StatusLogsTab } from "./StatusLogsTab"
import { AssignedUserTab } from "./AssignedUserTab"
import { CreatedByTab } from "./CreatedByTab"

export interface ViewTaskDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId: number | string | null
}

export function ViewTaskDetailsModal({
  open,
  onOpenChange,
  taskId,
}: ViewTaskDetailsModalProps) {
  const [activeTab, setActiveTab] = React.useState("overview")

  // Fetch task data from backend
  const { task, isLoading, error } = useTask(taskId, {
    enabled: open && taskId !== null,
  })

  // Reset tab when modal closes
  React.useEffect(() => {
    if (!open) {
      setActiveTab("overview")
    }
  }, [open])

  const LoadingSkeleton = () => (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-2 border-primary/20 dark:border-primary/40 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-2 border-primary/20 dark:border-primary/40 rounded-xl p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )

  const getTaskDisplayTitle = () => {
    if (!task) return "المهمة"
    return task.title || "المهمة"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl max-h-[94vh] min-h-[90vh] overflow-hidden" dir="rtl">
        <DialogHeader className="bg-gradient-to-r from-primary/10 via-primary/10 to-primary/10 dark:from-primary/30 dark:via-primary/30 dark:to-primary/30 -mx-6 -mt-8 px-6 py-4 border-b border-primary/20 h-[70px] flex justify-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg border border-[#E2C992]/30">
                <FileText className="h-5 w-5 text-primary-foreground drop-shadow-[0_0_4px_rgba(226,201,146,0.6)]" />
              </div>
              <div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </>
                ) : error ? (
                  <>
                    <DialogTitle className="text-xl font-bold text-destructive">
                      خطأ في تحميل البيانات
                    </DialogTitle>
                    <DialogDescription className="text-sm text-destructive/80">
                      {error.message}
                    </DialogDescription>
                  </>
                ) : (
                  <>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent">
                      تفاصيل المهمة - {getTaskDisplayTitle()}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                      عرض شامل لتفاصيل المهمة ومعلوماتها
                    </DialogDescription>
                  </>
                )}
              </div>
            </div>

            {!isLoading && !error && task && (
              <div className="ml-6 flex items-center gap-4">
                <Badge
                  variant="outline"
                  className={cn("px-3 py-1", statusConfig[task.status].bgColor)}
                >
                  {statusConfig[task.status].label}
                </Badge>
                <div>
                  <p className="text-xs text-muted-foreground">ID: {task.id}</p>
                </div>
              </div>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-destructive mb-4">
              <p className="font-medium text-lg">حدث خطأ أثناء جلب البيانات</p>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                // Retry by closing and reopening
                onOpenChange(false)
                setTimeout(() => {
                  onOpenChange(true)
                }, 100)
              }}
            >
              إعادة المحاولة
            </Button>
          </div>
        ) : task ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full -mt-[20px]">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50 pt-1 pb-1" dir="rtl">
              <TabsTrigger
                value="overview"
                className="gap-2 transition-all duration-300 data-[state=active]:scale-105 data-[state=active]:shadow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Eye className="h-4 w-4" />
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger
                value="logs"
                className="gap-2 transition-all duration-300 data-[state=active]:scale-105 data-[state=active]:shadow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <History className="h-4 w-4" />
                السجل
              </TabsTrigger>
              <TabsTrigger
                value="assigned"
                className="gap-2 transition-all duration-300 data-[state=active]:scale-105 data-[state=active]:shadow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <UserCheck className="h-4 w-4" />
                المسند إليه
              </TabsTrigger>
              <TabsTrigger
                value="creator"
                className="gap-2 transition-all duration-300 data-[state=active]:scale-105 data-[state=active]:shadow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <UserCog className="h-4 w-4" />
                المسؤول
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(92vh-150px)] pr-1">
              <TabsContent
                value="overview"
                className="space-y-6 mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <TaskOverviewTab task={task} />
              </TabsContent>
              <TabsContent
                value="logs"
                className="space-y-6 mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <StatusLogsTab task={task} />
              </TabsContent>
              <TabsContent
                value="assigned"
                className="space-y-6 mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <AssignedUserTab task={task} />
              </TabsContent>
              <TabsContent
                value="creator"
                className="space-y-6 mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <CreatedByTab task={task} />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
