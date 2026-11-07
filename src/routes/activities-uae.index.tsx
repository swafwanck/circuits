import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Clock, ArrowRight, Shield } from "lucide-react";
import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import { SectionHeader } from "./../components/site/Section";
import { useActivities } from "./../lib/content";


export const Route = createFileRoute("/activities-uae/")({
  head: () => ({
    meta: [
      { title: "Activities in UAE — Circuit Travels" },
      { name: "description", content: "Desert safaris, Burj Khalifa, yacht cruises, Atlantis Aquaventure and more — curated UAE experiences." },
      { property: "og:title", content: "Activities in UAE — Circuit Travels" },
      { property: "og:url", content: "/activities-uae" },
    ],
    links: [{ rel: "canonical", href: "/activities-uae" }],
  }),
  component: UAEActivities,
});

function UAEActivities() {
  const { data: uaeActivities = [] } = useActivities();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative bg-hero text-ocean-deep overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-lavender/40 blur-3xl" />
        <div className="container-page relative py-12 sm:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-black font-bold">UAE Experiences</p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl md:text-6xl font-bold text-black leading-tight">Activities in the <span className="text-gradient-sunset">UAE</span></h1>
          <p className="mt-3 text-sm sm:text-base text-black max-w-xl">Desert safaris, Burj Khalifa, yacht cruises, Aquaventure & more — instant booking.</p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <SectionHeader eyebrow="Top Experiences" title="Explore  Experience  Enjoy " />
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {uaeActivities.map((a) => {
            const savings = Math.round(((a.price - a.offerPrice) / a.price) * 100);
            return (
              <Link
                key={a.slug}
                to="/activities-uae/$slug"
                params={{ slug: a.slug }}
                className="group grid grid-cols-[1fr_140px] sm:grid-cols-[1fr_180px] overflow-hidden rounded-3xl bg-card shadow-glass hover:shadow-premium transition-all hover:-translate-y-1 border border-border/60"
              >
                {/* Text left */}
                <div className="p-4 sm:p-5 flex flex-col min-w-0">
                  {/* <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-sunset-gradient px-2 py-0.5 text-[10px] font-bold text-white shadow-glow">
                      Save {savings}%
                    </span>
                  </div> */}
                  <h3 className="mt-2 font-display text-base sm:text-lg font-bold text-black leading-tight line-clamp-2 group-hover:text-sunset transition-colors">
                    {a.name}
                  </h3>
                  <p className="mt-1 text-[11px] sm:text-xs text-black font-bold flex items-center gap-3">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.city}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.duration}</span>
                  </p>
                  <p className="mt-2 hidden sm:block text-xs text-black line-clamp-2">{a.summary}</p>
                  <div className="mt-auto pt-3 flex items-end justify-between gap-2">
                    <div>
                      {/* <p className="text-[9px] text-black">from <span className="line-through">${a.price}</span></p> */}
                      <p className="font-display text-lg sm:text-xl font-bold text-black leading-none">
                        ${a.offerPrice}
                        <span className="text-[13px] font-sans font-bold text-black">/ Person</span>
                      </p>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-[11px] font-semibold text-black group-hover:bg-sunset group-hover:text-white transition-all">
                      View <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
                {/* Image right */}
                <div className="relative overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </Link>
            );
          })}
        </div>

      </section>

      <Footer />
    </div>
  );
}
