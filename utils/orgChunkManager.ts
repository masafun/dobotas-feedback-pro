// utils/orgChunkManager.ts
import { supabase } from "../lib/supabaseClient"

export const getChunksForOrg = async (orgId: string) => {
  const { data, error } = await supabase
    .from("feedback_chunks")
    .select("chunk")
    .filter("org_id", "eq", orgId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("チャンク取得エラー:", error.message)
    return []
  }

  return data?.map(entry => entry.chunk) || []
}

export const buildPromptWithChunks = async (
  orgId: string,
  userQuestion: string
): Promise<string> => {
  const chunks = await getChunksForOrg(orgId)
  const header = `以下は社内ナレッジの一部です（org_id=${orgId}）:\n` + chunks.slice(0, 5).join("\n---\n")
  const prompt = `${header}\n\n質問: ${userQuestion}`
  return prompt
}
