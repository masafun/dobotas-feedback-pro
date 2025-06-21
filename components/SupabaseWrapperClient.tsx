'use client';

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';

export default function SupabaseWrapperClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseBrowser(); // ★毎回同じインスタンス
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}
