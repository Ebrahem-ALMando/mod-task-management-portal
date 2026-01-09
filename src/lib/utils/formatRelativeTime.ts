/**
 * Relative Time Formatting Utility
 * 
 * Responsibilities:
 * - Format dates as relative time in Arabic
 * - Handle past and future dates
 * 
 * Rules:
 * - Pure function
 * - No side effects
 */

/**
 * Format date as relative time in Arabic
 * 
 * @param dateString - ISO date string
 * @returns Relative time string in Arabic
 * 
 * @example
 * ```ts
 * getRelativeTime("2024-01-01T10:00:00Z")
 * // "منذ 3 أيام"
 * ```
 */
export function getRelativeTime(dateString: string | null): string {
  if (!dateString) {
    return "غير محدد"
  }

  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 0) {
    return "في المستقبل"
  }

  if (diffInSeconds < 60) {
    return "الآن"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} ${diffInMinutes === 1 ? "دقيقة" : "دقائق"}`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ${diffInHours === 1 ? "ساعة" : "ساعات"}`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `منذ ${diffInDays} ${diffInDays === 1 ? "يوم" : "أيام"}`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `منذ ${diffInMonths} ${diffInMonths === 1 ? "شهر" : "أشهر"}`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `منذ ${diffInYears} ${diffInYears === 1 ? "سنة" : "سنوات"}`
}
