// src/app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    (async () => {
      // URL フラグメント (#access_token=...) からセッションをセット
      const { error } = await supabase.auth.getSessionFromUrl();
      if (!error) router.replace('/admin');
      else router.replace(`/login?error=${encodeURIComponent(error.message)}`);
    })();
  }, []);

  return <p className="p-6 text-center">ログイン処理中...</p>;
}
