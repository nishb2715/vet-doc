import Groq from "groq-sdk";
import { GeminiAnalysis } from "./types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeWithGroqVision(
  imageBase64: string,
  mimeType: string
): Promise<GeminiAnalysis> {
  const completion = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    max_tokens: 1024,
    temperature: 0.2,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
            },
          },
          {
            type: "text",
            text: `You are an expert agricultural scientist. Analyze this crop/plant image.
Return ONLY valid JSON (no markdown, no extra text):
{
  "cropIdentified": "Crop name in English (and Hindi if known, e.g. 'Wheat / गेहूँ')",
  "diseaseDetected": true or false,
  "diseaseName": "Disease name or null",
  "diseaseDescription": "2-3 sentences about symptoms and yield impact",
  "harvestReady": true or false,
  "harvestNote": "Brief harvest status note",
  "confidence": "high" or "medium" or "low",
  "overallHealth": "healthy" or "mild" or "moderate" or "severe"
}`,
          },
        ],
      },
    ],
  });

  const text = completion.choices[0]?.message?.content || "";
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(clean) as GeminiAnalysis;
  } catch {
    return {
      cropIdentified: "Analysis Error",
      diseaseDetected: false,
      diseaseName: null,
      diseaseDescription: "Could not parse image. Please try a clearer photo.",
      harvestReady: false,
      harvestNote: "Unable to determine.",
      confidence: "low",
      overallHealth: "mild",
    };
  }
}