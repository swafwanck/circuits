import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, MapPin, Clock, Shield, Star, Zap, Info, ChevronRight, Users, Globe, Ticket } from "lucide-react";
import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import { useActivity } from "./../lib/content";
import type { UIActivityFull } from "./../lib/content";
import { useEnquiry } from "./../components/site/EnquiryProvider";

export const Route = createFileRoute("/activities-uae/$slug")({
  head: () => ({
    meta: [
      { title: "Activity — Circuit Travels" },
      { name: "description", content: "Explore activity details, pricing and inclusions with Circuit Travels." },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center"><p>Activity not found.</p></div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center"><p>Error: {error.message}</p></div>
  ),
  component: ActivityDetail,
});

function ActivityDetail() {
  const { slug } = Route.useParams();
  const { data: activity, isLoading } = useActivity(slug);

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!activity) {
    return <div className="min-h-screen grid place-items-center"><p>Activity not found.</p></div>;
  }
  return <ActivityDetailView activity={activity} />;
}

function ActivityDetailView({ activity }: { activity: UIActivityFull }) {
  const { open } = useEnquiry();
  const tabs = ["overview", "included", "meeting", "terms"] as const;
  type Tab = (typeof tabs)[number];
  const [tab, setTab] = useState<Tab>("overview");
  const [activeImg, setActiveImg] = useState<string>(activity.gallery[0] ?? activity.image);
  const savings = Math.round(((activity.price - activity.offerPrice) / activity.price) * 100);

  const thumbs = Array.from(new Set([activity.image, ...activity.gallery])).slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumbs */}
      <div className="container-page pt-4 sm:pt-6">
        <nav className="flex items-center gap-1 text-xs text-black">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/activities-uae" className="hover:text-primary">UAE Activities</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-black line-clamp-1">{activity.name}</span>
        </nav>
      </div>

      {/* Redesigned hero: featured image + thumbnails + floating title */}
      <section className="container-page pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_120px] gap-3">
          <div className="relative rounded-3xl overflow-hidden shadow-premium group">
            <img
              src={activeImg}
              alt={activity.name}
              className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {/* <span className="rounded-full bg-sunset-gradient px-3 py-1 text-[10px] font-bold text-white shadow-glow">
                Save {savings}%
              </span> */}
              {/* <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-[10px] font-semibold text-primary">
                <Star className="h-3 w-3 fill-current" /> Bestseller
              </span> */}
            </div>
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white">
              <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs opacity-95">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {activity.city}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {activity.duration}</span>
                {/* <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> EN / AR guide</span> */}
              </div>
              <h1 className="mt-1.5 font-display text-2xl sm:text-4xl md:text-5xl font-bold leading-tight drop-shadow">
                {activity.name}
              </h1>
            </div>
          </div>

          {/* Thumbnails column */}
          <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
            {thumbs.map((g, i) => (
              <button
                key={g + i}
                onClick={() => setActiveImg(g)}
                className={`relative rounded-xl overflow-hidden aspect-square border-2 transition ${
                  activeImg === g ? "border-primary shadow-glow" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Trust ribbon */}
        {/* <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { icon: Zap, label: "Instant confirmation" },
            { icon: Shield, label: "Free cancellation 24h" },
            { icon: Ticket, label: "Mobile voucher" },
            { icon: Users, label: "Small groups" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-2xl bg-secondary px-3 py-2.5 text-[11px] sm:text-xs font-semibold text-primary">
              <Icon className="h-4 w-4 shrink-0" /> {label}
            </div>
          ))}
        </div> */}
      </section>

      {/* Main content: content + sticky booking */}
      <section className="container-page py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10">
        <div className="min-w-0 space-y-10">
          {/* Packages */}
          {activity.packages.length ? (
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-black">Choose your package</h2>
            <p className="mt-1 text-xs sm:text-sm text-sunset">Instant confirmation on all options.</p>
            <div className="mt-5 space-y-3">
              {activity.packages.map((p) => (
                <div
                  key={p.title}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5 hover:shadow-premium hover:border-primary/30 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base sm:text-lg font-bold text-black">{p.title}</h3>
                    {p.description ? <p className="mt-1 text-xs sm:text-sm text-black">{p.description}</p> : null}
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
                    <div className="sm:text-right">
                      {/* <p className="text-[10px] text-muted-foreground">from</p> */}
                      <p className="font-display text-xl font-bold text-sunset leading-none">${p.price} <span className="text-[14px] text-black font-bold"> / Person</span></p>
                      
                    </div>
                    <button
                      onClick={() => open({ variant: "booking", title: `${p.title}: ${activity.name}`, amount: p.price, currency: "AED", itemType: "activity", itemTitle: `${activity.name} — ${p.title}`, itemId: activity.slug, askService: false })}
                      className="rounded-[10px] bg-sunset-gradient px-4 py-2.5 text-xs font-bold text-white shadow-glow hover:scale-105 transition-transform whitespace-nowrap"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          ) : null}

          {/* Tabs */}
          <div>
            <div className="flex gap-5 p-3 overflow-x-auto no-scrollbar sticky top-16 md:top-20 z-10 bg-secondary rounded-[10px]">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 sm:px-5 py-3 text-xs sm:text-sm font-bold capitalize transition-colors relative whitespace-nowrap ${
                    tab === t ? "text-white rounded-[10px] bg-sunset " : "text-black hover:text-white hover:bg-sunset rounded-[10px]"
                  }`}
                >
                  {t}
                  {tab === t && <span className="absolute left-0 right-0 h-0.5 rounded-full" />}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-6">
              {tab === "overview" && (
                <>
                  <p className="text-base sm:text-lg text-black/85 leading-relaxed">{activity.summary}</p>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-bold">Highlights</h3>
                    <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                      {activity.highlights.map((h: string) => (
                        <li key={h} className="flex items-start gap-3 rounded-2xl bg-secondary p-3">
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sunset-gradient text-white">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-sm text-black font-semibold">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {activity.goodToKnow.length ? (
                    <div>
                      <h3 className="font-display text-lg sm:text-xl font-bold">Good to know</h3>
                      <ul className="mt-3 space-y-2 text-sm text-black">
                        {activity.goodToKnow.map((g: string) => (
                          <li key={g} className="flex gap-2 font-semibold"><Info className="h-4 w-4 mt-0.5 text-sunset shrink-0" /> {g}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </>
              )}

              {tab === "included" && (
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-display text-lg font-bold flex items-center gap-2">
                      <Check className="h-5 w-5 text-sunset" /> Included
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {activity.included.map((i: string) => (
                        <li key={i} className="flex gap-2 text-semibold text-black">
                          <Check className="h-4 w-4 mt-1.5 text-sunset shrink-0" /> {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold flex items-center gap-2">
                      <Info className="h-5 w-5 text-sunset" /> Not included
                    </h3>
                    <ul className="mt-3  space-y-2 text-semibold text-black">
                      {activity.excluded.map((i: string) => (
                        <li className="flex gap-2" key={i}> <Info className="h-5 w-5 text-sunset" /> {i}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {tab === "meeting" && (
                <div className="space-y-4">
                  <h3 className="font-display text-lg sm:text-xl font-bold">Meeting & pickup</h3>
                  <div className="rounded-2xl bg-secondary p-4 flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-black shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-black">{activity.meeting || activity.location}</p>
                      {activity.pickupTime ? (
                        <p className="mt-1 text-xs text-black">{activity.pickupTime}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border p-4">
                    <p className="text-sm font-bold text-black">What to bring</p>
                    <ul className="mt-2 text-sm text-black font-semibold space-y-1">
                      {activity.whatToBring.map((w: string) => (
                        <li key={w}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {tab === "terms" && (
                <div className="space-y-3">
                  <h3 className="font-display text-lg sm:text-xl font-bold">Terms &amp; conditions</h3>
                  {activity.terms.length ? (
                    <ul className="text-sm space-y-2 text-black">
                      {activity.terms.map((t: string) => (
                        <li key={t} className="flex gap-2"><Check className="h-4 w-4 mt-0.5 text-sunset shrink-0" /> {t}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-black">Terms &amp; conditions will be shared with your booking voucher.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <div className="rounded-3xl bg-card shadow-premium p-5 sm:p-6 border border-border">
            <div className="flex items-center justify-between">
              {/* <p className="text-xs text-muted-foreground">from</p> */}
              {/* <span className="rounded-full bg-sunset-gradient px-2 py-0.5 text-[10px] font-bold text-white">
                -{savings}%
              </span> */}
            </div>
            <div className="mt-1 flex items-end gap-2">
              <p className="font-display text-3xl sm:text-4xl font-bold text-sunset leading-none">${activity.price}</p>
              {/* <p className="text-sm text-muted-foreground line-through mb-0.5">${activity.price}</p> */}
            </div>
            <p className="text-[15px] text-black font-bold mt-1">per person</p>

            <div className="mt-5 space-y-2.5">
              <button
                onClick={() => open({ variant: "booking", title: `Book: ${activity.name}`, amount: activity.offerPrice, currency: "AED", itemType: "activity", itemTitle: activity.name, itemId: activity.slug, askService: false })}
                className="w-full rounded-2xl bg-sunset-gradient py-3.5 font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform"
              >
                Book now
              </button>
              <button
                onClick={() => open({ title: `Enquire: ${activity.name}`, itemType: "activity", itemTitle: activity.name, itemId: activity.slug , askService: false })}
                className="w-full rounded-2xl bg-secondary py-3 text-sm font-semibold text-black hover:bg-black hover:text-white transition"
              >
                Send an enquiry
              </button>
            </div>

            {/* <div className="mt-5 pt-5 border-t border-border grid grid-cols-3 gap-2 text-[10px] text-center text-muted-foreground">
              <div className="space-y-1"><Zap className="h-4 w-4 mx-auto text-ocean" /><p>Instant<br />confirm</p></div>
              <div className="space-y-1"><Shield className="h-4 w-4 mx-auto text-ocean" /><p>Free<br />cancel 24h</p></div>
              <div className="space-y-1"><Star className="h-4 w-4 mx-auto text-ocean" /><p>Best price<br />guarantee</p></div>
            </div> */}
          </div>
          <Link to="/activities-uae" className="mt-4 block text-center text-sm text-black font-bold hover:text-sunset">← All activities</Link>
        </aside>
      </section>

      <Footer />
    </div>
  );
}