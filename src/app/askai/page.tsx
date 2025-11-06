"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { FileText, UploadCloud, Send, Loader2, Trash, MessageSquare } from "lucide-react";

type StoredFile = { id: string; name: string; size: number; url?: string };
type Message = { role: "user" | "assistant"; content: string };
type Toast = { id: number; type: "success" | "error" | "info"; text: string };
type Conversation = { id: string; title: string; messages: Message[]; timestamp: number };

export default function AskAi() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [context, setContext] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const nextToastId = useRef(1);

  // Load saved conversations
  useEffect(() => {
    const saved = localStorage.getItem("conversations");
    if (saved) setConversations(JSON.parse(saved));
  }, []);

  // Save conversations whenever changed
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  // fetch files metadata
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
        pushToast("error", "Analysis failed. See console.");
        return null;
      }
      const data = await res.json();
      pushToast("success", "Analysis completed.");
      return data;
    } catch (err) {
      console.error("Analyze exception:", err);
      pushToast("error", "Analysis failed. Check console.");
      return null;
    } finally {
      setAnalyzing(false);
    }
  }

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const formData = new FormData();
    formData.append("file", file);
    const data = await analyzeFormData(formData);
    if (data?.text) {
      setContext(data.text);
      setMessages([{ role: "assistant", content: `Analyzed "${file.name}". What do you want to ask?` } as Message]);
    }
  };

  const handleAnalyzeExisting = async (meta: StoredFile) => {
    try {
      if (!meta.url) {
        pushToast("error", "File URL missing. Cannot analyze.");
        return;
      }
      setAnalyzing(true);
      const fileRes = await fetch(meta.url);
      if (!fileRes.ok) {
        pushToast("error", "Failed to fetch stored file.");
        return;
      }
      const blob = await fileRes.blob();
      const f = new File([blob], meta.name, { type: blob.type || "application/pdf" });
      const formData = new FormData();
      formData.append("file", f);
      const data = await analyzeFormData(formData);
      if (data?.text) {
        setContext(data.text);
        setMessages([{ role: "assistant", content: `Analyzed "${meta.name}". What do you want to ask?` } as Message]);
      }
    } catch (e) {
      console.error(e);
      pushToast("error", "Analysis failed.");
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
        pushToast("error", "Chat failed.");
        return;
      }
      const data = await res.json();
      const updated: Message[] = [...newMessages, { role: "assistant", content: data.answer }];
      setMessages(updated);

      // Save conversation snapshot
      setConversations((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          title: selectedFile?.name || "Unnamed PDF",
          messages: updated,
          timestamp: Date.now(),
        },
      ]);
    } catch (e) {
      console.error(e);
      pushToast("error", "Chat failed. Check console.");
    }
  };

  const handleClearConversation = () => setShowConfirmClear(true);

  const confirmClear = () => {
    setMessages([]);
    setContext("");
    setSelectedFile(null);
    setShowConfirmClear(false);
    pushToast("info", "Conversation cleared.");
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    pushToast("info", "Deleted conversation.");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col p-6 space-y-6">
        <header>
          <h1 className="text-4xl font-bold text-blue-500">Ask AI</h1>
          <p className="mt-2 text-gray-400 max-w-2xl">
            Upload a PDF or choose one of your previously uploaded files. After analysis, you can chat with it.
          </p>
        </header>

        {/* existing files */}
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

        {/* saved conversations */}
        {conversations.length > 0 && (
          <section className="bg-gray-950/60 p-4 rounded-2xl border border-gray-800">
            <h2 className="text-lg font-semibold mb-3">Saved Conversations</h2>
            <div className="space-y-2">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center bg-gray-800/50 px-3 py-2 rounded-lg hover:bg-gray-700/60"
                >
                  <div>
                    <div className="flex items-center gap-2 text-blue-300 font-medium">
                      <MessageSquare size={16} /> {c.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(c.timestamp).toLocaleString()} ({c.messages.length} msgs)
                    </div>
                  </div>
                  <button onClick={() => handleDeleteConversation(c.id)} className="text-red-400 hover:text-red-600">
                    <Trash size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* upload */}
        {!context && (
          <div
            className={`relative rounded-2xl p-6 border-2 border-dashed transition-all ${
              analyzing ? "border-blue-300 bg-blue-900/20" : "border-blue-500 hover:border-blue-400"
            }`}
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
                  <div className="text-blue-200">Analyzing file...</div>
                </>
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-blue-400 mb-3" />
                  <p className="text-gray-300">Click to upload and analyze a PDF</p>
                  <p className="text-xs text-gray-500 mt-2">Or pick one above</p>
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

              {/* Clear conversation button */}
              <button
                onClick={handleClearConversation}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600/80 rounded-lg hover:bg-red-700 transition text-white mt-2"
              >
                <Trash size={16} /> Clear Conversation
              </button>
            </div>
          </div>
        )}
      </main>

      {/* confirmation modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 w-80 text-center">
            <h3 className="text-lg font-semibold text-white mb-3">Clear Conversation?</h3>
            <p className="text-gray-400 text-sm mb-5">This will remove all messages in the current session.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowConfirmClear(false)} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">
                Cancel
              </button>
              <button onClick={confirmClear} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700">
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* toasts */}
      <div className="fixed right-4 top-16 flex flex-col gap-3 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-lg shadow-lg max-w-sm ${
              t.type === "success"
                ? "bg-green-600"
                : t.type === "error"
                ? "bg-red-600"
                : "bg-gray-700"
            }`}
          >
            <div className="text-sm text-white">{t.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
