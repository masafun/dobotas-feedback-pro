"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type UserRow = {
  id: string
  email: string
  company_id: string
  role: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, company_id, role")

      if (!error && data) {
        setUsers(data)
      } else {
        console.error(error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">👥 Users</h1>
      <table className="w-full table-auto border text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Company ID</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">{u.company_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
