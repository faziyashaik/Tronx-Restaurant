"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { X, Check, Minus, Plus, Utensils } from "lucide-react";
import type { Dish, AddonGroup, Addon } from "@/types";
import VideoPlayer from "./VideoPlayer";
import { getDishVideoConfig } from "@/lib/video-assignment";

type DishDetailModalProps = {
  dish: Dish | null;
  onClose: () => void;
  canOrder: boolean;
  orderingEnabled?: boolean;
  videoMenuEnabled?: boolean;
  onAddToCart: (entry: {
    dishId: string;
    quantity: number;
    selections: { groupId: string; addonIds: string[] }[];
  }) => void;
};

function createInitialAddonSelections(dish: Dish | null) {
  const selections: Record<string, string[]> = {};
  for (const group of dish?.addonGroups ?? []) {
    if (group.isActive === false) continue;
    const firstAvailableAddon = group.addons.find(
      (addon) => addon.isActive !== false && addon.isAvailable !== false,
    );
    selections[group.id] =
      group.isRequired && group.maxSelect === 1 && group.addons.length > 0
        ? firstAvailableAddon
          ? [firstAvailableAddon.id]
          : []
        : [];
  }
  return selections;
}

export default function DishDetailModal({
  dish,
  onClose,
  canOrder,
  orderingEnabled = true,
  videoMenuEnabled = true,
  onAddToCart,
}: DishDetailModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const savedScrollTopRef = useRef<number>(0);

  const [selectionState, setSelectionState] = useState<{
    dishId: string | null;
    values: Record<string, string[]>;
  }>({ dishId: null, values: {} });
  const [quantity, setQuantity] = useState(1);

  const selectedAddons =
    dish && selectionState.dishId === dish.id
      ? selectionState.values
      : createInitialAddonSelections(dish);

  // Reset scroll to top when a new dish is opened
  useEffect(() => {
    if (!dish?.id) return;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [dish?.id]);

  const updateGroupSelection = (
    group: AddonGroup,
    update: (current: string[]) => string[],
  ) => {
    if (!dish) return;
    setSelectionState((previous) => {
      const currentValues =
        previous.dishId === dish.id
          ? previous.values
          : createInitialAddonSelections(dish);
      return {
        dishId: dish.id,
        values: {
          ...currentValues,
          [group.id]: update(currentValues[group.id] ?? []),
        },
      };
    });
  };

  // Body scroll lock and Escape key listener
  useEffect(() => {
    if (!dish) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dish, onClose]);

  // Calculate total price based on base price and selected addons
  const addonsTotal = useMemo(() => {
    if (!dish || !dish.addonGroups) return 0;
    let total = 0;

    dish.addonGroups.forEach((group) => {
      if (group.isActive === false) return;
      const selectedIds = selectedAddons[group.id] || [];
      group.addons.forEach((addon) => {
        if (selectedIds.includes(addon.id)) {
          total += addon.price;
        }
      });
    });

    return total;
  }, [dish, selectedAddons]);

  const totalPrice = (dish?.price ?? 0) + addonsTotal;

  const hasValidSelections = (dish?.addonGroups ?? []).every((group) => {
    if (group.isActive === false) return true;
    const ids = selectedAddons[group.id] ?? [];
    const count = ids.length;
    if (
      ids.some(
        (id) =>
          !group.addons.some(
            (addon) =>
              addon.id === id &&
              addon.isActive !== false &&
              addon.isAvailable !== false,
          ),
      )
    )
      return false;
    return (
      count >= (group.isRequired ? Math.max(1, group.minSelect) : group.minSelect) &&
      count <= group.maxSelect
    );
  });

  const handleToggleAddon = (group: AddonGroup, addon: Addon) => {
    if (scrollContainerRef.current) {
      savedScrollTopRef.current = scrollContainerRef.current.scrollTop;
    }

    const current = selectedAddons[group.id] || [];
    const isSelected = current.includes(addon.id);

    if (group.maxSelect === 1) {
      if (isSelected) {
        if (!group.isRequired) {
          updateGroupSelection(group, () => []);
        }
      } else {
        updateGroupSelection(group, () => [addon.id]);
      }
    } else {
      if (isSelected) {
        updateGroupSelection(group, (previous) =>
          previous.filter((id) => id !== addon.id),
        );
      } else {
        if (current.length < group.maxSelect) {
          updateGroupSelection(group, (previous) => [...previous, addon.id]);
        }
      }
    }

    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = savedScrollTopRef.current;
      }
    });
  };

  if (!dish) return null;

  const videoConfig = getDishVideoConfig(dish);
  const isChefSpecial =
    dish.name.toLowerCase().includes("signature") ||
    dish.name.toLowerCase().includes("special") ||
    dish.sortOrder === 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md transition-all duration-300 sm:items-center sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-full flex-col overflow-hidden rounded-t-[2rem] border border-[#ebd9cb] bg-white text-[#221416] shadow-2xl sm:max-h-[88vh] sm:max-w-3xl sm:rounded-3xl lg:h-[min(88vh,820px)] lg:max-h-[820px] lg:max-w-6xl">
        {/* Mobile Swipe / Drag Pill Handle */}
        <div className="flex w-full items-center justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1.5 w-12 rounded-full bg-[#602e31]/30" />
        </div>

        {/* Accessible Close Button */}
        <div className="absolute right-4 top-4 z-30">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close dish details"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#602e31] shadow-lg backdrop-blur-md transition hover:bg-white hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#602e31]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content: 2-Column Desktop Grid / Scrollable Mobile Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overscroll-contain scrollbar-none lg:grid lg:min-h-0 lg:grid-cols-12 lg:overflow-hidden"
        >
          {/* 1. CINEMATIC MEDIA COLUMN */}
          <div className="relative w-full lg:col-span-6 lg:h-full lg:min-h-0 lg:overflow-hidden bg-[#251214]">
            <div className="relative h-64 sm:h-80 lg:h-full w-full overflow-hidden">
              {/* Fallback image */}
              {videoConfig.posterUrl ? (
                <Image
                  src={videoConfig.posterUrl}
                  alt={dish.name}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  style={{ objectPosition: videoConfig.objectPosition }}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#251214] to-[#602e31]">
                  <Utensils className="h-12 w-12 text-[#dfb28e]/50" />
                </div>
              )}

              {/* Looping Detail Video */}
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
                  playbackPriority
                  objectPosition={videoConfig.objectPosition}
                  objectFit="cover"
                  className="absolute inset-0 bg-[#251214]/60"
                />
              )}

              {/* Cinematic Vignette */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Video Focal / Craft Emblem in bottom corner of media */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
                  {videoConfig.focalTag}
                </span>
                {isChefSpecial && (
                  <span className="rounded-full border border-[#dfb28e]/50 bg-[#602e31]/80 px-3 py-1 text-xs font-semibold text-[#dfb28e] backdrop-blur-md">
                    Chef&apos;s Signature
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 2. DISH DETAILS & CUSTOMIZATIONS COLUMN */}
          <div className="lg:col-span-6 flex flex-col justify-between overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
            <div className="space-y-6">
              {/* Header: Diet badge, Title, Price */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* FSSAI Symbol */}
                  <span
                    title={dish.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border bg-white shadow-xs ${
                      dish.isVeg ? "border-emerald-600" : "border-rose-700"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        dish.isVeg ? "bg-emerald-600" : "bg-rose-700"
                      }`}
                    />
                  </span>

                  <span className="text-xs font-bold uppercase tracking-wider text-[#745f62]">
                    {dish.isVeg ? "Pure Vegetarian" : "Non-Vegetarian"}
                  </span>

                  {dish.addonGroups && dish.addonGroups.length > 0 && (
                    <span className="rounded-full bg-[#602e31]/10 px-2.5 py-0.5 text-xs font-semibold text-[#602e31]">
                      Customisable Options
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h2
                    id="dish-modal-title"
                    className="font-serif text-3xl font-bold tracking-tight text-[#221416] sm:text-4xl"
                  >
                    {dish.name}
                  </h2>

                  <div className="shrink-0 text-right">
                    <span className="font-mono text-2xl font-extrabold text-[#602e31]">
                      ₹{dish.price}
                    </span>
                  </div>
                </div>

                {dish.description && (
                  <p className="text-sm leading-relaxed text-[#745f62] sm:text-base">
                    {dish.description}
                  </p>
                )}
              </div>

              {/* Add-ons & Customizations Section */}
              {dish.addonGroups && dish.addonGroups.some((group) => group.isActive !== false) && (
                <div className="space-y-5 border-t border-[#ebd9cb] pt-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold tracking-tight text-[#221416]">
                      Personalise Your Plate
                    </h3>
                    <p className="mt-0.5 text-xs text-[#745f62]">
                      Select accompaniments, choices, and extras below.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {dish.addonGroups
                      .filter((group) => group.isActive !== false)
                      .map((group) => {
                        const currentSelections = selectedAddons[group.id] || [];
                        const isSingleSelect = group.maxSelect === 1;
                        const isMaxReached =
                          !isSingleSelect && currentSelections.length >= group.maxSelect;

                        return (
                          <div
                            key={group.id}
                            className="rounded-2xl border border-[#ebd9cb] bg-[#fffaf6] p-4 transition"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0e5dc] pb-2.5">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[#221416]">
                                  {group.name}
                                </span>
                                {group.isRequired ? (
                                  <span className="rounded-full bg-[#602e31]/10 px-2 py-0.5 text-[10px] font-bold text-[#602e31]">
                                    Required
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-[#f5ebe1] px-2 py-0.5 text-[10px] font-medium text-[#745f62]">
                                    Optional
                                  </span>
                                )}
                              </div>

                              <span className="text-xs text-[#745f62]">
                                {isSingleSelect
                                  ? "Choose 1"
                                  : group.minSelect > 0
                                    ? `Choose ${group.minSelect}–${group.maxSelect}`
                                    : `Up to ${group.maxSelect}`}
                              </span>
                            </div>

                            <div className="divide-y divide-[#f0e5dc] pt-1">
                              {group.addons.map((addon) => {
                                const isSelected = currentSelections.includes(addon.id);
                                const isDisabled =
                                  addon.isActive === false ||
                                  addon.isAvailable === false ||
                                  (!isSelected && isMaxReached && !isSingleSelect);

                                return (
                                  <label
                                    key={addon.id}
                                    className={`relative flex items-center justify-between rounded-xl px-2.5 py-3 transition select-none ${
                                      isDisabled
                                        ? "cursor-not-allowed opacity-40"
                                        : "cursor-pointer hover:bg-white"
                                    } ${isSelected ? "bg-[#602e31]/5" : ""}`}
                                  >
                                    <input
                                      type={isSingleSelect ? "radio" : "checkbox"}
                                      name={`addon-group-${group.id}`}
                                      checked={isSelected}
                                      disabled={isDisabled}
                                      onChange={() => handleToggleAddon(group, addon)}
                                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                                      aria-label={`${addon.name}, ${
                                        addon.price > 0 ? `₹${addon.price}` : "Included"
                                      }`}
                                    />

                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`flex h-5 w-5 shrink-0 items-center justify-center transition ${
                                          isSingleSelect ? "rounded-full border" : "rounded-md border"
                                        } ${
                                          isSelected
                                            ? "border-[#602e31] bg-[#602e31] text-white"
                                            : "border-[#bfaea3] bg-white"
                                        }`}
                                      >
                                        {isSelected &&
                                          (isSingleSelect ? (
                                            <div className="h-2 w-2 rounded-full bg-white" />
                                          ) : (
                                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                                          ))}
                                      </div>

                                      <span
                                        className={`text-sm ${
                                          isSelected
                                            ? "font-semibold text-[#221416]"
                                            : "text-[#745f62]"
                                        }`}
                                      >
                                        {addon.name}
                                      </span>
                                    </div>

                                    <span className="text-xs font-bold text-[#602e31]">
                                      {addon.price > 0 ? `+₹${addon.price}` : "Free"}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Action Bottom Bar */}
            {orderingEnabled && (
              <div className="mt-8 shrink-0 border-t border-[#ebd9cb] pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#745f62]">
                      Total Price
                    </span>
                    <span className="font-mono text-2xl font-extrabold text-[#602e31]">
                      ₹{totalPrice * quantity}
                    </span>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-2 rounded-full border border-[#ebd9cb] bg-[#fffaf6] p-1">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                      className="grid h-8 w-8 place-items-center rounded-full text-[#602e31] transition hover:bg-white"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-6 text-center text-sm font-bold text-[#221416]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((v) => Math.min(99, v + 1))}
                      className="grid h-8 w-8 place-items-center rounded-full text-[#602e31] transition hover:bg-white"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Add to cart button */}
                  <button
                    type="button"
                    disabled={!canOrder || !hasValidSelections || !dish.isAvailable}
                    onClick={() => {
                      if (!dish) return;
                      onAddToCart({
                        dishId: dish.id,
                        quantity,
                        selections: (dish.addonGroups ?? [])
                          .filter((group) => group.isActive !== false)
                          .map((group) => ({
                            groupId: group.id,
                            addonIds: selectedAddons[group.id] ?? [],
                          })),
                      });
                      onClose();
                    }}
                    className="flex-1 max-w-xs rounded-full bg-[#602e31] py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:bg-[#7a3a3e] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {dish.isAvailable
                      ? canOrder
                        ? `Add to Cart · ₹${totalPrice * quantity}`
                        : "Scan Table QR to Order"
                      : "Unavailable"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
