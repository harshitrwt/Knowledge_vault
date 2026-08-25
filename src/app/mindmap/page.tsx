"use client";

import Sidebar from "@/components/Sidebar";
import MindmapRenderer, { MindmapData } from "@/components/MindmapRenderer";
import {
  Bolt,
  BrainCog,
  FileText,
  FolderOpen,
  GitBranch,
  Loader2,
  UploadCloud,
  AlertCircle,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type StoredFile = {
  id: string;
  name: string;
  size: number;
  url?: string;
};

export default function MindmapPage() {
  const { user } = useUser();

  const [file, setFile] = useState<File | null>(null);
  const [selectedStoredFile, setSelectedStoredFile] = useState<StoredFile | null>(null);
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([]);
  const [mindmap, setMindmap] = useState<MindmapData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    setErrorMessage(null);
    setStatusMessage("Extracting text from PDF...");

    try {
      let contextText = "";
      const pdfTitle = file ? file.name : selectedStoredFile?.name || "Document";

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const analyzeRes = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });
        const analyzeData = await analyzeRes.json().catch(() => ({}));
        if (!analyzeRes.ok || !analyzeData?.text) {
          throw new Error(analyzeData?.error || "Failed to extract text from uploaded PDF");
        }
        contextText = analyzeData.text;
      } else if (selectedStoredFile) {
        if (!selectedStoredFile.url) {
          throw new Error("Selected file has no downloadable URL");
        }
        const fileRes = await fetch(selectedStoredFile.url);
        const blob = await fileRes.blob();
        const f = new File([blob], selectedStoredFile.name, { type: "application/pdf" });
        const formData = new FormData();
        formData.append("file", f);
        const analyzeRes = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });
        const analyzeData = await analyzeRes.json().catch(() => ({}));
        if (!analyzeRes.ok || !analyzeData?.text) {
          throw new Error(analyzeData?.error || "Failed to extract text from stored PDF");
        }
        contextText = analyzeData.text;
      }

      setStatusMessage("Synthesizing concepts with AI...");

      const mindmapRes = await fetch("/api/mindmap/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: contextText,
          pdfId: pdfTitle,
        }),
      });

      const mindmapData = await mindmapRes.json().catch(() => ({}));
      if (!mindmapRes.ok || !mindmapData?.mindmap) {
        throw new Error(mindmapData?.error || "AI failed to generate mindmap structure");
      }

      setMindmap(mindmapData.mindmap);
    } catch (err: unknown) {
      console.error("Mindmap error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Mindmap generation failed");
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  const hasSelectedFile = Boolean(file || selectedStoredFile);

  return (
    <div className="flex min-h-screen bg-[#E0E5EC] font-sans text-[#3D4852]">
      <Sidebar />

      <main className="flex-grow overflow-y-auto px-4 pb-12 pt-24 sm:px-6 lg:px-10 md:pt-8">
        <header className="neu-extruded mb-10 rounded-[32px] p-8 sm:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-xs font-extrabold text-[#6C63FF] neu-inset-sm">
            <span>{getGreeting()}</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#3D4852] sm:text-5xl">
            Mind-Map Creator
          </h1>
          <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-[#6B7280]">
            Upload a PDF or choose from your files to generate an interactive mind-map.
          </p>
          {user?.firstName && (
            <p className="mt-4 font-display text-xs font-bold text-[#6C63FF]">
              Workspace for {user.firstName}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="neu-extruded rounded-[32px] p-8">
            <div className="mb-6 flex items-center gap-3.5">
              <div className="neu-inset-deep flex h-12 w-12 items-center justify-center rounded-2xl text-[#6C63FF]">
                <Bolt className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-extrabold text-[#3D4852]">Select PDF</h2>
                <p className="text-xs font-medium text-[#6B7280]">
                  Choose one source for the generator.
                </p>
              </div>
            </div>

            <label className="font-display text-sm font-bold text-[#3D4852]">
              Upload New PDF
            </label>
            <div className="neu-inset-deep mt-3 rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2 font-display text-xs font-bold text-[#6B7280]">
                <UploadCloud className="h-4 w-4 text-[#6C63FF]" />
                Select a local PDF
              </div>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setSelectedStoredFile(null);
                  setErrorMessage(null);
                }}
                className="neu-input w-full p-2 text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-[#6C63FF] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white"
              />
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center gap-2.5">
                <FolderOpen className="h-4 w-4 text-[#6C63FF]" />
                <p className="font-display text-sm font-bold text-[#3D4852]">
                  Your Uploaded Files
                </p>
              </div>

              {fetchingFiles ? (
                <p className="neu-inset-sm rounded-2xl p-4 text-center text-xs font-medium text-[#6B7280]">
                  Loading files...
                </p>
              ) : storedFiles.length > 0 ? (
                <div className="vault-scrollbar max-h-[280px] space-y-3 overflow-y-auto pr-1">
                  {storedFiles.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedStoredFile(f);
                        setFile(null);
                        setErrorMessage(null);
                      }}
                      className={`w-full rounded-2xl p-4 text-left transition ${
                        selectedStoredFile?.id === f.id
                          ? "neu-inset border-2 border-[#6C63FF]/30 text-[#6C63FF]"
                          : "neu-extruded-sm neu-extruded-hover text-[#3D4852]"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3.5">
                        <div className="neu-inset-sm flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#38B2AC]">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-display text-sm font-bold">
                            {f.name}
                          </p>
                          <p className="text-xs font-medium text-[#6B7280]">
                            {formatFileSize(f.size)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="neu-inset-sm rounded-2xl p-4 text-center text-xs font-medium text-[#6B7280]">
                  No uploaded files found.
                </p>
              )}
            </div>

            <button
              onClick={generateMindmap}
              disabled={loading || !hasSelectedFile}
              className="neu-btn-primary mt-8 w-full rounded-2xl py-3.5 text-base font-bold disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{statusMessage || "Generating..."}</span>
                </>
              ) : (
                <>
                  <GitBranch className="h-5 w-5" />
                  <span>Generate Mind-Map</span>
                </>
              )}
            </button>
          </section>

          <section className="neu-extruded min-h-[520px] rounded-[32px] p-8 flex flex-col">
            <div className="mb-6 flex items-center gap-3.5">
              <div className="neu-inset-deep flex h-12 w-12 items-center justify-center rounded-2xl text-[#6C63FF]">
                <BrainCog className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-extrabold text-[#3D4852]">
                  Mind-Map Output
                </h2>
                <p className="text-xs font-medium text-[#6B7280]">
                  Interactive concept graph
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="neu-inset-sm mb-4 flex items-center gap-3 rounded-2xl p-4 text-sm font-medium text-[#E53E3E]">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {loading ? (
              <div className="neu-inset-deep flex flex-1 min-h-[380px] flex-col items-center justify-center rounded-[28px] p-8 text-center">
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#6C63FF]" />
                <h3 className="font-display text-lg font-extrabold text-[#3D4852]">
                  Generating Concept Map
                </h3>
                <p className="mt-2 text-sm font-medium text-[#6B7280]">
                  {statusMessage || "Processing with Groq AI..."}
                </p>
              </div>
            ) : mindmap ? (
              <div className="flex-1 flex flex-col">
                <MindmapRenderer mindmap={mindmap} />
              </div>
            ) : (
              <div className="neu-inset-deep flex flex-1 min-h-[380px] items-center justify-center rounded-[28px] p-8 text-center">
                <div>
                  <div className="neu-extruded mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-[#6C63FF]">
                    <GitBranch className="h-9 w-9" />
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-[#3D4852]">
                    Ready to Generate
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-base font-medium leading-relaxed text-[#6B7280]">
                    {hasSelectedFile
                      ? "File selected. Click 'Generate Mind-Map' to start."
                      : "Select or upload a PDF on the left to begin."}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
