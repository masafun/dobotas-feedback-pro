import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data, error } = await supabase
      .from('files')
      .select('id, source, filename, created_at');

    if (error) throw error;

    // ★ new Set() を ES2015 イテレータで展開
    const sources = [...new Set(data.map((item) => item.source).filter(Boolean))];

    return NextResponse.json({ sources });
  } catch (err) {
    return NextResponse.json({ message: '例外発生', error: err }, { status: 500 });
  }
};
