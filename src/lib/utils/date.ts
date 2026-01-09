/**
 * Date utility functions
 * 
 * Responsibilities:
 * - Format dates in Arabic locale
 * - Date formatting helpers
 * 
 * Rules:
 * - Pure functions only
 * - No side effects
 * - No dependencies on React or Next.js
 */

/**
 * Format current date in Arabic locale
 * 
 * @returns Formatted date string in Arabic
 * 
 * @example
 * ```ts
 * const date = formatDateInArabic()
 * // "السبت، 1 يناير 2024"
 * ```
 */
export function formatDateInArabic(): string {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return now.toLocaleDateString('ar-SA', options)
}
