// pages/api/gpt.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { buildPromptWithChunks } from "../../utils/orgChunkManager"
import { OpenAI } from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" })

  const { org_id, user_question } = req.body
  if (!org_id || !user_question) return res.status(400).json({ error: "Missing parameters" })

  const fullPrompt = await buildPromptWithChunks(org_id, user_question)

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "あなたは土木設計と施工にとても詳しいAIです。与えられたナレッジと質問に基づいて、正確にわかりやすく答えてください。" },
      { role: "user", content: fullPrompt }
    ]
  })

  return res.status(200).json({ result: completion.choices[0].message.content })
}