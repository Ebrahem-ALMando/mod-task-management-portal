/**
 * Date utility functions
 * 
 * Responsibilities:
 * - Format dates in Arabic locale
 * - Date formatting helpers
 * - Calculate days between dates
 * 
 * Rules:
 * - Pure functions only
 * - No side effects
 * - No dependencies on React or Next.js
 */

/**
 * Format date in Arabic locale
 * 
 * @param date - Optional date to format (defaults to current date)
 * @returns Formatted date string in Arabic
 * 
 * @example
 * ```ts
 * const date = formatDateInArabic()
 * // "السبت، 1 يناير 2024"
 * 
 * const specificDate = formatDateInArabic(new Date('2024-01-01'))
 * // "السبت، 1 يناير 2024"
 * ```
 */
export function formatDateInArabic(date?: Date): string {
  const dateToFormat = date || new Date()
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return dateToFormat.toLocaleDateString('ar-SA', options)
}

/**
 * Calculate the number of days between two dates
 *
 * @param date1 - First date
 * @param date2 - Second date (defaults to today if not provided)
 * @returns Number of days between the two dates
 *
 * @example
 * ```ts
 * const days = getDaysBetween(new Date('2024-12-25'), new Date('2024-12-20'))
 * // 5
 * ```
 */
export function getDaysBetween(date1: Date, date2: Date = new Date()): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  
  // Reset time to midnight for accurate day calculation
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  
  const diffTime = d1.getTime() - d2.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * Format days remaining in Arabic
 *
 * @param days - Number of days
 * @returns Formatted string in Arabic
 *
 * @example
 * ```ts
 * formatDaysRemaining(5)
 * // "5 أيام متبقية"
 * ```
 */
export function formatDaysRemaining(days: number): string {
  if (days < 0) {
    return "منتهي"
  }
  if (days === 0) {
    return "اليوم"
  }
  if (days === 1) {
    return "يوم واحد متبقي"
  }
  if (days === 2) {
    return "يومان متبقيان"
  }
  if (days <= 10) {
    return `${days} أيام متبقية`
  }
  return `${days} يوم متبقي`
}
