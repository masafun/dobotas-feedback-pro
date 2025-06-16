"use client"

import PdfUpload from "@/components/PdfUpload"

export default function FilesPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">📁 PDF管理</h1>
      <PdfUpload />
    </div>
  )
}