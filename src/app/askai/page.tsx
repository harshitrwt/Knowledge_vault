"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { FileText, UploadCloud, Send, Loader2, Trash } from "lucide-react";

type StoredFile = { id: string; name: string; size: number; url?: string };
type Message = { role: "user" | "assistant"; content: string };
type Toast = { id: number; type: "success" | "error" | "info"; text: string };

export default function AskAi() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [context, setContext] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextToastId = useRef(1);

  // fetch files metadata from your API
  useEffect(() => {
    const fetchFiles = async () => {
      setLoadingFiles(true);
      try {
        const res = await fetch("/api/files");
        if (res.ok) setFiles(await res.json());
        else console.error("Failed to load files list", await res.text());
      } catch (e) {
        console.error("Files fetch error", e);
      }
      setLoadingFiles(false);
    };
    fetchFiles();
  }, []);

  // toast helper
  function pushToast(type: Toast["type"], text: string) {
    const id = nextToastId.current++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000);
  }

  async function analyzeFormData(formData: FormData) {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.text();
        console.error("Analyze server error:", body);
        pushToast("error", "Analysis failed. See console.");
        setAnalyzing(false);
        return null;
      }
      const data = await res.json();
      if (data.error) {
        console.error("Analyze returned error:", data);
        pushToast("error", `Analysis failed: ${data.error}`);
        setAnalyzing(false);
        return null;
      }
      pushToast("success", "Analysis completed.");
      return data;
    } catch (err: any) {
      console.error("Analyze exception:", err);
      pushToast("error", "Analysis failed. Check console.");
      return null;
    } finally {
      setAnalyzing(false);
    }
  }

  // user uploads a local file
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const formData = new FormData();
    formData.append("file", file);
    const data = await analyzeFormData(formData);
    if (data?.text) {
      setContext(data.text);
      setMessages([{ role: "assistant", content: `Analyzed "${file.name}". What do you want to ask?` }]);
    }
  };

  // analyze an existing uploaded file (assumes files[i].url is a direct link to the PDF)
  const handleAnalyzeExisting = async (meta: StoredFile) => {
    try {
      if (!meta.url) {
        pushToast("error", "File URL missing. Cannot analyze.");
        return;
      }
      setAnalyzing(true);
      // fetch the file as blob
      const fileRes = await fetch(meta.url);
      if (!fileRes.ok) {
        const text = await fileRes.text();
        console.error("Failed to fetch stored file:", text);
        pushToast("error", "Failed to fetch stored file. See console.");
        setAnalyzing(false);
        return;
      }
      const blob = await fileRes.blob();
      const f = new File([blob], meta.name, { type: blob.type || "application/pdf" });
      const formData = new FormData();
      formData.append("file", f);
      const data = await analyzeFormData(formData);
      if (data?.text) {
        setContext(data.text);
        setMessages([{ role: "assistant", content: `Analyzed "${meta.name}". What do you want to ask?` }]);
      }
    } catch (e) {
      console.error("analyze existing error", e);
      pushToast("error", "Analysis failed. See console.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAsk = async () => {
    if (!input.trim() || !context) return;
    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, context }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("chat error", text);
        pushToast("error", "Chat failed. Check console.");
        return;
      }
      const data = await res.json();
      setMessages((m) => [...newMessages, { role: "assistant", content: data.answer }]);
    } catch (e) {
      console.error("chat exception", e);
      pushToast("error", "Chat failed. Check console.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col p-6 space-y-6">
        <header>
          <h1 className="text-4xl font-bold text-blue-500">Ask AI</h1>
          <p className="mt-2 text-gray-400 max-w-2xl">
            Upload a PDF or choose one of your previously uploaded files. The PDF will be analyzed.
            After analysis the chat will open with the file context loaded. Analysis can take a few seconds.
          </p>
        </header>

        {/* list existing uploaded files */}
        <section className="bg-gray-950/60 p-4 rounded-2xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Your files</h2>
          {loadingFiles ? (
            <div className="py-6 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-400" /></div>
          ) : files.length === 0 ? (
            <div className="text-gray-500">No files yet.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {files.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleAnalyzeExisting(f)}
                  className="flex flex-col items-center p-3 rounded-lg bg-blue-600/10 border border-blue-600 hover:bg-blue-600/20 transition"
                >
                  <FileText className="w-7 h-7 text-blue-300 mb-2" />
                  <span className="text-xs text-blue-200 truncate w-full text-center">{f.name}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* upload area */}
        {!context && (
          <div
            className={`relative rounded-2xl p-6 border-2 border-dashed transition-all ${analyzing ? "border-blue-300 bg-blue-900/20" : "border-blue-500 hover:border-blue-400 hover:bg-blue-500/8"}`}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />

            <div className="flex flex-col items-center justify-center py-8">
              {analyzing ? (
                <>
                  <Loader2 className="animate-spin w-12 h-12 text-blue-400 mb-4" />
                  <div className="text-blue-200">Analyzing file. This may take a few seconds...</div>
                </>
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-blue-400 mb-3" />
                  <p className="text-gray-300">Click to upload and analyze a PDF</p>
                  <p className="text-xs text-gray-500 mt-2">Or pick one of your uploaded files above</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Chat Interface */}
        {context && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-gray-950/50 p-4 rounded-xl border border-gray-800 h-[70vh] overflow-y-auto space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`p-3 rounded-lg max-w-[85%] ${m.role === "user" ? "ml-auto bg-blue-600/30" : "bg-gray-800/70"}`}>
                  {m.content}
                </div>
              ))}
            </div>

            <div className="w-full md:w-96 flex flex-col gap-3">
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                <div className="text-sm text-gray-300 mb-2">Analyzed file:</div>
                <div className="font-medium text-blue-200 truncate">{selectedFile?.name || "Selected document"}</div>
                <div className="text-xs text-gray-500 mt-2">{context.slice(0, 300)}{context.length > 300 ? "..." : ""}</div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something about this PDF..."
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-700 bg-gray-900 text-white"
                />
                <button onClick={handleAsk} className="px-4 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* toasts */}
      <div className="fixed right-4 top-16 flex flex-col gap-3 z-50">
        {toasts.map((t) => (
          <div key={t.id} className={`px-4 py-2 rounded-lg shadow-lg max-w-sm ${t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-gray-700"}`}>
            <div className="text-sm text-white">{t.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
