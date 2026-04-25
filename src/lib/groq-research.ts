import Groq from "groq-sdk";
import { GeminiAnalysis, ResearchResult } from "./types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function researchTreatment(
  visionResult: GeminiAnalysis
): Promise<ResearchResult> {
  // If no disease detected, return a healthy response
  if (!visionResult.diseaseDetected || !visionResult.diseaseName) {
    return {
      treatment: "No treatment needed. The crop appears to be healthy.",
      prevention: "Continue regular monitoring and maintain good agricultural practices.",
      urgencyLevel: "low",
      estimatedRecoveryDays: null,
      organicTreatment: undefined,
      chemicalTreatment: undefined,
    };
  }

  const prompt = `You are an expert agricultural scientist. Provide treatment recommendations for the following crop disease:

Crop: ${visionResult.cropIdentified}
Disease: ${visionResult.diseaseName}
Overall Health: ${visionResult.overallHealth}

Return ONLY valid JSON (no markdown, no extra text):
{
  "treatment": "Brief treatment recommendation",
  "prevention": "Prevention measures",
  "urgencyLevel": "low" or "medium" or "high" or "critical",
  "estimatedRecoveryDays": number or null,
  "organicTreatment": "Organic treatment options (optional)",
  "chemicalTreatment": "Chemical treatment options (optional)"
}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 512,
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content || "";
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(clean) as ResearchResult;
  } catch {
    return {
      treatment: "Consult a local agricultural expert for treatment recommendations.",
      prevention: "Monitor the crop regularly and remove affected parts.",
      urgencyLevel: "medium",
      estimatedRecoveryDays: null,
    };
  }
}