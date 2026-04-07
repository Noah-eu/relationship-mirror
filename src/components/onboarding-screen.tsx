'use client';

import { useEffect, useMemo, useRef, useState } from "react";
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
        title: "Nejdřív vyber, co do vašeho vztahu opravdu patří",
        description:
            "Stačí pár krátkých odpovědí a ukážou se jen ty otázky, které pro tebe dávají smysl.",
        questionLabel: "Otázka",
        back: "Zpět",
        next: "Další",
        continue: "Pokračovat k otázkám",
        answerPrompt: "Abys mohl nebo mohla pokračovat, vyber jednu odpověď.",
        footerDefault: "Podle těchto odpovědí pak vybereme jen otázky, které pro vás dávají smysl.",
        footerFinish: "Po poslední odpovědi se rovnou otevře hlavní část dotazníku.",
        helperToggle: "Jak to funguje",
        helperBody: "Tyhle úvodní odpovědi jen vyberou otázky, které se vás opravdu týkají.",
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
        answerPrompt: "Choose one answer to continue.",
        footerDefault: "These answers help us show only the questions that fit your situation.",
        footerFinish: "After the last answer, the main questionnaire opens right away.",
        helperToggle: "How this works",
        helperBody: "These basic answers only decide which questions are relevant for your situation.",
    },
} as const;

export default function OnboardingScreen() {
    const router = useRouter();
    const {
        language,
        onboarding,
        setOnboardingAnswer,
        visibleOnboardingQuestions,
    } = useRelationship();
    const copy = onboardingCopy[language];
    const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
    const questionCardRef = useRef<HTMLDivElement | null>(null);
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

    useEffect(() => {
        if (!resolvedQuestionId) {
            return;
        }

        const frameId = window.requestAnimationFrame(() => {
            questionCardRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
        });

        return () => window.cancelAnimationFrame(frameId);
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
            layoutMode="step"
        >
            {currentQuestion ? (
                <div ref={questionCardRef}>
                    <QuestionStepCard
                        stepKey="onboarding-step"
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
                        optionsClassName="grid gap-3 sm:auto-rows-fr sm:grid-cols-2 xl:grid-cols-4"
                        backLabel={copy.back}
                        nextLabel={nextQuestionId ? copy.next : copy.continue}
                        onBack={handleBack}
                        onNext={handleNext}
                        canGoBack={Boolean(previousQuestionId)}
                        canGoNext={onboarding[currentQuestion.id] !== null}
                        footer={
                            <div className="space-y-3">
                                <div className="rounded-[22px] border border-[var(--stroke)] bg-white/72 px-4 py-4 text-sm leading-6 text-[var(--muted-foreground)]">
                                    {onboarding[currentQuestion.id] === null
                                        ? copy.answerPrompt
                                        : nextQuestionId
                                            ? copy.footerDefault
                                            : copy.footerFinish}
                                </div>
                                <details className="rounded-[22px] border border-[var(--stroke)] bg-white/72 px-4 py-4 text-sm leading-6 text-[var(--muted-foreground)]">
                                    <summary className="cursor-pointer list-none font-semibold text-[var(--foreground)]">
                                        {copy.helperToggle}
                                    </summary>
                                    <p className="mt-3">{copy.helperBody}</p>
                                </details>
                            </div>
                        }
                    />
                </div>
            ) : null}
        </AppShell>
    );
}