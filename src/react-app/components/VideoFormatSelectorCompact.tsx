import { Check } from "lucide-react";
import { memo } from "react";
import { VIDEO_FORMATS, type VideoFormat } from "@/shared/video-formats";

// Platform icons mapping (reused from VideoFormatSelector)
const PlatformIcon = ({ iconType, className }: { iconType: VideoFormat["iconType"]; className?: string }) => {
  switch (iconType) {
    case "instagram":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
        </svg>
      );
    case "linkedin":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect width="4" height="12" x="2" y="9"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      );
    case "youtube":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
          <path d="m10 15 5-3-5-3z"></path>
        </svg>
      );
    case "tiktok":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      );
    case "facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    default:
      return null;
  }
};

interface VideoFormatSelectorCompactProps {
  selectedFormat: string;
  onFormatChange: (formatId: string) => void;
  className?: string;
}

const VideoFormatSelectorCompact = memo(function VideoFormatSelectorCompact({
  selectedFormat,
  onFormatChange,
  className = "",
}: VideoFormatSelectorCompactProps) {
  const selected = VIDEO_FORMATS.find((f) => f.id === selectedFormat);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          Export Format
        </h3>
        <p className="text-sm text-gray-600">
          Choose the platform format for your video
        </p>
      </div>

      {/* Compact Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {VIDEO_FORMATS.map((format) => {
          const isSelected = selectedFormat === format.id;

          return (
            <button
              key={format.id}
              onClick={() => onFormatChange(format.id)}
              className={`
                relative p-3 rounded-lg border-2 transition-all duration-200 group
                ${
                  isSelected
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm"
                }
              `}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-r ${format.color} p-2 flex items-center justify-center`}
              >
                <PlatformIcon iconType={format.iconType} className="w-full h-full text-white" />
              </div>

              {/* Info */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 text-xs leading-tight mb-0.5">
                  {format.name}
                </h4>
                <p className="text-[10px] text-gray-500">{format.aspectRatio}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Format Info */}
      {selected && (
        <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-r ${selected.color} p-2 flex items-center justify-center flex-shrink-0`}
            >
              <PlatformIcon iconType={selected.iconType} className="w-full h-full text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-gray-900">
                {selected.name}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-1">
                {selected.description}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span>{selected.width}×{selected.height}</span>
                <span>•</span>
                <span>{selected.aspectRatio}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default VideoFormatSelectorCompact;
