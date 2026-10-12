"use client";

import { useEffect, useRef } from "react";
import type { Category } from "@/types";
import { Utensils } from "lucide-react";

type CategoryNavProps = {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  totalDishCount?: number;
  categoryCounts?: Record<string, number>;
};

export default function CategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
  totalDishCount = 20,
  categoryCounts = {},
}: CategoryNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const sortedCategories = categories
    .filter((category) => category.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Auto-scroll the active category button horizontally inside the container
  useEffect(() => {
    if (!activeCategory) return;
    const container = containerRef.current;
    const button = buttonRefs.current[activeCategory];
    if (!container || !button) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    const scrollOffset =
      buttonRect.left -
      containerRect.left -
      containerRect.width / 2 +
      buttonRect.width / 2;

    container.scrollBy({
      left: scrollOffset,
      behavior: "smooth",
    });
  }, [activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId);

    const targetSection = document.getElementById(
      categoryId === "all" ? "menu-content" : `category-${categoryId}`,
    );
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav
      id="menu-navigation-bar"
      aria-label="Menu categories"
      className="w-full bg-transparent"
    >
      <div
        ref={containerRef}
        className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none [-webkit-overflow-scrolling:touch]"
      >
          {/* "ALL (count)" Pill Button */}
          <button
            type="button"
            ref={(el) => {
              buttonRefs.current.all = el;
            }}
            onClick={() => handleCategoryClick("all")}
            aria-pressed={!activeCategory}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#541e24] ${
              !activeCategory
                ? "border-[#541e24] bg-[#541e24] text-white shadow-sm"
                : "border-[#e6d8cb] bg-[#fbf6f0] text-[#423234] hover:border-[#541e24]/40 hover:bg-[#f5e9de]"
            }`}
          >
            <Utensils className={`h-3 w-3 ${!activeCategory ? "text-white" : "text-[#705e60]"}`} />
            <span>ALL ({totalDishCount})</span>
          </button>

          {/* Individual Category Pills */}
          {sortedCategories.map((category) => {
            const isActive = category.id === activeCategory;
            const count = categoryCounts[category.id] ?? 3;

            return (
              <button
                key={category.id}
                ref={(el) => {
                  buttonRefs.current[category.id] = el;
                }}
                type="button"
                onClick={() => handleCategoryClick(category.id)}
                aria-pressed={isActive}
                aria-current={isActive ? "true" : undefined}
                className={`inline-flex shrink-0 items-center rounded-xl border px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#541e24] ${
                  isActive
                    ? "border-[#541e24] bg-[#541e24] text-white shadow-sm"
                    : "border-[#e6d8cb] bg-[#fbf6f0] text-[#423234] hover:border-[#541e24]/40 hover:bg-[#f5e9de]"
                }`}
              >
                <span>
                  {category.name} ({count})
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }
