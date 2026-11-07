import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Check, Clock, CalendarCheck, ShieldCheck, FileText } from "lucide-react";
import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import { useVisa } from "./../lib/content";
import type { UIVisaFull } from "./../lib/content";
import { useEnquiry } from "./../components/site/EnquiryProvider";

export const Route = createFileRoute("/visa/$slug")({
  head: () => ({
    meta: [
      { title: "Visa — Circuit Travels" },
      { name: "description", content: "Explore visa details, pricing and inclusions with Circuit Travels." },
    ],
  }),
  notFoundComponent: () => (<div className="min-h-screen grid place-items-center"><p>Visa not found.</p></div>),
  errorComponent: ({ error }) => (<div className="min-h-screen grid place-items-center"><p>Error: {error.message}</p></div>),
  component: VisaDetail,
});

function VisaDetail() {
  const { slug } = Route.useParams();
  const { data: visa, isLoading } = useVisa(slug);

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!visa) {
    return <div className="min-h-screen grid place-items-center"><p>Visa not found.</p></div>;
  }
  return <VisaDetailView visa={visa} />;
}

function VisaDetailView({ visa }: { visa: UIVisaFull }) {
  const { open } = useEnquiry();

  const process = [
    { n: "01", t: "Submit enquiry", d: "Share travel dates, passport scan and basic details." },
    { n: "02", t: "Document prep", d: "We build your file — forms, checklists and translations." },
    { n: "03", t: "Appointment", d: `We book your ${visa.country} embassy or VFS slot and prep you for interviews.` },
    { n: "04", t: "Track & collect", d: "Live status updates until the stamped passport is at your door." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative">
        <div className="container-page pt-4 sm:pt-6">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
            <img src={visa.image} alt={visa.country} className="w-full aspect-[16/9] sm:aspect-[16/7] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="rounded-full glass-dark px-3 py-1 text-xs font-semibold inline-flex items-center gap-1">
                  <span className="text-base leading-none">{visa.flag}</span> {visa.country}
                </span>
                <span className="rounded-full bg-sunset-gradient px-3 py-1 text-[10px] font-bold shadow-glow">{visa.type}</span>
                <span className="rounded-full glass-dark px-3 py-1 text-[10px] font-semibold inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {visa.processing}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
                {visa.country} {visa.type}
              </h1>
              <p className="mt-2 text-white/85 text-sm sm:text-base max-w-2xl">
                {visa.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10">
        <div className="min-w-0 space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Clock, label: "Processing", value: visa.processing },
              { icon: CalendarCheck, label: "Validity", value: visa.validity },
              { icon: FileText, label: "Visa type", value: visa.type },
              { icon: ShieldCheck, label: "Visa Price", value: `$${visa.fee} AED`},
            ].map((m) => (
              <div key={m.label} className="rounded-2xl bg-secondary p-3 sm:p-4">
                <m.icon className="h-4 w-4 text-black" />
                <p className="mt-2 text-[11px] uppercase font-semibold tracking-wider text-sunset">{m.label}</p>
                <p className="font-semibold text-sm sm:text-base leading-tight">{m.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-black">Overview</h2>
            <p className="mt-3 whitespace-pre-line text-[15px] sm:text-lg text-black leading-relaxed">
              {visa.overview || visa.summary}
            </p>
          </div>

          {visa.documents.length ? (
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-black">Documents required</h2>
            <ul className="mt-4 grid sm:grid-cols-2 gap-2">
              {visa.documents.map((d) => (
                <li key={d} className="flex items-start gap-3 rounded-2xl bg-secondary p-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sunset-gradient text-white"><Check className="h-3.5 w-3.5" /></span>
                  <span className="text-sm text-black">{d}</span>
                </li>
              ))}
            </ul>
          </div>
          ) : null}

          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-black">How it works</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {process.map((s) => (
                <div key={s.n} className="rounded-2xl bg-card border border-border p-5">
                  <span className="font-display text-3xl font-bold text-sunset">{s.n}</span>
                  <h3 className="mt-2 font-display text-lg font-bold">{s.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </div>

          {visa.eligibility.length ? (
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-black">Eligibility</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {visa.eligibility.map((e) => (
                <li key={e} className="flex gap-2"><Check className="h-4 w-4 mt-0.5 text-sunset shrink-0" /> {e}</li>
              ))}
            </ul>
          </div>
          ) : null}

          {visa.terms.length ? (
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-black">Terms &amp; conditions</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {visa.terms.map((t) => (
                  <li key={t} className="flex gap-2"><Check className="h-4 w-4 mt-0.5 text-sunset shrink-0" /> {t}</li>
                ))}
              </ul>
            </div>
          ) : null}

        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <div className="rounded-3xl bg-card shadow-premium p-5 sm:p-6 border border-border">
            {/* <p className="text-xs text-muted-foreground">Service fee</p> */}
            <p className="font-display text-3xl sm:text-4xl font-bold text-sunset leading-none">
              ${visa.fee} AED <span className="text-sm font-sans font-bold text-black"> / Applicant</span>
            </p>
            {/* <p className="mt-1 text-[11px] text-muted-foreground">Embassy / VFS fees billed separately</p> */}

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-black">Processing</span><span className="font-semibold">{visa.processing}</span></div>
              <div className="flex justify-between"><span className="text-black">Validity</span><span className="font-semibold">{visa.validity}</span></div>
              <div className="flex justify-between"><span className="text-black">Type</span><span className="font-semibold">{visa.type}</span></div>
            </div>

            <div className="mt-5 space-y-2.5">
              <button
                onClick={() => open({ variant: "booking", title: `Apply: ${visa.country} ${visa.type}`, amount: visa.fee, currency: "AED", itemType: "visa", itemTitle: `${visa.country} — ${visa.type}`, itemId: visa.slug, askService: false })}
                className="w-full rounded-2xl bg-sunset-gradient py-3.5 font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform"
              >
                Apply &amp; pay now
              </button>
              <button
                onClick={() => open({ channel: "whatsapp", title: `Enquire: ${visa.country} Visa`, itemType: "visa", itemTitle: `${visa.country} — ${visa.type}`, itemId: visa.slug , askService: false })}
                className="w-full rounded-2xl bg-secondary py-3 text-sm font-semibold text-black hover:bg-black hover:text-white"
              >
                Send an enquiry
              </button>
            </div>
            {/* <p className="mt-4 text-[11px] text-muted-foreground text-center">Real-time tracking · Refund on service if rejected</p> */}
          </div>
          <Link to="/visa" className="mt-4 block text-center text-sm text-black font-semibold hover:text-sunset">← All visas</Link>
        </aside>
      </section>

      <Footer />
    </div>
  );
}