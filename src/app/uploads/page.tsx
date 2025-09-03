"use client";

import Sidebar from "@/components/Sidebar";
import FileCard from "@/components/FileCard";
import { Plus } from "lucide-react";

export default function UploadsPage() {
  const mockFiles: { id: number; name: string; size: string }[] = []; 

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />


      <main className="flex-1 relative p-6">
        <h1 className="text-2xl font-bold mb-6">Your Uploads</h1>


        {mockFiles.length === 0 ? (
          <div className="flex items-center justify-center h-[70vh]">
            <span className="text-7xl font-bold text-gray-700 opacity-20">
              Empty
            </span>
          </div>
        ) : (
          <div className="grid gap-4">
            {mockFiles.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        )}

       
        <button
          className="absolute bottom-8 right-8 w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition"
          onClick={() => alert("Upload flow goes here")}
        >
          <Plus size={28} className="text-white" />
        </button>
      </main>
    </div>
  );
}
