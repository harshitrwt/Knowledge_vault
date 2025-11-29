"use client";

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
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-blue-500 mb-6">Create Mindmap</h1>

      <div className="border border-blue-500 rounded-xl p-6 max-w-xl">
        <label className="block mb-4 font-semibold">
          Upload PDF to generate mindmap
        </label>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-2 bg-zinc-900 border border-blue-500 rounded-lg"
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 rounded-lg transition"
        >
          {loading ? "Generating..." : "Generate Mindmap"}
        </button>
      </div>

      {/* MINDMAP VIEW */}
      <div className="mt-12 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">
          Mindmap Visual
        </h2>

        {mindmapData.length === 0 && (
          <p className="text-zinc-500">Upload a PDF to generate mindmap...</p>
        )}

        <div className="flex justify-center items-center overflow-auto">
          <svg width="900" height="700">
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
    </div>
  );
}
