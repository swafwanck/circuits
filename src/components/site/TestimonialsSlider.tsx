import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { useTestimonials } from "./../../lib/content";

const SLIDE_MS = 4200;

export function TestimonialsSlider() {
  const [i, setI] = useState(0);
  const { data: testimonials = [] } = useTestimonials();
  const total = testimonials.length;

  useEffect(() => {
    if (total === 0) return;
    const t = setInterval(() => setI((x) => (x + 1) % total), SLIDE_MS);
    return () => clearInterval(t);
  }, [total]);

  if (total === 0) return null;

  const visible = [0, 1, 2].map((offset) => testimonials[(i + offset) % total]);

  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <AnimatePresence mode="popLayout">
          {visible.map((t, idx) => (
            <motion.article
              key={`${i}-${idx}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
              className="relative rounded-3xl bg-card shadow-premium p-6 sm:p-7 overflow-hidden group"
            >
              <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-sunset/10 blur-3xl" />
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-ocean/10 blur-3xl" />
              <div className="relative">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sunset-gradient text-white shadow-glow">
                  <Quote className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[15px] sm:text-base text-foreground/85 italic leading-relaxed line-clamp-6">
                  "{t.description}"
                </p>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ocean-deep/70">
                    {t.title}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-7 flex justify-center gap-1.5">
        {testimonials.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-label={`Slide ${k + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{ width: k === i ? 32 : 8, background: k === i ? "var(--ocean)" : "var(--border)" }}
          />
        ))}
      </div>
    </div>
  );
}
