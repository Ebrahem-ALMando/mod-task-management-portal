/**
 * Login page - Thin wrapper (Server Component)
 * 
 * Responsibilities:
 * - Import and render LoginView component only
 * 
 * Rules:
 * - NO "use client" - this is a server component
 * - NO logic
 * - NO hooks
 * - NO form logic
 * - NO API calls
 * - Just a wrapper
 */

import { LoginView } from "@/components/auth"

export default function LoginPage() {
  return <LoginView />
}
