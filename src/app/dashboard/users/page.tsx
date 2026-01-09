/**
 * Users page - Thin wrapper (Server Component)
 * 
 * Responsibilities:
 * - Import and render UsersView component only
 * 
 * Rules:
 * - NO "use client" - this is a server component
 * - NO logic
 * - NO hooks
 * - Just a wrapper
 */

import { UsersView } from "@/components/users"

export default function UsersPage() {
  return <UsersView />
}
