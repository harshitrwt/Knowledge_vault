import fs from "fs";
import path from "path";

const uploadsDir = path.join(process.cwd(), "uploads");

// Ensure folder exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function getFileBuffer(fileId: string): Promise<Buffer> {
  const filePath = path.join(uploadsDir, fileId);

  if (!fs.existsSync(filePath)) {
    throw new Error("File not found: " + fileId);
  }

  return fs.readFileSync(filePath);
}
