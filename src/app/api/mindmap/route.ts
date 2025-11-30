import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import PDFParser from "pdf2json";

import { savePdfContext } from "@/lib/context";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Convert PDF → text using pdf2json
function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => {
      reject((err && "parserError" in err) ? (err as any).parserError : err);
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
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No PDF uploaded" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const text = await extractTextFromPDF(buffer);

    // Use file name as PDF identifier
    const pdfId = file.name;

    // Save extracted text for chatbot
    savePdfContext(pdfId, text);

    // Mindmap prompt
    const prompt = `
Convert the following PDF content into a structured mind-map.

Format strictly as:
• Main Topic
  ◦ Sub Topic
    ▪ Detail

CONTENT:
${text}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const mindmap = completion.choices[0].message.content;

    return NextResponse.json({
      mindmap,
      pdfId, // returned so chatbot can use same context
    });
  } catch (err: any) {
    console.error("MINDMAP ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
