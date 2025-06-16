// app/auth/callback/route.ts
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

  // ── 1) URL のクエリから `code` を取得
  const code = new URL(request.url).searchParams.get('code')

  if (code) {
    // ── 2) code をセッション Cookie に交換
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    // 交換失敗したら /login へ戻す
    if (error) {
      const url = new URL('/login', request.url)
      url.searchParams.set('e', error.message)
      return NextResponse.redirect(url)
    }
  }

  // ── 3) 成功したら管理ダッシュボードへ
  return NextResponse.redirect(new URL('/admin', request.url))
}
