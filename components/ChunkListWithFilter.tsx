// app/components/ChunkListWithFilter.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { create } from 'zustand';

// Zustand store for sharing selectedOrgId
const useOrgStore = create((set) => ({
  selectedOrgId: '',
  setSelectedOrgId: (id: string) => set({ selectedOrgId: id }),
}));

export default function ChunkListWithFilter() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [chunks, setChunks] = useState<any[]>([]);
  const [userRole, setUserRole] = useState('');
  const [userOrgId, setUserOrgId] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');

  const selectedOrgId = useOrgStore((state) => state.selectedOrgId);
  const setSelectedOrgId = useOrgStore((state) => state.setSelectedOrgId);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role;
      setUserRole(role);

      if (role === 'superadmin') {
        const { data: orgs } = await supabase.from('companies').select();
        setCompanies(orgs || []);
      } else {
        const { data } = await supabase.from('users').select('org_id').eq('id', user?.id).single();
        setUserOrgId(data?.org_id);
        setSelectedOrgId(data?.org_id);
      }
    };
    fetchUser();
  }, [setSelectedOrgId]);

  useEffect(() => {
    const fetchChunks = async () => {
      if (!selectedOrgId) return;
      const { data } = await supabase
        .from('chunks')
        .select('*')
        .eq('org_id', selectedOrgId)
        .order('created_at', { ascending: false });
      setChunks(data || []);
    };
    fetchChunks();
  }, [selectedOrgId]);

  const handleDelete = async (id: string) => {
    await supabase.from('chunks').delete().eq('id', id);
    setChunks((prev) => prev.filter((chunk) => chunk.id !== id));
  };

  const handleAddCompany = async () => {
    if (!newCompanyName.trim()) return;
    const { error } = await supabase.from('companies').insert({ name: newCompanyName });
    if (!error) {
      const { data: orgs } = await supabase.from('companies').select();
      setCompanies(orgs || []);
      setNewCompanyName('');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-bold">登録済みChunks一覧</h2>

      {userRole === 'superadmin' && (
        <div className="space-y-2">
          <div>
            <label className="font-semibold">法人選択:</label>
            <select
              className="ml-2 border px-2 py-1"
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
            >
              <option value="">-- 選択してください --</option>
              {companies.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="新しい法人名"
              className="border px-2 py-1"
            />
            <button onClick={handleAddCompany} className="bg-green-500 text-white px-3 py-1 rounded">
              法人追加
            </button>
          </div>
        </div>
      )}

      <ul className="list-disc pl-6">
        {chunks.map((chunk) => (
          <li key={chunk.id} className="mb-2">
            <div className="flex justify-between items-center">
              <div>
                <strong>{chunk.title}</strong>: {chunk.content}
              </div>
              {userRole === 'superadmin' && (
                <button
                  onClick={() => handleDelete(chunk.id)}
                  className="text-red-500 hover:underline"
                >
                  削除
                </button>
              )}
            </div>
          </li>
        ))}
        {chunks.length === 0 && <p className="text-gray-500">データがありません。</p>}
      </ul>
    </div>
  );
}
