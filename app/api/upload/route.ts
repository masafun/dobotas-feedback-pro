// /app/api/upload/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const POST = async (req: Request) => {
  /*────────────────── ① Cookie 取得は最初に ──────────────────*/
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  /*────────────────── ② formData 取得 ──────────────────*/
  const form = await req.formData();
  const pdf   = form.get("pdf")   as File | null;
  const title = form.get("title") as string | null;
  if (!pdf || !title) {
    return NextResponse.json(
      { message: "PDFファイルまたは出典名の両方が必須です" },
      { status: 400 }
    );
  }

  /*────────────────── ③ 認証チェック ──────────────────*/
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json(
      { message: "認証情報が見つかりません" },
      { status: 401 }
    );
  }

  /*────────────────── ④ Storage アップロード ──────────────────*/
  const key = `${user.id}/${Date.now()}_${pdf.name}`;
  const { error: upErr } = await supabase.storage
    .from("documents")
    .upload(key, pdf, {
      contentType: pdf.type || "application/pdf",
      upsert: false,
    });
  if (upErr) {
    return NextResponse.json(
      { message: `Storage 失敗: ${upErr.message}` },
      { status: 500 }
    );
  }

  /*────────────────── ⑤ DB 登録 ──────────────────*/
  const { error: dbErr } = await supabase.from("chunks").insert({
    owner: user.id,
    source: title,
    filename: key,
  });
  if (dbErr) {
    await supabase.storage.from("documents").remove([key]);
    return NextResponse.json(
      { message: `データベース登録 失敗: ${dbErr.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "アップロード成功", key }, { status: 201 });
};
