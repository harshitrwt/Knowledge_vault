import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { question, context } = await req.json();

  const prompt = `
  You are an AI assistant. Answer user questions only based on the following PDF content.
  Be precise and concise.

  Context:
  ${context}

  Question:
  ${question}
  `;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });



  return NextResponse.json({
    answer: completion.choices[0]?.message?.content || "No answer found.",
  });
}
