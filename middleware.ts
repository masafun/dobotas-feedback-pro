import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

/* --------------------- main --------------------------- */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  /* セッション取得 */
  const { data: { session } } = await supabase.auth.getSession();

  /* 未ログイン → /login */
  if (!session) {
    if (req.nextUrl.pathname.startsWith('/login')) return res;

    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* ログイン済み → role 切替 */
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle();

  const role = (data?.role ?? 'free') as 'super' | 'org_admin' | 'member' | 'free';

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

/* ------------------ config ----------------------------- */
/* - ミドルウェアは Node.js ランタイムで実行
   - 保護したいパスだけ列挙（/dashboard, /upload）
   - /auth/* を完全に除外するので callback が実行される */
export const config = {
  runtime: 'nodejs',
  matcher: ['/dashboard/:path*', '/upload/:path*'],
};
