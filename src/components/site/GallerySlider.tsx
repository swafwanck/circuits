import { useHomeSliderImages } from "./../../lib/content";

// Continuous right-to-left marquee of same-size poster images from the API.

export function GallerySlider() {
  const { data: posters = [] } = useHomeSliderImages();
  // Duplicate the list so the marquee loops seamlessly.
  const strip = [...posters, ...posters];

  if (posters.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
      }}
    >
      <div className="flex w-max gap-4 sm:gap-6 animate-marquee-x hover:[animation-play-state:paused]">
        {strip.map((src, i) => (
          <div
            key={i}
            className="shrink-0 w-[42vw] xs:w-[38vw] sm:w-[26vw] md:w-[20vw] lg:w-[16vw] aspect-[3/4] rounded-3xl overflow-hidden shadow-premium ring-1 ring-black/5 bg-muted"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
