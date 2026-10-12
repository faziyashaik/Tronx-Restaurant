"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  Flame,
  Leaf,
  Sparkles,
  Utensils,
  Wine,
  X,
} from "lucide-react";
import type { CSSProperties, MouseEvent } from "react";
import type { Restaurant } from "@/types";
import { PRIMARY_FOOD_VIDEO_2, FALLBACK_FOOD_VIDEO_2 } from "@/lib/video-assignment";

type TronxAboutSectionProps = {
  restaurant: Restaurant;
};

type Pillar = {
  title: string;
  summary: string;
  detail: string;
  action: string;
  icon: typeof Flame;
};

const pillars: Pillar[] = [
  {
    title: "Wood-Fired Alchemy",
    summary:
      "Primal embers and seasoned hardwood impart deep, caramelized complexities across slow-braised marinades and hearth-roasted creations.",
    detail:
      "Every dish is treated as a ritual of heat, patience, and texture. Aromatic hardwood smoke, slow reductions, and flame-finished touches create the signature TRONX depth.",
    action: "Discover Process",
    icon: Flame,
  },
  {
    title: "Pristine Provenance",
    summary:
      "Sun-ripened garden aromatics, cold-pressed oils, and farm-sourced produce harvested at their peak to preserve clean, vibrant terroir.",
    detail:
      "Seasonal produce, fragrant herbs, and carefully sourced pantry elements keep every plate expressive, generous, and grounded in freshness.",
    action: "Explore Sourcing",
    icon: Leaf,
  },
  {
    title: "Sensory Hospitality",
    summary:
      "Cinematic visual menus, intuitive table ordering, and attentive curation designed to make every meal an intimate celebration.",
    detail:
      "From video-first menu discovery to calm table service moments, the experience is designed to feel personal, fluid, and unmistakably premium.",
    action: "Reserve Experience",
    icon: Wine,
  },
];

export default function TronxAboutSection({ restaurant }: TronxAboutSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activePillar, setActivePillar] = useState<Pillar | null>(null);
  const [spotlightStyle, setSpotlightStyle] = useState<Record<string, CSSProperties>>({});

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

  const handleSpotlightMove = (key: string, event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSpotlightStyle((current) => ({
      ...current,
      [key]: {
        "--mouse-x": `${event.clientX - rect.left}px`,
        "--mouse-y": `${event.clientY - rect.top}px`,
      } as CSSProperties,
    }));
  };

  const ActiveIcon = activePillar?.icon;

  return (
    <section
      id="about-story"
      aria-label="The TRONX Culinary Story"
      className="relative isolate w-full scroll-mt-56 overflow-hidden bg-[#0a0406] text-white selection:bg-[#dfb28e]/30"
    >
      <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
        {restaurant.coverUrl ? (
          <Image
            src={restaurant.coverUrl}
            alt="Culinary Atmosphere"
            fill
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ${
              videoLoaded ? "opacity-20" : "opacity-35"
            }`}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#260e18] via-[#12070b] to-[#0a0406]" />
        )}

        <video
          ref={videoRef}
          src={PRIMARY_FOOD_VIDEO_2}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-25" : "opacity-0"
          }`}
          onLoadedData={() => setVideoLoaded(true)}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== window.location.origin + FALLBACK_FOOD_VIDEO_2) {
              target.src = FALLBACK_FOOD_VIDEO_2;
              target.play().catch(() => undefined);
            }
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(84,30,36,0.48)_0%,rgba(18,7,11,0.88)_48%,rgba(10,4,6,0.98)_82%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0406]/92 via-[#0a0406]/72 to-[#0a0406]/95" />
        <div className="absolute left-1/2 top-10 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-[#dfb28e]/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#b8860b]/10 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dfb28e]/35 bg-[#1a0910]/80 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f2d1ae] shadow-[0_0_18px_rgba(223,178,142,0.12)] backdrop-blur-xl sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#dfb28e]" />
            THE TRONX CULINARY ETHOS
          </div>

          <h2 className="font-serif text-4xl font-normal leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Crafted With Fire,
            <span className="block bg-gradient-to-r from-[#fff2d6] via-[#dfb28e] to-[#9e7920] bg-clip-text font-light italic text-transparent">
              Served With Passion.
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-base font-light leading-8 text-white/72 sm:text-lg">
            At {restaurant.name}, dining is conceived as a multisensory ritual. Every recipe honors the alchemy of open flame, heirloom spices, and slow reductions, translating culinary heritage into modern gastronomic poetry.
          </p>

          <p className="mx-auto max-w-2xl font-serif text-base italic tracking-wide text-[#f2d1ae]/90">
            {restaurant.description ||
              restaurant.tagline ||
              "Asian-inspired small plates, rice bowls, and house-made sauces."}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 text-left md:grid-cols-3 lg:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <button
                key={pillar.title}
                type="button"
                onClick={() => setActivePillar(pillar)}
                onMouseMove={(event) => handleSpotlightMove(pillar.title, event)}
                style={spotlightStyle[pillar.title]}
                className="group relative min-h-72 overflow-hidden rounded-2xl border border-[#dfb28e]/15 bg-[#1a0910]/55 p-7 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl transition duration-500 hover:-translate-y-1.5 hover:border-[#dfb28e]/40 hover:bg-[#260e18]/70 hover:shadow-[0_24px_60px_rgba(0,0,0,0.38),0_0_35px_rgba(223,178,142,0.10)] before:absolute before:inset-0 before:bg-[radial-gradient(650px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(223,178,142,0.13),transparent_42%)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100"
              >
                <span className="relative z-10 flex h-full flex-col justify-between gap-8">
                  <span className="space-y-5">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#dfb28e]/35 bg-[#260e18]/80 text-[#dfb28e] shadow-inner transition duration-300 group-hover:scale-110 group-hover:border-[#f2d1ae]/70">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="block font-serif text-xl font-semibold tracking-wide text-white transition group-hover:text-[#f2d1ae]">
                      {pillar.title}
                    </span>
                    <span className="block text-sm font-light leading-7 text-white/62">
                      {pillar.summary}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#dfb28e]/82 transition group-hover:text-[#f2d1ae]">
                    {pillar.action}
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#dfb28e]/45 sm:w-32" />
          <div className="flex items-center gap-2 text-center font-serif text-xs uppercase tracking-[0.3em] text-[#dfb28e]">
            <Award className="h-4 w-4" />
            <span>TRONX Signature Standard</span>
            <Utensils className="h-4 w-4" />
          </div>
          <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#dfb28e]/45 sm:w-32" />
        </div>
      </div>

      {activePillar && ActiveIcon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/78 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#dfb28e]/30 bg-[#12070b]/95 p-7 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setActivePillar(null)}
              aria-label="Close detail view"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#dfb28e]/20 bg-[#260e18]/80 text-white/60 transition hover:text-[#dfb28e]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#dfb28e]/40 bg-[#260e18]/80 text-[#dfb28e] shadow-inner">
              <ActiveIcon className="h-7 w-7" />
            </div>
            <h3 className="mt-6 font-serif text-2xl font-semibold tracking-wide text-white">
              {activePillar.title}
            </h3>
            <p className="mt-4 text-sm font-light leading-7 text-white/68">
              {activePillar.detail}
            </p>
            <button
              type="button"
              onClick={() => setActivePillar(null)}
              className="mt-7 rounded-full border border-[#dfb28e]/35 bg-[#dfb28e]/10 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#f2d1ae] transition hover:bg-[#dfb28e]/18"
            >
              Close View
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
