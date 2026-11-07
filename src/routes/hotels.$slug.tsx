import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, MapPin, Building2, Star, Shield, Sparkles } from "lucide-react";
import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import { useHotel } from "./../lib/content";
import type { UIHotelFull } from "./../lib/content";
import { useEnquiry } from "./../components/site/EnquiryProvider";

export const Route = createFileRoute("/hotels/$slug")({
  head: () => ({
    meta: [
      { title: "Hotel — Circuit Travels" },
      { name: "description", content: "Explore hotel details, pricing and inclusions with Circuit Travels." },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center"><p>Hotel not found.</p></div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center"><p>Error: {error.message}</p></div>
  ),
  component: HotelDetail,
});

function HotelDetail() {
  const { slug } = Route.useParams();
  const { data: hotel, isLoading } = useHotel(slug);

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!hotel) {
    return <div className="min-h-screen grid place-items-center"><p>Hotel not found.</p></div>;
  }
  return <HotelDetailView hotel={hotel} />;
}

function HotelDetailView({ hotel }: { hotel: UIHotelFull }) {
  const { open } = useEnquiry();
  const tabs = ["overview", "rooms", "amenities", "policies", "terms"] as const;
  type Tab = (typeof tabs)[number];
  const [tab, setTab] = useState<Tab>("overview");

  const rooms = hotel.rooms;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Klook/AFC-style gallery */}
      <section className="container-page pt-4 sm:pt-6">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 md:gap-3 rounded-2xl sm:rounded-3xl overflow-hidden max-h-[520px]">
          <img
            src={hotel.gallery[0] ?? hotel.image}
            alt={hotel.name}
            className="col-span-4 md:col-span-2 row-span-2 h-full w-full object-cover aspect-[16/10] md:aspect-auto"
          />
          {hotel.gallery.slice(1, 5).concat(Array(4).fill(hotel.image)).slice(0, 4).map((g: string, i: number) => (
            <img key={i} src={g} alt="" className="hidden md:block col-span-1 row-span-1 h-full w-full object-cover" />
          ))}
        </div>
      </section>

      {/* Title strip */}
      <section className="container-page pt-6 sm:pt-8">
        {/* <div className="flex flex-wrap items-center gap-2"> */}
          {/* <span className="rounded-full bg-sunset-gradient px-3 py-1 text-xs font-semibold text-white shadow-glow inline-flex items-center gap-1">
            {Array.from({ length: hotel.stars }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
          </span> */}
          {/* <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> Circuit Preferred
          </span> */}
          {/* <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-primary">
            <Shield className="h-3 w-3" /> Best-rate guarantee
          </span> */}
        {/* </div> */}
        <h1 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight">{hotel.name}</h1>
        <p className="mt-2 text-sm text-black flex items-center gap-2">
          <Building2 className="h-4 w-4 text-sunset" /> {hotel.city}, {hotel.country}
          <span className="mx-1">·</span>
          <MapPin className="h-4 w-4 text-sunset" /> {hotel.address}
        </p>
      </section>

      {/* Tabs + sticky sidebar */}
      <section className="container-page py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10">
        <div className="min-w-0">
          <div className="sticky top-16 md:top-20 z-10 -mx-3 sm:mx-0 px-3 sm:px-0 bg-background/95 backdrop-blur">
            <div className="flex gap-1 sm:gap-2 rounded-[15px] bg-secondary/60 p-1.5 border border-border shadow-glass overflow-x-auto no-scrollbar">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`group relative flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold capitalize whitespace-nowrap rounded-[10px] transition-all duration-300 ${
                    tab === t
                      ? "bg-sunset-gradient text-white shadow-glow scale-[1.02]"
                      : "text-black hover:text-white hover:bg-black"
                  }`}
                >
                  <span className="relative z-10">{t}</span>
                  {tab === t && (
                    <span className="absolute inset-x-3 bottom-1 h-0.5 bg-white/60 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />
                  )}
                </button>
              ))}
            </div>
          </div>


          <div key={tab} className="mt-6 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {tab === "overview" && (
              <>
                <p className="whitespace-pre-line text-base sm:text-lg text-black leading-relaxed">{hotel.overview || hotel.summary}</p>
                {hotel.amenities.length ? (
                  <div className="grid sm:grid-cols-3 gap-3">
                    {hotel.amenities.slice(0, 3).map((label: string) => (
                      <div key={label} className="rounded-2xl bg-secondary p-4 flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-sunset-gradient text-white">
                          <Sparkles className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-semibold">{label}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            )}

            {tab === "rooms" && (
              <div className="space-y-4">
                {rooms.length === 0 ? (
                  <p className="text-sm text-black">Room details will be shared on request.</p>
                ) : rooms.map((r) => (
                  <div key={r.title} className="rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
                    <div className="flex-1">
                      <h3 className="font-display text-lg sm:text-xl font-bold text-black">{r.title}</h3>
                      {r.description ? <p className="mt-1 text-xs text-black">{r.description}</p> : null}
                      <ul className="mt-3 space-y-1.5 text-sm">
                        {r.points.map((i) => (
                          <li key={i} className="flex gap-2"><Check className="h-4 w-4 mt-0.5 text-sunset shrink-0" /> {i}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="sm:text-right sm:min-w-[180px] flex sm:flex-col items-center sm:items-end justify-between gap-3">
                      <div>
                        {/* <p className="text-xs text-muted-foreground">from</p> */}
                        <p className="font-display text-2xl font-bold text-sunset leading-none">${r.price}<span className="text-xs font-sans font-bold text-black">/ Night</span></p>
                      </div>
                      <button
                        onClick={() => open({ variant: "booking", title: `Book: ${hotel.name} — ${r.title}`, amount: r.price, currency: "AED", itemType: "hotel", itemTitle: `${hotel.name} — ${r.title}`, itemId: hotel.slug, askService: false })}
                        className="rounded-2xl bg-sunset-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "amenities" && (
              <ul className="grid sm:grid-cols-2 gap-2">
                {hotel.amenities.map((a: string) => (
                  <li key={a} className="flex items-start gap-3 rounded-2xl bg-secondary p-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sunset-gradient text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm text-black">{a}</span>
                  </li>
                ))}
              </ul>
            )}

            {tab === "policies" && (
              hotel.policies.length ? (
                <ul className="space-y-2 text-sm">
                  {hotel.policies.map((p: string) => (
                    <li key={p} className="flex gap-2 text-black"><Shield className="h-4 w-4 mt-0.5 text-sunset shrink-0" /> {p}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-black">Policies will be confirmed with your booking voucher.</p>
              )
            )}

            {tab === "terms" && (
              hotel.terms.length ? (
                <ul className="space-y-2 text-sm">
                  {hotel.terms.map((t: string) => (
                    <li key={t} className="flex gap-2 text-black"><Check className="h-4 w-4 mt-0.5 text-sunset shrink-0" /> {t}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-black">Terms &amp; conditions will be shared with your quotation.</p>
              )
            )}

          </div>
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <div className="rounded-3xl bg-card shadow-premium p-5 sm:p-6 border border-border">
            {/* <p className="text-xs text-muted-foreground">from</p> */}
            <p className="font-display text-3xl sm:text-4xl font-bold text-sunset leading-none">
              ${hotel.pricePerNight} AED<span className="text-sm font-sans font-normal text-black">/ Night</span>
            </p>
            {/* <p className="mt-1 text-[11px] text-muted-foreground">Taxes & fees included · lowest rate we've seen</p> */}

            <div className="mt-5 space-y-2.5">
              <button
                onClick={() => open({ variant: "booking", title: `Book: ${hotel.name}`, amount: hotel.pricePerNight, currency: "AED", itemType: "hotel", itemTitle: hotel.name, itemId: hotel.slug, askService: false })}
                className="w-full rounded-2xl bg-sunset-gradient py-3.5 font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform"
              >
                Book this hotel
              </button>
              <button
                onClick={() => open({ channel: "email", title: `Enquire: ${hotel.name}`, itemType: "hotel", itemTitle: hotel.name, itemId: hotel.slug , askService: false })}
                className="w-full rounded-2xl bg-secondary py-3 text-sm font-semibold text-black hover:bg-black hover:text-white transition"
              >
                Send an enquiry
              </button>
            </div>

            {/* <div className="mt-5 pt-5 border-t border-border grid grid-cols-3 gap-2 text-[10px] text-center text-muted-foreground">
              <div className="space-y-1"><Shield className="h-4 w-4 mx-auto text-ocean" /><p>Best-rate<br />guarantee</p></div>
              <div className="space-y-1"><Sparkles className="h-4 w-4 mx-auto text-ocean" /><p>Concierge<br />upgrades</p></div>
              <div className="space-y-1"><Star className="h-4 w-4 mx-auto text-ocean" /><p>Handpicked<br />by us</p></div>
            </div> */}
            <p className="mt-4 text-[11px] text-black text-center">Hotel enquiries go to our desk — reply within 24h.</p>
          </div>
          <Link to="/hotels" className="mt-4 block text-center text-sm text-black font-semibold hover:text-sunset">← All hotels</Link>
        </aside>
      </section>


      <Footer />
    </div>
  );
}