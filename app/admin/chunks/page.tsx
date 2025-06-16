import { fetchFeedbackSummary } from '@/lib/supabase/feedback-summary';
import { supabase } from '@/lib/supabase/supabaseClient';
import { ChunkFeedbackTable } from '@/components/admin/ChunkFeedbackTable';

export default async function ChunkPage() {
  const feedbackList = await fetchFeedbackSummary();

  // 🔽 chunksを取得する処理を追加
  const { data: chunks, error: chunksError } = await supabase
    .from('chunks')
    .select('id, content');

  if (chunksError) throw chunksError;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">チャンク別フィードバック一覧</h2>
      <ChunkFeedbackTable feedbackList={feedbackList} chunks={chunks} />
    </div>
  );
}
