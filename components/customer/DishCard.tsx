"use client";

import Image from "next/image";
import { Heart, Plus, Check, Utensils } from "lucide-react";
import { useState } from "react";
import type { Dish } from "@/types";
import VideoPlayer from "./VideoPlayer";
import { getDishVideoConfig } from "@/lib/video-assignment";

type DishCardProps = {
  dish: Dish;
  index?: number;
  onClick: (dish: Dish) => void;
  onQuickAdd?: (dish: Dish) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (dishId: string) => void;
  priority?: boolean;
  videoMenuEnabled?: boolean;
};

export default function DishCard({
  dish,
  index = 0,
  onClick,
  onQuickAdd,
  isFavorite = false,
  onToggleFavorite,
  priority = false,
  videoMenuEnabled = true,
}: DishCardProps) {
  const [hovered, setHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Centralized intelligent video & crop configuration
  const videoConfig = getDishVideoConfig(dish, index);

  // Check signature / chef special status
  const isSignature =
    dish.isSignature ??
    (dish.name.toLowerCase().includes("signature") ||
      dish.name.toLowerCase().includes("tikka") ||
      dish.sortOrder === 1);

  const isChefsChoice =
    dish.isChefsChoice ?? dish.name.toLowerCase().includes("special");

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dish.isAvailable) return;

    if (onQuickAdd) {
      onQuickAdd(dish);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    } else {
      onClick(dish);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(dish.id);
  };

  return (
    <article
      onClick={() => onClick(dish)}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#e6d8cb] bg-white text-left shadow-[0_4px_18px_rgba(40,15,18,0.04)] transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1 hover:border-[#541e24]/40 hover:shadow-[0_16px_32px_rgba(84,30,36,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#541e24]"
    >
      {/* 1. Food Video Media Container (~60–65% height on desktop, aspect-[4/3] with cover fit) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1e0e11]">
        {/* High-res food image fallback / poster */}
        {videoConfig.posterUrl ? (
          <Image
            src={videoConfig.posterUrl}
            alt={dish.name}
            fill
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectPosition: videoConfig.objectPosition }}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#251214] to-[#541e24]">
            <Utensils className="h-8 w-8 text-[#dfb28e]/50" />
          </div>
        )}

        {/* Looping Food Video Player */}
        {videoMenuEnabled && videoConfig.videoUrl && (
          <VideoPlayer
            videoUrl={videoConfig.videoUrl}
            fallbackVideoUrl={videoConfig.fallbackVideoUrl}
            posterUrl={videoConfig.posterUrl}
            title={dish.name}
            autoPlay
            muted
            loop
            controls={false}
            hovered={hovered}
            playbackPriority={priority}
            objectPosition={videoConfig.objectPosition}
            objectFit="cover"
            className="absolute inset-0 bg-[#251214]/40"
          />
        )}

        {/* Subtle dark gradient overlay on bottom of media */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />

        {/* Top-Left: FSSAI Symbol & Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 z-10">
          {/* FSSAI Veg / Non-Veg Symbol */}
          <span
            title={dish.isVeg ? "Vegetarian" : "Non-Vegetarian"}
            className={`flex h-4.5 w-4.5 items-center justify-center rounded-[3px] border bg-white shadow-xs backdrop-blur-xs ${
              dish.isVeg ? "border-emerald-600" : "border-[#a52a2a]"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                dish.isVeg ? "bg-emerald-600" : "bg-[#a52a2a]"
              }`}
            />
          </span>

          {/* Signature Badge */}
          {isSignature && (
            <span className="rounded-md bg-[#d25b39] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
              SIGNATURE
            </span>
          )}

          {/* Chef's Choice Badge */}
          {isChefsChoice && !isSignature && (
            <span className="rounded-md bg-[#541e24] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#dfb28e] shadow-xs">
              CHEFS CHOICE
            </span>
          )}
        </div>

        {/* Lower-Right of Media: Translucent Circular Heart Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={
            isFavorite
              ? `Remove ${dish.name} from favorites`
              : `Add ${dish.name} to favorites`
          }
          className="absolute right-3 bottom-3 z-10 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition-all hover:bg-black/75 hover:scale-110 active:scale-95"
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors ${
              isFavorite
                ? "fill-[#e0565b] text-[#e0565b]"
                : "text-white/90 hover:text-white"
            }`}
          />
        </button>

        {/* Out of Stock Overlay */}
        {!dish.isAvailable && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-xs">
            <span className="rounded-full border border-white/20 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#541e24] shadow-lg">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* 2. White Content Panel below media */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-1">
          {/* Dish Name in refined Playfair Display Serif */}
          <h3 className="font-serif text-lg font-bold leading-snug text-[#1a1415] transition-colors duration-200 group-hover:text-[#541e24]">
            {dish.name}
          </h3>

          {/* Short description with uniform minimum height for clean row alignment */}
          <p className="line-clamp-2 min-h-[32px] text-xs leading-relaxed text-[#745f62]">
            {dish.description || "Freshly crafted with authentic chef spices and seasonal produce."}
          </p>
        </div>

        {/* 3. Bottom Row: Price aligned lower-left & circular burgundy (+) button lower-right */}
        <div className="mt-4 flex items-center justify-between border-t border-[#f5ebe1] pt-3">
          <span className="font-bold text-base text-[#1a1415] tracking-tight">
            ₹{dish.price.toFixed(2)}
          </span>

          {/* Circular burgundy add-to-cart button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!dish.isAvailable}
            aria-label={`Add ${dish.name} to order`}
            className={`flex h-8.5 w-8.5 items-center justify-center rounded-full transition-all duration-200 shadow-sm ${
              justAdded
                ? "bg-emerald-600 text-white scale-105"
                : "bg-[#541e24] text-white hover:bg-[#6e272f] hover:scale-110 active:scale-95"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {justAdded ? (
              <Check className="h-4 w-4 stroke-[2.5]" />
            ) : (
              <Plus className="h-4 w-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
