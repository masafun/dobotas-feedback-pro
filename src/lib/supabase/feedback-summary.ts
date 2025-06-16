// lib/supabase/feedback-summary.ts
import { supabase } from './supabaseClient'; // ✅ 正しい

export const fetchFeedbackSummary = async () => {
  const { data, error } = await supabase
    .from('view_chunk_feedback_summary')
    .select('chunk_id, up_count, down_count, last_feedback_at');

  if (error) throw error;
  return data;
};
