/**
 * Network status detection
 * 
 * Responsibilities:
 * - Detect online/offline status
 * - Provide callbacks for network state changes
 * 
 * Rules:
 * - Use browser APIs only (navigator.onLine, window events)
 * - NO React
 * - NO hooks
 * - NO UI
 */

/**
 * Check if the browser is currently online
 * 
 * @returns true if online, false if offline
 */
export function isOnline(): boolean {
  if (typeof navigator === "undefined") {
    // Server-side: assume online
    return true
  }

  return navigator.onLine
}

/**
 * Subscribe to online events
 * 
 * @param callback - Function to call when network comes online
 * @returns Unsubscribe function
 */
export function onOnline(callback: () => void): () => void {
  if (typeof window === "undefined") {
    // Server-side: return no-op unsubscribe
    return () => {}
  }

  window.addEventListener("online", callback)

  // Return unsubscribe function
  return () => {
    window.removeEventListener("online", callback)
  }
}

/**
 * Subscribe to offline events
 * 
 * @param callback - Function to call when network goes offline
 * @returns Unsubscribe function
 */
export function onOffline(callback: () => void): () => void {
  if (typeof window === "undefined") {
    // Server-side: return no-op unsubscribe
    return () => {}
  }

  window.addEventListener("offline", callback)

  // Return unsubscribe function
  return () => {
    window.removeEventListener("offline", callback)
  }
}
