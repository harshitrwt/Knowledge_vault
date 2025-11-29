"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function MindmapPage() {
  const [file, setFile] = useState<File | null>(null);
  const [mindmapData, setMindmapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/mindmap", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMindmapData(data.nodes || []);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      
        <Sidebar />
      

      {/* Mobile sidebar toggle (optional) */}
      <div className="md:hidden fixed top-0 left-0 z-50 w-64 h-full bg-black border-r border-blue-500">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-6">
          Create Mindmap
        </h1>

        {/* Upload Section */}
        <div className="border border-blue-500 rounded-xl p-6 max-w-xl mb-8">
          <label className="block mb-4 font-semibold">
            Upload PDF to generate mindmap
          </label>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 bg-zinc-900 border border-blue-500 rounded-lg mb-4"
          />

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 rounded-lg transition"
          >
            {loading ? "Generating..." : "Generate Mindmap"}
          </button>
        </div>

        {/* Mindmap View */}
        <div className="border border-zinc-800 rounded-xl p-6 overflow-auto">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">
            Mindmap Visual
          </h2>

          {mindmapData.length === 0 && (
            <p className="text-zinc-500">
              Upload a PDF to generate mindmap...
            </p>
          )}

          <div className="flex justify-center items-center overflow-auto">
            <svg
              width="100%"
              height="700"
              viewBox="0 0 900 700"
              className="max-w-full"
            >
              {mindmapData.map((node, i) => (
                <g key={i}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="50"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    fill="black"
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    fill="white"
                    textAnchor="middle"
                    fontSize="14"
                    dy=".3em"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
}
