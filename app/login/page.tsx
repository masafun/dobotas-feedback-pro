'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import LoginForm from './LoginForm';

/**
 * ログインページ
 *  - 既にログイン済みなら /dashboard へ即リダイレクト
 *  - 未ログインなら <LoginForm /> を表示
 */
export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  /* 初回マウント時にセッション確認 */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard');
    });

    /* Auth 状態が変わったら自動リダイレクト */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace('/dashboard');
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
