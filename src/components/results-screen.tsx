'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { useRelationship } from "@/components/relationship-context";
import { questionnaireAreas } from "@/lib/relationship-data";
import type { AreaResult, OutcomeBucket } from "@/lib/relationship-engine";

const resultsCopy = {
  cz: {
    eyebrow: "Výsledky",
    title: "Přehled vztahu",
    description:
      "Tohle není verdikt. Je to klidný souhrn toho, co vztah teď drží, co ho oslabuje a kde je dobré dívat se na realitu bez přikrášlení.",
    gateTitle: "Nejdřív vyplň dotazník",
    gateText: "Výsledky lze spočítat až po zodpovězení všech relevantních otázek.",
    gateAction: "Přejít na dotazník",
    total: "Celkové skóre",
    average: "Průměr odpovědí",
    weakest: "Nejslabší oblasti",
    areaBreakdown: "Skóre po oblastech",
    outcome: "Aktuální obrázek",
    restart: "Začít znovu",
    revise: "Upravit odpovědi",
    holdsTitle: "Co vztah ještě drží",
    weakensTitle: "Co vztah oslabuje",
    warningTitle: "Co je varovné",
    nextTitle: "Co z toho plyne teď",
    noWarning:
      "Teď tu není jedno ostré červené světlo. Varovné by bylo spíš to, kdyby se slabší místa dál přehlížela.",
    areasLeadStrong: "Nejvíc se teď dá opřít o",
    areasLeadWeak: "Nejvíc to teď padá v oblastech",
    areasLeadWarn: "Nejopatrněji je dobré dívat se na",
    bucketLabels: {
      "relationship worth repairing": "Vztah stojí za opravu",
      "limited test of change needed": "Je potřeba omezený, ale skutečný test změny",
      "likely long-term unsustainable without major change":
        "Bez větší změny je tenhle vztah nejspíš dlouhodobě neudržitelný",
    },
    bucketText: {
      "relationship worth repairing": {
        holds:
          "Ve vztahu je pořád dost živého materiálu, o který se dá opřít. To důležité ještě není pryč.",
        weakens:
          "Slabší místa jsou skutečná, ale zatím nepůsobí jako úplný rozpad toho, co vztah nese.",
        warning:
          "Pokud se slabé oblasti nechají být, únava se může začít hromadit rychleji, než teď vypadá.",
        next:
          "Dává smysl zkusit vědomou opravu. Ne všechno najednou. Spíš pár jasných změn v běžném chování a sledovat, jestli se opravdu dějí.",
      },
      "limited test of change needed": {
        holds:
          "Ve vztahu něco drží, ale samo o sobě to nestačí. Dobré části tu pořád jsou, jen už nenesou všechno.",
        weakens:
          "Slabší oblasti už zasahují do běžného fungování a nejde je brát jako drobnost nebo přechodnou nepohodu.",
        warning:
          "Riziko je v tom, že se bude dlouho mluvit o změně, ale v každodenním životě se nic moc nepohne.",
        next:
          "Teď dává smysl krátký a konkrétní test změny. Ujasnit si co přesně se má změnit, dokdy a podle čeho poznáš, že se to opravdu děje.",
      },
      "likely long-term unsustainable without major change": {
        holds:
          "Něco dobrého tu může pořád být, ale samo to teď zřejmě nestačí na pocit bezpečí a dlouhodobé opory.",
        weakens:
          "Slabá místa už nejsou jen okrajová. Zasahují do základů vztahu a berou mu sílu.",
        warning:
          "Varovné je hlavně to, že bez větší změny se stejný tlak bude nejspíš vracet a dál vyčerpávat oba.",
        next:
          "Teď je důležité dívat se víc na realitu než na slib, že se to jednou zlomí. Pokud má vztah ještě dostat šanci, bude potřebovat větší a viditelnou změnu, ne jen další naději.",
      },
    },
  },
  en: {
    eyebrow: "Results",
    title: "Relationship summary",
    description:
      "This is not a verdict. It is a calm summary of what still holds the relationship, what weakens it, and where reality needs a clearer look.",
    gateTitle: "Finish the questionnaire first",
    gateText: "Results can only be calculated after all relevant questions have been answered.",
    gateAction: "Go to questionnaire",
    total: "Total score",
    average: "Average response",
    weakest: "Weakest areas",
    areaBreakdown: "Area breakdown",
    outcome: "Current picture",
    restart: "Start over",
    revise: "Revise answers",
    holdsTitle: "What still holds the relationship",
    weakensTitle: "What weakens the relationship",
    warningTitle: "What is warning",
    nextTitle: "What follows from this now",
    noWarning:
      "There is no single sharp red flag here right now. The risk would be ignoring the weaker areas for too long.",
    areasLeadStrong: "The clearest support right now is in",
    areasLeadWeak: "The relationship is most strained in",
    areasLeadWarn: "The clearest warning sign right now is around",
    bucketLabels: {
      "relationship worth repairing": "Relationship worth repairing",
      "limited test of change needed": "Limited test of change needed",
      "likely long-term unsustainable without major change":
        "Likely long-term unsustainable without major change",
    },
    bucketText: {
      "relationship worth repairing": {
        holds:
          "There is still enough living material in this relationship to build on. What matters most is not gone.",
        weakens:
          "The weak spots are real, but they do not yet read like a full collapse of the core structure.",
        warning:
          "If the weak areas are left alone, wear and resentment can build faster than it seems right now.",
        next:
          "A deliberate repair attempt makes sense here. Not everything at once. A few clear changes in ordinary behavior matter more than big promises.",
      },
      "limited test of change needed": {
        holds:
          "Something still holds this relationship together, but it is not carrying enough on its own anymore.",
        weakens:
          "The weaker areas are already affecting daily life and cannot really be treated as a small side issue.",
        warning:
          "The risk is spending a long time talking about change while everyday reality barely moves.",
        next:
          "What makes sense now is a short, concrete test of change. Be specific about what needs to change, by when, and how you will know it is real.",
      },
      "likely long-term unsustainable without major change": {
        holds:
          "There may still be something good here, but it likely is not enough right now to create safety and steady support.",
        weakens:
          "The weak areas are no longer peripheral. They are reaching into the core of the relationship.",
        warning:
          "The main warning sign is that without major change, the same pressure will probably keep returning and draining both of you further.",
        next:
          "It is important now to look more at reality than at the promise that things will somehow turn around later. If the relationship is to have a chance, it will need visible and meaningful change, not only hope.",
      },
    },
  },
} as const;

