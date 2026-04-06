'use client';

import Link from "next/link";
import AppShell from "@/components/app-shell";
import { useRelationship } from "@/components/relationship-context";

const landingCopy = {
  cz: {
    eyebrow: "Začátek",
    title: "Vztah pod lupou",
    description:
      "Krátký a klidný způsob, jak si ujasnit, co ve vztahu drží a kde se zbytečně ztrácí síla.",
    primary: "Začít",
    secondary: "Pokračovat k otázkám",
    featuresTitle: "Co tu najdeš",
    features: [
      {
        title: "Jen to, co se tě týká",
        text: "Otázky se skládají podle toho, co se ve vztahu opravdu řeší.",
      },
      {
        title: "Čeština i angličtina",
        text: "Jazyk můžeš přepnout kdykoli a zůstaneš tam, kde právě jsi.",
      },
      {
        title: "Přehledné shrnutí",
        text: "Na konci uvidíš, na čem vztah stojí a kde si zaslouží víc péče.",
      },
    ],
    promiseTitle: "Jak tím projít",
    promise: [
      "Na začátku vybereš, které oblasti se vztahu opravdu týkají.",
      "Pak projdeš otázky na škále 1 až 5, kde vyšší číslo znamená spíš zdravější stav.",
      "Nakonec dostaneš stručné shrnutí a skóre po oblastech.",
    ],
    notesTitle: "Dobré vědět",
    notes: ["Bez účtu", "Nic se nikam neposílá", "Shrnutí není verdikt"],
  },
  en: {
    eyebrow: "Start",
    title: "The Relationship Mirror",
    description:
      "A short and calm way to sort out what is still holding the relationship and where it is losing energy.",
    primary: "Start",
    secondary: "Continue to questions",
    featuresTitle: "What you will find here",
    features: [
      {
        title: "Only what fits your situation",
        text: "The questions adjust to what is actually part of your relationship.",
      },
      {
        title: "Czech and English",
        text: "You can switch language at any time without losing your place.",
      },
      {
        title: "A clear summary",
        text: "At the end you will see what supports the relationship and where it may need more care.",
      },
    ],
    promiseTitle: "How to move through it",
    promise: [
      "Start by choosing which parts of the relationship really apply to you.",
      "Then answer on a 1 to 5 scale, where higher numbers point to a healthier situation.",
      "At the end, you get a short summary and scores by area.",
    ],
    notesTitle: "Good to know",
    notes: ["No account needed", "Nothing is sent anywhere", "The summary is not a verdict"],
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
                ? "Nejde o soud ani o definitivní odpověď. Je to první klidný pohled na to, co ve vztahu funguje a co už si říká o větší pozornost."
                : "This is not a judgment or a final answer. It is a calm first look at what is working in the relationship and what may need more attention."}
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