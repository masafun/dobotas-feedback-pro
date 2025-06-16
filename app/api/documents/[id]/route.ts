import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // filename 取得
  const { data: chunk, error: selErr } = await supabase
    .from('chunks')
    .select('filename')
    .eq('id', params.id)
    .single();
  if (selErr || !chunk) return new Response('not found', { status: 404 });

  // Storage から削除
  const { error: rmErr } = await supabase.storage
    .from('documents')
    .remove([chunk.filename]);
  if (rmErr) return new Response(rmErr.message, { status: 500 });

  // テーブル行も削除
  const { error: delErr } = await supabase
    .from('chunks')
    .delete()
    .eq('id', params.id);
  if (delErr) return new Response(delErr.message, { status: 500 });

  return new Response(null, { status: 204 });
};
