"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import {
  Bot,
  Download,
  FileText,
  Folder,
  MessageSquare,
  MoreVertical,
  Plus,
  Share2,
  Trash2,
  UploadCloud,
} from "lucide-react";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

type StoredFile = {
  id: string;
  name: string;
  size: number;
  url: string;
};

type SavedChatMeta = { id: string; fileName: string; createdAt: string };

export default function UploadsPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [savedChats, setSavedChats] = useState<SavedChatMeta[]>([]);
  const [menuIndex, setMenuIndex] = useState<string | number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshFiles = async () => {
    setLoading(true);
    try {
      const [filesRes, chatsRes] = await Promise.all([
        fetch("/api/files", { cache: "no-store" }),
        fetch("/api/chats", { cache: "no-store" }),
      ]);
      if (filesRes.ok) setFiles(await filesRes.json());
      if (chatsRes.ok) setSavedChats(await chatsRes.json());
    } catch (error) {
      console.error("Failed to refresh:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshFiles();
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = event.target.files;
    if (!selected) return;

    for (const file of Array.from(selected)) {
      if (file.size > 1024 * 1024 * 1.5) {
        alert(`"${file.name}" is too large. Please keep files under 1.5MB.`);
        continue;
      }

      const base64 = await fileToBase64(file);

      try {
        const res = await fetch("/api/files", {
          method: "POST",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            size: file.size,
            url: base64,
          }),
        });

        if (res.ok) {
          await refreshFiles();
        } else {
          console.error("Failed to upload file:", await res.text());
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const base64ToBlob = (base64: string, type: string) => {
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type });
  };

  const handleOpen = (file: StoredFile) => {
    if (file.url.startsWith("data:")) {
      window.open(file.url, "_blank");
    } else {
      window.location.href = `/preview/${file.id}`;
    }
  };

  const handleDownload = (file: StoredFile) => {
    const blob = base64ToBlob(file.url, "application/octet-stream");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
  };

  const handleDeleteChat = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this chat?"
    );
    if (!confirmed) return;

    setSavedChats((prev) => prev.filter((chat) => chat.id !== id));
    setMenuIndex(null);

    try {
      const res = await fetch("/api/chats", {
        method: "DELETE",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        console.error("Failed to delete chat:", await res.text());
        refreshFiles();
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      refreshFiles();
    }
  };

  const handleShare = async (file: StoredFile) => {
    const blob = base64ToBlob(file.url, "application/octet-stream");
    const url = URL.createObjectURL(blob);

    try {
      await navigator.clipboard.writeText(url);
      setToast("Link copied to clipboard.");
      setTimeout(() => setToast(null), 2500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch("/api/files", {
        method: "DELETE",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        await refreshFiles();
      } else {
        console.error("Failed to delete file:", await res.text());
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
    setMenuIndex(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="vault-grid flex min-h-screen text-[var(--vault-ink)]">
      <Sidebar />

      <main className="relative flex-1 px-4 pb-28 pt-24 sm:px-6 lg:px-8 xl:px-10 md:pt-8">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="vault-kicker mb-3">Library</p>
            <h1 className="text-4xl font-black tracking-normal text-[var(--vault-ink)] sm:text-5xl">
              Your Files
            </h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[var(--vault-muted)]">
              Review uploaded documents, reopen saved chats, or add a fresh PDF for analysis.
            </p>
          </div>
          <button onClick={handleUploadClick} className="vault-button-primary">
            <UploadCloud className="h-5 w-5" />
            Upload Files
          </button>
        </header>

        {loading ? (
          <div className="vault-panel-solid py-20">
            <Loader />
          </div>
        ) : files.length === 0 && savedChats.length === 0 ? (
          <div className="vault-panel-solid flex min-h-[58vh] items-center justify-center p-8 text-center">
            <div>
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-md bg-[var(--vault-brand-soft)] text-[var(--vault-brand)]">
                <Folder className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-[var(--vault-ink)]">
                No files yet
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[var(--vault-muted)]">
                Upload a PDF to start building your searchable document workspace.
              </p>
              <button onClick={handleUploadClick} className="vault-button-primary mt-6">
                <Plus className="h-5 w-5" />
                Add First File
              </button>
            </div>
          </div>
        ) : (
          <>
            {savedChats.length > 0 && (
              <section className="mb-10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-[var(--vault-accent-soft)] text-[var(--vault-accent)]">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[var(--vault-ink)]">
                      Saved Chats
                    </h2>
                    <p className="text-sm font-semibold text-[var(--vault-muted)]">
                      Continue from previous document sessions.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {savedChats.map((chat, index) => {
                    const menuId = `chat-${index}`;

                    return (
                      <div key={chat.id} className="relative">
                        <Link href={`/askai?chat=${chat.id}`}>
                          <div className="vault-panel-solid cursor-pointer p-5 transition duration-300 hover:-translate-y-1">
                            {menuIndex === menuId && (
                              <div
                                className="absolute right-3 top-12 z-50 overflow-hidden rounded-md border border-[var(--vault-line)] bg-white shadow-[var(--vault-shadow)]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteChat(chat.id);
                                  }}
                                  className="flex w-full items-center px-4 py-2 text-sm font-bold text-[var(--vault-danger)] transition hover:bg-[var(--vault-accent-soft)]"
                                >
                                  <Trash2 size={16} className="mr-2" />
                                  Delete
                                </button>
                              </div>
                            )}

                            <div className="mb-4 flex items-center justify-between">
                              <div className="grid h-12 w-12 place-items-center rounded-md bg-[var(--vault-accent-soft)] text-[var(--vault-accent)]">
                                <MessageSquare className="h-6 w-6" />
                              </div>
                              <span className="rounded-md bg-[var(--vault-soft)] px-2 py-1 text-xs font-extrabold text-[var(--vault-muted)]">
                                Chat
                              </span>
                            </div>
                            <p className="truncate text-base font-black text-[var(--vault-ink)]">
                              {chat.fileName}
                            </p>
                            <p className="mt-2 text-xs font-bold text-[var(--vault-muted)]">
                              Continue conversation
                            </p>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-[var(--vault-info-soft)] text-[var(--vault-info)]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[var(--vault-ink)]">
                    Uploaded Files
                  </h2>
                  <p className="text-sm font-semibold text-[var(--vault-muted)]">
                    Open, download, share, or remove documents.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    onClick={() => handleOpen(file)}
                    className="vault-panel-solid group relative cursor-pointer p-5 transition duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-md bg-[var(--vault-info-soft)] text-[var(--vault-info)]">
                        <Folder className="h-6 w-6" />
                      </div>

                      <button
                        className="vault-icon-button min-h-9 min-w-9"
                        title="File actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuIndex(index === menuIndex ? null : index);
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="truncate text-base font-black text-[var(--vault-ink)]">
                      {file.name}
                    </p>
                    <p className="mt-2 text-xs font-bold text-[var(--vault-muted)]">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>

                    {menuIndex === index && (
                      <div className="absolute right-3 top-14 z-50 overflow-hidden rounded-md border border-[var(--vault-line)] bg-white shadow-[var(--vault-shadow)]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(file);
                            setMenuIndex(null);
                          }}
                          className="flex w-full items-center px-4 py-2 text-sm font-bold text-[var(--vault-ink)] transition hover:bg-[var(--vault-soft)]"
                        >
                          <Download size={16} className="mr-2" />
                          Download
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(file);
                            setMenuIndex(null);
                          }}
                          className="flex w-full items-center px-4 py-2 text-sm font-bold text-[var(--vault-ink)] transition hover:bg-[var(--vault-soft)]"
                        >
                          <Share2 size={16} className="mr-2" />
                          Share
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(file.id);
                          }}
                          className="flex w-full items-center px-4 py-2 text-sm font-bold text-[var(--vault-danger)] transition hover:bg-[var(--vault-accent-soft)]"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <div
          className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-2 sm:right-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && (
            <div className="rounded-md border border-[var(--vault-line)] bg-white px-3 py-1.5 text-sm font-extrabold text-[var(--vault-ink)] shadow-[var(--vault-shadow-soft)]">
              Ask AI
            </div>
          )}

          <Link href="/askai" className="vault-icon-button h-14 w-14 bg-[var(--vault-ink)] text-white hover:bg-[var(--vault-brand-dark)]" title="Ask AI">
            <Bot size={26} />
          </Link>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--vault-brand)] text-white shadow-[var(--vault-shadow)] transition hover:-translate-y-1 hover:bg-[var(--vault-brand-dark)] sm:right-8"
          onClick={handleUploadClick}
          title="Upload files"
        >
          <Plus size={28} />
        </button>

        {toast && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md border border-[var(--vault-line)] bg-[var(--vault-ink)] px-4 py-2 text-sm font-bold text-white shadow-[var(--vault-shadow)]">
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}
