"use client";

import Sidebar from "@/components/Sidebar";
import { Shield, Upload, User, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

type StoredFile = {
  id: string;
  name: string;
  size: number;
};

export default function DashboardPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/files");
        if (res.ok) {
          setFiles(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch files:", err);
      }
      setLoading(false);
    };
    fetchFiles();
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <p className="mt-2 text-gray-400">Welcome to your personal Vault 🚀</p>

        <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-gray-900 rounded-2xl shadow">
            <Shield className="w-8 h-8 mb-2 text-purple-400" />
            <h2 className="text-xl font-semibold">Secure Storage</h2>
            <p className="text-gray-400 text-sm">
              All your files are encrypted and safe in the vault.
            </p>
          </div>

          <div className="p-6 bg-gray-900 rounded-2xl shadow">
            <Upload className="w-8 h-8 mb-2 text-green-400" />
            <h2 className="text-xl font-semibold">Quick Uploads</h2>
            <p className="text-gray-400 text-sm">
              {files.length} file(s) uploaded
            </p>
          </div>

          <div className="p-6 bg-gray-900 rounded-2xl shadow">
            <User className="w-8 h-8 mb-2 text-blue-400" />
            <h2 className="text-xl font-semibold">Your Profile</h2>
            <p className="text-gray-400 text-sm">
              Manage account details and personalize your vault.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 flex justify-center">
            <Loader />
          </div>
        ) : (
          
          files.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Recent Files</h2>
              <ul className="space-y-2">
                {files.slice(0, 5).map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center space-x-3 bg-gray-800 rounded-lg p-3"
                  >
                    <Folder className="text-blue-300" size={20} />
                    <span>{f.name}</span>
                    <span className="ml-auto text-sm text-gray-400">
                      {(f.size / 1024).toFixed(1)} KB
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </main>
    </div>
  );
}
