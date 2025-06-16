import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // ここで削除処理を行う（例: Supabaseなど）
  // const { error } = await supabase.from('documents').delete().eq('id', id);

  // 今回はダミーでレスポンス
  return new Response(
    JSON.stringify({ message: `Document with ID ${id} deleted.` }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}