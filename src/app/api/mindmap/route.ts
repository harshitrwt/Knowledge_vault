import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import PDFParser from "pdf2json";

import { savePdfContext } from "@/lib/context";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (err: { parserError?: string }) =>
      reject(new Error((err as any)?.parserError ?? "PDF parsing error"))
    );
    pdfParser.on("pdfParser_dataReady", () => {
      try {
        const text = pdfParser.getRawTextContent?.() ?? "";
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
    const formData = await req.formData();

    const uploadedFile = formData.get("pdf") as File | null;
    const fileId = formData.get("fileId") as string | null;

    let buffer: Buffer;
    let pdfId: string;

    if (uploadedFile) {
      // ✅ Case 1: New upload
      buffer = Buffer.from(await uploadedFile.arrayBuffer());
      pdfId = uploadedFile.name;
    // } else if (fileId) {
    //   // ✅ Case 2: Existing stored file
    //   // YOU MUST IMPLEMENT THIS BASED ON YOUR STORAGE
    //   const storedPdfBuffer = await getPdfBufferById(fileId); // 👈 required
    //   buffer = storedPdfBuffer;
    //   pdfId = fileId;
    // } 
    }else {
      return NextResponse.json(
        { error: "No PDF or fileId provided" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured. Add it to your .env file." },
        { status: 500 }
      );
    }

    const text = await extractTextFromPDF(buffer);

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "No extractable text found in PDF. The file may be scanned or image-based." },
        { status: 422 }
      );
    }

    savePdfContext(pdfId, text);

    const prompt = `
Create a HIGH-LEVEL mind map of this document.
Focus on core ideas only.
Return output in a TABLE format.

CONTENT:
${text.slice(0, 12000)}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 1200,
    });

    return NextResponse.json({
      mindmap: completion.choices[0].message.content,
      pdfId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("MINDMAP ERROR:", err);
    const isApiKey = !process.env.GROQ_API_KEY || /api[_-]?key|unauthorized|401|403|invalid/i.test(message);
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

