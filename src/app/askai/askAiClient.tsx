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
  Save,
  Send,
  Speech,
  Trash,
  UploadCloud,
} from "lucide-react";

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
  };

  const toastClass = (type: Toast["type"]) => {
    if (type === "success") return "bg-[var(--vault-success)] text-white";
    if (type === "error") return "bg-[var(--vault-danger)] text-white";
    return "bg-[var(--vault-ink)] text-white";
  };

  return (
    <div className="vault-grid flex min-h-screen flex-col text-[var(--vault-ink)] md:flex-row">
      <Sidebar />

      <main className="flex-1 px-4 pb-8 pt-24 sm:px-6 lg:px-8 xl:px-10 md:pt-8">
        {!context && (
          <div className="space-y-6">
            <header className="vault-panel p-6 sm:p-8">
              <p className="vault-kicker mb-3">Ask AI</p>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-4xl font-black tracking-normal text-[var(--vault-ink)] sm:text-5xl">
                    Ask Vault
                  </h1>
                  <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[var(--vault-muted)]">
                    Choose an uploaded file, reopen a saved chat, or analyze a new PDF.
                  </p>
                </div>
                <label className="vault-button-primary cursor-pointer">
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

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <section className="vault-panel-solid p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-md bg-[var(--vault-accent-soft)] text-[var(--vault-accent)]">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[var(--vault-ink)]">
                        Recent Saved Chats
                      </h2>
                      <p className="text-sm font-semibold text-[var(--vault-muted)]">
                        Continue an existing conversation.
                      </p>
                    </div>
                  </div>
                </div>

                {loadingChats ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[var(--vault-brand)]" />
                  </div>
                ) : savedChatsMeta.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-[var(--vault-line-strong)] bg-[var(--vault-soft)] p-6 text-sm font-semibold text-[var(--vault-muted)]">
                    No saved conversations yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {savedChatsMeta.map((c) => (
                      <div key={c.id} className="group relative">
                        <button
                          onClick={() => handleLoadSavedChat(c.id)}
                          className="w-full rounded-lg border border-[var(--vault-line)] bg-white/80 p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-[var(--vault-line-strong)]"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--vault-accent-soft)] text-[var(--vault-accent)]">
                              <MessageSquare className="h-4 w-4" />
                            </span>
                            <span className="rounded-md bg-[var(--vault-soft)] px-2 py-1 text-xs font-extrabold text-[var(--vault-muted)]">
                              Saved
                            </span>
                          </div>
                          <span className="line-clamp-2 text-sm font-black text-[var(--vault-ink)]">
                            {c.fileName}
                          </span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(c.id, c.fileName);
                          }}
                          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-md bg-white text-[var(--vault-danger)] opacity-0 shadow-sm transition hover:bg-[var(--vault-accent-soft)] group-hover:opacity-100"
                          title="Delete this chat"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="vault-panel-solid p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-[var(--vault-info-soft)] text-[var(--vault-info)]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[var(--vault-ink)]">Your Files</h2>
                    <p className="text-sm font-semibold text-[var(--vault-muted)]">
                      Select a PDF to analyze.
                    </p>
                  </div>
                </div>

                {loadingFiles ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-[var(--vault-brand)]" />
                  </div>
                ) : files.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-[var(--vault-line-strong)] bg-[var(--vault-soft)] p-6 text-sm font-semibold text-[var(--vault-muted)]">
                    No files yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {files.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleAnalyzeExisting(f)}
                        className="group w-full rounded-lg border border-[var(--vault-line)] bg-white/80 p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-[var(--vault-line-strong)]"
                      >
                        <div className="mb-3 grid h-9 w-9 place-items-center rounded-md bg-[var(--vault-info-soft)] text-[var(--vault-info)]">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="line-clamp-2 text-sm font-black text-[var(--vault-ink)]">
                          {f.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div
              className={`cursor-pointer rounded-lg border-2 border-dashed p-8 transition ${
                analyzing
                  ? "border-[var(--vault-brand)] bg-[var(--vault-brand-soft)]"
                  : "border-[var(--vault-line-strong)] bg-white/70 hover:border-[var(--vault-brand)] hover:bg-white"
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

              <div className="flex flex-col items-center py-6 text-center">
                {analyzing ? (
                  <>
                    <Loader2 className="mb-4 h-12 w-12 animate-spin text-[var(--vault-brand)]" />
                    <div className="font-black text-[var(--vault-brand)]">Analyzing file...</div>
                  </>
                ) : (
                  <>
                    <UploadCloud className="mb-3 h-12 w-12 text-[var(--vault-brand)]" />
                    <p className="font-black text-[var(--vault-ink)]">Click to upload and analyze PDF</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--vault-muted)]">
                      The existing analyzer and chat flow will start after upload.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {context && (
          <div className="flex min-h-[calc(100vh-7rem)] flex-col gap-4">
            <div className="vault-panel-solid flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={handleBack}
                  className="vault-icon-button"
                  title="Back to files"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase text-[var(--vault-muted)]">
                    Active Document
                  </p>
                  <p className="truncate text-base font-black text-[var(--vault-ink)]">
                    {selectedFile?.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleClearConversation}
                  className="vault-button-secondary min-h-10 px-3 py-2 text-sm text-[var(--vault-danger)]"
                >
                  <Trash size={16} /> Clear
                </button>

                <button
                  onClick={handleSaveConversation}
                  className="vault-button-secondary min-h-10 px-3 py-2 text-sm text-[var(--vault-success)]"
                >
                  <Save size={16} /> Save
                </button>
                <button className="vault-button-secondary min-h-10 px-3 py-2 text-sm">
                  <Speech size={16} /> Talk
                </button>
              </div>
            </div>

            <div className="vault-panel flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="border-b border-[var(--vault-line)] px-4 py-3">
                <p className="text-sm font-black text-[var(--vault-ink)]">Conversation</p>
                <p className="text-xs font-bold text-[var(--vault-muted)]">
                  Ask specific questions about the analyzed source.
                </p>
              </div>

              <div className="vault-scrollbar h-[58vh] flex-1 space-y-3 overflow-y-auto p-4 sm:h-[64vh]">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`relative max-w-[88%] rounded-lg p-4 shadow-sm ${
                      m.role === "user"
                        ? "ml-auto bg-[var(--vault-brand)] text-white"
                        : "border border-[var(--vault-line)] bg-white/90 text-[var(--vault-ink)]"
                    }`}
                  >
                    {m.role === "user" ? (
                      <span className="whitespace-pre-wrap text-sm font-semibold leading-6">
                        {m.content}
                      </span>
                    ) : (
                      <div className="max-w-none pr-6 text-sm font-semibold leading-6 text-[var(--vault-muted)] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="mb-2 mt-4 text-xl font-black text-[var(--vault-ink)] first:mt-0">{children}</h1>,
                            h2: ({ children }) => <h2 className="mb-2 mt-4 text-lg font-black text-[var(--vault-brand)] first:mt-0">{children}</h2>,
                            h3: ({ children }) => <h3 className="mb-1.5 mt-3 text-base font-black text-[var(--vault-ink)]">{children}</h3>,
                            p: ({ children }) => <p className="mb-3 leading-relaxed last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="mb-3 list-inside list-disc space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-3 list-inside list-decimal space-y-1.5 pl-1">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="font-black text-[var(--vault-ink)]">{children}</strong>,
                            code: ({ children }) => <code className="rounded bg-[var(--vault-soft)] px-1.5 py-0.5 text-sm text-[var(--vault-ink)]">{children}</code>,
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    )}

                    {m.role === "assistant" && (
                      <button
                        className="absolute bottom-2 right-2 text-[var(--vault-muted)] transition hover:text-[var(--vault-ink)]"
                        title="Copy answer"
                        onClick={() => {
                          navigator.clipboard.writeText(m.content);
                          setCopiedIndex(i);
                          setTimeout(() => setCopiedIndex(null), 1200);
                        }}
                      >
                        {copiedIndex === i ? (
                          <Check size={16} className="text-[var(--vault-success)]" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    )}
                  </div>
                ))}

                {aiTyping && (
                  <div className="flex w-20 justify-between rounded-lg border border-[var(--vault-line)] bg-white/90 p-3">
                    <span className="h-2 w-2 animate-bounce rounded-sm bg-[var(--vault-muted)]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-sm bg-[var(--vault-muted)] [animation-delay:0.2s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-sm bg-[var(--vault-muted)] [animation-delay:0.4s]"></span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              <div className="border-t border-[var(--vault-line)] bg-white/70 p-3">
                <div className="flex gap-2">
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
                    className="vault-input min-h-12 flex-1 px-4 py-3 font-semibold"
                  />

                  <button
                    onClick={handleAsk}
                    className="vault-button-primary min-h-12 px-4"
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

      <div className="fixed right-4 top-20 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-md px-4 py-2 text-sm font-bold shadow-[var(--vault-shadow)] ${toastClass(t.type)}`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
