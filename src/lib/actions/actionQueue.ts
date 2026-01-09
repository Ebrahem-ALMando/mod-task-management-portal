/**
 * Action queue for offline command execution
 * 
 * Responsibilities:
 * - Store queued actions when offline
 * - Replay actions when online
 * - Persist queue using storage layer
 * 
 * Rules:
 * - NO React
 * - NO UI
 * - NO domain knowledge
 * - Queue must survive page reloads
 */

import { local } from "../storage"
import type { ActionPayload } from "./action.types"

/**
 * Storage key for action queue
 */
const QUEUE_KEY = "action_queue"

/**
 * In-memory queue (fallback if storage fails)
 * TODO: Replace with IndexedDB when implemented for better persistence
 */
let inMemoryQueue: ActionPayload[] = []

/**
 * Load queue from storage
 */
async function loadQueue(): Promise<ActionPayload[]> {
  try {
    const stored = local.get(QUEUE_KEY)
    if (!stored) {
      return []
    }

    const parsed = JSON.parse(stored) as ActionPayload[]
    // Also update in-memory queue
    inMemoryQueue = parsed
    return parsed
  } catch {
    // If parsing fails, return in-memory queue
    return inMemoryQueue
  }
}

/**
 * Save queue to storage
 */
async function saveQueue(queue: ActionPayload[]): Promise<void> {
  try {
    local.set(QUEUE_KEY, JSON.stringify(queue))
    // Also update in-memory queue
    inMemoryQueue = queue
  } catch {
    // If storage fails, only update in-memory queue
    // TODO: This means queue won't survive page reloads
    // Should be fixed when IndexedDB is implemented
    inMemoryQueue = queue
  }
}

/**
 * Generate unique ID for an action
 */
function generateActionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Enqueue an action to be executed later
 * 
 * @param action - Action payload (id will be generated if not provided)
 * @returns Promise that resolves when action is enqueued
 */
export async function enqueue(action: Omit<ActionPayload, "id" | "createdAt">): Promise<string> {
  const queue = await loadQueue()

  const actionPayload: ActionPayload = {
    id: generateActionId(),
    createdAt: Date.now(),
    ...action,
  }

  queue.push(actionPayload)
  await saveQueue(queue)

  return actionPayload.id
}

/**
 * Remove an action from the queue
 * 
 * @param id - Action ID to remove
 * @returns Promise that resolves when action is removed
 */
export async function dequeue(id: string): Promise<void> {
  const queue = await loadQueue()
  const filtered = queue.filter((action) => action.id !== id)
  await saveQueue(filtered)
}

/**
 * Get all queued actions
 * 
 * @returns Promise that resolves to array of queued actions
 */
export async function getAll(): Promise<ActionPayload[]> {
  return loadQueue()
}

/**
 * Clear all queued actions
 * 
 * @returns Promise that resolves when queue is cleared
 */
export async function clear(): Promise<void> {
  await saveQueue([])
}

/**
 * Process all queued actions
 * 
 * Executes each action using the provided executor function.
 * Removes successfully executed actions from the queue.
 * 
 * @param executor - Function that executes an action and returns a promise
 * @returns Promise that resolves when all actions are processed
 */
export async function processQueue(
  executor: (action: ActionPayload) => Promise<void>
): Promise<void> {
  const queue = await loadQueue()

  if (queue.length === 0) {
    return
  }

  // Process actions in order (oldest first)
  const sortedQueue = [...queue].sort((a, b) => a.createdAt - b.createdAt)

  const results: Array<{ id: string; success: boolean }> = []

  for (const action of sortedQueue) {
    try {
      await executor(action)
      results.push({ id: action.id, success: true })
    } catch (error) {
      // If action fails, keep it in queue for retry
      results.push({ id: action.id, success: false })
      // Log error but continue processing other actions
      console.error(`Failed to process action ${action.id}:`, error)
    }
  }

  // Remove successfully processed actions
  // Keep only failed actions in the queue
  const failedActionIds = results
    .filter((r) => !r.success)
    .map((r) => r.id)

  const remainingQueue = queue.filter((action) => failedActionIds.includes(action.id))
  await saveQueue(remainingQueue)
}
