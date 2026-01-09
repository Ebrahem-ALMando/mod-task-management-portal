"use client"

/**
 * Action Toast Context
 * 
 * Provides a way for components using useAction to report their state
 * to ActionToastListener for centralized toast management.
 * 
 * This is a simple state container - no business logic.
 */

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import type { ActionStatus } from "@/lib/actions/action.types"
import type { ApiError } from "@/lib/api/api.types"

/**
 * Action state for toast observation
 */
export interface ActionToastState {
  /**
   * Unique identifier for this action (to prevent duplicates)
   */
  id: string

  /**
   * Current status of the action
   */
  status: ActionStatus

  /**
   * Error if action failed
   */
  error: ApiError | null

  /**
   * Success message from API (if available)
   */
  successMessage?: string
}

interface ActionToastContextValue {
  /**
   * Current action states
   */
  actions: ActionToastState[]

  /**
   * Report an action state
   */
  reportAction: (action: ActionToastState) => void

  /**
   * Clear an action state
   */
  clearAction: (id: string) => void
}

const ActionToastContext = createContext<ActionToastContextValue | undefined>(undefined)

/**
 * Provider for ActionToastContext
 */
export function ActionToastProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<ActionToastState[]>([])

  const reportAction = useCallback((action: ActionToastState) => {
    setActions((prev) => {
      // Update existing or add new
      const existingIndex = prev.findIndex((a) => a.id === action.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = action
        return updated
      }
      return [...prev, action]
    })
  }, [])

  const clearAction = useCallback((id: string) => {
    setActions((prev) => prev.filter((a) => a.id !== id))
  }, [])

  return (
    <ActionToastContext.Provider value={{ actions, reportAction, clearAction }}>
      {children}
    </ActionToastContext.Provider>
  )
}

/**
 * Hook to access ActionToastContext
 */
export function useActionToast() {
  const context = useContext(ActionToastContext)
  if (!context) {
    // Return no-op functions if context is not available
    return {
      actions: [],
      reportAction: () => {},
      clearAction: () => {},
    }
  }
  return context
}
