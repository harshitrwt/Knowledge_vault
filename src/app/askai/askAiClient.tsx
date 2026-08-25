"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Sidebar from "@/components/Sidebar";
import {
  ArrowLeft,
  Check,
  Copy,
  FileText,
  Loader2,
  MessageSquare,
  Network,
  Save,
  Send,
  Speech,
  Trash,
  UploadCloud,
  X,
} from "lucide-react";
import MindmapRenderer, { MindmapData } from "@/components/MindmapRenderer";

type StoredFile = { id: string; name: string; size: number; url?: string };
type Message = { role: "user" | "assistant"; content: string };
type Toast = { id: number; type: "success" | "error" | "info"; text: string };
type SavedChatMeta = { id: string; fileName: string; createdAt: string };

export default function AskAi() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [context, setContext] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [savedChatsMeta, setSavedChatsMeta] = useState<SavedChatMeta[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [mindmap, setMindmap] = useState<MindmapData | null>(null);
  const [generatingMindmap, setGeneratingMindmap] = useState(false);
  const nextToastId = useRef(1);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  function pushToast(type: Toast["type"], text: string) {
    const id = nextToastId.current++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }

  useEffect(() => {
    async function fetchChats() {
      setLoadingChats(true);
      try {
        const res = await fetch("/api/chats");
        if (res.ok) {
          const data = await res.json();
          setSavedChatsMeta(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingChats(false);
      }
    }
    fetchChats();
  }, []);

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

  async function analyzeFormData(formData: FormData) {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.error ?? "Analysis failed";
        const details = data?.details ? ` (${data.details})` : "";
        const hint = data?.hint ? ` ${data.hint}` : "";
        pushToast("error", `${msg}${details}${hint}`);
        return null;
      }
      pushToast("success", "File analyzed successfully.");
      return data;
    } catch (e) {
      pushToast("error", `Error during analysis: ${e instanceof Error ? e.message : "Network error"}`);
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
        body: JSON.stringify({
          question: input,
          context,
          messages,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg = data?.error ?? "Chat request failed";
        const isApiKey = /api[_-]?key|GROQ|unauthorized|invalid/i.test(errMsg);
        pushToast(
          "error",
          isApiKey
            ? `${errMsg} Check GROQ_API_KEY in .env and restart the server.`
            : errMsg
        );
        return;
      }

      if (data?.answer) {
        setMessages([...newMessages, { role: "assistant", content: data.answer }]);
      } else {
        pushToast("error", "No response from AI.");
      }
    } catch (e) {
      pushToast(
        "error",
        `Chat failed: ${e instanceof Error ? e.message : "Network error"}`
      );
    } finally {
      setAiTyping(false);
    }
  };

  const handleGenerateMindmap = async () => {
    if (!context) {
      pushToast("error", "No document context available to generate mindmap.");
      return;
    }
    setGeneratingMindmap(true);
    try {
      const res = await fetch("/api/mindmap/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, pdfId: selectedFile?.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg = data?.error ?? "Mindmap generation failed.";
        pushToast("error", errMsg);
        console.error("Mindmap error raw:", data?.raw ?? data);
        return;
      }
      if (data?.mindmap) {
        setMindmap(data.mindmap);
        pushToast("success", "Mindmap generated successfully.");
      } else {
        pushToast("error", "No mindmap returned by model.");
      }
    } catch (e) {
      pushToast("error", `Mindmap failed: ${e instanceof Error ? e.message : "Network error"}`);
    } finally {
      setGeneratingMindmap(false);
    }
  };

  const handleSaveConversation = async () => {
    if (!messages.length || !selectedFile || !context) {
      pushToast("info", "Nothing to save.");
      return;
    }

    const isDuplicate = savedChatsMeta.some(chat => chat.fileName === selectedFile.name);
    if (isDuplicate) {
      const update = confirm(
        `A chat with name "${selectedFile.name}" already exists. Update it instead?`
      );
      if (!update) return;
    }

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile.name,
          messages,
          context,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        pushToast("error", data?.error ?? "Failed to save.");
        return;
      }

      pushToast("success", isDuplicate ? "Conversation updated." : "Conversation saved to Saved Chats.");
      const listRes = await fetch("/api/chats");
      if (listRes.ok) setSavedChatsMeta(await listRes.json());
      setContext("");
      setSelectedFile(null);
      setMessages([]);
    } catch (e) {
      pushToast("error", `Save failed: ${e instanceof Error ? e.message : "Network error"}`);
    }
  };

  const handleLoadSavedChat = useCallback(async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      if (!res.ok) {
        pushToast("error", "Failed to load chat.");
        return;
      }
      const data = await res.json();
      setContext(data.context);
      setMessages(data.messages);
      setSelectedFile({ id: chatId, name: data.fileName, size: 0 });
    } catch {
      pushToast("error", "Failed to load chat.");
    }
  }, []);

  const handleDeleteChat = async (chatId: string, fileName: string) => {
    if (confirm(`Delete saved chat "${fileName}"?`)) {
      try {
        const res = await fetch(`/api/chats/${chatId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          pushToast("error", data?.error ?? "Failed to delete chat.");
          return;
        }

        pushToast("success", "Chat deleted successfully.");
        const listRes = await fetch("/api/chats");
        if (listRes.ok) setSavedChatsMeta(await listRes.json());
      } catch (e) {
        pushToast("error", `Delete failed: ${e instanceof Error ? e.message : "Network error"}`);
      }
    }
  };

  useEffect(() => {
    const chatId = searchParams.get("chat");
    if (chatId) {
      handleLoadSavedChat(chatId);
      window.history.replaceState({}, "", "/askai");
    }
  }, [searchParams, handleLoadSavedChat]);

  const handleClearConversation = () => {
    if (confirm("Clear current conversation?")) setMessages([]);
  };

  const handleBack = () => {
    setContext("");
    setSelectedFile(null);
    setMessages([]);
    setMindmap(null);
  };

    const toastClass = (type: Toast["type"]) => {
    if (type === "success") return "neu-extruded bg-[#38B2AC] text-white";
    if (type === "error") return "neu-extruded bg-[#E53E3E] text-white";
    return "neu-extruded bg-[#3D4852] text-white";
  };

  return (
    <div className="flex min-h-screen bg-[#E0E5EC] font-sans text-[#3D4852] md:flex-row">
      <Sidebar />

      <main className="flex-1 px-4 pb-12 pt-24 sm:px-6 lg:px-10 md:pt-8">
        {!context && (
          <div className="space-y-8">
            <header className="neu-extruded rounded-[32px] p-8 sm:p-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-xs font-extrabold text-[#6C63FF] neu-inset-sm">
                <span>Ask AI</span>
              </div>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#3D4852] sm:text-5xl">
                    Ask Vault
                  </h1>
                  <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-[#6B7280]">
                    Choose an uploaded file, reopen a saved chat, or analyze a new PDF.
                  </p>
                </div>
                <label className="neu-btn-primary cursor-pointer rounded-2xl px-6 py-3.5 text-base font-bold">
                  <UploadCloud className="h-5 w-5" />
                  Analyze PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                </label>
              </div>
            </header>

            <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
              <section className="neu-extruded rounded-[32px] p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="neu-inset-deep flex h-12 w-12 items-center justify-center rounded-2xl text-[#6C63FF]">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-extrabold text-[#3D4852]">
                        Recent Saved Chats
                      </h2>
                      <p className="text-xs font-medium text-[#6B7280]">
                        Continue an existing conversation.
                      </p>
                    </div>
                  </div>
                </div>

                {loadingChats ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#6C63FF]" />
                  </div>
                ) : savedChatsMeta.length === 0 ? (
                  <div className="neu-inset-sm rounded-2xl p-6 text-center text-sm font-medium text-[#6B7280]">
                    No saved conversations yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {savedChatsMeta.map((c) => (
                      <div key={c.id} className="group relative">
                        <button
                          onClick={() => handleLoadSavedChat(c.id)}
                          className="neu-extruded-sm neu-extruded-hover w-full rounded-2xl p-4 text-left"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <span className="neu-inset-sm flex h-8 w-8 items-center justify-center rounded-xl text-[#6C63FF]">
                              <MessageSquare className="h-4 w-4" />
                            </span>
                            <span className="neu-inset-sm rounded-full px-2.5 py-0.5 font-display text-[10px] font-extrabold text-[#38B2AC]">
                              Saved
                            </span>
                          </div>
                          <span className="line-clamp-2 font-display text-sm font-bold text-[#3D4852]">
                            {c.fileName}
                          </span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(c.id, c.fileName);
                          }}
                          className="absolute right-2 top-2 neu-icon-btn h-8 w-8 rounded-xl text-[#E53E3E] opacity-0 transition group-hover:opacity-100"
                          title="Delete this chat"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="neu-extruded rounded-[32px] p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3.5">
                  <div className="neu-inset-deep flex h-12 w-12 items-center justify-center rounded-2xl text-[#38B2AC]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-extrabold text-[#3D4852]">Your Files</h2>
                    <p className="text-xs font-medium text-[#6B7280]">
                      Select a PDF to analyze.
                    </p>
                  </div>
                </div>

                {loadingFiles ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-[#6C63FF]" />
                  </div>
                ) : files.length === 0 ? (
                  <div className="neu-inset-sm rounded-2xl p-6 text-center text-sm font-medium text-[#6B7280]">
                    No files yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {files.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleAnalyzeExisting(f)}
                        className="neu-extruded-sm neu-extruded-hover w-full rounded-2xl p-4 text-left"
                      >
                        <div className="neu-inset-sm mb-3 flex h-8 w-8 items-center justify-center rounded-xl text-[#38B2AC]">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="line-clamp-2 font-display text-sm font-bold text-[#3D4852]">
                          {f.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div
              className={`neu-inset-deep cursor-pointer rounded-[32px] p-8 text-center transition ${
                analyzing ? "opacity-80" : ""
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
                    <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#6C63FF]" />
                    <div className="font-display text-lg font-extrabold text-[#6C63FF]">Analyzing file...</div>
                  </>
                ) : (
                  <>
                    <div className="neu-extruded mb-4 flex h-16 w-16 items-center justify-center rounded-3xl text-[#6C63FF]">
                      <UploadCloud className="h-8 w-8" />
                    </div>
                    <p className="font-display text-lg font-extrabold text-[#3D4852]">Click to upload and analyze PDF</p>
                    <p className="mt-2 text-sm font-medium text-[#6B7280]">
                      The existing analyzer and chat flow will start after upload.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {context && (
          <div className="flex min-h-[calc(100vh-7rem)] flex-col gap-6">
            <div className="neu-extruded flex flex-col gap-4 rounded-[32px] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <button
                  onClick={handleBack}
                  className="neu-icon-btn rounded-2xl"
                  title="Back to files"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                  <p className="font-display text-xs font-extrabold uppercase text-[#6C63FF]">
                    Active Document
                  </p>
                  <p className="truncate font-display text-lg font-extrabold text-[#3D4852]">
                    {selectedFile?.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleGenerateMindmap}
                  disabled={generatingMindmap}
                  className="neu-btn-secondary !rounded-2xl px-4 py-2 text-sm text-[#6C63FF] disabled:opacity-50 flex items-center gap-1.5"
                  title="Generate Mindmap from Document"
                >
                  {generatingMindmap ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Mindmap...
                    </>
                  ) : (
                    <>
                      <Network size={16} /> Mindmap
                    </>
                  )}
                </button>

                <button
                  onClick={handleClearConversation}
                  className="neu-btn-secondary !rounded-2xl px-4 py-2 text-sm text-[#E53E3E]"
                >
                  <Trash size={16} /> Clear
                </button>

                <button
                  onClick={handleSaveConversation}
                  className="neu-btn-secondary !rounded-2xl px-4 py-2 text-sm text-[#38B2AC]"
                >
                  <Save size={16} /> Save
                </button>
                <button className="neu-btn-secondary !rounded-2xl px-4 py-2 text-sm">
                  <Speech size={16} /> Talk
                </button>
              </div>
            </div>

            {mindmap && (
              <section className="neu-extruded rounded-[32px] p-6 transition-all">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#A3B1C6]/20">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-extrabold text-[#3D4852]">
                      Document Mindmap
                    </h3>
                  </div>
                  <button
                    onClick={() => setMindmap(null)}
                    className="neu-icon-btn rounded-xl h-8 w-8 text-[#E53E3E]"
                    title="Close Mindmap"
                  >
                    <X size={16} />
                  </button>
                </div>
                <MindmapRenderer mindmap={mindmap} />
              </section>
            )}

            <div className="neu-extruded flex min-h-0 flex-1 flex-col overflow-hidden rounded-[32px] p-6">
              <div className="border-b border-[#A3B1C6]/20 pb-4">
                <p className="font-display text-lg font-extrabold text-[#3D4852]">Conversation</p>
                <p className="text-xs font-medium text-[#6B7280]">
                  Ask specific questions about the analyzed source.
                </p>
              </div>

              <div className="vault-scrollbar h-[58vh] flex-1 space-y-4 overflow-y-auto py-4 sm:h-[64vh]">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`relative max-w-[85%] rounded-3xl p-5 ${
                      m.role === "user"
                        ? "neu-btn-primary ml-auto !rounded-3xl text-white"
                        : "neu-extruded rounded-3xl text-[#3D4852]"
                    }`}
                  >
                    {m.role === "user" ? (
                      <span className="whitespace-pre-wrap text-sm font-semibold leading-relaxed">
                        {m.content}
                      </span>
                    ) : (
                      <div className="max-w-none pr-6 text-sm font-medium leading-relaxed text-[#3D4852] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="mb-2 mt-4 font-display text-xl font-extrabold text-[#3D4852] first:mt-0">{children}</h1>,
                            h2: ({ children }) => <h2 className="mb-2 mt-4 font-display text-lg font-extrabold text-[#6C63FF] first:mt-0">{children}</h2>,
                            h3: ({ children }) => <h3 className="mb-1.5 mt-3 font-display text-base font-extrabold text-[#3D4852]">{children}</h3>,
                            p: ({ children }) => <p className="mb-3 leading-relaxed last:mb-0 text-[#3D4852]">{children}</p>,
                            ul: ({ children }) => <ul className="mb-3 list-inside list-disc space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-3 list-inside list-decimal space-y-1.5 pl-1">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="font-extrabold text-[#3D4852]">{children}</strong>,
                            code: ({ children }) => <code className="neu-inset-sm rounded-lg px-2 py-0.5 text-xs text-[#6C63FF]">{children}</code>,
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    )}

                    {m.role === "assistant" && (
                      <button
                        className="absolute bottom-3 right-3 text-[#6B7280] transition hover:text-[#6C63FF]"
                        title="Copy answer"
                        onClick={() => {
                          navigator.clipboard.writeText(m.content);
                          setCopiedIndex(i);
                          setTimeout(() => setCopiedIndex(null), 1200);
                        }}
                      >
                        {copiedIndex === i ? (
                          <Check size={16} className="text-[#38B2AC]" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    )}
                  </div>
                ))}

                {aiTyping && (
                  <div className="neu-extruded flex w-24 items-center justify-center gap-2 rounded-2xl p-4">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#6C63FF]"></span>
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#8B84FF] [animation-delay:0.2s]"></span>
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#38B2AC] [animation-delay:0.4s]"></span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Box */}
              <div className="pt-3">
                <div className="neu-inset-deep flex items-center gap-3 rounded-2xl p-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAsk();
                      }
                    }}
                    placeholder="Ask a question about the document..."
                    className="w-full bg-transparent px-4 py-3 text-sm font-medium text-[#3D4852] placeholder-[#6B7280] outline-none"
                  />

                  <button
                    onClick={handleAsk}
                    className="neu-btn-primary shrink-0 rounded-xl px-5 py-3"
                    title="Send question"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="fixed right-6 top-20 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-2xl px-5 py-3 font-display text-sm font-bold shadow-lg ${toastClass(t.type)}`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

