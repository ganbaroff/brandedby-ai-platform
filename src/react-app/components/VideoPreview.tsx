import { Play, User } from "lucide-react";
import { memo } from "react";
import { getAspectRatioClass, getFormatById } from "@/shared/video-formats";

interface VideoPreviewProps {
  formatId: string;
  previewImage?: string;
  className?: string;
}

const VideoPreview = memo(function VideoPreview({
  formatId,
  previewImage,
  className = "",
}: VideoPreviewProps) {
  const format = getFormatById(formatId);

  if (!format) {
    return null;
  }

  const aspectRatioClass = getAspectRatioClass(format.aspectRatio);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Your Video Preview
        </h3>
        <p className="text-sm md:text-base text-gray-600">
          This is how your video will look on {format.platform}
        </p>
      </div>

      {/* Preview Container */}
      <div className="flex justify-center items-center min-h-[400px] md:min-h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 md:p-8">
        {/* Phone/Desktop Frame */}
        <div className="relative">
          {/* Format Label */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${format.color} text-white rounded-full text-xs md:text-sm font-semibold shadow-lg`}>
              <span>{format.name}</span>
              <span className="opacity-80">({format.aspectRatio})</span>
            </div>
          </div>

          {/* Video Frame */}
          <div
            className={`
              relative bg-black rounded-2xl overflow-hidden shadow-2xl
              ${format.aspectRatio === "9:16" ? "w-[280px] md:w-[360px]" : ""}
              ${format.aspectRatio === "16:9" ? "w-full max-w-[500px] md:max-w-[640px]" : ""}
              ${format.aspectRatio === "1:1" ? "w-[320px] md:w-[400px]" : ""}
            `}
          >
            <div className={`${aspectRatioClass} relative`}>
              {/* Preview Image or Placeholder */}
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Video preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center text-white p-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
                    <User className="w-10 h-10 md:w-12 md:h-12 text-white/60" />
                  </div>
                  <p className="text-sm md:text-base text-white/80 text-center mb-2">
                    Upload a photo
                  </p>
                  <p className="text-xs text-white/60 text-center">
                    Your video will appear here
                  </p>
                </div>
              )}

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-gray-900 ml-1" fill="currentColor" />
                </div>
              </div>

              {/* Platform UI Overlay (optional decorative elements) */}
              {format.aspectRatio === "9:16" && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm" />
                    <div className="flex-1">
                      <div className="h-3 bg-white/20 backdrop-blur-sm rounded w-24 mb-1" />
                      <div className="h-2 bg-white/10 backdrop-blur-sm rounded w-16" />
                    </div>
                  </div>
                  <div className="h-2 bg-white/10 backdrop-blur-sm rounded w-3/4" />
                </div>
              )}
            </div>

            {/* Resolution Badge */}
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-white text-xs font-mono">
              {format.width}x{format.height}
            </div>
          </div>

          {/* Dimensions Info */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className="text-xs md:text-sm text-gray-500 text-center">
              {format.width} × {format.height} pixels
            </div>
          </div>
        </div>
      </div>

      {/* Platform Tips */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm">Optimized</h4>
          </div>
          <p className="text-xs text-gray-600">
            Perfect aspect ratio for {format.platform}
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">HD</span>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm">Quality</h4>
          </div>
          <p className="text-xs text-gray-600">
            High resolution for crystal clear output
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">⚡</span>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm">Fast</h4>
          </div>
          <p className="text-xs text-gray-600">
            Generated in just seconds
          </p>
        </div>
      </div>
    </div>
  );
});

export default VideoPreview;
