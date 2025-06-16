// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // /login にアクセス → セッションがあれば /admin へ
  if (req.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }
  return res;
}
