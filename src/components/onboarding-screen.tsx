'use client';

import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { useRelationship } from "@/components/relationship-context";

const onboardingCopy = {
    cz: {
        eyebrow: "Na úvod",
        title: "Nejdřív vyber, co se tvého vztahu opravdu týká",
        description:
            "Stačí pár krátkých odpovědí a ukážou se jen ty otázky, které pro tebe dávají smysl.",
        continue: "Pokračovat k otázkám",
        incomplete: "Nejdřív projdi všechny viditelné otázky nahoře.",
        progress: "Hotovo",
        summaryTitle: "Co se podle toho ukáže",
        summary: [
            "Když do vztahu teď nezahrnuješ děti, část o rodině se neukáže.",
            "Když spolu nebydlíte, otázky k domácnosti zůstanou pryč.",
            "Když nesdílíte peníze, ukážou se jen obecnější otázky k financím.",
            "Délka vztahu jemně upraví, na co se budeme ptát.",
            "Rodinná situace pomůže vybrat jen ty otázky, které dávají smysl právě vám.",
            "Pokud budeš chtít, přidá se i část o intimitě a sexuální blízkosti.",
        ],
    },
    en: {
        eyebrow: "Basics",
        title: "Start by choosing what really fits your relationship",
        description:
            "A few short answers are enough to show only the questions that make sense for you.",
        continue: "Continue to questions",
        incomplete: "First go through all visible questions above.",
        progress: "Done",
        summaryTitle: "What this changes",
        summary: [
            "If children are not part of the relationship, the family section stays out.",
            "If you do not live together, household questions stay hidden.",
            "If you do not share money, only the more general finance questions stay in.",
            "Relationship length gently changes some of the questions.",
            "Family setup helps pick only the questions that fit your situation.",
            "If you want, you can also include a section on intimacy and sexual connection.",
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
                            {copy.progress}
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