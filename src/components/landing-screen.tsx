'use client';

import Link from "next/link";
import AppShell from "@/components/app-shell";
import { useRelationship } from "@/components/relationship-context";

const landingCopy = {
  cz: {
    eyebrow: "Úvod",
    title: "Vztah pod lupou",
    description:
      "Klidný, dvojjazyčný nástroj pro první orientaci v tom, jestli vztah ještě stojí na pevných pilířích a které oblasti si zaslouží největší pozornost.",
    primary: "Začít onboarding",
    secondary: "Pokračovat v dotazníku",
    featuresTitle: "Co MVP už umí",
    features: [
      {
        title: "Adaptivní průchod",
        text: "Onboarding skrývá sekce, které se vás netýkají, a omezuje finanční část, pokud finance nesdílíte.",
      },
      {
        title: "CZ / EN od startu",
        text: "Jazyk přepnete hned nahoře a celé flow se okamžitě přeloží bez ztráty stavu.",
      },
      {
        title: "Lokální výsledky",
        text: "Skóre se počítá jen ve frontendu z datově definovaných otázek a přehledně ukáže slabší oblasti.",
      },
    ],
    promiseTitle: "Jak s tím pracovat",
    promise: [
      "Vyplň onboarding, aby appka vybrala relevantní oblasti.",
      "Odpověz na škále 1 až 5, kde vyšší číslo znamená spíš důvod vztah zachovat.",
      "Na konci dostaneš celkové skóre, skóre po oblastech a krátkou interpretaci.",
    ],
    notesTitle: "Co teď vědomě neřešíme",
    notes: ["Žádný backend", "Žádný login", "Žádná AI interpretace"],
  },
  en: {
    eyebrow: "Landing",
    title: "The Relationship Mirror",
    description:
      "A calm, bilingual tool for a first orientation on whether the relationship still rests on solid pillars and which areas need the most attention.",
    primary: "Start onboarding",
    secondary: "Resume questionnaire",
    featuresTitle: "What the MVP already does",
    features: [
      {
        title: "Adaptive flow",
        text: "Onboarding hides sections that do not apply to you and limits finance questions when money is not shared.",
      },
      {
        title: "CZ / EN from the start",
        text: "The language toggle is available immediately and the whole flow switches without losing state.",
      },
      {
        title: "Local results",
        text: "Scoring is calculated purely in the frontend from data-defined questions and highlights weaker areas clearly.",
      },
    ],
    promiseTitle: "How to use it",
    promise: [
      "Complete onboarding so the app can choose relevant areas.",
      "Answer on a 1 to 5 scale where higher numbers lean more toward preserving the relationship.",
      "At the end, you get a total score, area scores, and a short interpretation.",
    ],
    notesTitle: "Intentionally out of scope right now",
    notes: ["No backend", "No login", "No AI interpretation"],
  },
} as const;

export default function LandingScreen() {
  const { language, onboardingComplete } = useRelationship();
  const copy = landingCopy[language];

  return (
    <AppShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      aside={
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              {copy.promiseTitle}
            </p>
            <div className="mt-4 space-y-3">
              {copy.promise.map((item) => (
                <div
                  key={item}
                  className="rounded-[20px] border border-[var(--stroke)] bg-[var(--panel)] px-4 py-3 text-sm leading-6 text-[var(--muted-foreground)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              {copy.notesTitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {copy.notes.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--stroke)] bg-[var(--panel-soft)] px-3 py-1 text-sm text-[var(--muted-foreground)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6 rounded-[30px] border border-[var(--stroke)] bg-[linear-gradient(135deg,rgba(245,243,238,0.9),rgba(255,255,255,0.92))] p-6 sm:p-8">
          <div className="space-y-4">
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
              {language === "cz"
                ? "MVP je navržené jako první zrcadlo, ne jako definitivní verdikt. Cíl je rychle oddělit relevantní témata od šumu a dát přehled, kde vztah drží a kde už ztrácí půdu pod nohama."
                : "This MVP is designed as a first mirror, not a final verdict. The point is to separate relevant topics from noise quickly and show where the relationship still holds and where it is losing ground."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
            >
              {copy.primary}
            </Link>
            {onboardingComplete ? (
              <Link
                href="/questionnaire"
                className="inline-flex items-center justify-center rounded-full border border-[var(--stroke)] bg-white px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel-soft)]"
              >
                {copy.secondary}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="rounded-[30px] border border-[var(--stroke)] bg-[var(--panel-soft)] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
            {copy.featuresTitle}
          </p>
          <div className="mt-5 space-y-4">
            {copy.features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[22px] border border-white/70 bg-white/75 px-4 py-4"
              >
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}