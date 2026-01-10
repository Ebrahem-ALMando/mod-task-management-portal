"use client"

/**
 * ErrorState - Reusable error state component
 * 
 * Responsibilities:
 * - Display error message with animated icon
 * - Provide retry functionality
 * - Consistent error UI across the application
 * 
 * Rules:
 * - UI only - no business logic
 */

import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

export interface ErrorStateProps {
  /**
   * Error message to display
   */
  message?: string
  /**
   * Optional title (defaults to "حدث خطأ أثناء جلب البيانات")
   */
  title?: string
  /**
   * Optional description (defaults to "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى")
   */
  description?: string
  /**
   * Callback function to retry the operation
   */
  onRetry?: () => void | Promise<void>
  /**
   * Whether the retry action is in progress
   */
  isRetrying?: boolean
  /**
   * Custom className for the container
   */
  className?: string
}

export function ErrorState({
  message,
  title = "حدث خطأ أثناء جلب البيانات",
  description = "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى",
  onRetry,
  isRetrying = false,
  className,
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className || ""}`}>
      <div className="relative mb-6">
        {/* Animated background circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/30 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-24 h-24 bg-gradient-to-r from-red-200 to-red-300 dark:from-red-800/30 dark:to-red-700/40 rounded-full animate-bounce" 
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
        {/* Main icon */}
        <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg">
          <AlertCircle className="h-10 w-10 text-white animate-pulse" strokeWidth={2} />
        </div>
        {/* Floating particles effect */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full animate-ping"></div>
        <div 
          className="absolute -bottom-1 -left-1 w-4 h-4 bg-orange-400 rounded-full animate-ping" 
          style={{ animationDelay: '0.5s' }}
        ></div>
      </div>

      <div className="text-center space-y-3 max-w-md">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        {message && (
          <p className="text-red-600 dark:text-red-400 font-medium">
            {message}
          </p>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

      {onRetry && (
        <Button
          onClick={() => onRetry()}
          variant="default"
          disabled={isRetrying}
          className="mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
          إعادة المحاولة
        </Button>
      )}
    </div>
  )
}
