'use client'

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function AskAi() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setDroppedFile(files[0]); 
      console.log("Dropped file:", files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  
  const mockUploadedFiles = [
    new File(["content"], "project-plan.pdf"),
    new File(["content"], "requirements.docx"),
    new File(["content"], "summary.txt")
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col p-4 space-y-6">
        <h1 className="text-3xl font-bold text-blue-700">Ask AI</h1>
        <p className="text-lg text-gray-400 text-center md:text-left">
          Drag and drop any of your uploaded files below. The AI will read the content and assist you.
        </p>

        
        <section className="bg-gray-900 p-4 rounded-lg shadow w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-2">Your Uploaded Files</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-300">
            {mockUploadedFiles.map((file, index) => (
              <li key={index} className="bg-gray-800 p-2 rounded hover:bg-gray-700 transition cursor-pointer truncate">
                {file.name}
              </li>
            ))}
          </ul>
        </section>

        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-blue-600 rounded-lg p-6 text-center transition hover:border-blue-400"
        >
          <p className="text-gray-400">Drag & drop a file here to send to AI</p>
          {droppedFile && (
            <p className="mt-2 text-blue-400">File ready for AI: {droppedFile.name}</p>
          )}
        </div>

        
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-black text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Submit
          </button>
        </div>
      </main>
    </div>
  );
}
