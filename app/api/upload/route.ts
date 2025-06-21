// app/api/upload/route.ts
// ─────────────────────────────────────────────
export const runtime = 'nodejs';

import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: NextRequest) {
  /* フォームデータ取得 */
  const form = await req.formData();
  const file = form.get('file') as File | null;
  const title = form.get('displayName') as string | null;

  if (!file || !title) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  /* Cookie 付きクライアント（認証情報付き） */
  const supabase = createRouteHandlerClient({ cookies });

  /* セッションチェック */
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  /* Storage へアップロード（バケット: pdfs） */
  const path = `${session.user.id}/${title}.pdf`;
  const { error } = await supabase.storage
    .from('pdfs')
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  /* 必要ならメタ情報を DB に保存 */
  await supabase.from('files').insert({
    user_id: session.user.id,
    path,
    title,
  });

  return NextResponse.json({ success: true });
}
