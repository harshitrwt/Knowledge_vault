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
  Sparkles,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type StoredFile = {
  id: string;
  name: string;
  size: number;
  url?: string;
};

// Helper: convert data URI or URL to Blob safely
async function urlToBlob(url: string, defaultName: string): Promise<File> {
  if (url.startsWith("data:")) {
    const parts = url.split(",");
    const mime = parts[0].match(/:(.*?);/)?.[1] || "application/pdf";
    const binary = atob(parts[1]);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new File([array], defaultName, { type: mime });
  }

  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], defaultName, { type: "application/pdf" });
}

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

      let fileToAnalyze: File | null = file;

      if (!fileToAnalyze && selectedStoredFile) {
        if (!selectedStoredFile.url) {
          throw new Error("Selected file has no downloadable content.");
        }
        fileToAnalyze = await urlToBlob(selectedStoredFile.url, selectedStoredFile.name);
      }

      if (!fileToAnalyze) {
        throw new Error("No PDF file selected.");
      }

      const formData = new FormData();
      formData.append("file", fileToAnalyze);

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const analyzeData = await analyzeRes.json().catch(() => ({}));
      if (!analyzeRes.ok || !analyzeData?.text) {
        throw new Error(
          analyzeData?.error ||
            analyzeData?.details ||
            "Could not extract text from this PDF. Please ensure it is not scanned/empty."
        );
      }
      contextText = analyzeData.text;

      setStatusMessage("Synthesizing concept graph with AI...");

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
  const activeFileName = file ? file.name : selectedStoredFile ? selectedStoredFile.name : null;

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
            Upload a PDF or choose from your files to generate an interactive concept mind-map.
          </p>
          {user?.firstName && (
            <p className="mt-4 font-display text-xs font-bold text-[#6C63FF]">
              Workspace for {user.firstName}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left Column: File Selector */}
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
                className="neu-input w-full p-2 text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-[#6C63FF] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white file:cursor-pointer"
              />
              {file && (
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#38B2AC]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Selected: {file.name} ({formatFileSize(file.size)})
                </div>
              )}
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
                  {storedFiles.map((f) => {
                    const isSelected = selectedStoredFile?.id === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setSelectedStoredFile(f);
                          setFile(null);
                          setErrorMessage(null);
                        }}
                        className={`w-full rounded-2xl p-4 text-left transition-all ${
                          isSelected
                            ? "neu-inset border-2 border-[#6C63FF] text-[#6C63FF]"
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
                    );
                  })}
                </div>
              ) : (
                <p className="neu-inset-sm rounded-2xl p-4 text-center text-xs font-medium text-[#6B7280]">
                  No uploaded files found. Upload a file above or in the Uploads page.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={generateMindmap}
              disabled={loading || !hasSelectedFile}
              className="neu-btn-primary mt-8 w-full rounded-2xl py-3.5 text-base font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{statusMessage || "Generating Mindmap..."}</span>
                </>
              ) : (
                <>
                  <GitBranch className="h-5 w-5" />
                  <span>
                    {activeFileName ? `Generate from "${activeFileName.slice(0, 20)}..."` : "Generate Mind-Map"}
                  </span>
                </>
              )}
            </button>
          </section>

          {/* Right Column: Output Visualization */}
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
                      ? `"${activeFileName}" selected. Click 'Generate Mind-Map' to build the concept graph.`
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
