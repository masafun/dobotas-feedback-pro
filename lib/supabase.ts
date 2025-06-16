// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'
import { type Database } from '@/types/supabase' // 省略可（型生成済みの場合）

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)