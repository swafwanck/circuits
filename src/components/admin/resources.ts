// Definitions for each admin resource (endpoint + fields shown in list/form).
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "url"
  | "email"
  | "date"
  | "select"
  | "slug" // auto-generated from another field
  | "image" // single file upload
  | "gallery" // multiple file uploads
  | "list" // point-wise list of strings
  | "repeater"; // list of objects

export type SubField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "list" | "url";
  placeholder?: string;
};

export type ResourceField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  listVisible?: boolean; // show in table
  placeholder?: string;
  help?: string;
  options?: string[]; // select
  from?: string; // slug source field
  accept?: string; // image/gallery
  subFields?: SubField[]; // repeater
  group?: string; // form section
  full?: boolean; // full-width in the form grid
  showFor?: { field: string; values: string[] }; // conditional visibility
  /** Derived (read-only) column value for the list table. */
  compute?: (row: Record<string, unknown>) => string;
};

/** Canonical enquiry sources shown in the admin. */
export const ENQUIRY_SOURCES = [
  "home",
  "assistance",
  "package",
  "deal",
  "visa",
  "activity",
  "hotel",
  "deal package",
  "deal visa",
  "deal activity",
  "deal hotel",
] as const;

/**
 * Enquiries are stored with `item_type` + `source_page` (no `source` column),
 * so the admin derives a friendly source label from what the API returns.
 */
export function enquirySource(row: Record<string, unknown>): string {
  const s = (k: string) => String(row[k] ?? "").toLowerCase();
  const stored = s("source").trim();
  if (stored) return stored;
  const page = s("source_page");
  const type = s("item_type") || s("service");
  const itemTitle = s("item_title");
  const isDeal = type === "deal" || page.includes("/deal") || itemTitle.includes("deal");

  const base =
    type === "visa" || page.includes("/visa")
      ? "visa"
      : type === "hotel" || page.includes("/hotel")
        ? "hotel"
        : type === "activity" || page.includes("/activities")
          ? "activity"
          : type === "package" || page.includes("/package")
            ? "package"
            : "";

  if (isDeal) return base ? `deal ${base}` : "deal";
  if (base) return base;
  if (itemTitle.includes("call back") || itemTitle.includes("assist")) return "assistance";
  return "home";
}

export type Resource = {
  key: string;
  label: string;
  path: string; // API base path, e.g. /api/packages/
  fields: ResourceField[];
  identifier?: string; // default "id"
};

/* ---------------- shared field builders ---------------- */

const G = {
  basic: "Basic details",
  media: "Media",
  content: "Content",
  itinerary: "Itinerary",
  terms: "Terms",
  pricing: "Pricing",
  customer: "Customer",
  visibility: "Visibility",
};

const slugFrom = (from: string): ResourceField => ({
  name: "slug",
  label: "Slug",
  type: "slug",
  from,
  listVisible: true,
  help: "Auto-generated from the title — editable.",
  group: G.basic,
});

const image = (name = "image", label = "Main image"): ResourceField => ({
  name,
  label,
  type: "image",
  accept: "image/png,image/jpeg,image/jpg,image/webp,image/avif",
  group: G.media,
  listVisible: true,
});

const galleryImages: ResourceField = {
  name: "gallery_images",
  label: "Gallery images (multiple)",
  type: "gallery",
  accept: "image/png,image/jpeg,image/jpg,image/webp",
  group: G.media,
  full: true,
  listVisible: true,
};

const shortDescription: ResourceField = {
  name: "short_description",
  label: "Short description",
  type: "textarea",
  group: G.basic,
  full: true,
};

const overview: ResourceField = {
  name: "overview",
  label: "Overview description",
  type: "textarea",
  group: G.content,
  full: true,
};

const highlights: ResourceField = {
  name: "highlights",
  label: "Highlights (points)",
  type: "list",
  group: G.content,
  full: true,
};

const included: ResourceField = {
  name: "inclusions_included",
  label: "Inclusions — included (points)",
  type: "list",
  group: G.content,
  full: true,
};

const notIncluded: ResourceField = {
  name: "inclusions_not_included",
  label: "Inclusions — not included (points)",
  type: "list",
  group: G.content,
  full: true,
};

