"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, Info, XCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-[9999] flex max-h-screen w-full flex-col-reverse p-4 md:max-w-[420px]  mb-4 mt-4",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start space-x-4 overflow-hidden rounded-xl border-0 p-6 pr-12 shadow-2xl backdrop-blur-sm transition-all duration-300 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "bg-white/90 dark:bg-gray-900/90 border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-gray-100",
        success: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/90 dark:to-emerald-950/90 border-l-4 border-l-green-500 text-green-800 dark:text-green-200 shadow-green-500/20",
        error: "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/90 dark:to-rose-950/90 border-l-4 border-l-red-500 text-red-800 dark:text-red-200 shadow-red-500/20",
        warning: "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/90 dark:to-amber-950/90 border-l-4 border-l-yellow-500 text-yellow-800 dark:text-yellow-200 shadow-yellow-500/20",
        info: "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/90 dark:to-cyan-950/90 border-l-4 border-l-blue-500 text-blue-800 dark:text-blue-200 shadow-blue-500/20",
        loading: "bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/90 dark:to-purple-950/90 border-l-4 border-l-violet-500 text-violet-800 dark:text-violet-200 shadow-violet-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      duration={3000}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-full p-1.5 opacity-0 transition-all duration-200 hover:bg-black/10 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 cursor-pointer hover:scale-110",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 mt-1", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

// مكون التوست المخصص مع الأيقونات
interface CustomToastProps {
  variant?: "default" | "success" | "error" | "warning" | "info" | "loading"
  title: string | React.ReactNode
  description?: string
  icon?: React.ReactNode
}

const CustomToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  CustomToastProps
>(({ variant = "default", title, description, icon, ...props }, ref) => {
  const getIcon = () => {
    if (icon) return icon
    
    switch (variant) {
      case "success":
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        )
      case "error":
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        )
      case "warning":
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
        )
      case "info":
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        )
      case "loading":
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-violet-600 dark:text-violet-400" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Toast ref={ref} variant={variant} {...props}>
      <div className="flex items-start space-x-4 space-x-reverse">
        {getIcon() && (
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <ToastTitle className="text-base font-semibold mb-1">{title}</ToastTitle>
          {description && (
            <ToastDescription className="text-sm opacity-90 leading-relaxed">
              {description}
            </ToastDescription>
          )}
        </div>
      </div>
      <ToastClose />
    </Toast>
  )
})
CustomToast.displayName = "CustomToast"

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  CustomToast,
} 