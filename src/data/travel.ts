// Shared UI content types. All data now comes from the Django REST API
// (see src/lib/content.ts). No demo data lives in the frontend.

export type Package = {
  slug: string;
  name: string;
  code: string;
  destination: string;
  country: string;
  duration: string;
  price: number;
  offerPrice: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  highlights: string[];
  overview: string;
  category: "Beach" | "Mountain" | "City" | "Adventure" | "Honeymoon" | "Cultural";
  included: string[];
  excluded: string[];
  itinerary: { day: number; title: string; detail: string }[];
};

export type Visa = {
  slug: string;
  country: string;
  code: string;
  flag: string;
  type: string;
  processing: string;
  fee: number;
  validity: string;
  image: string;
};

export type Deal = {
  slug: string;
  title: string;
  category: "Package" | "Visa" | "Hotel" | "Activity";
  image: string;
  discount: string;
  price: number;
  offerPrice: number;
  validTill: string;
  summary: string;
  highlights: string[];
  terms: string[];
};

export type Hotel = {
  slug: string;
  name: string;
  city: string;
  country: string;
  stars: 3 | 4 | 5;
  image: string;
  gallery: string[];
  pricePerNight: number;
  summary: string;
  amenities: string[];
  address: string;
};

export type Activity = {
  slug: string;
  name: string;
  city: string;
  duration: string;
  price: number;
  offerPrice: number;
  image: string;
  gallery: string[];
  summary: string;
  highlights: string[];
  included: string[];
  meeting: string;
};
