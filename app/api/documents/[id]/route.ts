import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest, context: { params: any }) {
  const id = context.params.id;

  return new Response(
    JSON.stringify({ message: `Document ${id} deleted.` }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
