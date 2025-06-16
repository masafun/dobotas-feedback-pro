// app/components/RegisterChunkForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterChunkForm() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserAndCompanies = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.user_metadata?.role === 'superadmin') {
        setIsSuperAdmin(true);
        const { data: orgs } = await supabase.from('companies').select('id, name');
        setCompanies(orgs || []);
      } else {
        // 通常ユーザーのorg_id取得
        const { data } = await supabase.from('users').select('org_id').eq('id', user?.id).single();
        if (data?.org_id) setSelectedOrgId(data.org_id);
      }
    };
    fetchUserAndCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId) return setMessage('org_id が選択されていません');

    const { error } = await supabase.from('chunks').insert({
      title,
      content,
      org_id: selectedOrgId,
    });

    if (error) setMessage('登録に失敗しました');
    else {
      setMessage('登録に成功しました');
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md max-w-xl">
      {isSuperAdmin && (
        <div>
          <label className="block mb-1 font-semibold">法人を選択</label>
          <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="w-full border px-2 py-1"
          >
            <option value="">-- 選択してください --</option>
            {companies.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block mb-1 font-semibold">タイトル</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        登録
      </button>

      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </form>
  );
}