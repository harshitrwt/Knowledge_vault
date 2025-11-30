import { NextResponse } from "next/server";
import Groq from "groq-sdk";

import { 
  getPdfContext, 
  getChatHistory, 
  addToChatHistory 
} from "@/lib/context";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { pdfId, question } = await req.json();

  if (!pdfId || !question) {
    return NextResponse.json({ error: "Missing pdfId or question" }, { status: 400 });
  }

  // Load stored PDF text (memory)
  const context = getPdfContext(pdfId);

  if (!context) {
    return NextResponse.json({
      answer: "This PDF has not been processed yet.",
    });
  }

  // Load chat memory
  const history = getChatHistory(pdfId);

  const systemPrompt = `
You are an AI research assistant. 
Answer ONLY using information found inside the provided PDF context.
If the context does not include the answer, say:
"I could not find relevant information in the provided document."
Be factual and avoid speculation.
`;

  const userPrompt = `
--- PDF CONTEXT ---
${context}

--- CHAT HISTORY ---
${history.join("\n")}

--- USER QUESTION ---
${question}

Provide your answer:
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const answer = completion.choices[0]?.message?.content?.trim() || "";

  // Save chat memory
  addToChatHistory(pdfId, `User: ${question}`);
  addToChatHistory(pdfId, `AI: ${answer}`);

  return NextResponse.json({ answer });
}
