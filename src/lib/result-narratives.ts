import { questionnaireAreas } from "@/lib/relationship-data";
import type { AreaResult, OutcomeBucket, RelationshipResults } from "@/lib/relationship-engine";

export type NarrativeLanguage = "cz" | "en";

export type ResultNarrative = {
    bucketLabel: string;
    weakestPanelTitle: string;
    holds: string;
    weakens: string;
    warning: string;
    next: string;
    supportAreas: string;
    weakAreas: string;
    warningAreas: string;
};

type BucketText = Record<
    OutcomeBucket,
    {
        label: string;
        holds: string;
        weakensSoft: string;
        weakensReal: string;
        warningSoft: string;
        warningReal: string;
        next: string;
    }
>;

const narrativeCopy: Record<
    NarrativeLanguage,
    {
        strongestLead: string;
        relativeWeakLead: string;
        actualWeakLead: string;
        warningLead: string;
        weakestPanelSoft: string;
        weakestPanelHard: string;
        buckets: BucketText;
    }
> = {
    cz: {
        strongestLead: "Nejvíc vás teď drží",
        relativeWeakLead: "Citlivější místa jsou teď hlavně",
        actualWeakLead: "Víc pozornosti si teď zaslouží",
        warningLead: "Pozor je teď hlavně potřeba v",
        weakestPanelSoft: "Místa pro průběžnou péči",
        weakestPanelHard: "Místa, která potřebují víc péče",
        buckets: {
            "relationship stands on strong foundations": {
                label: "Vztah stojí na pevných základech",
                holds:
                    "Tenhle výsledek ukazuje vztah, ve kterém je pořád dost opory, důvěry a fungujících návyků. Je na čem stavět dál.",
                weakensSoft:
                    "I v dobrém vztahu bývají místa, která jsou jen o něco citlivější než zbytek. Tady to zatím působí spíš jako běžná oblast, o kterou je dobré průběžně pečovat.",
                weakensReal:
                    "Jedna nebo dvě oblasti teď potřebují víc pozornosti než zbytek, ale celkový obraz zůstává zdravý a důvěryhodný. Když je nenecháte být, pomůže to udržet to, co už funguje.",
                warningSoft:
                    "Teď se tu neukazuje nic, co by samo o sobě působilo jako výrazné varování.",
                warningReal:
                    "Celkově to pořád vychází dobře, ale tady už stojí za to být pozornější, aby se nezačalo usazovat napětí.",
                next:
                    "Dává smysl dál pečovat o to, co funguje, a menší tření řešit včas, dokud je ještě lehké.",
            },
            "limited test of change needed": {
                label: "Vztah potřebuje menší, ale skutečnou změnu",
                holds:
                    "Ve vztahu je pořád něco, o co se dá opřít, ale samo to už nestačí, pokud se nic neposune.",
                weakensSoft:
                    "Některá místa jsou citlivější než ostatní a je vidět, že přes ně do vztahu proniká únava.",
                weakensReal:
                    "Slabší oblasti už zasahují do běžného fungování a nejde je brát jen jako drobný výkyv nebo špatné období.",
                warningSoft:
                    "Největší riziko je, že se o změně bude mluvit, ale v běžném fungování se nic důležitého neposune.",
                warningReal:
                    "Bez konkrétní změny se současný tlak může dál vracet a vztah dál oslabovat.",
                next:
                    "Teď dává smysl krátký a konkrétní test změny: ujasnit si, co se má změnit, dokdy a podle čeho poznáte, že se to opravdu děje.",
            },
            "likely long-term unsustainable without major change": {
                label: "Bez větší změny bude tenhle vztah nejspíš těžké dlouhodobě udržet",
                holds:
                    "Něco dobrého tu může pořád být, ale samo to teď zřejmě nestačí na pocit bezpečí a dlouhodobé opory.",
                weakensSoft:
                    "I tam, kde ještě něco funguje, je vztah pod tlakem, který mu bere lehkost a stabilitu.",
                weakensReal:
                    "Slabá místa už nejsou jen na okraji. Sahají do samotného základu vztahu a berou sílu běžnému fungování.",
                warningSoft:
                    "Tady už nejde jen o jemné dolaďování, ale o velmi poctivý pohled na to, jak věci opravdu jsou.",
                warningReal:
                    "Bez větší a viditelné změny se stejný tlak nejspíš bude vracet a dál vyčerpávat oba.",
                next:
                    "Teď je důležité dívat se víc na realitu než na naději, že se to samo zlomí. Pokud má vztah ještě dostat šanci, bude potřebovat větší a viditelnou změnu.",
            },
        },
    },
    en: {
        strongestLead: "The relationship is standing most firmly on",
        relativeWeakLead: "The more delicate areas right now are",
        actualWeakLead: "A bit more care is needed around",
        warningLead: "A genuine warning sign is showing up around",
        weakestPanelSoft: "Areas for ongoing care",
        weakestPanelHard: "Areas needing more attention",
        buckets: {
            "relationship stands on strong foundations": {
                label: "This relationship stands on strong foundations",
                holds:
                    "This result points to a relationship with strong foundations. There is enough steadiness, trust, and working patterns here to keep building on with confidence.",
                weakensSoft:
                    "Even strong relationships usually have areas that are simply a little more sensitive than the rest. Here they read more like normal places for ongoing care.",
                weakensReal:
                    "One or two areas deserve a bit more attention than the rest, but the overall picture still looks healthy and trustworthy. Timely care here helps protect the strength the relationship already has.",
                warningSoft:
                    "Nothing here currently reads as a sharp warning sign on its own.",
                warningReal:
                    "The overall picture is still good, but these areas are worth watching more consciously so strain does not begin to settle there.",
                next:
                    "It makes sense to keep caring for this relationship as you go: protect what already works and address smaller frictions before they grow heavier.",
            },
            "limited test of change needed": {
                label: "Limited test of change needed",
                holds:
                    "There is still something here to build on, but it is no longer enough to carry the whole picture without further change.",
                weakensSoft:
                    "Some areas are more sensitive than others, and you can already see strain coming through them into daily life.",
                weakensReal:
                    "The weaker areas are already affecting ordinary life and cannot really be treated as a small passing issue.",
                warningSoft:
                    "The main risk is spending a long time talking about change while everyday behavior barely shifts.",
                warningReal:
                    "What is warning here is that without concrete movement, the same pressure is likely to keep returning and wearing the relationship down.",
                next:
                    "What makes sense now is a short, concrete test of change: be clear about what needs to change, by when, and how you will know it is real.",
            },
            "likely long-term unsustainable without major change": {
                label: "Likely long-term unsustainable without major change",
                holds:
                    "There may still be something good here, but it likely is not enough right now to create steady safety and support.",
                weakensSoft:
                    "Even where something still works, the relationship is under pressure that is reducing its capacity to hold.",
                weakensReal:
                    "The weak areas are no longer peripheral. They are reaching into the core of the relationship and affecting daily functioning.",
                warningSoft:
                    "This is no longer just about lighter care. It calls for a very honest look at reality.",
                warningReal:
                    "The clearest warning is that without major and visible change, the same pressure will probably keep returning and draining both people further.",
                next:
                    "What matters now is reality more than hope that things will somehow turn around later. If this relationship is to have a chance, it will need meaningful and visible change.",
            },
        },
    },
};

