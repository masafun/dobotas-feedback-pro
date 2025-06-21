import { createBrowserClient } from '@supabase/ssr';

let browserClient:
  | ReturnType<typeof createBrowserClient>
  | undefined;

export const getSupabaseBrowser = () => {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return browserClient;
};
