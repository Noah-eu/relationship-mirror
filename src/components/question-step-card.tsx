'use client';

import type { ReactNode } from "react";

type StepOption = {
    key: string;
    label: string;
    hint?: string;
    selected: boolean;
    onSelect: () => void;
};

type QuestionStepCardProps = {
    progressLabel: string;
    progressCurrent: number;
    progressTotal: number;
    questionLabel: string;
    questionText: string;
    clarifier?: string;
    sectionLabel?: string;
    sectionDescription?: string;
    options: StepOption[];
    optionsClassName: string;
    backLabel: string;
    nextLabel: string;
    onBack: () => void;
    onNext: () => void;
    canGoBack: boolean;
    canGoNext: boolean;
    footer?: ReactNode;
};

export default function QuestionStepCard({
    progressLabel,
    progressCurrent,
    progressTotal,
    questionLabel,
    questionText,
    clarifier,
    sectionLabel,
    sectionDescription,
    options,
    optionsClassName,
    backLabel,
    nextLabel,
    onBack,
    onNext,
    canGoBack,
    canGoNext,
    footer,
}: QuestionStepCardProps) {
    const progressWidth =
        progressTotal > 0 ? Math.max((progressCurrent / progressTotal) * 100, 4) : 0;

    return (
        <section className="rounded-[30px] border border-[var(--stroke)] bg-[linear-gradient(135deg,rgba(245,243,238,0.96),rgba(255,255,255,0.94))] p-6 sm:p-8">
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                            {progressLabel}
                        </p>
                        <p className="text-sm font-medium text-[var(--muted-foreground)]">
                            {progressCurrent}/{progressTotal}
                        </p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/80">
                        <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent)_0%,var(--accent-strong)_100%)] transition-[width] duration-300"
                            style={{ width: `${progressWidth}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    {sectionLabel ? (
                        <div className="rounded-full border border-[var(--stroke)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
                            {sectionLabel}
                        </div>
                    ) : null}
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                        {questionLabel}
                    </p>
                    <h2 className="max-w-3xl text-2xl font-semibold leading-tight text-[var(--foreground)] sm:text-3xl">
                        {questionText}
                    </h2>
                    {clarifier ? (
                        <p className="max-w-3xl text-base leading-7 text-[var(--muted-foreground)]">
                            {clarifier}
                        </p>
                    ) : null}
                    {sectionDescription ? (
                        <p className="max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
                            {sectionDescription}
                        </p>
                    ) : null}
                </div>

                <div className={optionsClassName}>
                    {options.map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            onClick={option.onSelect}
                            className={`rounded-[24px] border px-4 py-4 text-left transition ${
                                option.selected
                                    ? "border-[var(--accent-strong)] bg-white shadow-[0_18px_40px_rgba(76,96,88,0.12)]"
                                    : "border-[var(--stroke)] bg-white/70 hover:bg-white"
                            }`}
                        >
                            <p className="text-base font-semibold text-[var(--foreground)]">
                                {option.label}
                            </p>
                            {option.hint ? (
                                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                                    {option.hint}
                                </p>
                            ) : null}
                        </button>
                    ))}
                </div>

                {footer ? footer : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={!canGoBack}
                        className="inline-flex items-center justify-center rounded-full border border-[var(--stroke)] bg-white px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel-soft)] disabled:cursor-not-allowed disabled:border-[var(--stroke)] disabled:bg-white/60 disabled:text-[var(--muted-foreground)]"
                    >
                        {backLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onNext}
                        disabled={!canGoNext}
                        className="inline-flex items-center justify-center rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:bg-[var(--muted)] disabled:text-[var(--muted-foreground)]"
                    >
                        {nextLabel}
                    </button>
                </div>
            </div>
        </section>
    );
}