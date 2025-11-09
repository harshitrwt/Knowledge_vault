"use client";

import Sidebar from "@/components/Sidebar";
import { Shield, Upload, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";

type StoredFile = {
  id: string;
  name: string;
  size: number;
};

export default function DashboardPage() {
  const { user } = useUser();
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
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white overflow-hidden">
      <Sidebar />

      <main className="flex-grow p-6 sm:p-10 lg:p-12 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-blue-500">
            Hi, {user?.firstName || "User"}
          </h1>
          <p className="mt-2 text-gray-400 text-lg">
            Welcome back to your secure vault.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-400">
                Secure Storage
              </h2>
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-gray-400 text-sm">
              Your documents are protected with industry-grade encryption and privacy.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-green-400">
                Quick Uploads
              </h2>
              <Upload className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-gray-400 text-sm">
              You’ve uploaded <span className="text-green-300 font-medium">{files.length}</span> file
              {files.length !== 1 && "s"} so far.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-purple-400">
                File Insights
              </h2>
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-gray-400 text-sm">
              Analyze your uploaded PDFs for assignments, summaries, and insights instantly.
            </p>
          </div>
        </div>

        {/* Recent Files */}
        {loading ? (
          <div className="flex justify-center mt-12">
            <Loader />
          </div>
        ) : files.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-200">
              Recent Files
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {files.slice(0, 6).map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-4 p-5 bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-gray-800 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
                >
                  <div className="p-3 rounded-lg bg-blue-600/20">
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
          <div className="mt-12 text-gray-500 text-center">
            No files found in your vault yet.
          </div>
        )}
      </main>
    </div>
  );
}
