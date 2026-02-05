import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

export const runtime = "nodejs";

function extractTextFromPdfData(pdfData: { Pages?: Array<{ Texts?: Array<{ R?: Array<{ T?: string }> }> }> }): string {
  const pages = pdfData?.Pages;
  if (!pages || !Array.isArray(pages)) return "";

  const pageTexts = pages.map((page) => {
    const texts = page?.Texts;
    if (!texts || !Array.isArray(texts)) return "";

    return texts
      .map((t) => {
        const runs = t?.R;
        if (!runs || !Array.isArray(runs)) return "";
        const raw = runs.map((r) => r?.T ?? "").join(" ");
        try {
          return decodeURIComponent(raw);
        } catch {
          return raw;
        }
      })
      .join(" ");
  });

  return pageTexts.join("\n");
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const text = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (err: Error | { parserError: Error }) => {
        const message = err instanceof Error ? err.message : err?.parserError?.message ?? "PDF parsing error";
        reject(new Error(message));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: unknown) => {
        try {
          const extracted = extractTextFromPdfData(pdfData as Parameters<typeof extractTextFromPdfData>[0]);
          resolve(extracted || "");
        } catch (e) {
          reject(e instanceof Error ? e : new Error("Failed to extract text"));
        }
      });

      pdfParser.parseBuffer(buffer);
    });

    if (!text.trim()) {
      return NextResponse.json(
        { error: "No extractable text found in this PDF. It may be scanned/image-based." },
        { status: 422 }
      );
    }

    const limitedText = text.slice(0, 20000);
    return NextResponse.json({ text: limitedText });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("PDF analysis failed:", err);
    return NextResponse.json(
      {
        error: "Analysis failed",
        details: message,
        hint: "Try a different PDF or ensure the file is not corrupted.",
      },
      { status: 500 }
    );
  }
}
