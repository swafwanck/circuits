// Live content layer — every public page reads from the Django REST API via axios.
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "./api";
import type {
  Package as UIPackage,
  Deal as UIDeal,
  Hotel as UIHotel,
  Activity as UIActivity,
  Visa as UIVisa,
} from "./../data/travel";

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json" },
  timeout: 20000,
});

// Public site content is readable by everyone. We deliberately do NOT attach the
// admin token here: a stale/expired token would otherwise make logged-out
// visitors see nothing until an admin signs in again.

type Row = Record<string, any>;

async function list(path: string, params?: Record<string, unknown>): Promise<Row[]> {
  const { data } = await http.get(path, { params });
  if (Array.isArray(data)) return data as Row[];
  return (data?.results as Row[]) ?? [];
}

/* ---------------- helpers ---------------- */

const str = (v: unknown, fallback = "") => (v == null ? fallback : String(v));
const num = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map((x) => String(x)) : []);
const objArr = (v: unknown): Row[] => (Array.isArray(v) ? (v as Row[]) : []);

const media = (v: unknown): string => {
  const s = str(v);
  if (!s) return "";
  if (s.startsWith("http") || s.startsWith("data:")) return s;
  return `${API_BASE_URL}${s.startsWith("/") ? "" : "/"}${s}`;
};

const mediaList = (v: unknown): string[] =>
  (Array.isArray(v) ? v : []).map((x) => media(typeof x === "string" ? x : (x as Row)?.image ?? (x as Row)?.file ?? (x as Row)?.url)).filter(Boolean);

const codeFrom = (s: string) =>
  s.replace(/[^a-zA-Z ]/g, "").split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 3).toUpperCase();

const truthy = (v: unknown) => v === true || v === "true" || v === 1;

/* ---------------- mappers ---------------- */

export function mapPackage(r: Row): UIPackageFull {
  const gallery = mediaList(r.gallery_images);
  const image = media(r.image) || gallery[0] || "";
  const price = num(r.price);
  return {
    slug: str(r.slug || r.id),
    name: str(r.title || r.name),
    code: str(r.code) || codeFrom(str(r.title || r.name)),
    destination: str(r.destination),
    country: str(r.destination),
    duration: str(r.duration),
    price: num(r.offer_price) ? price : price,
    offerPrice: num(r.offer_price) || price,
    rating: num(r.rating, 4.8),
    reviews: num(r.reviews, 0),
    image,
    gallery: gallery.length ? gallery : image ? [image] : [],
    highlights: arr(r.highlights),
    overview: str(r.overview || r.short_description),
    category: (str(r.category) || "Beach") as UIPackage["category"],
    included: arr(r.inclusions_included),
    excluded: arr(r.inclusions_not_included),
    itinerary: objArr(r.itinerary).map((it, i) => ({
      day: num(it.day, i + 1),
      title: str(it.title),
      detail: str(it.description || it.detail),
    })),
    terms: arr(r.terms),
  };
}

export type UIPackageFull = UIPackage & { terms: string[] };

export type UIDealFull = UIDeal & {
  destination: string;
  visaType: string;
  validity: string;
  overview: string;
  included: string[];
  excluded: string[];
  itinerary: { day: number; title: string; detail: string }[];
  gallery: string[];
  activityPackages: { title: string; description: string; price: number }[];
  goodToKnow: string[];
  meeting: string;
  location: string;
  pickupTime: string;
  whatToBring: string[];
  rooms: { title: string; description: string; price: number; points: string[] }[];
  amenities: string[];
  policies: string[];
  documents: string[];
  eligibility: string[];
};

const capitalise = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

export function mapDeal(r: Row): UIDealFull {
  const gallery = mediaList(r.gallery_images);
  const image = media(r.image) || gallery[0] || "";
  const price = num(r.price);
  const offer = num(r.offer_price) || price;
  const pct = num(r.offer_percentage) || (price > offer ? Math.round(((price - offer) / price) * 100) : 0);
  return {
    slug: str(r.slug || r.id),
    title: str(r.title),
    category: capitalise(str(r.category)) as UIDeal["category"],
    image,
    discount: pct ? `${pct}% OFF` : "OFFER",
    price,
    offerPrice: offer,
    validTill: str(r.valid_until || r.validity || "Limited period"),
    summary: str(r.short_description),
    highlights: arr(r.highlights),
    terms: arr(r.terms),
    destination: str(r.destination),
    visaType: str(r.visa_type),
    validity: str(r.validity),
    overview: str(r.overview || r.short_description),
    included: arr(r.inclusions_included),
    excluded: arr(r.inclusions_not_included),
    itinerary: objArr(r.itinerary).map((it, i) => ({
      day: num(it.day, i + 1),
      title: str(it.title),
      detail: str(it.description || it.detail),
    })),
    gallery: gallery.length ? gallery : image ? [image] : [],
    activityPackages: objArr(r.activity_packages).map((p) => ({
      title: str(p.title),
      description: str(p.description),
      price: num(p.price),
    })),
    goodToKnow: arr(r.good_to_know),
    meeting: str(r.meeting_pickup),
    location: str(r.location),
    pickupTime: str(r.pickup_time),
    whatToBring: arr(r.what_to_bring),
    rooms: objArr(r.rooms).map((rm) => ({
      title: str(rm.title),
      description: str(rm.description),
      price: num(rm.price),
      points: arr(rm.points),
    })),
    amenities: arr(r.amenities),
    policies: arr(r.policies),
    documents: arr(r.documents_required),
    eligibility: arr(r.eligibility),
  };
}

