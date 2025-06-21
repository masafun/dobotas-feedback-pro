// lib/supabase/server.ts
// ─────────────────────────────────────────────
import { cookies } from 'next/headers';
import {
  // App Router (RSC) 用
  createServerComponentClient as _createServerComponentClient,
  // Route Handler (/app/api/**/route.ts) 用
  createRouteHandlerClient    as _createRouteHandlerClient,
  // Pages Router 用
  createServerSupabaseClient  as _createServerSupabaseClient,
} from '@supabase/auth-helpers-nextjs';

// ───────────── App Router (Server Component) ─────────────
export const createServerComponentClient = () =>
  _createServerComponentClient(
    { cookies },                                   // ← headers を渡さない
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
  );

// ───────────── Route Handler (/app/api) ────────────────
export const createRouteHandlerSupabaseClient = () =>
  _createRouteHandlerClient(
    { cookies },                                   // ← headers を渡さない
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
  );

// ───────────── Pages Router (getServerSideProps) ───────
export const createPagesRouterClient = (
  ctx: Parameters<typeof _createServerSupabaseClient>[0],
) =>
  _createServerSupabaseClient(ctx, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });

// ───────────── 既存コード互換エイリアス ─────────────
export const createServerSupabaseClient = createServerComponentClient;
