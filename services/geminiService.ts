import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    compatibilityScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 representing how well the resume matches the job description.",
    },
    missingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of crucial keywords from the job description that are missing from the resume.",
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          suggestion: {
            type: Type.STRING,
            description: "A specific, actionable suggestion for improving the resume.",
          },
          example: {
            type: Type.STRING,
            description: "A concrete example of how to implement the suggestion in the resume text.",
          },
          impact: {
            type: Type.STRING,
            description: "The estimated impact of the suggestion. Must be one of: 'High', 'Medium', 'Low'.",
          },
          type: {
            type: Type.STRING,
            description: "The category of the suggestion. Must be one of: 'Keyword Addition', 'Wording Improvement', 'Section Restructure'.",
          },
        },
        required: ["suggestion", "example", "impact", "type"],
      },
      description: "A list of categorized suggestions for improvement.",
    },
  },
  required: ["compatibilityScore", "missingKeywords", "suggestions"],
};

export async function analyzeResumeAndJobDescription(
  resumeFileBase64: string,
  jobDescriptionText: string
): Promise<AnalysisResult> {
  const resumePart = {
    inlineData: {
      mimeType: 'application/pdf',
      data: resumeFileBase64,
    },
  };

  const textPart = {
    text: `
    First, identify the specific job role from the provided job description (e.g., "AI Engineer", "Senior Frontend Engineer").

    Then, adopt the persona of an expert recruiter and hiring manager who specializes in hiring for that EXACT role. Your task is to analyze the provided resume PDF against the job description from the perspective of someone hiring for this specific position. Your feedback must be highly tailored and reflect deep knowledge of what a top candidate for this role looks like.

    Follow these steps:
    1. Extract all text content from the resume PDF.
    2. Calculate a compatibility score as a percentage (integer from 0 to 100), representing how well the resume matches the job description.
    3. Extract the most important skills and keywords from the job description.
    4. Identify which of these crucial keywords are missing from the resume. List up to 10 of the most important missing keywords.
    5. Provide 3-5 specific, actionable suggestions for improving the resume. Each suggestion should focus on incorporating a missing keyword or rephrasing a section to better align with the job description. For each suggestion, provide:
       a. A concrete example of how to apply it.
       b. An impact category: 'High', 'Medium', or 'Low'. 'High' impact suggestions address major gaps or significantly boost alignment.
       c. A suggestion type: 'Keyword Addition', 'Wording Improvement', or 'Section Restructure'.
    6. Return your complete analysis in a valid JSON object that strictly adheres to the provided schema. Do not include any introductory text, closing remarks, or markdown formatting outside of the JSON structure.

    Here is the target job description:
    ---
    ${jobDescriptionText}
    ---
  `
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [resumePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
}
