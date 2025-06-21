// app/login/actions/route.ts
export const runtime = 'nodejs';       // ←★ 追加：Edge → Node.js 実行に固定
export const dynamic = 'force-dynamic';// ←★ 追加：キャッシュさせない

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content-type' }, { status: 400 });
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'メールアドレスがありません' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    if (!supabase || typeof supabase.auth?.signInWithOtp !== 'function') {
      console.error('Supabase client init failed');
      return NextResponse.json({ error: 'Supabase初期化失敗' }, { status: 500 });
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error('Unexpected server error:', err);
    return NextResponse.json({ error: '内部エラーが発生しました' }, { status: 500 });
  }
}
