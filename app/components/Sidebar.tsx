// src/components/Sidebar.tsx
"use client";

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-4 border-r">
      <h2 className="text-lg font-bold mb-4">管理メニュー</h2>
      <ul className="space-y-2 text-sm">
        <li><a href="/admin" className="hover:underline">ダッシュボード</a></li>
        <li><a href="/admin/upload" className="hover:underline">アップロード</a></li>
        <li><a href="/admin/logout" className="hover:underline">ログアウト</a></li>
      </ul>
    </aside>
  );
}