const terms: ResourceField = {
  name: "terms",
  label: "Terms & Conditions (points)",
  type: "list",
  group: G.terms,
  full: true,
};

const itinerary: ResourceField = {
  name: "itinerary",
  label: "Itinerary",
  type: "repeater",
  group: G.itinerary,
  full: true,
  subFields: [
    { name: "title", label: "Itinerary title", type: "text" },
    { name: "description", label: "Short description", type: "textarea" },
  ],
};

const activityPackages: ResourceField = {
  name: "activity_packages",
  label: "Activity packages",
  type: "repeater",
  group: G.pricing,
  full: true,
  subFields: [
    { name: "title", label: "Package title", type: "text" },
    { name: "description", label: "Package short description", type: "textarea" },
    { name: "price", label: "Package price (AED)", type: "number" },
  ],
};

const goodToKnow: ResourceField = {
  name: "good_to_know",
  label: "Good to know (points)",
  type: "list",
  group: G.content,
  full: true,
};

const whatToBring: ResourceField = {
  name: "what_to_bring",
  label: "What to bring (points)",
  type: "list",
  group: G.content,
  full: true,
};

const meetingPickup: ResourceField = {
  name: "meeting_pickup",
  label: "Meeting & pickup description",
  type: "textarea",
  group: G.content,
  full: true,
};

const pickupTime: ResourceField = {
  name: "pickup_time",
  label: "Pickup time description",
  type: "text",
  group: G.content,
};

const rooms: ResourceField = {
  name: "rooms",
  label: "Rooms",
  type: "repeater",
  group: G.content,
  full: true,
  subFields: [
    { name: "title", label: "Room type title", type: "text" },
    { name: "description", label: "Room short description", type: "textarea" },
    { name: "price", label: "Room price (AED)", type: "number" },
    { name: "points", label: "Room points", type: "list" },
  ],
};

const amenities: ResourceField = {
  name: "amenities",
  label: "Amenities (points)",
  type: "list",
  group: G.content,
  full: true,
};

const policies: ResourceField = {
  name: "policies",
  label: "Policies (points)",
  type: "list",
  group: G.terms,
  full: true,
};

const documentsRequired: ResourceField = {
  name: "documents_required",
  label: "Documents required (points)",
  type: "list",
  group: G.content,
  full: true,
};

const eligibility: ResourceField = {
  name: "eligibility",
  label: "Eligibility (points)",
  type: "list",
  group: G.content,
  full: true,
};

const price = (label = "Price (AED)"): ResourceField => ({
  name: "price",
  label,
  type: "number",
  listVisible: true,
  group: G.pricing,
});

const offerPrice: ResourceField = {
  name: "offer_price",
  label: "Offer price (AED)",
  type: "number",
  listVisible: true,
  group: G.pricing,
};

const offerPercent: ResourceField = {
  name: "offer_percentage",
  label: "Offer percentage (%)",
  type: "number",
  listVisible: true,
  group: G.pricing,
};

const showOnHome: ResourceField = {
  name: "show_on_home",
  label: "Show on home page",
  type: "boolean",
  listVisible: true,
  group: G.visibility,
};

const isActive: ResourceField = {
  name: "is_active",
  label: "Active",
  type: "boolean",
  listVisible: true,
  group: G.visibility,
};

const enquiryPeople: ResourceField[] = [
  { name: "name", label: "Name", type: "text", required: true, listVisible: true, group: G.customer },
  { name: "phone", label: "Phone", type: "text", listVisible: true, group: G.customer },
  { name: "email", label: "Email", type: "email", listVisible: true, group: G.customer },
  { name: "message", label: "Message", type: "textarea", full: true, listVisible: true, group: G.customer },
];


const bookingStatus: ResourceField = {
  name: "payment_status",
  label: "Payment status",
  type: "select",
  options: ["pending", "paid", "partially_paid", "refunded", "cancelled"],
  listVisible: true,
  group: G.pricing,
};

export const DEAL_CATEGORIES = ["package", "visa", "hotel", "activity"];

