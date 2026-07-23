"use client";

import Sidebar from "@/components/Sidebar";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  FolderOpen,
  HardDrive,
  Lock,
  Shield,
  Sparkles,
  Upload,
  Zap,
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

  const totalSize = files.reduce((acc, file) => acc + Number(file.size || 0), 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  const storagePercentage = Math.min((totalSize / (100 * 1024 * 1024)) * 100, 100);

  const recentFiles = files.slice(0, 6);
  const formatFileSize = (bytes: number | string) => {
    const n = Number(bytes);
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    return (n / (1024 * 1024)).toFixed(2) + " MB";
  };

  const metrics = [
    {
      label: "Total Files",
      value: files.length,
      helper: "All time uploads",
      icon: FileText,
      accessory: BarChart3,
      tone: "text-[#6C63FF]",
    },
    {
      label: "Storage Used",
      value: `${totalSizeMB} MB`,
      helper: `${storagePercentage.toFixed(1)}% of 100 MB`,
      icon: HardDrive,
      accessory: Activity,
      tone: "text-[#38B2AC]",
    },
    {
      label: "Encrypted",
      value: "100%",
      helper: "All files secured",
      icon: Shield,
      accessory: CheckCircle2,
      tone: "text-[#38B2AC]",
    },
    {
      label: "AI Ready",
      value: "Live",
      helper: "Ask questions anytime",
      icon: Zap,
      accessory: Sparkles,
      tone: "text-[#6C63FF]",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#E0E5EC] font-sans text-[#3D4852]">
      <Sidebar />

      <main className="flex-grow overflow-y-auto px-4 pb-12 pt-24 sm:px-6 lg:px-10 md:pt-8">
        {/* Header Grid */}
        <header className="mb-10 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main Greeting Card */}
          <div className="neu-extruded rounded-[32px] p-8 sm:p-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-xs font-extrabold text-[#6C63FF] neu-inset-sm">
              <span>{getGreeting()}</span>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#3D4852] sm:text-5xl">
                  {user?.firstName || "User"}
                </h1>
                <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-[#6B7280]">
                  Your files, saved chats, and AI actions are ready from this command surface.
                </p>
              </div>
              <Link href="/uploads" className="neu-btn-primary shrink-0 rounded-2xl px-6 py-3.5 text-base">
                <Upload className="h-5 w-5" />
                Upload Files
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Workspace Health Card */}
          <div className="neu-extruded flex flex-col justify-between rounded-[32px] p-7">
            <div>
              <div className="flex items-center gap-3.5">
                <div className="neu-inset-deep flex h-12 w-12 items-center justify-center rounded-2xl text-[#6C63FF]">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-base font-bold text-[#3D4852]">Workspace Health</p>
                  <p className="text-xs font-medium text-[#6B7280]">Secure and synced</p>
                </div>
              </div>

              <div className="neu-inset-sm mt-6 h-3.5 w-full overflow-hidden rounded-full p-0.5">
                <div
                  className="h-full rounded-full bg-[#6C63FF] transition-all duration-700 shadow-[0_0_10px_rgba(108,99,255,0.4)]"
                  style={{ width: `${Math.max(storagePercentage, 4)}%` }}
                />
              </div>
            </div>
            <p className="mt-4 font-display text-xs font-bold text-[#6B7280]">
              {formatFileSize(totalSize)} stored across {files.length} files
            </p>
          </div>
        </header>

        {/* Metric Cards Grid */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const Accessory = metric.accessory;
            return (
              <div key={metric.label} className="neu-extruded neu-extruded-hover rounded-[32px] p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className={`neu-inset-deep flex h-12 w-12 items-center justify-center rounded-2xl ${metric.tone}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Accessory className="h-5 w-5 text-[#6B7280]/60" />
                </div>
                <p className="font-display text-3xl font-extrabold text-[#3D4852]">{metric.value}</p>
                <p className="mt-1 font-display text-sm font-bold text-[#6C63FF]">{metric.label}</p>
                <p className="mt-3 border-t border-[#A3B1C6]/20 pt-3 text-xs font-medium text-[#6B7280]">
                  {metric.helper}
                </p>
              </div>
            );
          })}
        </div>

        {/* Features / Security Banner */}
        <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[
            {
              title: "Security First",
              label: "Private file access",
              copy: "Authenticated document actions remain scoped to the current account.",
              icon: Shield,
            },
            {
              title: "Fast Uploads",
              label: "Short path to storage",
              copy: "Upload flows stay one click away from the dashboard and file library.",
              icon: Upload,
            },
            {
              title: "AI Analysis",
              label: "Answers on demand",
              copy: "Use Ask AI to summarize, inspect, and save useful document conversations.",
              icon: FileText,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="neu-extruded rounded-[32px] p-7">
                <div className="mb-4 flex items-center gap-3.5">
                  <div className="neu-inset-deep flex h-12 w-12 items-center justify-center rounded-2xl text-[#6C63FF]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-[#3D4852]">{item.title}</h3>
                    <p className="text-xs font-medium text-[#6B7280]">{item.label}</p>
                  </div>
                </div>
                <p className="text-sm font-medium leading-relaxed text-[#6B7280]">
                  {item.copy}
                </p>
              </div>
            );
          })}
        </section>

        {/* Files Section */}
        {loading ? (
          <div className="neu-extruded rounded-[32px] py-16">
            <Loader />
          </div>
        ) : files.length > 0 ? (
          <section className="mb-10">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 font-display text-xs font-extrabold text-[#6C63FF] neu-inset-sm">
                  <span>Library</span>
                </div>
                <h2 className="font-display text-3xl font-extrabold text-[#3D4852]">
                  Recent Files
                </h2>
                <p className="mt-1 text-sm font-medium text-[#6B7280]">
                  Your latest uploads and documents.
                </p>
              </div>
              <Link href="/uploads" className="neu-btn-secondary rounded-2xl px-6 py-2.5 text-sm">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {recentFiles.map((f) => (
                <div
                  key={f.id}
                  className="neu-extruded neu-extruded-hover rounded-[32px] p-6"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="neu-inset-deep flex h-12 w-12 items-center justify-center rounded-2xl text-[#38B2AC]">
                      <FileText className="h-6 w-6" />
                    </div>
                    <span className="neu-inset-sm rounded-full px-3 py-1 font-display text-xs font-bold text-[#6C63FF]">
                      PDF
                    </span>
                  </div>
                  <h3 className="truncate font-display text-lg font-bold text-[#3D4852]">
                    {f.name}
                  </h3>
                  <p className="mt-3 flex items-center gap-2 text-xs font-medium text-[#6B7280]">
                    <Clock className="h-3.5 w-3.5 text-[#6C63FF]" />
                    {formatFileSize(f.size)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="neu-extruded rounded-[32px] p-12 text-center sm:p-16">
            <div className="neu-inset-deep mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl text-[#6C63FF]">
              <FolderOpen className="h-8 w-8" />
            </div>
            <h3 className="font-display text-2xl font-extrabold text-[#3D4852]">
              Your Vault is Empty
            </h3>
            <p className="mx-auto mt-3 max-w-md text-base font-medium leading-relaxed text-[#6B7280]">
              Start by uploading your first document. Your files will be ready for AI-powered analysis.
            </p>
            <Link href="/uploads" className="neu-btn-primary mt-8 rounded-2xl px-8 py-3.5 font-bold">
              <Upload className="h-5 w-5" />
              Upload Your First File
            </Link>
          </div>
        )}

        {/* Quick Footer Action Card */}
        <div className="neu-extruded rounded-[32px] p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-xl font-extrabold text-[#3D4852]">Need a faster path?</h3>
              <p className="mt-1 text-base font-medium text-[#6B7280]">
                Jump directly into document chat or upload another source.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/askai" className="neu-btn-secondary rounded-2xl px-6 py-3">
                Ask AI
              </Link>
              <Link href="/uploads" className="neu-btn-primary rounded-2xl px-6 py-3">
                Upload Files
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

