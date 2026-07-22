"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Files,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";

const insightCards = [
  {
    label: "Analyze",
    title: "Contract risk summary",
    copy: "Three clauses need review before sign-off.",
    icon: FileSearch,
  },
  {
    label: "Ask",
    title: "What changed in section 4?",
    copy: "Vault answers from the uploaded source.",
    icon: MessageSquareText,
  },
  {
    label: "Protect",
    title: "Private by default",
    copy: "Authenticated files stay scoped to your account.",
    icon: ShieldCheck,
  },
];

const pipeline = [
  { label: "Upload", value: "128 docs", icon: UploadCloud },
  { label: "Indexed", value: "92%", icon: Files },
  { label: "Ready", value: "AI live", icon: Sparkles },
];

const answers = [
  {
    question: "Summarize the payment terms.",
    answer: "Net 30 payment with late-fee exposure after day 45.",
  },
  {
    question: "Find termination conditions.",
    answer: "Mutual termination requires 14 days written notice.",
  },
];

export default function HeroSection() {
  const router = useRouter();

  const contentVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative overflow-hidden px-4 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <motion.div
          className="max-w-2xl"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[var(--vault-line)] bg-white/70 px-3 py-2 text-sm font-extrabold text-[var(--vault-brand)] shadow-sm">
            <Sparkles className="h-4 w-4" />
            Document intelligence, redesigned
          </div>

          <h1 className="text-5xl font-black leading-[1.02] tracking-normal text-[var(--vault-ink)] sm:text-6xl lg:text-7xl">
            Vault
          </h1>

          <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-[var(--vault-muted)] sm:text-xl">
            Upload PDFs, ask pointed questions, and turn static documents into a searchable workspace with a calm, premium interface.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <SignedOut>
              <SignInButton fallbackRedirectUrl="/dashboard">
                <button className="vault-button-primary">
                  Open Vault
                  <ArrowRight className="h-4 w-4" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => router.push("/dashboard")}
                className="vault-button-primary"
              >
                Open Vault
                <ArrowRight className="h-4 w-4" />
              </button>
            </SignedIn>

            <SignedOut>
              <SignInButton fallbackRedirectUrl="/askai">
                <button className="vault-button-secondary">Try Ask AI</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => router.push("/askai")}
                className="vault-button-secondary"
              >
                Try Ask AI
              </button>
            </SignedIn>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {insightCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="vault-panel-solid p-4 transition hover:-translate-y-1"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--vault-brand-soft)] text-[var(--vault-brand)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-extrabold uppercase text-[var(--vault-muted)]">
                      {card.label}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-[var(--vault-ink)]">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold leading-5 text-[var(--vault-muted)]">
                    {card.copy}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="vault-panel relative overflow-hidden p-4 sm:p-5"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
        >
          <div className="grid gap-3 border-b border-[var(--vault-line)] pb-4 sm:grid-cols-3">
            {pipeline.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-[var(--vault-line)] bg-white/70 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold uppercase text-[var(--vault-muted)]">
                      {item.label}
                    </span>
                    <Icon className="h-4 w-4 text-[var(--vault-brand)]" />
                  </div>
                  <p className="mt-2 text-2xl font-black text-[var(--vault-ink)]">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[0.7fr_1fr]">
            <div className="rounded-lg border border-[var(--vault-line)] bg-[var(--vault-soft)] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-black text-[var(--vault-ink)]">
                  File Stack
                </p>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-extrabold text-[var(--vault-brand)]">
                  PDF
                </span>
              </div>
              {["Service agreement.pdf", "Audit notes.pdf", "Investor memo.pdf"].map((file, index) => (
                <div
                  key={file}
                  className="mb-2 flex items-center gap-3 rounded-md border border-[var(--vault-line)] bg-white/80 p-3 last:mb-0"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--vault-info-soft)] text-[var(--vault-info)]">
                    <Files className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-[var(--vault-ink)]">
                      {file}
                    </p>
                    <p className="text-xs font-bold text-[var(--vault-muted)]">
                      Indexed {index + 2} min ago
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-[var(--vault-line)] bg-white/80 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-[var(--vault-ink)]">
                    Ask Vault
                  </p>
                  <p className="text-xs font-bold text-[var(--vault-muted)]">
                    Answers grounded in your uploads
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-[var(--vault-success)]" />
              </div>
              <div className="space-y-3">
                {answers.map((item, index) => (
                  <div
                    key={item.question}
                    className="rounded-lg border border-[var(--vault-line)] p-3"
                  >
                    <p className="text-xs font-extrabold uppercase text-[var(--vault-muted)]">
                      Question {index + 1}
                    </p>
                    <p className="mt-1 text-sm font-black text-[var(--vault-ink)]">
                      {item.question}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[var(--vault-muted)]">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
