"use client"

/**
 * UsersViewToggle - Toggle between cards and table view
 * 
 * Responsibilities:
 * - Display toggle buttons for view mode
 * - Handle view mode changes
 * 
 * Rules:
 * - UI only - no logic
 */

import { LayoutGrid, Table } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ViewMode } from "./UsersView"

export interface UsersViewToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function UsersViewToggle({
  viewMode,
  onViewModeChange,
}: UsersViewToggleProps) {
  return (
    <div className="flex items-center gap-1 border rounded-lg p-1 bg-background">
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
