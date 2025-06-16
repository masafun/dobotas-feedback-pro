import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const source = searchParams.get("source")

    const { data, error } = await supabase
      .from("chunks")
      .select("content, source")
      .order("created_at", { ascending: true })

    if (error) {
      return NextResponse.json({ message: "取得失敗", error }, { status: 500 })
    }

    if (source) {
      const filtered = data.filter((item) => item.source === source)
      const content = filtered.map((item) => {
        try {
          return decodeURIComponent(escape(atob(item.content)))
        } catch (e) {
          return item.content // fallback in case of decoding failure
        }
      }).join("\n")
      return NextResponse.json({ content })
    }

    const sources = [...new Set(data.map((item) => item.source).filter(Boolean))]
    return NextResponse.json({ sources })
  } catch (err) {
    return NextResponse.json({ message: "例外発生", error: err }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const source = searchParams.get("source")

    if (!source) {
      return NextResponse.json({ message: "出典名が未指定です" }, { status: 400 })
    }

    const { error } = await supabase.from("chunks").delete().eq("source", source)
    if (error) {
      return NextResponse.json({ message: "削除に失敗しました" }, { status: 500 })
    }

    return NextResponse.json({ message: "削除成功", source })
  } catch (err) {
    return NextResponse.json({ message: "予期せぬエラーが発生しました", error: err }, { status: 500 })
  }
}
