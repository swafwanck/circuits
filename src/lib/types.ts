// Shared types mirroring the Django REST API serializers.
export type ID = number;

export interface Package {
  id: ID;
  slug: string;
  name: string;
  country: string;
  destination: ID | null;
  destination_name?: string;
  duration: string;
  price: string;
  offer_price: string | null;
  currency: string;
  image: string;
  summary: string;
  description: string;
  inclusions: string[];
  highlights: string[];
  is_active: boolean;
  is_trending: boolean;
}

export interface Deal {
  id: ID;
  slug: string;
  title: string;
  category: string;
  image: string;
  price: string;
  offer_price: string;
  currency: string;
  discount: string;
  valid_until: string | null;
  description: string;
  is_active: boolean;
}

export interface Hotel {
  id: ID;
  slug: string;
  name: string;
  city: string;
  country: string;
  image: string;
  price_per_night: string;
  currency: string;
  stars: number;
  amenities: string[];
  description: string;
  is_active: boolean;
}

export interface Activity {
  id: ID;
  slug: string;
  name: string;
  city: string;
  duration: string;
  image: string;
  price: string;
  offer_price: string;
  currency: string;
  description: string;
  is_active: boolean;
}

export type VisaKind = "tourist" | "business" | "student" | "transit" | "work";

export interface Visa {
  id: ID;
  slug: string;
  country: string;
  type: VisaKind;
  image: string;
  processing: string;
  validity: string;
  fee: string;
  currency: string;
  documents: string[];
  description: string;
  is_active: boolean;
}

export type GalleryKind = "photo" | "video" | "poster";

export interface GalleryItem {
  id: ID;
  title: string;
  kind: GalleryKind;
  image: string;
  video_url: string;
  location: string;
  is_featured: boolean;
  order: number;
}

export interface Testimonial {
  id: ID;
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatar: string;
  is_active: boolean;
  order: number;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
  id: ID;
  reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  package: ID | null;
  hotel: ID | null;
  activity: ID | null;
  visa: ID | null;
  travel_date: string | null;
  pax: number;
  total_amount: string;
  currency: string;
  status: BookingStatus;
  notes: string;
}

export interface Enquiry {
  id: ID;
  name: string;
  email: string;
  phone: string;
  channel: "whatsapp" | "email" | "phone" | "form";
  item_title: string;
  message: string;
  status: "new" | "in_progress" | "closed";
  package: ID | null;
}

export type PaymentStatus =
  | "initiated" | "authorised" | "captured"
  | "refunded" | "failed" | "cancelled";

export interface Payment {
  id: ID;
  booking: ID;
  provider: "adyen";
  provider_reference: string;
  session_id: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
}

export interface AdyenSessionResponse {
  session: { id: string; sessionData: string; [k: string]: unknown };
  client_key: string;
  environment: "test" | "live";
}
