"use client"

/**
 * LoginForm - Form UI component for login
 * 
 * Responsibilities:
 * - Form UI (username, password fields)
 * - Submit handling
 * - Loading state
 * - Pass device token to login (optional)
 * 
 * Allowed:
 * - useAuthActions() (login function)
 * - useState (form state)
 * - useDeviceToken() (read-only device token)
 * 
 * Forbidden:
 * - Token storage logic
 * - Cookie logic
 * - Redirect logic (handled by proxy.ts middleware)
 * - API calls
 * - Inline error messages (toast only)
 * 
 * Note: After successful login, proxy.ts will automatically redirect
 * authenticated users away from /auth/login to /dashboard
 */

import { useState } from "react"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useAuthActions } from "@/features/auth"
import { useDeviceToken } from "@/hooks/useDeviceToken"
import { toast } from "@/components/ui/custom-toast-with-icons"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import TaskManagementTitle from "@/components/branding/TaskManagementTitle"
import type { ApiError } from "@/lib/api/api.types"

export function LoginForm() {
  const { login } = useAuthActions()
  const { deviceToken } = useDeviceToken()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await login({
        username,
        password,
        device_token: deviceToken, // Optional - may be undefined
      })

      // Success: token already stored by hook, toast already shown
      // proxy.ts will automatically redirect authenticated users to /dashboard
      // on next navigation or page reload
    } catch (err) {
      // Error handling: Show toast for 4xx errors (401, 422, etc.)
      // ActionToastListener only shows toast for 500+ errors
      const apiError = err as ApiError
      
      if (apiError?.status >= 400 && apiError.status < 500) {
        // Show toast for client errors (4xx) - like "البيانات غير صحيحة"
        toast({
          title: "خطأ في تسجيل الدخول",
          description: apiError.message || "اسم المستخدم أو كلمة المرور غير صحيحة",
          variant: "error",
        })
      }
      // For 500+ errors, ActionToastListener will show toast automatically
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="flex flex-col items-center space-y-1">
          <TaskManagementTitle />
          <CardTitle className="text-xl md:text-2xl font-bold text-center">
            تسجيل الدخول
          </CardTitle>
        </div>
        <CardDescription className="text-center">
          أدخل بيانات الدخول للوصول إلى حسابك
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">اسم المستخدم</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              required
              disabled={isSubmitting}
              autoComplete="username"
              dir="rtl"
              className="mt-1 bg-background text-right placeholder:text-right placeholder:text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                disabled={isSubmitting}
                autoComplete="current-password"
                dir="rtl"
                className="mt-1 bg-background text-right placeholder:text-right placeholder:text-sm "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 cursor-pointer" />
                ) : (
                  <Eye className="h-4 w-4 cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full relative overflow-hidden transition-all duration-300"
            disabled={isSubmitting || !username || !password}
          >
            <span className="flex items-center justify-center gap-2 relative z-10">
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
              )}
              <span>{isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}</span>
            </span>
            {isSubmitting && (
              <span className="absolute inset-0 bg-primary/30 animate-pulse" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
