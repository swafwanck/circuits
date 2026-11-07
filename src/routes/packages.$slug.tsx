import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, MapPin, Check, X, Calendar, Users, Plane } from "lucide-react";
import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import { PackageCard } from "./../components/site/PackageCard";
import { usePackage, usePackages } from "./../lib/content";
import type { UIPackageFull } from "./../lib/content";
import { useEnquiry } from "./../components/site/EnquiryProvider";

export const Route = createFileRoute("/packages/$slug")({
  head: () => ({
    meta: [
      { title: "Package — Circuit Travels" },
      { name: "description", content: "Explore package details, pricing and inclusions with Circuit Travels." },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center"><p>Package not found.</p></div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center"><p>Error: {error.message}</p></div>
  ),
  component: PackageDetail,
});

function PackageDetail() {
  const { slug } = Route.useParams();
  const { data: pkg, isLoading } = usePackage(slug);

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!pkg) {
    return <div className="min-h-screen grid place-items-center"><p>Package not found.</p></div>;
  }
  return <PackageDetailView pkg={pkg} />;
}

function PackageDetailView({ pkg }: { pkg: UIPackageFull }) {
  const [tab, setTab] = useState<"overview" | "highlights" | "inclusions" | "itinerary" | "terms">("overview");
  const { data: allPackages = [] } = usePackages();
  const related = allPackages.filter((p) => p.slug !== pkg.slug).slice(0, 3);
  const { open } = useEnquiry();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Gallery */}
      <section className="container-page pt-4 sm:pt-6">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr] gap-2 md:gap-3 rounded-2xl sm:rounded-3xl overflow-hidden">
          <img src={pkg.gallery[0] ?? pkg.image} alt={pkg.name} className="col-span-2 md:col-span-1 aspect-[16/10] md:aspect-auto md:row-span-2 h-full w-full object-cover" />
          {pkg.gallery.slice(1, 5).map((g: string, i: number) => (
            <img key={i} src={g} alt="" className="hidden md:block aspect-[4/3] h-full w-full object-cover" />
          ))}
        </div>
      </section>

      <section className="container-page py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10">
        <div className="min-w-0">
          {/* <span className="text-xs text-muted-foreground">Code · {pkg.code}</span> */}
          <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight">{pkg.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white shadow-glow">
              <MapPin className="h-4 w-4" /> {pkg.destination}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sunset-gradient px-4 py-1.5 text-sm font-bold text-white shadow-glow">
              <Clock className="h-4 w-4" /> {pkg.duration}
            </span>
          </div>

          <div className="mt-6 sm:mt-8 relative rounded-[15px] bg-gradient-to-r from-secondary via-secondary/70 to-secondary p-1.5 shadow-inner overflow-x-auto no-scrollbar">
            <div className="flex gap-2 min-w-max">
              {(["overview", "highlights", "inclusions", "itinerary", "terms"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold capitalize whitespace-nowrap rounded-[10px] transition-all duration-300 ${
                    tab === t
                      ? "bg-sunset-gradient text-white shadow-glow scale-[1.04]"
                      : "text-black hover:text-white hover:bg-black"
                  }`}
                >
                  {t === "terms" ? "Terms & Conditions" : t}
                </button>
              ))}
            </div>
          </div>

          <div key={tab} className="mt-6 rounded-3xl bg-gradient-to-br from-secondary/40 via-background to-secondary/30 p-5 sm:p-7 ring-1 ring-border/50 shadow-glass animate-in fade-in slide-in-from-bottom-3 duration-500">
            {tab === "overview" && (
              <p className="text-base sm:text-lg text-black/85 leading-relaxed">{pkg.overview}</p>
            )}

            {tab === "highlights" && (
              <ul className="grid sm:grid-cols-2 gap-2">
                {pkg.highlights.map((h: string) => (
                  <li key={h} className="flex items-start gap-3 rounded-2xl bg-secondary p-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sunset-gradient text-white"><Check className="h-3.5 w-3.5" /></span>
                    <span className="text-sm font-semibold text-black">{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {tab === "itinerary" && (
              <ol className="relative border-l-2 border-dashed border-ocean/30 ml-5 pl-8 sm:pl-10 space-y-6">
                {pkg.itinerary.map((d: {day:number;title:string;detail:string}) => (
                  <li key={d.day} className="relative">
                    <span className="absolute -left-[46px] sm:-left-[54px] top-0 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-sunset-gradient text-[11px] font-bold text-white shadow-glow ring-4 ring-background">D{d.day}</span>
                    <h4 className="font-display text-base sm:text-lg font-bold">{d.title}</h4>
                    <p className="mt-1 text-sm text-black">{d.detail}</p>
                  </li>
                ))}
              </ol>

            )}

            {tab === "inclusions" && (
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2"><Check className="h-5 w-5 text-sunset" /> What's included</h3>
                  <ul className="mt-3 space-y-2">
                    {pkg.included.map((i: string) => (
                      <li key={i} className="flex gap-2 text-sm"><Check className="h-4 w-4 mt-0.5 text-sunset shrink-0" /> {i}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2"><X className="h-5 w-5 text-sunset" /> Not included</h3>
                  <ul className="mt-3 space-y-2">
                    {pkg.excluded.map((i: string) => (
                      <li key={i} className="flex gap-2 text-sm"><X className="h-4 w-4 mt-0.5 text-sunset shrink-0" /> {i}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {tab === "terms" && (
              pkg.terms.length ? (
                <ul className="space-y-2 text-sm text-black/90">
                  {pkg.terms.map((t: string) => (
                    <li key={t} className="flex gap-2"><Check className="h-4 w-4 mt-0.5 text-sunset shrink-0" /> {t}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-black">Terms & conditions will be shared with your quotation.</p>
              )
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <div className="rounded-3xl bg-card shadow-premium p-5 sm:p-6 border border-border">
            <div className="flex items-end gap-2">
              <p className="font-display text-3xl sm:text-4xl font-bold text-sunset">${pkg.price}</p>
              {/* <p className="text-sm text-muted-foreground line-through mb-1">${pkg.price}</p> */}
            </div>
            <p className="text-xs text-black font-bold text-[15px]">per person</p>

            <div className="mt-5 space-y-2.5">
              <button
                onClick={() => open({ variant: "booking", title: `Book: ${pkg.name}`, subtitle: `${pkg.duration} · $${pkg.offerPrice}/person`, amount: pkg.offerPrice, currency: "AED", itemType: "package", itemId: pkg.slug, askService: false })}
                className="w-full rounded-2xl bg-sunset-gradient py-3.5 font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform"
              >
                Book this trip
              </button>
              <button
                onClick={() => open({ title: `Enquire: ${pkg.name}`, subtitle: "Ask us anything about this trip.", itemType: "package", itemTitle: pkg.name, itemId: pkg.slug, askService: false })}
                className="w-full rounded-2xl bg-secondary py-3 text-sm font-semibold text-black hover:bg-black hover:text-white transition"
              >
                Send an enquiry
              </button>
            </div>

          </div>
        </aside>
      </section>

      <section className="container-page py-12 sm:py-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">You might also love</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {related.map((p, i) => <PackageCard key={p.slug} pkg={p} index={i} />)}
        </div>
      </section>

      <Footer />
    </div>
  );
}