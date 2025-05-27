import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { questionId, status, comment, userId, orgId, timestamp } = req.body

    const { error } = await supabase.from('feedbacks').insert([
      { question_id: questionId, status, comment, user_id: userId, org_id: orgId, timestamp }
    ])

    if (error) return res.status(500).json({ error })
    return res.status(200).json({ message: '保存成功' })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
