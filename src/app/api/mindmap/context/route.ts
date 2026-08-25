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

Return output strictly matching this JSON schema:
{
  "title": "Document Title",
  "nodes": [
    { "id": "n1", "label": "Concise Label", "meta": { "page": 1 } }
  ],
  "edges": [
    { "from": "n1", "to": "n2", "label": "relationship" }
  ]
}

Rules:
- Keep node labels short (2 to 6 words).
- All edge 'from' and 'to' values MUST match an existing node 'id'.
- Do not include markdown or text outside of the JSON object.

CONTENT:
${context.slice(0, 8000)}
`;

    const completion = await groq.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: "You are a JSON-only mindmap generator. Always return valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 1200,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";
    let parsed = extractJson(raw);

    if (!parsed || typeof parsed !== "object") {
      return NextResponse.json({
        error: "Failed to parse JSON from model output",
        raw,
      }, { status: 502 });
    }

    // Ensure nodes array exists and is valid
    if (!parsed.nodes || !Array.isArray(parsed.nodes) || parsed.nodes.length === 0) {
      // Fallback: create default root node
      parsed.nodes = [{ id: "n1", label: parsed.title || "Main Concept" }];
    }

    if (!parsed.edges || !Array.isArray(parsed.edges)) {
      parsed.edges = [];
    }

    return NextResponse.json({ mindmap: parsed, pdfId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("MINDMAP-CONTEXT ERROR:", err);
    const isApiKey = !process.env.GROQ_API_KEY || /api[_-]?key|unauthorized|401|403|invalid/i.test(String(message));
    return NextResponse.json({ error: isApiKey ? "GROQ_API_KEY missing or invalid" : message }, { status: 500 });
  }
}
