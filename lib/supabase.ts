// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

// 型がまだ無い場合は any で凌ぐ
type Database = any;

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
