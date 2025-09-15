"use client";

import Sidebar from "@/components/Sidebar";
import { Shield, Upload, User, FileText } from "lucide-react";
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
    <div className="flex min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Sidebar always visible on large screens */}
      <div className="hidden md:block w-64 border-r border-gray-800">
        <Sidebar />
      </div>

      {/* Sidebar in mobile (full width on top) */}
      <div className="w-full md:hidden border-b border-gray-800">
        <Sidebar />
      </div>

      {/* Dashboard content */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-500">
            Your Dashboard
          </h1>
          <p className="mt-2 text-base sm:text-lg text-gray-400">
            Welcome to your personal Vault 🚀
          </p>
        </div>

        {/* Features Section */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          <div className="p-5 sm:p-6 bg-gray-900 rounded-2xl shadow border border-gray-800">
            <Shield className="w-8 h-8 mb-3 text-purple-400" />
            <h2 className="text-lg sm:text-xl font-semibold">Secure Storage</h2>
            <p className="text-gray-400 text-sm sm:text-base">
              All your files are encrypted and safe in the vault.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-gray-900 rounded-2xl shadow border border-gray-800">
            <Upload className="w-8 h-8 mb-3 text-green-400" />
            <h2 className="text-lg sm:text-xl font-semibold">Quick Uploads</h2>
            <p className="text-gray-400 text-sm sm:text-base">
              {files.length} file{files.length !== 1 && "s"} uploaded
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-gray-900 rounded-2xl shadow border border-gray-800">
            <User className="w-8 h-8 mb-3 text-blue-400" />
            <h2 className="text-lg sm:text-xl font-semibold">Your Profile</h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Manage account details and personalize your vault.
            </p>
          </div>
        </div>

        {/* Files Section */}
        {loading ? (
          <div className="flex justify-center mt-10">
            <Loader />
          </div>
        ) : files.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Recent Files
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {files.slice(0, 6).map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 rounded-xl shadow hover:bg-gray-800 transition"
                >
                  <div className="p-2 rounded-lg bg-blue-600/20">
                    <FileText className="text-blue-300 w-6 h-6" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-blue-100 truncate">
                      {f.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(f.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="mt-10 text-gray-500">No recent files found.</div>
        )}
      </main>
    </div>
  );
}
