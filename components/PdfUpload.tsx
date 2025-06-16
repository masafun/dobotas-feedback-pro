"use client";
// PDFアップロード UI（出典名入力付き）＋ 一覧表示＋ 削除

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SourceEntry {
  id?: string;          // chunks.id（DELETE 用）※API が返せない場合 undefined
  source: string;       // 出典名
  filename: string;     // Storage 内 key
  url: string;          // 署名 URL
}

export default function PdfUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sources, setSources] = useState<SourceEntry[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [showAll, setShowAll] = useState(false);

  /** 一覧取得 */
  const fetchSources = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/files");
      const json = await res.json();
      // API が { data: [...] } でも単配列でも拾えるように
      const list: SourceEntry[] = json.data ?? json;
      setSources(Array.isArray(list) ? list.reverse() : []);
    } catch (err) {
      console.error(err);
      setMessage("一覧取得に失敗しました");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  /** アップロード処理 */
  const handleUpload = async () => {
    if (!file || !title) {
      setMessage("PDFファイルと出典名の両方を入力してください");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setMessage("⚠️ ファイルサイズが 50 MB を超えています");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);      // ← route.ts とキーを合わせる
    formData.append("title", title);

    setUploading(true);
    setMessage("");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "アップロード失敗");

      setMessage(data.message ?? "アップロード完了");
      // 成功後に一覧を再取得
      fetchSources();
      // フォームリセット
      setFile(null);
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setMessage(err.message ?? "アップロード時にエラーが発生しました");
    } finally {
      setUploading(false);
    }
  };

  /** 削除処理 */
  const handleDelete = async (entry: SourceEntry) => {
    const ok = window.confirm(`「${entry.source}」を削除しますか？`);
    if (!ok) return;

    setMessage("");
    try {
      const url = entry.id
        ? `/api/files?id=${entry.id}`
        : `/api/files?source=${encodeURIComponent(entry.source)}`; // 後方互換
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "削除失敗");

      setMessage(data.message ?? "削除しました");
      fetchSources();
    } catch (err: any) {
      setMessage(err.message ?? "削除時にエラーが発生しました");
    }
  };

  const displayed = showAll ? sources : sources.slice(0, 5);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="font-semibold">PDFアップロード（出典名付き）</h2>

          {/* ファイル選択 */}
          <Input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          {/* 出典名入力 */}
          <Input
            type="text"
            placeholder="出典名（例：道路土工 擁壁工指針 H24）"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* アップロードボタン */}
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "アップロード中..." : "アップロード"}
          </Button>

          {/* メッセージ */}
          {message && <p className="text-sm text-gray-600">{message}</p>}

          {/* 一覧表示 */}
          {sources.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">出典一覧：</h3>

              {loadingList ? (
                <p className="text-sm text-gray-500">読み込み中...</p>
              ) : (
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {displayed.map((entry) => (
                    <li
                      key={entry.id ?? entry.filename}
                      className="flex flex-col gap-1 border-b border-gray-200 pb-2 mb-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{entry.source}</span>

                        <div className="flex gap-2">
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm"
                          >
                            PDFを表示
                          </a>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(entry)}
                          >
                            削除
                          </Button>
                        </div>
                      </div>

                      {/* 署名 URL 表示（参考用） */}
                      <textarea
                        className="w-full text-xs p-2 border rounded bg-gray-100 text-gray-700"
                        value={entry.url}
                        readOnly
                        rows={4}
                      />
                    </li>
                  ))}
                </ul>
              )}

              {sources.length > 5 && (
                <Button
                  variant="link"
                  className="mt-2 text-blue-600"
                  onClick={() => setShowAll((v) => !v)}
                >
                  {showAll ? "閉じる" : "もっと見る"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
