// components/Sidebar.tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menu = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Files", href: "/admin/files" },
  { label: "Q&A Logs", href: "/admin/logs" },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-64 bg-slate-800 text-white p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4">Dobo+ 管理画面</h2>
      {menu.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`block px-2 py-1 rounded hover:bg-slate-700 ${
            pathname === item.href ? "bg-slate-700" : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  )
}
