import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // /admin 配下はログイン必須
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
