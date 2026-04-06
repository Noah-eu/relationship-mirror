import assert from "node:assert/strict";
import test from "node:test";
import {
    NOT_APPLICABLE,
    defaultOnboardingState,
    type OnboardingField,
    type OnboardingState,
} from "./relationship-data";
import {
    getVisibleOnboardingQuestions,
    getVisibleQuestionnaireQuestions,
    type QuestionnaireAnswers,
} from "./relationship-engine";
import {
    filterAnswersToVisibleQuestionIds,
    getAnsweredQuestionIds,
    getCurrentQuestionId,
    getFlowProgress,
    getNextQuestionId,
    getPreviousQuestionId,
    getQuestionIdAfterAnswer,
    sanitizeConditionalOnboardingFields,
} from "./question-flow";

function answerOnboarding(
    onboarding: OnboardingState,
    field: OnboardingField,
    value: string | boolean,
): OnboardingState {
    const nextOnboarding = {
        ...onboarding,
        [field]: value,
    } as OnboardingState;

    if (field === "hasChildren" && value === false) {
        nextOnboarding.childrenType = null;
    }

    return nextOnboarding;
}

test("regular onboarding and questionnaire flow advances through relevant questions in order", () => {
    let onboarding = { ...defaultOnboardingState };
    let visibleOnboarding = getVisibleOnboardingQuestions(onboarding);
    let onboardingIds = visibleOnboarding.map((question) => question.id);

    assert.deepEqual(onboardingIds, [
        "duration",
        "livingTogether",
        "hasChildren",
        "sharedFinances",
        "includeIntimacy",
        "mode",
    ]);
    assert.equal(
        getCurrentQuestionId(
            onboardingIds,
            null,
            getAnsweredQuestionIds(onboardingIds, onboarding, (value) => value !== null && value !== undefined),
        ),
        "duration",
    );

    onboarding = answerOnboarding(onboarding, "duration", "3to7");
    visibleOnboarding = getVisibleOnboardingQuestions(onboarding);
    onboardingIds = visibleOnboarding.map((question) => question.id);
    assert.equal(getQuestionIdAfterAnswer(onboardingIds, "duration"), "livingTogether");

    onboarding = answerOnboarding(onboarding, "livingTogether", true);
    onboarding = answerOnboarding(onboarding, "hasChildren", false);
    visibleOnboarding = getVisibleOnboardingQuestions(onboarding);
    onboardingIds = visibleOnboarding.map((question) => question.id);
    assert.ok(!onboardingIds.includes("childrenType"));

    onboarding = answerOnboarding(onboarding, "sharedFinances", true);
    onboarding = answerOnboarding(onboarding, "includeIntimacy", true);
    onboarding = answerOnboarding(onboarding, "mode", "quick");

    const visibleQuestions = getVisibleQuestionnaireQuestions(onboarding);
    const questionIds = visibleQuestions.map((question) => question.id);
    const answeredIds = getAnsweredQuestionIds(questionIds, {} as QuestionnaireAnswers);
    const progress = getFlowProgress(questionIds, null, answeredIds);

    assert.equal(progress.currentNumber, 1);
    assert.equal(questionIds[0], "foundation-1");
    assert.ok(questionIds.includes("sexual-1"));
});

test("going back and changing onboarding answers removes future questions and invalidates hidden answers", () => {
    let onboarding: OnboardingState = {
        ...defaultOnboardingState,
        duration: "3to7",
        livingTogether: true,
        hasChildren: true,
        childrenType: "ours",
        sharedFinances: true,
        includeIntimacy: true,
        mode: "deep",
    };
    const previousVisibleOnboardingIds = getVisibleOnboardingQuestions(onboarding).map(
        (question) => question.id,
    );
    const previousQuestionnaireIds = getVisibleQuestionnaireQuestions(onboarding).map(
        (question) => question.id,
    );

    assert.ok(previousVisibleOnboardingIds.includes("childrenType"));
    assert.ok(previousQuestionnaireIds.includes("sexual-1"));
    assert.ok(previousQuestionnaireIds.includes("children-1"));

    const resolvedBackTarget = getQuestionIdAfterAnswer(
        getVisibleOnboardingQuestions(
            answerOnboarding(onboarding, "hasChildren", false),
        ).map((question) => question.id),
        "hasChildren",
    );

    assert.equal(resolvedBackTarget, "sharedFinances");

    onboarding = answerOnboarding(onboarding, "hasChildren", false);
    onboarding = answerOnboarding(onboarding, "includeIntimacy", false);

    const visibleOnboardingIds = getVisibleOnboardingQuestions(onboarding).map(
        (question) => question.id,
    );
    const sanitizedOnboarding = sanitizeConditionalOnboardingFields(
        onboarding,
        visibleOnboardingIds,
    );

    assert.equal(sanitizedOnboarding.childrenType, null);

    const nextQuestionnaireIds = getVisibleQuestionnaireQuestions(sanitizedOnboarding).map(
        (question) => question.id,
    );
    const storedAnswers: QuestionnaireAnswers = {
        "foundation-1": 4,
        "children-1": 4,
        "sexual-1": 5,
    };
    const filteredAnswers = filterAnswersToVisibleQuestionIds(
        storedAnswers,
        nextQuestionnaireIds,
    );

    assert.ok(!nextQuestionnaireIds.includes("sexual-1"));
    assert.ok(!nextQuestionnaireIds.includes("children-1"));
    assert.deepEqual(filteredAnswers, { "foundation-1": 4 });
});

test("not-applicable answers count as answered for flow navigation", () => {
    const onboarding: OnboardingState = {
        ...defaultOnboardingState,
        duration: "3to7",
        livingTogether: true,
        hasChildren: false,
        sharedFinances: true,
        includeIntimacy: true,
        mode: "quick",
        childrenType: null,
    };
    const visibleQuestions = getVisibleQuestionnaireQuestions(onboarding);
    const questionIds = visibleQuestions.map((question) => question.id);
    const answers: QuestionnaireAnswers = {
        "foundation-1": 4,
        "sexual-1": NOT_APPLICABLE,
    };
    const answeredIds = getAnsweredQuestionIds(questionIds, answers);
    const currentQuestionId = getCurrentQuestionId(questionIds, "sexual-1", answeredIds);
    const progress = getFlowProgress(questionIds, currentQuestionId, answeredIds);
    const previousQuestionId = getPreviousQuestionId(
        questionIds,
        "sexual-1",
        answeredIds,
    );

    assert.ok(answeredIds.has("sexual-1"));
    assert.equal(progress.answeredCount, 2);
    assert.equal(getNextQuestionId(questionIds, "sexual-1", answeredIds), "sexual-2");
    assert.equal(previousQuestionId, questionIds[questionIds.indexOf("sexual-1") - 1]);
});

test("the last question in the flow leads directly to results", () => {
    const onboarding: OnboardingState = {
        ...defaultOnboardingState,
        duration: "3to7",
        livingTogether: true,
        hasChildren: false,
        sharedFinances: true,
        includeIntimacy: false,
        mode: "quick",
        childrenType: null,
    };
    const questionIds = getVisibleQuestionnaireQuestions(onboarding).map((question) => question.id);
    const lastQuestionId = questionIds.at(-1) ?? null;
    const answeredIds = getAnsweredQuestionIds(questionIds, {} as QuestionnaireAnswers);

    assert.notEqual(lastQuestionId, null);
    assert.equal(getQuestionIdAfterAnswer(questionIds, lastQuestionId as string), null);
    assert.equal(getNextQuestionId(questionIds, lastQuestionId, answeredIds), null);
});