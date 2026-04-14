import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  const protectedRoutes = ['/dashboard', '/profile', '/settings']
  const isProtected = protectedRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*'],
}