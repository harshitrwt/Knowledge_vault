import { NextResponse } from "next/server";
import Groq from "groq-sdk";

import { 
  getPdfContext, 
  getChatHistory, 
  addToChatHistory 
} from "@/lib/context";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  let body: { pdfId?: string; question?: string; context?: string; messages?: Array<{ role: string; content: string }> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { pdfId, question, context: contextFromBody, messages: conversationHistory } = body;

  if (!question?.trim()) {
    return NextResponse.json({ error: "Missing question" }, { status: 400 });
  }

  // Use context from request body (AskAI flow) or look up by pdfId (mindmap/other flows)
  let context = contextFromBody?.trim();
  if (!context && pdfId) {
    context = getPdfContext(pdfId) ?? "";
  }

  if (!context) {
    return NextResponse.json({
      error: "No document context available. Please analyze a PDF first.",
    }, { status: 400 });
  }

  // Limit context size to avoid token limits
  const limitedContext = context.slice(0, 20000);

  // Load chat memory (used when pdfId is present)
  const history = pdfId ? getChatHistory(pdfId) : [];
  const systemPrompt = `
You are an advanced AI research assistant embedded within a document analysis system.
Your primary role is to extract insights, summarize details, and answer questions based on the supplied PDF context.
Treat the PDF content as the main source of truth.

--- RULES ---
1. Answer from the document context. You MAY give suggestions, advice, and recommendations DERIVED from the document (e.g., "Based on the report, beginners might benefit from...", "The document suggests that..."). Do not refuse when the user asks for suggestions or advice—provide them when they can be reasonably inferred from the context.
2. For follow-up questions, use the full conversation history to understand references (e.g., "that", "it", "the first point"). Stay on topic regarding the document.
3. If the question is clearly OUT OF SCOPE (unrelated to the document, e.g., weather, sports, random trivia), say: "This question is outside the scope of the document. I can only answer questions about the provided content."
4. If specific facts cannot be found in the context, say: "I could not find that specific information in the document."
5. FORMAT using Markdown: **bold**, headings (## ###), numbered/bullet lists, line breaks between sections.
6. Be helpful and natural. Do not be overly rigid—offer insights and recommendations when they stem from the document.
`;

  const historyMessages = Array.isArray(conversationHistory)
    ? conversationHistory.slice(-10).map((m) => ({
        role: m.role,
        content: String(m.content ?? "").slice(0, 2000),
      }))
    : [];

  const contextBlock = `--- DOCUMENT CONTEXT ---\n${limitedContext}`;
  const historyBlock = historyMessages.length
    ? `\n--- PREVIOUS CONVERSATION (for follow-up context) ---\n${historyMessages.map((m) => `${m.role}: ${m.content}`).join("\n\n")}\n`
    : "";
  const questionBlock = `\n--- CURRENT QUESTION ---\n${question}`;

  const userMessage = contextBlock + historyBlock + questionBlock;

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured. Add it to your .env file." },
      { status: 500 }
    );
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const answer = completion.choices[0]?.message?.content?.trim() || "";

  // Save chat memory when we have a pdfId (mindmap/context flow)
    if (pdfId) {
      addToChatHistory(pdfId, `User: ${question}`);
      addToChatHistory(pdfId, `AI: ${answer}`);
    }

    return NextResponse.json({ answer });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Chat API error:", err);
    const isAuthError = /api[_-]?key|unauthorized|401|403|invalid/i.test(message);
    return NextResponse.json(
      {
        error: isAuthError
          ? "Invalid or missing Groq API key. Check GROQ_API_KEY in .env"
          : `Chat failed: ${message}`,
      },
      { status: 500 }
    );
  }
}
