import { NextResponse } from "next/server";

export async function GET() {
  const groqConfigured =
    !!process.env.GROQ_API_KEY &&
    process.env.GROQ_API_KEY !== "gsk_your_groq_api_key_here";

  return NextResponse.json({
    status: groqConfigured ? "ready" : "missing_key",
    keys: { groq: groqConfigured },
    message: groqConfigured
      ? "✅ Groq API key configured! App is ready."
      : "❌ Please add GROQ_API_KEY to your .env.local file. Get it free at console.groq.com/keys",
  });
}