import { useState } from 'react'

export const FeedbackForm = () => {
  const [comment, setComment] = useState('')

  const handleFeedback = async (status: 'correct' | 'incorrect') => {
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: 'Q1',
        status,
        comment,
        userId: 'user-123',
        orgId: 'org-abc',
        timestamp: new Date().toISOString()
      }),
    })

    alert('フィードバックを送信しました')
    setComment('')
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button onClick={() => handleFeedback('correct')} className="bg-green-500 text-white px-4 py-2 rounded">
          この回答は正しい
        </button>
        <button onClick={() => handleFeedback('incorrect')} className="bg-red-500 text-white px-4 py-2 rounded">
          この回答は正しくない
        </button>
      </div>
      <input
        type="text"
        placeholder="補足コメントを入力..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      />
    </div>
  )
}
