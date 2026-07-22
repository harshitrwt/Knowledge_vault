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
      tone: "bg-[var(--vault-brand-soft)] text-[var(--vault-brand)]",
    },
    {
      label: "Storage Used",
      value: `${totalSizeMB} MB`,
      helper: `${storagePercentage.toFixed(1)}% of 100 MB`,
      icon: HardDrive,
      accessory: Activity,
      tone: "bg-[var(--vault-info-soft)] text-[var(--vault-info)]",
    },
    {
      label: "Encrypted",
      value: "100%",
      helper: "All files secured",
      icon: Shield,
      accessory: CheckCircle2,
      tone: "bg-[var(--vault-brand-soft)] text-[var(--vault-success)]",
    },
    {
      label: "AI Ready",
      value: "Live",
      helper: "Ask questions anytime",
      icon: Zap,
      accessory: Sparkles,
      tone: "bg-[var(--vault-accent-soft)] text-[var(--vault-accent)]",
    },
  ];

  return (
    <div className="vault-grid flex min-h-screen text-[var(--vault-ink)]">
      <Sidebar />

      <main className="flex-grow overflow-y-auto px-4 pb-10 pt-24 sm:px-6 lg:px-8 xl:px-10 md:pt-8">
        <header className="mb-8 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="vault-panel p-6 sm:p-8">
            <p className="vault-kicker mb-3">{getGreeting()}</p>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-4xl font-black tracking-normal text-[var(--vault-ink)] sm:text-5xl">
                  {user?.firstName || "User"}
                </h1>
                <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[var(--vault-muted)]">
                  Your files, saved chats, and AI actions are ready from this command surface.
                </p>
              </div>
              <Link href="/uploads" className="vault-button-primary w-full sm:w-auto">
                <Upload className="h-5 w-5" />
                Upload Files
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="vault-panel-solid p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-[var(--vault-brand-soft)] text-[var(--vault-brand)]">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-[var(--vault-ink)]">Workspace Health</p>
                <p className="text-xs font-bold text-[var(--vault-muted)]">Secure and synced</p>
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-sm bg-[var(--vault-soft)]">
              <div
                className="h-full bg-[var(--vault-brand)] transition-all duration-700"
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            <p className="mt-3 text-xs font-extrabold text-[var(--vault-muted)]">
              {formatFileSize(totalSize)} stored across {files.length} files
            </p>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const Accessory = metric.accessory;
            return (
              <div key={metric.label} className="vault-panel-solid p-5 transition duration-300 hover:-translate-y-1">
                <div className="mb-5 flex items-center justify-between">
                  <div className={`grid h-11 w-11 place-items-center rounded-md ${metric.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Accessory className="h-5 w-5 text-[var(--vault-muted)]" />
                </div>
                <p className="text-3xl font-black text-[var(--vault-ink)]">{metric.value}</p>
                <p className="mt-1 text-sm font-extrabold text-[var(--vault-brand)]">{metric.label}</p>
                <p className="mt-3 border-t border-[var(--vault-line)] pt-3 text-xs font-bold text-[var(--vault-muted)]">
                  {metric.helper}
                </p>
              </div>
            );
          })}
        </div>

        <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
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
              <div key={item.title} className="vault-panel-solid p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-[var(--vault-brand-soft)] text-[var(--vault-brand)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-[var(--vault-ink)]">{item.title}</h3>
                    <p className="text-xs font-bold text-[var(--vault-muted)]">{item.label}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold leading-6 text-[var(--vault-muted)]">
                  {item.copy}
                </p>
              </div>
            );
          })}
        </section>

        {loading ? (
          <div className="vault-panel-solid py-16">
            <Loader />
          </div>
        ) : files.length > 0 ? (
          <section className="mb-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="vault-kicker mb-2">Library</p>
                <h2 className="text-2xl font-black text-[var(--vault-ink)] sm:text-3xl">
                  Recent Files
                </h2>
                <p className="mt-1 text-sm font-semibold text-[var(--vault-muted)]">
                  Your latest uploads and documents.
                </p>
              </div>
              <Link href="/uploads" className="vault-button-secondary">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recentFiles.map((f, index) => (
                <div
                  key={f.id}
                  className="vault-panel-solid p-5 transition duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-md bg-[var(--vault-info-soft)] text-[var(--vault-info)]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="rounded-md bg-[var(--vault-brand-soft)] px-2 py-1 text-xs font-extrabold text-[var(--vault-brand)]">
                      PDF
                    </span>
                  </div>
                  <h3 className="truncate text-base font-black text-[var(--vault-ink)]">
                    {f.name}
                  </h3>
                  <p className="mt-3 flex items-center gap-2 text-xs font-bold text-[var(--vault-muted)]">
                    <Clock className="h-3.5 w-3.5" />
                    {formatFileSize(f.size)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="vault-panel-solid p-10 text-center sm:p-14">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-md bg-[var(--vault-brand-soft)] text-[var(--vault-brand)]">
              <FolderOpen className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-black text-[var(--vault-ink)]">
              Your Vault is Empty
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[var(--vault-muted)]">
              Start by uploading your first document. Your files will be ready for AI-powered analysis.
            </p>
            <Link href="/uploads" className="vault-button-primary mt-6">
              <Upload className="h-5 w-5" />
              Upload Your First File
            </Link>
          </div>
        )}

        <div className="vault-panel-solid mt-8 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-black text-[var(--vault-ink)]">Need a faster path?</h3>
              <p className="text-sm font-semibold text-[var(--vault-muted)]">
                Jump directly into document chat or upload another source.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/askai" className="vault-button-secondary">
                Ask AI
              </Link>
              <Link href="/uploads" className="vault-button-primary">
                Upload Files
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
