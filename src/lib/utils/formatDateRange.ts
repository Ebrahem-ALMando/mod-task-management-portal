/**
 * Date Range Formatting Utility
 * 
 * Responsibilities:
 * - Format date range for display in Arabic
 * - Handle single date or date range
 * 
 * Rules:
 * - Pure function
 * - No side effects
 */

/**
 * Format date range for display
 * 
 * @param from - Start date (optional)
 * @param to - End date (optional)
 * @returns Formatted date range string in Arabic
 * 
 * @example
 * ```ts
 * formatDateRange(new Date('2024-01-01'), new Date('2024-01-31'))
 * // "1 يناير 2024 - 31 يناير 2024"
 * ```
 */
export function formatDateRange(
  from: Date | undefined,
  to: Date | undefined
): string {
  if (!from && !to) {
    return "اختر الفترة الزمنية"
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (from && to) {
    return `${formatDate(from)} - ${formatDate(to)}`
  }

  if (from) {
    return `من ${formatDate(from)}`
  }

  if (to) {
    return `حتى ${formatDate(to)}`
  }

  return "اختر الفترة الزمنية"
}
