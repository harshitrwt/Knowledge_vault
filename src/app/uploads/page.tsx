"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Plus, Folder, MoreVertical, Download, Share2 } from "lucide-react";

// Helper to convert File to base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

type StoredFile = {
  name: string;
  size: number;
  type: string;
  base64: string;
};

export default function UploadsPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);

  // Load files from localStorage on page load
  useEffect(() => {
    const saved = localStorage.getItem("uploaded_files");
    if (saved) {
      setFiles(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem("uploaded_files", JSON.stringify(files));
  }, [files]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files;
    if (!selected) return;

    const newFiles: StoredFile[] = [];

    for (const file of Array.from(selected)) {
      const base64 = await fileToBase64(file);
      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        base64,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleOpen = (file: StoredFile) => {
    const blob = base64ToBlob(file.base64, file.type);
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleDownload = (file: StoredFile) => {
    const blob = base64ToBlob(file.base64, file.type);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
  };

  const handleShare = async (file: StoredFile) => {
    const blob = base64ToBlob(file.base64, file.type);
    const url = URL.createObjectURL(blob);

    try {
      await navigator.clipboard.writeText(url);
      alert("Sharable link copied to clipboard!");
    } catch {
      alert("Unable to copy link. You can manually share it:");
      window.prompt("Copy this link:", url);
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
                key={index}
                className="bg-blue-800 rounded-lg p-4 relative cursor-pointer hover:bg-blue-700 transition"
                onClick={() => handleOpen(file)}
              >
                <Folder size={48} className="text-blue-300 mb-2 mx-auto" />
                <p className="text-sm font-medium text-center break-words">{file.name}</p>
                <p className="text-xs text-center text-gray-300 mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>

                {/* 3-dot menu */}
                <div
                  className="absolute bottom-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent open
                    setMenuIndex(index === menuIndex ? null : index);
                  }}
                >
                  <MoreVertical className="text-white cursor-pointer" />
                </div>

                {menuIndex === index && (
                  <div className="absolute bottom-10 right-2 bg-gray-900 border border-gray-700 rounded shadow-md z-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file);
                        setMenuIndex(null);
                      }}
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-800 w-full"
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
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-800 w-full"
                    >
                      <Share2 size={16} className="mr-2" />
                      Share
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
          className="absolute bottom-8 right-8 w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition"
          onClick={handleUploadClick}
        >
          <Plus size={28} className="text-white" />
        </button>
      </main>
    </div>
  );
}
