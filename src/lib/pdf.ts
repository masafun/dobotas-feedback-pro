// lib/pdf.ts
import path from "path"
import { createRequire } from "module"
import pdf from "pdf-parse"

export default function parsePDF(buffer: Buffer) {
  return pdf(buffer)
}
