"use client";

import { ReactNode, useState } from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/supabase-js";

export default function SupabaseProvider({
  children,
  serverSession,
}: {
  children: ReactNode;
  serverSession: Session | null;
}) {
  /* ★ createPagesBrowserClient を使用 */
  const [supabase] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={serverSession}
    >
      {children}
    </SessionContextProvider>
  );
}
