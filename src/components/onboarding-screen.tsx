'use client';

import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { useRelationship } from "@/components/relationship-context";

const onboardingCopy = {
    cz: {
        eyebrow: "Onboarding",
        title: "Nejprve vyberme, co je pro váš vztah relevantní",
        description:
            "Krátká sada vstupních otázek určí, které sekce a otázky mají smysl zobrazit. Díky tomu nebudete odpovídat na něco, co se vás netýká.",
        continue: "Pokračovat do dotazníku",
        incomplete: "Nejdřív vyplň všechny viditelné onboarding otázky.",
        summaryTitle: "Co onboarding ovlivní",
        summary: [
            "Bez dětí zmizí celá sekce Děti a rodina.",
            "Bez společné domácnosti se skryje Domácnost.",
            "Bez sdílených financí zůstanou jen obecné finanční otázky.",
            "Délka vztahu upraví otázky pro ranou fázi versus dlouhodobé vzorce.",
            "Typ rodiny vybere konkrétní otázky pro společné, nevlastní nebo patchwork rodičovství.",
            "Režim Quick / Deep mění počet otázek napříč oblastmi.",
        ],
    },
    en: {
        eyebrow: "Onboarding",
        title: "First, let us determine what is actually relevant to your relationship",
        description:
            "This short entry set decides which sections and questions are worth showing. That way you do not have to answer prompts that do not apply to you.",
        continue: "Continue to questionnaire",
        incomplete: "Fill in all visible onboarding questions first.",
        summaryTitle: "What onboarding changes",
        summary: [
            "No children means the entire Children and family section disappears.",
            "Not living together hides Household.",
            "Not sharing finances keeps only the general finance prompts.",
            "Relationship duration shifts prompts between early-stage pacing and long-term patterns.",
            "Family type selects child-related prompts for shared, step, or blended parenting setups.",
            "Quick / Deep mode changes the question count across areas.",
        ],
    },
} as const;

export default function OnboardingScreen() {
    const router = useRouter();
    const {
        language,
        onboarding,
        onboardingComplete,
        onboardingProgress,
        setOnboardingAnswer,
        visibleOnboardingQuestions,
    } = useRelationship();
    const copy = onboardingCopy[language];

    return (
        <AppShell
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
            aside={
                <div className="space-y-6">
                    <div className="rounded-[24px] border border-[var(--stroke)] bg-[var(--panel)] p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
                            Progress
                        </p>
                        <p className="mt-3 font-serif text-4xl text-[var(--foreground)]">
                            {onboardingProgress.answeredCount}/{onboardingProgress.totalCount}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
                            {copy.summaryTitle}
                        </p>
                        <div className="mt-4 space-y-3">
                            {copy.summary.map((item) => (
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
            <div className="space-y-5">
                {visibleOnboardingQuestions.map((question, index) => (
                    <section
                        key={question.id}
                        className="rounded-[28px] border border-[var(--stroke)] bg-[var(--panel-soft)] p-5 sm:p-6"
                    >
                        <div className="mb-5 space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                                {index + 1}
                            </p>
                            <h2 className="text-xl font-semibold text-[var(--foreground)]">
                                {language === "cz" ? question.textCZ : question.textEN}
                            </h2>
                            {question.clarifierCZ || question.clarifierEN ? (
                                <p className="max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
                                    {language === "cz" ? question.clarifierCZ : question.clarifierEN}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {question.options.map((option) => {
                                const isSelected = onboarding[question.id] === option.value;

                                return (
                                    <button
                                        key={`${question.id}-${String(option.value)}`}
                                        type="button"
                                        onClick={() => setOnboardingAnswer(question.id, option.value)}
                                        className={`rounded-[24px] border px-4 py-4 text-left transition ${isSelected
                                                ? "border-[var(--accent-strong)] bg-white shadow-[0_18px_40px_rgba(76,96,88,0.12)]"
                                                : "border-[var(--stroke)] bg-white/65 hover:bg-white"
                                            }`}
                                    >
                                        <p className="text-base font-semibold text-[var(--foreground)]">
                                            {language === "cz" ? option.labelCZ : option.labelEN}
                                        </p>
                                        {option.hintCZ || option.hintEN ? (
                                            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                                                {language === "cz" ? option.hintCZ : option.hintEN}
                                            </p>
                                        ) : null}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                ))}

                <div className="flex flex-col gap-3 rounded-[28px] border border-[var(--stroke)] bg-white/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <p className="text-sm leading-6 text-[var(--muted-foreground)]">{copy.incomplete}</p>
                    <button
                        type="button"
                        onClick={() => router.push("/questionnaire")}
                        disabled={!onboardingComplete}
                        className="inline-flex items-center justify-center rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-[var(--muted)] disabled:text-[var(--muted-foreground)]"
                    >
                        {copy.continue}
                    </button>
                </div>
            </div>
        </AppShell>
    );
}