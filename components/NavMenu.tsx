'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function NavMenu() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const role = data?.user?.user_metadata?.role;
      setIsSuperAdmin(role === 'superadmin');
    };
    fetchUser();
  }, []);

  return (
    <nav className="p-4 bg-gray-100">
      <a href="/dashboard" className="mr-4">ダッシュボード</a>
      {isSuperAdmin && <a href="/admin" className="text-red-600">スーパー管理</a>}
    </nav>
  );
}
