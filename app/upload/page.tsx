// src/app/upload/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import PdfUpload from '@/components/PdfUpload';

export default async function UploadPage() {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  return (
    <div className="p-10">
      <PdfUpload />
    </div>
  );
}
