/**
 * Constants for ViewTaskDetailsModal
 * 
 * Status and priority configurations
 */

import { Clock, CheckCircle2, XCircle, Shield, Briefcase } from "lucide-react"

export const statusConfig = {
  pending: {
    label: "معلقة",
    icon: Clock,
    bgColor: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  },
  in_progress: {
    label: "قيد التنفيذ",
    icon: Clock,
    bgColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  completed: {
    label: "مكتملة",
    icon: CheckCircle2,
    bgColor: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  },
  cancelled: {
    label: "ملغاة",
    icon: XCircle,
    bgColor: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  },
} as const

export const priorityConfig = {
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
} as const

export const roleConfig = {
  admin: { 
    label: "مدير", 
    icon: Shield, 
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20" 
  },
  department: { 
    label: "قسم", 
    icon: Briefcase, 
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" 
  },
} as const
