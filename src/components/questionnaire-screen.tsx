'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { useRelationship } from "@/components/relationship-context";
import { scaleLabels } from "@/lib/relationship-data";

const questionnaireCopy = {
    cz: {
        eyebrow: "Dotazník",
        title: "Adaptivní sada vztahových otázek",
        description:
            "Zobrazené oblasti vychází z onboardingu. Odpovídej na škále 1 až 5. Vyšší skóre znamená, že daná oblast spíš podporuje důvod vztah zachovat.",
        gateTitle: "Nejdřív onboarding",
        gateText:
            "Aby dotazník dával smysl, nejdřív potřebujeme kontext o vašem vztahu a relevantních sekcích.",
        gateAction: "Přejít na onboarding",
        progress: "Vyplněno",
        results: "Zobrazit výsledky",
        modeLabel: "Režim",
        adaptiveTitle: "Aktivní adaptace",
        hiddenChildren: "Sekce Děti a rodina byla skryta.",
        hiddenHousehold: "Sekce Domácnost byla skryta.",
        limitedFinances: "Finance jsou omezené na obecné otázky.",
        shortDuration: "Krátký vztah: zvýrazněné jsou otázky na tempo, ranou důvěru a přiměřenost očekávání.",
        establishedDuration: "Delší vztah: přidané jsou otázky na opakující se vzorce, historii a nosnost větších závazků.",
        longDuration: "Dlouhodobý vztah: dotazník víc sleduje únavu, cynismus a dlouhodobou opravitelnost.",
        familyOurs: "Společné děti: zobrazené jsou otázky na rodičovské sladění a společnou linii.",
        familyStep: "Moje nebo partnerovy děti: zobrazené jsou otázky na role, loajalitu a jasnost očekávání.",
        familyBlended: "Patchwork rodina: zobrazené jsou otázky na přechody mezi domácnostmi a koordinaci více vazeb.",
    },
    en: {
        eyebrow: "Questionnaire",
        title: "Adaptive relationship question set",
        description:
            "The visible areas are derived from onboarding. Answer on a 1 to 5 scale. Higher scores mean the area leans more toward preserving the relationship.",
        gateTitle: "Onboarding first",
        gateText:
            "To make the questionnaire meaningful, we first need context about your relationship and which sections are relevant.",
        gateAction: "Go to onboarding",
        progress: "Completed",
        results: "View results",
        modeLabel: "Mode",
        adaptiveTitle: "Active adaptation",
        hiddenChildren: "Children and family has been hidden.",
        hiddenHousehold: "Household has been hidden.",
        limitedFinances: "Finances are limited to general prompts.",
        shortDuration: "Short relationship: prompts now emphasize pacing, early trust, and the realism of expectations.",
        establishedDuration: "Longer relationship: prompts have been added for recurring patterns, history, and the weight of bigger commitments.",
        longDuration: "Long-term relationship: the questionnaire leans more into fatigue, cynicism, and long-range repair capacity.",
        familyOurs: "Shared children: prompts focus on parenting alignment and a consistent shared line.",
        familyStep: "My children or their children: prompts focus on roles, loyalty tension, and clearer expectations.",
        familyBlended: "Blended family: prompts focus on transitions between households and coordination across multiple bonds.",
    },
} as const;

