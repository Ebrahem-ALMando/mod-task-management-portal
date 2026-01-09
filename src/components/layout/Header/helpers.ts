/**
 * Header Helper Functions
 * 
 * Responsibilities:
 * - Get page info from pathname
 * - Route matching logic
 * 
 * Rules:
 * - Pure functions only
 * - No side effects
 * - No React dependencies
 */

import { routeConfig, defaultRouteConfig, type RouteConfig } from "./routeConfig"

/**
 * Get page title and icon from pathname
 * 
 * @param pathname - Current route pathname
 * @returns Route configuration with title and icon
 * 
 * @example
 * ```ts
 * const info = getPageInfo("/dashboard/users")
 * // { title: "المستخدمون", icon: Users }
 * ```
 */
export function getPageInfo(pathname: string): RouteConfig {
  // Check exact match first
  if (routeConfig[pathname]) {
    return routeConfig[pathname]
  }
  
  // Check if pathname starts with any route
  for (const [route, config] of Object.entries(routeConfig)) {
    if (pathname.startsWith(route + "/") || pathname === route) {
      return config
    }
  }
  
  // Default fallback
  return defaultRouteConfig
}
