import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, ArrowRight } from "lucide-react";
import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import { SectionHeader } from "./../components/site/Section";
import { type Deal } from "./../data/travel";
import { useDeals } from "./../lib/content";
import { CardBadges, computeSavePct } from "./../components/site/CardBadges";


export const Route = createFileRoute("/deals/")({
  head: () => ({
    meta: [
      { title: "Deals & Offers — Circuit Travels" },
      { name: "description", content: "Limited-time flash offers on packages, hotels, visas and UAE activities. Save up to 50%." },
      { property: "og:title", content: "Deals & Offers — Circuit Travels" },
      { property: "og:url", content: "/deals" },
    ],
    links: [{ rel: "canonical", href: "/deals" }],
  }),
  component: Deals,
});

const cats = ["All", "Package", "Visa", "Hotel", "Activity"] as const;

function Deals() {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const { data: deals = [] } = useDeals();
  const list: Deal[] = cat === "All" ? deals : deals.filter((d) => d.category === cat);
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative bg-hero text-ocean-deep overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sunset/40 blur-3xl" />
        <div className="container-page relative py-12 sm:py-20">
          <span className="inline-flex text-black font-bold items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]">
            <Flame className="h-3.5 w-3.5 text-black" /> Live Offers
          </span>
          <h1 className="mt-3 font-display text-3xl sm:text-5xl md:text-6xl font-bold text-black leading-tight">Deals & <span className="italic text-gradient-sunset">Offers</span></h1>
          <p className="mt-3 text-sm sm:text-base text-black max-w-xl">Flash sales on packages, hotels, visas and UAE activities. Refreshed every week.</p>
        </div>
      </section>

      <section className="container-page py-8 sm:py-10">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${cat === c ? "bg-black text-white shadow-glow" : "bg-secondary text-foreground hover:bg-secondary/70"}`}>
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="container-page pb-16 sm:pb-24">
        {list.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">No offers in this category right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {list.map((d, i) => (
              <Link key={d.slug} to="/deals/$slug" params={{ slug: d.slug }} className="group relative block overflow-hidden rounded-3xl bg-card shadow-glass hover:shadow-premium transition-all hover:-translate-y-1">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={d.image} alt={d.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <CardBadges
                    className="absolute top-2 left-2 right-2"
                    savePct={computeSavePct(d.price, d.offerPrice)}
                    bestseller={i % 3 === 0}
                    instant={i % 4 === 1}
                  />
                  <span className="absolute bottom-10 right-2 rounded-full glass px-2 py-0.5 text-[9px] font-semibold">{d.category}</span>
                  <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                    <h3 className="font-display text-sm sm:text-base font-bold leading-tight line-clamp-1">{d.title}</h3>
                  </div>
                </div>
                <div className="p-3 sm:p-3.5">
                  <p className="text-xs text-black line-clamp-1">{d.summary}</p>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] text-black line-through leading-none">${d.price}</p>
                      <p className="font-display text-base sm:text-lg font-bold text-black leading-tight">${d.offerPrice}</p>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1.5 text-[10px] font-semibold text-primary group-hover:bg-sunset group-hover:text-white transition-all">
                      View <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                  {/* <p className="mt-1.5 text-[9px] uppercase tracking-wider text-coral truncate">Valid till {d.validTill}</p> */}
                </div>

              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
