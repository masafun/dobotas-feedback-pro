'use client';

import { useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

// .env.local / Vercel の環境変数
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function AuthCallback() {
  const router   = useRouter();
  const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON);

  useEffect(() => {
    (async () => {
      // ① URL の #access_token / #refresh_token を取得
      const hash   = window.location.hash.substring(1);           // 先頭の「#」を除去
      const params = new URLSearchParams(hash);
      const access_token  = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (access_token && refresh_token) {
        // ② トークンをセッションに保存
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (!error) {
          router.replace('/admin');           // ③ 成功 → ダッシュボード
          return;
        }
      }
      // 失敗したらログイン画面へ
      router.replace('/login?e=callback_error');
    })();
  }, [router, supabase]);

  return <p className="p-6 text-center">ログイン処理中...</p>;
}
