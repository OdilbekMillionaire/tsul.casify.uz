import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CaseData, Language, LegalMemo, Source } from "../types";

// Configuration Constants
const PRIMARY_MODEL = 'gemini-3-pro-preview';
const FALLBACK_MODEL = 'gemini-3-flash-preview';

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

// Helper to detect quota/rate limit errors
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

  // Encapsulated generation function to allow retries
  const generateWithModel = async (modelName: string, isFallback: boolean = false) => {
    // Adjust thinking budget: Pro gets more, Flash gets less (for speed/quota efficiency)
    const thinkingBudget = isFallback ? 2048 : 4096;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // Enable Search Grounding
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        thinkingConfig: { thinkingBudget: thinkingBudget } 
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error(`Empty response from AI using model ${modelName}`);
    }

    const parsedMemo = JSON.parse(text) as LegalMemo;

    // Extract Grounding Metadata (Sources)
    const sources: Source[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    // Attach sources to the memo object
    parsedMemo.sources = sources;

    return parsedMemo;
  };

  try {
    // 1. Attempt with Primary Model (Gemini 3 Pro)
    console.log(`Attempting generation with Primary Model: ${PRIMARY_MODEL}`);
    return await generateWithModel(PRIMARY_MODEL);

  } catch (error) {
    // 2. Check for Quota/Rate Limit Errors
    if (isQuotaError(error)) {
      console.warn(`Primary model (${PRIMARY_MODEL}) quota exceeded or busy. Switching to Fallback: ${FALLBACK_MODEL}`);
      
      try {
        // 3. Retry with Fallback Model (Gemini 3 Flash)
        return await generateWithModel(FALLBACK_MODEL, true);
      } catch (fallbackError) {
        // If fallback also fails, throw the original error or the new one
        console.error("Fallback model also failed:", fallbackError);
        throw fallbackError;
      }
    }

    // If it's not a quota error (e.g., validation error, network down), throw immediately
    console.error("Error generating memo:", error);
    throw error;
  }
};