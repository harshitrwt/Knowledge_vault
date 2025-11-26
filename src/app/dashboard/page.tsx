"use client";

import Sidebar from "@/components/Sidebar";
import { 
  Shield, 
  Upload, 
  FileText, 
  TrendingUp, 
  HardDrive, 
  Zap, 
  Lock, 
  Clock, 
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Activity,
  FolderOpen,
  Download,
  Eye
} from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

type StoredFile = {
  id: string;
  name: string;
  size: number;
};

export default function DashboardPage() {
  const { user } = useUser();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const getGreeting = () => {
    if (!mounted) return "Welcome";
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  const storagePercentage = Math.min((totalSize / (100 * 1024 * 1024)) * 100, 100); // Assuming 100MB limit

  const recentFiles = files.slice(0, 6);
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white overflow-x-hidden">
      <Sidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 xl:p-10 transition-all duration-300 ease-in-out overflow-y-auto">
        {/* Animated Header Section */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-2">{getGreeting()}</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-500 mb-2">
                {user?.firstName || "User"}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                 Your vault today
              </p>
            </div>
            <Link
              href="/uploads"
              className="group flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Files</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Statistics Cards Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Files Card */}
          <div className="group relative p-6 bg-gradient-to-br from-gray-900/90 via-gray-800/70 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-blue-500/50 hover:shadow-[0_8px_40px_rgba(59,130,246,0.3)] transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent transition-all duration-500" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-500 opacity-70" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{files.length}</h3>
              <p className="text-sm text-blue-500">Total Files</p>
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-xs text-blue-500">All time uploads</p>
              </div>
            </div>
          </div>

          {/* Storage Used Card */}
          <div className="group relative p-6 bg-gradient-to-br from-gray-900/90 via-gray-800/70 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-blue-500/50 hover:shadow-[0_8px_40px_rgba(59,130,246,0.3)] transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent transition-all duration-500" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
                  <HardDrive className="w-6 h-6 text-blue-500" />
                </div>
                <Activity className="w-5 h-5 text-blue-500 opacity-70" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{totalSizeMB} MB</h3>
              <p className="text-sm text-blue-500">Storage Used</p>
              <div className="mt-3 pt-3 border-t border-gray-800">
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                    style={{ width: `${storagePercentage}%` }}
                  />
                </div>
                <p className="text-xs text-blue-500 mt-2">{storagePercentage.toFixed(1)}% of 100 MB</p>
              </div>
            </div>
          </div>

          {/* Security Status Card */}
          <div className="group relative p-6 bg-gradient-to-br from-gray-900/90 via-gray-800/70 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-blue-500/50 hover:shadow-[0_8px_40px_rgba(59,130,246,0.3)] transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent transition-all duration-500" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
                  <Shield className="w-6 h-6 text-blue-500" />
                </div>
                <CheckCircle2 className="w-5 h-5 text-blue-500 opacity-70" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">100%</h3>
              <p className="text-sm text-blue-500">Encrypted</p>
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-xs text-blue-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  All files secured
                </p>
              </div>
            </div>
          </div>

          {/* Quick Access Card */}
          <div className="group relative p-6 bg-gradient-to-br from-gray-900/90 via-gray-800/70 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-blue-500/50 hover:shadow-[0_8px_40px_rgba(59,130,246,0.3)] transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent transition-all duration-500" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <BarChart3 className="w-5 h-5 text-blue-500 opacity-70" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">AI Ready</h3>
              <p className="text-sm text-blue-500">Ask Questions</p>
              <div className="mt-3 pt-3 border-t border-gray-800">
                <Link href="/askai" className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors">
                  Try AI Assistant
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3 mb-8">
          <div className="group p-6 bg-gradient-to-br from-gray-900/80 via-blue-900/20 to-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-blue-500/50 hover:shadow-[0_8px_40px_rgba(59,130,246,0.4)] transition-all duration-500 hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/10 border border-blue-500/40">
                <Shield className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-500">Military-Grade Security</h3>
                <p className="text-xs text-blue-500">AES-256 encryption</p>
              </div>
            </div>
            <p className="text-sm text-blue-500 leading-relaxed">
              Your documents are protected with industry-leading encryption standards. Every file is encrypted at rest and in transit.
            </p>
          </div>

          <div className="group p-6 bg-gradient-to-br from-gray-900/80 via-blue-900/20 to-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-blue-500/50 hover:shadow-[0_8px_40px_rgba(59,130,246,0.4)] transition-all duration-500 hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/10 border border-blue-500/40">
                <Upload className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-500">Lightning Fast</h3>
                <p className="text-xs text-blue-500">Instant uploads</p>
              </div>
            </div>
            <p className="text-sm text-blue-500 leading-relaxed">
              Upload and access your files in seconds. Our optimized infrastructure ensures minimal latency and maximum performance.
            </p>
          </div>

          <div className="group p-6 bg-gradient-to-br from-gray-900/80 via-blue-900/20 to-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-blue-500/50 hover:shadow-[0_8px_40px_rgba(59,130,246,0.4)] transition-all duration-500 hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/10 border border-blue-500/40">
                <FileText className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-500">AI-Powered Insights</h3>
                <p className="text-xs text-blue-500">Smart analysis</p>
              </div>
            </div>
            <p className="text-sm text-blue-500 leading-relaxed">
              Get instant summaries, extract key information, and ask questions about your documents using advanced AI technology.
            </p>
          </div>
        </div>

        {/* Recent Files Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : files.length > 0 ? (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/20 border border-blue-500/30">
                  <FolderOpen className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
                    Recent Files
                  </h2>
                  <p className="text-sm text-blue-500">Your latest uploads and documents</p>
                </div>
              </div>
              <Link
                href="/uploads"
                className="hidden sm:flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recentFiles.map((f, index) => (
                <div
                  key={f.id}
                  className="group relative p-5 bg-gradient-to-br from-gray-900/90 via-gray-800/70 to-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-blue-500/50 hover:shadow-[0_8px_40px_rgba(59,130,246,0.4)] transition-all duration-500 hover:scale-[1.02] overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-500/5 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="text-blue-300 w-6 h-6" />
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 transition-colors">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 transition-colors">
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-blue-100 truncate group-hover:text-blue-50 transition-colors">
                        {f.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatFileSize(f.size)}
                        </p>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          PDF
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="relative p-12 sm:p-16 bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5" />
            <div className="relative z-10">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/20 border border-blue-500/30 mb-6">
                <FolderOpen className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-200 mb-3">Your Vault is Empty</h3>
              <p className="text-blue-500 mb-6 max-w-md mx-auto">
                Start by uploading your first document. Your files will be securely stored and ready for AI-powered analysis.
              </p>
              <Link
                href="/uploads"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Your First File</span>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions Footer */}
        <div className="mt-8 p-6 bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-1">Need Help?</h3>
              <p className="text-sm text-gray-400">Explore our features or get started with AI assistance</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/askai"
                className="px-5 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all duration-300"
              >
                Ask AI
              </Link>
              <Link
                href="/uploads"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white transition-all duration-300 shadow-lg shadow-blue-500/25"
              >
                Upload Files
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
