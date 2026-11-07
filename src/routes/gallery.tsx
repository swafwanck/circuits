import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Film, X, Play } from "lucide-react";
import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import { useGallery } from "./../lib/content";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Travel Gallery — Photos & Videos | Circuit Travels" },
      { name: "description", content: "A visual journal of our travellers' journeys — beaches, cities, mountains, wildlife. Photos & video postcards from around the world." },
      { property: "og:title", content: "Travel Gallery — Circuit Travels" },
      { property: "og:description", content: "Photos and videos from destinations we love." },
      { property: "og:url", content: "/gallery" },
      { property: "og:image", content: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

type Photo = { src: string; label: string; place: string };
type Video = { id: string; title: string; place: string; thumb: string; file?: string };

const youtubeId = (url: string) => {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{6,})/);
  return m ? m[1] : "";
};

function GalleryPage() {
  const [tab, setTab] = useState<"photos" | "videos">("photos");
  const { data: items = [], isLoading } = useGallery();

  const photos: Photo[] = items
    .filter((it) => it.kind === "image")
    .flatMap((it) => it.images.map((src) => ({ src, label: it.title, place: it.place })));

  const videos: Video[] = items
    .filter((it) => it.kind === "video")
    .flatMap((it) => {
      const out: Video[] = [];
      const cover = it.thumbnail || it.images[0] || "";
      if (it.videoUrl) {
        const id = youtubeId(it.videoUrl);
        if (id) {
          out.push({ id, title: it.title, place: it.place, thumb: cover || `https://img.youtube.com/vi/${id}/hqdefault.jpg` });
        } else {
          out.push({ id: `${it.id}-url`, title: it.title, place: it.place, thumb: cover, file: it.videoUrl });
        }
      }
      it.videos.forEach((file, i) => {
        out.push({ id: `${it.id}-f${i}`, title: it.title, place: it.place, thumb: cover, file });
      });
      return out;
    });
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [playing, setPlaying] = useState<Video | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative bg-hero text-ocean-deep overflow-hidden">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-sunset/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-sky/40 blur-3xl" />
        <div className="container-page relative py-14 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] font-bold uppercase text-black tracking-[0.18em]">
            <Camera className="h-3.5 w-3.5 text-black" /> Travel Gallery
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-4xl md:text-5xl font-bold leading-tight text-black max-w-3xl">
            Moments from Every <span className="text-gradient-sunset">Journey</span>.
          </h1>
          <p className="mt-4 max-w-xl text-black text-base sm:text-lg">
            Real frames from real trips. Skim the photos, press play on the videos — then pick where you're going next.
          </p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-full bg-white/70 backdrop-blur p-1 shadow-glass">
            <button
              onClick={() => setTab("photos")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${tab === "photos" ? "bg-sunset-gradient text-white shadow-glow" : "text-black hover:bg-white"}`}
            >
              <Camera className="h-4 w-4" /> Photos
            </button>
            <button
              onClick={() => setTab("videos")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${tab === "videos" ? "bg-sunset-gradient text-white shadow-glow" : "text-black hover:bg-white"}`}
            >
              <Film className="h-4 w-4" /> Videos
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {tab === "photos" ? (
          <motion.section
            key="photos"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="container-page py-12 sm:py-16"
          >
            {!isLoading && photos.length === 0 && (
              <p className="text-center text-muted-foreground py-16">No photos published yet.</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {photos.map((p) => (
                <button
                  key={p.src}
                  onClick={() => setLightbox(p)}
                  className="group relative aspect-square overflow-hidden rounded-2xl sm:rounded-3xl shadow-glass hover:shadow-premium transition-all"
                >
                  <img src={p.src} alt={p.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </button>
              ))}

            </div>
          </motion.section>
        ) : (
          <motion.section
            key="videos"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="container-page py-12 sm:py-16"
          >
            {!isLoading && videos.length === 0 && (
              <p className="text-center text-muted-foreground py-16">No videos published yet.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {videos.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setPlaying(v)}
                  className="group relative overflow-hidden rounded-3xl shadow-glass hover:shadow-premium transition-all text-left"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {v.thumb ? (
                      <img src={v.thumb} alt={v.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : v.file ? (
                      <video src={`${v.file}#t=0.5`} muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-transparent to-black/20" />
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="grid h-16 w-16 sm:h-20 sm:w-20 place-items-center rounded-full bg-white/95 text-ocean-deep shadow-premium group-hover:scale-110 transition-transform">
                        <Play className="h-7 w-7 sm:h-8 sm:w-8 fill-current ml-1" />
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-card">
                    <p className="text-[10px] uppercase tracking-wider text-coral font-bold">{v.place}</p>
                    <p className="mt-1 font-display text-base sm:text-lg font-bold text-ocean-deep">{v.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Photo lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ocean-deep/90 backdrop-blur-sm grid place-items-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-ocean-deep" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightbox.src} alt={lightbox.label} className="w-full max-h-[80vh] object-contain rounded-2xl" />
              <div className="mt-3 text-white text-center">
                <p className="text-[11px] uppercase tracking-wider opacity-80">{lightbox.place}</p>
                <p className="font-display text-lg sm:text-xl font-bold">{lightbox.label}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video player */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ocean-deep/90 backdrop-blur-sm grid place-items-center p-4"
            onClick={() => setPlaying(null)}
          >
            <button className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-ocean-deep" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-premium"
              onClick={(e) => e.stopPropagation()}
            >
              {playing.file ? (
                <video src={playing.file} controls autoPlay className="absolute inset-0 h-full w-full bg-black" />
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${playing.id}?autoplay=1&rel=0`}
                  title={playing.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}