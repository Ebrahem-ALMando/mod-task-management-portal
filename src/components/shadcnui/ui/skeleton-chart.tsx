import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonChartProps {
  height?: number
  showSelect?: boolean
}

export function SkeletonChart({ height = 300, showSelect = true }: SkeletonChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        {showSelect && <Skeleton className="h-9 w-24" />}
      </CardHeader>
      <CardContent className="pt-4">
        <Skeleton className={`w-full h-[${height}px]`} />
      </CardContent>
    </Card>
  )
}
