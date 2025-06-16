'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Home() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:'${process.env.NEXT_PUBLIC_SITE_URL}/admin' // ✅ ログイン後の遷移先
      },
    });

    if (error) {
      setMessage('ログインリンクの送信に失敗しました: ' + error.message);
    } else {
      setMessage('ログイン用リンクをメールで送信しました。ご確認ください。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">管理者用ログイン画面</h1>

        <div>
          <label className="block mb-1 font-medium">メールアドレス</label>
          <input
            type="email"
            className="border w-full p-2 rounded"
            placeholder="メールアドレスを入力"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
        >
          メールでログインリンクを受け取る
        </button>

        {message && <p className="text-center text-sm text-gray-700">{message}</p>}

        <div className="text-center text-sm text-gray-500 space-y-1 pt-2 border-t mt-4">
          <p><a href="#" className="underline">パスワードをお忘れですか？</a></p>
          <p>アカウントをお持ちでない方は <a href="#" className="underline">新規登録</a></p>
        </div>
      </div>
    </div>
  );
}
