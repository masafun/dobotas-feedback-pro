import { useState } from "react"

export default function ChatPage() {
  const [orgId, setOrgId] = useState("00000000-0000-0000-0000-000000000000")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    setLoading(true)
    setAnswer("")

    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ org_id: orgId, user_question: question })
    })

    const json = await res.json()
    setAnswer(json.result)
    setLoading(false)
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">法人別AIチャット</h1>

      <label className="block text-sm mb-1">法人選択:</label>
      <select value={orgId} onChange={e => setOrgId(e.target.value)} className="mb-4 w-full border px-2 py-1">
        <option value="00000000-0000-0000-0000-000000000000">Org A</option>
        <option value="85554790-009e-46b4-b72b-013059bcdfc1">Org B</option>
      </select>

      <div className="flex flex-col gap-2 mb-4">
        <textarea
          className="w-full border p-2"
          rows={4}
          placeholder="質問を入力してください"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleAsk}
          disabled={loading || !question.trim()}
        >
          {loading ? "送信中..." : "送信"}
        </button>
      </div>

      {answer && (
        <div className="mt-4 bg-gray-100 p-3 rounded whitespace-pre-wrap">
          <h2 className="font-bold mb-2">AIの回答:</h2>
          {answer}
        </div>
      )}
    </div>
  )
}