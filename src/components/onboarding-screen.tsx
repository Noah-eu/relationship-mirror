'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import QuestionStepCard from "@/components/question-step-card";
import { useRelationship } from "@/components/relationship-context";
import { defaultOnboardingState } from "@/lib/relationship-data";
import {
    getAnsweredQuestionIds,
    getCurrentQuestionId,
    getFlowProgress,
    getNextQuestionId,
    getPreviousQuestionId,
    getQuestionIdAfterAnswer,
} from "@/lib/question-flow";
import { getVisibleOnboardingQuestions } from "@/lib/relationship-engine";

const onboardingCopy = {
    cz: {
        eyebrow: "Na úvod",
        title: "Nejdřív vyber, co se tvého vztahu opravdu týká",
        description:
            "Stačí pár krátkých odpovědí a ukážou se jen ty otázky, které pro tebe dávají smysl.",
        questionLabel: "Otázka",
        back: "Zpět",
        next: "Další",
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
        questionLabel: "Question",
        back: "Back",
        next: "Next",
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
        onboardingProgress,
        setOnboardingAnswer,
        visibleOnboardingQuestions,
    } = useRelationship();
    const copy = onboardingCopy[language];
    const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
    const questionIds = useMemo(
        () => visibleOnboardingQuestions.map((question) => question.id),
        [visibleOnboardingQuestions],
    );
    const answeredQuestionIds = useMemo(
        () => getAnsweredQuestionIds(questionIds, onboarding, (value) => value !== null && value !== undefined),
        [questionIds, onboarding],
    );
    const resolvedQuestionId = getCurrentQuestionId(
        questionIds,
        currentQuestionId,
        answeredQuestionIds,
    );
    const currentQuestion = visibleOnboardingQuestions.find(
        (question) => question.id === resolvedQuestionId,
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

    function getNextOnboardingState(questionId: string, value: string | boolean) {
        const nextOnboarding = {
            ...defaultOnboardingState,
            ...onboarding,
            [questionId]: value,
        };

        if (questionId === "hasChildren" && value === false) {
            nextOnboarding.childrenType = null;
        }

        return nextOnboarding;
    }

    function handleSelect(value: string | boolean) {
        if (!currentQuestion) {
            return;
        }

        const nextOnboarding = getNextOnboardingState(currentQuestion.id, value);
        const nextVisibleQuestions = getVisibleOnboardingQuestions(nextOnboarding);
        const nextVisibleQuestionIds = nextVisibleQuestions.map((question) => question.id);
        const followingQuestionId = getQuestionIdAfterAnswer(
            nextVisibleQuestionIds,
            currentQuestion.id,
        );

        setOnboardingAnswer(currentQuestion.id, value);

        if (followingQuestionId) {
            setCurrentQuestionId(followingQuestionId);
            return;
        }

        router.push("/questionnaire");
    }

    function handleBack() {
        if (previousQuestionId) {
            setCurrentQuestionId(previousQuestionId);
        }
    }

    function handleNext() {
        if (!currentQuestion) {
            return;
        }

        if (nextQuestionId) {
            setCurrentQuestionId(nextQuestionId);
            return;
        }

        if (onboarding[currentQuestion.id] !== null) {
            router.push("/questionnaire");
        }
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
            {currentQuestion ? (
                <QuestionStepCard
                    progressLabel={`${copy.questionLabel} ${progress.currentNumber} ${language === "cz" ? "z" : "of"} ${progress.totalQuestions}`}
                    progressCurrent={progress.currentNumber}
                    progressTotal={progress.totalQuestions}
                    questionLabel={`${copy.questionLabel} ${progress.currentNumber}`}
                    questionText={language === "cz" ? currentQuestion.textCZ : currentQuestion.textEN}
                    clarifier={language === "cz" ? currentQuestion.clarifierCZ : currentQuestion.clarifierEN}
                    options={currentQuestion.options.map((option) => ({
                        key: `${currentQuestion.id}-${String(option.value)}`,
                        label: language === "cz" ? option.labelCZ : option.labelEN,
                        hint: language === "cz" ? option.hintCZ : option.hintEN,
                        selected: onboarding[currentQuestion.id] === option.value,
                        onSelect: () => handleSelect(option.value),
                    }))}
                    optionsClassName="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
                    backLabel={copy.back}
                    nextLabel={nextQuestionId ? copy.next : copy.continue}
                    onBack={handleBack}
                    onNext={handleNext}
                    canGoBack={Boolean(previousQuestionId)}
                    canGoNext={onboarding[currentQuestion.id] !== null}
                    footer={
                        <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                            {copy.incomplete}
                        </p>
                    }
                />
            ) : null}
        </AppShell>
    );
}