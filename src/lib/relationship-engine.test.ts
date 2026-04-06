import assert from "node:assert/strict";
import test from "node:test";
import {
    defaultOnboardingState,
    type AreaId,
    type OnboardingState,
    type ScaleValue,
} from "./relationship-data";
import {
    calculateResults,
    getVisibleQuestionnaireQuestions,
    type QuestionnaireAnswers,
} from "./relationship-engine";
import { buildResultNarrative } from "./result-narratives";

const fullRelationshipOnboarding: OnboardingState = {
    ...defaultOnboardingState,
    duration: "3to7",
    livingTogether: true,
    hasChildren: true,
    childrenType: "ours",
    sharedFinances: true,
    mode: "deep",
};

const visibleQuestions = getVisibleQuestionnaireQuestions(fullRelationshipOnboarding);

function buildAnswers(
    resolver: ScaleValue | ((areaId: AreaId, index: number) => ScaleValue),
): QuestionnaireAnswers {
    return Object.fromEntries(
        visibleQuestions.map((question, index) => {
            const value = typeof resolver === "function" ? resolver(question.area, index) : resolver;

            return [question.id, value];
        }),
    );
}

function expectPositiveTopBucket(results: ReturnType<typeof calculateResults>) {
    assert.equal(results.outcomeBucket, "relationship stands on strong foundations");
    assert.equal(results.warningAreas.length, 0);
    assert.ok(results.strongestAreas.length >= 1);
    assert.equal(
        new Set(results.strongestAreas.map((area) => area.areaId)).size,
        results.strongestAreas.length,
    );
}

test("all 5 answers stay in the top positive bucket with calm narratives", () => {
    const results = calculateResults(visibleQuestions, buildAnswers(5));
    const narrative = buildResultNarrative("en", results);

    expectPositiveTopBucket(results);
    assert.equal(results.totalScore, 100);
    assert.match(narrative.bucketLabel, /strong foundations/i);
    assert.match(narrative.holds, /strong foundations/i);
    assert.match(narrative.next, /keep caring for this relationship/i);
    assert.doesNotMatch(narrative.weakens, /collapse|repair attempt|crisis/i);
    assert.doesNotMatch(narrative.warning, /major change|unsustainable|red flag/i);
});

test("mostly 4 and 5 answers with no red flags stay clearly positive", () => {
    const results = calculateResults(
        visibleQuestions,
        buildAnswers((_, index) => (index % 3 === 0 ? 5 : 4)),
    );
    const narrative = buildResultNarrative("en", results);

    expectPositiveTopBucket(results);
    assert.ok(results.totalScore >= 80);
    assert.ok(results.strongestAreas[0].score >= 80);
    assert.match(narrative.holds, /trust|working patterns|confidence/i);
    assert.match(narrative.next, /keep caring for this relationship/i);
    assert.doesNotMatch(narrative.weakens, /major threat|collapse|repair attempt/i);
});

test("generally healthy relationship with one mildly weaker area stays positive without dramatizing warnings", () => {
    const results = calculateResults(
        visibleQuestions,
        buildAnswers((areaId, index) => {
            if (areaId === "finances") {
                return 3;
            }

            return index % 4 === 0 ? 5 : 4;
        }),
    );
    const narrative = buildResultNarrative("en", results);

    expectPositiveTopBucket(results);
    assert.equal(results.weakAreas.length, 0);
    assert.equal(results.weakestAreas[0]?.areaId, "finances");
    assert.match(narrative.weakAreas, /more delicate areas right now are finances/i);
    assert.match(narrative.weakens, /normal places for ongoing care/i);
    assert.match(narrative.warning, /Nothing here currently reads as a sharp warning sign on its own/i);
    assert.doesNotMatch(narrative.next, /test of change|repair attempt|major change/i);
});