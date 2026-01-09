/**
 * Cookie storage implementation
 * 
 * Generic key/value storage using document.cookie
 * No knowledge of auth, tokens, or business logic
 */

/**
 * Get a value from cookies
 * 
 * @param key - Cookie key
 * @returns Cookie value or null if not found
 */
export function get(key: string): string | null {
  if (typeof document === "undefined") {
    return null
  }

  const name = `${key}=`
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookieArray = decodedCookie.split(";")

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i]
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1)
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length)
    }
  }

  return null
}

/**
 * Set a value in cookies
 * 
 * @param key - Cookie key
 * @param value - Cookie value
 * @param options - Optional cookie options (expires, path, domain, secure, sameSite)
 */
export function set(
  key: string,
  value: string,
  options?: {
    expires?: Date | number
    path?: string
    domain?: string
    secure?: boolean
    sameSite?: "strict" | "lax" | "none"
  }
): void {
  if (typeof document === "undefined") {
    return
  }

  let cookieString = `${key}=${encodeURIComponent(value)}`

  if (options) {
    if (options.expires) {
      const expiresDate =
        options.expires instanceof Date
          ? options.expires
          : new Date(Date.now() + options.expires * 864e5)
      cookieString += `; expires=${expiresDate.toUTCString()}`
    }

    if (options.path) {
      cookieString += `; path=${options.path}`
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`
    }

    if (options.secure) {
      cookieString += "; secure"
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`
    }
  }

  document.cookie = cookieString
}

/**
 * Remove a value from cookies
 * 
 * @param key - Cookie key
 * @param options - Optional cookie options (path, domain)
 */
export function remove(
  key: string,
  options?: {
    path?: string
    domain?: string
  }
): void {
  if (typeof document === "undefined") {
    return
  }

  // Set expiration date to past to delete cookie
  let cookieString = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`

  if (options?.path) {
    cookieString += `; path=${options.path}`
  }

  if (options?.domain) {
    cookieString += `; domain=${options.domain}`
  }

  document.cookie = cookieString
}
