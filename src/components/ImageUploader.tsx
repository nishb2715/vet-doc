interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedFile: File | null;
  imagePreview: string;
  isAnalyzing?: boolean;
}

export default function ImageUploader({ onImageSelect, selectedFile, imagePreview, isAnalyzing }: ImageUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onImageSelect(null as unknown as File, "");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />
            {!isAnalyzing && (
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <>
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-4 text-gray-600">Click to upload an image</p>
            <p className="text-sm text-gray-500">or drag and drop</p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={isAnalyzing}
        />
        {!imagePreview && !isAnalyzing && (
          <label
            htmlFor="file-upload"
            className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700"
          >
            Select Image
          </label>
        )}
        {isAnalyzing && imagePreview && (
          <p className="mt-4 text-sm text-gray-500">Analyzing...</p>
        )}
      </div>
    </div>
  );
}