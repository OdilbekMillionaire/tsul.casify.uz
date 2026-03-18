import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CaseData, Language, LegalMemo, Source, CounteranalysisResult, DocumentType, CaseTimeline } from "../types";

// Model Configuration
const PRIMARY_MODEL = 'gemini-3-flash';
const FALLBACK_MODEL = 'gemini-2.0-flash';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';

const SYSTEM_INSTRUCTION = `
You are a Senior Associate Lawyer at a top law firm in Tashkent.
Your task is to RESEARCH real-life legal cases (kazus) or specific legal precedents in Uzbekistan based on the user's input.
1. USE GOOGLE SEARCH to find actual court cases, news reports of legal disputes, or official legal commentaries relevant to the topic.
2. Select the most relevant REAL case found. If no specific named case is found, synthesize a realistic case study based on the search results.
3. Restructure this information into a formal legal case study and analysis (not just a generic memo).
4. You DO NOT cite specific article numbers unless you are 100% certain, otherwise focus on legal principles.
5. Your tone is authoritative, objective, and professional.
6. NEVER use phrases like 'As an AI' or 'I assume'. Write as if you are a human lawyer.
7. Always output the analysis in the REQUESTED LANGUAGE.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A formal title for the case study (e.g., 'Analysis of [Real Case Name]')" },
    summary: { type: Type.STRING, description: "Detailed summary of the REAL case facts, background, and procedural history found via search. This must be the first section." },
    resolution: { type: Type.STRING, description: "The final court resolution, judgment, or case outcome. If the user requested to hide it, return an empty string." },
    issues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of legal issues identified in the case" },
    iracAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING, description: "The legal issue being analyzed" },
          rule: { type: Type.STRING, description: "The relevant legal rule or principle" },
          application: { type: Type.STRING, description: "Application of the rule to the found facts" },
          conclusion: { type: Type.STRING, description: "Conclusion for this specific issue" }
        },
        required: ["issue", "rule", "application", "conclusion"]
      },
      description: "Detailed IRAC analysis for each issue"
    },
    risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Procedural and substantive risks based on the case" },
    evidenceChecklist: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Documents and evidence needed" },
    nextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Concrete next steps for the lawyer" },
    disclaimer: { type: Type.STRING, description: "Professional legal disclaimer" }
  },
  required: ["title", "summary", "resolution", "issues", "iracAnalysis", "risks", "evidenceChecklist", "nextSteps", "disclaimer"]
};

const COUNTER_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    opposingPosition: { type: Type.STRING, description: "The opposing party's overall legal position and strongest arguments in 2-3 paragraphs." },
    legalBasis: { type: Type.STRING, description: "The primary legal rules, precedents, and statutory provisions supporting the opposing position." },
    iracAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING },
          rule: { type: Type.STRING },
          application: { type: Type.STRING },
          conclusion: { type: Type.STRING }
        },
        required: ["issue", "rule", "application", "conclusion"]
      },
      description: "IRAC analysis from the opposing party's perspective"
    },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Weaknesses and vulnerabilities in the original party's case" },
    defenses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Available defenses and counter-claims for the opposing party" }
  },
  required: ["opposingPosition", "legalBasis", "iracAnalysis", "weaknesses", "defenses"]
};

const TIMELINE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    events: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "Date or estimated timeframe (e.g. '15.03.2023', 'Early 2022', 'Within 3 months')" },
          event: { type: Type.STRING, description: "Description of the event or deadline" },
          type: { type: Type.STRING, description: "Exactly one of: fact, deadline, missed, upcoming" },
          legalSignificance: { type: Type.STRING, description: "Why this date or event matters legally" }
        },
        required: ["date", "event", "type", "legalSignificance"]
      }
    },
    statuteOfLimitationsNote: { type: Type.STRING, description: "The applicable statute of limitations under Uzbek law for this case type, with specific timeframes." },
    criticalWarnings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Critical time-based warnings that require immediate attention" }
  },
  required: ["events", "statuteOfLimitationsNote", "criticalWarnings"]
};

const LANG_MAP: Record<Language, string> = {
  'uz_lat': 'Uzbek (Latin Script)',
  'uz_cyr': 'Uzbek (Cyrillic Script)',
  'ru': 'Russian',
  'en': 'English'
};

const isQuotaError = (error: any): boolean => {
  const msg = error?.message?.toLowerCase() || '';
  const status = error?.status || error?.statusText || error?.response?.status;
  return (
    status === 429 ||
    status === 503 ||
    msg.includes('quota') ||
    msg.includes('resource exhausted') ||
    msg.includes('too many requests')
  );
};

// ─────────────────────────────────────────────
// 1. MAIN: Generate Legal Memo
// ─────────────────────────────────────────────
export const generateLegalMemo = async (
  caseData: CaseData,
  language: Language
): Promise<LegalMemo> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });
  const targetLang = LANG_MAP[language];

  const prompt = `
    Perform a legal research and analysis task.

    TOPIC / SEARCH QUERY:
    "${caseData.facts}"

    PARAMETERS:
    - Jurisdiction: ${caseData.jurisdiction}
    - Legal Area: ${caseData.area}
    - Tone: ${caseData.tone}
    - Depth: ${caseData.isDeepAnalysis ? "Deep/Comprehensive" : "Standard"}
    - Output Language: ${targetLang}
    - Show Outcome/Resolution: ${caseData.showLegalResolution ? "YES" : "NO"}

    INSTRUCTIONS:
    1. SEARCH the internet for a real-life court case (kazus) or legal dispute in Uzbekistan that matches the "TOPIC".
    2. FIRST, give the full case details, background, and procedural history in the summary section.
    3. Structure the rest as a formal internal legal case study analysis.
    4. Provide relevant case management information where applicable.
    ${!caseData.showLegalResolution ? "5. IMPORTANT: DO NOT include the final court decision or resolution in the analysis. Set the 'resolution' field to an empty string." : "5. Include the final court decision and resolution in the 'resolution' field."}
  `;

  const generateWithModel = async (modelName: string, isFallback: boolean = false) => {
    const thinkingBudget = isFallback ? 2048 : 4096;
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        thinkingConfig: { thinkingBudget }
      }
    });

    const text = response.text;
    if (!text) throw new Error(`Empty response from AI using model ${modelName}`);

    const parsedMemo = JSON.parse(text) as LegalMemo;

    const sources: Source[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }
    parsedMemo.sources = sources;
    return parsedMemo;
  };

  try {
    console.log(`Attempting generation with Primary Model: ${PRIMARY_MODEL}`);
    return await generateWithModel(PRIMARY_MODEL);
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn(`Primary model quota exceeded. Switching to fallback: ${FALLBACK_MODEL}`);
      try {
        return await generateWithModel(FALLBACK_MODEL, true);
      } catch (fallbackError) {
        console.error("Fallback model also failed:", fallbackError);
        throw fallbackError;
      }
    }
    console.error("Error generating memo:", error);
    throw error;
  }
};

// ─────────────────────────────────────────────
// 2. FEATURE: Counterargument Simulator
// ─────────────────────────────────────────────
export const generateCounterarguments = async (
  memo: LegalMemo,
  caseData: CaseData,
  language: Language
): Promise<CounteranalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a defense attorney. Based on the following legal analysis, generate the OPPOSING PARTY'S strongest counterarguments.

    ORIGINAL CASE TITLE: ${memo.title}
    LEGAL AREA: ${caseData.area}
    JURISDICTION: ${caseData.jurisdiction}
    CASE SUMMARY: ${memo.summary}
    ORIGINAL ISSUES: ${memo.issues.join('; ')}
    ORIGINAL IRAC CONCLUSIONS: ${memo.iracAnalysis.map(i => `${i.issue}: ${i.conclusion}`).join(' | ')}
    IDENTIFIED RISKS: ${memo.risks.join('; ')}

    Your task:
    1. Build the opposing party's strongest legal position
    2. Construct IRAC analysis from the opposing perspective
    3. Identify every weakness in the original party's case
    4. Propose all available defenses and counter-claims under Uzbek law

    Output language: ${LANG_MAP[language]}
    Tone: Professional legal memorandum
  `;

  const response = await ai.models.generateContent({
    model: PRIMARY_MODEL,
    contents: prompt,
    config: {
      systemInstruction: "You are a senior defense attorney. Build the strongest possible counterarguments for the opposing party based on the case analysis provided.",
      responseMimeType: 'application/json',
      responseSchema: COUNTER_SCHEMA,
      thinkingConfig: { thinkingBudget: 2048 }
    }
  });

  if (!response.text) throw new Error("Empty response from AI");
  return JSON.parse(response.text) as CounteranalysisResult;
};

