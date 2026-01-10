/**
 * Tasks page - Thin wrapper (Server Component)
 * 
 * Responsibilities:
 * - Import and render TasksView component only
 * 
 * Rules:
 * - NO "use client" - this is a server component
 * - NO logic
 * - NO hooks
 * - Just a wrapper
 */

import { TasksView } from "@/components/tasks"

export default function TasksPage() {
  return <TasksView />
}
