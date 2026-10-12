import Link from "next/link";
import { restaurantService } from "@/lib/services/restaurant.service";
import { Sparkles, Play, Shield, Utensils, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const restaurants = (await restaurantService.getAll()).filter(
    (restaurant) => restaurant.isActive !== false,
  );

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black p-4 text-white selection:bg-[#dfb28e]/30">
      {/* Background Cinematic Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(96,46,49,0.35)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#251214]/60 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Editorial Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#dfb28e]/40 bg-black/60 px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-[#dfb28e]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#dfb28e]">
            Haute Gastronomy Experience
          </span>
        </div>

        {/* Branding Title */}
        <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Welcome to <span className="text-[#dfb28e]">TRONX</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-white/75 sm:text-base">
          TRONX powers cinematic, video-first digital dining experiences for world-class
          restaurants. Discover curated partner venues below or enter the management portal.
        </p>

        {/* Action Portals */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition hover:border-[#dfb28e] hover:bg-white/15"
          >
            <Utensils className="h-3.5 w-3.5 text-[#dfb28e]" />
            <span>Restaurant Admin</span>
          </Link>

          <Link
            href="/super-admin/login"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/70 backdrop-blur-md transition hover:border-white/30 hover:text-white"
          >
            <Shield className="h-3.5 w-3.5 opacity-60" />
            <span>Super Admin</span>
          </Link>
        </div>

        {/* Restaurant Discovery Cards */}
        <section className="mt-14 w-full max-w-3xl text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-serif text-lg font-bold text-white sm:text-xl">
              Explore Partner Restaurants
            </h2>
            <span className="text-xs text-white/50">
              {restaurants.length} {restaurants.length === 1 ? "venue active" : "venues active"}
            </span>
          </div>

          {restaurants && restaurants.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {restaurants.map((r) => (
                <Link
                  key={r.id}
                  href={`/menu/${r.slug}`}
                  className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:border-[#dfb28e]/50 hover:bg-[#602e31]/20 hover:shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-[#251214] font-serif text-base font-bold text-[#dfb28e]">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-white group-hover:text-[#dfb28e] transition-colors">
                        {r.name}
                      </h3>
                      <p className="text-[11px] text-white/50">
                        {r.tagline || "Cinematic Video Menu"}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dfb28e]/40 bg-[#602e31]/60 px-3 py-1 text-xs font-semibold text-[#dfb28e] transition-all group-hover:bg-[#602e31] group-hover:text-white">
                    <Play className="h-3 w-3 fill-current" />
                    <span>View Menu</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-center text-sm text-white/40">
              No restaurants currently published.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
