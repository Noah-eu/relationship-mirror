export type Language = "cz" | "en";

export type Mode = "quick" | "deep";

export type ScaleValue = 1 | 2 | 3 | 4 | 5;

export const NOT_APPLICABLE = "na" as const;

export type QuestionAnswerValue = ScaleValue | typeof NOT_APPLICABLE;

export type AreaId =
    | "foundation"
    | "safetyRespect"
    | "communication"
    | "conflictRepair"
    | "trustStability"
    | "boundariesSpace"
    | "household"
    | "finances"
    | "partnershipIntimacy"
    | "sexualConnection"
    | "childrenFamily"
    | "decisionTruth";

export type ChildrenType = "mine" | "theirs" | "ours" | "blended";

export type RelationshipDuration = "lt1" | "1to3" | "3to7" | "7plus";

export type OnboardingField =
    | "duration"
    | "livingTogether"
    | "hasChildren"
    | "childrenType"
    | "sharedFinances"
    | "includeIntimacy"
    | "mode";

export type OnboardingState = {
    duration: RelationshipDuration | null;
    livingTogether: boolean | null;
    hasChildren: boolean | null;
    childrenType: ChildrenType | null;
    sharedFinances: boolean | null;
    includeIntimacy: boolean | null;
    mode: Mode | null;
};

export type Condition = {
    field: OnboardingField;
    operator: "equals" | "notEquals" | "in";
    value: string | boolean | Array<string | boolean>;
};

export type QuestionnaireArea = {
    id: AreaId;
    titleCZ: string;
    titleEN: string;
    descriptionCZ: string;
    descriptionEN: string;
};

export type OnboardingOption = {
    value: string | boolean;
    labelCZ: string;
    labelEN: string;
    hintCZ?: string;
    hintEN?: string;
};

export type OnboardingQuestion = {
    id: OnboardingField;
    textCZ: string;
    textEN: string;
    clarifierCZ: string;
    clarifierEN: string;
    options: OnboardingOption[];
    showIf: Condition[];
};

export type QuestionnaireQuestion = {
    id: string;
    area: AreaId;
    textCZ: string;
    textEN: string;
    clarifierCZ: string;
    clarifierEN: string;
    weight: number;
    showIf: Condition[];
    modes: Mode[];
    allowsNotApplicable?: boolean;
};

const option = (
    value: string | boolean,
    labelCZ: string,
    labelEN: string,
    hintCZ?: string,
    hintEN?: string,
): OnboardingOption => ({
    value,
    labelCZ,
    labelEN,
    hintCZ,
    hintEN,
});

const question = (
    id: string,
    area: AreaId,
    textCZ: string,
    textEN: string,
    clarifierCZ: string,
    clarifierEN: string,
    weight: number,
    showIf: Condition[] = [],
    modes: Mode[] = ["quick", "deep"],
    allowsNotApplicable = false,
): QuestionnaireQuestion => ({
    id,
    area,
    textCZ,
    textEN,
    clarifierCZ,
    clarifierEN,
    weight,
    showIf,
    modes,
    allowsNotApplicable,
});

export const defaultOnboardingState: OnboardingState = {
    duration: null,
    livingTogether: null,
    hasChildren: null,
    childrenType: null,
    sharedFinances: null,
    includeIntimacy: null,
    mode: null,
};

export const notApplicableLabels = {
    cz: "To se mě netýká",
    en: "This does not apply to me",
} as const;

export const questionnaireAreas: QuestionnaireArea[] = [
    {
        id: "foundation",
        titleCZ: "Základ vztahu",
        titleEN: "Relationship foundation",
        descriptionCZ: "Jestli ve vztahu pořád vidíš smysl, blízkost a společný směr.",
        descriptionEN: "Whether the relationship still feels meaningful, close, and headed in a shared direction.",
    },
    {
        id: "safetyRespect",
        titleCZ: "Psychické bezpečí a úcta",
        titleEN: "Emotional safety and respect",
        descriptionCZ: "Jestli se ve vztahu dá být sám nebo sama sebou bez strachu a ponižování.",
        descriptionEN: "Whether you can be yourself in the relationship without fear or humiliation.",
    },
    {
        id: "communication",
        titleCZ: "Komunikace",
        titleEN: "Communication",
        descriptionCZ: "Jak snadno se mezi vámi mluví o důležitých věcech.",
        descriptionEN: "How possible it feels to talk about important things.",
    },
    {
        id: "conflictRepair",
        titleCZ: "Konflikty a opravy",
        titleEN: "Conflict and repair",
        descriptionCZ: "Jak vypadají hádky a jestli se po nich dá vrátit zpět k sobě.",
        descriptionEN: "What conflict looks like and whether the relationship can come back together afterward.",
    },
    {
        id: "trustStability",
        titleCZ: "Důvěra a stabilita",
        titleEN: "Trust and stability",
        descriptionCZ: "Jestli se o vztah můžeš opřít a nemusíš být pořád ve střehu.",
        descriptionEN: "Whether the relationship feels dependable rather than something you have to keep guarding against.",
    },
    {
        id: "boundariesSpace",
        titleCZ: "Hranice a prostor pro sebe",
        titleEN: "Boundaries and personal space",
        descriptionCZ: "Jestli je ve vztahu místo pro blízkost i pro vlastní prostor.",
        descriptionEN: "Whether the relationship makes room for both closeness and personal space.",
    },
    {
        id: "household",
        titleCZ: "Domácnost",
        titleEN: "Household",
        descriptionCZ: "Jak se vám spolu žije v běžném provozu domova.",
        descriptionEN: "How everyday home life works between you.",
    },
    {
        id: "finances",
        titleCZ: "Finance",
        titleEN: "Finances",
        descriptionCZ: "Jak spolu žijete s penězi, výdaji a domluvou kolem nich.",
        descriptionEN: "How money, spending, and financial decisions are handled between you.",
    },
    {
        id: "partnershipIntimacy",
        titleCZ: "Partnerství a blízkost",
        titleEN: "Partnership and closeness",
        descriptionCZ: "Jestli mezi vámi zůstává teplo, blízkost a pocit, že jste tým.",
        descriptionEN: "Whether warmth, closeness, and a sense of team are still present.",
    },
    {
        id: "sexualConnection",
        titleCZ: "Intimita a sexuální blízkost",
        titleEN: "Intimacy and sexual connection",
        descriptionCZ: "Jestli je v téhle oblasti mezi vámi bezpečí, respekt a dost prostoru pro vzájemnost.",
        descriptionEN: "Whether this part of the relationship feels safe, respectful, and mutual.",
    },
    {
        id: "childrenFamily",
        titleCZ: "Děti a rodina",
        titleEN: "Children and family",
        descriptionCZ: "Jak děti a širší rodina dopadají na váš vztah.",
        descriptionEN: "How children and family realities affect the relationship.",
    },
    {
        id: "decisionTruth",
        titleCZ: "Pravdivost rozhodnutí",
        titleEN: "Truthfulness of the decision",
        descriptionCZ: "Jestli rozhodování o vztahu stojí na realitě a ne jen na strachu nebo zvyku.",
        descriptionEN: "Whether your decision about the relationship is grounded in reality rather than fear or habit.",
    },
];

