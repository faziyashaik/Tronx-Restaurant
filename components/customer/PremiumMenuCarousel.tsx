"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Plus, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { Category, Dish } from "@/types";
import { getDishVideoConfig } from "@/lib/video-assignment";
import VideoPlayer from "./VideoPlayer";

const FALLBACK_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80";

type PremiumMenuCarouselProps = {
  categories: Category[];
  activeCategory: string;
  dishes: Dish[];
  onDishClick: (dish: Dish) => void;
  onCategoryChange?: (categoryId: string) => void;
  onQuickAdd?: (dish: Dish) => void;
  favorites?: Set<string>;
  onToggleFavorite?: (dishId: string) => void;
  videoMenuEnabled?: boolean;
};

type DishMediaProps = {
  dish: Dish;
  index: number;
  priority?: boolean;
  className?: string;
  sizes: string;
  videoMenuEnabled: boolean;
  onImageError: (dishId: string) => void;
  imageSrc: string;
  isHovered?: boolean;
  gradientClassName?: string;
  videoObjectFit?: "cover" | "contain";
};

function formatPrice(price: number) {
  return `₹${price.toFixed(price % 1 === 0 ? 0 : 2)}`;
}

function getCategoryName(categories: Category[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? "Menu";
}

function DishMedia({
  dish,
  index,
  priority = false,
  className = "",
  sizes,
  videoMenuEnabled,
  onImageError,
  imageSrc,
  isHovered: controlledHovered,
  gradientClassName = "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/86 via-black/18 to-black/5",
  videoObjectFit = "cover",
}: DishMediaProps) {
  const [internalHovered, setInternalHovered] = useState(false);
  const hovered = controlledHovered !== undefined ? controlledHovered : internalHovered;
  const videoConfig = getDishVideoConfig(dish, index);

  return (
    <div
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && controlledHovered === undefined) {
          setInternalHovered(true);
        }
      }}
      onPointerLeave={() => {
        if (controlledHovered === undefined) {
          setInternalHovered(false);
        }
      }}
      className={`overflow-hidden bg-[#251214] ${className}`}
    >
      <Image
        src={imageSrc}
        alt={dish.name}
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        sizes={sizes}
        style={{ objectPosition: videoConfig.objectPosition }}
        onError={() => onImageError(dish.id)}
        className={`absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-700 ease-out ${
          hovered ? "scale-105" : "scale-100"
        }`}
      />
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
          objectFit={videoObjectFit}
          className={`absolute inset-0 z-10 h-full w-full transition-opacity duration-500 ease-out ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      <div className={gradientClassName} />
    </div>
  );
}

type CategoryDishCardProps = {
  dish: Dish;
  index: number;
  isFavorite: boolean;
  videoMenuEnabled: boolean;
  onDishClick: (dish: Dish) => void;
  onQuickAdd?: (dish: Dish) => void;
  onToggleFavorite?: (dishId: string) => void;
  onImageError: (dishId: string) => void;
  imageSrc: string;
};

function CategoryDishCard({
  dish,
  index,
  isFavorite,
  videoMenuEnabled,
  onDishClick,
  onQuickAdd,
  onToggleFavorite,
  onImageError,
  imageSrc,
}: CategoryDishCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      className="group grid h-full min-h-32 grid-cols-[7.25rem_1fr] overflow-hidden border-b border-[#eaded3] pb-4 transition hover:border-[#541e24]/35 sm:grid-cols-[8.5rem_1fr] xl:flex xl:min-h-[25.75rem] xl:flex-col xl:rounded-[1rem] xl:border xl:border-[#eaded3] xl:bg-white/70 xl:p-3 xl:shadow-[0_14px_34px_rgba(40,15,18,0.06)] xl:hover:-translate-y-0.5 xl:hover:border-[#541e24]/25 xl:hover:bg-white xl:hover:shadow-[0_22px_48px_rgba(84,30,36,0.11)]"
    >
      <button
        type="button"
        onClick={() => onDishClick(dish)}
        className="relative h-32 overflow-hidden rounded-[0.85rem] bg-[#251214] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#541e24] sm:h-36 xl:h-auto xl:aspect-[4/3] xl:w-full xl:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
        aria-label={`Open details for ${dish.name}`}
      >
        <DishMedia
          dish={dish}
          index={index}
          imageSrc={imageSrc}
          sizes="(max-width: 640px) 116px, (max-width: 1280px) 136px, 25vw"
          videoMenuEnabled={videoMenuEnabled}
          onImageError={onImageError}
          isHovered={hovered}
          videoObjectFit="cover"
          gradientClassName="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/54 via-transparent to-black/10"
          className="relative h-full w-full"
        />
      </button>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-1 pl-4 xl:pt-3 xl:pl-0">
        <button
          type="button"
          onClick={() => onDishClick(dish)}
          className="min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#541e24]"
        >
          <h5 className="line-clamp-2 text-lg font-black uppercase leading-tight tracking-tight text-[#1e1415] xl:min-h-[2.5rem] xl:text-base">
            {dish.name}
          </h5>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#705e60] xl:min-h-[2.5rem]">
            {dish.description || "Freshly prepared with TRONX house seasoning."}
          </p>
          {dish.dietaryTags && dish.dietaryTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {dish.dietaryTags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#f5ebe1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#705e60]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </button>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#eaded3] pt-3">
          <span className="font-mono text-sm font-extrabold text-[#541e24]">
            {formatPrice(dish.price)}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleFavorite?.(dish.id)}
              aria-label={
                isFavorite
                  ? `Remove ${dish.name} from favorites`
                  : `Add ${dish.name} to favorites`
              }
              className="grid h-8 w-8 place-items-center rounded-full text-[#705e60] transition hover:bg-[#f5ebe1] hover:text-[#541e24]"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-[#e0565b] text-[#e0565b]" : ""
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => (onQuickAdd ? onQuickAdd(dish) : onDishClick(dish))}
              disabled={!dish.isAvailable}
              aria-label={`Add ${dish.name} to order`}
              className="grid h-8 w-8 place-items-center rounded-full bg-[#541e24] text-white transition hover:bg-[#6e272f] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

type PopularDishCardProps = {
  dish: Dish;
  index: number;
  isFavorite: boolean;
  videoMenuEnabled: boolean;
  onDishClick: (dish: Dish) => void;
  onToggleFavorite?: (dishId: string) => void;
  onImageError: (dishId: string) => void;
  imageSrc: string;
  isDragged: () => boolean;
};

function PopularDishCard({
  dish,
  index,
  isFavorite,
  videoMenuEnabled,
  onDishClick,
  onToggleFavorite,
  onImageError,
  imageSrc,
  isDragged,
}: PopularDishCardProps) {
  const [hovered, setHovered] = useState(false);

  const handleCardClick = () => {
    if (!isDragged()) {
      onDishClick(dish);
    }
  };

  return (
    <article
      data-popular-card
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      aria-label={`Open details for ${dish.name}`}
      className="group relative h-[280px] sm:h-[295px] md:h-[310px] lg:h-[320px] basis-[72%] sm:basis-[42%] md:basis-[calc((100%_-_1.5rem)/3)] lg:basis-[calc((100%_-_3rem)/5)] 2xl:basis-[calc((100%_-_3.75rem)/6)] shrink-0 snap-start overflow-hidden rounded-2xl border border-black/10 bg-[#251214] shadow-[0_16px_34px_rgba(40,15,18,0.12)] transition duration-300 hover:-translate-y-1 hover:border-[#541e24]/35 hover:shadow-[0_20px_44px_rgba(84,30,36,0.18)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb28e]"
    >
      <DishMedia
        dish={dish}
        index={index}
        priority={index < 2}
        imageSrc={imageSrc}
        sizes="(max-width: 640px) 72vw, (max-width: 768px) 42vw, (max-width: 1024px) 30vw, (max-width: 1536px) 20vw, 16vw"
        videoMenuEnabled={videoMenuEnabled}
        onImageError={onImageError}
        isHovered={hovered}
        gradientClassName="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 via-45% to-transparent"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite?.(dish.id);
        }}
        aria-label={
          isFavorite
            ? `Remove ${dish.name} from favorites`
            : `Add ${dish.name} to favorites`
        }
        className="absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition hover:bg-[#541e24]/80 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb28e]"
      >
        <Heart
          className={`h-4 w-4 ${
            isFavorite ? "fill-[#e0565b] text-[#e0565b]" : ""
          }`}
        />
      </button>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-md shadow-xs">
          <Sparkles className="h-3 w-3 text-[#dfb28e]" />
          <span>{dish.isSignature ? "Signature" : "Chef's Pick"}</span>
        </div>
        <p className="line-clamp-2 text-base sm:text-lg font-black uppercase leading-tight tracking-tight text-white drop-shadow-sm">
          {dish.name}
        </p>
        <p className="mt-1.5 font-mono text-sm sm:text-base font-extrabold text-[#dfb28e] drop-shadow-sm">
          {formatPrice(dish.price)}
        </p>
      </div>
    </article>
  );
}

export default function PremiumMenuCarousel({
  categories,
  activeCategory,
  dishes,
  onDishClick,
  onCategoryChange,
  onQuickAdd,
  favorites = new Set(),
  onToggleFavorite,
  videoMenuEnabled = true,
}: PremiumMenuCarouselProps) {
  const popularScrollerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    dragged: false,
  });
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const [popularScrollProgress, setPopularScrollProgress] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const visibleDishes = useMemo(() => {
    return dishes
      .filter((dish) => !activeCategory || dish.categoryId === activeCategory)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [activeCategory, dishes]);

  const popularDishes = useMemo(() => {
    return [...dishes]
      .sort((a, b) => {
        const aScore =
          Number(Boolean(a.isSignature)) * 3 +
          Number(Boolean(a.isChefsChoice)) * 2 -
          a.sortOrder / 100;
        const bScore =
          Number(Boolean(b.isSignature)) * 3 +
          Number(Boolean(b.isChefsChoice)) * 2 -
          b.sortOrder / 100;
        return bScore - aScore;
      })
      .slice(0, 12);
  }, [dishes]);

  const categoryCounts = useMemo(() => {
    return categories.reduce<Record<string, number>>((counts, category) => {
      counts[category.id] = dishes.filter((dish) => dish.categoryId === category.id).length;
      return counts;
    }, {});
  }, [categories, dishes]);

  const groupedVisibleDishes = useMemo(() => {
    if (activeCategory) {
      return [
        {
          category: categories.find((category) => category.id === activeCategory),
          dishes: visibleDishes,
        },
      ];
    }

    return categories
      .map((category) => ({
        category,
        dishes: visibleDishes.filter((dish) => dish.categoryId === category.id),
      }))
      .filter((group) => group.dishes.length > 0);
  }, [activeCategory, categories, visibleDishes]);

  const updatePopularProgress = useCallback(() => {
    const scroller = popularScrollerRef.current;
    if (!scroller) return;

    const styles = window.getComputedStyle(scroller);
    const startInset = Number.parseFloat(styles.paddingLeft || "0") || 0;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth - startInset;
    const effectiveScroll = Math.max(0, scroller.scrollLeft - startInset);
    const nextProgress = maxScroll > 0 ? effectiveScroll / maxScroll : 0;
    setPopularScrollProgress(Math.min(1, Math.max(0, nextProgress)));
    setCanScrollPrev(effectiveScroll > 4);
    setCanScrollNext(effectiveScroll < maxScroll - 4);
  }, []);

  const scrollPopular = (direction: "left" | "right") => {
    const scroller = popularScrollerRef.current;
    if (!scroller) return;

    const firstCard = scroller.querySelector<HTMLElement>("[data-popular-card]");
    const cardWidth = firstCard?.offsetWidth ?? scroller.clientWidth * 0.4;
    const styles = window.getComputedStyle(scroller);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const cardsPerMove = Math.max(1, Math.floor(scroller.clientWidth / (cardWidth + gap)) - 1);

    scroller.scrollBy({
      left: (cardWidth + gap) * cardsPerMove * (direction === "left" ? -1 : 1),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updatePopularProgress();
    const scroller = popularScrollerRef.current;
    if (!scroller) return;

    const resizeObserver = new ResizeObserver(updatePopularProgress);
    resizeObserver.observe(scroller);
    window.addEventListener("resize", updatePopularProgress);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePopularProgress);
    };
  }, [popularDishes.length, updatePopularProgress]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || event.button !== 0) return;
    const scroller = popularScrollerRef.current;
    if (!scroller) return;
    dragStateRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
      dragged: false,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const scroller = popularScrollerRef.current;
    const drag = dragStateRef.current;
    if (!scroller || !drag.active) return;

    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 6) {
      drag.dragged = true;
      if (!scroller.hasPointerCapture(event.pointerId)) {
        try {
          scroller.setPointerCapture(event.pointerId);
        } catch {
          // Ignore
        }
      }
    }
    if (drag.dragged) {
      scroller.scrollLeft = drag.scrollLeft - delta;
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const scroller = popularScrollerRef.current;
    if (scroller?.hasPointerCapture(event.pointerId)) {
      try {
        scroller.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore
      }
    }
    window.setTimeout(() => {
      dragStateRef.current.active = false;
      dragStateRef.current.dragged = false;
    }, 50);
  };

  const handleImageError = (dishId: string) => {
    setFailedImages((current) => new Set(current).add(dishId));
  };

  const getDishImage = (dish: Dish, index = 0) => {
    const config = getDishVideoConfig(dish, index);
    return failedImages.has(dish.id) || !config.posterUrl
      ? FALLBACK_FOOD_IMAGE
      : config.posterUrl;
  };

  return (
    <section
      id="category-carousel-menu"
      aria-labelledby="premium-menu-title"
      className="relative text-[#1e1415]"
    >
      {popularDishes.length > 0 && (
        <div className="border-b border-[#e6d8cb] pb-8">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#8c6b63]">
                Video Menu
              </p>
              <h2
                id="premium-menu-title"
                className="mt-1 text-2xl font-black uppercase tracking-tight text-[#1e1415] sm:text-3xl"
              >
                Popular Dishes
              </h2>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollPopular("left")}
                disabled={!canScrollPrev}
                aria-label="Scroll popular dishes left"
                className="grid h-9 w-9 place-items-center rounded-full border border-[#e6d8cb] bg-white text-[#541e24] shadow-sm transition hover:border-[#541e24]/35 hover:bg-[#fbf6f0] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollPopular("right")}
                disabled={!canScrollNext}
                aria-label="Scroll popular dishes right"
                className="grid h-9 w-9 place-items-center rounded-full border border-[#e6d8cb] bg-white text-[#541e24] shadow-sm transition hover:border-[#541e24]/35 hover:bg-[#fbf6f0] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div
            ref={popularScrollerRef}
            onScroll={updatePopularProgress}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="-mx-4 flex cursor-grab snap-x snap-proximity gap-3 overflow-x-auto px-4 pb-3 scroll-smooth scrollbar-none active:cursor-grabbing [-webkit-overflow-scrolling:touch] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            {popularDishes.map((dish, index) => (
              <PopularDishCard
                key={`popular-${dish.id}`}
                dish={dish}
                index={index}
                isFavorite={favorites.has(dish.id)}
                videoMenuEnabled={videoMenuEnabled}
                onDishClick={onDishClick}
                onToggleFavorite={onToggleFavorite}
                onImageError={handleImageError}
                imageSrc={getDishImage(dish, index)}
                isDragged={() => dragStateRef.current.dragged}
              />
            ))}
          </div>

          <div
            aria-hidden="true"
            className="mx-auto mt-1 h-1 max-w-56 overflow-hidden rounded-full bg-[#e6d8cb]"
          >
            <div
              className="h-full rounded-full bg-[#541e24] transition-transform duration-200"
              style={{
                width: "34%",
                transform: `translateX(${popularScrollProgress * 194}%)`,
              }}
            />
          </div>
        </div>
      )}

      <div className="pt-8 sm:pt-10">
        <header className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#8c6b63]">
              Browse Menu
            </p>
            <h3 className="mt-1 text-3xl font-black uppercase tracking-tight text-[#1e1415]">
              {activeCategory ? getCategoryName(categories, activeCategory) : "All Items"}
            </h3>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#705e60]">
            {visibleDishes.length} {visibleDishes.length === 1 ? "item" : "items"}
          </p>
        </header>

        {onCategoryChange && categories.length > 0 && (
          <div className="mb-6 flex gap-2 overflow-x-auto border-y border-[#eaded3] py-3 scrollbar-none [-webkit-overflow-scrolling:touch]">
            <button
              type="button"
              onClick={() => onCategoryChange("all")}
              aria-pressed={!activeCategory}
              className={`shrink-0 border-b px-1 pb-2 text-xs font-black uppercase tracking-[0.18em] transition ${
                !activeCategory
                  ? "border-[#541e24] text-[#541e24]"
                  : "border-transparent text-[#705e60] hover:text-[#1e1415]"
              }`}
            >
              All ({dishes.length})
            </button>
            {categories.map((category) => {
              const isActive = category.id === activeCategory;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategoryChange(category.id)}
                  aria-pressed={isActive}
                  className={`shrink-0 border-b px-1 pb-2 text-xs font-black uppercase tracking-[0.18em] transition ${
                    isActive
                      ? "border-[#541e24] text-[#541e24]"
                      : "border-transparent text-[#705e60] hover:text-[#1e1415]"
                  }`}
                >
                  {category.name} ({categoryCounts[category.id] ?? 0})
                </button>
              );
            })}
          </div>
        )}

        <div className="space-y-9">
          {groupedVisibleDishes.map(({ category, dishes: categoryDishes }) => (
            <section key={category?.id ?? "all"} aria-label={category?.name ?? "Menu items"}>
              {!activeCategory && (
                <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#eaded3] pb-3">
                  <h4 className="text-xl font-black uppercase tracking-tight text-[#1e1415]">
                    {category?.name ?? "Menu"}
                  </h4>
                  <span className="rounded-full border border-[#e6d8cb] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#705e60]">
                    {categoryDishes.length} items
                  </span>
                </div>
              )}

              <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
                {categoryDishes.map((dish, index) => (
                  <CategoryDishCard
                    key={`category-${dish.id}`}
                    dish={dish}
                    index={index}
                    isFavorite={favorites.has(dish.id)}
                    videoMenuEnabled={videoMenuEnabled}
                    onDishClick={onDishClick}
                    onQuickAdd={onQuickAdd}
                    onToggleFavorite={onToggleFavorite}
                    onImageError={handleImageError}
                    imageSrc={getDishImage(dish, index)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