/** Show a field only for the given deal categories. */
const cat = (values: string[], field: ResourceField): ResourceField => ({
  ...field,
  showFor: { field: "category", values },
});


/* ---------------- resources ---------------- */

export const RESOURCES: Record<string, Resource> = {
  packages: {
    key: "packages",
    label: "Packages",
    path: "/api/packages/",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, listVisible: true, group: G.basic },
      slugFrom("title"),
      { name: "duration", label: "Duration", type: "text", placeholder: "7 Nights / 8 Days", listVisible: true, group: G.basic },
      { name: "destination", label: "Destination", type: "text", listVisible: true, group: G.basic },
      shortDescription,
      price(),
      image(),
      galleryImages,
      overview,
      highlights,
      included,
      notIncluded,
      itinerary,
      terms,
      showOnHome,
      isActive,
    ],
  },

  activities: {
    key: "activities",
    label: "Activities (UAE)",
    path: "/api/activities/",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, listVisible: true, group: G.basic },
      slugFrom("title"),
      { name: "destination", label: "Destination", type: "text", listVisible: true, group: G.basic },
      { name: "duration", label: "Time duration", type: "text", placeholder: "4 hours", listVisible: true, group: G.basic },
      shortDescription,
      price(),
      image(),
      galleryImages,
      activityPackages,
      overview,
      highlights,
      goodToKnow,
      included,
      notIncluded,
      meetingPickup,
      { name: "location", label: "Location", type: "text", group: G.content },
      pickupTime,
      whatToBring,
      terms,
      showOnHome,
      isActive,
    ],
  },

  visas: {
    key: "visas",
    label: "Visas",
    path: "/api/visas/",
    fields: [
      { name: "destination", label: "Destination", type: "text", required: true, listVisible: true, group: G.basic },
      slugFrom("destination"),
      { name: "visa_type", label: "Visa type", type: "text", listVisible: true, group: G.basic },
      { name: "processing_days", label: "Processing days", type: "text", placeholder: "3-5 working days", listVisible: true, group: G.basic },
      { name: "validity", label: "Visa validity", type: "text", placeholder: "60 days", listVisible: true, group: G.basic },
      shortDescription,
      price(),
      image(),
      image("flag", "Flag image"),
      galleryImages,
      overview,
      documentsRequired,
      eligibility,
      terms,
      showOnHome,
      isActive,
    ],
  },

  hotels: {
    key: "hotels",
    label: "Hotels",
    path: "/api/hotels/",
    fields: [
      { name: "name", label: "Hotel name", type: "text", required: true, listVisible: true, group: G.basic },
      slugFrom("name"),
      { name: "location", label: "Location", type: "text", listVisible: true, group: G.basic },
      { name: "destination", label: "Destination", type: "text", listVisible: true, group: G.basic },
      shortDescription,
      price("Price / night (AED)"),
      image(),
      galleryImages,
      overview,
      rooms,
      amenities,
      terms,
      policies,
      showOnHome,
      isActive,
    ],
  },

  gallery: {
    key: "gallery",
    label: "Gallery",
    path: "/api/gallery/",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, listVisible: true, group: G.basic },
      { name: "place", label: "Place", type: "text", listVisible: true, group: G.basic },
      { name: "kind", label: "Type", type: "select", options: ["image", "video"], required: true, listVisible: true, group: G.basic },
      { name: "images", label: "Images (multiple)", type: "gallery", accept: "image/*", group: G.media, full: true, listVisible: true, showFor: { field: "kind", values: ["image"] } },
      { name: "image", label: "Video thumbnail image", type: "image", accept: "image/png,image/jpeg,image/jpg,image/webp,image/avif", group: G.media, listVisible: true, showFor: { field: "kind", values: ["video"] }, help: "Cover shown before the video plays. Optional for YouTube (its own thumbnail is used)." },
      { name: "videos", label: "Video files (MP4, WebM, MOV…)", type: "gallery", accept: "video/*", group: G.media, full: true, showFor: { field: "kind", values: ["video"] } },
      { name: "video_url", label: "YouTube / video link", type: "url", group: G.media, full: true, placeholder: "https://www.youtube.com/watch?v=…", showFor: { field: "kind", values: ["video"] } },
      showOnHome,
      isActive,
    ],
  },

  hero_slider: {
    key: "hero_slider",
    label: "Homepage Slider",
    path: "/api/home-hero-slider/",
    fields: [
      { name: "title", label: "Slide title", type: "text", required: true, listVisible: true, group: G.basic },
      { name: "name", label: "Eyebrow / small name", type: "text", listVisible: true, group: G.basic },
      shortDescription,
      { name: "button_text", label: "Button text", type: "text", listVisible: true, group: G.basic },
      image("image", "Slide image"),
      isActive,
    ],
  },

  home_slider: {

    key: "home_slider",
    label: "Gallery Slider (Home)",
    path: "/api/home-gallery-slider/",
    fields: [
      { name: "images", label: "Slider images (multiple)", type: "gallery", accept: "image/*", group: G.media, full: true, listVisible: true },
      isActive,
    ],
  },

  deals: {
    key: "deals",
    label: "Deals",
    path: "/api/deals/",
    fields: [
      {
        name: "category",
        label: "Category",
        type: "select",
        options: DEAL_CATEGORIES,
        required: true,
        listVisible: true,
        group: G.basic,
        help: "Fields below apply to the selected category.",
      },
      { name: "title", label: "Title", type: "text", required: true, listVisible: true, group: G.basic },
      slugFrom("title"),
      { name: "destination", label: "Destination", type: "text", listVisible: true, group: G.basic },
      cat(["visa"], { name: "visa_type", label: "Visa type", type: "text", group: G.basic }),
      cat(["visa"], { name: "validity", label: "Visa validity", type: "text", group: G.basic }),
      shortDescription,
      price(),
      offerPrice,
      offerPercent,
      image(),
      galleryImages,
      overview,
      cat(["package", "activity"], highlights),
      cat(["package", "activity"], included),
      cat(["package", "activity"], notIncluded),
      cat(["package"], itinerary),
      // activity-specific
      cat(["activity"], activityPackages),
      cat(["activity"], goodToKnow),
      cat(["activity"], meetingPickup),
      cat(["activity"], { name: "location", label: "Location", type: "text", group: G.content }),
      cat(["activity"], pickupTime),
      cat(["activity"], whatToBring),
      // hotel-specific
      cat(["hotel"], rooms),
      cat(["hotel"], amenities),
      cat(["hotel"], policies),
      // visa-specific
      cat(["visa"], documentsRequired),
      cat(["visa"], eligibility),

      terms,
      showOnHome,
      isActive,
    ],
  },

  testimonials: {
    key: "testimonials",
    label: "Testimonials",
    path: "/api/testimonials/",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, listVisible: true, group: G.basic },
      { name: "description", label: "Description", type: "textarea", required: true, listVisible: true, full: true, group: G.basic },
      isActive,
    ],
  },

  enquiries: {
    key: "enquiries",
    label: "Enquiries",
    path: "/api/enquiries/",
    fields: [
      {
        name: "source",
        label: "Source",
        type: "select",
        options: [...ENQUIRY_SOURCES],
        listVisible: true,
        group: G.basic,
        compute: enquirySource,
      },
      {
        name: "item_type",
        label: "Type",
        type: "select",
        options: ["package", "deal", "activity", "visa", "hotel"],
        listVisible: true,
        group: G.basic,
      },
      { name: "item_title", label: "Title", type: "text", listVisible: true, group: G.basic, help: "Package / deal / activity / visa / hotel name." },
      { name: "service", label: "Service", type: "select", options: ["package", "visa", "activity", "deal", "hotel"], listVisible: true, group: G.basic },
      ...enquiryPeople,
      { name: "is_visa", label: "Visa enquiry (WhatsApp)", type: "boolean", group: G.visibility },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["new", "in_progress", "closed"],
        listVisible: true,
        group: G.visibility,
      },
    ],
  },


  payment_links: {
    key: "payment_links",
    label: "Payment links",
    path: "/api/payment-links/",
    fields: [
      { name: "reference", label: "Reference", type: "text", listVisible: true, group: G.basic },
      { name: "customer_name", label: "Customer", type: "text", listVisible: true, group: G.customer },
      { name: "customer_email", label: "Email", type: "email", listVisible: true, group: G.customer },
      { name: "amount", label: "Amount", type: "number", required: true, listVisible: true, group: G.pricing },
      { name: "currency", label: "Currency", type: "text", listVisible: true, group: G.pricing },
      { name: "payment_link", label: "Payment link", type: "url", listVisible: true, group: G.pricing },
      { name: "status", label: "Status", type: "text", listVisible: true, group: G.pricing },
    ],
  },

  contacts: {
    key: "contacts",
    label: "Contact Messages",
    path: "/api/contacts/",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, listVisible: true, group: G.customer },
      { name: "phone", label: "Phone", type: "text", listVisible: true, group: G.customer },
      { name: "email", label: "Email", type: "email", listVisible: true, group: G.customer },
      { name: "service", label: "Service", type: "select", options: ["package", "visa", "activity", "deal", "hotel"], listVisible: true, group: G.customer },
      { name: "message", label: "Message", type: "textarea", full: true, listVisible: true, group: G.customer },
      { name: "handled", label: "Handled", type: "boolean", listVisible: true, group: G.visibility },
    ],
  },

  bookings: {
    key: "bookings",
    label: "Bookings",
    path: "/api/bookings/",
    fields: [
      { name: "reference", label: "Reference", type: "text", listVisible: true, group: G.basic },
      {
        name: "item_type",
        label: "Booking type",
        type: "select",
        options: ["package", "hotel", "activity", "visa"],
        required: true,
        listVisible: true,
        group: G.basic,
      },
      { name: "item_title", label: "Package / hotel / activity name", type: "text", listVisible: true, group: G.basic },
      { name: "item_slug", label: "Item slug", type: "text", group: G.basic },
      { name: "travel_date", label: "Travel date", type: "date", group: G.basic },
      { name: "pax", label: "Pax", type: "number", group: G.basic },
      { name: "customer_name", label: "Customer name", type: "text", required: true, listVisible: true, group: G.customer },
      { name: "customer_phone", label: "Phone", type: "text", listVisible: true, group: G.customer },
      { name: "customer_email", label: "Email", type: "email", listVisible: true, group: G.customer },
      { name: "notes", label: "Notes", type: "textarea", full: true, group: G.customer },
      { name: "total_amount", label: "Total amount (AED)", type: "number", required: true, listVisible: true, group: G.pricing },
      { name: "currency", label: "Currency", type: "text", placeholder: "AED", group: G.pricing },
      bookingStatus,
    ],
  },


  payments: {
    key: "payments",
    label: "Payments",
    path: "/api/payments/",
    fields: [
      { name: "reference", label: "Reference", type: "text", listVisible: true, group: G.basic },
      { name: "customer_name", label: "Customer", type: "text", required: true, listVisible: true, group: G.customer },
      { name: "customer_email", label: "Email", type: "email", listVisible: true, group: G.customer },
      { name: "amount", label: "Amount (AED)", type: "number", required: true, listVisible: true, group: G.pricing },
      { name: "currency", label: "Currency", type: "text", placeholder: "AED", listVisible: true, group: G.pricing },
      { name: "status", label: "Status", type: "select", options: ["pending", "paid", "failed", "refunded"], listVisible: true, group: G.pricing },
      { name: "payment_link", label: "Adyen payment link", type: "url", listVisible: true, group: G.pricing },
      { name: "invoice_url", label: "Invoice URL", type: "url", group: G.pricing },
      { name: "notes", label: "Notes", type: "textarea", full: true, group: G.basic },
    ],
  },


  settings: {
    key: "settings",
    label: "Website Content",
    path: "/api/settings/",
    identifier: "key",
    fields: [
      { name: "key", label: "Key", type: "text", required: true, listVisible: true, group: G.basic },
      { name: "label", label: "Label", type: "text", listVisible: true, group: G.basic },
      { name: "value", label: "Value", type: "textarea", listVisible: true, full: true, group: G.basic },
    ],
  },
};