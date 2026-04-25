import { CropAnalysisResult } from "@/lib/types";

interface ResultCardProps {
  result: CropAnalysisResult;
  imagePreview?: string;
}

export default function ResultCard({ result, imagePreview }: ResultCardProps) {
  const { vision, research } = result;

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "mild":
        return "bg-yellow-100 text-yellow-800";
      case "moderate":
        return "bg-orange-100 text-orange-800";
      case "severe":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-6">
      {/* Vision Analysis Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-soil-900/5 overflow-hidden border border-soil-100">
        {imagePreview && (
          <div className="relative h-48 w-full bg-soil-50">
            <img 
              src={imagePreview} 
              alt="Analyzed Crop" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <span className="text-white font-bold text-lg">Analysis Report</span>
            </div>
          </div>
        )}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🌾 Crop Analysis</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Crop Identified</p>
            <p className="font-semibold text-lg">{vision.cropIdentified}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Overall Health</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(vision.overallHealth)}`}>
              {vision.overallHealth}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Disease Detected</p>
            <p className="font-medium">{vision.diseaseDetected ? vision.diseaseName || "Yes" : "No"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Confidence</p>
            <p className="font-medium capitalize">{vision.confidence}</p>
          </div>
        </div>

        {vision.diseaseDescription && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{vision.diseaseDescription}</p>
          </div>
        )}

        {vision.harvestNote && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Harvest Status:</span> {vision.harvestNote}
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Research/Treatment Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">💊 Treatment Recommendations</h2>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">Urgency Level:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(research.urgencyLevel)}`}>
            {research.urgencyLevel}
          </span>
          {research.estimatedRecoveryDays && (
            <span className="text-sm text-gray-500 ml-2">
              (~{research.estimatedRecoveryDays} days to recover)
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700">Treatment</h3>
            <p className="text-gray-600">{research.treatment}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Prevention</h3>
            <p className="text-gray-600">{research.prevention}</p>
          </div>

          {research.organicTreatment && (
            <div>
              <h3 className="font-semibold text-green-700">🌱 Organic Treatment</h3>
              <p className="text-gray-600">{research.organicTreatment}</p>
            </div>
          )}

          {research.chemicalTreatment && (
            <div>
              <h3 className="font-semibold text-blue-700">🧪 Chemical Treatment</h3>
              <p className="text-gray-600">{research.chemicalTreatment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}