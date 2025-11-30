import fs from "fs";
import path from "path";

const contextPath = path.join(process.cwd(), "data");
const contextFile = path.join(contextPath, "context.json");

// Ensure folder exists
if (!fs.existsSync(contextPath)) {
  fs.mkdirSync(contextPath, { recursive: true });
}

// Create initial data if missing
if (!fs.existsSync(contextFile)) {
  fs.writeFileSync(
    contextFile,
    JSON.stringify({ pdfs: {}, chats: {} }, null, 2)
  );
}

function loadAll() {
  try {
    const raw = fs.readFileSync(contextFile, "utf8");
    const data = JSON.parse(raw);

    // AUTO-REPAIR missing keys
    if (typeof data !== "object" || data === null) {
      throw new Error("Invalid JSON");
    }

    if (!data.pdfs) data.pdfs = {};
    if (!data.chats) data.chats = {};

    return data;
  } catch (err) {
    // File corrupted → reset clean
    const initial = { pdfs: {}, chats: {} };
    fs.writeFileSync(contextFile, JSON.stringify(initial, null, 2));
    return initial;
  }
}

function saveAll(data: any) {
  fs.writeFileSync(contextFile, JSON.stringify(data, null, 2));
}

/* ---------------- PDF CONTEXT ---------------- */

export function getPdfContext(pdfId: string): string | null {
  const data = loadAll();
  return data.pdfs[pdfId] || null;
}

export function savePdfContext(pdfId: string, text: string) {
  const data = loadAll();

  if (!data.pdfs) data.pdfs = {}; // extra safety
  data.pdfs[pdfId] = text;

  saveAll(data);
}

/* ---------------- CHAT CONTEXT ---------------- */

export function getChatHistory(pdfId: string): string[] {
  const data = loadAll();

  if (!data.chats) data.chats = {}; // safety
  return data.chats[pdfId] || [];
}

export function addToChatHistory(pdfId: string, message: string) {
  const data = loadAll();

  if (!data.chats) data.chats = {};
  if (!data.chats[pdfId]) data.chats[pdfId] = [];

  data.chats[pdfId].push(message);
  data.chats[pdfId] = data.chats[pdfId].slice(-20);

  saveAll(data);
}

export function clearChatHistory(pdfId: string) {
  const data = loadAll();
  if (!data.chats) data.chats = {};
  data.chats[pdfId] = [];
  saveAll(data);
}
