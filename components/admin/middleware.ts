// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // セッションは取得するが、リダイレクトは行わない
  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: ['/admin/:path*'], // admin 配下だけ対象にする
};
