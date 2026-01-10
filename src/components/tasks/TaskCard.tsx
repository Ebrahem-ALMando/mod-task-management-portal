"use client"

/**
 * TaskCard - Individual task card component
 * 
 * Responsibilities:
 * - Display task information in card format with advanced styling
 * - Show title, description, priority, status, assigned user
 * - Action buttons
 * 
 * Rules:
 * - UI only - no logic
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Calendar,
  User,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  GripVertical,
  Edit,
  Trash2,
  FileText,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDateInArabic } from "@/lib/utils/date"
import { getRelativeTime } from "@/lib/utils/formatRelativeTime"
import type { TaskResource } from "@/features/tasks"

export interface TaskCardProps {
  task: TaskResource
  isDragging?: boolean
  disableHoverScale?: boolean
  onStatusChange?: (taskId: number, newStatus: "pending" | "in_progress" | "completed" | "cancelled") => Promise<void>
  onEdit?: (task: TaskResource) => void
  onDelete?: (task: TaskResource) => void
  onChangeStatus?: (task: TaskResource, newStatus: "pending" | "in_progress" | "completed" | "cancelled") => void
  onViewDetails?: (task: TaskResource) => void
}

const statusConfig = {
  pending: {
    label: "معلقة",
    icon: Clock,
    bgColor: "bg-yellow-500/10 dark:bg-yellow-500/20",
    textColor: "text-yellow-700 dark:text-yellow-400",
    borderColor: "border-yellow-500/30 dark:border-yellow-500/50",
  },
  in_progress: {
    label: "قيد التنفيذ",
    icon: Clock,
    bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
    textColor: "text-blue-700 dark:text-blue-400",
    borderColor: "border-blue-500/30 dark:border-blue-500/50",
  },
  completed: {
    label: "مكتملة",
    icon: CheckCircle2,
    bgColor: "bg-green-500/10 dark:bg-green-500/20",
    textColor: "text-green-700 dark:text-green-400",
    borderColor: "border-green-500/30 dark:border-green-500/50",
  },
  cancelled: {
    label: "ملغاة",
    icon: XCircle,
    bgColor: "bg-red-500/10 dark:bg-red-500/20",
    textColor: "text-red-700 dark:text-red-400",
    borderColor: "border-red-500/30 dark:border-red-500/50",
  },
}

const priorityConfig = {
  low: {
    label: "منخفضة",
    color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  },
  medium: {
    label: "متوسطة",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  high: {
    label: "عالية",
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  },
  urgent: {
    label: "عاجلة",
    color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  },
}

export function TaskCard({ 
  task,
  isDragging = false,
  disableHoverScale = false,
  onEdit,
  onDelete,
  onChangeStatus,
  onViewDetails,
}: TaskCardProps) {
  const statusInfo = statusConfig[task.status]
  const StatusIcon = statusInfo.icon
  const priorityInfo = priorityConfig[task.priority]
  const isOverdue = new Date(task.due_date) < new Date() && task.status !== "completed" && task.status !== "cancelled"

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Determine card styling based on status and overdue
  const getCardStyling = () => {
    const hoverScale = disableHoverScale ? "" : "hover:scale-105"
    
    if (isOverdue) {
      return `bg-gradient-to-br from-white via-red-50/50 to-red-100/30 dark:from-card dark:via-red-950/20 dark:to-red-900/10 ${hoverScale} border-2 border-red-500/50 dark:border-red-500/50`
    }
    if (task.status === "completed") {
      return `bg-gradient-to-br from-white via-green-50/30 to-green-100/20 dark:from-card dark:via-green-950/20 dark:to-green-900/10 ${hoverScale} border-2 border-green-500/30 dark:border-green-500/50`
    }
    if (task.status === "cancelled") {
      return `bg-gradient-to-br from-white via-red-50/50 to-red-100/30 dark:from-card dark:via-red-950/20 dark:to-red-900/10 ${hoverScale} border-2 border-red-500/30 dark:border-red-500/50`
    }
    return `bg-gradient-to-br from-white via-primary/5 to-primary/10 dark:from-card dark:via-primary/20 dark:to-primary/20 ${hoverScale} border-2 border-primary/30 dark:border-primary/50`
  }

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "group overflow-hidden transition-all duration-500 hover:shadow-2xl dark:hover:shadow-gray-900/30 shadow-xl dark:shadow-gray-900/20 relative flex flex-col justify-between cursor-move",
          isDragging && "opacity-50 scale-95",
          getCardStyling()
        )}
        draggable
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full blur-xl transform translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#E2C992]/20 to-primary/30 rounded-full blur-lg transform -translate-x-8 translate-y-8"></div>
          {/* Wave pattern */}
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-primary/10 to-transparent dark:from-primary/20 transform rotate-180"></div>
          <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-primary/10 to-transparent dark:from-primary/20"></div>
        </div>

        {/* Drag handle */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Status indicator */}
        <div className={cn(
          "absolute top-3 right-3 w-3 h-3 rounded-full animate-pulse z-10",
          task.status === "pending" && "bg-yellow-500 shadow-lg shadow-yellow-500/50",
          task.status === "in_progress" && "bg-blue-500 shadow-lg shadow-blue-500/50",
          task.status === "completed" && "bg-green-500 shadow-lg shadow-green-500/50",
          task.status === "cancelled" && "bg-red-500 shadow-lg shadow-red-500/50",
        )} />

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-[#E2C992] transition-colors duration-300 line-clamp-2">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1 w-max text-xs font-medium transition-all duration-300 transform group-hover:scale-110 absolute top-[5px] left-4",
                statusInfo.bgColor,
                statusInfo.textColor,
                statusInfo.borderColor,
                "shadow-lg border-2"
              )}
            >
              <StatusIcon className="w-3 h-3 ml-1" />
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Priority Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium",
                priorityInfo.color
              )}
            >
              <span>{priorityInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className={cn(
              "h-4 w-4",
              isOverdue ? "text-red-600 dark:text-red-400" : "text-primary dark:text-[#E2C992] group-hover:text-primary/80 dark:group-hover:text-[#E2C992]/80 transition-colors"
            )} />
            <span className={cn(
              "text-sm",
              isOverdue ? "text-red-600 dark:text-red-400 font-medium" : "text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors"
            )}>
              {formatDateInArabic(new Date(task.due_date))}
              {isOverdue && " (متأخرة)"}
            </span>
          </div>
        </div>

        {/* Assigned User */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary dark:text-[#E2C992] group-hover:text-primary/80 dark:group-hover:text-[#E2C992]/80 transition-colors" />
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 ring-2 ring-primary/10 dark:ring-primary/30 group-hover:ring-primary/20 dark:group-hover:ring-primary/40 transition-all duration-300">
                {task.assigned_to.avatar_url ? (
                  <AvatarImage src={task.assigned_to.avatar_url} alt={task.assigned_to.name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs">
                    {getInitials(task.assigned_to.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                {task.assigned_to.name}
              </span>
            </div>
          </div>
        </div>

        {/* Created Date and Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-muted-foreground group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
            {getRelativeTime(task.created_at)}
          </span>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-[#E2C992] transition-all duration-200 group-hover:scale-110"
                  onClick={() => onEdit?.(task)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>تعديل</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-all duration-200 group-hover:scale-110"
                  onClick={() => onChangeStatus?.(task, task.status)}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>تغيير الحالة</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#dca93b] hover:bg-[#E2C992]/10 hover:text-[#E2C992] dark:hover:bg-[#E2C992]/20 transition-all duration-200 group-hover:scale-110"
                  onClick={() => onViewDetails?.(task)}
                >
                  <FileText className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>عرض التفاصيل</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200 group-hover:scale-110"
                  onClick={() => onDelete?.(task)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>حذف</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
      </Card>
    </TooltipProvider>
  )
}
