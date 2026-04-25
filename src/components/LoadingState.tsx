interface LoadingStateProps {
  stage: "idle" | "gemini" | "groq" | "combining" | "done" | "error";
}

export default function LoadingState({ stage }: LoadingStateProps) {
  const getStageMessage = () => {
    switch (stage) {
      case "gemini":
        return "Analyzing image with AI...";
      case "groq":
        return "Researching treatment options...";
      case "combining":
        return "Compiling results...";
      default:
        return "Processing...";
    }
  };

  const getProgress = () => {
    switch (stage) {
      case "gemini":
        return 30;
      case "groq":
        return 60;
      case "combining":
        return 90;
      default:
        return 10;
    }
  };

  if (stage === "idle" || stage === "done" || stage === "error") {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="text-center mb-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-700 font-medium">{getStageMessage()}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${getProgress()}%` }}
        ></div>
      </div>
    </div>
  );
}