export const onboardingQuestions: OnboardingQuestion[] = [
    {
        id: "duration",
        textCZ: "Jak dlouho jste spolu?",
        textEN: "How long have you been together?",
        clarifierCZ: "Stačí přibližná délka. Podle ní se upraví část otázek.",
        clarifierEN: "An approximate length is enough. Some questions change based on this.",
        showIf: [],
        options: [
            option("lt1", "Méně než 1 rok", "Less than 1 year"),
            option("1to3", "1 až 3 roky", "1 to 3 years"),
            option("3to7", "3 až 7 let", "3 to 7 years"),
            option("7plus", "7+ let", "7+ years"),
        ],
    },
    {
        id: "livingTogether",
        textCZ: "Bydlíte spolu?",
        textEN: "Do you live together?",
        clarifierCZ: "Myslí se běžné společné bydlení ve stejné domácnosti.",
        clarifierEN: "This means living together as part of the same household.",
        showIf: [],
        options: [
            option(true, "Ano", "Yes"),
            option(false, "Ne", "No"),
        ],
    },
    {
        id: "hasChildren",
        textCZ: "Patří do vztahu děti?",
        textEN: "Are children part of this relationship?",
        clarifierCZ: "Stačí, když děti výrazně ovlivňují váš společný život.",
        clarifierEN: "This includes situations where children have a strong effect on your shared life.",
        showIf: [],
        options: [
            option(true, "Ano", "Yes"),
            option(false, "Ne", "No"),
        ],
    },
    {
        id: "childrenType",
        textCZ: "Jaká rodinná situace je vám nejbližší?",
        textEN: "Which family situation fits you best?",
        clarifierCZ: "Vyber to, co nejvíc odpovídá tomu, jak rodina funguje teď.",
        clarifierEN: "Choose the option that best matches how family life works right now.",
        showIf: [{ field: "hasChildren", operator: "equals", value: true }],
        options: [
            option("mine", "Moje děti", "My children"),
            option("theirs", "Partnerovy děti", "Their children"),
            option("ours", "Naše společné děti", "Our shared children"),
            option("blended", "Patchwork rodina", "Blended family"),
        ],
    },
    {
        id: "sharedFinances",
        textCZ: "Sdílíte peníze nebo větší výdaje?",
        textEN: "Do you share money or major expenses?",
        clarifierCZ: "Myslí se společný rozpočet, pravidelné výdaje nebo větší závazky.",
        clarifierEN: "This means a shared budget, regular shared expenses, or larger commitments.",
        showIf: [],
        options: [
            option(true, "Ano", "Yes"),
            option(false, "Ne", "No"),
        ],
    },
    {
        id: "includeIntimacy",
        textCZ: "Chceš do dotazníku zahrnout i oblast intimity a sexuální blízkosti?",
        textEN: "Do you want the questionnaire to include intimacy and sexual connection?",
        clarifierCZ: "Když zvolíš ne, tahle část se v otázkách vůbec neukáže.",
        clarifierEN: "If you choose no, this area will stay out of the questionnaire.",
        showIf: [],
        options: [
            option(true, "Ano", "Yes"),
            option(false, "Ne", "No"),
        ],
    },
    {
        id: "mode",
        textCZ: "Chceš kratší, nebo podrobnější verzi?",
        textEN: "Do you want the shorter or more detailed version?",
        clarifierCZ: "Kratší verze je svižnější. Podrobnější jde víc do jemností.",
        clarifierEN: "The shorter version is quicker. The more detailed version goes into more nuance.",
        showIf: [],
        options: [
            option("quick", "Kratší verze", "Shorter version", "Méně otázek", "Fewer questions"),
            option("deep", "Podrobnější verze", "More detailed version", "Víc otázek a jemnější obraz", "More questions and a fuller picture"),
        ],
    },
];

