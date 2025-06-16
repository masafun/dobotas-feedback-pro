import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const GET = async () => {
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore }); 
  const { data, error } = await supabase
    .from('chunks')
    .select('id, source, filename, created_at')
    .order('created_at', { ascending: false });

  if (error) return new Response(error.message, { status: 500 });

  // Storage 署名 URL (30分) を付与
  const withUrls = await Promise.all(
    data.map(async (row) => {
      const { data: signed } = await supabase.storage
        .from('documents')
        .createSignedUrl(row.filename, 60 * 30);
      return { ...row, url: signed?.signedUrl };
    })
  );

  return Response.json(withUrls);
};