function getAreaLabel(areaId: AreaResult["areaId"], language: "cz" | "en") {
  const definition = questionnaireAreas.find((item) => item.id === areaId);

  if (!definition) {
    return "";
  }

  return language === "cz" ? definition.titleCZ.toLowerCase() : definition.titleEN.toLowerCase();
}

function joinLabels(labels: string[], language: "cz" | "en") {
  if (labels.length === 0) {
    return "";
  }

  if (labels.length === 1) {
    return labels[0];
  }

  if (labels.length === 2) {
    return `${labels[0]} ${language === "cz" ? "a" : "and"} ${labels[1]}`;
  }

  return `${labels.slice(0, -1).join(", ")} ${language === "cz" ? "a" : "and"} ${labels.at(-1)}`;
}

function getAreaSentence(
  areas: AreaResult[],
  language: "cz" | "en",
  leadCZ: string,
  leadEN: string,
) {
  if (areas.length === 0) {
    return "";
  }

  const labels = joinLabels(
    areas.map((area) => getAreaLabel(area.areaId, language)).filter(Boolean),
    language,
  );

  if (!labels) {
    return "";
  }

  return language === "cz" ? `${leadCZ} ${labels}.` : `${leadEN} ${labels}.`;
}

function getBucketText(language: "cz" | "en", outcomeBucket: OutcomeBucket) {
  return resultsCopy[language].bucketText[outcomeBucket];
}

function getBucketLabel(language: "cz" | "en", outcomeBucket: OutcomeBucket) {
  return resultsCopy[language].bucketLabels[outcomeBucket];
}

export default function ResultsScreen() {
  const router = useRouter();
  const { language, questionnaireComplete, restartAll, results } = useRelationship();
  const copy = resultsCopy[language];
  const bucketText = getBucketText(language, results.outcomeBucket);
  const supportAreas = getAreaSentence(
    results.strongestAreas.slice(0, 2),
    language,
    copy.areasLeadStrong,
    copy.areasLeadStrong,
  );
  const weakAreas = getAreaSentence(
    results.weakestAreas.slice(0, 2),
    language,
    copy.areasLeadWeak,
    copy.areasLeadWeak,
  );
  const warningAreas = getAreaSentence(
    results.warningAreas.slice(0, 2),
    language,
    copy.areasLeadWarn,
    copy.areasLeadWarn,
  );

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
            <p className="mt-4 rounded-[18px] border border-[var(--stroke)] bg-white px-4 py-3 text-sm leading-6 text-[var(--foreground)]">
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                {copy.outcome}
              </span>
              <span className="mt-2 block font-medium">
                {getBucketLabel(language, results.outcomeBucket)}
              </span>
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
                  {copy.outcome}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
                  {getBucketLabel(language, results.outcomeBucket)}
                </h2>
                <p className="mt-3 text-lg leading-8 text-[var(--foreground)]">
                  {bucketText.next}
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

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] border border-[var(--stroke)] bg-white/78 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              {copy.holdsTitle}
            </p>
            <p className="mt-4 text-base leading-7 text-[var(--foreground)]">
              {bucketText.holds}
            </p>
            {supportAreas ? (
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{supportAreas}</p>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-[var(--stroke)] bg-white/78 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              {copy.weakensTitle}
            </p>
            <p className="mt-4 text-base leading-7 text-[var(--foreground)]">
              {bucketText.weakens}
            </p>
            {weakAreas ? (
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{weakAreas}</p>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-[var(--stroke)] bg-white/78 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              {copy.warningTitle}
            </p>
            <p className="mt-4 text-base leading-7 text-[var(--foreground)]">
              {results.warningAreas.length > 0 ? bucketText.warning : copy.noWarning}
            </p>
            {warningAreas ? (
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{warningAreas}</p>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-[var(--stroke)] bg-white/78 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              {copy.nextTitle}
            </p>
            <p className="mt-4 text-base leading-7 text-[var(--foreground)]">
              {bucketText.next}
            </p>
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