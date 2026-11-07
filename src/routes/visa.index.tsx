import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import { SectionHeader } from "./../components/site/Section";
import { useVisas } from "./../lib/content";
import { useEnquiry } from "./../components/site/EnquiryProvider";
import { CardBadges } from "./../components/site/CardBadges";


export const Route = createFileRoute("/visa/")({
  head: () => ({
    meta: [
      { title: "Worldwide Visa Services — Circuit Travels" },
      { name: "description", content: "End-to-end visa support for 60+ countries. Real humans, no paperwork pain." },
      { property: "og:title", content: "Worldwide Visa Services" },
      { property: "og:url", content: "/visa" },
    ],
    links: [{ rel: "canonical", href: "/visa" }],
  }),
  component: VisaPage,
});

function VisaPage() {
  const { open } = useEnquiry();
  const { data: visas = [] } = useVisas();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative bg-hero text-ocean-deep overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sunset/30 blur-3xl" />
        <div className="container-page relative py-14 sm:py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-black font-bold">Visa Services</p>
          <h1 className="mt-2 font-display text-4xl sm:text-6xl md:text-7xl font-bold text-black leading-tight">Visas,<span className="text-gradient-sunset">handled</span></h1>
          <p className="mt-4 max-w-xl text-black text-base sm:text-lg">End-to-end documentation, embassy bookings and follow-ups for 60+ countries. We're with you until the passport is stamped.</p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { n: "01", t: "Pick destination", d: "Tell us where you're heading and when." },
            { n: "02", t: "We prep documents", d: "Checklists, photo specs, embassy slots — sorted." },
            { n: "03", t: "Get stamped", d: "Track status in real-time. Stamped passport at your door." },
          ].map((s) => (
            <div key={s.n} className="rounded-3xl bg-card p-6 sm:p-7 shadow-glass">
              <span className="font-display text-4xl sm:text-5xl font-bold text-sunset">{s.n}</span>
              <h3 className="mt-3 font-display text-lg sm:text-xl font-bold text-black">{s.t}</h3>
              <p className="mt-2 text-sm text-black">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <SectionHeader eyebrow="Browse Visas" title="60+ countries, one trusted partner" />
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {visas.map((v) => {
            return (
              <div key={v.slug} className="group rounded-3xl bg-card shadow-glass hover:shadow-premium transition-all hover:-translate-y-1 overflow-hidden flex flex-col border border-border/60">
                <div className="relative aspect-[5/3] overflow-hidden">
                  <img src={v.image} alt={v.country} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
                  <CardBadges
                    className="absolute top-3 right-3 justify-end"
                    savePct={null}
                  />
                  <p className="absolute bottom-3 left-3 right-3 font-display text-lg sm:text-xl font-bold text-white leading-tight line-clamp-2">{v.country}</p>
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  <p className="text-[11px] uppercase tracking-wider text-black font-bold">{v.type}</p>
                  {/* <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">Hassle-free application with document checklist, embassy appointment and real-time status updates.</p> */}
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                    <div className="rounded-2xl bg-sky/20 p-2.5 sm:p-3">
                      <p className="text-black text-[11px]">Processing</p>
                      <p className="font-bold text-black">{v.processing}</p>
                    </div>
                    <div className="rounded-2xl bg-sky/20 p-2.5 sm:p-3">
                      <p className="text-black text-[11px]">Validity</p>
                      <p className="font-bold text-black">{v.validity}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <p className="font-display text-xl sm:text-2xl font-bold text-black">${v.fee}</p>
                    <Link
                      to="/visa/$slug"
                      params={{ slug: v.slug }}
                      className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1 hover:bg-sunset hover:scale-105 transition-transform whitespace-nowrap shadow-glow"
                    >
                      View details <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-16 sm:pb-24">
        <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-sunset-gradient p-6 sm:p-10 text-white text-center">
          <ShieldCheck className="h-8 w-8 mx-auto text-black" />
          <h2 className="mt-3 font-display text-2xl sm:text-4xl font-bold">Not sure which visa you need?</h2>
          <p className="mt-2 text-sm sm:text-base text-black max-w-lg mx-auto">Send us your itinerary — we'll tell you exactly what to apply for.</p>
          <button
            onClick={() => open({ channel: "whatsapp", title: "Visa Enquiry", subtitle: "Tell us your travel plan — we'll guide the right visa." })}
            className="mt-5 rounded-full bg-black text-white px-5 sm:px-6 py-3 text-sm font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2"
          >
            Ask on WhatsApp <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
