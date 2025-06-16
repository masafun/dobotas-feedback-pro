// app/admin/logout/page.tsx
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  // サーバー側で supabase クライアントを作成（cookie経由）
  const supabase = createServerActionClient({ cookies });

  // サインアウトを実行
  await supabase.auth.signOut();

  // /admin/login にリダイレクト
  redirect("/admin/login");
}