export const questionnaireQuestions: QuestionnaireQuestion[] = [
    question(
        "foundation-1",
        "foundation",
        "Když myslím na náš vztah, pořád v něm vidím smysl.",
        "When I think about our relationship, it still feels meaningful to me.",
        "Nejde o jednu hezkou chvíli, ale o celkový pocit.",
        "This is about the overall feeling, not one good moment.",
        3,
    ),
    question(
        "foundation-2",
        "foundation",
        "Když myslím na další rok spolu, dává mi to spíš klid než napětí.",
        "When I think about the next year together, I feel more calm than tension.",
        "Jde o první vnitřní reakci, ne o ideální scénář.",
        "This is about your first inner reaction, not an ideal scenario.",
        3,
    ),
    question(
        "foundation-3",
        "foundation",
        "I v běžných dnech mezi námi bývá blízkost.",
        "There is still closeness between us in ordinary days.",
        "Mysli na běžný kontakt, ne jen na výjimečné chvíle.",
        "Think about everyday contact, not only special moments.",
        2,
    ),
    question(
        "foundation-4",
        "foundation",
        "V důležitých věcech táhneme podobným směrem.",
        "In important parts of life, we are moving in a similar direction.",
        "Například hodnoty, styl života nebo představa budoucnosti.",
        "For example values, lifestyle, or the way you imagine the future.",
        2,
    ),
    question(
        "foundation-5",
        "foundation",
        "I když je to těžké, pořád umím vidět, co je mezi námi dobré.",
        "Even when things are hard, I can still see what is good between us.",
        "Nejde o popírání problémů, ale o to, zda dobré věci ještě nezmizely.",
        "This is not about denying problems, but about whether the good parts are still there.",
        2,
    ),
    question(
        "foundation-6",
        "foundation",
        "Tenhle vztah mě i po delší době spíš podporuje než brzdí.",
        "Even after more time together, this relationship supports me more than it holds me back.",
        "Mysli na to, jak se vedle partnera cítíš dlouhodobě.",
        "Think about how you feel next to your partner over time.",
        3,
        [{ field: "duration", operator: "notEquals", value: "lt1" }],
        ["deep"],
    ),
    question(
        "foundation-7",
        "foundation",
        "Na začátku vztahu na nás není tlak, který by nás nutil něco dohánět.",
        "At this stage, the relationship does not feel rushed or pressured.",
        "Jde o tempo vztahu, ne o to, co čeká okolí.",
        "This is about the pace of the relationship, not outside expectations.",
        2,
        [{ field: "duration", operator: "equals", value: "lt1" }],
        ["deep"],
    ),
    question(
        "safety-1",
        "safetyRespect",
        "Když řeknu, že mi něco vadí, cítím se v tom bezpečně.",
        "When I say something feels wrong to me, I feel safe doing it.",
        "Mysli na běžné situace, kdy nesouhlasíš nebo nastavuješ hranici.",
        "Think about ordinary moments when you disagree or set a boundary.",
        3,
    ),
    question(
        "safety-2",
        "safetyRespect",
        "Partner se mnou mluví slušně i když je ve stresu.",
        "My partner speaks to me respectfully even when stressed.",
        "Jde hlavně o tón a způsob, ne o to, jestli se někdy pohádáte.",
        "This is mainly about tone and manner, not whether conflict ever happens.",
        3,
    ),
    question(
        "safety-3",
        "safetyRespect",
        "Nemám pocit, že musím hlídat partnerovu náladu, abych měl nebo měla klid.",
        "I do not feel I have to monitor my partner's mood just to stay at ease.",
        "Mysli na to, jestli se doma uvolníš, nebo jsi pořád ve střehu.",
        "Think about whether you can relax, or whether you stay on guard.",
        3,
    ),
    question(
        "safety-4",
        "safetyRespect",
        "Když něco nechci, partner to respektuje.",
        "When I do not want something, my partner respects that.",
        "Platí to pro čas, blízkost, dotek i osobní hranice.",
        "This includes time, closeness, touch, and personal boundaries.",
        3,
    ),
    question(
        "safety-5",
        "safetyRespect",
        "I při neshodě si zachováváme úctu.",
        "Even in disagreement, we keep basic respect.",
        "Jde o to, jestli se neshoda nemění v shazování nebo ponižování.",
        "This is about whether disagreement turns into contempt or humiliation.",
        3,
    ),
    question(
        "safety-6",
        "safetyRespect",
        "Po kontaktu s partnerem bývám většinou klidnější než napjatý nebo napjatá.",
        "After spending time with my partner, I usually feel calmer rather than more tense.",
        "Neřeš jednu výjimku, ale celkový dojem z většiny dnů.",
        "Do not focus on one exception. Think about the feel of most days.",
        3,
        [],
        ["deep"],
    ),
    question(
        "communication-1",
        "communication",
        "Většinou si opravdu rozumíme.",
        "Most of the time, we truly understand each other.",
        "Jde o to, jestli se v důležitých věcech míjíte, nebo chápete.",
        "This is about whether you keep missing each other or actually understand.",
        2,
    ),
    question(
        "communication-2",
        "communication",
        "Důležité věci nenecháváme dlouho bez řeči.",
        "We do not leave important things unspoken for too long.",
        "Mysli na témata, která by jinak zůstala viset mezi vámi.",
        "Think about topics that could otherwise stay hanging between you.",
        2,
    ),
    question(
        "communication-3",
        "communication",
        "Umím si říct o to, co potřebuji.",
        "I can say what I need.",
        "Nejde o dokonalost, ale o to, jestli to vůbec jde říct nahlas.",
        "This is not about doing it perfectly. It is about whether it can be said at all.",
        2,
    ),
    question(
        "communication-4",
        "communication",
        "Partner mě většinou nejdřív vyslechne.",
        "My partner usually listens to me first.",
        "Jde o to, jestli je pro tvé sdělení místo dřív než obrana.",
        "This is about whether there is room for what you say before defensiveness takes over.",
        2,
    ),
    question(
        "communication-5",
        "communication",
        "Když vznikne nedorozumění, umíme ho vyjasnit.",
        "When there is a misunderstanding, we can clear it up.",
        "Mysli na to, jestli se věci spíš rozplétají, nebo hromadí.",
        "Think about whether things tend to get clarified or just pile up.",
        2,
    ),
    question(
        "communication-6",
        "communication",
        "Z těžkých rozhovorů obvykle vyplyne něco konkrétního.",
        "Hard conversations usually lead to something concrete.",
        "Například dohoda, změna chování nebo jasný další krok.",
        "For example an agreement, a change in behavior, or a clear next step.",
        2,
        [],
        ["deep"],
    ),
    question(
        "communication-7",
        "communication",
        "I po delší době spolu umíme mluvit o citlivých věcech bez uzavření.",
        "Even after more time together, we can talk about sensitive things without shutting down.",
        "Jde o to, jestli se důležité rozhovory dají vést i po letech.",
        "This is about whether important conversations are still possible after years together.",
        2,
        [{ field: "duration", operator: "in", value: ["3to7", "7plus"] }],
        ["deep"],
    ),
    question(
        "conflict-1",
        "conflictRepair",
        "Když se pohádáme, většinou se někam posuneme.",
        "When we argue, it usually leads somewhere.",
        "Nemusí to být hned, ale konflikt neskončí úplně naprázdno.",
        "It does not have to happen right away, but the conflict does not end in nothing.",
        3,
    ),
    question(
        "conflict-2",
        "conflictRepair",
        "Po hádce umí někdo z nás udělat první krok k usmíření.",
        "After a fight, one of us can make the first move toward repair.",
        "Třeba se ozvat, omluvit se nebo zkusit navázat kontakt.",
        "That can mean reaching out, apologizing, or trying to reconnect.",
        3,
    ),
    question(
        "conflict-3",
        "conflictRepair",
        "Stejné hádky se nám nevracejí pořád stejně.",
        "The same fights do not keep repeating in exactly the same way.",
        "Jde o to, jestli se aspoň něco mění.",
        "This is about whether anything is changing at all.",
        2,
        [{ field: "duration", operator: "in", value: ["1to3", "3to7", "7plus"] }],
    ),
    question(
        "conflict-4",
        "conflictRepair",
        "Když uděláme chybu, umíme se omluvit jasně a konkrétně.",
        "When we hurt each other, we can apologize clearly and specifically.",
        "Ne jen říct promiň, ale i uznat, co bolelo.",
        "Not only saying sorry, but naming what hurt.",
        2,
    ),
    question(
        "conflict-5",
        "conflictRepair",
        "Při konfliktu nepoužíváme výhrůžky ani tiché tresty.",
        "During conflict, we do not use threats or silent punishment.",
        "Mysli na běžný styl hádky, ne na výjimečný úlet.",
        "Think about the usual conflict pattern, not one rare blowup.",
        3,
    ),
    question(
        "conflict-6",
        "conflictRepair",
        "Po těžké hádce se mezi námi dá znovu vrátit důvěra.",
        "After a hard fight, trust between us can come back.",
        "Jde o to, jestli po konfliktu nezůstává vše dlouho rozbité.",
        "This is about whether things stay broken for a long time after conflict.",
        3,
        [],
        ["deep"],
    ),
    question(
        "trust-1",
        "trustStability",
        "Věřím tomu, co partner slíbí.",
        "I trust what my partner promises.",
        "Mysli na běžné sliby, dohody i větší věci.",
        "Think about everyday promises, agreements, and bigger commitments.",
        3,
    ),
    question(
        "trust-2",
        "trustStability",
        "Náš vztah působí spíš stabilně než chaoticky.",
        "Our relationship feels more stable than chaotic.",
        "Jde o celkový rytmus a předvídatelnost vztahu.",
        "This is about the overall rhythm and predictability of the relationship.",
        3,
    ),
    question(
        "trust-3",
        "trustStability",
        "Nemám potřebu partnera často kontrolovat.",
        "I do not feel a strong need to check on my partner.",
        "Například ověřovat, domýšlet si nebo hledat skryté věci.",
        "For example checking, second-guessing, or looking for hidden things.",
        2,
    ),
    question(
        "trust-4",
        "trustStability",
        "Ve větších rozhodnutích se o partnera můžu opřít.",
        "In bigger decisions, I can rely on my partner.",
        "Mysli na peníze, závazky, domluvy nebo krizové situace.",
        "Think about money, commitments, agreements, or times of stress.",
        2,
        [{ field: "duration", operator: "in", value: ["1to3", "3to7", "7plus"] }],
    ),
    question(
        "trust-5",
        "trustStability",
        "Když je problém, partner ho spíš otevře než schová.",
        "When there is a problem, my partner is more likely to bring it up than hide it.",
        "Jde o ochotu věci řešit, ne o bezchybnost.",
        "This is about willingness to face problems, not being perfect.",
        2,
    ),
    question(
        "trust-6",
        "trustStability",
        "Vedle partnera se většinou cítím jistě.",
        "Most of the time, I feel secure next to my partner.",
        "Neřeš jednu epizodu, ale dlouhodobý pocit.",
        "Do not focus on one episode. Think about the long-term feeling.",
        3,
        [],
        ["deep"],
    ),
    question(
        "trust-7",
        "trustStability",
        "Na začátku vztahu to, co vidím, odpovídá i tomu, co zažívám.",
        "At this stage, what I see matches what I actually experience.",
        "Jde o to, zda vztah nepůsobí jinak navenek než ve skutečnosti.",
        "This is about whether the relationship feels real rather than misleading.",
        2,
        [{ field: "duration", operator: "equals", value: "lt1" }],
        ["deep"],
    ),
    question(
        "boundaries-1",
        "boundariesSpace",
        "Můžu mít čas pro sebe bez napětí mezi námi.",
        "I can have time to myself without it creating tension between us.",
        "Jde o obyčejný prostor pro sebe, ne o odstup od vztahu.",
        "This is about ordinary personal space, not pulling away from the relationship.",
        2,
    ),
    question(
        "boundaries-2",
        "boundariesSpace",
        "Můžeme si říct, kdy chceme blízkost a kdy prostor.",
        "We can say when we want closeness and when we need space.",
        "Mysli na to, jestli se o tom dá mluvit bez hádky.",
        "Think about whether this can be talked about without turning into a fight.",
        2,
    ),
    question(
        "boundaries-3",
        "boundariesSpace",
        "Moje soukromí partner respektuje.",
        "My partner respects my privacy.",
        "Například telefon, zprávy, čas o samotě nebo osobní věci.",
        "For example your phone, messages, time alone, or personal things.",
        3,
    ),
    question(
        "boundaries-4",
        "boundariesSpace",
        "Můžu mít své lidi a své zájmy i mimo vztah.",
        "I can keep my own people and interests outside the relationship.",
        "Jde o běžné přátele, koníčky a vlastní svět.",
        "This means ordinary friendships, hobbies, and your own world.",
        2,
    ),
    question(
        "boundaries-5",
        "boundariesSpace",
        "Když někdo z nás řekne teď ne, nebere se to jako odmítnutí.",
        "When one of us says not now, it is not treated like rejection.",
        "Například u času, hovoru nebo blízkosti.",
        "For example around time, conversation, or closeness.",
        2,
    ),
    question(
        "boundaries-6",
        "boundariesSpace",
        "Ve vztahu je místo pro nás dva i pro každého zvlášť.",
        "There is room in this relationship for us as a pair and for each person separately.",
        "Jde o rovnováhu mezi společným a vlastním životem.",
        "This is about balance between shared life and personal life.",
        2,
        [],
        ["deep"],
    ),
    question(
        "household-1",
        "household",
        "Doma je práce rozdělená aspoň přibližně fér.",
        "At home, the work feels divided at least roughly fairly.",
        "Nemusí to být půl na půl, ale nemá to dlouhodobě táhnout jeden člověk.",
        "It does not have to be exactly equal, but one person should not carry it all for long.",
        2,
        [{ field: "livingTogether", operator: "equals", value: true }],
    ),
    question(
        "household-2",
        "household",
        "O tom, co je potřeba doma udělat, se dá mluvit otevřeně.",
        "We can talk openly about what needs to be done at home.",
        "Nejde jen o úkoly, ale i o domluvu kolem nich.",
        "This is not only about tasks, but also about being able to coordinate them.",
        2,
        [{ field: "livingTogether", operator: "equals", value: true }],
    ),
    question(
        "household-3",
        "household",
        "Nemám pocit, že většinu starostí o domácnost nesu sám nebo sama.",
        "I do not feel I carry most of the home load on my own.",
        "Mysli i na plánování a hlídání toho, co je potřeba.",
        "Think about planning and remembering too, not only doing tasks.",
        3,
        [{ field: "livingTogether", operator: "equals", value: true }],
    ),
    question(
        "household-4",
        "household",
        "Společné bydlení je pro nás spíš opora než zdroj stálé zloby.",
        "Living together feels more like support than a constant source of resentment.",
        "Jde o to, jak působí běžný provoz domova.",
        "This is about the feel of ordinary life at home.",
        2,
        [{ field: "livingTogether", operator: "equals", value: true }],
    ),
    question(
        "household-5",
        "household",
        "V běžném dni si doma umíme sladit rytmus.",
        "In everyday life, we can find a workable rhythm at home.",
        "Například čas, odpočinek, pořádek nebo domácí pravidla.",
        "For example time, rest, tidiness, or household routines.",
        2,
        [{ field: "livingTogether", operator: "equals", value: true }],
    ),
    question(
        "household-6",
        "household",
        "Společné bydlení mi dlouhodobě život spíš ulehčuje než komplikuje.",
        "Over time, living together makes life easier for me more than harder.",
        "Mysli na celkový dopad, ne na jednu špatnou fázi.",
        "Think about the overall effect, not one bad stretch.",
        2,
        [{ field: "livingTogether", operator: "equals", value: true }],
        ["deep"],
    ),
    question(
        "finances-1",
        "finances",
        "Na peníze se díváme podobně.",
        "We look at money in a similar way.",
        "Například co je důležité utratit, šetřit nebo plánovat.",
        "For example what feels right to spend, save, or plan for.",
        2,
    ),
    question(
        "finances-2",
        "finances",
        "O penězích se dokážeme bavit bez velkého napětí.",
        "We can talk about money without major tension.",
        "Jde o běžný rozhovor o výdajích, dluzích nebo stresu.",
        "This is about ordinary conversations about spending, debt, or financial stress.",
        2,
    ),
    question(
        "finances-3",
        "finances",
        "Když něco platíme spolu, působí to fér.",
        "When we pay for things together, it feels fair.",
        "Nemusí jít o stejnou částku, ale o pocit spravedlnosti.",
        "It does not have to be the exact same amount. It is about whether it feels fair.",
        2,
        [{ field: "sharedFinances", operator: "equals", value: true }],
    ),
    question(
        "finances-4",
        "finances",
        "Důležitá rozhodnutí o penězích děláme způsobem, kterému věřím.",
        "We make important money decisions in a way I trust.",
        "Například větší nákup, závazek nebo změna rozpočtu.",
        "For example a large purchase, a commitment, or a budget change.",
        3,
        [{ field: "sharedFinances", operator: "equals", value: true }],
    ),
    question(
        "finances-5",
        "finances",
        "U společných plánů kolem peněz se umíme domluvit.",
        "We can reach workable agreements around shared money plans.",
        "Třeba dovolená, bydlení, úspory nebo větší výdaj.",
        "For example travel, housing, savings, or a bigger expense.",
        2,
        [{ field: "sharedFinances", operator: "equals", value: true }],
    ),
    question(
        "finances-6",
        "finances",
        "Nemám pocit, že se u nás peníze používají jako nátlak.",
        "I do not feel money is used as pressure between us.",
        "Jde o kontrolu, trestání nebo uhýbání odpovědnosti přes peníze.",
        "This includes control, punishment, or avoiding responsibility through money.",
        3,
        [{ field: "sharedFinances", operator: "equals", value: true }],
        ["deep"],
    ),
    question(
        "intimacy-1",
        "partnershipIntimacy",
        "Mám pocit, že jsme na stejné straně.",
        "I feel like we are on the same side.",
        "Jde o běžný pocit partnerství, ne o to, že se shodnete ve všem.",
        "This is about the ordinary sense of partnership, not agreeing on everything.",
        3,
    ),
    question(
        "intimacy-2",
        "partnershipIntimacy",
        "Blízkost mezi námi působí přirozeně.",
        "Closeness between us feels natural.",
        "Může jít o dotek, sex, něhu nebo obyčejnou fyzickou blízkost.",
        "This can include touch, sex, affection, or simple physical closeness.",
        2,
    ),
    question(
        "intimacy-3",
        "partnershipIntimacy",
        "Mezi námi je pořád dost tepla a laskavosti.",
        "There is still enough warmth and kindness between us.",
        "Mysli na tón, pozornost a malé projevy blízkosti.",
        "Think about tone, attention, and small acts of closeness.",
        2,
    ),
    question(
        "intimacy-4",
        "partnershipIntimacy",
        "Děláme si místo sami na sebe, ne jen na povinnosti.",
        "We make room for each other, not only for obligations.",
        "Nemusí to být velké gesto, ale pravidelný prostor pro vztah.",
        "This does not have to be a big gesture. It is about regular room for the relationship.",
        2,
    ),
    question(
        "intimacy-5",
        "partnershipIntimacy",
        "O blízkosti se spolu dá mluvit otevřeně.",
        "We can talk openly about closeness.",
        "Jde o to, jestli se o potřebách a nepohodlí dá mluvit bez studu.",
        "This is about whether needs and discomfort can be discussed without shame.",
        2,
    ),
    question(
        "intimacy-6",
        "partnershipIntimacy",
        "Vedle partnera se cítím chtěně, ne jen tolerovaně.",
        "Next to my partner, I feel wanted rather than merely tolerated.",
        "Mysli na celkový pocit, jaké místo ve vztahu máš.",
        "Think about your overall sense of the place you hold in the relationship.",
        3,
        [],
        ["deep"],
    ),
    question(
        "sexual-1",
        "sexualConnection",
        "Je mezi námi prostor pro něhu a fyzickou blízkost, která je oběma příjemná.",
        "There is room between us for affection and physical closeness that feels good to both of us.",
        "Když tohle téma u vás vůbec nehraje roli, můžeš zvolit To se mě netýká.",
        "If this topic is not part of your relationship at all, you can choose This does not apply to me.",
        2,
        [{ field: "includeIntimacy", operator: "equals", value: true }],
        ["quick", "deep"],
        true,
    ),
    question(
        "sexual-2",
        "sexualConnection",
        "O intimitě a sexuální blízkosti se spolu dá mluvit bez studu nebo tlaku.",
        "We can talk about intimacy and sexual closeness without shame or pressure.",
        "Jde o to, jestli se o tom dá mluvit klidně, i když se v něčem neshodnete.",
        "This is about whether the topic can be discussed calmly, even when you do not fully match.",
        3,
        [{ field: "includeIntimacy", operator: "equals", value: true }],
        ["quick", "deep"],
        true,
    ),
    question(
        "sexual-3",
        "sexualConnection",
        "Moje tempo a hranice jsou v téhle oblasti respektované.",
        "My pace and boundaries are respected in this part of the relationship.",
        "Patří sem i možnost říct ano, ne nebo teď ne bez nátlaku.",
        "This includes being able to say yes, no, or not now without pressure.",
        3,
        [{ field: "includeIntimacy", operator: "equals", value: true }],
        ["quick", "deep"],
        true,
    ),
    question(
        "sexual-4",
        "sexualConnection",
        "Když jeden z nás blízkost zrovna nechce, dá se to přijmout bez zranění nebo tlaku.",
        "When one of us does not want closeness in the moment, it can be accepted without hurt or pressure.",
        "Jde o to, jestli odmítnutí chvíle neznamená odmítnutí člověka.",
        "This is about whether a no to the moment is not treated like a no to the person.",
        3,
        [{ field: "includeIntimacy", operator: "equals", value: true }],
        ["quick", "deep"],
        true,
    ),
    question(
        "sexual-5",
        "sexualConnection",
        "V téhle oblasti mezi námi zůstává pocit vzájemnosti, ne povinnosti.",
        "In this area, what stays between us feels mutual rather than dutiful.",
        "Mysli na celkovou atmosféru, ne na jednu konkrétní situaci.",
        "Think about the overall atmosphere, not one specific moment.",
        2,
        [{ field: "includeIntimacy", operator: "equals", value: true }],
        ["quick", "deep"],
        true,
    ),
    question(
        "sexual-6",
        "sexualConnection",
        "Mám pocit, že moje potřeby v téhle oblasti mají místo.",
        "I feel my needs have room in this part of the relationship.",
        "Nemusí být splněné vždy hned, ale neměly by zůstávat bez místa nebo bez řeči.",
        "They do not have to be met immediately, but they should not have to disappear or stay unspoken.",
        2,
        [{ field: "includeIntimacy", operator: "equals", value: true }],
        ["quick", "deep"],
        true,
    ),
    question(
        "sexual-7",
        "sexualConnection",
        "Když se v téhle oblasti něco zadrhne, umíme se k tomu vrátit klidně.",
        "When something feels off in this area, we can come back to it calmly.",
        "Třeba po únavě, nemoci, stresu nebo delším odstupu.",
        "For example after stress, illness, fatigue, or a longer period of distance.",
        2,
        [{ field: "includeIntimacy", operator: "equals", value: true }],
        ["quick", "deep"],
        true,
    ),
    question(
        "sexual-8",
        "sexualConnection",
        "Celkově mi intimita a sexuální blízkost v tomhle vztahu spíš přináší blízkost než napětí.",
        "Overall, intimacy and sexual connection in this relationship bring me more closeness than tension.",
        "Jde o tvůj celkový dojem z téhle oblasti, ne o dokonalost.",
        "This is about your overall sense of this part of the relationship, not perfection.",
        3,
        [{ field: "includeIntimacy", operator: "equals", value: true }],
        ["quick", "deep"],
        true,
    ),
    question(
        "children-1",
        "childrenFamily",
        "Povinnosti kolem dětí jsou mezi námi rozdělené aspoň přibližně fér.",
        "Responsibilities around children feel divided at least roughly fairly.",
        "Nemusí být stejné, ale nemají zůstávat dlouhodobě jen na jednom.",
        "They do not have to be identical, but one person should not carry them all for long.",
        2,
        [{ field: "hasChildren", operator: "equals", value: true }],
    ),
    question(
        "children-2",
        "childrenFamily",
        "I vedle dětí nám zůstává vztah mezi námi dvěma.",
        "Even with children in the picture, our relationship as partners is still there.",
        "Jde o to, jestli partnerství úplně nezmizelo pod provozem rodiny.",
        "This is about whether the partner bond has disappeared under family logistics.",
        2,
        [{ field: "hasChildren", operator: "equals", value: true }],
    ),
    question(
        "children-3",
        "childrenFamily",
        "V důležitých věcech kolem dětí táhneme podobným směrem.",
        "In important parenting matters, we are moving in a similar direction.",
        "Například pravidla, hranice nebo běžné fungování.",
        "For example rules, boundaries, or everyday parenting.",
        2,
        [{ field: "hasChildren", operator: "equals", value: true }],
    ),
    question(
        "children-4",
        "childrenFamily",
        "Napětí kolem dětí nebo rodiny umíme řešit bez boje o strany.",
        "We can handle tension around children or family without turning it into a loyalty fight.",
        "Jde o to, zda se konflikty nemění v tlak na loajalitu.",
        "This is about whether conflict turns into pressure to pick sides.",
        3,
        [{ field: "hasChildren", operator: "equals", value: true }],
    ),
    question(
        "children-5",
        "childrenFamily",
        "Rodinný život je díky našemu fungování spíš stabilní než vyčerpávající.",
        "Because of how we function together, family life feels more steady than draining.",
        "Mysli na běžný dojem z toho, jak rodina funguje.",
        "Think about the everyday feel of how family life works.",
        2,
        [{ field: "hasChildren", operator: "equals", value: true }],
    ),
    question(
        "children-6",
        "childrenFamily",
        "V složitější rodinné situaci umíme držet společnou linku.",
        "In a more complex family situation, we can still hold a shared line.",
        "Například když do vztahu vstupují děti z předchozích vztahů nebo širší rodina.",
        "For example when children from previous relationships or extended family are involved.",
        3,
        [
            { field: "hasChildren", operator: "equals", value: true },
            { field: "childrenType", operator: "in", value: ["mine", "theirs", "blended"] },
        ],
        ["deep"],
    ),
    question(
        "children-7",
        "childrenFamily",
        "U společných dětí jsme dost sladění jako rodiče.",
        "With shared children, we are aligned enough as parents.",
        "Jde o hranice, rytmus a základní přístup k výchově.",
        "This is about boundaries, rhythm, and the basic parenting approach.",
        3,
        [
            { field: "hasChildren", operator: "equals", value: true },
            { field: "childrenType", operator: "equals", value: "ours" },
        ],
        ["deep"],
    ),
    question(
        "children-8",
        "childrenFamily",
        "Když jsou ve vztahu moje nebo partnerovy děti, role mezi námi jsou dost jasné.",
        "When the relationship includes my children or my partner's children, our roles feel clear enough.",
        "Mysli na to, kdo co rozhoduje a co se od koho čeká.",
        "Think about who decides what and what each person is expected to do.",
        3,
        [
            { field: "hasChildren", operator: "equals", value: true },
            { field: "childrenType", operator: "in", value: ["mine", "theirs"] },
        ],
        ["deep"],
    ),
    question(
        "children-9",
        "childrenFamily",
        "V patchwork rodině zvládáme přechody mezi domácnostmi bez velkého rozpadu spolupráce.",
        "In a blended family, we can handle transitions between households without losing cooperation.",
        "Například střídání, plánování a navazování mezi více domácnostmi.",
        "For example handovers, planning, and staying connected across more than one home.",
        3,
        [
            { field: "hasChildren", operator: "equals", value: true },
            { field: "childrenType", operator: "equals", value: "blended" },
        ],
        ["deep"],
    ),
    question(
        "decision-1",
        "decisionTruth",
        "Když si představím, že zůstanu, působí to pro mě vnitřně pravdivě.",
        "When I imagine staying, it feels inwardly true to me.",
        "Jde o klidný pocit ano, ne o tlak nebo paniku.",
        "This is about a quiet inner yes, not pressure or panic.",
        3,
    ),
    question(
        "decision-2",
        "decisionTruth",
        "Nezůstávám jen proto, že už jsme spolu dlouho.",
        "I am not staying only because we have already been together a long time.",
        "Mysli na to, jestli vztah stojí i na přítomnosti, ne jen na minulosti.",
        "Think about whether the relationship is held up by the present too, not only the past.",
        3,
        [{ field: "duration", operator: "in", value: ["1to3", "3to7", "7plus"] }],
    ),
    question(
        "decision-3",
        "decisionTruth",
        "Umím si říct, co by se muselo změnit, aby mi vztah dával smysl.",
        "I can say what would need to change for this relationship to make sense to me.",
        "Nemusíš mít celý plán, ale měl by být jasný směr.",
        "You do not need a full plan, but there should be a clear direction.",
        2,
    ),
    question(
        "decision-4",
        "decisionTruth",
        "Moje naděje stojí spíš na tom, co se děje teď, než na slibu, že jednou bude lépe.",
        "My hope rests more on what is happening now than on a promise that one day things will be better.",
        "Jde o současnou realitu, ne o vysněnou budoucnost.",
        "This is about present reality, not an imagined future.",
        2,
    ),
    question(
        "decision-5",
        "decisionTruth",
        "I kdyby se za rok nic velkého nezměnilo, pořád bych v tomhle vztahu viděl nebo viděla smysl.",
        "Even if nothing major changed in a year, this relationship would still make sense to me.",
        "Tohle je dobré brát bez přikrášlení.",
        "It helps to answer this one without softening it.",
        3,
    ),
    question(
        "decision-6",
        "decisionTruth",
        "Umím odlišit lásku od zvyku, strachu nebo povinnosti.",
        "I can tell the difference between love and habit, fear, or duty.",
        "Jde o poctivost k sobě, ne o dokonalou jistotu.",
        "This is about honesty with yourself, not perfect certainty.",
        3,
        [],
        ["deep"],
    ),
];

export const scaleLabels = {
    cz: [
        { value: 1, label: "vůbec to nesedí" },
        { value: 2, label: "spíš to nesedí" },
        { value: 3, label: "někdy ano, někdy ne" },
        { value: 4, label: "spíš to sedí" },
        { value: 5, label: "sedí to velmi přesně" },
    ],
    en: [
        { value: 1, label: "does not fit at all" },
        { value: 2, label: "mostly does not fit" },
        { value: 3, label: "partly yes, partly no" },
        { value: 4, label: "mostly fits" },
        { value: 5, label: "fits very closely" },
    ],
} as const;