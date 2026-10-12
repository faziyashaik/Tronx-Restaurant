import type { Category, Dish } from "@/types";
import DishCard from "./DishCard";

type MenuSectionProps = {
  category: Category;
  dishes: Dish[];
  onDishClick: (dish: Dish) => void;
  onQuickAdd?: (dish: Dish) => void;
  favorites?: Set<string>;
  onToggleFavorite?: (dishId: string) => void;
  isFirstCategory?: boolean;
  videoMenuEnabled?: boolean;
  hasNextCategory?: boolean;
};

export default function MenuSection({
  category,
  dishes,
  onDishClick,
  onQuickAdd,
  favorites = new Set(),
  onToggleFavorite,
  isFirstCategory = false,
  videoMenuEnabled = true,
  hasNextCategory = true,
}: MenuSectionProps) {
  const categoryDishes = dishes
    .filter((dish) => dish.categoryId === category.id)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (categoryDishes.length === 0) {
    return null;
  }

  return (
    <section
      id={`category-${category.id}`}
      data-category-id={category.id}
      className="scroll-mt-32 sm:scroll-mt-36 transition-all duration-300"
    >
      {/* 1. Centered Editorial Section Header matching reference screenshot */}
      <div className="mb-8 flex flex-col items-center text-center">
        {/* Tracked uppercase overline label */}
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8c6b63]">
          {category.name}
        </p>

        {/* Large Luxury Serif Title */}
        <h2 className="mt-1 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1e1415]">
          {category.name}
        </h2>

        {/* Editorial Subtitle Description */}
        {category.description && (
          <p className="mt-2.5 max-w-xl text-xs sm:text-sm text-[#745f62] leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* 2. Three-column food-card grid on desktop */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoryDishes.map((dish, index) => (
          <DishCard
            key={dish.id}
            dish={dish}
            index={index}
            onClick={onDishClick}
            onQuickAdd={onQuickAdd}
            isFavorite={favorites.has(dish.id)}
            onToggleFavorite={onToggleFavorite}
            priority={isFirstCategory && index < 3}
            videoMenuEnabled={videoMenuEnabled}
          />
        ))}
      </div>

      {/* 3. Section Separator Cue leading to next category */}
      {hasNextCategory && (
        <div className="my-14 flex items-center justify-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e6d8cb] bg-white shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#541e24]" />
          </div>
        </div>
      )}
    </section>
  );
}
