'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function LoginForm() {
  const params = useSearchParams();
  const initialEmail = params.get('email') ?? '';

  const [email, setEmail] = useState(initialEmail);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const supabase = createBrowserSupabaseClient();

  /* 60 秒クールダウン用タイマー */
  useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => setCooldown((sec) => sec - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (cooldown) return;

    setError(null);
    setLoading(true);

    try {
      /* Magic-Link 送信 */
// const { error } = await supabase.auth.signInWithOtp({
//   email,
//   options: {
//     emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
//   },
// });
    const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    skipBrowserRedirect: true,  // ← PKCEをスキップするv1方式
  },
});
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      /* Rate-limit は別メッセージ */
      if (/rate limit/i.test(err.message)) {
        setCooldown(60);
        setError('60 秒以内の再送はできません');
      } else {
        setError(err.message || '送信に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  }

  /* 送信後メッセージ */
  if (sent) {
    return <p className="text-green-700 mt-4">メールを確認してください ✉️</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 items-center">
      <input
        type="email"
        placeholder="you@example.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        disabled={loading || cooldown > 0}
        className="bg-blue-600 text-white py-2 rounded w-full disabled:opacity-60"
      >
        {loading ? '送信中…' : cooldown > 0 ? `${cooldown} 秒待機` : '送信'}
      </button>

      {error && <p className="text-red-600 text-sm">送信失敗: {error}</p>}
    </form>
  );
}
