// src/app/admin/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const email = session?.user.email ?? 'No Email';

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">管理ダッシュボード</h1>
      <p>ログインユーザー: <strong>{email}</strong></p>
      {/* ここに管理機能を追加 */}
    </div>
  );
}
