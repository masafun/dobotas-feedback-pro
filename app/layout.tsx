// app/layout.tsx
import "../styles/globals.css";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import SupabaseProvider from "@/components/SupabaseProvider";

/*
 * NOTE:
 * Using `next/dynamic` with `{ ssr: false }` in a Server Component
 * triggers an error in Next.js.
 * The SupabaseProvider component is already a client component (`"use client"`).
 * Import it directly instead of using a dynamic import.
 */

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "PDF Upload" };

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ★ 1. ここで cookies() を同期的に取得 */
  const cookieStore = cookies();

  /* ★ 2. 関数ラップして渡す */
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  /* 3. サーバー側で session を取る */
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* 4. クライアント全体へセッションを供給 */}
        <SupabaseProvider serverSession={session}>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
