interface ErrorCardProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorCard({ error, onRetry }: ErrorCardProps) {
  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col items-center text-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-red-800 text-lg">Analysis Failed</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
        <button
          onClick={onRetry}
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    </div>
  );
}