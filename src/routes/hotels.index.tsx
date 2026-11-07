import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, MapPin } from "lucide-react";
import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import { SectionHeader } from "./../components/site/Section";
import { useHotels } from "./../lib/content";
import { CardBadges } from "./../components/site/CardBadges";


export const Route = createFileRoute("/hotels/")({
  head: () => ({
    meta: [
      { title: "Hotels — Circuit Travels" },
      { name: "description", content: "Iconic hotels, boutique gems and luxury resorts — handpicked worldwide." },
      { property: "og:title", content: "Hotels — Circuit Travels" },
      { property: "og:url", content: "/hotels" },
    ],
    links: [{ rel: "canonical", href: "/hotels" }],
  }),
  component: Hotels,
});

function Hotels() {
  const { data: hotels = [] } = useHotels();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative bg-hero text-ocean-deep overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-mint/40 blur-3xl" />
        <div className="container-page relative py-12 sm:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-black font-bold">Stays</p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl md:text-6xl font-bold text-black leading-tight">Iconic <span className="text-gradient-sunset">hotels</span></h1>
          <p className="mt-3 text-sm sm:text-base text-black max-w-xl">Handpicked stays — from ocean-front icons to alpine sanctuaries.</p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <SectionHeader eyebrow="Featured Stays" title="Where you'll actually want to wake up" />
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {hotels.map((h, i) => (
            <Link key={h.slug} to="/hotels/$slug" params={{ slug: h.slug }} className="group block overflow-hidden rounded-3xl bg-card shadow-glass hover:shadow-premium transition-all hover:-translate-y-1">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={h.image} alt={h.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                {/* <CardBadges
                  className="absolute top-2 left-2 right-2"
                  bestseller={i % 3 === 0}
                  instant={i % 4 === 1}
                /> */}
                {/* <span className="absolute bottom-10 right-2 rounded-full glass px-2 py-0.5 text-[9px] font-bold">{"★".repeat(h.stars)}</span> */}
                <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                  <p className="text-[10px] opacity-90 flex items-center gap-1 truncate"><Building2 className="h-2.5 w-2.5 shrink-0" /> <span className="truncate">{h.city}, {h.country}</span></p>
                  <h3 className="mt-0.5 font-display text-sm sm:text-base font-bold leading-tight line-clamp-1">{h.name}</h3>
                </div>
              </div>
              <div className="p-3 sm:p-3.5">
                <p className="text-xs text-black line-clamp-1">{h.summary}</p>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    {/* <p className="text-[10px] text-black leading-none">from</p> */}
                    <p className="font-display text-base sm:text-lg font-bold text-black leading-tight">${h.pricePerNight}<span className="text-[12px] font-sans font-bold text-black">/ night</span></p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-black px-5 py-1.5 text-[12px] font-bold text-white group-hover:bg-sunset group-hover:text-white transition-all">View →</span>
                </div>
              </div>

            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
