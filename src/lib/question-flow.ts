export function getAnsweredQuestionIds<TAnswer>(
    questionIds: string[],
    answers: Partial<Record<string, TAnswer>>,
    isAnswered: (value: TAnswer | undefined) => boolean = (value) => value !== undefined,
) {
    return new Set(
        questionIds.filter((questionId) => isAnswered(answers[questionId])),
    );
}

export function filterAnswersToVisibleQuestionIds<TAnswer>(
    answers: Partial<Record<string, TAnswer>>,
    questionIds: string[],
) {
    const visibleQuestionIds = new Set(questionIds);

    return Object.fromEntries(
        Object.entries(answers).filter(([questionId]) => visibleQuestionIds.has(questionId)),
    ) as Partial<Record<string, TAnswer>>;
}

export function sanitizeConditionalOnboardingFields<TOnboarding extends { childrenType: unknown }>(
    onboarding: TOnboarding,
    visibleQuestionIds: string[],
) {
    if (visibleQuestionIds.includes("childrenType") || onboarding.childrenType === null) {
        return onboarding;
    }

    return {
        ...onboarding,
        childrenType: null,
    };
}

export function getFirstUnansweredQuestionIndex(
    questionIds: string[],
    answeredQuestionIds: Set<string>,
) {
    return questionIds.findIndex((questionId) => !answeredQuestionIds.has(questionId));
}

export function getCurrentQuestionIndex(
    questionIds: string[],
    currentQuestionId: string | null,
    answeredQuestionIds: Set<string>,
) {
    if (questionIds.length === 0) {
        return -1;
    }

    if (currentQuestionId) {
        const currentIndex = questionIds.indexOf(currentQuestionId);

        if (currentIndex >= 0) {
            return currentIndex;
        }
    }

    const firstUnansweredIndex = getFirstUnansweredQuestionIndex(
        questionIds,
        answeredQuestionIds,
    );

    return firstUnansweredIndex >= 0 ? firstUnansweredIndex : questionIds.length - 1;
}

export function getCurrentQuestionId(
    questionIds: string[],
    currentQuestionId: string | null,
    answeredQuestionIds: Set<string>,
) {
    const currentIndex = getCurrentQuestionIndex(
        questionIds,
        currentQuestionId,
        answeredQuestionIds,
    );

    return currentIndex >= 0 ? questionIds[currentIndex] : null;
}

export function getPreviousQuestionId(
    questionIds: string[],
    currentQuestionId: string | null,
    answeredQuestionIds: Set<string>,
) {
    const currentIndex = getCurrentQuestionIndex(
        questionIds,
        currentQuestionId,
        answeredQuestionIds,
    );

    if (currentIndex <= 0) {
        return null;
    }

    return questionIds[currentIndex - 1];
}

export function getNextQuestionId(
    questionIds: string[],
    currentQuestionId: string | null,
    answeredQuestionIds: Set<string>,
) {
    const currentIndex = getCurrentQuestionIndex(
        questionIds,
        currentQuestionId,
        answeredQuestionIds,
    );

    if (currentIndex < 0 || currentIndex >= questionIds.length - 1) {
        return null;
    }

    return questionIds[currentIndex + 1];
}

export function getFlowProgress(
    questionIds: string[],
    currentQuestionId: string | null,
    answeredQuestionIds: Set<string>,
) {
    const currentIndex = getCurrentQuestionIndex(
        questionIds,
        currentQuestionId,
        answeredQuestionIds,
    );

    return {
        currentIndex,
        currentNumber: currentIndex >= 0 ? currentIndex + 1 : 0,
        totalQuestions: questionIds.length,
        answeredCount: answeredQuestionIds.size,
    };
}

export function getQuestionIdAfterAnswer(
    questionIds: string[],
    answeredQuestionId: string,
) {
    const answeredIndex = questionIds.indexOf(answeredQuestionId);

    if (answeredIndex < 0 || answeredIndex >= questionIds.length - 1) {
        return null;
    }

    return questionIds[answeredIndex + 1];
}