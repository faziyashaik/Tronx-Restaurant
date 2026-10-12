"use client";

import Image from "next/image";
import { ChevronDown, Sparkles, Clock, Utensils } from "lucide-react";
import type { Restaurant } from "@/types";
import { PRIMARY_FOOD_VIDEO_1, FALLBACK_FOOD_VIDEO_1 } from "@/lib/video-assignment";
import { useEffect, useRef, useState } from "react";

type RestaurantHeroProps = {
  restaurant: Restaurant;
  tableNumber?: number | null;
};

export default function RestaurantHero({
  restaurant,
  tableNumber,
}: RestaurantHeroProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setVideoLoaded(true))
        .catch(() => undefined);
    }
  }, []);

  const scrollToMenu = () => {
    const menuEl = document.getElementById("menu-navigation-bar") || document.getElementById("menu-content");
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="relative w-full overflow-hidden bg-black text-white selection:bg-[#dfb28e]/30">
      {/* 1. Cinematic Background Video with Image Fallback (Controlled compact height) */}
      <div className="relative h-[44vh] min-h-[340px] max-h-[440px] w-full overflow-hidden">
        {/* Poster / Cover Fallback Image */}
        {restaurant.coverUrl ? (
          <Image
            src={restaurant.coverUrl}
            alt={restaurant.name}
            fill
            priority
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ${
              videoLoaded ? "opacity-30" : "opacity-85"
            }`}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#251214] via-[#1a0c0e] to-black" />
        )}

        {/* Looping Ambient Hero Video */}
        <video
          ref={videoRef}
          src={PRIMARY_FOOD_VIDEO_1}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
            videoLoaded ? "opacity-75" : "opacity-0"
          }`}
          onLoadedData={() => setVideoLoaded(true)}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== window.location.origin + FALLBACK_FOOD_VIDEO_1) {
              target.src = FALLBACK_FOOD_VIDEO_1;
              target.play().catch(() => undefined);
            }
          }}
        />

        {/* Multi-layered cinematic vignetting: dark top/bottom gradients and warm burgundy glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(96,46,49,0.4)_0%,transparent_75%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#faf5ef] to-transparent opacity-20" />
      </div>

      {/* 2. Hero Centerpiece Content (Compact, readable, premium) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          {/* Luxury Monogram Crest */}
          <div className="group relative mb-2.5 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/25 bg-black/40 shadow-xl backdrop-blur-md sm:h-16 sm:w-16">
            {restaurant.logoUrl ? (
              <Image
                src={restaurant.logoUrl}
                alt={`${restaurant.name} crest`}
                fill
                sizes="(max-width: 640px) 56px, 64px"
                className="object-cover"
              />
            ) : (
              <span className="font-serif text-2xl font-bold tracking-tight text-[#dfb28e] sm:text-3xl">
                {restaurant.name.charAt(0) || "T"}
              </span>
            )}
            <div className="pointer-events-none absolute inset-0 border border-[#dfb28e]/30 rounded-xl" />
          </div>

          {/* Editorial Eyebrow */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#dfb28e]/35 bg-black/55 px-3 py-1 backdrop-blur-md shadow-md">
            <Sparkles className="h-3 w-3 text-[#dfb28e]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#dfb28e] sm:text-[10px]">
              THE ART OF THE TABLE
            </span>
          </div>

          {/* Prominent Serif Headline */}
          <h1 className="mt-2.5 font-serif text-2xl font-bold tracking-tight text-white drop-shadow-md sm:text-4xl lg:text-5xl leading-tight">
            An Experience Worth Savoring
          </h1>

          {/* Restaurant Subtitle */}
          <p className="mt-1 font-serif text-xs sm:text-sm tracking-wide text-[#dfb28e] italic">
            at {restaurant.name}
          </p>

          {/* Tasteful Editorial Description */}
          <p className="mt-2 max-w-md text-xs font-light leading-relaxed text-white/80 line-clamp-2">
            {restaurant.description?.trim() ||
              restaurant.tagline?.trim() ||
              "An epicurean journey articulated through culinary film, artisanal technique, and sensory flavors."}
          </p>

          {/* Status & Explore CTA Action */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-md ${
                restaurant.isOpen
                  ? "border border-emerald-500/30 bg-emerald-950/60 text-emerald-300"
                  : "border border-rose-500/30 bg-rose-950/60 text-rose-300"
              }`}
            >
              <Clock className="h-3 w-3" />
              {restaurant.isOpen ? "Open for Service" : "Currently Closed"}
            </span>

            {tableNumber && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#dfb28e]/40 bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-[#dfb28e] backdrop-blur-md">
                <Utensils className="h-2.5 w-2.5" />
                Table {tableNumber}
              </span>
            )}

            <button
              type="button"
              onClick={scrollToMenu}
              className="group inline-flex items-center gap-1.5 rounded-full border border-[#dfb28e]/60 bg-[#602e31] px-4 py-1 text-[11px] font-bold tracking-wider uppercase text-white shadow-lg transition-all duration-300 hover:border-[#dfb28e] hover:bg-[#7a3a3e] active:scale-95"
            >
              <span>Explore Menu</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#dfb28e] transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
