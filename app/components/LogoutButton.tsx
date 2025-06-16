// src/components/LogoutButton.tsx
"use client";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const supabase = useSupabaseClient();
  return (
    <Button
      variant="outline"
      onClick={async () => {
        await supabase.auth.signOut();
        location.reload(); // 状態更新
      }}
    >
      ログアウト
    </Button>
  );
}