// ─────────────────────────────────────────────
// 3. FEATURE: Legal Document Drafter
// ─────────────────────────────────────────────
export const draftLegalDocument = async (
  memo: LegalMemo,
  caseData: CaseData,
  docType: DocumentType,
  language: Language
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Draft a professional and complete ${docType} based on the following legal case analysis.

    CASE TITLE: ${memo.title}
    JURISDICTION: ${caseData.jurisdiction}
    LEGAL AREA: ${caseData.area}
    CASE SUMMARY: ${memo.summary}
    KEY LEGAL ISSUES: ${memo.issues.join('; ')}
    RECOMMENDED NEXT STEPS: ${memo.nextSteps.join('; ')}
    ${memo.resolution ? `COURT RESOLUTION: ${memo.resolution}` : ''}
    EVIDENCE REQUIRED: ${memo.evidenceChecklist.join('; ')}

    DRAFTING INSTRUCTIONS:
    - Create a complete, ready-to-use ${docType} suitable for Uzbekistan courts
    - Use proper legal formatting with numbered sections and formal headings
    - Include all standard legal formalities and opening/closing statements
    - Use placeholder brackets [PARTY NAME], [ADDRESS], [DATE], [COURT NAME], [CASE NUMBER] where specific details are needed
    - The document must be practical and court-ready, not a template explanation
    - Output entirely in ${LANG_MAP[language]}

    Return ONLY the document text itself. No commentary, no explanations.
  `;

  const response = await ai.models.generateContent({
    model: PRIMARY_MODEL,
    contents: prompt,
    config: {
      systemInstruction: "You are a senior legal draftsperson specializing in Uzbekistan court documents. Draft complete, professional, court-ready legal documents.",
      thinkingConfig: { thinkingBudget: 2048 }
    }
  });

  if (!response.text) throw new Error("Empty response from AI");
  return response.text;
};

// ─────────────────────────────────────────────
// 4. FEATURE: Document Upload & Fact Extraction
// ─────────────────────────────────────────────
export const extractFactsFromDocument = async (
  base64Data: string,
  mimeType: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: PRIMARY_MODEL,
    contents: [{
      role: 'user',
      parts: [
        {
          inlineData: { mimeType, data: base64Data }
        },
        {
          text: `Analyze this document and extract the key legal facts. Provide a clear, structured summary including:
1. The parties involved (use generic roles like "Plaintiff", "Defendant", "Company" - do not include real names)
2. The core legal dispute or situation
3. Key dates and events mentioned
4. The legal claims or issues at stake
5. Any relevant contractual terms, obligations, or violations mentioned

Present this as a factual case description suitable for legal analysis. Be concise, objective, and focus only on legally relevant information.`
        }
      ]
    }],
    config: {
      systemInstruction: "You are a legal document analyst. Extract key legal facts from uploaded documents concisely and clearly."
    }
  });

  if (!response.text) throw new Error("Could not extract text from document");
  return response.text;
};

// ─────────────────────────────────────────────
// 5. FEATURE: Audio Case Briefing (TTS)
// ─────────────────────────────────────────────
export const generateAudioBriefing = async (
  memo: LegalMemo,
  language: Language
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  const briefingScript = `
Legal Case Briefing: ${memo.title}.

${memo.summary}

Key Legal Issues: ${memo.issues.slice(0, 4).join('. ')}.

Risk Assessment: ${memo.risks.slice(0, 3).join('. ')}.

Recommended Next Steps: ${memo.nextSteps.slice(0, 4).join('. ')}.

${memo.disclaimer}
  `.trim();

  const response = await (ai.models.generateContent as any)({
    model: TTS_MODEL,
    contents: [{ role: 'user', parts: [{ text: briefingScript }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Aoede' }
        }
      }
    }
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (!part?.inlineData?.data) throw new Error("No audio data received from TTS model");

  return part.inlineData.data; // base64 PCM 16-bit 24kHz mono
};

// ─────────────────────────────────────────────
// 6. FEATURE: Case Timeline & Deadline Tracker
// ─────────────────────────────────────────────
export const generateTimeline = async (
  memo: LegalMemo,
  caseData: CaseData,
  language: Language
): Promise<CaseTimeline> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the following legal case and create a comprehensive chronological timeline.

    CASE TITLE: ${memo.title}
    LEGAL AREA: ${caseData.area}
    JURISDICTION: ${caseData.jurisdiction}

    CASE SUMMARY:
    ${memo.summary}

    ORIGINAL FACTS SUBMITTED BY USER:
    ${caseData.facts}

    KEY LEGAL ISSUES: ${memo.issues.join('; ')}
    NEXT STEPS: ${memo.nextSteps.join('; ')}

    TIMELINE INSTRUCTIONS:
    1. Extract ALL dates and events explicitly mentioned in the case summary and facts
    2. Add the relevant procedural deadlines under Uzbek civil/criminal/administrative procedure (whichever applies to ${caseData.area})
    3. Add the statute of limitations applicable to this case type under Uzbek law
    4. Add key upcoming deadlines (appeal windows, filing deadlines, etc.)
    5. Classify each item as exactly one of: 'fact' (historical event), 'deadline' (upcoming legal deadline), 'missed' (a deadline that was likely missed), 'upcoming' (important future date)
    6. Sort all events chronologically
    7. Flag any critical time-based risks as critical warnings

    Output language: ${LANG_MAP[language]}
  `;

  const response = await ai.models.generateContent({
    model: PRIMARY_MODEL,
    contents: prompt,
    config: {
      systemInstruction: "You are a legal timeline analyst specializing in Uzbekistan procedural law. Create accurate, actionable case timelines with real deadlines.",
      responseMimeType: 'application/json',
      responseSchema: TIMELINE_SCHEMA,
      thinkingConfig: { thinkingBudget: 2048 }
    }
  });

  if (!response.text) throw new Error("Empty response from AI");
  return JSON.parse(response.text) as CaseTimeline;
};
