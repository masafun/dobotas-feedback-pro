'use client';

import { Suspense, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import LoginForm from './LoginForm';

/**
 * ログインページ
 *  - セッションがあれば /dashboard へリダイレクト
 *  - なければ <LoginForm> を表示
 */
export default function LoginPage() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard');
    });
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-xl font-bold mb-6">メールログイン</h1>

      {/* Suspense で useSearchParams() を保護 */}
      <Suspense fallback={<p>読み込み中…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}

/* ★ ページ単位で動的レンダリングを強制 — Static Generation を無効化 */
export const dynamic = 'force-dynamic';
