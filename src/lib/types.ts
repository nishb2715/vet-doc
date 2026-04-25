export interface GeminiAnalysis {
  cropIdentified: string;
  diseaseDetected: boolean;
  diseaseName: string | null;
  diseaseDescription: string;
  harvestReady: boolean;
  harvestNote: string;
  confidence: "high" | "medium" | "low";
  overallHealth: "healthy" | "mild" | "moderate" | "severe";
}

export interface ResearchResult {
  treatment: string;
  prevention: string;
  urgencyLevel: "low" | "medium" | "high" | "critical";
  estimatedRecoveryDays: number | null;
  organicTreatment?: string;
  chemicalTreatment?: string;
}

export interface CropAnalysisResult {
  vision: GeminiAnalysis;
  research: ResearchResult;
  analysisId: string;
  timestamp: string;
}