"use client"

import { Badge } from "@/components/ui/badge"
import { Sparkles, Tag, AlertTriangle, CheckCircle, Clock, Star, Zap, Rocket, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomBadgeProps {
  variant: 'success' | 'warning' | 'info' | 'version' | 'coming-soon' | 'updated'
  children: React.ReactNode
  className?: string
}

const badgeVariants = {
  success: {
    gradient: 'from-emerald-400 via-cyan-400 to-blue-400',
    bg: 'from-emerald-500 to-cyan-500',
    icon: CheckCircle,
    hover: 'hover:from-emerald-600 hover:to-cyan-600'
  },
  warning: {
    gradient: 'from-yellow-400 via-orange-400 to-red-400',
    bg: 'from-yellow-500 to-orange-500',
    icon: AlertTriangle,
    hover: 'hover:from-yellow-600 hover:to-orange-600'
  },
  info: {
    gradient: 'from-blue-400 via-indigo-400 to-purple-400',
    bg: 'from-blue-500 to-indigo-500',
    icon: Star,
    hover: 'hover:from-blue-600 hover:to-indigo-600'
  },
  version: {
    gradient: 'from-violet-400 via-purple-400 to-pink-400',
    bg: 'from-violet-500 to-purple-500',
    icon: Tag,
    hover: 'hover:from-violet-600 hover:to-purple-600'
  },
  'coming-soon': {
    gradient: 'from-orange-400 via-red-400 to-pink-400',
    bg: 'from-orange-500 to-red-500',
    icon: Rocket,
    hover: 'hover:from-orange-600 hover:to-red-600'
  },
  updated: {
    gradient: 'from-emerald-400 via-cyan-400 to-blue-400',
    bg: 'from-emerald-500 to-cyan-500',
    icon: Zap,
    hover: 'hover:from-emerald-600 hover:to-cyan-600'
  }
}

export function CustomBadge({ variant, children, className }: CustomBadgeProps) {
  const config = badgeVariants[variant]
  const Icon = config.icon

  return (
    <div className="relative group">
      <div className={cn(
        "absolute -inset-0.5 bg-gradient-to-r rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300",
        config.gradient
      )}></div>
      <Badge className={cn(
        "relative bg-gradient-to-r text-white border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer group p-2 pr-4 pl-4",
        config.bg,
        config.hover,
        className
      )}>
        <Icon className="h-3 w-3 ml-1 group-hover:animate-pulse transition-all duration-300" />
        {children}
      </Badge>
    </div>
  )
}
