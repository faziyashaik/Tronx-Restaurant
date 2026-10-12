"use client";

import { useState } from "react";
import { Sparkles, X, Search, ArrowRight, Plus } from "lucide-react";
import type { Dish } from "@/types";
import Image from "next/image";

type AskTronxConciergeProps = {
  dishes: Dish[];
  onSelectDish: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
  hasActiveCart?: boolean;
};

const SUGGESTED_QUERIES = [
  { label: "Chef's Top Signatures", query: "signature" },
  { label: "Pure Veg & Vegan", query: "veg" },
  { label: "Wood-Fired Pizzas", query: "pizza" },
  { label: "Decadent Desserts", query: "dessert" },
  { label: "Nut-Free & Gluten-Free", query: "gluten free" },
];

export default function AskTronxConcierge({
  dishes,
  onSelectDish,
  onQuickAdd,
  hasActiveCart = false,
}: AskTronxConciergeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const matchingDishes = query.trim()
    ? dishes.filter((dish) => {
        const q = query.toLowerCase();
        if (q === "signature") return dish.isSignature || dish.sortOrder === 1;
        if (q === "veg") return dish.isVeg;
        if (q === "pizza") return dish.categoryId === "cat-5" || dish.name.toLowerCase().includes("pizza");
        if (q === "dessert") return dish.categoryId === "cat-6" || dish.name.toLowerCase().includes("brownie") || dish.name.toLowerCase().includes("tiramisu");
        if (q === "gluten free") return dish.dietaryTags?.includes("GLUTEN FREE");

        return (
          dish.name.toLowerCase().includes(q) ||
          (dish.description || "").toLowerCase().includes(q) ||
          dish.dietaryTags?.some((tag) => tag.toLowerCase().includes(q))
        );
      }).slice(0, 4)
    : dishes.filter((d) => d.isSignature || d.sortOrder === 1).slice(0, 3);

  return (
    <>
      {/* 1. Floating Pill Button matching user screenshot: [ ✨ ASK TRONX ] */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open TRONX AI Concierge"
        className={`fixed z-40 flex items-center gap-2 rounded-full border border-black/20 bg-[#481c20] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(40,15,18,0.4)] transition-all duration-300 hover:scale-105 hover:bg-[#5a2328] active:scale-95 ${
          hasActiveCart
            ? "bottom-22 right-4 sm:bottom-6 sm:right-6"
            : "bottom-6 right-4 sm:right-6"
        }`}
      >
        <span className="flex h-3 w-3 items-center justify-center rounded-full bg-white/20">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
        <Sparkles className="h-3.5 w-3.5 text-white" />
        <span className="tracking-widest">ASK TRONX</span>
      </button>

      {/* 2. Concierge Interactive Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-[#e6d8cb] bg-[#fbf6f0] shadow-2xl sm:rounded-3xl">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-[#e6d8cb] bg-[#541e24] px-6 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/20">
                  <Sparkles className="h-4 w-4 text-[#dfb28e]" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-white">
                    TRONX Concierge
                  </h2>
                  <p className="text-[11px] text-[#dfb28e]">
                    Smart Culinary Pairing & Recommendations
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close concierge"
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Search Prompt */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#705e60]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask for pairings, dietary needs, or recommendations..."
                  className="h-10 w-full rounded-full border border-[#e6d8cb] bg-white pl-10 pr-4 text-xs sm:text-sm text-[#1e1415] outline-none focus:border-[#541e24]"
                />
              </div>

              {/* Quick Prompt Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTED_QUERIES.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setQuery(item.query)}
                    className="rounded-full border border-[#e6d8cb] bg-white px-3 py-1 text-[11px] font-semibold text-[#541e24] hover:bg-[#541e24] hover:text-white transition"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Curated Recommendations List */}
              <div className="pt-2 space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#705e60]">
                  {query ? "Matching Recommendations" : "Chef's Curated Highlights"}
                </p>

                {matchingDishes.map((dish) => (
                  <div
                    key={dish.id}
                    onClick={() => {
                      onSelectDish(dish);
                      setIsOpen(false);
                    }}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-[#e6d8cb] bg-white p-3 shadow-xs cursor-pointer hover:border-[#541e24]/40 hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {dish.imageUrl && (
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          <Image
                            src={dish.imageUrl}
                            alt={dish.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-serif text-sm font-bold text-[#1e1415] truncate group-hover:text-[#541e24]">
                          {dish.name}
                        </h4>
                        <p className="text-[11px] text-[#705e60] truncate">
                          ₹{dish.price.toFixed(2)} • {dish.isVeg ? "Vegetarian" : "Non-Veg"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAdd(dish);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#541e24] text-white hover:scale-105 active:scale-95 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-[#541e24] group-hover:translate-x-0.5 transition">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
