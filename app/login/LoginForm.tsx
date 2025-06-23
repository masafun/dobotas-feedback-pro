'use client';

import { useState, FormEvent } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserSupabaseClient();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      // ⚠️ options なし！ → PKCE検証されず、確実に送れる
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
      <label className="text-center font-bold text-lg">メールログイン</label>

      <input
        type="email"
        placeholder="you@example.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 rounded disabled:opacity-60"
      >
        {loading ? '送信中…' : '送信'}
      </button>

      {sent && (
        <p className="text-green-600 text-sm">メールを送信しました ✉️</p>
      )}
      {error && (
        <p className="text-red-600 text-sm">送信に失敗: {error}</p>
      )}
    </form>
  );
}
