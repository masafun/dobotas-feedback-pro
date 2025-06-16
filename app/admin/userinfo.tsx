// app/(admin)/userinfo.tsx
"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function UserInfo() {
  const [info, setInfo] = useState<{ company_id: string; role: string } | null>(null)

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: userData } = await supabase
        .from("users")
        .select("company_id, role")
        .eq("id", user?.id)
        .single()
      setInfo(userData)
    }
    fetchUser()
  }, [])

  if (!info) return <p>Loading...</p>
  return (
    <div className="text-sm text-slate-600">
      Logged in as: <b>{info.role}</b><br />
      Company ID: <code>{info.company_id}</code>
    </div>
  )
}