function getAreaLabel(areaId: AreaResult["areaId"], language: NarrativeLanguage) {
    const definition = questionnaireAreas.find((item) => item.id === areaId);

    if (!definition) {
        return "";
    }

    return language === "cz" ? definition.titleCZ.toLowerCase() : definition.titleEN.toLowerCase();
}

function joinLabels(labels: string[], language: NarrativeLanguage) {
    if (labels.length === 0) {
        return "";
    }

    if (labels.length === 1) {
        return labels[0];
    }

    if (labels.length === 2) {
        return `${labels[0]} ${language === "cz" ? "a" : "and"} ${labels[1]}`;
    }

    return `${labels.slice(0, -1).join(", ")} ${language === "cz" ? "a" : "and"} ${labels.at(-1)}`;
}

function getAreaSentence(
    areas: AreaResult[],
    language: NarrativeLanguage,
    lead: string,
) {
    if (areas.length === 0) {
        return "";
    }

    const labels = joinLabels(
        areas.map((area) => getAreaLabel(area.areaId, language)).filter(Boolean),
        language,
    );

    if (!labels) {
        return "";
    }

    return `${lead} ${labels}.`;
}

export function buildResultNarrative(
    language: NarrativeLanguage,
    results: RelationshipResults,
): ResultNarrative {
    const copy = narrativeCopy[language];
    const bucket = copy.buckets[results.outcomeBucket];
    const useActualWeakAreas = results.weakAreas.length > 0;
    const displayedWeakAreas = (useActualWeakAreas ? results.weakAreas : results.weakestAreas).slice(0, 2);

    return {
        bucketLabel: bucket.label,
        weakestPanelTitle: useActualWeakAreas ? copy.weakestPanelHard : copy.weakestPanelSoft,
        holds: bucket.holds,
        weakens: useActualWeakAreas ? bucket.weakensReal : bucket.weakensSoft,
        warning: results.warningAreas.length > 0 ? bucket.warningReal : bucket.warningSoft,
        next: bucket.next,
        supportAreas: getAreaSentence(results.strongestAreas.slice(0, 2), language, copy.strongestLead),
        weakAreas: getAreaSentence(
            displayedWeakAreas,
            language,
            useActualWeakAreas ? copy.actualWeakLead : copy.relativeWeakLead,
        ),
        warningAreas: getAreaSentence(results.warningAreas.slice(0, 2), language, copy.warningLead),
    };
}