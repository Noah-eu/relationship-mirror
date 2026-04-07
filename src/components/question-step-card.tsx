'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type StepOption = {
    key: string;
    label: string;
    hint?: string;
    selected: boolean;
    onSelect: () => void;
};

type QuestionStepCardProps = {
    stepKey?: string;
    progressLabel: string;
    progressCurrent: number;
    progressTotal: number;
    questionLabel: string;
    questionText: string;
    clarifier?: string;
    sectionLabel?: string;
    sectionDescription?: string;
    compactDetailsLabel?: string;
    options: StepOption[];
    optionsClassName: string;
    compactOptionsClassName?: string;
    backLabel: string;
    nextLabel: string;
    onBack: () => void;
    onNext: () => void;
    canGoBack: boolean;
    canGoNext: boolean;
    autoAdvance?: boolean;
    footer?: (context: { isCompact: boolean }) => ReactNode;
};

export default function QuestionStepCard({
    stepKey,
    progressLabel,
    progressCurrent,
    progressTotal,
    questionLabel,
    questionText,
    clarifier,
    sectionLabel,
    sectionDescription,
    compactDetailsLabel,
    options,
    optionsClassName,
    compactOptionsClassName,
    backLabel,
    nextLabel,
    onBack,
    onNext,
    canGoBack,
    canGoNext,
    autoAdvance = false,
    footer,
}: QuestionStepCardProps) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [isCompact, setIsCompact] = useState(false);
    const progressWidth =
        progressTotal > 0 ? Math.max((progressCurrent / progressTotal) * 100, 4) : 0;
    const contentLengthScore = useMemo(
        () =>
            questionText.length +
            (clarifier?.length ?? 0) +
            (sectionDescription?.length ?? 0) +
            options.reduce(
                (total, option) => total + option.label.length + (option.hint?.length ?? 0),
                0,
            ),
        [clarifier, options, questionText, sectionDescription],
    );

    useEffect(() => {
        const section = sectionRef.current;

        if (!section || typeof window === "undefined") {
            return;
        }

        const measureDensity = () => {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const topOffset = Math.max(rect.top, 0);
            const availableHeight = Math.max(viewportHeight - topOffset - 12, 0);
            const viewportShort = viewportHeight <= 780;
            const denseContent = contentLengthScore >= 360 || options.length >= 6;
            const overflowRisk = rect.height > availableHeight;
            const nextCompact = viewportShort || overflowRisk || (viewportHeight <= 900 && denseContent);

            setIsCompact((previous) => (previous === nextCompact ? previous : nextCompact));
        };

        measureDensity();

        const resizeObserver = new ResizeObserver(() => {
            measureDensity();
        });

        resizeObserver.observe(section);
        window.addEventListener("resize", measureDensity);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", measureDensity);
        };
    }, [contentLengthScore, options.length]);

    const resolvedOptionsClassName = isCompact && compactOptionsClassName
        ? compactOptionsClassName
        : optionsClassName;

    return (
        <section
            ref={sectionRef}
            id={stepKey}
            className={`border border-[var(--stroke)] bg-[linear-gradient(135deg,rgba(245,243,238,0.96),rgba(255,255,255,0.94))] shadow-[0_22px_56px_rgba(72,64,49,0.12)] ${
                isCompact
                    ? "rounded-[24px] p-3.5 sm:p-4"
                    : "rounded-[28px] p-4 sm:p-5 lg:p-6"
            }`}
        >
            <div className={`flex flex-col ${isCompact ? "gap-3" : "gap-4"}`}>
                <div className={isCompact ? "space-y-2" : "space-y-3"}>
                    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isCompact ? "gap-1.5" : "gap-2"}`}>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                            {progressLabel}
                        </p>
                        <p className="text-xs font-medium text-[var(--muted-foreground)] sm:text-sm">
                            {progressCurrent}/{progressTotal}
                        </p>
                    </div>
                    <div className={`overflow-hidden rounded-full bg-white/80 ${isCompact ? "h-1" : "h-1.5"}`}>
                        <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent)_0%,var(--accent-strong)_100%)] transition-[width] duration-300"
                            style={{ width: `${progressWidth}%` }}
                        />
                    </div>
                </div>

                <div className={isCompact ? "space-y-2" : "space-y-2.5"}>
                    {sectionLabel ? (
                        <div className={`inline-flex rounded-full border border-[var(--stroke)] bg-white/80 font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)] ${
                            isCompact ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-[11px]"
                        }`}>
                            {sectionLabel}
                        </div>
                    ) : null}
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)] sm:text-xs">
                        {questionLabel}
                    </p>
                    <h2 className={`max-w-3xl font-semibold text-[var(--foreground)] ${
                        isCompact
                            ? "text-lg leading-snug sm:text-xl lg:text-[1.6rem]"
                            : "text-xl leading-snug sm:text-2xl lg:text-[1.75rem]"
                    }`}>
                        {questionText}
                    </h2>
                    {clarifier ? (
                        <p className={`max-w-3xl text-[var(--muted-foreground)] ${
                            isCompact
                                ? "text-[13px] leading-5 sm:text-sm sm:leading-5"
                                : "text-sm leading-6 sm:text-[15px] sm:leading-6"
                        }`}>
                            {clarifier}
                        </p>
                    ) : null}
                    {sectionDescription ? (
                        isCompact ? (
                            <details className="rounded-[16px] border border-[var(--stroke)] bg-white/72 px-3 py-2 text-xs leading-5 text-[var(--muted-foreground)]">
                                <summary className="cursor-pointer list-none font-semibold text-[var(--foreground)]">
                                    {compactDetailsLabel}
                                </summary>
                                <p className="mt-1.5">{sectionDescription}</p>
                            </details>
                        ) : (
                            <p className="max-w-3xl text-xs leading-5 text-[var(--muted-foreground)] sm:text-sm sm:leading-5">
                                {sectionDescription}
                            </p>
                        )
                    ) : null}
                </div>

                <div className={resolvedOptionsClassName}>
                    {options.map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            onClick={option.onSelect}
                            className={`flex min-h-[72px] flex-col justify-center rounded-[18px] border text-left transition ${
                                isCompact
                                    ? "gap-1.5 px-2.5 py-2 sm:min-h-[68px]"
                                    : "gap-2 px-3 py-3 sm:min-h-[80px]"
                            } ${
                                option.selected
                                    ? "border-[var(--accent-strong)] bg-white shadow-[0_18px_40px_rgba(76,96,88,0.12)]"
                                    : "border-[var(--stroke)] bg-white/70 hover:bg-white"
                            }`}
                        >
                            <div className={`flex items-start justify-between ${isCompact ? "gap-2" : "gap-2.5"}`}>
                                <p className={`font-semibold text-[var(--foreground)] ${
                                    isCompact ? "text-sm leading-5 sm:text-[15px]" : "text-[15px] leading-5 sm:text-base"
                                }`}>
                                    {option.label}
                                </p>
                            </div>
                            {option.hint ? (
                                <p className={`text-[var(--muted-foreground)] ${
                                    isCompact
                                        ? "text-[11px] leading-4 sm:text-xs sm:leading-4"
                                        : "text-xs leading-5 sm:text-[13px] sm:leading-5"
                                }`}>
                                    {option.hint}
                                </p>
                            ) : null}
                        </button>
                    ))}
                </div>

                {footer ? footer({ isCompact }) : null}

                <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isCompact ? "gap-2" : "gap-2.5"}`}>
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={!canGoBack}
                        className={`inline-flex items-center justify-center rounded-full border border-[var(--stroke)] bg-white font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel-soft)] disabled:cursor-not-allowed disabled:border-[var(--stroke)] disabled:bg-white/60 disabled:text-[var(--muted-foreground)] ${
                            isCompact ? "px-4 py-2 text-xs sm:text-sm" : "px-5 py-2.5 text-sm"
                        }`}
                    >
                        {backLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onNext}
                        disabled={!canGoNext}
                        className={`inline-flex items-center justify-center rounded-full font-semibold transition disabled:cursor-not-allowed disabled:border-[var(--stroke)] disabled:bg-white/60 disabled:text-[var(--muted-foreground)] ${
                            autoAdvance
                                ? `border border-[var(--stroke)] bg-white text-[var(--foreground)] hover:bg-[var(--panel-soft)] ${
                                    isCompact ? "px-4 py-2 text-xs sm:text-sm" : "px-5 py-2.5 text-sm"
                                }`
                                : `bg-[var(--accent-strong)] text-white hover:bg-[var(--accent)] ${
                                    isCompact ? "px-4 py-2 text-xs sm:text-sm" : "px-5 py-2.5 text-sm"
                                }`
                        }`}
                    >
                        {nextLabel}
                    </button>
                </div>
            </div>
        </section>
    );
}