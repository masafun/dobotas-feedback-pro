import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  /* 未ログイン → /login */
  if (!session) {
    if (req.nextUrl.pathname.startsWith('/login')) return res;

    const login = new URL('/login', req.url);
    login.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  /* ログイン済み → ロールで振り分け */
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle();

  const role = (data?.role ?? 'free') as
    | 'super'
    | 'org_admin'
    | 'member'
    | 'free';

  if (req.nextUrl.pathname === '/dashboard') {
    const dest = {
      super: '/dashboard/super',
      org_admin: '/dashboard/org',
      member: '/dashboard',
      free: '/dashboard/free',
    }[role];
    return NextResponse.redirect(new URL(dest, req.url));
  }
  return res;
}

/**
 * matcher を “特定パスだけガードする” 方式に変更
 *  - /dashboard と /upload など **保護したいルート** を列挙
 *  - /auth/** や /api/** は最初から除外される
 */
export const config = {
  matcher: ['/dashboard/:path*', '/upload/:path*'],
  runtime: 'nodejs',
};
