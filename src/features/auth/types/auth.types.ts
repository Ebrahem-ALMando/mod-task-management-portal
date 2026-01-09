/**
 * Authentication types based on API_CONTRACT.md
 */

/**
 * Login request payload
 */
export interface LoginRequest {
  username: string
  password: string
  device_token?: string
}

/**
 * Login response payload (from API_CONTRACT.md)
 * Note: user field may not match UserResource exactly
 */
export interface LoginResponse {
  user: {
    id: number
    username: string
    name: string
    role: "admin" | "department"
    is_active: boolean
    avatar: string | null
    created_by: number | null
    last_login_at: string | null
    created_at: string
    updated_at: string
  }
  token: string
}
