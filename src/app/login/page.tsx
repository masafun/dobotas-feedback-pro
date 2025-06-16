'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'http://localhost:3000/admin',
      },
    });

    if (error) {
      alert('ログインリンク送信に失敗しました: ' + error.message);
    } else {
      alert('メールにログインリンクを送信しました！');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">管理者ログイン</h1>
      <input
        type="email"
        className="border w-full p-2 mb-2"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin} className="bg-green-500 text-white w-full py-2 rounded">
        Magic Linkでログイン
      </button>
    </div>
  );
}
