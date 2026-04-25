"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import LoadingState from "@/components/LoadingState";
import ResultCard from "@/components/ResultCard";
import ErrorCard from "@/components/ErrorCard";
import { CropAnalysisResult } from "@/lib/types";

type Stage = "idle" | "gemini" | "groq" | "combining" | "done" | "error";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [stage, setStage] = useState<Stage>("idle");
  const [result, setResult] = useState<CropAnalysisResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleImageSelect = (file: File | null, preview: string) => {
    setSelectedFile(file);
    setImagePreview(preview);
    // Keep the old result until new analysis starts
    setError("");
    setStage("idle");
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setError("");
    setResult(null); // Clear only when starting new analysis
    setStage("gemini");

    // Track timers to clear them when request finishes
    const timers: any[] = [];

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      // Simulate stage progression for UX
      timers.push(setTimeout(() => setStage(prev => (prev === "gemini" ? "groq" : prev)), 3500));
      timers.push(setTimeout(() => setStage(prev => (prev === "groq" ? "combining" : prev)), 7500));

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data.data);
      setStage("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStage("error");
    } finally {
      // Clear all timers regardless of outcome
      timers.forEach(clearTimeout);
    }
  };

  const handleReset = () => {
    setStage("idle");
    // Keep result visible as per user request
    setError("");
    setSelectedFile(null);
    setImagePreview("");
  };

  const isAnalyzing = ["gemini", "groq", "combining"].includes(stage);

  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(160deg, #f7f3eb 0%, #eef5ee 50%, #f5edd8 100%)" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-soil-200/50" style={{ background: "rgba(247,243,235,0.92)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-leaf-600 flex items-center justify-center text-white text-xl">🌿</div>
            <div>
              <h1 className="font-display text-lg font-bold text-soil-900 leading-tight">Crop Doctor</h1>
              <p className="text-xs text-soil-400">फसल डॉक्टर • AI Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-leaf-50 border border-leaf-200 rounded-full">
            <div className="w-2 h-2 rounded-full bg-leaf-500 pulse-dot" />
            <span className="text-xs text-leaf-700 font-medium">AI Ready</span>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Hero text */}
        {stage === "idle" && !selectedFile && !result && (
          <div className="text-center py-2">
            <h2 className="font-display text-3xl font-bold text-soil-900 leading-tight">
              Apni Fasal Ki<br />
              <span className="text-leaf-600">Bimari Pehchaano</span>
            </h2>
            <p className="text-soil-500 text-sm mt-2">
              Photo upload karo — AI se instant diagnosis, gharelu upchar aur Indian pesticide tips pao
            </p>
          </div>
        )}

        {/* Image Upload */}
        {stage !== "done" && !isAnalyzing && (
          <ImageUploader 
            onImageSelect={handleImageSelect} 
            selectedFile={selectedFile}
            imagePreview={imagePreview}
            isAnalyzing={isAnalyzing} 
          />
        )}

        {/* Analyze Button */}
        {selectedFile && stage === "idle" && (
          <button
            onClick={handleAnalyze}
            className="w-full py-4 bg-gradient-to-r from-leaf-600 to-leaf-700 hover:from-leaf-700 hover:to-leaf-800 text-white font-bold text-lg rounded-2xl shadow-lg shadow-leaf-900/20 transition-all duration-200 active:scale-95 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            🔬 Diagnosis Karo!
          </button>
        )}

        {/* Loading */}
        {isAnalyzing && (
          <LoadingState stage={stage as "gemini" | "groq" | "combining"} />
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <>
            <ResultCard result={result} imagePreview={imagePreview || (result as any).imageUrl} />
            {stage === "done" && (
              <button
                onClick={handleReset}
                className="w-full py-3.5 border-2 border-soil-300 text-soil-700 font-semibold rounded-2xl hover:bg-soil-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nayi Photo Analyse Karo
              </button>
            )}
          </>
        )}


        {/* Error */}
        {stage === "error" && (
          <ErrorCard error={error} onRetry={handleReset} />
        )}

        {/* How it works */}
        {stage === "idle" && !selectedFile && (
          <div className="result-card rounded-2xl p-5">
            <h3 className="font-display text-base font-bold text-soil-800 mb-4 text-center">
              Kaise Kaam Karta Hai?
            </h3>
            <div className="space-y-3">
              {[
                { icon: "📸", title: "Photo Lo", desc: "Beemaar patti ya fasal ki photo kheeecho" },
                { icon: "🔬", title: "AI Analysis", desc: "Gemini Vision fasal aur bimari pehchanta hai" },
                { icon: "🤖", title: "Research", desc: "Groq AI + Tavily treatment dhundh kar laata hai" },
                { icon: "💊", title: "Report Milti Hai", desc: "Upchar, keetnaashak aur gharelu nuskhe milte hain" },
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-soil-100 flex items-center justify-center text-xl flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-soil-800 text-sm">{step.title}</p>
                    <p className="text-soil-500 text-xs">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}