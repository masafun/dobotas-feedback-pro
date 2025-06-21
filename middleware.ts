import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  /* セッション取得 */
  const {
    data: { session },
  } = await supabase.auth.getSession();

  /* 未ログイン → /login (redirectTo パラメータ付き) */
  if (!session) {
    if (req.nextUrl.pathname.startsWith('/login')) return res;
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* ログイン済み → role に応じて /dashboard/* へ */
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

/* 🚩 Edge → Node.js ランタイムに切替 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
  runtime: 'nodejs',      // ← 追加
};
