'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  defaultOnboardingState,
  type Language,
  type OnboardingField,
  type OnboardingState,
  type QuestionAnswerValue,
} from "@/lib/relationship-data";
import {
  calculateResults,
  getOnboardingProgress,
  getVisibleAreas,
  getVisibleOnboardingQuestions,
  getVisibleQuestionnaireQuestions,
  type QuestionnaireAnswers,
} from "@/lib/relationship-engine";

type RelationshipContextValue = {
  language: Language;
  onboarding: OnboardingState;
  answers: QuestionnaireAnswers;
  visibleOnboardingQuestions: ReturnType<typeof getVisibleOnboardingQuestions>;
  visibleQuestions: ReturnType<typeof getVisibleQuestionnaireQuestions>;
  visibleAreas: ReturnType<typeof getVisibleAreas>;
  onboardingComplete: boolean;
  questionnaireComplete: boolean;
  onboardingProgress: ReturnType<typeof getOnboardingProgress>;
  results: ReturnType<typeof calculateResults>;
  setLanguage: (language: Language) => void;
  setOnboardingAnswer: (
    field: OnboardingField,
    value: string | boolean,
  ) => void;
  setQuestionAnswer: (questionId: string, value: QuestionAnswerValue) => void;
  resetAnswers: () => void;
  restartAll: () => void;
};

const STORAGE_KEY = "relationship-mirror-state-v1";

const RelationshipContext = createContext<RelationshipContextValue | null>(null);

export function RelationshipProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("cz");
  const [onboarding, setOnboarding] = useState<OnboardingState>(
    defaultOnboardingState,
  );
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const rawState = window.localStorage.getItem(STORAGE_KEY);

    if (!rawState) {
      setHasLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(rawState) as {
        language?: Language;
        onboarding?: OnboardingState;
        answers?: QuestionnaireAnswers;
      };

      if (parsed.language === "cz" || parsed.language === "en") {
        setLanguage(parsed.language);
      }

      if (parsed.onboarding) {
        setOnboarding({
          ...defaultOnboardingState,
          ...parsed.onboarding,
        });
      }

      if (parsed.answers) {
        setAnswers(parsed.answers);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  const visibleOnboardingQuestions = getVisibleOnboardingQuestions(onboarding);
  const visibleQuestions = getVisibleQuestionnaireQuestions(onboarding);
  const visibleAreas = getVisibleAreas(onboarding);
  const onboardingProgress = getOnboardingProgress(onboarding);
  const onboardingComplete =
    onboardingProgress.totalCount > 0 &&
    onboardingProgress.answeredCount === onboardingProgress.totalCount;
  const questionnaireComplete =
    visibleQuestions.length > 0 &&
    visibleQuestions.every((question) => answers[question.id] !== undefined);
  const results = calculateResults(visibleQuestions, answers);

  useEffect(() => {
    const visibleQuestionIds = new Set(visibleQuestions.map((question) => question.id));

    setAnswers((currentAnswers) => {
      const nextEntries = Object.entries(currentAnswers).filter(([questionId]) =>
        visibleQuestionIds.has(questionId),
      );

      if (nextEntries.length === Object.keys(currentAnswers).length) {
        return currentAnswers;
      }

      return Object.fromEntries(nextEntries);
    });
  }, [visibleQuestions]);

  useEffect(() => {
    const visibleOnboardingIds = new Set(
      visibleOnboardingQuestions.map((question) => question.id),
    );

    setOnboarding((currentOnboarding) => {
      let hasChanged = false;
      const nextOnboarding = { ...currentOnboarding };

      if (!visibleOnboardingIds.has("childrenType") && nextOnboarding.childrenType !== null) {
        nextOnboarding.childrenType = null;
        hasChanged = true;
      }

      return hasChanged ? nextOnboarding : currentOnboarding;
    });
  }, [visibleOnboardingQuestions]);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ language, onboarding, answers }),
    );
  }, [answers, hasLoaded, language, onboarding]);

  function setOnboardingAnswer(field: OnboardingField, value: string | boolean) {
    setOnboarding((currentOnboarding) => {
      const nextOnboarding: OnboardingState = {
        ...currentOnboarding,
        [field]: value,
      } as OnboardingState;

      if (field === "hasChildren" && value === false) {
        nextOnboarding.childrenType = null;
      }

      return nextOnboarding;
    });
  }

  function setQuestionAnswer(questionId: string, value: QuestionAnswerValue) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: value,
    }));
  }

  function resetAnswers() {
    setAnswers({});
  }

  function restartAll() {
    setLanguage("cz");
    setOnboarding(defaultOnboardingState);
    setAnswers({});
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <RelationshipContext.Provider
      value={{
        language,
        onboarding,
        answers,
        visibleOnboardingQuestions,
        visibleQuestions,
        visibleAreas,
        onboardingComplete,
        questionnaireComplete,
        onboardingProgress,
        results,
        setLanguage,
        setOnboardingAnswer,
        setQuestionAnswer,
        resetAnswers,
        restartAll,
      }}
    >
      {children}
    </RelationshipContext.Provider>
  );
}

export function useRelationship() {
  const context = useContext(RelationshipContext);

  if (!context) {
    throw new Error("useRelationship must be used within RelationshipProvider.");
  }

  return context;
}