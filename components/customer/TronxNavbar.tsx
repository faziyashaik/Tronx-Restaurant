"use client";

import Link from "next/link";
import { Wifi, CalendarCheck, ShoppingBag, Utensils } from "lucide-react";

type TronxNavbarProps = {
  restaurantName: string;
  tableNumber?: number | null;
  reservationsEnabled?: boolean;
  wifiEnabled?: boolean;
  tableOrderingEnabled?: boolean;
  cartCount?: number;
  onOpenReservation?: () => void;
  onOpenWifi?: () => void;
  onOpenCart?: () => void;
};

export default function TronxNavbar({
  restaurantName,
  tableNumber,
  reservationsEnabled = false,
  wifiEnabled = false,
  tableOrderingEnabled = false,
  cartCount = 0,
  onOpenReservation,
  onOpenWifi,
  onOpenCart,
}: TronxNavbarProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navItemClass =
    "group relative rounded-full px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white/72 transition duration-300 hover:bg-white/[0.06] hover:text-[#f4d6a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb28e]/50";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#dfb28e]/18 bg-[#070102]/88 text-white shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition-all duration-300">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#b8860b]/55 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(84,30,36,0.45)_0%,rgba(7,1,2,0)_58%)]" />

      <div className="relative mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: TRONX Brand Crest & Name */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3 rounded-2xl p-1 -m-1 outline-none transition focus-visible:ring-2 focus-visible:ring-[#dfb28e]/60"
            title="Return to TRONX home"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#dfb28e]/35 bg-[#17070a]/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_30px_rgba(0,0,0,0.32)] transition duration-300 group-hover:scale-105 group-hover:border-[#dfb28e]/65 group-hover:bg-[#24080e]/90">
              <span className="font-serif text-base font-black tracking-wider text-[#dfb28e]">
                T
              </span>
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-sm font-bold tracking-[0.26em] text-white uppercase">
                  TRONX
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-[#dfb28e]/70 sm:inline-block" />
                <span className="hidden truncate text-xs font-semibold tracking-wide text-white/82 sm:inline-block">
                  {restaurantName}
                </span>
              </div>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
                Cinematic Dining
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Primary Navigation Links (Desktop) */}
        <nav
          aria-label="Primary culinary navigation"
          className="hidden shrink-0 items-center gap-1 rounded-full border border-[#dfb28e]/22 bg-[#16070a]/54 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-xl md:flex"
        >
          <button
            type="button"
            onClick={() => scrollToSection("menu-content")}
            className="group relative rounded-full bg-[#dfb28e]/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#f4d6a8] transition duration-300 hover:bg-[#dfb28e]/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb28e]/50"
          >
            <span>Menu</span>
            <span className="absolute inset-x-5 -bottom-0.5 h-px rounded-full bg-gradient-to-r from-transparent via-[#dfb28e] to-transparent shadow-[0_0_10px_rgba(223,178,142,0.7)]" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("about-story")}
            className={navItemClass}
          >
            Our Story
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("tronx-footer")}
            className={navItemClass}
          >
            Hours & Concierge
          </button>
        </nav>

        {/* Right: Functional Dining Controls */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-2.5">
          {/* Table Indicator Pill */}
          {tableNumber && (
            <span
              title={`Currently seated at Table ${tableNumber}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#dfb28e]/30 bg-[#16070a]/58 px-3 py-1.5 text-xs font-semibold text-[#f4d6a8] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
            >
              <Utensils className="h-3 w-3" />
              <span className="hidden sm:inline">Table</span> {tableNumber}
            </span>
          )}

          {/* Wi-Fi Action */}
          {wifiEnabled && (
            <button
              type="button"
              onClick={onOpenWifi}
              aria-label="Open Guest Wi-Fi"
              className="inline-flex items-center gap-2 rounded-full border border-[#dfb28e]/24 bg-[#16070a]/58 px-3.5 py-2 text-xs font-bold text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#dfb28e]/58 hover:bg-[#dfb28e]/10 hover:text-white hover:shadow-[0_14px_32px_rgba(0,0,0,0.25),0_0_22px_rgba(223,178,142,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb28e]/50"
            >
              <Wifi className="h-3.5 w-3.5 text-[#dfb28e]" />
              <span className="hidden lg:inline">Guest</span> Wi-Fi
            </button>
          )}

          {/* Reservation Action */}
          {reservationsEnabled && (
            <button
              type="button"
              onClick={onOpenReservation}
              aria-label="Reserve a dining table"
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#f1cfb3]/45 bg-gradient-to-r from-[#b8860b] via-[#dfb28e] to-[#b8860b] px-4.5 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#22080c] shadow-[0_14px_36px_rgba(212,175,55,0.20)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(212,175,55,0.30)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb28e]/70 before:absolute before:inset-y-[-80%] before:left-[-45%] before:w-1/3 before:rotate-12 before:bg-white/30 before:transition before:duration-700 hover:before:left-[120%]"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reserve</span> Table
            </button>
          )}

          {/* Quick Cart Trigger */}
          {tableOrderingEnabled && cartCount > 0 && (
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`View cart with ${cartCount} items`}
              className="relative inline-flex items-center justify-center rounded-full border border-[#dfb28e]/35 bg-[#16070a]/64 p-2.5 text-[#dfb28e] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition hover:scale-105 hover:border-[#dfb28e]/65 hover:bg-[#dfb28e]/10 active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#dfb28e] px-1 text-[10px] font-black text-[#541e24] shadow-xs">
                {cartCount}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
