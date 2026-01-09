/**
 * LocalStorage implementation
 * 
 * Generic key/value storage using localStorage
 * No knowledge of auth, tokens, or business logic
 */

/**
 * Get a value from localStorage
 * 
 * @param key - Storage key
 * @returns Stored value or null if not found
 */
export function get(key: string): string | null {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return null
  }

  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Set a value in localStorage
 * 
 * @param key - Storage key
 * @param value - Value to store
 */
export function set(key: string, value: string): void {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return
  }

  try {
    localStorage.setItem(key, value)
  } catch {
    // Silently fail if storage is full or unavailable
  }
}

/**
 * Remove a value from localStorage
 * 
 * @param key - Storage key
 */
export function remove(key: string): void {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return
  }

  try {
    localStorage.removeItem(key)
  } catch {
    // Silently fail if storage is unavailable
  }
}
