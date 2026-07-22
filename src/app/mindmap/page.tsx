"use client";

import Sidebar from "@/components/Sidebar";
import {
  Bolt,
  BrainCog,
  FileText,
  FolderOpen,
  GitBranch,
  UploadCloud,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

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
    <div className="vault-grid flex min-h-screen text-[var(--vault-ink)]">
      <Sidebar />

      <main className="flex-grow overflow-y-auto px-4 pb-10 pt-24 sm:px-6 lg:px-8 xl:px-10 md:pt-8">
        <header className="vault-panel mb-8 p-6 sm:p-8">
          <p className="vault-kicker mb-3">{getGreeting()}</p>
          <h1 className="text-4xl font-black tracking-normal text-[var(--vault-ink)] sm:text-5xl">
            Mind-Map Creator
          </h1>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[var(--vault-muted)]">
            Upload a PDF or choose from your files to generate a mind-map.
          </p>
          {user?.firstName && (
            <p className="mt-4 text-sm font-extrabold text-[var(--vault-brand)]">
              Workspace for {user.firstName}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="vault-panel-solid p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-[var(--vault-brand-soft)] text-[var(--vault-brand)]">
                <Bolt className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[var(--vault-ink)]">Select PDF</h2>
                <p className="text-sm font-semibold text-[var(--vault-muted)]">
                  Choose one source for the generator.
                </p>
              </div>
            </div>

            <label className="text-sm font-extrabold text-[var(--vault-ink)]">
              Upload New PDF
            </label>
            <div className="mt-2 rounded-lg border border-dashed border-[var(--vault-line-strong)] bg-[var(--vault-soft)] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--vault-muted)]">
                <UploadCloud className="h-4 w-4 text-[var(--vault-brand)]" />
                Select a local PDF
              </div>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setSelectedStoredFile(null);
                }}
                className="vault-input w-full p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[var(--vault-brand)] file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
              />
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-[var(--vault-brand)]" />
                <p className="text-sm font-black text-[var(--vault-ink)]">
                  Your Uploaded Files
                </p>
              </div>

              {fetchingFiles ? (
                <p className="rounded-lg border border-[var(--vault-line)] bg-white/70 p-4 text-sm font-semibold text-[var(--vault-muted)]">
                  Loading files...
                </p>
              ) : storedFiles.length > 0 ? (
                <div className="vault-scrollbar max-h-[280px] space-y-2 overflow-y-auto pr-1">
                  {storedFiles.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedStoredFile(f);
                        setFile(null);
                      }}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        selectedStoredFile?.id === f.id
                          ? "border-[var(--vault-brand)] bg-[var(--vault-brand-soft)]"
                          : "border-[var(--vault-line)] bg-white/80 hover:border-[var(--vault-line-strong)]"
                      }`}
                    >
                      <div className="flex min-w-0 gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--vault-info-soft)] text-[var(--vault-info)]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[var(--vault-ink)]">
                            {f.name}
                          </p>
                          <p className="text-xs font-bold text-[var(--vault-muted)]">
                            {formatFileSize(f.size)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-[var(--vault-line)] bg-[var(--vault-soft)] p-4 text-sm font-semibold text-[var(--vault-muted)]">
                  No uploaded files found.
                </p>
              )}
            </div>

            <button
              onClick={generateMindmap}
              disabled={loading || !hasSelectedFile}
              className="vault-button-primary mt-6 w-full disabled:cursor-not-allowed disabled:bg-[var(--vault-muted)] disabled:shadow-none"
            >
              <GitBranch className="h-5 w-5" />
              {loading ? "Generating..." : "Generate Mind-Map"}
            </button>
          </section>

          <section className="vault-panel-solid min-h-[520px] p-5">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-[var(--vault-accent-soft)] text-[var(--vault-accent)]">
                <BrainCog className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[var(--vault-ink)] md:text-2xl">
                  Mind-Map
                </h2>
                <p className="text-sm font-semibold text-[var(--vault-muted)]">
                  Visual output surface
                </p>
              </div>
            </div>

            <div className="grid min-h-[380px] place-items-center rounded-lg border border-dashed border-[var(--vault-line-strong)] bg-[var(--vault-soft)] p-6 text-center">
              <div>
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-md bg-white text-[var(--vault-brand)] shadow-sm">
                  <GitBranch className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-[var(--vault-ink)]">
                  Work In Progress
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[var(--vault-muted)]">
                  {loading
                    ? "The generator is processing your selected document."
                    : hasSelectedFile
                      ? "File selected. Generate when you are ready."
                      : "Select or upload a PDF to get started."}
                </p>
                {mindmap && (
                  <p className="mt-4 text-xs font-extrabold text-[var(--vault-brand)]">
                    Mind-map data received.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
