interface ErrorCardProps {
  error: string;
}

export default function ErrorCard({ error }: ErrorCardProps) {
  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-semibold text-red-800">Error</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    </div>
  );
}