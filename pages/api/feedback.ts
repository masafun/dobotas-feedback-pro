import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" })
  const { org_id, user_id, question_id, status, comment } = req.body

  const { error } = await supabase.from("feedbacks").insert([
    { org_id, user_id, question_id, status, comment }
  ])

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
