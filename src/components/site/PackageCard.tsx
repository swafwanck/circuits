import { Link } from "@tanstack/react-router";
import { Clock, MapPin, ArrowUpRight } from "lucide-react";
import type { Package } from "./../../data/travel";
import { CardBadges, computeSavePct } from "./../../components/site/CardBadges";


export function PackageCard({ pkg, index = 0 }: { pkg: Package; index?: number }) {
  return (
    <Link
      to="/packages/$slug"
      params={{ slug: pkg.slug }}
      className="group relative block overflow-hidden rounded-3xl bg-card shadow-glass hover:shadow-premium transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {/* <CardBadges
          className="absolute top-2 left-2 right-2"
          savePct={computeSavePct(//pkg.price, pkg.offerPrice)}
        /> */}
        <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
          {/* <div className="flex items-center gap-1 text-[10px] opacity-90">
            <MapPin className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{pkg.destination}</span>
          </div>
          <h3 className="mt-0.5 font-display text-sm sm:text-base font-bold leading-tight line-clamp-1">{pkg.name}</h3> */}
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md ring-1 ring-white/30 px-2.5 py-1 text-[11px] font-bold tracking-wide">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate max-w-[180px]">{pkg.destination}</span>
          </span>
          <h3 className="mt-1.5 font-display text-sm sm:text-base font-bold leading-tight line-clamp-1 drop-shadow">{pkg.name}</h3>
        </div>
      </div>
      <div className="p-3 sm:p-3.5">
        {/* <div className="flex items-center gap-1 text-[11px] text-muted-foreground"> */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-gradient px-3 py-1 text-[11px] font-bold text-black shadow-glow">
          <Clock className="h-3 w-3 shrink-0 text-black" />
          {/* <span className="truncate font-bold">{pkg.duration}</span>
        </div> */}
          <span>{pkg.duration}</span>
        </span>
        {pkg.highlights?.[0] ? (
          <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-2 leading-snug">
            {pkg.highlights.slice(0, 2).join(" · ")}
          </p>
        ) : null}
        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="min-w-0">
            {/* <p className="text-[10px] text-muted-foreground line-through leading-none">${pkg.price}</p> */}
            <p className="font-display text-base sm:text-lg font-bold text-black leading-tight">
              ${pkg.offerPrice}
              <span className="text-[12px] font-bold font-sans text-black"> / Person</span>
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1.5 text-[10px] font-semibold text-primary group-hover:bg-red-500 group-hover:text-white transition-all">
            View <ArrowUpRight className="h-2.5 w-2.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

