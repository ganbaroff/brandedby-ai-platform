export type VideoFormat = {
  id: string;
  name: string;
  platform: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  iconType: "instagram" | "tiktok" | "facebook" | "linkedin" | "youtube";
  color: string;
  gradientFrom: string;
  gradientTo: string;
};

export const VIDEO_FORMATS: VideoFormat[] = [
  {
    id: "instagram-story",
    name: "Instagram Story",
    platform: "Instagram",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    description: "Vertical video for Stories and Reels",
    iconType: "instagram",
    color: "from-purple-500 to-pink-500",
    gradientFrom: "#8B5CF6",
    gradientTo: "#EC4899",
  },
  {
    id: "instagram-feed",
    name: "Instagram Feed",
    platform: "Instagram",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
    description: "Square video for main feed",
    iconType: "instagram",
    color: "from-purple-500 to-pink-500",
    gradientFrom: "#8B5CF6",
    gradientTo: "#EC4899",
  },
  {
    id: "tiktok",
    name: "TikTok",
    platform: "TikTok",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    description: "Vertical video for TikTok",
    iconType: "tiktok",
    color: "from-black to-teal-500",
    gradientFrom: "#000000",
    gradientTo: "#14B8A6",
  },
  {
    id: "facebook",
    name: "Facebook",
    platform: "Facebook",
    width: 1280,
    height: 720,
    aspectRatio: "16:9",
    description: "Horizontal video for Facebook",
    iconType: "facebook",
    color: "from-blue-600 to-blue-400",
    gradientFrom: "#1877F2",
    gradientTo: "#60A5FA",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    platform: "LinkedIn",
    width: 1280,
    height: 720,
    aspectRatio: "16:9",
    description: "Horizontal video for LinkedIn",
    iconType: "linkedin",
    color: "from-blue-700 to-blue-500",
    gradientFrom: "#0A66C2",
    gradientTo: "#3B82F6",
  },
  {
    id: "youtube-shorts",
    name: "YouTube Shorts",
    platform: "YouTube",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    description: "Vertical video for Shorts",
    iconType: "youtube",
    color: "from-red-600 to-red-400",
    gradientFrom: "#FF0000",
    gradientTo: "#EF4444",
  },
  {
    id: "youtube-standard",
    name: "YouTube Standard",
    platform: "YouTube",
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    description: "Standard horizontal video",
    iconType: "youtube",
    color: "from-red-600 to-red-400",
    gradientFrom: "#FF0000",
    gradientTo: "#EF4444",
  },
];

export function getFormatById(id: string): VideoFormat | undefined {
  return VIDEO_FORMATS.find((format) => format.id === id);
}

export function getAspectRatioClass(aspectRatio: string): string {
  const ratioMap: Record<string, string> = {
    "9:16": "aspect-[9/16]",
    "16:9": "aspect-[16/9]",
    "1:1": "aspect-square",
  };
  return ratioMap[aspectRatio] || "aspect-video";
}
