import Link from "next/link";
import { notFound } from "next/navigation";
import { restaurantService } from "@/lib/services/restaurant.service";
import { Play, ExternalLink, UtensilsCrossed, Store, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminRestaurantDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = await restaurantService.getById(slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Brand Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-[#251214] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#dfb28e]">
              <span>TRONX Restaurant</span>
              <span>•</span>
              <span className="text-white/60">{restaurant.slug}</span>
            </div>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl font-serif">
              {restaurant.name}
            </h1>
            <p className="mt-2 text-sm text-white/60 max-w-xl">
              Manage your gastronomic catalog, availability, digital media, and preview
              your cinematic video customer dining menu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/menu/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-2.5 rounded-2xl border border-[#dfb28e]/50 bg-gradient-to-r from-[#602e31] to-[#7a3a3e] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              <Play className="h-4 w-4 fill-[#dfb28e] text-[#dfb28e]" />
              <span>Preview Live Menu</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </Link>
          </div>
        </div>

        {/* Decorative Glow */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-[#602e31]/30 blur-2xl" />
      </div>

      {/* Main Navigation Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href={`/admin/${slug}/menu`}
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-white transition hover:border-[#dfb28e]/40 hover:bg-white/8"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#602e31]/50 text-[#dfb28e]">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[#dfb28e]">
            Menu Catalog
          </p>
          <p className="mt-1 text-lg font-bold">Edit Categories & Dishes</p>
          <p className="mt-1 text-xs text-white/50">
            Configure dishes, assign videos, prices, and options.
          </p>
        </Link>

        <Link
          href={`/admin/${slug}/profile`}
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-white transition hover:border-white/20 hover:bg-white/8"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
            <Store className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/40">
            Profile & Branding
          </p>
          <p className="mt-1 text-lg font-semibold">Update Restaurant Details</p>
          <p className="mt-1 text-xs text-white/50">
            Address, tagline, logo, cover image, and contact details.
          </p>
        </Link>

        <Link
          href={`/admin/${slug}/availability`}
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-white transition hover:border-white/20 hover:bg-white/8"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
            <Clock className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/40">
            Availability & Hours
          </p>
          <p className="mt-1 text-lg font-semibold">Manage Open Status</p>
          <p className="mt-1 text-xs text-white/50">
            Open hours, service schedules, and dish availability.
          </p>
        </Link>
      </div>
    </div>
  );
}
