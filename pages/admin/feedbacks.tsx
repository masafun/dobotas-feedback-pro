import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"

type Feedback = {
  id: string
  status: string
  comment: string
  timestamp: string
}

export default function FeedbackHistory() {
  const [orgId, setOrgId] = useState("org-a")
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .eq("org_id", orgId)
        .order("timestamp", { ascending: false })

      if (!error && data) setFeedbacks(data)
    }

    fetchData()
  }, [orgId])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Feedback History</h1>
      <label className="block mb-2">Filter by organization:</label>
      <select value={orgId} onChange={e => setOrgId(e.target.value)} className="mb-4 border px-2 py-1 rounded">
        <option value="org-a">Org A</option>
        <option value="org-b">Org B</option>
      </select>
      <table className="w-full border-t">
        <thead>
          <tr>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Comment</th>
            <th className="text-left py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(fb => (
            <tr key={fb.id}>
              <td className={`text-sm ${fb.status === "correct" ? "text-green-600" : "text-red-600"}`}>
                {fb.status}
              </td>
              <td className="text-sm">{fb.comment}</td>
              <td className="text-sm">{new Date(fb.timestamp).toISOString().slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
