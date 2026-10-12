"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ArrowUp,
  Send,
  CheckCircle2,
  Globe,
  Sparkles,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import type { Restaurant } from "@/types";

type TronxFooterProps = {
  restaurant: Restaurant;
  reservationsEnabled?: boolean;
  wifiEnabled?: boolean;
  onOpenReservation?: () => void;
  onOpenWifi?: () => void;
  onSelectCategory?: (categoryId: string) => void;
};

export default function TronxFooter({
  restaurant,
  reservationsEnabled = false,
  wifiEnabled = false,
  onOpenReservation,
  onOpenWifi,
}: TronxFooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      setNewsletterError("Please provide a valid email address.");
      return;
    }
    setNewsletterError("");
    setSubscribed(true);
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 2800);
  };

  const copyText = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(message);
    } catch {
      showToast(text);
    }
  };

  const glassCardClass =
    "group relative overflow-hidden rounded-2xl border border-[#dfb28e]/15 bg-[#24080e]/55 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_22px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[#dfb28e]/45 hover:bg-[#320d15]/70 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_24px_60px_rgba(0,0,0,0.35),0_0_30px_rgba(223,178,142,0.10)] lg:p-7";

  const linkClass =
    "group/link flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-left text-sm text-white/72 transition duration-300 hover:bg-[#dfb28e]/8 hover:text-[#f8dec0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb28e]/60";

  return (
    <footer
      id="tronx-footer"
      aria-label="TRONX Restaurant Footer"
      className="relative isolate w-full scroll-mt-56 overflow-hidden border-t border-[#dfb28e]/25 bg-[#0f0305] text-[#faf5ef] selection:bg-[#dfb28e]/30"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_18%,rgba(112,34,49,0.42)_0%,rgba(36,8,14,0.82)_42%,rgba(15,3,5,1)_76%)]" />
      <div className="absolute -left-36 top-16 -z-10 h-80 w-80 rounded-full bg-[#dfb28e]/10 blur-[110px]" />
      <div className="absolute -right-20 bottom-8 -z-10 h-72 w-72 rounded-full bg-[#b8860b]/12 blur-[120px]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(223,178,142,0.08)_0_1px,transparent_1px_120px)] opacity-20" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f5d8b7]/80 to-transparent" />
      <div className="absolute inset-x-0 top-px h-20 bg-gradient-to-b from-[#dfb28e]/10 to-transparent" />
      {toastMessage && (
        <div className="fixed right-4 top-6 z-50 flex items-center gap-3 rounded-2xl border border-[#dfb28e]/35 bg-[#24080e]/90 px-4 py-3 text-xs font-medium text-[#f8dec0] shadow-2xl backdrop-blur-md sm:right-6">
          <BadgeCheck className="h-4 w-4 text-[#dfb28e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main 4-Column Layout */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 border-b border-[#dfb28e]/12 pb-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#dfb28e]/90">
              <span className="h-2 w-2 rounded-full bg-[#dfb28e] shadow-[0_0_18px_rgba(223,178,142,0.85)]" />
              The TRONX Table
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-wide text-white sm:text-5xl">
              Crafted dining, warm rituals,
              <span className="block bg-gradient-to-r from-[#fff3d1] via-[#dfb28e] to-[#a9702b] bg-clip-text text-transparent">
                cinematic menus.
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => scrollToSection("menu-content")}
            className="relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-full border border-[#f1cfb3]/35 bg-gradient-to-r from-[#b8860b] via-[#dfb28e] to-[#b8860b] px-7 py-3.5 text-xs font-black uppercase tracking-[0.22em] text-[#24080e] shadow-[0_18px_45px_rgba(223,178,142,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(223,178,142,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb28e]/60 before:absolute before:inset-y-[-80%] before:left-[-40%] before:w-1/3 before:rotate-12 before:bg-white/25 before:transition before:duration-700 hover:before:left-[120%]"
          >
            View Menu
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-7">
          {/* Column A: Brand & Tagline */}
          <div className={`${glassCardClass} flex flex-col justify-between lg:col-span-3`}>
            <div className="space-y-6">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dfb28e]/45 bg-[#120708]/80 text-[#dfb28e] shadow-inner transition duration-300 group-hover:scale-105 group-hover:border-[#f2d1ae]/70">
                <span className="font-serif text-xl font-black tracking-wider text-[#dfb28e]">
                  T
                </span>
                </div>
                <div>
                  <span className="block font-serif text-lg font-semibold tracking-[0.28em] text-white uppercase">
                    TRONX
                  </span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#dfb28e]/80">
                    {restaurant.name}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="max-w-sm text-xs font-semibold leading-relaxed tracking-[0.25em] text-[#f2d1ae] uppercase">
                  GOOD FOOD BRIGHTER MOODS
                </p>

                <p className="max-w-sm text-sm font-light leading-7 text-white/62">
                  {restaurant.description ||
                    restaurant.tagline ||
                    "A premier dining destination featuring video-first culinary discovery, artisanal hearth cookery, and genuine hospitality."}
                </p>
              </div>
            </div>

            {/* Social Links if present */}
            {restaurant.socialLinks && (
              <div className="mt-8 flex items-center gap-3">
                {restaurant.socialLinks.instagram && (
                  <a
                    href={restaurant.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfb28e]/20 bg-[#0f0305]/40 text-white/60 transition hover:border-[#dfb28e]/70 hover:bg-[#dfb28e]/12 hover:text-[#f2d1ae]"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {restaurant.socialLinks.facebook && (
                  <a
                    href={restaurant.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfb28e]/20 bg-[#0f0305]/40 text-white/60 transition hover:border-[#dfb28e]/70 hover:bg-[#dfb28e]/12 hover:text-[#f2d1ae]"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </a>
                )}
                {restaurant.socialLinks.twitter && (
                  <a
                    href={restaurant.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter / X"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfb28e]/20 bg-[#0f0305]/40 text-white/60 transition hover:border-[#dfb28e]/70 hover:bg-[#dfb28e]/12 hover:text-[#f2d1ae]"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {restaurant.socialLinks.website && (
                  <a
                    href={restaurant.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Official Website"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfb28e]/20 bg-[#0f0305]/40 text-white/60 transition hover:border-[#dfb28e]/70 hover:bg-[#dfb28e]/12 hover:text-[#f2d1ae]"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Column B: Explore TRONX */}
          <div className={`${glassCardClass} lg:col-span-3`}>
            <h3 className="border-b border-[#dfb28e]/15 pb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#dfb28e]">
              Explore TRONX
            </h3>
            <ul className="mt-5 space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("menu-content")}
                  className={linkClass}
                >
                  <span className="flex items-center gap-2">
                    <ChevronRight className="h-3.5 w-3.5 text-[#dfb28e]/65 transition group-hover/link:translate-x-1" />
                    Full Video Menu
                  </span>
                  <span className="rounded border border-[#dfb28e]/25 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-[#dfb28e]/70 opacity-0 transition group-hover/link:opacity-100">
                    HD
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("about-story")}
                  className={linkClass}
                >
                  <span className="flex items-center gap-2">
                    <ChevronRight className="h-3.5 w-3.5 text-[#dfb28e]/65 transition group-hover/link:translate-x-1" />
                    Our Culinary Story
                  </span>
                </button>
              </li>
              {reservationsEnabled && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenReservation}
                    className={linkClass}
                  >
                    <span className="flex items-center gap-2">
                      <ChevronRight className="h-3.5 w-3.5 text-[#dfb28e]/65 transition group-hover/link:translate-x-1" />
                      Table Reservations
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  </button>
                </li>
              )}
              {wifiEnabled && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenWifi}
                    className={linkClass}
                  >
                    <span className="flex items-center gap-2">
                      <ChevronRight className="h-3.5 w-3.5 text-[#dfb28e]/65 transition group-hover/link:translate-x-1" />
                      Guest Wi-Fi Setup
                    </span>
                  </button>
                </li>
              )}
              <li>
                <Link
                  href="/"
                  className={linkClass}
                >
                  <span className="flex items-center gap-2">
                    <ChevronRight className="h-3.5 w-3.5 text-[#dfb28e]/65 transition group-hover/link:translate-x-1" />
                    All Partner Venues
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="group/link flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium text-[#dfb28e]/80 transition duration-300 hover:bg-[#dfb28e]/8 hover:text-[#f8dec0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb28e]/60"
                >
                  <ChevronRight className="h-3.5 w-3.5 transition group-hover/link:translate-x-1" />
                  Restaurant Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column C: Visit & Concierge */}
          <div className={`${glassCardClass} lg:col-span-3`}>
            <h3 className="border-b border-[#dfb28e]/15 pb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#dfb28e]">
              Visit & Concierge
            </h3>
            <div className="mt-5 space-y-3 text-sm text-white/82">
              {restaurant.address && (
                <button
                  type="button"
                  onClick={() => copyText(restaurant.address || "", "Address copied to clipboard.")}
                  className="group/contact flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition hover:bg-[#dfb28e]/10"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#dfb28e] transition group-hover/contact:scale-110" />
                  <span>
                    <span className="block font-medium text-white/90 transition group-hover/contact:text-[#f3d5b7]">Location</span>
                    <span className="mt-1 block text-xs font-light leading-relaxed text-white/58">{restaurant.address}</span>
                  </span>
                </button>
              )}

              {restaurant.openingHours && (
                <div className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-[#dfb28e]/10">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#dfb28e]" />
                  <span>
                    <span className="block font-medium text-white/90">Operating Hours</span>
                    <span className="mt-1 block text-xs font-light text-white/58">
                      {restaurant.openingHours}
                      <span className="ml-2 text-[10px] font-medium text-emerald-300">Open Now</span>
                    </span>
                  </span>
                </div>
              )}

              {restaurant.phone && (
                <button
                  type="button"
                  onClick={() => copyText(restaurant.phone || "", "Concierge phone copied.")}
                  className="group/contact flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition hover:bg-[#dfb28e]/10"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#dfb28e] transition group-hover/contact:rotate-12" />
                  <span>
                    <span className="block font-medium text-white/90 transition group-hover/contact:text-[#f3d5b7]">Direct Concierge</span>
                    <a
                      href={`tel:${restaurant.phone}`}
                      className="mt-1 block text-xs font-mono text-white/58 transition hover:text-[#f3d5b7]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {restaurant.phone}
                    </a>
                  </span>
                </button>
              )}

              {restaurant.email && (
                <div className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-[#dfb28e]/10">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#dfb28e]" />
                  <span>
                    <span className="block font-medium text-white/90">Private Desk</span>
                    <a
                      href={`mailto:${restaurant.email}`}
                      className="mt-1 block text-xs text-white/58 transition hover:text-[#f3d5b7]"
                    >
                      {restaurant.email}
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Column D: The TRONX Circle Newsletter */}
          <div className={`${glassCardClass} border-[#dfb28e]/30 lg:col-span-3`}>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dfb28e]/80 to-transparent" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#dfb28e]" />
              <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#dfb28e]">
                The TRONX Circle
              </h3>
            </div>

            <p className="mt-5 text-sm font-light leading-7 text-white/62">
              Join our culinary newsletter for private invitations, seasonal tastings, and chef&apos;s cellar releases.
            </p>

            {subscribed ? (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-950/55 p-3 text-sm text-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>You are now enrolled in The TRONX Circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-5 space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (newsletterError) setNewsletterError("");
                    }}
                    placeholder="Enter your email address..."
                    aria-label="Email address for TRONX Circle newsletter"
                    className="h-12 w-full rounded-xl border border-[#dfb28e]/25 bg-[#0f0305]/70 px-4 pr-13 text-sm text-white shadow-inner placeholder:text-white/35 focus:border-[#dfb28e] focus:outline-none focus:ring-2 focus:ring-[#dfb28e]/35"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to TRONX Circle"
                    className="absolute inset-y-1.5 right-1.5 flex aspect-square items-center justify-center rounded-lg bg-[#dfb28e] text-[#24080e] shadow-[0_10px_25px_rgba(223,178,142,0.22)] transition hover:scale-105 hover:bg-[#f1cfb3] active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                {newsletterError && (
                  <p className="text-[11px] text-rose-300">{newsletterError}</p>
                )}
              </form>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-[#dfb28e]/10 pt-4 text-[11px] text-white/48">
              <span>VIP Culinary Club</span>
              <span className="font-medium text-[#dfb28e]/85">Exclusive Perks</span>
            </div>
          </div>
        </div>

        {/* Divider and Bottom Row */}
        <div className="mt-10 border-t border-[#dfb28e]/12 pt-6 sm:mt-12 sm:pt-8">
          <div className="flex flex-col items-start justify-between gap-5 text-xs text-white/50 md:flex-row md:items-center">
            <p>
              © {new Date().getFullYear()} TRONX Hospitality Group · All Rights Reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="cursor-pointer transition hover:text-[#dfb28e]">
                Privacy Policy
              </span>
              <span className="cursor-pointer transition hover:text-[#dfb28e]">
                Terms of Dining
              </span>
              <span className="cursor-pointer transition hover:text-[#dfb28e]">
                FSSAI Compliance
              </span>

              {/* Back to Top */}
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top of page"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#dfb28e]/30 bg-[#24080e]/60 px-4 py-2 text-[#f3d5b7] shadow-lg transition hover:border-[#dfb28e]/70 hover:bg-[#dfb28e]/15 hover:text-white"
              >
                <span>Top</span>
                <ArrowUp className="h-3 w-3 text-[#dfb28e] transition group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
