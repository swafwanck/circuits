import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { useHomePackages, useHeroSlides } from "./../../lib/content";

type Slide = {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { label: string; to: string };
  accent: string;
};

const ACCENTS = [
  "from-sky/60 via-mint/40 to-transparent",
  "from-lavender/50 via-sky/40 to-transparent",
  "from-coral/40 via-sunset/40 to-transparent",
  "from-mint/50 via-sky/40 to-transparent",
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  const { data: hero = [] } = useHeroSlides();
  // const { data: spotlight = [] } = useSpotlight();
  const { data: packages = [] } = useHomePackages();

  const slides: Slide[] = hero.length
    ? hero.map((h, k) => ({
        image: h.image,
        eyebrow: h.eyebrow || "Circuit Travels",
        title: h.title,
        subtitle: h.summary,
        cta: { label: h.buttonText || "Explore packages", to: h.buttonLink || "/packages" },
        accent: ACCENTS[k % ACCENTS.length],
      }))
    // : spotlight.length
    // ? spotlight.map((sp, k) => ({
    //     image: sp.image,
    //     eyebrow: sp.name || "Spotlight",
    //     title: sp.title,
    //     subtitle: sp.summary,
    //     cta: { label: sp.buttonText || "Explore packages", to: "/packages" },
    //     accent: ACCENTS[k % ACCENTS.length],
    //   }))
    : packages.slice(0, 4).map((p, k) => ({
        image: p.image,
        eyebrow: p.destination || "Featured",
        title: p.name,
        subtitle: p.overview,
        cta: { label: "View package", to: "/packages" },
        accent: ACCENTS[k % ACCENTS.length],
      }));


  const total = slides.length;
  useEffect(() => {
    if (total < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % total), 6000);
    return () => clearInterval(t);
  }, [total]);

  if (total === 0) return null;
  const s = slides[Math.min(i, total - 1)];
  return (
    <div className="relative h-[70vh] min-h-[520px] md:h-[80vh] md:min-h-[640px] w-full overflow-hidden shadow-premium">

      <AnimatePresence mode="sync">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img src={s.image} alt={s.title} className="absolute inset-0 h-full w-full object-cover animate-kenburns" />
          <div className={`absolute inset-0 bg-gradient-to-tr ${s.accent} mix-blend-soft-light`} />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/85 via-ocean-deep/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl text-white"
          >
            <span className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-[10px] font-bold uppercase text-black tracking-[0.2em]">
              <Sparkles className="h-3 w-3 text-sunset" /> {s.eyebrow}
            </span>
            <h2 className="mt-4 font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95]">{s.title}</h2>
            <p className="mt-5  text-base text-white md:text-lg max-w-xl">{s.subtitle}</p>
            <Link
              to={s.cta.to}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-ocean-deep px-6 py-3 font-semibold shadow-premium hover:scale-[1.03] transition-transform"
            >
              {s.cta.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center gap-2">
          {slides.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Slide ${k + 1}`}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: k === i ? 40 : 14,
                background: k === i ? "white" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}