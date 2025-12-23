// lib/ocr.ts
import Tesseract from "tesseract.js";

export async function extractTextWithOCR(buffer: Buffer): Promise<string> {
  const { data } = await Tesseract.recognize(buffer, "eng", {
    logger: (m) => console.log("OCR:", m.status),
  });

  return data.text;
}
