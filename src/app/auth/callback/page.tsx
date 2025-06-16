'use client';

import { useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

// 環境変数（Vercel / .env.local）
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function AuthCallback() {
  const router   = useRouter();
  const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON);

  useEffect(() => {
    (async () => {
      // URL (#access_token=...) → Cookie にセッション保存
      const { error } = await supabase.auth.getSessionFromUrl();

      if (!error) router.replace('/admin');          // 成功 → ダッシュボード
      else        router.replace(`/login?e=${encodeURIComponent(error.message)}`);
    })();
  }, [router, supabase]);

  return <p className="p-6 text-center">ログイン処理中...</p>;
}
