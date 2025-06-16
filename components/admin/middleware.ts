import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // 未ログインが /admin 以下へ来たら /login へ
  if (pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // ログイン済みで /login に来たら /admin へ
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return res;
}

// 保護したいパスを指定
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
