'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { useRelationship } from "@/components/relationship-context";
import { questionnaireAreas } from "@/lib/relationship-data";

const resultsCopy = {
  cz: {
    eyebrow: "Výsledky",
    title: "Přehled vztahu v první verzi MVP",
    description:
      "Výstup je orientační. Neříká, co musíš udělat, ale ukazuje, kde vztah stojí pevněji a které oblasti nejvíc volají po pravdivé pozornosti.",
    gateTitle: "Nejdřív vyplň dotazník",
    gateText: "Výsledky lze spočítat až po zodpovězení všech relevantních otázek.",
    gateAction: "Přejít na dotazník",
    total: "Celkové skóre",
    average: "Vážený průměr",
    interpretation: "Jednoduchý výklad",
    weakest: "Nejslabší oblasti",
    areaBreakdown: "Skóre po oblastech",
    restart: "Začít znovu",
    revise: "Upravit odpovědi",
    interpretations: {
      strong:
        "Ve vztahu je vidět víc nosných pilířů než trhlin. Výsledek spíš ukazuje na vztah, který stojí za vědomou péči a další investici.",
      promising:
        "Vztah má použitelné základy, ale několik oblastí potřebuje cílenou opravu. Zachování vztahu může dávat smysl, pokud se nejslabší místa začnou řešit konkrétně.",
      mixed:
        "Obraz je smíšený. Něco vztah drží, ale několik zón už může stát na dluhu, únavě nebo nepojmenovaném napětí.",
      fragile:
        "Výsledek ukazuje výrazné oslabení více oblastí najednou. Pokud má mít vztah šanci, bude potřebovat velmi pravdivé pojmenování reality a bezpečný další krok.",
    },
  },
  en: {
    eyebrow: "Results",
    title: "A first-pass view of the relationship",
    description:
      "This output is directional, not absolute. It does not tell you what you must do, but it shows where the relationship stands on firmer ground and which areas need the most honest attention.",
    gateTitle: "Finish the questionnaire first",
    gateText: "Results can only be calculated after all relevant questions have been answered.",
    gateAction: "Go to questionnaire",
    total: "Total score",
    average: "Weighted average",
    interpretation: "Simple interpretation",
    weakest: "Weakest areas",
    areaBreakdown: "Area breakdown",
    restart: "Start over",
    revise: "Revise answers",
    interpretations: {
      strong:
        "More core pillars than fractures are visible here. The result leans toward a relationship that is still worth conscious care and further investment.",
      promising:
        "The relationship has workable foundations, but several areas need focused repair. Preserving it may make sense if the weakest zones are addressed concretely.",
      mixed:
        "The picture is mixed. Some parts still hold, but several zones may already be running on debt, fatigue, or unnamed tension.",
      fragile:
        "The result points to significant weakening across multiple areas at once. If the relationship is to have a chance, it will need an especially truthful view of reality and a safe next step.",
    },
  },
} as const;

export default function ResultsScreen() {
  const router = useRouter();
  const { language, questionnaireComplete, restartAll, results } = useRelationship();
  const copy = resultsCopy[language];

  if (!questionnaireComplete) {
    return (
      <AppShell
        eyebrow={copy.eyebrow}
        title={copy.gateTitle}
        description={copy.gateText}
        aside={<div className="text-sm leading-6 text-[var(--muted-foreground)]">{copy.gateText}</div>}
      >
        <div className="rounded-[28px] border border-[var(--stroke)] bg-[var(--panel-soft)] p-6">
          <Link
            href="/questionnaire"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-semibold text-white"
          >
            {copy.gateAction}
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      aside={
        <div className="space-y-6">
          <div className="rounded-[24px] border border-[var(--stroke)] bg-[var(--panel)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              {copy.total}
            </p>
            <p className="mt-3 font-serif text-5xl text-[var(--foreground)]">
              {results.totalScore}
              <span className="text-xl text-[var(--muted-foreground)]">/100</span>
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              {copy.average}: {results.totalAverage}/5
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              {copy.weakest}
            </p>
            <div className="mt-4 space-y-3">
              {results.weakestAreas.map((area) => {
                const definition = questionnaireAreas.find(
                  (item) => item.id === area.areaId,
                );

                if (!definition) {
                  return null;
                }

                return (
                  <div
                    key={area.areaId}
                    className="rounded-[20px] border border-[var(--stroke)] bg-[var(--panel)] px-4 py-3"
                  >
                    <p className="font-semibold text-[var(--foreground)]">
                      {language === "cz" ? definition.titleCZ : definition.titleEN}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                      {area.score}/100
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <section className="rounded-[30px] border border-[var(--stroke)] bg-[linear-gradient(135deg,rgba(245,243,238,0.96),rgba(255,255,255,0.94))] p-6 sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
            <div className="flex h-44 w-44 items-center justify-center rounded-full border border-[var(--stroke)] bg-white shadow-[0_24px_60px_rgba(72,64,49,0.14)]">
              <div className="text-center">
                <p className="font-serif text-5xl text-[var(--foreground)]">{results.totalScore}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                  / 100
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
                  {copy.interpretation}
                </p>
                <p className="mt-3 text-lg leading-8 text-[var(--foreground)]">
                  {copy.interpretations[results.interpretationKey]}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => router.push("/questionnaire")}
                  className="inline-flex items-center justify-center rounded-full border border-[var(--stroke)] bg-white px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel-soft)]"
                >
                  {copy.revise}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    restartAll();
                    router.push("/");
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
                >
                  {copy.restart}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-[var(--stroke)] bg-white/78 p-5 sm:p-6">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              {copy.areaBreakdown}
            </p>
          </div>
          <div className="space-y-4">
            {results.areaResults.map((areaResult) => {
              const definition = questionnaireAreas.find(
                (item) => item.id === areaResult.areaId,
              );

              if (!definition) {
                return null;
              }

              return (
                <div
                  key={areaResult.areaId}
                  className="rounded-[24px] border border-[var(--stroke)] bg-[var(--panel-soft)] p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--foreground)]">
                        {language === "cz" ? definition.titleCZ : definition.titleEN}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                        {language === "cz"
                          ? definition.descriptionCZ
                          : definition.descriptionEN}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-3xl text-[var(--foreground)]">
                        {areaResult.score}
                      </p>
                      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                        {areaResult.average}/5
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent)_0%,var(--accent-strong)_100%)]"
                      style={{ width: `${areaResult.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}