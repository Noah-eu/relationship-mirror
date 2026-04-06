# Relationship Mirror / Vztah pod lupou

Frontend-only MVP built with Next.js, TypeScript, and Tailwind CSS.

The app provides a bilingual CZ/EN flow with four screens:

- Landing page
- Onboarding page
- Questionnaire page
- Results page

## Core MVP behavior

- CZ / EN toggle is available from the start.
- Onboarding decides which sections and questions are shown.
- Questions are defined in a data structure, not hardcoded in JSX.
- Each questionnaire item has `id`, `area`, `textCZ`, `textEN`, `weight`, and `showIf` conditions.
- Answers use a 1 to 5 scale where higher scores lean more toward preserving the relationship.
- Results include total score, area scores, a simple interpretation, and the weakest areas.

## Adaptive logic included

- No children: hides `děti a rodina / children and family`.
- Not living together: hides `domácnost / household`.
- No shared finances: keeps only the general finance prompts.
- `quick` mode shows the core set.
- `deep` mode adds extra prompts across areas.

## Project structure

- `src/app`: App Router pages for landing, onboarding, questionnaire, and results.
- `src/components`: UI shell, state provider, and page-level screen components.
- `src/lib/relationship-data.ts`: onboarding configuration, area definitions, and question bank.
- `src/lib/relationship-engine.ts`: adaptive filtering and score calculation.

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000` in the browser.

## Validation

Use the standard checks:

```bash
npm run lint
npm run build
```
