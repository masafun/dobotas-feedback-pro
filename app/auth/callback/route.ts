// app/auth/callback/route.ts
// ─────────────────────────────────────────────
export const runtime = 'nodejs';

import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

/**
 * Magic-Link のリダイレクト先
 *  - セッション交換が成功 → /dashboard へ
 *  - 失敗             → /login?error=... へ
 */
export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  /* ── PKCE セッション交換 ───────────────── */
  const { error } = await supabase.auth.exchangeCodeForSession(req.url);

  /* デバッグ用ログ（Vercel → Deployments → Logs に出る） */
  console.log('[callback] url=', req.url);
  console.log('[callback] error=', error);

  /* 成功：/dashboard へ、失敗：/login にエラー付きで戻す */
  if (error) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('error', error.message);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.redirect(new URL('/dashboard', req.url));
}
