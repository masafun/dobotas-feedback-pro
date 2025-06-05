// pages/api/gpt.ts
import { buildPromptWithChunks } from "@/utils/orgChunkManager"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { OpenAI } from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export const runtime = "edge"

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 })
  }

  const { org_id, user_question } = await req.json()
  if (!org_id || !user_question) {
    return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 })
  }

  const fullPrompt = await buildPromptWithChunks(org_id, user_question)

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "あなたは土木設計と施工にとても詳しいAIです。与えられたナレッジと質問に基づいて、正確にわかりやすく答えてください。" },
      { role: "user", content: fullPrompt }
    ],
    stream: true,
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