export type UIActivityFull = UIActivity & {
  overview: string;
  excluded: string[];
  packages: { title: string; description: string; price: number }[];
  goodToKnow: string[];
  location: string;
  pickupTime: string;
  whatToBring: string[];
  terms: string[];
};

export function mapActivity(r: Row): UIActivityFull {
  const gallery = mediaList(r.gallery_images);
  const image = media(r.image) || gallery[0] || "";
  const price = num(r.price);
  return {
    slug: str(r.slug || r.id),
    name: str(r.title || r.name),
    city: str(r.destination || r.location),
    duration: str(r.duration),
    price,
    offerPrice: num(r.offer_price) || price,
    image,
    gallery: gallery.length ? gallery : image ? [image] : [],
    summary: str(r.short_description),
    highlights: arr(r.highlights),
    included: arr(r.inclusions_included),
    meeting: str(r.meeting_pickup),
    overview: str(r.overview || r.short_description),
    excluded: arr(r.inclusions_not_included),
    packages: objArr(r.activity_packages).map((p) => ({
      title: str(p.title),
      description: str(p.description),
      price: num(p.price),
    })),
    goodToKnow: arr(r.good_to_know),
    location: str(r.location),
    pickupTime: str(r.pickup_time),
    whatToBring: arr(r.what_to_bring),
    terms: arr(r.terms),
  };
}

export type UIHotelFull = UIHotel & {
  overview: string;
  rooms: { title: string; description: string; price: number; points: string[] }[];
  policies: string[];
  terms: string[];
};

export function mapHotel(r: Row): UIHotelFull {
  const gallery = mediaList(r.gallery_images);
  const image = media(r.image) || gallery[0] || "";
  return {
    slug: str(r.slug || r.id),
    name: str(r.name || r.title),
    city: str(r.location),
    country: str(r.destination),
    stars: (num(r.stars, 5) as UIHotel["stars"]),
    image,
    gallery: gallery.length ? gallery : image ? [image] : [],
    pricePerNight: num(r.price),
    summary: str(r.short_description),
    amenities: arr(r.amenities),
    address: str(r.location),
    overview: str(r.overview || r.short_description),
    rooms: objArr(r.rooms).map((rm) => ({
      title: str(rm.title),
      description: str(rm.description),
      price: num(rm.price),
      points: arr(rm.points),
    })),
    policies: arr(r.policies),
    terms: arr(r.terms),
  };
}

export type UIVisaFull = UIVisa & {
  summary: string;
  overview: string;
  documents: string[];
  eligibility: string[];
  terms: string[];
  flagImage: string;
};

export function mapVisa(r: Row): UIVisaFull {
  const country = str(r.destination || r.country);
  return {
    slug: str(r.slug || r.id),
    country,
    code: str(r.code) || codeFrom(country),
    flag: "",
    flagImage: media(r.flag),
    type: str(r.visa_type || "Tourist e-Visa"),
    processing: str(r.processing_days),
    fee: num(r.price),
    validity: str(r.validity),
    image: media(r.image),
    summary: str(r.short_description),
    overview: str(r.overview || r.short_description),
    documents: arr(r.documents_required),
    eligibility: arr(r.eligibility),
    terms: arr(r.terms),
  };
}

export type UIGalleryItem = {
  id: string;
  title: string;
  kind: "image" | "video";
  place: string;
  images: string[];
  videos: string[];
  videoUrl: string;
  thumbnail: string;
};

export function mapGallery(r: Row): UIGalleryItem {
  return {
    id: str(r.id || r.slug),
    title: str(r.title),
    kind: str(r.kind) === "video" ? "video" : "image",
    place: str(r.place),
    images: mediaList(r.images),
    videos: mediaList(r.videos),
    videoUrl: str(r.video_url),
    thumbnail: str(r.image_url || r.image),
  };
}

export type UITestimonial = { id: string; title: string; description: string };

/* ---------------- query hooks ---------------- */

const opts = { staleTime: 60_000, retry: 1 } as const;

const homeOnly = <T extends { }>(rows: Row[], map: (r: Row) => T) =>
  rows.filter((r) => r.is_active !== false).map(map);

const featuredRows = (rows: Row[]) => rows.filter((r) => truthy(r.show_on_home));

