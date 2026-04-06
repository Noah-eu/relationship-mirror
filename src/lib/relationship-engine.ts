import {
    defaultOnboardingState,
    onboardingQuestions,
    questionnaireAreas,
    questionnaireQuestions,
    type Condition,
    type OnboardingQuestion,
    type OnboardingState,
    type QuestionnaireQuestion,
    type ScaleValue,
} from "@/lib/relationship-data";

export type QuestionnaireAnswers = Partial<Record<string, ScaleValue>>;

export type OutcomeBucket =
    | "relationship stands on strong foundations"
    | "limited test of change needed"
    | "likely long-term unsustainable without major change";

export type AreaResult = {
    areaId: QuestionnaireQuestion["area"];
    score: number;
    average: number;
    answered: number;
    maxWeighted: number;
    obtainedWeighted: number;
};

export type RelationshipResults = {
    totalScore: number;
    totalAverage: number;
    answeredQuestions: number;
    areaResults: AreaResult[];
    strongestAreas: AreaResult[];
    weakestAreas: AreaResult[];
    weakAreas: AreaResult[];
    warningAreas: AreaResult[];
    outcomeBucket: OutcomeBucket;
};

const criticalAreaIds = new Set<AreaResult["areaId"]>([
    "foundation",
    "safetyRespect",
    "communication",
    "conflictRepair",
    "trustStability",
]);

const WARNING_THRESHOLD = 50;
const CRITICAL_WARNING_THRESHOLD = 56;
const WEAK_THRESHOLD = 60;
const CRITICAL_WEAK_THRESHOLD = 64;
const TOP_BUCKET_SCORE_THRESHOLD = 76;

export function evaluateCondition(
    onboarding: OnboardingState,
    condition: Condition,
): boolean {
    const currentValue = onboarding[condition.field];

    if (condition.operator === "equals") {
        return currentValue === condition.value;
    }

    if (condition.operator === "notEquals") {
        return currentValue !== condition.value;
    }

    if (!Array.isArray(condition.value)) {
        return false;
    }

    return condition.value.includes(currentValue as string | boolean);
}

export function evaluateShowIf(
    onboarding: OnboardingState,
    conditions: Condition[],
): boolean {
    return conditions.every((condition) => evaluateCondition(onboarding, condition));
}

export function getVisibleOnboardingQuestions(
    onboarding: OnboardingState,
): OnboardingQuestion[] {
    return onboardingQuestions.filter((question) =>
        evaluateShowIf(onboarding, question.showIf),
    );
}

export function getVisibleQuestionnaireQuestions(
    onboarding: OnboardingState,
): QuestionnaireQuestion[] {
    return questionnaireQuestions.filter((question) => {
        const selectedMode = onboarding.mode ?? defaultOnboardingState.mode ?? "quick";

        return (
            question.modes.includes(selectedMode) &&
            evaluateShowIf(onboarding, question.showIf)
        );
    });
}

export function getVisibleAreas(onboarding: OnboardingState) {
    const visibleAreaIds = new Set(
        getVisibleQuestionnaireQuestions(onboarding).map((question) => question.area),
    );

    return questionnaireAreas.filter((area) => visibleAreaIds.has(area.id));
}

export function getOnboardingProgress(onboarding: OnboardingState) {
    const visibleQuestions = getVisibleOnboardingQuestions(onboarding);
    const answeredCount = visibleQuestions.filter((question) => {
        const value = onboarding[question.id];
        return value !== null;
    }).length;

    return {
        answeredCount,
        totalCount: visibleQuestions.length,
    };
}

