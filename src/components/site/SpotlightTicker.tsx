import { Sparkles, Zap } from "lucide-react";
import { useSpotlight } from "./../../lib/content";

const toneMap: Record<string, string> = {
  sunset: "text-sunset bg-sunset/15",
  ocean: "text-sky bg-sky/15",
  lavender: "text-lavender bg-lavender/15",
  mint: "text-mint bg-mint/15",
};

export function SpotlightTicker() {
  const { data: spotlight = [] } = useSpotlight();
  const tones = ["sunset", "ocean", "lavender", "mint"];
  const items = spotlight.map((sp, i) => ({
    text: [sp.title, sp.summary].filter(Boolean).join(" — "),
    tone: tones[i % tones.length],
  }));
  const loop = [...items, ...items];

  if (items.length === 0) return null;
  return (
    <div className="relative isolate overflow-hidden">
      {/* Layered gradient bar */}
      <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_left,oklch(0.42_0.14_235)_0%,oklch(0.28_0.10_250)_55%,oklch(0.20_0.08_260)_100%)]">
        {/* animated conic sheen */}
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
             style={{ background: "conic-gradient(from 0deg at 50% 50%, transparent 0%, oklch(0.75 0.19 45 / 0.35) 30%, transparent 60%, oklch(0.72 0.13 195 / 0.35) 85%, transparent 100%)" }} />
        <div className="pointer-events-none absolute -top-10 -left-16 h-40 w-40 rounded-full bg-sunset/40 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-10 right-1/3 h-32 w-32 rounded-full bg-lavender/30 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

        <div className="container-page relative flex items-center gap-2 sm:gap-4 py-2.5">
          {/* Live pill */}
          <span className="relative shrink-0 inline-flex items-center gap-1.5 rounded-full bg-sunset-gradient px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-glow">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <Zap className="h-3 w-3" />
            <span className="hidden sm:inline">Live</span>
          </span>

          {/* Marquee */}
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="flex whitespace-nowrap animate-marquee">
              {loop.map((it, i) => {
                const Icon = Sparkles;
                return (
                  <span key={i} className="mx-4 sm:mx-7 inline-flex items-center gap-2.5 text-[11px] sm:text-[13px] font-medium tracking-wide text-white/90">
                    <span className={`grid h-6 w-6 place-items-center rounded-full ${toneMap[it.tone]} ring-1 ring-white/10`}>
                      <Icon className="h-3 w-3" />
                    </span>
                    <span>{it.text}</span>
                    <span className="ml-2 h-1 w-1 rounded-full bg-white/25" />
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* bottom hairline */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-sunset/60 to-transparent" />
      </div>
    </div>
  );
}