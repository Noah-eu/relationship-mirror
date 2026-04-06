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
  weakestAreas: AreaResult[];
  interpretationKey: "strong" | "promising" | "mixed" | "fragile";
};

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
  const weakestAreas = [...areaResults].sort((left, right) => left.score - right.score).slice(0, 3);

  let interpretationKey: RelationshipResults["interpretationKey"] = "fragile";

  if (totalScore >= 80) {
    interpretationKey = "strong";
  } else if (totalScore >= 67) {
    interpretationKey = "promising";
  } else if (totalScore >= 52) {
    interpretationKey = "mixed";
  }

  return {
    totalScore,
    totalAverage,
    answeredQuestions: answeredQuestions.length,
    areaResults,
    weakestAreas,
    interpretationKey,
  };
}