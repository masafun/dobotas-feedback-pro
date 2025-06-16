// app/page.tsx  ─ ルートに配置
import { redirect } from 'next/navigation';

export default function RootPage() {
  // 例：常に /login へ
  redirect('/login');
  return null;
}
