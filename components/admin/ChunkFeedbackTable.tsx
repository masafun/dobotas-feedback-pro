'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

type Chunk = {
  id: string;
  content: string;
};

type Feedback = {
  chunk_id: string;
  up_count: number;
  down_count: number;
  last_feedback_at?: string;
};

type Props = {
  feedbackList: Feedback[];
  chunks: Chunk[];
};

export const ChunkFeedbackTable = ({ feedbackList, chunks }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>チャンク本文</TableHead>
          <TableHead>👍</TableHead>
          <TableHead>👎</TableHead>
          <TableHead>評価率</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedbackList.map((item) => {
          const chunk = chunks.find((c) => c.id === item.chunk_id);
          const total = item.up_count + item.down_count;
          const rate = total > 0 ? (item.up_count / total) * 100 : 0;

          // 色分けクラス（Tailwind）
          const rateColor =
            rate >= 80 ? 'text-green-600 font-bold' :
            rate < 50 ? 'text-red-500 font-bold' :
            'text-yellow-600';

          return (
            <TableRow key={item.chunk_id}>
              <TableCell className="max-w-sm truncate">
                {chunk?.content || '(本文なし)'}
              </TableCell>
              <TableCell>{item.up_count}</TableCell>
              <TableCell>{item.down_count}</TableCell>
              <TableCell className={rateColor}>
                {rate.toFixed(1)}%
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
