import { useState } from "react"
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'

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

      <textarea
	  placeholder="質問を入力..."
	  value={question}
	  onChange={(e) => setQuestion(e.target.value)}
	  style={{ width: "300px", height: "100px" }}
	  className="mt-2 border p-2 text-base font-sans leading-relaxed"
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
	  <div className="mt-4 flex">
	    <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-xl shadow max-w-3xl relative">
	      <h2 className="font-bold text-blue-800 mb-3">💡 ドボタスの回答</h2>
	      <Latex className="text-base leading-relaxed font-sans text-gray-900 whitespace-pre-wrap break-words">
	        {answer.replace(/\*\*(.+?)\*\*/g, '\\\\textbf{$1}')}
	      </Latex>
	      <div className="absolute left-[-10px] top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-yellow-300" />
	    </div>
	  </div>
	)}

{sources.length > 0 && (
  <div className="mt-4">
    <h3 className="font-bold">出典:</h3>
    <ul className="list-disc pl-5 text-sm text-gray-700">
      {sources.map((src, i) => (
        <li key={i}>{src.length > 50 ? src.slice(0, 50) + "..." : src}</li>
      ))}
    </ul>
  </div>
)}


{answer && (
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
      style={{ width: "300px", height: "50px" }}
      className="mt-2 border p-2"
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
)}
    </div>
  )
}