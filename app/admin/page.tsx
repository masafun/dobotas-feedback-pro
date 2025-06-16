'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ✅ ログインしていなければ / に戻す
  if (!session || !session.user) {
    redirect('/');
  }

  const userEmail = session.user.email;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">管理ダッシュボード</h1>

      <p className="text-gray-700">
        こんにちは、<strong>{userEmail}</strong> さん 👋
      </p>

      <ul className="list-disc list-inside text-gray-800 text-sm">
        <li>
          <a href="/admin/upload" className="text-blue-600 underline">
            PDFアップロードページへ
          </a>
        </li>
        <li>
          <a href="/admin/logout" className="text-blue-600 underline">
            ログアウト
          </a>
        </li>
      </ul>
    </div>
  );
}
