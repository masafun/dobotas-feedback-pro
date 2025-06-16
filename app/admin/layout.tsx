
// app/(admin)/layout.tsx
import { Sidebar } from "@/components/Sidebar"
import '../../styles/globals.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}