import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper: robust JSON extraction
function extractJson(raw: string): any | null {
  if (!raw) return null;
  let text = raw.trim();

  // Strip markdown code fences if present
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  // Attempt direct JSON parse
  try {
    return JSON.parse(text);
  } catch {
    // Look for outermost { ... }
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = text.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
      } catch {
        // Try cleaning trailing commas or stray backslashes
        const cleaned = candidate
          .replace(/,\s*([}\]])/g, "$1")
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
        try {
          return JSON.parse(cleaned);
        } catch {
          return null;
        }
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
      return NextResponse.json({ error: "Missing document context. Please provide PDF text." }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured in .env." },
        { status: 500 }
      );
    }

    const primaryModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
    const candidateModels = Array.from(
      new Set([primaryModel, "openai/gpt-oss-120b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant"])
    );

    const prompt = `
You are a knowledge graph generator. Analyze this document context and extract the main concepts and their hierarchical relationships.

Return strictly a JSON object with this exact structure:
{
  "title": "Clear Topic Title",
  "nodes": [
    { "id": "n1", "label": "Central Theme" },
    { "id": "n2", "label": "Key Concept 1" },
    { "id": "n3", "label": "Key Concept 2" }
  ],
  "edges": [
    { "from": "n1", "to": "n2", "label": "includes" },
    { "from": "n1", "to": "n3", "label": "enables" }
  ]
}

Rules:
- Make 5 to 10 nodes for a comprehensive, clean concept map.
- Keep node labels short (2 to 5 words).
- All edge 'from' and 'to' must match a node 'id'.
- Output only valid JSON. No markdown or explanation.

DOCUMENT CONTEXT:
${context.slice(0, 12000)}
`;

    let completion = null;
    let lastError: unknown = null;

    for (const model of candidateModels) {
      try {
        completion = await groq.chat.completions.create({
          model,
          messages: [
            { role: "system", content: "You are a JSON-only mindmap generator. Always return valid JSON." },
            { role: "user", content: prompt },
          ],
          temperature: 0.1,
          max_tokens: 1500,
          response_format: { type: "json_object" },
        });
        if (completion?.choices?.[0]?.message?.content) {
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Groq model ${model} failed, trying fallback...`, err);
      }
    }

    if (!completion?.choices?.[0]?.message?.content) {
      throw lastError || new Error("Failed to generate mindmap from AI models.");
    }

    const raw = completion.choices[0].message.content ?? "";
    let parsed = extractJson(raw);

    if (!parsed || typeof parsed !== "object") {
      // Fallback structure
      parsed = {
        title: pdfId || "Document Mind Map",
        nodes: [
          { id: "n1", label: "Document Overview" },
          { id: "n2", label: "Key Concepts" },
          { id: "n3", label: "Findings & Insights" }
        ],
        edges: [
          { "from": "n1", "to": "n2", "label": "covers" },
          { "from": "n1", "to": "n3", "label": "details" }
        ]
      };
    }

    // Normalize nodes
    if (!Array.isArray(parsed.nodes) || parsed.nodes.length === 0) {
      parsed.nodes = [{ id: "n1", label: parsed.title || "Main Concept" }];
    } else {
      parsed.nodes = parsed.nodes.map((n: any, idx: number) => ({
        id: String(n.id || `n${idx + 1}`),
        label: String(n.label || `Concept ${idx + 1}`).slice(0, 60),
        meta: n.meta,
      }));
    }

    // Normalize edges
    if (!Array.isArray(parsed.edges)) {
      parsed.edges = [];
    } else {
      parsed.edges = parsed.edges.map((e: any) => ({
        from: String(e.from || "n1"),
        to: String(e.to || "n1"),
        label: e.label ? String(e.label).slice(0, 30) : undefined,
      }));
    }

    return NextResponse.json({ mindmap: parsed, pdfId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("MINDMAP-CONTEXT API ERROR:", err);
    const isApiKey = !process.env.GROQ_API_KEY || /api[_-]?key|unauthorized|401|403|invalid/i.test(message);
    return NextResponse.json(
      {
        error: isApiKey
          ? "GROQ_API_KEY is missing or invalid. Check .env."
          : `Mindmap generation error: ${message}`,
      },
      { status: 500 }
    );
  }
}
