import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  context: { params: any }  // ← 型エラーを避けたい場合 any でOK
) {
  const id = context.params.id;

  // ここで DB/Supabase の削除処理など
  // await supabase.from('documents').delete().eq('id', id);

  return new Response(
    JSON.stringify({ message: `Document ${id} deleted.` }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
