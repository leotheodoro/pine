import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  // Let Server Action POSTs through so they run on the server where cookies are available.
  // On Vercel/Edge the cookie is sometimes not present on the incoming request, causing 307 → sign-in.
  const isServerActionPost = req.method === 'POST' && req.headers.get('Next-Action') != null
  if (isServerActionPost) {
    return NextResponse.next()
  }

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