export function usePackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => homeOnly(await list("/api/packages/"), mapPackage),
    ...opts,
  });
}

export function useHomePackages() {
  return useQuery({
    queryKey: ["packages", "home"],
    queryFn: async () => homeOnly(featuredRows(await list("/api/packages/")), mapPackage),
    ...opts,
  });
}

export function useDeals() {
  return useQuery({
    queryKey: ["deals"],
    queryFn: async () => homeOnly(await list("/api/deals/"), mapDeal),
    ...opts,
  });
}

export function useHomeDeals() {
  return useQuery({
    queryKey: ["deals", "home"],
    queryFn: async () => homeOnly(featuredRows(await list("/api/deals/")), mapDeal),
    ...opts,
  });
}

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: async () => homeOnly(await list("/api/activities/"), mapActivity),
    ...opts,
  });
}

export function useHomeActivities() {
  return useQuery({
    queryKey: ["activities", "home"],
    queryFn: async () => homeOnly(featuredRows(await list("/api/activities/")), mapActivity),
    ...opts,
  });
}

export function useHotels() {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: async () => homeOnly(await list("/api/hotels/"), mapHotel),
    ...opts,
  });
}

export function useHomeHotels() {
  return useQuery({
    queryKey: ["hotels", "home"],
    queryFn: async () => homeOnly(featuredRows(await list("/api/hotels/")), mapHotel),
    ...opts,
  });
}

export function useVisas() {
  return useQuery({
    queryKey: ["visas"],
    queryFn: async () => homeOnly(await list("/api/visas/"), mapVisa),
    ...opts,
  });
}

export function useHomeVisas() {
  return useQuery({
    queryKey: ["visas", "home"],
    queryFn: async () => homeOnly(featuredRows(await list("/api/visas/")), mapVisa),
    ...opts,
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => homeOnly(await list("/api/gallery/"), mapGallery),
    ...opts,
  });
}

export function useHomeSliderImages() {
  return useQuery({
    queryKey: ["home-slider"],
    queryFn: async () => {
      const rows = await list("/api/home-gallery-slider/");
      return rows
        .filter((r) => r.is_active !== false)
        .sort((a, b) => num(a.order) - num(b.order))
        .flatMap((r) => mediaList(r.images));
    },
    ...opts,
  });
}

export type UIHeroSlide = {
  id: string;
  title: string;
  summary: string;
  eyebrow: string;
  buttonText: string;
  buttonLink: string;
  image: string;
};

export function useHeroSlides() {
  return useQuery({
    queryKey: ["hero-slider"],
    queryFn: async (): Promise<UIHeroSlide[]> => {
      const rows = await list("/api/home-hero-slider/");
      return rows
        .filter((r) => r.is_active !== false)
        .sort((a, b) => num(a.order) - num(b.order))
        .map((r) => ({
          id: str(r.id),
          title: str(r.title),
          summary: str(r.short_description),
          eyebrow: str(r.name),
          buttonText: str(r.button_text),
          buttonLink: str(r.button_link) || "/packages",
          image: media(r.image),
        }));
    },
    ...opts,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async (): Promise<UITestimonial[]> => {
      const rows = await list("/api/testimonials/");
      return rows
        .filter((r) => r.is_active !== false)
        .map((r) => ({ id: str(r.id), title: str(r.title), description: str(r.description) }));
    },
    ...opts,
  });
}

/* ---------------- single-item hooks (slug lookups) ---------------- */

function useDetail<T>(key: string, path: string, slug: string, map: (r: Row) => T) {
  return useQuery({
    queryKey: [key, "detail", slug],
    queryFn: async (): Promise<T | null> => {
      const rows = await list(path, { slug });
      const row =
        rows.find((r) => str(r.slug) === slug) ??
        (rows.length === 1 ? rows[0] : undefined) ??
        (await list(path)).find((r) => str(r.slug) === slug);
      return row ? map(row) : null;
    },
    ...opts,
  });
}

export const usePackage = (slug: string) => useDetail("packages", "/api/packages/", slug, mapPackage);
export const useDeal = (slug: string) => useDetail("deals", "/api/deals/", slug, mapDeal);
export const useActivity = (slug: string) => useDetail("activities", "/api/activities/", slug, mapActivity);
export const useHotel = (slug: string) => useDetail("hotels", "/api/hotels/", slug, mapHotel);
export const useVisa = (slug: string) => useDetail("visas", "/api/visas/", slug, mapVisa);

export type UISpotlight = {
  id: string;
  title: string;
  summary: string;
};

export function useSpotlight() {
  return useQuery({
    queryKey: ["spotlight"],
    queryFn: async (): Promise<UISpotlight[]> => {
      const rows = await list("/api/spotlights/");

      return rows
        .filter((r) => r.is_active !== false)
        .map((r) => ({
          id: str(r.id),
          title: str(r.title),
          summary: str(r.summary || r.short_description),
        }));
    },
    ...opts,
  });
}