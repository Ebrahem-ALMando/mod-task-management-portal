"use client"

/**
 * useAction hook - Command layer for mutations
 * 
 * Responsibilities:
 * - Execute API mutations
 * - Decide: online → execute immediately, offline → enqueue
 * - Track action state (status, error)
 * 
 * Rules:
 * - NO domain logic
 * - NO SWR usage
 * - NO UI logic
 * - NO direct storage access
 * - Must be reusable for ANY entity
 */

import { useState, useEffect, useCallback, useRef } from "react"
import { apiExecutor } from "@/lib/api"
import { isOnline, onOnline } from "@/lib/network"
import { enqueue, dequeue, processQueue } from "@/lib/actions"
import type { ActionStatus, ActionPayload } from "@/lib/actions"
import type { HttpMethod, ApiError } from "@/lib/api/api.types"

/**
 * Parameters for executing an action
 */
export interface ExecuteParams {
  /**
   * API endpoint (e.g., "/tasks" or "/users/123")
   */
  endpoint: string

  /**
   * HTTP method
   */
  method: HttpMethod

  /**
   * Request payload (for POST/PUT/PATCH)
   */
  payload?: unknown
}

/**
 * Return type of useAction hook
 */
export interface UseActionReturn<T = unknown> {
  /**
   * Execute an action
   * 
   * If online: executes immediately
   * If offline: queues the action
   */
  execute: (params: ExecuteParams) => Promise<T | null>

  /**
   * Current status of the action
   */
  status: ActionStatus

  /**
   * Error if action failed
   */
  error: ApiError | null

  /**
   * Whether an action is currently in progress
   */
  isPending: boolean
}

/**
 * Hook for executing mutations with offline queue support
 * 
 * @example
 * ```tsx
 * const { execute, status, error } = useAction<Task>()
 * 
 * const handleCreate = async () => {
 *   const result = await execute({
 *     endpoint: "/tasks",
 *     method: "POST",
 *     payload: { title: "New Task" }
 *   })
 * }
 * ```
 */
export function useAction<T = unknown>(): UseActionReturn<T> {
  const [status, setStatus] = useState<ActionStatus>("idle")
  const [error, setError] = useState<ApiError | null>(null)
  const processingRef = useRef(false)

  /**
   * Execute a queued action
   */
  const executeQueuedAction = useCallback(async (action: ActionPayload): Promise<void> => {
    try {
      await apiExecutor<T>(
        action.endpoint,
        action.method,
        action.payload as T
      )
      // Action succeeded, will be removed from queue by processQueue
    } catch (err) {
      // Action failed, will remain in queue for retry
      throw err
    }
  }, [])

  /**
   * Process all queued actions when coming online
   */
  const processQueuedActions = useCallback(async () => {
    if (processingRef.current) {
      return
    }

    if (!isOnline()) {
      return
    }

    processingRef.current = true
    setStatus("syncing")

    try {
      await processQueue(executeQueuedAction)
      setStatus("idle")
      setError(null)
    } catch (err) {
      // Some actions failed, but don't set error state
      // Individual actions will be retried on next online event
      setStatus("idle")
    } finally {
      processingRef.current = false
    }
  }, [executeQueuedAction])

  /**
   * Set up online event listener to process queue
   */
  useEffect(() => {
    const unsubscribe = onOnline(() => {
      processQueuedActions()
    })

    // Also process queue immediately if already online
    if (isOnline()) {
      processQueuedActions()
    }

    return unsubscribe
  }, [processQueuedActions])

  /**
   * Execute an action
   */
  const execute = useCallback(
    async (params: ExecuteParams): Promise<T | null> => {
      setError(null)

      // Check if online
      if (isOnline()) {
        // Online: execute immediately
        setStatus("pending")

        try {
          const result = await apiExecutor<T>(
            params.endpoint,
            params.method,
            params.payload as T
            
          )

          setStatus("success")
          return result
        } catch (err) {
          const apiError = err as ApiError
          setError(apiError)
          setStatus("failed")
          throw apiError
        } finally {
          // Reset to idle after a short delay
          setTimeout(() => {
            setStatus("idle")
          }, 100)
        }
      } else {
        // Offline: enqueue action
        setStatus("queued")

        try {
          const actionId = await enqueue({
            endpoint: params.endpoint,
            method: params.method,
            payload: params.payload,
          })

          // Return null to indicate action was queued
          // The action will be executed when network is restored
          return null
        } catch (err) {
          const apiError: ApiError = {
            status: 0,
            message: "Failed to queue action. Please try again.",
          }
          setError(apiError)
          setStatus("failed")
          throw apiError
        }
      }
    },
    []
  )

  const isPending = status === "pending" || status === "syncing"

  return {
    execute,
    status,
    error,
    isPending,
  }
}