export default function QuestionnaireScreen() {
    const router = useRouter();
    const {
        answers,
        language,
        onboarding,
        onboardingComplete,
        questionnaireComplete,
        setQuestionAnswer,
        visibleAreas,
        visibleQuestions,
    } = useRelationship();
    const copy = questionnaireCopy[language];
    const questionsByArea = visibleAreas.map((area) => ({
        area,
        questions: visibleQuestions.filter((question) => question.area === area.id),
    }));
    const answeredCount = visibleQuestions.filter(
        (question) => answers[question.id] !== undefined,
    ).length;
    const notes: string[] = [];

    if (onboarding.hasChildren === false) {
        notes.push(copy.hiddenChildren);
    }

    if (onboarding.livingTogether === false) {
        notes.push(copy.hiddenHousehold);
    }

    if (onboarding.sharedFinances === false) {
        notes.push(copy.limitedFinances);
    }

    if (onboarding.duration === "lt1") {
        notes.push(copy.shortDuration);
    }

    if (onboarding.duration === "1to3" || onboarding.duration === "3to7") {
        notes.push(copy.establishedDuration);
    }

    if (onboarding.duration === "7plus") {
        notes.push(copy.longDuration);
    }

    if (onboarding.childrenType === "ours") {
        notes.push(copy.familyOurs);
    }

    if (onboarding.childrenType === "mine" || onboarding.childrenType === "theirs") {
        notes.push(copy.familyStep);
    }

    if (onboarding.childrenType === "blended") {
        notes.push(copy.familyBlended);
    }

    if (!onboardingComplete) {
        return (
            <AppShell
                eyebrow={copy.eyebrow}
                title={copy.gateTitle}
                description={copy.gateText}
                aside={<div className="text-sm leading-6 text-[var(--muted-foreground)]">{copy.gateText}</div>}
            >
                <div className="rounded-[28px] border border-[var(--stroke)] bg-[var(--panel-soft)] p-6">
                    <Link
                        href="/onboarding"
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
                            {copy.progress}
                        </p>
                        <p className="mt-3 font-serif text-4xl text-[var(--foreground)]">
                            {answeredCount}/{visibleQuestions.length}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                            {copy.modeLabel}: <span className="font-semibold text-[var(--foreground)]">{onboarding.mode?.toUpperCase()}</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
                            {copy.adaptiveTitle}
                        </p>
                        <div className="mt-4 space-y-3">
                            {notes.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-[20px] border border-[var(--stroke)] bg-[var(--panel)] px-4 py-3 text-sm leading-6 text-[var(--muted-foreground)]"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="rounded-[28px] border border-[var(--stroke)] bg-[var(--panel-soft)] p-5 sm:p-6">
                    <div className="grid gap-3 sm:grid-cols-5">
                        {scaleLabels[language].map((item) => (
                            <div
                                key={item.value}
                                className="rounded-[20px] border border-white/70 bg-white/75 px-4 py-3 text-center"
                            >
                                <p className="text-xl font-semibold text-[var(--foreground)]">{item.value}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {questionsByArea.map(({ area, questions }) => (
                    <section
                        key={area.id}
                        className="rounded-[30px] border border-[var(--stroke)] bg-white/78 p-5 sm:p-6"
                    >
                        <div className="mb-6 max-w-3xl space-y-2">
                            <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                                {language === "cz" ? area.titleCZ : area.titleEN}
                            </h2>
                            <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                                {language === "cz" ? area.descriptionCZ : area.descriptionEN}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {questions.map((question, index) => {
                                const selectedValue = answers[question.id];

                                return (
                                    <div
                                        key={question.id}
                                        className="rounded-[24px] border border-[var(--stroke)] bg-[var(--panel-soft)] p-4 sm:p-5"
                                    >
                                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="max-w-3xl">
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                                                    {index + 1}
                                                </p>
                                                <p className="mt-2 text-base leading-7 text-[var(--foreground)] sm:text-lg">
                                                    {language === "cz" ? question.textCZ : question.textEN}
                                                </p>
                                                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                                                    {language === "cz" ? question.clarifierCZ : question.clarifierEN}
                                                </p>
                                            </div>
                                            <span className="rounded-full border border-[var(--stroke)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
                                                w {question.weight}
                                            </span>
                                        </div>

                                        <div className="grid gap-2 sm:grid-cols-5">
                                            {scaleLabels[language].map((item) => {
                                                const isSelected = selectedValue === item.value;

                                                return (
                                                    <button
                                                        key={`${question.id}-${item.value}`}
                                                        type="button"
                                                        onClick={() => setQuestionAnswer(question.id, item.value)}
                                                        className={`rounded-[20px] border px-4 py-3 text-center transition ${isSelected
                                                                ? "border-[var(--accent-strong)] bg-white shadow-[0_14px_34px_rgba(76,96,88,0.12)]"
                                                                : "border-[var(--stroke)] bg-white/70 hover:bg-white"
                                                            }`}
                                                    >
                                                        <p className="text-lg font-semibold text-[var(--foreground)]">
                                                            {item.value}
                                                        </p>
                                                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                                                            {item.label}
                                                        </p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}

                <div className="flex flex-col gap-3 rounded-[28px] border border-[var(--stroke)] bg-white/72 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                        {copy.progress} {answeredCount}/{visibleQuestions.length}
                    </p>
                    <button
                        type="button"
                        onClick={() => router.push("/results")}
                        disabled={!questionnaireComplete}
                        className="inline-flex items-center justify-center rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-[var(--muted)] disabled:text-[var(--muted-foreground)]"
                    >
                        {copy.results}
                    </button>
                </div>
            </div>
        </AppShell>
    );
}