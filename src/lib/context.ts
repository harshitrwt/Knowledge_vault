import fs from "fs";
import path from "path";

const contextPath = path.join(process.cwd(), "data");
const contextFile = path.join(contextPath, "context.json");

// Ensure folder + file exist
if (!fs.existsSync(contextPath)) {
  fs.mkdirSync(contextPath, { recursive: true });
}

if (!fs.existsSync(contextFile)) {
  fs.writeFileSync(contextFile, JSON.stringify({ pdfs: {}, chats: {} }, null, 2));
}

function loadAll() {
  return JSON.parse(fs.readFileSync(contextFile, "utf8"));
}

function saveAll(data: any) {
  fs.writeFileSync(contextFile, JSON.stringify(data, null, 2));
}

/* ------------------------------------------------------
   PDF CONTEXT FUNCTIONS
------------------------------------------------------ */

export function getPdfContext(pdfId: string): string | null {
  const data = loadAll();
  return data.pdfs[pdfId] || null;
}

export function savePdfContext(pdfId: string, text: string) {
  const data = loadAll();
  data.pdfs[pdfId] = text;
  saveAll(data);
}

/* ------------------------------------------------------
   CHAT MEMORY FUNCTIONS
------------------------------------------------------ */

export function getChatHistory(pdfId: string): string[] {
  const data = loadAll();
  return data.chats[pdfId] || [];
}

export function addToChatHistory(pdfId: string, message: string) {
  const data = loadAll();
  if (!data.chats[pdfId]) data.chats[pdfId] = [];
  data.chats[pdfId].push(message);

  // Limit history to last 20 messages
  data.chats[pdfId] = data.chats[pdfId].slice(-20);
  saveAll(data);
}

export function clearChatHistory(pdfId: string) {
  const data = loadAll();
  data.chats[pdfId] = [];
  saveAll(data);
}
