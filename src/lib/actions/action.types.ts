/**
 * Action types for command layer
 * 
 * No domain-specific fields allowed
 */

import type { HttpMethod } from "../api/api.types"

/**
 * Status of an action
 */
export type ActionStatus =
  | "idle"      // Initial state, no action in progress
  | "pending"   // Action is executing (online)
  | "queued"    // Action is queued (offline)
  | "syncing"   // Queued action is being replayed (online again)
  | "success"   // Action completed successfully
  | "failed"    // Action failed

/**
 * Payload for a queued action
 */
export interface ActionPayload {
  /**
   * Unique identifier for this action
   */
  id: string

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

  /**
   * Timestamp when action was created (for ordering)
   */
  createdAt: number
}
