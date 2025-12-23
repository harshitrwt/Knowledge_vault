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
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No PDF provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1️⃣ Extract text
    let text = await extractTextFromPDF(buffer);

    // 2️⃣ Trim & clean text (VERY IMPORTANT)
    text = text
      .replace(/\s+/g, " ")
      .replace(/Page \d+/gi, "")
      .slice(0, 12000); // token safety

    const pdfId = file.name;

    // Save for chatbot context
    savePdfContext(pdfId, text);

    // 3️⃣ PERFECT MINDMAP PROMPT
    const prompt = `
You are an expert at understanding documents quickly.

Your task:
Create a HIGH-LEVEL MIND MAP that explains the BASIC IDEA of the document.

Rules:
- Focus on OVERVIEW, not details
- Do NOT quote text
- Do NOT include examples
- Maximum depth: 2 levels
- Each description must be short (1 line)
- Group similar ideas together
- Ignore references, footnotes, indexes

FORMAT STRICTLY AS A TABLE:

| MAIN TOPIC | SUB TOPIC | CORE IDEA |
|------------|-----------|-----------|
|            |           |           |

CONTENT:
${text}
`;

    // 4️⃣ Call Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You generate structured, clean, academic-quality summaries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 1200,
    });

    const mindmap =
      completion.choices[0]?.message?.content || "No output generated.";

    return NextResponse.json({
      mindmap,
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
