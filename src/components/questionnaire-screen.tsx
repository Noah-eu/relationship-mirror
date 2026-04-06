'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import QuestionStepCard from "@/components/question-step-card";
import { useRelationship } from "@/components/relationship-context";
import {
    NOT_APPLICABLE,
    notApplicableLabels,
    scaleLabels,
    type QuestionAnswerValue,
} from "@/lib/relationship-data";
import {
    getAnsweredQuestionIds,
    getCurrentQuestionId,
    getFlowProgress,
    getNextQuestionId,
    getPreviousQuestionId,
} from "@/lib/question-flow";

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
        questionLabel: "Otázka",
        back: "Zpět",
        next: "Další",
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
        questionLabel: "Question",
        back: "Back",
        next: "Next",
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
        setQuestionAnswer,
        visibleAreas,
        visibleQuestions,
    } = useRelationship();
    const copy = questionnaireCopy[language];
    const hasNotApplicableQuestions = visibleQuestions.some((question) => question.allowsNotApplicable);
    const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
    const questionIds = useMemo(
        () => visibleQuestions.map((question) => question.id),
        [visibleQuestions],
    );
    const answeredQuestionIds = useMemo(
        () => getAnsweredQuestionIds(questionIds, answers),
        [questionIds, answers],
    );
    const answeredCount = visibleQuestions.filter(
        (question) => answers[question.id] !== undefined,
    ).length;
    const notes: string[] = [];

    const modeLabel = onboarding.mode === "deep" ? copy.detailedMode : copy.shorterMode;
    const resolvedQuestionId = getCurrentQuestionId(
        questionIds,
        currentQuestionId,
        answeredQuestionIds,
    );
    const currentQuestion = visibleQuestions.find(
        (question) => question.id === resolvedQuestionId,
    );
    const currentArea = visibleAreas.find(
        (area) => area.id === currentQuestion?.area,
    );
    const progress = getFlowProgress(
        questionIds,
        resolvedQuestionId,
        answeredQuestionIds,
    );
    const previousQuestionId = getPreviousQuestionId(
        questionIds,
        resolvedQuestionId,
        answeredQuestionIds,
    );
    const nextQuestionId = getNextQuestionId(
        questionIds,
        resolvedQuestionId,
        answeredQuestionIds,
    );

    useEffect(() => {
        setCurrentQuestionId(resolvedQuestionId);
    }, [resolvedQuestionId]);

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

    function handleSelect(value: QuestionAnswerValue) {
        if (!currentQuestion) {
            return;
        }

        setQuestionAnswer(currentQuestion.id, value);

        if (nextQuestionId) {
            setCurrentQuestionId(nextQuestionId);
            return;
        }

        router.push("/results");
    }

    function handleBack() {
        if (previousQuestionId) {
            setCurrentQuestionId(previousQuestionId);
        }
    }

    function handleNext() {
        if (!currentQuestion || answers[currentQuestion.id] === undefined) {
            return;
        }

        if (nextQuestionId) {
            setCurrentQuestionId(nextQuestionId);
            return;
        }

        router.push("/results");
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

                {currentQuestion ? (
                    <QuestionStepCard
                        progressLabel={`${copy.questionLabel} ${progress.currentNumber} ${language === "cz" ? "z" : "of"} ${progress.totalQuestions}`}
                        progressCurrent={progress.currentNumber}
                        progressTotal={progress.totalQuestions}
                        questionLabel={`${copy.questionLabel} ${progress.currentNumber}`}
                        questionText={language === "cz" ? currentQuestion.textCZ : currentQuestion.textEN}
                        clarifier={language === "cz" ? currentQuestion.clarifierCZ : currentQuestion.clarifierEN}
                        sectionLabel={currentArea ? (language === "cz" ? currentArea.titleCZ : currentArea.titleEN) : undefined}
                        sectionDescription={
                            currentArea
                                ? language === "cz"
                                    ? currentArea.descriptionCZ
                                    : currentArea.descriptionEN
                                : undefined
                        }
                        options={[
                            ...scaleLabels[language].map((item) => ({
                                key: `${currentQuestion.id}-${item.value}`,
                                label: `${item.value}`,
                                hint: item.label,
                                selected: answers[currentQuestion.id] === item.value,
                                onSelect: () => handleSelect(item.value),
                            })),
                            ...(currentQuestion.allowsNotApplicable
                                ? [
                                    {
                                        key: `${currentQuestion.id}-${NOT_APPLICABLE}`,
                                        label: notApplicableLabels[language],
                                        hint: copy.notApplicableNote,
                                        selected: answers[currentQuestion.id] === NOT_APPLICABLE,
                                        onSelect: () => handleSelect(NOT_APPLICABLE),
                                    },
                                ]
                                : []),
                        ]}
                        optionsClassName={`grid gap-3 ${currentQuestion.allowsNotApplicable ? "sm:grid-cols-3 xl:grid-cols-6" : "sm:grid-cols-3 xl:grid-cols-5"}`}
                        backLabel={copy.back}
                        nextLabel={nextQuestionId ? copy.next : copy.results}
                        onBack={handleBack}
                        onNext={handleNext}
                        canGoBack={Boolean(previousQuestionId)}
                        canGoNext={answers[currentQuestion.id] !== undefined}
                        footer={
                            <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                                {copy.progress} {answeredCount}/{visibleQuestions.length}
                            </p>
                        }
                    />
                ) : null}
            </div>
        </AppShell>
    );
}