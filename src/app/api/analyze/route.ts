import { NextRequest, NextResponse } from "next/server";
import { analyzeWithGroqVision } from "@/lib/groq-vision";
import { researchTreatment } from "@/lib/groq-research";
import { CropAnalysisResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    // Check API key first
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "gsk_your_groq_api_key_here") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Groq API key not set. Please add GROQ_API_KEY to your env variables.",
        },
        { status: 500, headers: corsHeaders }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: "No image file provided." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file. Please upload a JPEG, PNG or WebP image." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file size — max 10MB
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Image is too large. Please upload an image under 10MB." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Convert to base64
    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    console.log(
      `[CropDoctor] Analyzing: ${imageFile.name} | ${imageFile.type} | ${(imageFile.size / 1024).toFixed(1)}KB`
    );

    // Step 1 — Groq Vision: identify crop and disease
    console.log("[CropDoctor] Step 1: Vision analysis with LLaMA 4 Scout...");
    const visionResult = await analyzeWithGroqVision(base64, imageFile.type);
    console.log(
      `[CropDoctor] Vision done: ${visionResult.cropIdentified} | Disease: ${visionResult.diseaseName || "None"}`
    );

    // Step 2 — Groq LLaMA3: research treatments
    console.log("[CropDoctor] Step 2: Treatment research with LLaMA3...");
    const researchResult = await researchTreatment(visionResult);
    console.log(`[CropDoctor] Research done. Urgency: ${researchResult.urgencyLevel}`);

    const result: CropAnalysisResult = {
      vision: visionResult,
      research: researchResult,
      analysisId: `crop_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: result }, { headers: corsHeaders });

  } catch (error: unknown) {
    console.error("[CropDoctor] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("invalid_api_key") || message.includes("Invalid API Key")) {
      return NextResponse.json(
        { success: false, error: "Invalid Groq API key." },
        { status: 401, headers: corsHeaders }
      );
    }
    if (message.includes("rate_limit") || message.includes("quota")) {
      return NextResponse.json(
        { success: false, error: "API rate limit hit. Please wait 30 seconds and try again." },
        { status: 429, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: false, error: `Analysis failed: ${message}` },
      { status: 500, headers: corsHeaders }
    );
  }
}