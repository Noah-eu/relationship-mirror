export type Language = "cz" | "en";

export type Mode = "quick" | "deep";

export type ScaleValue = 1 | 2 | 3 | 4 | 5;

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
  | "mode";

export type OnboardingState = {
  duration: RelationshipDuration | null;
  livingTogether: boolean | null;
  hasChildren: boolean | null;
  childrenType: ChildrenType | null;
  sharedFinances: boolean | null;
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
  helperCZ?: string;
  helperEN?: string;
  options: OnboardingOption[];
  showIf: Condition[];
};

export type QuestionnaireQuestion = {
  id: string;
  area: AreaId;
  textCZ: string;
  textEN: string;
  weight: number;
  showIf: Condition[];
  modes: Mode[];
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
  weight: number,
  showIf: Condition[] = [],
  modes: Mode[] = ["quick", "deep"],
): QuestionnaireQuestion => ({
  id,
  area,
  textCZ,
  textEN,
  weight,
  showIf,
  modes,
});

export const defaultOnboardingState: OnboardingState = {
  duration: null,
  livingTogether: null,
  hasChildren: null,
  childrenType: null,
  sharedFinances: null,
  mode: null,
};

export const questionnaireAreas: QuestionnaireArea[] = [
  {
    id: "foundation",
    titleCZ: "Základ vztahu",
    titleEN: "Relationship foundation",
    descriptionCZ: "Směr, hodnoty a pocit, že vztah pořád stojí na něčem živém.",
    descriptionEN: "Direction, values, and the sense that the relationship still has a living core.",
  },
  {
    id: "safetyRespect",
    titleCZ: "Psychické bezpečí a úcta",
    titleEN: "Emotional safety and respect",
    descriptionCZ: "Jak bezpečně se v tomhle vztahu cítíte a jakou má vztah kulturu respektu.",
    descriptionEN: "How safe the relationship feels and how consistently respect is present.",
  },
  {
    id: "communication",
    titleCZ: "Komunikace",
    titleEN: "Communication",
    descriptionCZ: "Schopnost mluvit jasně, slyšet se a neuhýbat důležitým tématům.",
    descriptionEN: "The ability to speak clearly, hear each other, and not avoid important topics.",
  },
  {
    id: "conflictRepair",
    titleCZ: "Konflikty a opravy",
    titleEN: "Conflict and repair",
    descriptionCZ: "Jak vypadá spor a jestli po něm umíte vztah zase poskládat.",
    descriptionEN: "What conflict looks like and whether the relationship can repair after it.",
  },
  {
    id: "trustStability",
    titleCZ: "Důvěra a stabilita",
    titleEN: "Trust and stability",
    descriptionCZ: "Předvídatelnost, spolehlivost a pocit, že slova platí.",
    descriptionEN: "Predictability, reliability, and a sense that words still hold.",
  },
  {
    id: "boundariesSpace",
    titleCZ: "Hranice a prostor pro sebe",
    titleEN: "Boundaries and personal space",
    descriptionCZ: "Míra svobody, individuality a respektu k vlastnímu tempu.",
    descriptionEN: "Freedom, individuality, and respect for each person's pace and limits.",
  },
  {
    id: "household",
    titleCZ: "Domácnost",
    titleEN: "Household",
    descriptionCZ: "Každodenní fungování, dělba zátěže a rytmus společného domova.",
    descriptionEN: "Daily life, division of load, and the rhythm of a shared home.",
  },
  {
    id: "finances",
    titleCZ: "Finance",
    titleEN: "Finances",
    descriptionCZ: "Jak se o penězích mluví a jak férově se s nimi zachází.",
    descriptionEN: "How money is discussed and how fairly it is handled.",
  },
  {
    id: "partnershipIntimacy",
    titleCZ: "Partnerství a blízkost",
    titleEN: "Partnership and closeness",
    descriptionCZ: "Pocit týmu, blízkosti, náklonnosti a prostoru pro intimitu.",
    descriptionEN: "A sense of team, affection, closeness, and room for intimacy.",
  },
  {
    id: "childrenFamily",
    titleCZ: "Děti a rodina",
    titleEN: "Children and family",
    descriptionCZ: "Jak rodinná realita působí na vztah a jestli zůstáváte tým.",
    descriptionEN: "How family realities affect the relationship and whether you remain a team.",
  },
  {
    id: "decisionTruth",
    titleCZ: "Pravdivost rozhodnutí",
    titleEN: "Truthfulness of the decision",
    descriptionCZ: "Nakolik je rozhodování o vztahu opřené o realitu a ne o strach nebo setrvačnost.",
    descriptionEN: "How much the decision is grounded in reality rather than fear or inertia.",
  },
];

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: "duration",
    textCZ: "Jak dlouho tenhle vztah trvá?",
    textEN: "How long has this relationship been going on?",
    helperCZ: "Pomáhá to přizpůsobit hloubku některých reflexivních otázek.",
    helperEN: "This helps tailor a few of the more reflective prompts.",
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
    textCZ: "Žijete spolu ve společné domácnosti?",
    textEN: "Do you currently live together in a shared home?",
    showIf: [],
    options: [
      option(true, "Ano", "Yes"),
      option(false, "Ne", "No"),
    ],
  },
  {
    id: "hasChildren",
    textCZ: "Jsou součástí vztahu děti nebo výrazná rodičovská role?",
    textEN: "Are children or a significant parenting role part of this relationship?",
    showIf: [],
    options: [
      option(true, "Ano", "Yes"),
      option(false, "Ne", "No"),
    ],
  },
  {
    id: "childrenType",
    textCZ: "Jaký typ rodinného uspořádání je pro vás nejbližší?",
    textEN: "Which family setup fits your situation best?",
    showIf: [{ field: "hasChildren", operator: "equals", value: true }],
    options: [
      option("mine", "Moje děti", "My children"),
      option("theirs", "Partnerovy děti", "Their children"),
      option("ours", "Naše společné děti", "Our shared children"),
      option("blended", "Kombinovaná / patchwork rodina", "Blended family"),
    ],
  },
  {
    id: "sharedFinances",
    textCZ: "Sdílíte spolu finance nebo zásadní finanční závazky?",
    textEN: "Do you share finances or important financial commitments?",
    showIf: [],
    options: [
      option(true, "Ano", "Yes"),
      option(false, "Ne", "No"),
    ],
  },
  {
    id: "mode",
    textCZ: "Jaký režim chceš použít?",
    textEN: "Which mode do you want to use?",
    helperCZ: "Quick = základní screening. Deep = širší a jemnější mapa vztahu.",
    helperEN: "Quick = core screening. Deep = a broader and more nuanced relationship map.",
    showIf: [],
    options: [
      option("quick", "Quick", "Quick", "Kratší průchod", "Shorter pass"),
      option("deep", "Deep", "Deep", "Víc otázek a detailů", "More questions and nuance"),
    ],
  },
];

