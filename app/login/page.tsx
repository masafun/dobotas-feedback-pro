'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

/**
 * 英語エラーメッセージ → 日本語メッセージのマッピング辞書
 */
const ERROR_JP: Record<string, string> = {
  'email rate limit exceeded'          : 'メール送信回数の上限に達しました。1分後に再試行してください。',
  'only request'                       : 'リンクの再送は60秒後にお試しください。',
  'One of email or phone must be set'  : 'メールアドレスを入力してください。',
  'Invalid login credentials'          : 'メールアドレスまたはパスワードが正しくありません。',
  // 追加したい場合はここへ追記
};

// 追加 state
const [cooldown, setCooldown] = useState(0);   // 残り秒数


// Supabase 環境変数（Vercel / .env.local に設定済み前提）
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SITE_URL      = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState<
    | { type: "success" | "error"; msg: string }
    | null
  >(null);

  // v2 では URL と anonKey を必須引数で渡す
  const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON);

  /**
   * Magic‑Link を送信
   */
const handleSendLink = async () => {
  if (cooldown > 0) return;          // クールタイム中は無視
  setAlert(null);

  try {
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${SITE_URL}/auth/callback` },
    });
    setAlert({ type: 'success', msg: 'ログインリンクを送信しました。メールをご確認ください。' });

    // ── 60 秒クールダウン開始
    setCooldown(60);
    const timer = setInterval(() => setCooldown((s) => {
      if (s <= 1) { clearInterval(timer); return 0; }
      return s - 1;
    }), 1_000);

  } catch (err: any) {
    const raw = err?.message ?? '';
    const jp = Object.entries(ERROR_JP).find(([k]) => raw.includes(k))?.[1];
    setAlert({ type: 'error', msg: jp ?? `送信に失敗しました: ${raw}` });
  }
};

  return (
    <div className="mx-auto max-w-md space-y-6 py-10">
      <h1 className="text-2xl font-bold text-center">管理者用ログイン画面</h1>

      <label className="block">
        <span className="font-semibold">メールアドレス</span>
        <input
          type="email"
          className="mt-1 w-full rounded border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </label>
	<button
	  onClick={handleSendLink}
	  disabled={!email || cooldown > 0}
	  className={`w-full rounded py-3 font-semibold
	    ${cooldown
	      ? 'bg-gray-400 cursor-not-allowed'
	      : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
	>
	  {cooldown ? `再送は ${cooldown}s 後` : 'メールでログインリンクを受け取る'}
	</button>
      {alert && (
        <p
          className={
            alert.type === "success" ? "text-blue-600" : "text-red-600"
          }
        >
          {alert.msg}
        </p>
      )}
    </div>
  );
}
