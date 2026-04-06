'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { useRelationship } from "@/components/relationship-context";
import { NOT_APPLICABLE, notApplicableLabels, scaleLabels } from "@/lib/relationship-data";

const questionnaireCopy = {
    cz: {
        eyebrow: "Otázky",
        title: "Otázky k tvému vztahu",
        description:
            "Ukazují se jen oblasti, které se vztahu opravdu týkají. Odpovídej na škále 1 až 5. Vyšší číslo znamená spíš zdravější stav.",
        gateTitle: "Nejdřív krátký úvod",
        gateText:
            "Aby otázky dávaly smysl, potřebujeme nejdřív pár základních informací o vztahu.",
        gateAction: "Přejít na úvodní otázky",
        progress: "Vyplněno",
        results: "Zobrazit shrnutí",
        modeLabel: "Verze",
        shorterMode: "kratší",
        detailedMode: "podrobnější",
        notesTitle: "Co se ti teď ukazuje",
        hiddenChildren: "Protože do vztahu teď nezahrnuješ děti, rodinná část se neukáže.",
        hiddenHousehold: "Protože spolu nebydlíte, část o domácnosti zůstává pryč.",
        limitedFinances: "Protože nesdílíte peníze, zůstávají jen obecnější otázky k financím.",
        shortDuration: "Protože jste spolu krátce, víc se tu díváme na tempo, první důvěru a očekávání.",
        establishedDuration: "Protože spolu už nějakou dobu jste, víc se tu ukazují opakující se vzorce a dlouhodobější věci.",
        longDuration: "U delšího vztahu se víc ukáže únava, nosnost a to, co se vrací pořád dokola.",
        familyOurs: "U společných dětí se víc díváme na to, jak držíte společnou rodičovskou linku.",
        familyStep: "Když jsou ve vztahu tvoje nebo partnerovy děti, víc se ptáme na role a očekávání.",
        familyBlended: "V patchwork rodině se víc ukážou otázky na přechody mezi domácnostmi a spolupráci.",
        intimacyIncluded: "Do otázek je zahrnutá i oblast intimity a sexuální blízkosti.",
        notApplicableNote: "U některých otázek můžeš zvolit i To se mě netýká.",
    },
    en: {
        eyebrow: "Questions",
        title: "Questions about your relationship",
        description:
            "You only see the areas that fit your situation. Answer on a 1 to 5 scale. Higher numbers point to a healthier situation.",
        gateTitle: "Start with the basics",
        gateText:
            "To make these questions meaningful, we first need a little context about the relationship.",
        gateAction: "Go to the basics",
        progress: "Completed",
        results: "View summary",
        modeLabel: "Version",
        shorterMode: "shorter",
        detailedMode: "more detailed",
        notesTitle: "What is showing up now",
        hiddenChildren: "Because children are not part of the relationship here, the family section stays out.",
        hiddenHousehold: "Because you do not live together, the household section stays out.",
        limitedFinances: "Because money is not shared, only the more general finance questions remain.",
        shortDuration: "Because the relationship is still new, the questions lean more toward pacing, early trust, and expectations.",
        establishedDuration: "Because you have been together for a while, more recurring patterns and longer-term themes show up here.",
        longDuration: "In a longer relationship, the questions look more at wear, capacity, and what keeps repeating.",
        familyOurs: "With shared children, the questions look more at whether you hold a steady parenting line together.",
        familyStep: "When the relationship includes your children or your partner's children, the questions lean more toward roles and expectations.",
        familyBlended: "In a blended family, more questions show up around transitions between households and staying coordinated.",
        intimacyIncluded: "This questionnaire also includes intimacy and sexual connection.",
        notApplicableNote: "For some questions, you can also choose This does not apply to me.",
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
    const hasNotApplicableQuestions = visibleQuestions.some((question) => question.allowsNotApplicable);
    const answeredCount = visibleQuestions.filter(
        (question) => answers[question.id] !== undefined,
    ).length;
    const notes: string[] = [];

    const modeLabel = onboarding.mode === "deep" ? copy.detailedMode : copy.shorterMode;

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

    if (onboarding.includeIntimacy === true) {
        notes.push(copy.intimacyIncluded);
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
                            {copy.modeLabel}: <span className="font-semibold text-[var(--foreground)]">{modeLabel}</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
                            {copy.notesTitle}
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
                    <div className={`grid gap-3 ${hasNotApplicableQuestions ? "sm:grid-cols-6" : "sm:grid-cols-5"}`}>
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
                        {hasNotApplicableQuestions ? (
                            <div className="rounded-[20px] border border-dashed border-[var(--stroke)] bg-white/65 px-4 py-3 text-center">
                                <p className="text-sm font-semibold text-[var(--foreground)]">
                                    {notApplicableLabels[language]}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                                    {copy.notApplicableNote}
                                </p>
                            </div>
                        ) : null}
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
                                        </div>

                                        <div className={`grid gap-2 ${question.allowsNotApplicable ? "sm:grid-cols-6" : "sm:grid-cols-5"}`}>
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
                                            {question.allowsNotApplicable ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setQuestionAnswer(question.id, NOT_APPLICABLE)}
                                                    className={`rounded-[20px] border px-4 py-3 text-center transition ${selectedValue === NOT_APPLICABLE
                                                        ? "border-[var(--accent-strong)] bg-white shadow-[0_14px_34px_rgba(76,96,88,0.12)]"
                                                        : "border-[var(--stroke)] bg-white/70 hover:bg-white"
                                                        }`}
                                                >
                                                    <p className="text-sm font-semibold text-[var(--foreground)]">
                                                        {notApplicableLabels[language]}
                                                    </p>
                                                </button>
                                            ) : null}
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