import Link from "next/link";
import { FolderTree, UtensilsCrossed, Sliders, ArrowRight, Play, ExternalLink, Sparkles } from "lucide-react";
import { restaurantService } from "@/lib/services/restaurant.service";

export const dynamic = "force-dynamic";

export default async function AdminRestaurantMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const menu = await restaurantService.getFullMenu(slug);
  const categories = menu?.categories || [];
  const dishes = menu?.dishes || [];

  return (
    <div className="space-y-6">
      {/* Header and Quick Preview Link */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Menu Management
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Configure categories, catalog dishes, and set up customer
            customization groups.
          </p>
        </div>

        <Link
          href={`/menu/${slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-[#dfb28e]/40 bg-gradient-to-r from-[#602e31] to-[#7a3a3e] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:scale-105 active:scale-95"
        >
          <Play className="h-3.5 w-3.5 fill-[#dfb28e] text-[#dfb28e]" />
          <span>Launch Cinematic Menu</span>
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </Link>
      </div>

      {/* Cinematic Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#dfb28e]/30 bg-gradient-to-r from-[#251214] via-[#3a181c] to-[#1a0a0c] p-6 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dfb28e]/40 bg-black/40 px-3 py-1 text-[11px] font-semibold text-[#dfb28e]">
              <Sparkles className="h-3 w-3" />
              <span>TRONX Cinematic Experience Active</span>
            </div>
            <h2 className="text-xl font-bold font-serif text-white sm:text-2xl">
              Video-First Dining & Discovery
            </h2>
            <p className="text-xs sm:text-sm text-white/70 max-w-xl leading-relaxed">
              Your customer dining menu is powered by TRONX cinematic video loops,
              intelligent framing, wine-and-ivory editorial styling, and table order
              synchronization.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={`/menu/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl bg-[#dfb28e] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#221416] transition hover:bg-[#ebd9cb] hover:shadow-xl active:scale-95"
            >
              <span>View Customer Experience</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-[#602e31]/40 blur-3xl" />
      </div>

      {/* Management Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Link
          href={`/admin/${slug}/menu/categories`}
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/25 hover:bg-white/10"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white">
            <FolderTree className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white">Categories</h2>
          <p className="mt-1 text-xs text-white/50 leading-relaxed">
            Manage menu sections ({categories.length} configured), visibility,
            and display sort order.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-white/70 group-hover:text-white">
            <span>Manage Categories</span>
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href={`/admin/${slug}/menu/dishes`}
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/25 hover:bg-white/10"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white">Dishes</h2>
          <p className="mt-1 text-xs text-white/50 leading-relaxed">
            Manage your food & drink items ({dishes.length} dishes), prices,
            descriptions, and video links.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-white/70 group-hover:text-white">
            <span>Manage Dishes</span>
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href={`/admin/${slug}/menu/addons`}
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/25 hover:bg-white/10"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white">
            <Sliders className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white">
            Add-ons & Options
          </h2>
          <p className="mt-1 text-xs text-white/50 leading-relaxed">
            Configure extras, accompaniments, required options, and choice
            boundaries.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-white/70 group-hover:text-white">
            <span>Manage Add-ons</span>
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