export function calculateResults(
    questions: QuestionnaireQuestion[],
    answers: QuestionnaireAnswers,
): RelationshipResults {
    const areaResults = questionnaireAreas
        .map((area) => {
            const areaQuestions = questions.filter((question) => question.area === area.id);
            const answeredQuestions = areaQuestions.filter(
                (question) => answers[question.id] !== undefined,
            );

            if (areaQuestions.length === 0 || answeredQuestions.length === 0) {
                return null;
            }

            const obtainedWeighted = answeredQuestions.reduce((sum, question) => {
                return sum + (answers[question.id] ?? 0) * question.weight;
            }, 0);
            const maxWeighted = answeredQuestions.reduce(
                (sum, question) => sum + 5 * question.weight,
                0,
            );
            const totalWeight = answeredQuestions.reduce(
                (sum, question) => sum + question.weight,
                0,
            );
            const average = obtainedWeighted / totalWeight;
            const score = Math.round((obtainedWeighted / maxWeighted) * 100);

            return {
                areaId: area.id,
                score,
                average: Number(average.toFixed(1)),
                answered: answeredQuestions.length,
                maxWeighted,
                obtainedWeighted,
            };
        })
        .filter((result): result is AreaResult => result !== null);

    const answeredQuestions = questions.filter(
        (question) => answers[question.id] !== undefined,
    );
    const obtainedWeighted = answeredQuestions.reduce((sum, question) => {
        return sum + (answers[question.id] ?? 0) * question.weight;
    }, 0);
    const maxWeighted = answeredQuestions.reduce(
        (sum, question) => sum + 5 * question.weight,
        0,
    );
    const totalWeight = answeredQuestions.reduce(
        (sum, question) => sum + question.weight,
        0,
    );
    const totalScore = maxWeighted === 0 ? 0 : Math.round((obtainedWeighted / maxWeighted) * 100);
    const totalAverage = totalWeight === 0 ? 0 : Number((obtainedWeighted / totalWeight).toFixed(1));
    const strongestAreas = [...areaResults]
        .sort((left, right) => right.score - left.score)
        .slice(0, 3);
    const weakestAreas = [...areaResults].sort((left, right) => left.score - right.score).slice(0, 3);
    const weakAreas = [...areaResults]
        .filter(
            (area) =>
                area.score < WEAK_THRESHOLD ||
                (criticalAreaIds.has(area.areaId) && area.score < CRITICAL_WEAK_THRESHOLD),
        )
        .sort((left, right) => left.score - right.score);
    const warningAreas = [...areaResults]
        .filter(
            (area) =>
                area.score < WARNING_THRESHOLD ||
                (criticalAreaIds.has(area.areaId) && area.score < CRITICAL_WARNING_THRESHOLD),
        )
        .sort((left, right) => left.score - right.score);
    const criticalWeakCount = weakAreas.filter((area) => criticalAreaIds.has(area.areaId)).length;
    const criticalWarningCount = warningAreas.filter((area) => criticalAreaIds.has(area.areaId)).length;
    const criticalLowCount = areaResults.filter(
        (area) => criticalAreaIds.has(area.areaId) && area.score < WARNING_THRESHOLD,
    ).length;
    const severeLowCount = areaResults.filter((area) => area.score < 40).length;
    const safetyScore = areaResults.find((area) => area.areaId === "safetyRespect")?.score;
    const trustScore = areaResults.find((area) => area.areaId === "trustStability")?.score;
    const weakestScore = weakestAreas[0]?.score ?? 100;

    let outcomeBucket: OutcomeBucket = "limited test of change needed";

    if (
        totalScore < 48 ||
        severeLowCount >= 2 ||
        criticalWarningCount >= 2 ||
        criticalLowCount >= 3 ||
        (safetyScore !== undefined && safetyScore < 42) ||
        (trustScore !== undefined && trustScore < 42)
    ) {
        outcomeBucket = "likely long-term unsustainable without major change";
    } else if (
        totalScore >= TOP_BUCKET_SCORE_THRESHOLD &&
        totalAverage >= 3.8 &&
        warningAreas.length === 0 &&
        criticalWeakCount <= 1 &&
        weakestScore >= 58
    ) {
        outcomeBucket = "relationship stands on strong foundations";
    }

    return {
        totalScore,
        totalAverage,
        answeredQuestions: answeredQuestions.length,
        areaResults,
        strongestAreas,
        weakestAreas,
        weakAreas,
        warningAreas,
        outcomeBucket,
    };
}