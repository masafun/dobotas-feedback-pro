// src/components/SupabaseProvider.tsx
"use client";

import { ReactNode, useState } from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/supabase-js";

export default function SupabaseProvider({
  children,
  serverSession,
}: {
  children: ReactNode;
  serverSession: Session | null;
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={serverSession}
    >
      {children}
    </SessionContextProvider>
  );
}
