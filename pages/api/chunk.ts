// pages/api/chunk.ts
import { supabase } from "../../lib/supabaseClient"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { org_id, chunk, metadata } = req.body

    if (!org_id || !chunk) {
      return res.status(400).json({ error: "org_id and chunk are required" })
    }

    const { error } = await supabase.from("feedback_chunks").insert([
      { org_id, chunk, metadata }
    ])

    if (error) return res.status(500).json({ error })
    return res.status(200).json({ message: "チャンク保存に成功しました" })
  }

  return res.status(405).json({ error: "Method not allowed" })
}
