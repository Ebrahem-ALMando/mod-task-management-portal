"use client"

/**
 * UsersPagination - Pagination controls for users list
 * 
 * Responsibilities:
 * - Display pagination buttons
 * - Handle page changes
 * 
 * Rules:
 * - UI only - no logic
 */

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaginationMeta } from "@/features/users"

export interface UsersPaginationProps {
  meta: PaginationMeta
  currentPage: number
  onPageChange: (page: number) => void
}

export function UsersPagination({
  meta,
  currentPage,
  onPageChange,
}: UsersPaginationProps) {
  const { current_page, last_page, total, per_page } = meta

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPages = 7

    if (last_page <= maxPages) {
      // Show all pages if total pages is less than max
      for (let i = 1; i <= last_page; i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)

      // Calculate start and end of middle pages
      let start = Math.max(2, current_page - 1)
      let end = Math.min(last_page - 1, current_page + 1)

      // Adjust if we're near the start
      if (current_page <= 3) {
        end = 4
      }

      // Adjust if we're near the end
      if (current_page >= last_page - 2) {
        start = last_page - 3
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("...")
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (end < last_page - 1) {
        pages.push("...")
      }

      // Show last page
      pages.push(last_page)
    }

    return pages
  }

  const startItem = (current_page - 1) * per_page + 1
  const endItem = Math.min(current_page * per_page, total)

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Info */}
      <div className="text-sm text-muted-foreground">
        عرض {startItem} إلى {endItem} من {total} مستخدم
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="gap-2"
        >
          <ChevronRight className="h-4 w-4" />
          السابق
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-muted-foreground"
                >
                  ...
                </span>
              )
            }

            const pageNum = page as number
            return (
              <Button
                key={pageNum}
                variant={current_page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "min-w-[40px]",
                  current_page === pageNum &&
                    "bg-primary text-primary-foreground"
                )}
              >
                {pageNum}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="gap-2"
        >
          التالي
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
