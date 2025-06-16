'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// ❶ 画面先頭付近に辞書を用意
const ERROR_JP: Record<string, string> = {
  'email rate limit exceeded'          : 'メール送信回数の上限に達しました。1分後に再試行してください。',
  'only request'                       : 'リンクの再送は60秒後にお試しください。',
  'One of email or phone must be set'  : 'メールアドレスを入力してください。',
  'Invalid login credentials'          : 'メールアドレスまたはパスワードが正しくありません。',
  // 追加したい場合はここへ追記
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState<
    | { type: "success" | "error"; msg: string }
    | null
  >(null);

  const supabase = createBrowserClient();
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  /**
   * Magic‑Link を送信
   */
  const handleSendLink = async () => {
    setAlert(null);
    try {
      await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${SITE_URL}/auth/callback` },
      });

      setAlert({
        type: "success",
        msg: "ログインリンクを送信しました。メールをご確認ください。",
      });
    } catch (err: any) {
      const raw = err?.message ?? "";
      const jp = Object.entries(ERROR_JP).find(([key]) => raw.includes(key))?.[1];

      setAlert({
        type: "error",
        msg: jp ?? `送信に失敗しました: ${raw}`,
      });
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
        className="w-full rounded bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700"
      >
        メールでログインリンクを受け取る
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