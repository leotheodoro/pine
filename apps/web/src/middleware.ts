import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const isAuthPage = req.nextUrl.pathname === '/auth/sign-in' || req.nextUrl.pathname === '/auth/sign-up'

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (token && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico|.*\\..*).*)'],
}