export const questionnaireQuestions: QuestionnaireQuestion[] = [
  question(
    "foundation-1",
    "foundation",
    "Umím pojmenovat dobré důvody, proč mi na tomhle vztahu pořád záleží.",
    "I can name good reasons why this relationship still matters to me.",
    3,
  ),
  question(
    "foundation-2",
    "foundation",
    "Když si představím příští rok spolu, cítím spíš naději než tíhu.",
    "When I imagine the next year together, I feel more hope than heaviness.",
    3,
  ),
  question(
    "foundation-3",
    "foundation",
    "Naše každodenní spojení je pořád živé a není jen ze zvyku.",
    "Our everyday connection still feels alive and not just habitual.",
    2,
  ),
  question(
    "foundation-4",
    "foundation",
    "Sdílíme dost hodnot na to, aby společný život dával smysl.",
    "We share enough values for a shared life to make sense.",
    2,
  ),
  question(
    "foundation-5",
    "foundation",
    "I v náročných obdobích pořád vidím, co je mezi námi dobré.",
    "Even in hard periods, I can still see what is good between us.",
    2,
  ),
  question(
    "foundation-6",
    "foundation",
    "Po delší době spolu mám pořád pocit, že tenhle vztah podporuje můj růst.",
    "After spending more time together, I still feel this relationship supports my growth.",
    3,
    [{ field: "duration", operator: "notEquals", value: "lt1" }],
    ["deep"],
  ),
  question(
    "foundation-7",
    "foundation",
    "Tempo vztahu působí zdravě a ne jako tlak, který je potřeba rychle dohnat.",
    "The pace of the relationship feels healthy rather than rushed or pressured.",
    2,
    [{ field: "duration", operator: "equals", value: "lt1" }],
    ["deep"],
  ),
  question(
    "safety-1",
    "safetyRespect",
    "Cítím se psychicky bezpečně, když vyjádřím nepohodlí nebo nesouhlas.",
    "I feel emotionally safe when I express discomfort or disagreement.",
    3,
  ),
  question(
    "safety-2",
    "safetyRespect",
    "Partner se mnou mluví s úctou i ve stresu nebo při napětí.",
    "My partner speaks to me respectfully even under stress or tension.",
    3,
  ),
  question(
    "safety-3",
    "safetyRespect",
    "Nemám pocit, že musím hlídat náladu druhého, abych byl nebo byla v bezpečí.",
    "I do not feel like I have to monitor the other person's mood in order to stay safe.",
    3,
  ),
  question(
    "safety-4",
    "safetyRespect",
    "Moje ne nebo moje hranice jsou brány vážně.",
    "My no and my boundaries are taken seriously.",
    3,
  ),
  question(
    "safety-5",
    "safetyRespect",
    "Dokážeme nesouhlasit bez ponižování, pohrdání nebo zesměšnění.",
    "We can disagree without humiliation, contempt, or ridicule.",
    3,
  ),
  question(
    "safety-6",
    "safetyRespect",
    "Po většině kontaktu s partnerem cítím spíš klid než sevření nebo strach.",
    "After most interactions with my partner, I feel calmer rather than tense or afraid.",
    3,
    [],
    ["deep"],
  ),
  question(
    "communication-1",
    "communication",
    "Většinou rozumíme tomu, co se ten druhý snaží říct.",
    "We usually understand what the other person is trying to say.",
    2,
  ),
  question(
    "communication-2",
    "communication",
    "Těžká témata nenecháváme příliš dlouho zametená pod koberec.",
    "We do not leave difficult topics hidden for too long.",
    2,
  ),
  question(
    "communication-3",
    "communication",
    "Umím si říct o to, co potřebuji, aniž bych se cítil nebo cítila trapně.",
    "I can ask for what I need without feeling foolish for it.",
    2,
  ),
  question(
    "communication-4",
    "communication",
    "Partner mě obvykle nejdřív vyslechne, než začne bránit sebe nebo vysvětlovat.",
    "My partner usually listens first before defending themselves or explaining.",
    2,
  ),
  question(
    "communication-5",
    "communication",
    "Nedorozumění spíš opravujeme, než abychom je hromadili.",
    "We tend to repair misunderstandings instead of collecting them.",
    2,
  ),
  question(
    "communication-6",
    "communication",
    "Důležité rozhovory vedou k jasnějším dalším krokům, ne jen k dalšímu kruhu.",
    "Important conversations lead to clearer next steps instead of another loop.",
    2,
    [],
    ["deep"],
  ),
  question(
    "communication-7",
    "communication",
    "I po delší době spolu umíme mluvit o citlivých věcech bez cynismu nebo úplného vypnutí.",
    "Even after a long time together, we can discuss sensitive things without cynicism or shutting down.",
    2,
    [{ field: "duration", operator: "in", value: ["3to7", "7plus"] }],
    ["deep"],
  ),
  question(
    "conflict-1",
    "conflictRepair",
    "Hádky se nakonec většinou posouvají k nějakému řešení.",
    "Arguments usually move toward some kind of resolution.",
    3,
  ),
  question(
    "conflict-2",
    "conflictRepair",
    "Po konfliktu někdo z nás umí udělat první opravný krok.",
    "After conflict, one of us can make the first repair move.",
    3,
  ),
  question(
    "conflict-3",
    "conflictRepair",
    "Staré spory se nevracejí pořád dokola bez jakéhokoli posunu.",
    "Old fights do not keep reopening without any progress.",
    2,
    [{ field: "duration", operator: "in", value: ["1to3", "3to7", "7plus"] }],
  ),
  question(
    "conflict-4",
    "conflictRepair",
    "Umíme se omluvit konkrétně, ne jen obecně nebo povinně.",
    "We can apologize specifically, not only in a vague or obligatory way.",
    2,
  ),
  question(
    "conflict-5",
    "conflictRepair",
    "Konflikt se zřídka mění v vyhrožování, tiché trestání nebo manipulativní odpojování.",
    "Conflict rarely turns into threats, silent punishment, or manipulative withdrawal.",
    3,
  ),
  question(
    "conflict-6",
    "conflictRepair",
    "Po těžkém střetu se důvěra obvykle dokáže obnovit v rozumném čase.",
    "After a hard clash, trust can usually be rebuilt in a reasonable time.",
    3,
    [],
    ["deep"],
  ),
  question(
    "trust-1",
    "trustStability",
    "Věřím, že partner jedná v souladu s tím, co slíbí.",
    "I trust my partner to act in line with what they promise.",
    3,
  ),
  question(
    "trust-2",
    "trustStability",
    "Vztah působí v zásadě stabilně, ne chaoticky.",
    "The relationship feels basically stable rather than chaotic.",
    3,
  ),
  question(
    "trust-3",
    "trustStability",
    "Nevydávám moc energie na kontrolu, domýšlení nebo druhé ověřování.",
    "I do not spend much energy checking, second-guessing, or verifying.",
    2,
  ),
  question(
    "trust-4",
    "trustStability",
    "Větší závazky v tomhle vztahu působí spolehlivě.",
    "Major commitments in this relationship feel reliable.",
    2,
    [{ field: "duration", operator: "in", value: ["1to3", "3to7", "7plus"] }],
  ),
  question(
    "trust-5",
    "trustStability",
    "Věřím, že problémy budou spíš řešené než schovávané.",
    "I believe problems are more likely to be addressed than hidden.",
    2,
  ),
  question(
    "trust-6",
    "trustStability",
    "Můj nervový systém tenhle vztah většinou vnímá jako předvídatelný.",
    "My nervous system experiences this relationship as mostly predictable.",
    3,
    [],
    ["deep"],
  ),
  question(
    "trust-7",
    "trustStability",
    "To, jak vztah působí navenek, zatím odpovídá i tomu, jaký je v realitě.",
    "How the relationship appears on the surface still matches the reality of it.",
    2,
    [{ field: "duration", operator: "equals", value: "lt1" }],
    ["deep"],
  ),
  question(
    "boundaries-1",
    "boundariesSpace",
    "Mohu mít čas pro sebe bez pocitu viny nebo odvety.",
    "I can have time to myself without guilt or retaliation.",
    2,
  ),
  question(
    "boundaries-2",
    "boundariesSpace",
    "Potřeba blízkosti i potřeba prostoru se u nás dají mluvit nahlas.",
    "Needs for closeness and for space can both be discussed openly here.",
    2,
  ),
  question(
    "boundaries-3",
    "boundariesSpace",
    "Soukromí a osobní hranice jsou respektované.",
    "Privacy and personal boundaries are respected.",
    3,
  ),
  question(
    "boundaries-4",
    "boundariesSpace",
    "Mohu si držet přátelství a zájmy i mimo vztah.",
    "I can maintain friendships and interests outside the relationship.",
    2,
  ),
  question(
    "boundaries-5",
    "boundariesSpace",
    "Umíme říct ne teď, aniž by se z toho stalo odmítnutí celé osoby.",
    "We can say not now without it becoming a rejection of the whole person.",
    2,
  ),
  question(
    "boundaries-6",
    "boundariesSpace",
    "Vztah dává prostor jak pro individualitu, tak pro společné my.",
    "The relationship makes room for individuality as well as for a shared us.",
    2,
    [],
    ["deep"],
  ),
  question(
    "household-1",
    "household",
    "Rozdělení domácích povinností je v zásadě férové.",
    "The division of household tasks feels basically fair.",
    2,
    [{ field: "livingTogether", operator: "equals", value: true }],
  ),
  question(
    "household-2",
    "household",
    "O domácích povinnostech se mluví a nejsou brané jako samozřejmost.",
    "Home responsibilities are discussed instead of silently assumed.",
    2,
    [{ field: "livingTogether", operator: "equals", value: true }],
  ),
  question(
    "household-3",
    "household",
    "Nemám pocit, že mentální zátěž domácnosti nesu převážně sám nebo sama.",
    "I do not feel like I carry most of the mental load of the home on my own.",
    3,
    [{ field: "livingTogether", operator: "equals", value: true }],
  ),
  question(
    "household-4",
    "household",
    "Společný domov je pro nás spíš oporou než zdrojem opakované zášti.",
    "Our shared home is more of a support than a source of repeated resentment.",
    2,
    [{ field: "livingTogether", operator: "equals", value: true }],
  ),
  question(
    "household-5",
    "household",
    "Dokážeme sladit rytmus dne bez neustálého tření.",
    "We can coordinate our daily rhythm without constant friction.",
    2,
    [{ field: "livingTogether", operator: "equals", value: true }],
  ),
  question(
    "household-6",
    "household",
    "Společné bydlení zlepšuje můj běžný život víc, než ho komplikuje.",
    "Living together improves my ordinary life more than it complicates it.",
    2,
    [{ field: "livingTogether", operator: "equals", value: true }],
    ["deep"],
  ),
  question(
    "finances-1",
    "finances",
    "Máme dost podobné peněžní hodnoty a priority.",
    "Our money values and priorities are compatible enough.",
    2,
  ),
  question(
    "finances-2",
    "finances",
    "O finančním stresu se dá mluvit bez zavírání nebo útoku.",
    "Financial stress can be discussed without shutting down or attacking.",
    2,
  ),
  question(
    "finances-3",
    "finances",
    "Sdílené výdaje nebo závazky působí férově rozdělené.",
    "Shared expenses or commitments feel fairly divided.",
    2,
    [{ field: "sharedFinances", operator: "equals", value: true }],
  ),
  question(
    "finances-4",
    "finances",
    "Věřím tomu, jak se u nás dělají důležitá finanční rozhodnutí.",
    "I trust the way important financial decisions are made between us.",
    3,
    [{ field: "sharedFinances", operator: "equals", value: true }],
  ),
  question(
    "finances-5",
    "finances",
    "Umíme plánovat střednědobé cíle bez zbytečného mlžení nebo bojů o moc.",
    "We can plan medium-term goals without unnecessary fog or power struggles.",
    2,
    [{ field: "sharedFinances", operator: "equals", value: true }],
  ),
  question(
    "finances-6",
    "finances",
    "Nemám obavu, že by finance byly využívané ke kontrole, trestání nebo uhýbání odpovědnosti.",
    "I am not worried that finances are used for control, punishment, or avoiding responsibility.",
    3,
    [{ field: "sharedFinances", operator: "equals", value: true }],
    ["deep"],
  ),
  question(
    "intimacy-1",
    "partnershipIntimacy",
    "Pořád mám pocit, že jsme na stejné straně.",
    "I still feel like we are on the same side.",
    3,
  ),
  question(
    "intimacy-2",
    "partnershipIntimacy",
    "Náklonnost nebo fyzická blízkost působí vítaně, ne vynuceně.",
    "Affection or physical closeness feels welcome rather than forced.",
    2,
  ),
  question(
    "intimacy-3",
    "partnershipIntimacy",
    "Je mezi námi dost tepla, jemnosti nebo obdivu.",
    "There is enough warmth, tenderness, or admiration between us.",
    2,
  ),
  question(
    "intimacy-4",
    "partnershipIntimacy",
    "Děláme místo pro nás dva i mimo logistiku a povinnosti.",
    "We make room for the two of us beyond logistics and obligations.",
    2,
  ),
  question(
    "intimacy-5",
    "partnershipIntimacy",
    "O intimitě se dá mluvit bez studu, tlaku nebo obrany.",
    "Intimacy can be discussed without shame, pressure, or defensiveness.",
    2,
  ),
  question(
    "intimacy-6",
    "partnershipIntimacy",
    "Cítím se partnerem spíš zvoleně než jen snášeně nebo tolerovaně.",
    "I feel chosen by my partner rather than merely tolerated or accommodated.",
    3,
    [],
    ["deep"],
  ),
  question(
    "children-1",
    "childrenFamily",
    "Rodičovské nebo rodinné povinnosti jsou sdílené dost férově.",
    "Parenting or family responsibilities are shared fairly enough.",
    2,
    [{ field: "hasChildren", operator: "equals", value: true }],
  ),
  question(
    "children-2",
    "childrenFamily",
    "Náš partnerský vztah úplně nezmizel pod rodinnou logistikou.",
    "Our partner bond has not completely disappeared under family logistics.",
    2,
    [{ field: "hasChildren", operator: "equals", value: true }],
  ),
  question(
    "children-3",
    "childrenFamily",
    "Jsme dost sladění v klíčových hodnotách kolem dětí a rodiny.",
    "We are aligned enough on key values around children and family.",
    2,
    [{ field: "hasChildren", operator: "equals", value: true }],
  ),
  question(
    "children-4",
    "childrenFamily",
    "Konflikty kolem dětí nebo širší rodiny se dají řešit bez války loajalit.",
    "Conflicts around children or the wider family can be addressed without loyalty wars.",
    3,
    [{ field: "hasChildren", operator: "equals", value: true }],
  ),
  question(
    "children-5",
    "childrenFamily",
    "Rodinný život působí díky našemu fungování spíš stabilněji než vyčerpávajícím dojmem.",
    "Because of how we function, family life feels more stable than exhausting.",
    2,
    [{ field: "hasChildren", operator: "equals", value: true }],
  ),
  question(
    "children-6",
    "childrenFamily",
    "V komplexnější rodinné struktuře umíme držet vztah jako spolupracující tým.",
    "In a more complex family structure, we still manage to act like a cooperative team.",
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
    "U našich společných dětí jsme dost sladění v tom, jak držet hranice, rytmus a rodičovskou linku.",
    "With our shared children, we are aligned enough on boundaries, rhythm, and parenting direction.",
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
    "Když jsou ve vztahu moje nebo partnerovy děti, role a očekávání mezi námi působí dost jasně.",
    "When the relationship includes my children or my partner's children, roles and expectations between us feel clear enough.",
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
    "V patchwork nebo blended uspořádání umíme zvládat přechody mezi domácnostmi bez rozpadnutí spolupráce.",
    "In a blended family setup, we can handle transitions between households without the relationship losing cooperation.",
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
    "Když si představím, že zůstanu, působí to spíš pravdivě než jako rozhodnutí ze strachu.",
    "When I imagine staying, it feels more truthful than driven by fear.",
    3,
  ),
  question(
    "decision-2",
    "decisionTruth",
    "Nespoléhám jen na investovaný čas nebo minulost jako důvod zůstávat.",
    "I am not relying only on time invested or history as the reason to stay.",
    3,
    [{ field: "duration", operator: "in", value: ["1to3", "3to7", "7plus"] }],
  ),
  question(
    "decision-3",
    "decisionTruth",
    "Umím pojmenovat, co by se reálně muselo změnit, aby vztah byl dobré rozhodnutí.",
    "I can name what would realistically need to change for the relationship to be a good decision.",
    2,
  ),
  question(
    "decision-4",
    "decisionTruth",
    "Moje naděje je opřená spíš o realitu než jen o potenciál.",
    "My hope is based more on reality than on potential alone.",
    2,
  ),
  question(
    "decision-5",
    "decisionTruth",
    "Kdyby se za 12 měsíců nic zásadního nezměnilo, pořád bych viděl nebo viděla cestu, kterou bych si zvolil či zvolila.",
    "If nothing major changed in 12 months, I would still see a path I would choose.",
    3,
  ),
  question(
    "decision-6",
    "decisionTruth",
    "Umím rozlišit lásku, povinnost, strach a zvyk s dostatečnou poctivostí.",
    "I can distinguish love, obligation, fear, and habit with enough honesty.",
    3,
    [],
    ["deep"],
  ),
];

export const scaleLabels = {
  cz: [
    { value: 1, label: "Vůbec ne" },
    { value: 2, label: "Spíš ne" },
    { value: 3, label: "Napůl" },
    { value: 4, label: "Spíš ano" },
    { value: 5, label: "Rozhodně ano" },
  ],
  en: [
    { value: 1, label: "Not at all" },
    { value: 2, label: "Mostly no" },
    { value: 3, label: "Mixed" },
    { value: 4, label: "Mostly yes" },
    { value: 5, label: "Definitely yes" },
  ],
} as const;