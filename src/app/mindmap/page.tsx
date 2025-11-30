"use client";

import Sidebar from "@/components/Sidebar";
import {
  BrainCircuit,
  Sparkles,
  TreePine,
  Upload,
  ArrowRight,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function MindmapPage() {
  const { user } = useUser();

  const [file, setFile] = useState<File | null>(null);
  const [mindmap, setMindmap] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const getGreeting = () => {
    if (!mounted) return "Welcome";
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const generateMindmap = async () => {
    if (!file) return;

    setLoading(true);
    setMindmap(null);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("/api/mindmap", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMindmap(data.mindmap);
    } catch (err) {
      console.error("Mindmap error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white overflow-x-hidden">
      <Sidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">{getGreeting()}</p>
              <h1 className="text-5xl font-extrabold text-blue-500 mb-2">
                Mind-Map Creator
              </h1>
              <p className="text-gray-400">
                Upload a PDF and instantly generate a structured mind-map.
              </p>
            </div>
          </div>
        </div>

        {/* Upload + Generate */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-1 p-6 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/90 via-gray-800/60 to-gray-900/90 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                <BrainCircuit className="w-7 h-7 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold">Generate Mind-Map</h2>
            </div>

            <label className="text-sm text-gray-400 cursor-pointer">Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full mt-2 p-3 bg-gray-800/40 border border-gray-700 rounded-xl text-gray-200"
            />

            <button
              onClick={generateMindmap}
              disabled={!file || loading}
              className="w-full mt-5 flex cursor-pointer items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              Generate Mind-Map
            </button>
          </div>

          {/* Mindmap Output */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/90 via-gray-800/60 to-gray-900/90 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                <TreePine className="w-7 h-7 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold">Mind-Map Output</h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            ) : mindmap ? (
              <pre className="whitespace-pre-wrap bg-gray-800/40 p-6 rounded-xl border border-gray-700 text-blue-300 text-sm leading-relaxed">
                {mindmap}
              </pre>
            ) : (
              <p className="text-gray-500 mt-8">
                Upload a PDF and generate a mind-map to see results here.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
