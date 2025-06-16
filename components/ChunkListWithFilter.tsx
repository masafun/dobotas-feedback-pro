'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useOrgStore } from '@/lib/store/orgStore';   // ← 型付きストア

/** Supabase chunks テーブルの行型 */
interface Chunk {
  id: string;
  org_id: string;
  source: string;
  filename: string;
  created_at: string;
}

export default function ChunkListWithFilter() {
  const supabase = createClientComponentClient();

  // Zustand から法人IDと setter を取得
  const selectedOrgId   = useOrgStore((s) => s.selectedOrgId);
  const setSelectedOrgId = useOrgStore((s) => s.setSelectedOrgId);

  const [chunks,  setChunks]  = useState<Chunk[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [filter,  setFilter]  = useState<string>('');

  /** 法人IDが変わったらデータ読み込み */
  useEffect(() => {
    if (!selectedOrgId) return;

    (async () => {
      const { data, error } = await supabase
        .from('chunks')
        .select('id, org_id, source, filename, created_at')
        .eq('org_id', selectedOrgId);

      if (error) {
        console.error(error);
        return;
      }
      setChunks(data);
      setSources([...new Set(data.map((c) => c.source).filter(Boolean))]);
    })();
  }, [selectedOrgId]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">登録済みChunks一覧</h2>

      {/* === superadmin 用の法人セレクタ例 === */}
      <label className="block">
        法人選択:
        <select
          className="border p-1 mx-2"
          value={selectedOrgId ?? ''}
          onChange={(e) => setSelectedOrgId(e.target.value)}
        >
          <option value="">未選択</option>
          {/* TODO: 法人一覧を動的に埋め込む */}
        </select>
      </label>

      {/* === source フィルタ === */}
      {sources.length > 0 && (
        <label className="block">
          Source フィルタ:
          <select
            className="border p-1 mx-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">すべて</option>
            {sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      )}

      {/* === 一覧テーブル === */}
      {chunks.length === 0 ? (
        <p>データがありません。</p>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr>
              <th className="border p-1">ID</th>
              <th className="border p-1">Source</th>
              <th className="border p-1">Filename</th>
              <th className="border p-1">Created</th>
            </tr>
          </thead>
          <tbody>
            {chunks
              .filter((c) => (filter ? c.source === filter : true))
              .map((c) => (
                <tr key={c.id}>
                  <td className="border p-1">{c.id}</td>
                  <td className="border p-1">{c.source}</td>
                  <td className="border p-1">{c.filename}</td>
                  <td className="border p-1">
                    {new Date(c.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
