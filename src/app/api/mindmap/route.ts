import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import PDFParser from "pdf2json";
import { savePdfContext } from "@/lib/context";

export const runtime = "nodejs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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

function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (err: Error | { parserError: Error }) => {
      const message = err instanceof Error ? err.message : err?.parserError?.message ?? "PDF parsing error";
      reject(new Error(message));
    });
    pdfParser.on("pdfParser_dataReady", (pdfData: unknown) => {
      try {
        const text = extractTextFromPdfData(pdfData as Parameters<typeof extractTextFromPdfData>[0]);
        resolve(text || "");
      } catch (e) {
        reject(e instanceof Error ? e : new Error("Failed to extract text"));
      }
    });
    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(req: Request) {
  try {
    let text = "";
    let pdfId = "document";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      text = body?.context || "";
      pdfId = body?.pdfId || "document";
    } else {
      const formData = await req.formData();
      const uploadedFile = formData.get("pdf") as File | null;
      if (uploadedFile) {
        const buffer = Buffer.from(await uploadedFile.arrayBuffer());
        pdfId = uploadedFile.name;
        text = await extractTextFromPDF(buffer);
      }
    }

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "No document text available to generate mindmap." },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured. Add it to your .env file." },
        { status: 500 }
      );
    }

    savePdfContext(pdfId, text);

    const prompt = `
Create a structured HIGH-LEVEL mind map of this document.
Focus on core ideas and direct hierarchy.

Return output strictly matching this JSON schema:
{
  "title": "Document Title",
  "nodes": [
    { "id": "n1", "label": "Main Topic" },
    { "id": "n2", "label": "Sub Topic" }
  ],
  "edges": [
    { "from": "n1", "to": "n2", "label": "connects to" }
  ]
}

CONTENT:
${text.slice(0, 8000)}
`;

    const modelName = process.env.GROQ_MODEL ?? "openai/gpt-oss-120b";
    const completion = await groq.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: "You are a JSON-only mindmap generator. Always return valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 1200,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    let mindmapData = null;
    try {
      mindmapData = JSON.parse(raw);
    } catch {
      mindmapData = { nodes: [{ id: "n1", label: "Document" }], edges: [] };
    }

    return NextResponse.json({
      mindmap: mindmapData,
      pdfId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("MINDMAP ERROR:", err);
    const isApiKey = !process.env.GROQ_API_KEY || /api[_-]?key|unauthorized|401|403/i.test(message);
    return NextResponse.json(
      {
        error: isApiKey
          ? "GROQ_API_KEY is missing or invalid. Add it to .env and restart."
          : message,
      },
      { status: 500 }
    );
  }
}
