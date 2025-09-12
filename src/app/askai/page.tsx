'use client'

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FileText, UploadCloud, Send } from "lucide-react";

type StoredFile = {
  id: string;
  name: string;
  size: number;
};

export default function AskAi() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [droppedFile, setDroppedFile] = useState<StoredFile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/files");
        if (res.ok) {
          setFiles(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch files:", err);
      }
      setLoading(false);
    };
    fetchFiles();
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setDroppedFile({
        id: "temp",
        name: file.name,
        size: file.size,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col p-6 space-y-8">
        
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-blue-500 tracking-wide">
            Ask AI
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Drag & drop your files or select one to get AI-powered insights.
          </p>
        </div>

        <section className="bg-gray-950/60 backdrop-blur p-6 rounded-2xl shadow-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">📂 Your Uploaded Files</h2>
          {loading ? (
            <p className="text-gray-400">Loading files...</p>
          ) : files.length === 0 ? (
            <p className="text-gray-500">No files uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-600/20 border border-blue-600 hover:bg-blue-600/30 transition cursor-pointer group"
                >
                  <FileText className="w-10 h-10 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-blue-300 truncate w-full text-center">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex flex-col items-center justify-center border-2 border-dashed border-blue-500 rounded-2xl p-10 text-center transition hover:border-blue-400 hover:bg-blue-500/10"
        >
          <UploadCloud className="w-12 h-12 text-blue-400 mb-3" />
          <p className="text-gray-300 text-lg">
            Drag & drop a file here, or click to upload
          </p>
          {droppedFile && (
            <p className="mt-3 text-blue-400 font-semibold">
              ✅ Ready: {droppedFile.name}
            </p>
          )}
        </div>

      
        <div className="w-full max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Ask me anything about your files..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-800 bg-gray-950/80 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md">
            <Send className="w-5 h-5" /> Ask
          </button>
        </div>
      </main>
    </div>
  );
}
