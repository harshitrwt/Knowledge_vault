"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Plus,
  Folder,
  MoreVertical,
  Download,
  Share2,
  Trash2,
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

export default function UploadsPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("/api/files");
        if (res.ok) {
          const data = await res.json();
          setFiles(data);
        }
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    };
    fetchFiles();
  }, []);


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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            size: file.size,
            url: base64,
          }),
        });

        if (res.ok) {
          const newFile = await res.json();
          setFiles((prev) => [...prev, newFile]);
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
    const blob = base64ToBlob(file.url, "application/octet-stream");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };


  const handleDownload = (file: StoredFile) => {
    const blob = base64ToBlob(file.url, "application/octet-stream");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
  };


  const handleShare = async (file: StoredFile) => {
    const blob = base64ToBlob(file.url, "application/octet-stream");
    const url = URL.createObjectURL(blob);

    try {
      await navigator.clipboard.writeText(url);
      alert("Sharable link copied to clipboard!");
    } catch {
      alert("Unable to copy. You can copy it manually:");
      window.prompt("Copy this link:", url);
    }
  };


  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this file?");
    if (!confirmed) return;

    try {
      const res = await fetch("/api/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id));
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
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 relative p-6">
        <h1 className="text-2xl font-bold mb-6">Your Uploads</h1>


        {files.length === 0 ? (
          <div className="flex items-center justify-center h-[70vh]">
            <span className="text-7xl font-bold text-gray-700 opacity-20">
              Empty
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 relative cursor-pointer hover:bg-blue-500/20 transition"
                onClick={() => handleOpen(file)}
              >
                <Folder size={48} className="text-blue-500 mb-2 mx-auto" />
                <p className="text-sm font-semibold text-center break-words text-blue-100">
                  {file.name}
                </p>
                <p className="text-xs text-center text-blue-300 mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>

                <div
                  className="absolute bottom-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuIndex(index === menuIndex ? null : index);
                  }}
                >
                  <MoreVertical className="text-blue-200 cursor-pointer" />
                </div>

                {menuIndex === index && (
                  <div className="absolute bottom-10 right-2 bg-blue-950 border border-blue-800 rounded shadow-md z-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file);
                        setMenuIndex(null);
                      }}
                      className="flex items-center px-4 py-2 text-sm hover:bg-blue-800 w-full text-blue-200"
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
                      className="flex items-center px-4 py-2 text-sm hover:bg-blue-800 w-full text-blue-200"
                    >
                      <Share2 size={16} className="mr-2" />
                      Share
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      className="flex items-center px-4 py-2 text-sm hover:bg-red-900 w-full text-red-400"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>

            ))}
          </div>
        )}


        <input
          type="file"
          ref={fileInputRef}
          multiple
          className="hidden"
          onChange={handleFileChange}
        />


        <button
          className="absolute bottom-8 right-8 w-14 h-14 flex items-center justify-center cursor-pointer rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition"
          onClick={handleUploadClick}
        >
          <Plus size={28} className="text-white" />
        </button>
      </main>
    </div>
  );
}
