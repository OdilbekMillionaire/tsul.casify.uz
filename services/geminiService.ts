import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CaseData, Language, LegalMemo } from "../types";

const SYSTEM_INSTRUCTION = `
You are a Senior Associate Lawyer at a top law firm in Tashkent. You provide internal legal memos based on Uzbek legislation. 
You DO NOT cite specific article numbers unless you are 100% certain, otherwise focus on legal principles. 
Your tone is authoritative, objective, and professional. 
NEVER use phrases like 'As an AI' or 'I assume'. Write as if you are a human lawyer.
Always output the analysis in the REQUESTED LANGUAGE.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A formal title for the memorandum" },
    summary: { type: Type.STRING, description: "Executive summary of the case and advice" },
    issues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of legal issues identified" },
    iracAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING, description: " The legal issue being analyzed" },
          rule: { type: Type.STRING, description: "The relevant legal rule or principle" },
          application: { type: Type.STRING, description: "Application of the rule to the facts" },
          conclusion: { type: Type.STRING, description: "Conclusion for this specific issue" }
        },
        required: ["issue", "rule", "application", "conclusion"]
      },
      description: "Detailed IRAC analysis for each issue"
    },
    risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Procedural and substantive risks" },
    evidenceChecklist: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Documents and evidence needed" },
    nextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Concrete next steps for the lawyer" },
    disclaimer: { type: Type.STRING, description: "Professional legal disclaimer" }
  },
  required: ["title", "summary", "issues", "iracAnalysis", "risks", "evidenceChecklist", "nextSteps", "disclaimer"]
};

export const generateLegalMemo = async (
  caseData: CaseData,
  language: Language
): Promise<LegalMemo> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Mapping language code to full language name for the prompt
  const langMap: Record<Language, string> = {
    'uz_lat': 'Uzbek (Latin Script)',
    'uz_cyr': 'Uzbek (Cyrillic Script)',
    'ru': 'Russian',
    'en': 'English'
  };

  const targetLang = langMap[language];

  const prompt = `
    Analyze the following case facts and generate a legal memorandum in ${targetLang}.
    
    CASE METADATA:
    - Title: ${caseData.title}
    - Jurisdiction: ${caseData.jurisdiction}
    - Legal Area: ${caseData.area}
    - Parties: ${caseData.claimant} vs ${caseData.respondent}
    - Tone: ${caseData.tone}
    - Depth: ${caseData.isDeepAnalysis ? "Deep/Comprehensive" : "Standard"}

    FACTS:
    ${caseData.facts}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using the best model for reasoning
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        thinkingConfig: { thinkingBudget: 4096 } // Give it some budget for complex legal reasoning
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(text) as LegalMemo;
  } catch (error) {
    console.error("Error generating memo:", error);
    throw error;
  }
};