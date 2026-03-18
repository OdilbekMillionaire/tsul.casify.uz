export type Language = 'uz_lat' | 'uz_cyr' | 'ru' | 'en';

export enum LegalArea {
  ADMINISTRATIVE = 'Administrative',
  BANKING = 'Banking',
  BANKRUPTCY = 'Bankruptcy',
  CIVIL = 'Civil',
  CONSTITUTIONAL = 'Constitutional',
  CONTRACT = 'Contract',
  CORPORATE = 'Corporate',
  CRIMINAL = 'Criminal',
  CUSTOMS = 'Customs',
  FAMILY = 'Family',
  HOUSING = 'Housing',
  IMMIGRATION = 'Immigration',
  INSURANCE = 'Insurance',
  INTELLECTUAL_PROPERTY = 'Intellectual Property',
  INTERNATIONAL = 'International',
  INVESTMENT = 'Investment',
  LABOR = 'Labor',
  PROCEDURAL = 'Procedural',
  PROPERTY = 'Property',
  TAX = 'Tax',
  TORT = 'Tort'
}

export enum AnalysisTone {
  PROFESSIONAL = 'Professional',
  STUDENT = 'Student'
}

export interface CaseData {
  title: string;
  jurisdiction: string;
  area: LegalArea;
  facts: string;
  tone: AnalysisTone;
  isDeepAnalysis: boolean;
  showLegalResolution: boolean;
}

export interface IracItem {
  issue: string;
  rule: string;
  application: string;
  conclusion: string;
}

export interface Source {
  title: string;
  uri: string;
}

export interface LegalMemo {
  title: string;
  summary: string;
  resolution?: string;
  issues: string[];
  iracAnalysis: IracItem[];
  risks: string[];
  evidenceChecklist: string[];
  nextSteps: string[];
  disclaimer: string;
  sources?: Source[];
}

export type ViewState = 'landing' | 'new-case' | 'result' | 'about' | 'history' | 'profile' | 'settings';

// ── Feature: Practice AI Chat ───────────────────────────
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// ── Feature: Flashcards ─────────────────────────────────
export interface Flashcard {
  front: string;
  back: string;
}

// ── Feature: History ────────────────────────────────────
export interface HistoryEntry {
  id: string;
  date: string;
  title: string;
  area: LegalArea;
  memo: LegalMemo;
  caseData: CaseData;
}

// ── Feature: Counterargument Simulator ──────────────────
export interface CounteranalysisResult {
  opposingPosition: string;
  legalBasis: string;
  iracAnalysis: IracItem[];
  weaknesses: string[];
  defenses: string[];
}

// ── Feature: Legal Document Drafter ─────────────────────
export enum DocumentType {
  COMPLAINT = "Complaint (Da'vonoMA)",
  MOTION = 'Motion / Petition',
  RESPONSE = 'Response Brief',
  LEGAL_OPINION = 'Legal Opinion',
  CONTRACT_CLAUSE = 'Contract Clause',
}

// ── Feature: Case Timeline & Deadline Tracker ───────────
export interface TimelineEvent {
  date: string;
  event: string;
  type: 'fact' | 'deadline' | 'missed' | 'upcoming';
  legalSignificance: string;
}

export interface CaseTimeline {
  events: TimelineEvent[];
  statuteOfLimitationsNote: string;
  criticalWarnings: string[];
}

export interface Translations {
  nav: {
    home: string;
    newCase: string;
    resources: string;
    brand: string;
    langTooltip: string;
    history: string;
    signIn: string;
    myProfile: string;
    settings: string;
    signOut: string;
  };
  hero: {
    brandName: string;
    title: string;
    subtitle: string;
    cta: string;
    secondaryCta: string;
    resourcesBtn: string;
  };
  features: {
    deepAnalysis: { title: string; desc: string };
    bilingual: { title: string; desc: string };
    security: { title: string; desc: string };
  };
  form: {
    steps: { metadata: string; facts: string; review: string };
    titleLabel: string;
    jurisdictionLabel: string;
    areaLabel: string;
    factsLabel: string;
    factsPlaceholder: string;
    toneLabel: string;
    depthLabel: string;
    generateBtn: string;
    generating: string;
    piiWarning: string;
    deepAnalysisLabel: string;
    resolutionLabel: string;
    tones: {
      professional: string;
      student: string;
    };
    buttons: {
      nextFacts: string;
      nextSettings: string;
      back: string;
    };
    tooltips: {
      title: string;
      jurisdiction: string;
      area: string;
      facts: string;
      tone: string;
      depth: string;
    };
    validation: {
      required: string;
    };
  };
  result: {
    privileged: string;
    generatedBy: string;
    summaryHeader: string;
    factsHeader: string;
    analysisHeader: string;
    risksHeader: string;
    evidenceHeader: string;
    stepsHeader: string;
    copyBtn: string;
    copySuccess: string;
    printBtn: string;
    printPreparing: string;
    newCaseBtn: string;
    sourcesHeader: string;
    practiceAi: {
      title: string;
      greeting: string;
    };
  };
  about: {
    tagline: string;
    mission: { title: string; text: string };
    tech: { title: string; text: string };
    team: { title: string; text: string };
  };
  footer: {
    platformHeader: string;
    disclaimerHeader: string;
    disclaimer: string;
    copyright: string;
    links: {
      privacy: string;
      terms: string;
      contact: string;
    };
  };
  history: {
    title: string;
    subtitle: string;
    empty: { title: string; desc: string; btn: string };
    searchPlaceholder: string;
    casesLabel: string;
    clearAll: string;
    open: string;
    deleteConfirm: string;
    yes: string;
    cancel: string;
  };
  aiFeatures: {
    header: string;
    flashcards: { title: string; desc: string };
    counterarguments: { title: string; desc: string; analyzing: string; show: string; hide: string };
    draftDocument: { title: string; desc: string };
    audioBriefing: { title: string; desc: string; generating: string; stop: string };
    timeline: { title: string; desc: string; building: string; show: string; hide: string };
  };
  profile: {
    title: string;
    casesAnalyzed: string;
    memberSince: string;
    account: string;
    profileInfo: string;
    editSettings: string;
    viewHistory: string;
    signOut: string;
    fields: { name: string; email: string; role: string; institution: string; specialization: string };
    notSignedIn: string;
  };
  settings: {
    title: string;
    subtitle: string;
    account: string;
    displayName: string;
    role: string;
    institution: string;
    specialization: string;
    selectSpec: string;
    saveChanges: string;
    saving: string;
    savedSuccess: string;
    notSignedIn: string;
  };
  generating: {
    title: string;
    subtitle: string;
    stages: Array<{ label: string; sub: string }>;
    stepOf: string;
  };
  flashcards: {
    title: string;
    generated: string;
    aiCards: string;
    generateBtn: string;
    generating: string;
    studyMode: string;
    gridView: string;
    cardOf: string;
    reset: string;
    clickToFlip: string;
    showingAnswer: string;
    question: string;
    answer: string;
    promptTitle: string;
    promptDesc: string;
    pdf: string;
  };
}