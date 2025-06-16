// app/auth/callback/route.ts
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(request: NextRequest) {
  // ── 1) URL から `code` を取得
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    // ── 2) Supabase クライアントを生成して Cookie にセッション保存
    const supabase = createRouteHandlerClient({ cookies })
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      // 失敗時は /login に戻してエラーを渡す
      return NextResponse.redirect(
        new URL(`/login?e=${encodeURIComponent(error.message)}`, request.url)
      )
    }
  }

  // ── 3) 成功したら管理ダッシュボードへ
  return NextResponse.redirect(new URL('/admin', request.url))
}
