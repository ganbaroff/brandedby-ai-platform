import { Check, Instagram, Linkedin, Youtube } from "lucide-react";
import { memo } from "react";
import { VIDEO_FORMATS, type VideoFormat } from "@/shared/video-formats";

// Platform icons mapping
const PlatformIcon = ({ iconType, className }: { iconType: VideoFormat["iconType"]; className?: string }) => {
  switch (iconType) {
    case "instagram":
      return <Instagram className={className} />;
    case "linkedin":
      return <Linkedin className={className} />;
    case "youtube":
      return <Youtube className={className} />;
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

interface VideoFormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (formatId: string) => void;
  className?: string;
}

const VideoFormatSelector = memo(function VideoFormatSelector({
  selectedFormat,
  onFormatChange,
  className = "",
}: VideoFormatSelectorProps) {
  const selected = VIDEO_FORMATS.find((f) => f.id === selectedFormat);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Choose Video Format
        </h3>
        <p className="text-base md:text-lg text-gray-600">
          Which platform are you creating for?
        </p>
      </div>

      {/* Format Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {VIDEO_FORMATS.map((format) => {
          const isSelected = selectedFormat === format.id;

          return (
            <button
              key={format.id}
              onClick={() => onFormatChange(format.id)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                ${
                  isSelected
                    ? "border-primary-500 bg-primary-50 shadow-lg scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }
              `}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${format.color} p-2.5 flex items-center justify-center`}
              >
                <PlatformIcon iconType={format.iconType} className="w-full h-full text-white" />
              </div>

              {/* Info */}
              <div className="text-center space-y-1">
                <h4 className="font-bold text-gray-900 text-sm">
                  {format.name}
                </h4>
                <p className="text-xs text-gray-600">{format.aspectRatio}</p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {format.description}
                </p>
                <p className="text-xs font-mono text-gray-400">
                  {format.width}x{format.height}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Format Info */}
      {selected && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-r ${selected.color} p-3 flex items-center justify-center flex-shrink-0`}
            >
              <PlatformIcon iconType={selected.iconType} className="w-full h-full text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-900 mb-1">
                {selected.name}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {selected.description}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Size:</span>
                  {selected.width}x{selected.height}px
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Aspect Ratio:</span>
                  {selected.aspectRatio}
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Platform:</span>
                  {selected.platform}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default VideoFormatSelector;
