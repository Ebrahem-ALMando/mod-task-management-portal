/**
 * Constants for DeletedTasksModal
 */

export const STATUS_OPTIONS = [
  { value: "all", label: "جميع الحالات" },
  { value: "pending", label: "معلقة" },
  { value: "in_progress", label: "قيد التنفيذ" },
  { value: "completed", label: "مكتملة" },
  { value: "cancelled", label: "ملغاة" },
] as const

export const PRIORITY_OPTIONS = [
  { value: "all", label: "جميع الأولويات" },
  { value: "low", label: "منخفضة" },
  { value: "medium", label: "متوسطة" },
  { value: "high", label: "عالية" },
  { value: "urgent", label: "عاجلة" },
] as const

export const OVERDUE_OPTIONS = [
  { value: "all", label: "الكل" },
  { value: "true", label: "متأخرة فقط" },
  { value: "false", label: "غير متأخرة" },
] as const
