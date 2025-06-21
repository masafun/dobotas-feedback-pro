'use client';

import { createContext } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

export const SupabaseContext = createContext(getSupabaseBrowser());

export default function SupabaseWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseBrowser(); // 常に同じインスタンスが返る

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}
