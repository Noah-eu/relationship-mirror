'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { useRelationship } from "@/components/relationship-context";
import { questionnaireAreas } from "@/lib/relationship-data";
import { buildResultNarrative } from "@/lib/result-narratives";

const resultsCopy = {
    cz: {
        eyebrow: "Shrnutí",
        title: "Jak na tom vztah teď je",
        description:
            "Není to verdikt. Je to klidný souhrn toho, co vztah drží, kde je citlivější a co si teď zaslouží víc péče.",
        gateTitle: "Nejdřív projdi otázky",
        gateText: "Shrnutí se ukáže až po zodpovězení všech otázek, které se vztahu týkají.",
        gateAction: "Přejít k otázkám",
        total: "Celkové skóre",
        average: "Průměr odpovědí",
        areaBreakdown: "Skóre po oblastech",
        outcome: "Celkový dojem",
        restart: "Začít znovu",
        revise: "Upravit odpovědi",
        holdsTitle: "Co vztah pořád drží",
        weakensTitle: "Kde se vztah vyčerpává",
        warningTitle: "Čeho si všimnout včas",
        nextTitle: "Co má smysl udělat teď",
    },
    en: {
        eyebrow: "Summary",
        title: "How the relationship looks right now",
        description:
            "This is not a verdict. It is a calm summary of what supports the relationship, where it is more sensitive, and what deserves attention now.",
        gateTitle: "First go through the questions",
        gateText: "The summary appears after all relevant questions have been answered.",
        gateAction: "Go to questions",
        total: "Total score",
        average: "Average response",
        areaBreakdown: "Area breakdown",
        outcome: "Overall sense",
        restart: "Start over",
        revise: "Revise answers",
        holdsTitle: "What still supports the relationship",
        weakensTitle: "Where the relationship gets drained",
        warningTitle: "What to notice early",
        nextTitle: "What makes sense now",
    },
} as const;

export default function ResultsScreen() {
    const router = useRouter();
    const { language, questionnaireComplete, restartAll, results } = useRelationship();
    const copy = resultsCopy[language];
    const narrative = buildResultNarrative(language, results);
    const displayedWeakAreas = results.weakAreas.length > 0 ? results.weakAreas : results.weakestAreas;

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
                                {narrative.bucketLabel}
                            </span>
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
                            {narrative.weakestPanelTitle}
                        </p>
                        <div className="mt-4 space-y-3">
                            {displayedWeakAreas.map((area) => {
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
                                    {narrative.bucketLabel}
                                </h2>
                                <p className="mt-3 text-lg leading-8 text-[var(--foreground)]">
                                    {narrative.next}
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
                            {narrative.holds}
                        </p>
                        {narrative.supportAreas ? (
                            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{narrative.supportAreas}</p>
                        ) : null}
                    </div>

                    <div className="rounded-[28px] border border-[var(--stroke)] bg-white/78 p-5 sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
                            {copy.weakensTitle}
                        </p>
                        <p className="mt-4 text-base leading-7 text-[var(--foreground)]">
                            {narrative.weakens}
                        </p>
                        {narrative.weakAreas ? (
                            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{narrative.weakAreas}</p>
                        ) : null}
                    </div>

                    <div className="rounded-[28px] border border-[var(--stroke)] bg-white/78 p-5 sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
                            {copy.warningTitle}
                        </p>
                        <p className="mt-4 text-base leading-7 text-[var(--foreground)]">
                            {narrative.warning}
                        </p>
                        {narrative.warningAreas ? (
                            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{narrative.warningAreas}</p>
                        ) : null}
                    </div>

                    <div className="rounded-[28px] border border-[var(--stroke)] bg-white/78 p-5 sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
                            {copy.nextTitle}
                        </p>
                        <p className="mt-4 text-base leading-7 text-[var(--foreground)]">
                            {narrative.next}
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