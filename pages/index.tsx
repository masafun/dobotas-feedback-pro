import { useState } from 'react'
import { FeedbackForm } from '../components/FeedbackForm'

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">法人別フィードバック</h1>
      <FeedbackForm />
    </div>
  )
}
