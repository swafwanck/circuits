import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import { PackageCard } from "./../components/site/PackageCard";
import { usePackages } from "./../lib/content";

export const Route = createFileRoute("/packages/")({
  head: () => ({
    meta: [
      { title: "Travel Packages — Circuit Travels" },
      { name: "description", content: "Browse hand-crafted travel packages across 180+ destinations." },
      { property: "og:title", content: "Travel Packages — Circuit Travels" },
      { property: "og:url", content: "/packages" },
    ],
    links: [{ rel: "canonical", href: "/packages" }],
  }),
  component: Packages,
});

function Packages() {
  const [q, setQ] = useState("");
  const { data: packages = [], isLoading } = usePackages();

  const list = packages.filter((p) =>
    q === "" || `${p.name} ${p.destination} ${p.country}`.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative overflow-hidden bg-hero text-ocean-deep">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1920&q=80)", backgroundSize: "cover" }} />
        <div className="relative container-page py-12 sm:py-20">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-black">Travel Packages</p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl md:text-6xl text-black font-bold">Curated trips await</h1>
          <p className="mt-3 text-sm sm:text-base text-black max-w-xl">Search by mood, country or budget. Every package includes visa support.</p>
        </div>
      </section>

      <section className="container-page -mt-8 sm:-mt-10 relative z-10">
        <div className="rounded-2xl sm:rounded-3xl glass shadow-premium p-3 sm:p-5">
          <label className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search packages…" className="w-full bg-transparent text-sm outline-none min-w-0" />
          </label>
        </div>
      </section>

      <section className="container-page py-10 sm:py-12">
        {list.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No packages match your search.</p>
            {/* <button onClick={() => setQ("")} className="mt-4 rounded-full bg-secondary px-5 py-2 text-sm font-semibold">Reset</button> */}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {list.map((p, i) => <PackageCard key={p.slug} pkg={p} index={i} />)}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
