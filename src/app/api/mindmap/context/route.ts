import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper: try to extract JSON object from model output
function extractJson(raw: string): any | null {
  raw = raw.trim();
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  }
  // attempt direct parse
  try {
    return JSON.parse(raw);
  } catch {
    // try to find first {...} block
    const objMatch = raw.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try {
        return JSON.parse(objMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const context = typeof body?.context === "string" ? body.context.trim() : "";
    const pdfId = typeof body?.pdfId === "string" ? body.pdfId : undefined;

    if (!context) {
      return NextResponse.json({ error: "Missing document context" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
    }

    const modelName = process.env.GROQ_MODEL ?? "openai/gpt-oss-120b";

    // Prompt: request strict JSON with the schema we need
    const prompt = `
You are a document summarization assistant. Create a HIGH-LEVEL mind map of the provided document.
Focus on core ideas only and create nodes for top-level concepts and edges for direct relationships/hierarchy.

Return output STRICTLY as JSON ONLY, with NO extra text, no markdown backticks, and no commentary. Use this exact schema:

{
  "title": "string",
  "nodes": [
    { "id": "n1", "label": "string", "meta": { "page": 1 } }
  ],
  "edges": [
    { "from": "n1", "to": "n2", "label": "string" }
  ]
}

- Keep node labels short (3-8 words).
- Include page numbers in meta.page when available.
- Avoid overly fine-grained nodes; prefer higher-level concepts.
- Return valid JSON only.

CONTENT:
${context.slice(0, 12000)}
`;

    const completion = await groq.chat.completions.create({
      model: modelName,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.0,
      max_tokens: 1500,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";

    const parsed = extractJson(raw);

    if (!parsed) {
      // return raw output for debugging
      return NextResponse.json({
        error: "Failed to parse JSON from model output",
        raw,
      }, { status: 502 });
    }

    // Optional: Basic validation of schema
    if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
      return NextResponse.json({ error: "Model JSON missing nodes array", parsed }, { status: 502 });
    }

    return NextResponse.json({ mindmap: parsed, pdfId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("MINDMAP-CONTEXT ERROR:", err);
    const isApiKey = !process.env.GROQ_API_KEY || /api[_-]?key|unauthorized|401|403|invalid/i.test(String(message));
    return NextResponse.json({ error: isApiKey ? "GROQ_API_KEY missing or invalid" : message }, { status: 500 });
  }
}
