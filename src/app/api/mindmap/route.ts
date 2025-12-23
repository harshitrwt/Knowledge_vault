import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import PDFParser from "pdf2json";

import { savePdfContext } from "@/lib/context";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Convert PDF → text
function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => {
      reject((err as any)?.parserError || err);
    });

    pdfParser.on("pdfParser_dataReady", () => {
      try {
        const text = pdfParser.getRawTextContent();
        resolve(text);
      } catch (err) {
        reject(err);
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

    const text = await extractTextFromPDF(buffer);

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
  } catch (err: any) {
    console.error("MINDMAP ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}

