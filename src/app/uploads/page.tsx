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
    <div className="flex min-h-screen bg-[#E0E5EC] font-sans text-[#3D4852]">
      <Sidebar />

      <main className="relative flex-1 px-4 pb-28 pt-24 sm:px-6 lg:px-10 md:pt-8">
        <header className="neu-extruded mb-10 flex flex-col gap-6 rounded-[32px] p-8 sm:p-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-xs font-extrabold text-[#6C63FF] neu-inset-sm">
              <span>Library</span>
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#3D4852] sm:text-5xl">
              Your Files
            </h1>
            <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-[#6B7280]">
              Review uploaded documents, reopen saved chats, or add a fresh PDF for analysis.
            </p>
          </div>
          <button onClick={handleUploadClick} className="neu-btn-primary rounded-2xl px-6 py-3.5 text-base font-bold">
            <UploadCloud className="h-5 w-5" />
            Upload Files
          </button>
        </header>

        {loading ? (
          <div className="neu-extruded rounded-[32px] py-20">
            <Loader />
          </div>
        ) : files.length === 0 && savedChats.length === 0 ? (
          <div className="neu-extruded flex min-h-[50vh] items-center justify-center rounded-[32px] p-12 text-center">
            <div>
              <div className="neu-inset-deep mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl text-[#6C63FF]">
                <Folder className="h-8 w-8" />
              </div>
              <h2 className="font-display text-2xl font-extrabold text-[#3D4852]">
                No files yet
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base font-medium leading-relaxed text-[#6B7280]">
                Upload a PDF to start building your searchable document workspace.
              </p>
              <button onClick={handleUploadClick} className="neu-btn-primary mt-8 rounded-2xl px-8 py-3.5 font-bold">
                <Plus className="h-5 w-5" />
                Add First File
              </button>
            </div>
          </div>
        ) : (
          <>
            {savedChats.length > 0 && (
              <section className="mb-12">
                <div className="mb-6 flex items-center gap-3.5">
                  <div className="neu-inset-deep flex h-12 w-12 items-center justify-center rounded-2xl text-[#6C63FF]">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-extrabold text-[#3D4852]">
                      Saved Chats
                    </h2>
                    <p className="text-xs font-medium text-[#6B7280]">
                      Continue from previous document sessions.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {savedChats.map((chat, index) => {
                    const menuId = `chat-${index}`;

                    return (
                      <div key={chat.id} className="relative">
                        <Link href={`/askai?chat=${chat.id}`}>
                          <div className="neu-extruded neu-extruded-hover cursor-pointer rounded-[32px] p-6">
                            {menuIndex === menuId && (
                              <div
                                className="neu-extruded absolute right-4 top-14 z-50 overflow-hidden rounded-2xl p-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteChat(chat.id);
                                  }}
                                  className="flex w-full items-center rounded-xl px-4 py-2 text.xs font-bold text-[#E53E3E] transition hover:bg-[#E53E3E]/10"
                                >
                                  <Trash2 size={16} className="mr-2" />
                                  Delete
                                </button>
                              </div>
                            )}

                            <div className="mb-4 flex items-center justify-between">
                              <div className="neu-inset-deep flex h-12 w-12 items-center justify-center rounded-2xl text-[#6C63FF]">
                                <MessageSquare className="h-6 w-6" />
                              </div>
                              <span className="neu-inset-sm rounded-full px-3 py-1 font-display text-xs font-bold text-[#38B2AC]">
                                Chat
                              </span>
                            </div>
                            <p className="truncate font-display text-base font-bold text-[#3D4852]">
                              {chat.fileName}
                            </p>
                            <p className="mt-2 text-xs font-medium text-[#6B7280]">
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
              <div className="mb-6 flex items-center gap-3.5">
                <div className="neu-inset-deep flex h-12 w-12 items-center justify-center rounded-2xl text-[#38B2AC]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-extrabold text-[#3D4852]">
                    Uploaded Files
                  </h2>
                  <p className="text-xs font-medium text-[#6B7280]">
                    Open, download, share, or remove documents.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    onClick={() => handleOpen(file)}
                    className="neu-extruded neu-extruded-hover group relative cursor-pointer rounded-[32px] p-6"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="neu-inset-deep flex h-12 w-12 items-center justify-center rounded-2xl text-[#38B2AC]">
                        <Folder className="h-6 w-6" />
                      </div>

                      <button
                        className="neu-icon-btn h-9 w-9 rounded-xl"
                        title="File actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuIndex(index === menuIndex ? null : index);
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="truncate font-display text-base font-bold text-[#3D4852]">
                      {file.name}
                    </p>
                    <p className="mt-2 text-xs font-medium text-[#6B7280]">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>

                    {menuIndex === index && (
                      <div className="neu-extruded absolute right-4 top-16 z-50 flex flex-col gap-1 rounded-2xl p-2 shadow-xl">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(file);
                            setMenuIndex(null);
                          }}
                          className="flex w-full items-center rounded-xl px-4 py-2 text-xs font-bold text-[#3D4852] transition hover:text-[#6C63FF]"
                        >
                          <Download size={14} className="mr-2" />
                          Download
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(file);
                            setMenuIndex(null);
                          }}
                          className="flex w-full items-center rounded-xl px-4 py-2 text-xs font-bold text-[#3D4852] transition hover:text-[#6C63FF]"
                        >
                          <Share2 size={14} className="mr-2" />
                          Share
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(file.id);
                          }}
                          className="flex w-full items-center rounded-xl px-4 py-2 text-xs font-bold text-[#E53E3E] transition hover:bg-[#E53E3E]/10"
                        >
                          <Trash2 size={14} className="mr-2" />
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
          className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2 sm:right-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && (
            <div className="neu-extruded-sm rounded-xl px-3 py-1.5 font-display text-xs font-bold text-[#6C63FF]">
              Ask AI
            </div>
          )}

          <Link href="/askai" className="neu-btn-primary h-14 w-14 !rounded-2xl !p-0" title="Ask AI">
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
          className="neu-btn-primary fixed bottom-6 right-6 z-40 h-14 w-14 !rounded-2xl !p-0 sm:right-8"
          onClick={handleUploadClick}
          title="Upload files"
        >
          <Plus size={28} />
        </button>

        {toast && (
          <div className="neu-extruded fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-[#3D4852] px-6 py-3 font-display text-sm font-bold text-white shadow-2xl">
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}

