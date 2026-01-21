export type Language = 'uz_lat' | 'uz_cyr' | 'ru' | 'en';

export enum LegalArea {
  CIVIL = 'Civil',
  CRIMINAL = 'Criminal',
  ADMINISTRATIVE = 'Administrative',
  ECONOMIC = 'Economic',
  FAMILY = 'Family',
  LABOR = 'Labor'
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
  claimant: string;
  respondent: string;
  tone: AnalysisTone;
  isDeepAnalysis: boolean;
}

export interface IracItem {
  issue: string;
  rule: string;
  application: string;
  conclusion: string;
}

export interface LegalMemo {
  title: string;
  summary: string;
  issues: string[];
  iracAnalysis: IracItem[];
  risks: string[];
  evidenceChecklist: string[];
  nextSteps: string[];
  disclaimer: string;
}

export type ViewState = 'landing' | 'new-case' | 'result' | 'about';

export interface Translations {
  nav: {
    home: string;
    newCase: string;
    resources: string;
    brand: string;
    langTooltip: string;
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
    partiesLabel: string;
    claimantPlaceholder: string;
    respondentPlaceholder: string;
    toneLabel: string;
    depthLabel: string;
    generateBtn: string;
    generating: string;
    tooltips: {
      title: string;
      jurisdiction: string;
      area: string;
      facts: string;
      parties: string;
      tone: string;
      depth: string;
    };
    validation: {
      required: string;
      minLength: string;
    };
  };
  result: {
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
  };
  about: {
    tagline: string;
    mission: { title: string; text: string };
    tech: { title: string; text: string };
    team: { title: string; text: string };
  };
  footer: {
    disclaimer: string;
    copyright: string;
    links: {
      privacy: string;
      terms: string;
      contact: string;
    };
  };
}