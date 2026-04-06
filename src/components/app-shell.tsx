'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useRelationship } from "@/components/relationship-context";

type AppShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  aside: ReactNode;
};

const stepCopy = {
  cz: {
    brand: "Vztah pod lupou",
    strapline: "Frontendové MVP pro klidnou, dvojjazyčnou a adaptivní reflexi vztahu.",
    steps: ["Úvod", "Onboarding", "Dotazník", "Výsledky"],
    language: "Jazyk",
  },
  en: {
    brand: "The Relationship Mirror",
    strapline: "A calm, bilingual, adaptive front-end MVP for relationship reflection.",
    steps: ["Landing", "Onboarding", "Questionnaire", "Results"],
    language: "Language",
  },
} as const;

export default function AppShell({
  eyebrow,
  title,
  description,
  children,
  aside,
}: AppShellProps) {
  const pathname = usePathname();
  const { language, onboardingComplete, questionnaireComplete, setLanguage } =
    useRelationship();
  const copy = stepCopy[language];
  const steps = [
    { href: "/", label: copy.steps[0], enabled: true },
    { href: "/onboarding", label: copy.steps[1], enabled: true },
    { href: "/questionnaire", label: copy.steps[2], enabled: onboardingComplete },
    { href: "/results", label: copy.steps[3], enabled: questionnaireComplete },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(96,141,124,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(191,146,111,0.16),_transparent_28%),linear-gradient(180deg,_#f3efe7_0%,_#ede6db_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34)_0%,transparent_24%,transparent_76%,rgba(255,255,255,0.32)_100%)] opacity-50" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[32px] border border-white/70 bg-white/80 px-5 py-5 shadow-[0_30px_80px_rgba(72,64,49,0.12)] backdrop-blur md:px-7 md:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <span className="inline-flex items-center rounded-full border border-[var(--stroke)] bg-[var(--panel-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">
                Relationship Mirror MVP
              </span>
              <div>
                <p className="font-serif text-3xl text-[var(--foreground)] sm:text-4xl">
                  {copy.brand}
                </p>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
                  {copy.strapline}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-start rounded-full border border-[var(--stroke)] bg-[var(--panel)] p-1">
              <span className="pl-3 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                {copy.language}
              </span>
              <button
                type="button"
                onClick={() => setLanguage("cz")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  language === "cz"
                    ? "bg-[var(--accent-strong)] text-white shadow-sm"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--panel-soft)]"
                }`}
              >
                CZ
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  language === "en"
                    ? "bg-[var(--accent-strong)] text-white shadow-sm"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--panel-soft)]"
                }`}
              >
                EN
              </button>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {steps.map((step, index) => {
              const isActive = pathname === step.href;

              if (!step.enabled) {
                return (
                  <div
                    key={step.href}
                    className="rounded-[24px] border border-dashed border-[var(--stroke)] bg-[var(--panel-soft)] px-4 py-4 text-[var(--muted-foreground)]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                      {index + 1}
                    </p>
                    <p className="mt-2 text-base font-medium">{step.label}</p>
                  </div>
                );
              }

              return (
                <Link
                  key={step.href}
                  href={step.href}
                  className={`rounded-[24px] border px-4 py-4 transition ${
                    isActive
                      ? "border-[var(--accent-strong)] bg-[var(--panel)] shadow-[0_16px_38px_rgba(76,96,88,0.12)]"
                      : "border-[var(--stroke)] bg-white/60 hover:bg-white"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    {index + 1}
                  </p>
                  <p className="mt-2 text-base font-medium text-[var(--foreground)]">
                    {step.label}
                  </p>
                </Link>
              );
            })}
          </div>
        </header>

        <main className="mt-6 grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[32px] border border-white/70 bg-[var(--panel)] px-5 py-6 shadow-[0_34px_90px_rgba(72,64,49,0.14)] sm:px-8 sm:py-8">
            <div className="mb-8 max-w-3xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
                {eyebrow}
              </p>
              <h1 className="font-serif text-4xl leading-tight text-[var(--foreground)] sm:text-5xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                {description}
              </p>
            </div>
            {children}
          </section>

          <aside className="rounded-[32px] border border-white/70 bg-white/72 px-5 py-6 shadow-[0_30px_80px_rgba(72,64,49,0.12)] backdrop-blur sm:px-6">
            {aside}
          </aside>
        </main>
      </div>
    </div>
  );
}