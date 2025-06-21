// app/auth/callback/route.ts  ← 新規作成または上書き
// ─────────────────────────────────────────────
export const runtime = 'nodejs';          // ← ⚠️ Edge ではなく Node.js で動かす

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient }
  from '@supabase/auth-helpers-nextjs';

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // --- PKCE を 1 回だけ交換 ---------------------------------
  const { error } = await supabase.auth.exchangeCodeForSession(req.url);
  if (error) {
    console.error('[auth/callback] exchange error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/login?error=` +
      encodeURIComponent(error.message),
    );
  }

  // --- ログイン後の遷移先 -----------------------------------
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`);
}
