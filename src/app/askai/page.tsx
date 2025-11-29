import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { question, context, history = [] } = await req.json();

  const systemPrompt = `
You are an advanced AI research assistant embedded within a document analysis system.
Your primary role is to extract insights, summarize details, and answer questions strictly based on the supplied PDF context.
You must treat the PDF content as the only source of truth and never fabricate information.

--- RULES ---
1. Only use information from the provided context.
2. If the answer cannot be found, respond exactly with:
   "I could not find relevant information in the provided document."
3. Be concise, precise, and factual.
4. If the question has multiple subparts, respond using bullet points or numbers.
5. If the context includes structured or numerical data, summarize it clearly.
6. Never speculate or reference anything outside the provided context.
`;

  const userPrompt = `
--- CONTEXT (Extracted PDF Text) ---
${context}

--- USER QUESTION ---
${question}

Provide your final answer below:
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    max_tokens: 800,
    messages: [
      { role: "system", content: systemPrompt },                                  // ADD HISTORY HERE
      { role: "user", content: userPrompt }
    ],
  });

  return NextResponse.json({
    answer: completion.choices[0]?.message?.content?.trim() || "No answer found.",
  });
}
