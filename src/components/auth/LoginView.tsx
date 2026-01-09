"use client"

/**
 * LoginView - Page layout component for login
 * 
 * Responsibilities:
 * - Page layout and visual identity
 * - Logo and title display
 * 
 * Note: Redirect logic is handled by src/proxy.ts (middleware)
 * - If user is authenticated and visits /auth/login, proxy.ts redirects to /dashboard
 * - No need for internal redirect logic here
 * 
 * Allowed:
 * - Basic layout components
 * 
 * Forbidden:
 * - useAuthActions (form logic)
 * - useRouter() (redirect handled by proxy.ts)
 * - Form logic
 * - Toast logic
 * - API calls
 */

import { LoginForm } from "./LoginForm"
import Logo from "@/components/branding/Logo"
import MinistryTitle from "@/components/branding/MinistryTitle"
import TaskManagementTitle from "@/components/branding/TaskManagementTitle"
import { BackgroundPattern } from "@/components/BackgroundPattern"

export function LoginView() {
  // No redirect logic needed - proxy.ts handles it
  // If user is authenticated, proxy.ts will redirect to /dashboard automatically

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background relative">
      {/* Background Pattern */}
      <BackgroundPattern />
      
      {/* Main Content */}
      <div className="w-full max-w-md space-y-6 md:space-y-8 relative z-10 -mt-8 md:-mt-4">
        {/* Logo and Title Section */}
        <div className="flex flex-col items-center space-y-4">
          <Logo size="lg" />
          <MinistryTitle />
          
        </div>

        {/* Login Form Card */}
        <LoginForm />
      </div>
    </div>
  )
}
