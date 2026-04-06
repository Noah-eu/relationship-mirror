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
        strongestLead: "Nejpevněji se teď vztah opírá o",
        relativeWeakLead: "Relativně jemnější místa jsou",
        actualWeakLead: "Víc pozornosti si teď zaslouží",
        warningLead: "Skutečné varování se teď ukazuje v",
        weakestPanelSoft: "Oblasti pro průběžnou péči",
        weakestPanelHard: "Oblasti, které potřebují víc pozornosti",
        buckets: {
            "relationship stands on strong foundations": {
                label: "Vztah stojí na pevných pilířích",
                holds:
                    "Tenhle výsledek ukazuje vztah, který stojí na pevných pilířích. Je v něm dost opory, důvěry a funkčních vzorců, na kterých se dá dál klidně stavět.",
                weakensSoft:
                    "I v dobrém vztahu bývají oblasti, které jsou jen o něco citlivější než zbytek. Tady jde právě o taková běžná místa pro průběžnou péči.",
                weakensReal:
                    "Jedna nebo dvě oblasti si zaslouží víc pozornosti než zbytek, ale celkový obraz zůstává zdravý a důvěryhodný. Vyplatí se jim dát včasnou péči, aby si vztah udržel současnou pevnost.",
                warningSoft:
                    "Teď se tu neukazuje nic, co by samo o sobě působilo jako výrazné varování.",
                warningReal:
                    "Výsledek zůstává celkově dobrý, ale tyto oblasti už stojí za vědomější hlídání, aby se v nich nezačalo usazovat napětí.",
                next:
                    "Dává smysl o tenhle vztah dál pečovat průběžně: držet to, co funguje, a drobnější tření řešit včas, než ztěžkne.",
            },
            "limited test of change needed": {
                label: "Je potřeba omezený, ale skutečný test změny",
                holds:
                    "Ve vztahu je pořád něco, o co se dá opřít, ale samo to už nestačí nést celý obraz bez další změny.",
                weakensSoft:
                    "Některá místa jsou citlivější než ostatní a je vidět, že se přes ně do vztahu dostává únava.",
                weakensReal:
                    "Slabší oblasti už zasahují do běžného fungování a nejde je brát jen jako drobný výkyv nebo špatné období.",
                warningSoft:
                    "Největší riziko je, že se o změně bude mluvit, ale v běžném provozu se nic podstatného neposune.",
                warningReal:
                    "Varovné je hlavně to, že bez konkrétní změny se současný tlak může dál vracet a postupně ubírat vztahu nosnost.",
                next:
                    "Teď dává smysl krátký a konkrétní test změny: vyjasnit si co se má změnit, dokdy a podle čeho poznáš, že se to opravdu děje.",
            },
            "likely long-term unsustainable without major change": {
                label: "Bez větší změny je tenhle vztah nejspíš dlouhodobě neudržitelný",
                holds:
                    "Něco dobrého tu může pořád být, ale samo to teď zřejmě nestačí na pocit bezpečí a dlouhodobé opory.",
                weakensSoft:
                    "I tam, kde ještě něco funguje, už je vztah pod tlakem, který snižuje jeho nosnost.",
                weakensReal:
                    "Slabá místa už nejsou jen okrajová. Zasahují do základů vztahu a berou mu sílu v běžném fungování.",
                warningSoft:
                    "Tady už nejde jen o jemnější péči, ale o potřebu dívat se velmi poctivě na realitu.",
                warningReal:
                    "Varovné je hlavně to, že bez větší a viditelné změny se stejný tlak bude nejspíš vracet a dál vyčerpávat oba.",
                next:
                    "Teď je důležité dívat se víc na realitu než na naději, že se to časem samo zlomí. Pokud má vztah ještě dostat šanci, bude potřebovat větší a viditelnou změnu.",
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