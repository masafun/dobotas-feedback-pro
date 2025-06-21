import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // セッション無ければログインへ
  if (!session) redirect('/login');

  // ここからダッシュボード本体
  return (
    <section className="p-8">
      <h1 className="text-2xl font-bold mb-4">管理ダッシュボード</h1>
      {/* …ダッシュボード UI… */}
    </section>
  );
}
