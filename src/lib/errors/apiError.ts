/**
 * API error type definition
 * 
 * Standardized API error structure
 */

/**
 * Standardized API error structure
 */
export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}
