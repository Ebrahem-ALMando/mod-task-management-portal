"use client"

/**
 * DataTable - Reusable table component
 * 
 * Responsibilities:
 * - Display data in table format
 * - Support custom columns and cell rendering
 * - Handle empty states
 * - Support loading states
 * 
 * Rules:
 * - UI only - no logic
 * - Generic and reusable
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface DataTableColumn<T> {
  /**
   * Column key (unique identifier)
   */
  key: string
  
  /**
   * Column header label
   */
  label: string
  
  /**
   * Custom cell renderer
   */
  render?: (row: T, index: number) => React.ReactNode
  
  /**
   * Column width (optional)
   */
  width?: string
  
  /**
   * Column alignment (optional)
   */
  align?: "left" | "center" | "right"
  
  /**
   * Whether column is sortable (optional)
   */
  sortable?: boolean
}

export interface DataTableProps<T> {
  /**
   * Table columns configuration
   */
  columns: DataTableColumn<T>[]
  
  /**
   * Table data
   */
  data: T[]
  
  /**
   * Loading state
   */
  isLoading?: boolean
  
  /**
   * Empty state message
   */
  emptyMessage?: string
  
  /**
   * Empty state icon (optional)
   */
  emptyIcon?: React.ComponentType<{ className?: string }>
  
  /**
   * Row key extractor
   */
  getRowKey: (row: T, index: number) => string | number
  
  /**
   * Custom row className (optional)
   */
  getRowClassName?: (row: T, index: number) => string
  
  /**
   * Optional className
   */
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "لا توجد بيانات",
  emptyIcon: EmptyIcon,
  getRowKey,
  getRowClassName,
  className,
}: DataTableProps<T>) {
  // Loading skeleton
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.width && `w-[${column.width}]`
                    )}
                  >
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right"
                      )}
                    >
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            {EmptyIcon && (
              <EmptyIcon className="h-16 w-16 text-muted-foreground/40" />
            )}
            <p className="text-lg font-semibold text-foreground">{emptyMessage}</p>
            <p className="text-sm text-muted-foreground">
              لم يتم العثور على أي بيانات
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "text-right",
                    column.align === "center" && "text-center",
                    column.align === "left" && "text-left",
                    column.width && `w-[${column.width}]`
                  )}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={getRowKey(row, index)}
                className={cn(
                  "hover:bg-muted/50 transition-colors",
                  getRowClassName?.(row, index)
                )}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      "text-right",
                      column.align === "center" && "text-center",
                      column.align === "left" && "text-left"
                    )}
                  >
                    {column.render
                      ? column.render(row, index)
                      : (row as Record<string, unknown>)[column.key]?.toString() || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
