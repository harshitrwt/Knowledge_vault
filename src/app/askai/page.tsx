"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { FileText, UploadCloud, Send, Loader2, Trash, Save, ArrowLeft, Copy } from "lucide-react";

type StoredFile = { id: string; name: string; size: number; url?: string };
type Message = { role: "user" | "assistant"; content: string };
type Toast = { id: number; type: "success" | "error" | "info"; text: string };
type SavedChat = { id: string; fileName: string; messages: Message[] };

export default function AskAi() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [context, setContext] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const nextToastId = useRef(1);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  // Toast
  function pushToast(type: Toast["type"], text: string) {
    const id = nextToastId.current++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }

  // Load saved chats
  useEffect(() => {
    const saved = localStorage.getItem("savedChats");
    if (saved) setSavedChats(JSON.parse(saved));
  }, []);

  // Save chats in localStorage
  useEffect(() => {
    localStorage.setItem("savedChats", JSON.stringify(savedChats));
  }, [savedChats]);

  // Fetch files
  useEffect(() => {
    async function fetchFiles() {
      setLoadingFiles(true);
      try {
        const res = await fetch("/api/files");
        if (res.ok) setFiles(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingFiles(false);
      }
    }
    fetchFiles();
  }, []);

  // Analyze PDF
  async function analyzeFormData(formData: FormData) {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      if (!res.ok) {
        pushToast("error", "Analysis failed.");
        return null;
      }
      const data = await res.json();
      pushToast("success", "File analyzed successfully.");
      return data;
    } catch {
      pushToast("error", "Error during analysis.");
      return null;
    } finally {
      setAnalyzing(false);
    }
  }

  const handleFileSelect = async (file: File) => {
    setSelectedFile({ id: file.name, name: file.name, size: file.size });
    const formData = new FormData();
    formData.append("file", file);
    const data = await analyzeFormData(formData);
    if (data?.text) {
      setContext(data.text);
      setMessages([{ role: "assistant", content: `Analyzed "${file.name}". Ask your question.` }]);
    }
  };

  const handleAnalyzeExisting = async (meta: StoredFile) => {
    setSelectedFile(meta);
    try {
      const fileRes = await fetch(meta.url!);
      const blob = await fileRes.blob();
      const f = new File([blob], meta.name, { type: "application/pdf" });
      const formData = new FormData();
      formData.append("file", f);
      const data = await analyzeFormData(formData);
      if (data?.text) {
        setContext(data.text);
        setMessages([{ role: "assistant", content: `Analyzed "${meta.name}". Ask your question.` }]);
      }
    } catch {
      pushToast("error", "Failed to analyze existing file.");
    }
  };

  const handleAsk = async () => {
    if (!input.trim() || !context) return;
    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setAiTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, context }),
      });

      if (!res.ok) throw new Error("Chat failed");
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.answer }]);
    } catch {
      pushToast("error", "Chat request failed.");
    } finally {
      setAiTyping(false);
    }
  };

  const handleSaveConversation = () => {
    if (!messages.length || !selectedFile) {
      pushToast("info", "Nothing to save.");
      return;
    }

    setSavedChats((prev) => {
      const existing = prev.find((c) => c.fileName === selectedFile.name);
      if (existing) {
        return prev.map((c) =>
          c.fileName === selectedFile.name ? { ...c, messages } : c
        );
      }

      return [
        ...prev,
        { id: Date.now().toString(), fileName: selectedFile.name, messages },
      ];
    });

    pushToast("success", `Conversation saved.`);
    setContext("");
    setSelectedFile(null);
    setMessages([]);
  };

  const handleClearConversation = () => {
    if (confirm("Clear current conversation?")) setMessages([]);
  };

  const handleBack = () => {
    setContext("");
    setSelectedFile(null);
    setMessages([]);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col p-6 space-y-6">

        {/* MAIN SCREEN (NO CHAT LOADED) */}
        {!context && (
          <>
            <header>
              <h1 className="text-4xl font-bold text-white">Ask Vault</h1>
              <p className="mt-2 text-gray-400">Upload a PDF and ask anything.</p>
            </header>

            {/* FILES */}
            <section className="bg-gray-950/60 p-4 rounded-2xl border border-gray-800">
              <h2 className="text-lg font-semibold mb-3">Your Files</h2>

              {loadingFiles ? (
                <div className="py-6 flex justify-center">
                  <Loader2 className="animate-spin w-8 h-8 text-blue-400" />
                </div>
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
                      <span className="text-xs truncate text-blue-200 text-center">{f.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* UPLOAD */}
            <div
              className={`rounded-2xl p-6 border-2 border-dashed ${analyzing ? "border-blue-300 bg-blue-900/20" : "border-blue-500 hover:border-blue-400"
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

              <div className="flex flex-col items-center py-8">
                {analyzing ? (
                  <>
                    <Loader2 className="animate-spin w-12 h-12 text-blue-400 mb-4" />
                    <div className="text-blue-200">Analyzing file...</div>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-12 h-12 text-blue-400 mb-3" />
                    <p className="text-gray-300">Click to upload & analyze PDF</p>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* CHAT SCREEN */}
        {context && (
          <div className="flex flex-col gap-4">

            {/* Top Row */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="text-blue-400 font-semibold">{selectedFile?.name}</div>
            </div>

            {/* MESSAGES CONTAINER */}
            <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-800 h-[70vh] overflow-y-auto space-y-3">

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`relative p-3 rounded-lg max-w-[85%] ${m.role === "user" ? "ml-auto bg-blue-600/30" : "bg-gray-800/70"
                    }`}
                >
                  {m.content}

                  {/* Copy Icon / Check Icon */}
                  {m.role === "assistant" && (
                    <div
                      className="absolute bottom-2 right-2 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(m.content);
                        setCopiedIndex(i);

                        // revert icon back after 1.2 seconds
                        setTimeout(() => setCopiedIndex(null), 1200);
                      }}
                    >
                      {copiedIndex === i ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-3.75-3.75a1 1 0 011.414-1.414L7.5 12.086l7.543-7.543a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <Copy
                          size={16}
                          className="text-gray-300 hover:text-white"
                        />
                      )}
                    </div>
                  )}

                </div>
              ))}

              {aiTyping && (
                <div className="bg-gray-800/70 p-3 rounded-lg w-20 flex justify-between">
                  <span className="w-2 h-2 animate-bounce bg-gray-400 rounded-full"></span>
                  <span className="w-2 h-2 animate-bounce bg-gray-400 rounded-full [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 animate-bounce bg-gray-400 rounded-full [animation-delay:0.4s]"></span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* INPUT */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex flex-1 gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  placeholder="Ask something..."
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-700 bg-gray-900"
                />

                <button
                  onClick={handleAsk}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleClearConversation}
                  className="flex items-center gap-2 px-4 py-3 bg-red-600/80 hover:bg-red-900 rounded-lg"
                >
                  <Trash size={16} /> Clear
                </button>

                <button
                  onClick={handleSaveConversation}
                  className="flex items-center gap-2 px-4 py-3 bg-green-600/80 hover:bg-green-900 rounded-lg"
                >
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Toasts */}
      <div className="fixed right-4 top-16 flex flex-col gap-3 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-lg shadow-lg ${t.type === "success"
                ? "bg-green-600"
                : t.type === "error"
                  ? "bg-red-600"
                  : "bg-gray-700"
              }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
