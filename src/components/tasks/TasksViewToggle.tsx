"use client"

/**
 * TasksViewToggle - Toggle between cards, table, and columns view
 * 
 * Responsibilities:
 * - Display toggle buttons for view mode
 * - Handle view mode changes
 * 
 * Rules:
 * - UI only - no logic
 */

import { LayoutGrid, Table, Columns } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ViewMode } from "./TasksView"

export interface TasksViewToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function TasksViewToggle({
  viewMode,
  onViewModeChange,
}: TasksViewToggleProps) {
  return (
    <div className="flex items-center gap-1 border rounded-lg p-1 bg-background">
      <Button
        variant={viewMode === "columns" ? "default" : "ghost"}
        size="sm"
        className={cn(
          "gap-2",
          viewMode === "columns" && "bg-primary text-primary-foreground"
        )}
        onClick={() => onViewModeChange("columns")}
        aria-label="عرض الأعمدة"
      >
        <Columns className="h-4 w-4" />
        <span className="hidden sm:inline">أعمدة</span>
      </Button>
      <Button
        variant={viewMode === "cards" ? "default" : "ghost"}
        size="sm"
        className={cn(
          "gap-2",
          viewMode === "cards" && "bg-primary text-primary-foreground"
        )}
        onClick={() => onViewModeChange("cards")}
        aria-label="عرض الكروت"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">كروت</span>
      </Button>
      <Button
        variant={viewMode === "table" ? "default" : "ghost"}
        size="sm"
        className={cn(
          "gap-2",
          viewMode === "table" && "bg-primary text-primary-foreground"
        )}
        onClick={() => onViewModeChange("table")}
        aria-label="عرض الجدول"
      >
        <Table className="h-4 w-4" />
        <span className="hidden sm:inline">جدول</span>
      </Button>
    </div>
  )
}
