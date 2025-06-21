// app/login/actions/route.ts
// 最小構成の POST ハンドラ

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get('email') ?? '').trim();
  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      // 本物の Supabase エラー
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  } catch (e: any) {
    // Supabase JS が 204 No‑Content を誤って JSON パースし、
    // "Unexpected end of JSON input" を投げる既知の挙動。
    if (!(e?.message?.includes('Unexpected end of JSON input'))) {
      return NextResponse.json({ error: e.message || 'unknown error' }, { status: 400 });
    }
    // 上記メッセージならメール送信自体は成功しているので無視して通す。
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
