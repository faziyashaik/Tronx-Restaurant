import type { Dish } from "@/types";

export interface VideoPreset {
  id: string;
  videoUrl: string;
  fallbackVideoUrl?: string;
  posterUrl: string;
  objectPosition: string;
  aspectRatioClass?: string;
  focalTag?: string;
  tone: "warm" | "sizzling" | "delicate" | "refreshing";
}

// The two curated video assets available in the project
export const PRIMARY_FOOD_VIDEO_1 = "/videos/food-video-1.mp4";
export const PRIMARY_FOOD_VIDEO_2 = "/videos/food-video-2.mp4";

// Robust fallback urls pointing to demo assets in case needed
export const FALLBACK_FOOD_VIDEO_1 = "/videos/demo-video-1.mp4";
export const FALLBACK_FOOD_VIDEO_2 = "/videos/demo-video-2.mp4";

/**
 * Editorial crop presets to give each dish a unique visual framing,
 * avoiding the look of identical video loops while reusing the two high-quality assets.
 */
export const VIDEO_CROP_PRESETS: Array<{
  videoUrl: string;
  fallbackVideoUrl: string;
  objectPosition: string;
  tone: "warm" | "sizzling" | "delicate" | "refreshing";
  focalTag: string;
}> = [
  {
    videoUrl: PRIMARY_FOOD_VIDEO_1,
    fallbackVideoUrl: FALLBACK_FOOD_VIDEO_1,
    objectPosition: "center 42%",
    tone: "sizzling",
    focalTag: "Artisan Plating",
  },
  {
    videoUrl: PRIMARY_FOOD_VIDEO_2,
    fallbackVideoUrl: FALLBACK_FOOD_VIDEO_2,
    objectPosition: "center 58%",
    tone: "delicate",
    focalTag: "Gourmet Finish",
  },
  {
    videoUrl: PRIMARY_FOOD_VIDEO_1,
    fallbackVideoUrl: FALLBACK_FOOD_VIDEO_1,
    objectPosition: "45% 48%",
    tone: "warm",
    focalTag: "Chef's Craft",
  },
  {
    videoUrl: PRIMARY_FOOD_VIDEO_2,
    fallbackVideoUrl: FALLBACK_FOOD_VIDEO_2,
    objectPosition: "55% 52%",
    tone: "refreshing",
    focalTag: "Slow Steeped",
  },
  {
    videoUrl: PRIMARY_FOOD_VIDEO_1,
    fallbackVideoUrl: FALLBACK_FOOD_VIDEO_1,
    objectPosition: "center 32%",
    tone: "sizzling",
    focalTag: "Flame Touched",
  },
  {
    videoUrl: PRIMARY_FOOD_VIDEO_2,
    fallbackVideoUrl: FALLBACK_FOOD_VIDEO_2,
    objectPosition: "center 68%",
    tone: "delicate",
    focalTag: "Velvet Glaze",
  },
  {
    videoUrl: PRIMARY_FOOD_VIDEO_1,
    fallbackVideoUrl: FALLBACK_FOOD_VIDEO_1,
    objectPosition: "52% 40%",
    tone: "warm",
    focalTag: "Slow Simmer",
  },
  {
    videoUrl: PRIMARY_FOOD_VIDEO_2,
    fallbackVideoUrl: FALLBACK_FOOD_VIDEO_2,
    objectPosition: "48% 60%",
    tone: "refreshing",
    focalTag: "Craft Blend",
  },
];

/**
 * Intelligently maps any dish to a cinematic video configuration.
 * Respects dish.videoUrl if explicitly configured (e.g. from database or Cloudinary),
 * otherwise assigns the most visually harmonious crop and video from the curated assets.
 */
export function getDishVideoConfig(
  dish: Dish,
  index = 0,
): {
  videoUrl: string;
  fallbackVideoUrl?: string;
  posterUrl: string;
  objectPosition: string;
  tone: "warm" | "sizzling" | "delicate" | "refreshing";
  focalTag: string;
  isVegetarian: boolean;
} {
  const isVegetarian = Boolean(dish.isVeg);
  const nameLower = dish.name.toLowerCase();
  const descLower = (dish.description || "").toLowerCase();

  // Determine semantic theme
  const isBeverageOrDessert =
    nameLower.includes("coffee") ||
    nameLower.includes("mojito") ||
    nameLower.includes("drink") ||
    nameLower.includes("brownie") ||
    nameLower.includes("dessert") ||
    nameLower.includes("cake") ||
    nameLower.includes("ice cream") ||
    descLower.includes("brew") ||
    descLower.includes("gelato");

  // Choose preset based on hash of id/name plus index
  const hash = Math.abs(
    (dish.id || dish.name)
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), index),
  );

  const presetCandidates = isBeverageOrDessert
    ? VIDEO_CROP_PRESETS.filter((p) => p.tone === "delicate" || p.tone === "refreshing")
    : VIDEO_CROP_PRESETS.filter((p) => p.tone === "sizzling" || p.tone === "warm");

  const selectedPreset =
    presetCandidates[hash % presetCandidates.length] ??
    VIDEO_CROP_PRESETS[index % VIDEO_CROP_PRESETS.length];

  // If dish has a custom video (e.g., from Cloudinary), honor it
  const resolvedVideoUrl =
    dish.videoUrl && dish.videoUrl.trim() !== ""
      ? dish.videoUrl
      : selectedPreset.videoUrl;

  const resolvedPosterUrl =
    dish.videoPosterUrl ||
    dish.imageUrl ||
    dish.image ||
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80";

  return {
    videoUrl: resolvedVideoUrl,
    fallbackVideoUrl: selectedPreset.fallbackVideoUrl,
    posterUrl: resolvedPosterUrl,
    objectPosition: selectedPreset.objectPosition,
    tone: selectedPreset.tone,
    focalTag: selectedPreset.focalTag,
    isVegetarian,
  };
}
