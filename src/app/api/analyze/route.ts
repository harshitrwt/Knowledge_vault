import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

export const runtime = "nodejs";

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
      pdfParser.on("pdfParser_dataError", (err: any) => reject(err?.parserError ?? err));
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const pages = pdfData.Pages.map((page: any) =>
          page.Texts.map((t: any) => {
            const raw = t.R.map((r: any) => r.T).join(" ");
            try {
              return decodeURIComponent(raw);
            } catch {
              return raw; // skip broken encodings
            }
          }).join(" ")
        );

        resolve(pages.join("\n"));
      });
      pdfParser.parseBuffer(buffer);
    });

    if (!text.trim()) {
      return NextResponse.json({ error: "No extractable text found" }, { status: 422 });
    }

    // Optional: limit large files
    const limitedText = text.slice(0, 20000);

    return NextResponse.json({ text: limitedText });
  } catch (err: any) {
    console.error("PDF analysis failed:", err);
    return NextResponse.json(
      { error: "Analysis failed", details: err.message || String(err) },
      { status: 500 }
    );
  }
}
