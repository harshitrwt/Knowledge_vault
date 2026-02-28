"use client";

import Sidebar from "@/components/Sidebar";
import {
  Bolt,
  BrainCog,
  FileText,
  FolderOpen,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

type StoredFile = {
  id: string;
  name: string;
  size: number;
};

export default function MindmapPage() {
  const { user } = useUser();

  const [file, setFile] = useState<File | null>(null);
  const [selectedStoredFile, setSelectedStoredFile] =
    useState<StoredFile | null>(null);
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([]);
  const [mindmap, setMindmap] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [fetchingFiles, setFetchingFiles] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchStoredFiles();
  }, []);

  const fetchStoredFiles = async () => {
    setFetchingFiles(true);
    try {
      const res = await fetch("/api/files");
      if (res.ok) {
        setStoredFiles(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch stored files:", err);
    }
    setFetchingFiles(false);
  };

  const getGreeting = () => {
    if (!mounted) return "Welcome";
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const generateMindmap = async () => {
    if (!file && !selectedStoredFile) return;

    setLoading(true);
    setMindmap(null);

    const formData = new FormData();

    if (file) {
      formData.append("pdf", file);
    } else if (selectedStoredFile) {
      formData.append("fileId", selectedStoredFile.id);
    }

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

  const hasSelectedFile = Boolean(file || selectedStoredFile);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white overflow-x-hidden">
      <Sidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <p className="text-sm text-gray-500 mb-1">{getGreeting()}</p>
          <h1 className="text-5xl font-extrabold text-blue-500 mb-2">
            Mind-Map Creator
          </h1>
          <p className="text-gray-400">
            Upload a PDF or choose from your files to generate a mind-map.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-start">
          {/* LEFT PANEL */}
          <div className="lg:col-span-1 p-6 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/90 via-gray-800/60 to-gray-900/90 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                <Bolt className="w-7 h-7 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold">Select PDF</h2>
            </div>

            <label className="text-sm text-gray-400">Upload New PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setSelectedStoredFile(null);
              }}
              className="w-full mt-2 p-3 bg-gray-800/40 border border-gray-700 rounded-xl text-gray-200"
            />

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-semibold text-blue-400">
                  Your Uploaded Files
                </p>
              </div>

              {fetchingFiles ? (
                <p className="text-xs text-gray-500">Loading files…</p>
              ) : storedFiles.length > 0 ? (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {storedFiles.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedStoredFile(f);
                        setFile(null);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedStoredFile?.id === f.id
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-gray-700 bg-gray-800/40 hover:bg-gray-700/40"
                      }`}
                    >
                      <div className="flex gap-3">
                        <FileText className="w-5 h-5 text-blue-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-200 truncate">
                            {f.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatFileSize(f.size)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No uploaded files found.</p>
              )}
            </div>

            <button
              onClick={generateMindmap}
              disabled={loading || !hasSelectedFile}
              className="w-full mt-6 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold shadow-lg shadow-blue-500/25 disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              Generate Mind-Map
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/90 via-gray-800/60 to-gray-900/90 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                <BrainCog className="w-7 h-7 text-blue-500" />
              </div>
              <h2 className="text-xl md:text-3xl font-bold">Mind-Map</h2>
              
            </div>
            <h1  className="text-xl md:text-3xl font-bold"> Work In Progress </h1>

            {/* {loading ? (
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            ) : mindmap ? (
              <pre className="whitespace-pre-wrap bg-gray-800/40 p-6 rounded-xl border border-gray-700 text-blue-300 text-sm leading-relaxed">
                {mindmap}
              </pre>
            ) : hasSelectedFile ? (
              <p className="text-gray-400 mt-8">
                File selected. Click <span className="text-blue-400 font-semibold">Generate Mind-Map</span> to continue.
              </p>
            ) : (
              <p className="text-gray-500 mt-8">
                Select or upload a PDF to get started.
              </p>
            )} */}
          </div>
        </div>
      </main>
    </div>
  );
}
