import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  /* 未ログイン — /login へ */
  if (!session) {
    if (req.nextUrl.pathname.startsWith('/login')) return res;
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* ログイン済み — role 判定 */
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

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
