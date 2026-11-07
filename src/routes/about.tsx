import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import {
  Heart,
  Globe2,
  Compass,
  Sparkles,
  MapPin,
  Plane,
  ShieldCheck,
  Quote,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Circuit Travels — Crafted Travel, Honestly Done" },
      {
        name: "description",
        content:
          "Circuit Travels & Holidays LLC — UAE-based travel house crafting handpicked holidays, hotels, UAE experiences and visa services for 60+ countries.",
      },
      { property: "og:title", content: "About Circuit Travels" },
      {
        property: "og:description",
        content:
          "UAE-based travel house crafting handpicked holidays and stress-free visas for 60+ countries.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const values = [
  {
    icon: Compass,
    title: "Personalized Travel Solutions",
    body: "Every journey is planned around your needs, preferences and budget, ensuring a comfortable and memorable travel experience.",
    accent: "bg-sunset",
  },
  {
    icon: ShieldCheck,
    title: "Visa & Travel Assistance",
    body: "From visa support to travel documentation, our experienced team helps make your international travel process simple and hassle-free.",
    accent: "bg-sunset",
  },
  {
    icon: Heart,
    title: "Dedicated Customer Support",
    body: "Our team is here to support you before, during and after your journey, providing reliable assistance whenever you need it.",
    accent: "bg-sunset",
  },
  {
    icon: Sparkles,
    title: "Transparent & Cost-Effective",
    body: "We provide competitive travel solutions with clear pricing and no unnecessary surprises, helping you travel with confidence.",
    accent: "bg-sunset",
  },
];

const timeline = [
  { title: "The desk opens", body: "Circuit Travels opens a single counter in Dubai, run by three friends and a paper map." },
  { title: "Visa services launch", body: "We add stress-free visa processing for 20 countries. Word travels fast." },
  { title: "Rebuilt for you", body: "During the world's pause, we rebuild every itinerary from scratch with safer, slower travel in mind." },
  { title: "60+ destinations", body: "Our concierge network now covers over sixty countries, from Baku to Bali." },
];

function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-sunset/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-96 w-96 rounded-full bg-sky/30 blur-3xl" />
        <div className="container-page relative py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/90 backdrop-blur">
              <MapPin className="h-3 w-3" /> Based in Dubai · Travelling everywhere
            </span>
            <h1 className="mt-4 font-display text-5xl md:text-7xl font-bold leading-[1.02]">
              Journeys designed <br className="hidden md:block" />
              the <span className="text-sunset">Circuit</span> way.
            </h1>
            <p className="mt-5 text-white/90 text-lg max-w-2xl">
              {/* Circuit Travels &amp; Holidays LLC (سيركيوت للسفر والعطلة ذ.م.م) is a UAE-based travel house */}
              Circuit Travels &amp; Holidays L L C is a UAE-based travel agency offering reliable leisure and corporate travel solutions. Founded in 2022, we provide flights, holiday packages, visa assistance, accommodation and complete travel support with a focus on quality, convenience and customer satisfaction.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 rounded-full bg-sunset px-5 py-3 text-sm font-semibold text-white shadow-premium hover:brightness-110"
              >
                Explore packages <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-sunset"
              >
                Contact us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="container-page py-16 md:py-20 grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="rounded-3xl bg-ocean-gradient text-black p-8 md:p-10 shadow-premium">
          <Heart className="h-8 w-8 text-black" />
          <h3 className="mt-4 font-display text-3xl font-bold">Our mission</h3>
          <p className="mt-3 text-black/85">
            To provide secure, convenient and high-quality travel services through real-time booking, secure payments, travel documentation and dedicated customer support
          </p>
        </div>
        <div className="rounded-3xl bg-sunset-gradient text-white p-8 md:p-10 shadow-premium">
          <Globe2 className="h-8 w-8 text-white" />
          <h3 className="mt-4 font-display text-3xl font-bold">Our vision</h3>
          <p className="mt-3 text-white/90">
            To become a trusted leading travel agency in the UAE, creating memorable travel experiences and connecting customers to destinations worldwide.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="container-page py-4 md:py-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-black">What we stand for</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold text-black">
            Four things we never cut corners on.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="group relative rounded-3xl bg-card border border-border p-6 hover:-translate-y-1 hover:shadow-premium transition"
            >
              <span
                className={`inline-grid h-11 w-11 place-items-center rounded-2xl text-white ${v.accent}`}
              >
                <v.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-black">{v.title}</h3>
              <p className="mt-3  text-sm text-black leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story + Timeline */}
      <section className="container-page py-16 md:py-24  items-start text-center">
        <div className="lg:sticky lg:top-24">
          {/* <p className="text-xs uppercase tracking-[0.22em] font-bold text-sunset">Our story</p> */}
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold text-black">
            A UAE travel house, built on trust and honest craft.
          </h2>
          <p className="mt-5 md:px-25 text-black leading-relaxed">
            We deliver customer-friendly, cost-effective and hassle-free travel services. Our dedicated team focuses on personalized solutions, quality service and continuous improvement to build long-term customer trust.
          </p>
          {/* <div className="mt-6 rounded-3xl bg-secondary p-6 border border-border">
            <Quote className="h-6 w-6 text-sunset" />
            <p className="mt-3 font-display text-lg text-black leading-relaxed">
              "We don't sell trips. We sell the part where you finally exhale
              on the plane, knowing every detail is handled."
            </p>
            <p className="mt-3 text-xs uppercase tracking-wider text-black">
              — Founding team
            </p>
          </div> */}
        </div>

        {/* <ol className="relative border-l border-border pl-6 space-y-8">
          {timeline.map((t) => (
            <li key={t.title} className="relative">
              <span className="absolute -left-[33px] top-1 grid h-6 w-6 place-items-center rounded-full bg-sunset-gradient text-white text-[10px] font-bold shadow-premium">
                <Plane className="h-3 w-3" />
              </span>
              <h4 className="font-display text-xl font-bold text-black">{t.title}</h4>
              <p className="mt-1 text-sm text-black leading-relaxed">{t.body}</p>
            </li>
          ))}
        </ol> */}
      </section>

      {/* CTA */}
      <section className="container-page pb-20 md:pb-28">
        <div className="rounded-3xl bg-sunset-gradient text-white p-8 md:p-14 text-center shadow-premium">
          <h3 className="font-display text-3xl md:text-5xl font-bold leading-tight">
            Ready to design your next journey?
          </h3>
          <p className="mt-3 text-white/90 max-w-xl mx-auto">
            Tell us where you dream of waking up. Our consultants will build the rest.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-bold hover:bg-white/90"
            >
              Start planning <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold hover:bg-white hover:text-black"
            >
              Explore packages <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
