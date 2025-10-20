export interface Suggestion {
  suggestion: string;
  example: string;
  impact: string;
  type: string;
}

export interface AnalysisResult {
  compatibilityScore: number;
  missingKeywords: string[];
  suggestions: Suggestion[];
}