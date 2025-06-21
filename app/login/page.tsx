'use client';

import { useEffect } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import LoginForm from './LoginForm';

/**
 * ログインページ（クライアント側でセッション確認）
 *  - セッションがあれば /dashboard へリダイレクト
 *  - 無ければ <LoginForm /> を表示
 */
export default function LoginPage() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  // マウント時に 1 度だけセッション確認
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard');
    });
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-xl font-bold mb-6">メールログイン</h1>
      <LoginForm />
    </main>
  );
}
