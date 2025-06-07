import { useState } from "react"

export default function ChatPage() {
  const [orgId, setOrgId] = useState("00000000-0000-0000-0000-000000000000")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [sources, setSources] = useState<string[]>([])
  const [feedbackStatus, setFeedbackStatus] = useState<"correct" | "incorrect" | "">("")
  const [feedbackComment, setFeedbackComment] = useState("")

  const handleAsk = async () => {
  setLoading(true)
  setAnswer("")
  setSources([])
  setFeedbackStatus("")
  setFeedbackComment("")
  try {
    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ org_id: orgId, user_question: question })
    })
    const json = await res.json()
    setAnswer(json.result)
    setSources(json.sources || [])
  } catch (err) {
    setAnswer("⚠️ ネットワークエラー: " + err.message)
  }
  setLoading(false)
}

const handleSubmitFeedback = async () => {
  await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      org_id: orgId,
      user_id: "00000000-0000-0000-0000-000000000000",
      question_id: question,
      status: feedbackStatus,
      comment: feedbackComment
    })
  })
  alert("フィードバックを送信しました")
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
  <>
    <div className="mt-4 bg-gray-100 p-3 rounded whitespace-pre-wrap">
      <h2 className="font-bold mb-2">AIの回答:</h2>
      {answer}
    </div>

    <div className="mt-6">
      <h3 className="font-bold">この回答は正しいですか？</h3>
      <div className="flex gap-4 mt-2">
        <button
          className={`border px-4 py-1 rounded ${feedbackStatus === "correct" ? "bg-green-200" : ""}`}
          onClick={() => setFeedbackStatus("correct")}
        >👍 正しい</button>
        <button
          className={`border px-4 py-1 rounded ${feedbackStatus === "incorrect" ? "bg-red-200" : ""}`}
          onClick={() => setFeedbackStatus("incorrect")}
        >👎 正しくない</button>
      </div>
      <textarea
        placeholder="補足コメントを入力..."
        value={feedbackComment}
        onChange={(e) => setFeedbackComment(e.target.value)}
        className="mt-2 w-full border p-2"
        rows={3}
      />
      <button
        onClick={handleSubmitFeedback}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!feedbackStatus}
      >
        フィードバック送信
      </button>
    </div>
  </>
)}
{sources.length > 0 && (
  <div className="mt-4">
    <h3 className="font-bold">出典ナレッジ:</h3>
    <ul className="list-disc pl-5 text-sm text-gray-700">
      {sources.map((src, i) => (
        <li key={i}>{src.length > 50 ? src.slice(0, 50) + "..." : src}</li>
      ))}
    </ul>
  </div>
)}
    </div>
  )
}