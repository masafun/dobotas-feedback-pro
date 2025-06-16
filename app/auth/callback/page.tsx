// app/auth/callback/page.tsx (例)
'use client';
import { useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    (async () => {
      // URL からトークンを取り込みセッションに保存
      const { error } = await supabase.auth.getSessionFromUrl();
      if (!error) router.replace('/admin');        // 成功したらダッシュボードへ
      else        router.replace('/login?error');  // 失敗したらエラー表示
    })();
  }, []);

  return <p className="p-4">ログイン処理中...</p>;
}
