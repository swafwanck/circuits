import { Link } from "@tanstack/react-router";
import { Compass, Home, LifeBuoy, MapPin } from "lucide-react";
import { Header } from "./../../components/site/Header";
import { Footer } from "./../../components/site/Footer";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-hero">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-lavender/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-coral/20 blur-3xl" />
          <div className="container-page relative py-16 sm:py-24 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-ocean-gradient text-white shadow-glow">
              <Compass className="h-10 w-10 animate-pulse" />
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-ocean-deep/70">Error 404</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-ocean-deep">
              Looks like you've wandered <span className="italic text-gradient-sunset">off the map</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-ocean-deep/80">
              The page you were looking for doesn't exist, has been moved, or is currently on a holiday of its own. Let's get you back on route.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-2xl bg-sunset-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow hover:scale-105 transition-transform"
              >
                <Home className="h-4 w-4" /> Back to home
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur px-6 py-3 text-sm font-semibold text-ocean-deep border border-border hover:bg-white transition"
              >
                <LifeBuoy className="h-4 w-4" /> Contact support
              </Link>
            </div>
          </div>
        </section>

        <section className="container-page py-12 sm:py-16">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">Popular destinations</p>
          <h2 className="mt-2 text-center font-display text-2xl sm:text-3xl font-bold text-ocean-deep">
            Continue your journey
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { to: "/packages", label: "Holiday Packages", desc: "Curated escapes to 180+ destinations" },
              { to: "/activities-uae", label: "UAE Activities", desc: "Desert, sea and sky adventures" },
              { to: "/deals", label: "Latest Deals", desc: "Save up to 40% on selected trips" },
              { to: "/visa", label: "Visa Services", desc: "60+ countries, fast processing" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group rounded-2xl border border-border bg-card p-5 shadow-glass hover:shadow-premium hover:-translate-y-1 transition-all"
              >
                <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary group-hover:bg-ocean-gradient group-hover:text-white transition">
                  <MapPin className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-base font-bold text-ocean-deep">{l.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{l.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
