import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_PUBLIC_PREFIX = '/auth'
const PUBLIC_ROUTES = ['/assets','/manifest.webmanifest','/favicon.ico'] 

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  // السماح بتمرير الأصول/الملفات العامة من /public من دون حماية
  // حتى لا يُعاد توجيه الصور والملفات مثل /logo.png إلى صفحة تسجيل الدخول
  const isAsset = /\.[a-zA-Z0-9]+$/.test(pathname)
  if (isAsset) return NextResponse.next()
  
  // السماح بالمسارات العامة (صفحة التحميل وغيرها)
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  if (isPublicRoute) return NextResponse.next()
  
  const token = request.cookies.get('auth_token')?.value
  const isAuthPage = pathname.startsWith(AUTH_PUBLIC_PREFIX)

  if (!token && !isAuthPage) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    const redirectTo = pathname + (search || '')
    loginUrl.searchParams.set('redirect', redirectTo)
    return NextResponse.redirect(loginUrl)
  }

  if (token && isAuthPage) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

