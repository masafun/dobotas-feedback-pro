// src/components/SupabaseProvider.tsx
"use client";

import { createBrowserClient } from "@supabase/ssr";
import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

interface Props {
  serverSession: Session | null;
  children: React.ReactNode;
}

const SupabaseCtx = createContext<ReturnType<typeof createBrowserClient> | null>(null);

export function useSupabase() {
  const ctx = useContext(SupabaseCtx);
  if (!ctx) throw new Error("SupabaseProvider の外で useSupabase は使えません");
  return ctx;
}

export default function SupabaseProvider({ serverSession, children }: Props) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. 初回は serverSession を Cookie に同期
  const [session, setSession] = useState<Session | null>(serverSession);

  useEffect(() => {
    /**
     * auth 状態監視
     */
    const { data: listener } = supabase.auth.onAuthStateChange((_, newSession) =>
      setSession(newSession)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <SupabaseCtx.Provider value={supabase}>
      {children}
    </SupabaseCtx.Provider>
  );
}
