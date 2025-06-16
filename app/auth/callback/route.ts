// app/auth/callback/route.ts  ─ ルートハンドラ
import { NextResponse, type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  // Supabase クライアント (Cookie を扱うため cookies() を渡す)
  const supabase = createRouteHandlerClient({ cookies });

  // ── Magic-Link／OAuth 用：URL 内のトークンを Cookie に交換
  const { error } = await supabase.auth.exchangeCodeForSession(request);

  // 失敗したら /login にリダイレクトし、クエリにエラー文を付与
  if (error) {
    const url = new URL('/login', request.url);
    url.searchParams.set('e', error.message);
    return NextResponse.redirect(url);
  }

  // 成功したら管理ダッシュボードへ
  return NextResponse.redirect(new URL('/admin', request.url));
}
