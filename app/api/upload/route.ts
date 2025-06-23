export const runtime = 'nodejs';

import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  const title = form.get('displayName') as string | null;

  if (!file || !title) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  /* 認証付きクライアント */
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  /* Storage へアップロード */
  const path = `${session.user.id}/${title}.pdf`;
  const { error } = await supabase.storage
    .from('pdfs')
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  /* 必要であればメタ情報も保存 */
  await supabase.from('files').insert({
    user_id: session.user.id,
    path,
    title,
  });

  return NextResponse.json({ success: true });
}
