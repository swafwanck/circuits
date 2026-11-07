import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Check,
  Flame,
  Clock,
  MapPin,
  Shield,
  Info,
  X,
  CalendarDays,
  Tag,
} from "lucide-react";

import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import { useDeal } from "./../lib/content";
import type { UIDealFull } from "./../lib/content";
import { useEnquiry } from "./../components/site/EnquiryProvider";

export const Route = createFileRoute("/deals/$slug")({
  head: () => ({
    meta: [
      {
        title: "Deal Details — Circuit Travels",
      },
      {
        name: "description",
        content:
          "Explore deal details, pricing, inclusions and terms with Circuit Travels.",
      },
      {
        property: "og:title",
        content: "Deal Details — Circuit Travels",
      },
      {
        property: "og:description",
        content:
          "Limited period travel offers on packages, hotels, visas and activities.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),

  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <p>Deal not found.</p>
    </div>
  ),

  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center">
      {/* <p>Error: {error.message}</p> */}
      <p>Error: {error instanceof Error ? error.message : String(error)}</p>
    </div>
  ),

  component: DealDetail,
});

function DealDetail() {
  const { slug } = Route.useParams();
  const { data: deal, isLoading } = useDeal(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p>Deal not found.</p>
      </div>
    );
  }

  return <DealDetailView deal={deal} />;
}

type TabDef = {
  key: string;
  label: string;
};

function DealDetailView({ deal }: { deal: UIDealFull }) {
  const { open } = useEnquiry();

  const [lightbox, setLightbox] = useState<string | null>(null);

  const tabs = useMemo<TabDef[]>(() => {
    const t: TabDef[] = [];

    if (deal.overview || deal.summary) {
      t.push({
        key: "overview",
        label: "Overview",
      });
    }

    if (deal.highlights.length) {
      t.push({
        key: "highlights",
        label: "Highlights",
      });
    }

    if (deal.included.length || deal.excluded.length) {
      t.push({
        key: "inclusions",
        label: "Inclusions",
      });
    }

    if (deal.itinerary.length) {
      t.push({
        key: "itinerary",
        label: "Itinerary",
      });
    }

    if (deal.activityPackages.length) {
      t.push({
        key: "packages",
        label: "Select package",
      });
    }

    if (deal.rooms.length) {
      t.push({
        key: "rooms",
        label: "Rooms",
      });
    }

    if (deal.amenities.length) {
      t.push({
        key: "amenities",
        label: "Amenities",
      });
    }

    if (deal.documents.length) {
      t.push({
        key: "documents",
        label: "Documents",
      });
    }

    if (deal.eligibility.length) {
      t.push({
        key: "eligibility",
        label: "Eligibility",
      });
    }

    if (deal.goodToKnow.length) {
      t.push({
        key: "good",
        label: "Good to know",
      });
    }

    if (deal.whatToBring.length) {
      t.push({
        key: "bring",
        label: "What to bring",
      });
    }

    if (deal.meeting || deal.location || deal.pickupTime) {
      t.push({
        key: "meeting",
        label: "Meeting point",
      });
    }

    if (deal.policies.length) {
      t.push({
        key: "policies",
        label: "Policies",
      });
    }

    if (deal.terms.length) {
      t.push({
        key: "terms",
        label: "Terms & Conditions",
      });
    }

    return t;
  }, [deal]);

  const [tab, setTab] = useState<string>(
    tabs[0]?.key ?? "overview"
  );

  const active = tabs.some((t) => t.key === tab)
    ? tab
    : tabs[0]?.key;

  /*
   * Category-specific CTA.
   *
   * Visa:
   * - No booking/payment button.
   * - Visa application is handled through enquiry/WhatsApp.
   *
   * Hotel:
   * - Booking/payment button.
   *
   * Activity:
   * - Booking/payment button.
   *
   * Other:
   * - Normal deal booking/payment button.
   */
  const cta =
    deal.category === "Visa"
      ? "Apply now"
      : deal.category === "Hotel"
        ? "Book this hotel"
        : deal.category === "Activity"
          ? "Book activity"
          : "Grab this deal";

  /*
   * Visa detection.
   *
   * This handles "Visa" exactly and also protects against
   * values such as "visa" or " VISA ".
   */
  const isVisa =
    String(deal.category ?? "").trim().toLowerCase() === "visa";

  /*
   * Reusable enquiry action.
   *
   * Visa -> WhatsApp
   * Everything else -> Google Form
   */
  const handleEnquiry = () => {
    open({
      title: isVisa
        ? `Apply for Visa: ${deal.title}`
        : `Enquire: ${deal.title}`,

      subtitle: isVisa
        ? "Share your details and we'll help you with your visa application."
        : "Share your details — we'll get back to you shortly.",

      channel: isVisa ? "whatsapp" : "email",

      itemType: "deal",
      itemId: deal.slug,
    });
  };

  const bullets = (
    items: string[],
    icon: "check" | "info" | "shield" = "check"
  ) => (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((h) => (
        <li
          key={h}
          className="flex items-start gap-3 rounded-2xl text-black bg-secondary p-3"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sunset-gradient text-white">
            {icon === "check" ? (
              <Check className="h-3.5 w-3.5" />
            ) : icon === "shield" ? (
              <Shield className="h-3.5 w-3.5" />
            ) : (
              <Info className="h-3.5 w-3.5" />
            )}
          </span>

          <span className="min-w-0 break-words text-sm text-black font-base">
            {h}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="container-page pt-4 sm:pt-6">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
          {deal.image ? (
            <img
              src={deal.image}
              alt={deal.title}
              className="aspect-[16/9] w-full object-cover sm:aspect-[16/7]"
              loading="eager"
            />
          ) : (
            <div className="aspect-[16/9] w-full bg-ocean-gradient sm:aspect-[16/7]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/30 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-10">
            <div className="mb-3 flex flex-wrap gap-2">
              {deal.discount ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-sunset-gradient px-3 py-1 text-[10px] font-bold shadow-glow">
                  <Flame className="h-3 w-3" />
                  {deal.discount}
                </span>
              ) : null}

              <span className="rounded-full glass-dark px-3 py-1 text-[10px] font-semibold">
                {deal.category}
              </span>

              {deal.destination ? (
                <span className="inline-flex items-center gap-1 rounded-full glass-dark px-3 py-1 text-[10px] font-semibold">
                  <MapPin className="h-3 w-3" />
                  {deal.destination}
                </span>
              ) : null}

              {/* {deal.validTill ? (
                <span className="inline-flex items-center gap-1 rounded-full glass-dark px-3 py-1 text-[10px] font-semibold">
                  <Clock className="h-3 w-3" />
                  Till {deal.validTill}
                </span>
              ) : null} */}

              {deal.visaType ? (
                <span className="inline-flex items-center gap-1 rounded-full glass-dark px-3 py-1 text-[10px] font-semibold">
                  <Tag className="h-3 w-3" />
                  {deal.visaType}
                </span>
              ) : null}

              {deal.validity ? (
                <span className="inline-flex items-center gap-1 rounded-full glass-dark px-3 py-1 text-[10px] font-semibold">
                  <CalendarDays className="h-3 w-3" />
                  {deal.validity}
                </span>
              ) : null}
            </div>

            <h1 className="max-w-3xl font-display text-2xl font-bold leading-tight sm:text-5xl md:text-6xl">
              {deal.title}
            </h1>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="container-page grid grid-cols-1 gap-8 py-8 sm:py-12 lg:grid-cols-[1fr_380px] lg:gap-10">
        <div className="min-w-0">
          {/* Tabs */}

          {tabs.length > 0 && (
            <div className="no-scrollbar relative overflow-x-auto rounded-[10px] bg-gradient-to-r from-secondary via-secondary/70 to-secondary p-1.5 shadow-inner">
              <div className="flex min-w-max gap-4">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`whitespace-nowrap rounded-[10px] px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:px-5 sm:text-sm ${
                      active === t.key
                        ? "scale-[1.04] bg-sunset-gradient text-white shadow-glow"
                        : "text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab content */}

          <div
            key={active}
            className="mt-6 animate-in rounded-[15px] bg-gradient-to-br from-secondary/40 via-background to-secondary/30 p-5 shadow-glass ring-1 ring-border/50 duration-500 fade-in slide-in-from-bottom-3 sm:p-7"
          >
            {active === "overview" && (
              <p className="whitespace-pre-line text-base leading-relaxed text-black/90 sm:text-lg">
                {deal.overview || deal.summary}
              </p>
            )}

            {active === "highlights" && bullets(deal.highlights)}

            {active === "inclusions" && (
              <div className="space-y-5">
                {deal.included.length ? (
                  <div>
                    <h3 className="mb-2 text-sm font-bold text-black">
                      What's included
                    </h3>

                    {bullets(deal.included)}
                  </div>
                ) : null}

                {deal.excluded.length ? (
                  <div>
                    <h3 className="mb-2 text-sm font-bold text-black">
                      Not included
                    </h3>

                    <ul className="grid gap-2 sm:grid-cols-2">
                      {deal.excluded.map((e) => (
                        <li
                          key={e}
                          className="flex items-start gap-3 rounded-[10px] bg-secondary p-3"
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sunset text-black">
                            <X className="h-3.5 w-3.5 text-white" />
                          </span>

                          <span className="min-w-0 break-words text-sm">
                            {e}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}

            {active === "itinerary" && (
              <ol className="relative ml-5 space-y-6 border-l-2 border-dashed border-ocean/30 pl-8 sm:pl-10">
                {deal.itinerary.map((it) => (
                  <li
                    key={`${it.day}-${it.title}`}
                    className="relative"
                  >
                    <span className="absolute -left-[46px] top-0 grid h-9 w-9 place-items-center rounded-full bg-sunset-gradient text-[11px] font-bold text-white shadow-glow ring-4 ring-background sm:-left-[54px] sm:h-10 sm:w-10">
                      {String(it.day).padStart(2, "0")}
                    </span>

                    <h4 className="font-display text-base font-bold sm:text-lg">
                      {it.title}
                    </h4>

                    {it.detail ? (
                      <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                        {it.detail}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            )}

            {/* =================================================
                ACTIVITY PACKAGES
            ================================================== */}

            {active === "packages" && (
              <div className="space-y-3">
                {deal.activityPackages.map((p) => (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-glass sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display text-base font-bold text-black sm:text-lg">
                          {p.title}
                        </h4>

                        {p.description ? (
                          <p className="mt-1 text-xs text-black sm:text-sm">
                            {p.description}
                          </p>
                        ) : null}
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="font-display text-xl font-bold leading-none text-sunset sm:text-2xl">
                          ${p.price || deal.offerPrice} <span className="text-[15px] text-black font-bold"> / Person </span>
                        </p>

                        {/* <span className="text-[10px] text-muted-foreground">
                          per person
                        </span> */}

                        {/* Hide booking button for Visa */}
                        {!isVisa && (
                          <button
                            onClick={() =>
                              open({
                                variant: "booking",
                                title: `${p.title}: ${deal.title}`,
                                amount:
                                  p.price || deal.offerPrice,
                                currency: "AED",
                                itemType: "deal",
                                itemId: `${deal.slug}:${p.title}`,
                              })
                            }
                            className="mt-2 rounded-[10px] bg-sunset-gradient px-4 py-2 text-xs font-bold text-white shadow-glow transition-transform hover:scale-105"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* =================================================
                ROOMS
            ================================================== */}

            {active === "rooms" && (
              <div className="space-y-3">
                {deal.rooms.map((r) => (
                  <div
                    key={r.title}
                    className="rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-glass sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display text-base font-bold text-black sm:text-lg">
                          {r.title}
                        </h4>

                        {r.description ? (
                          <p className="mt-1 text-xs text-black sm:text-sm">
                            {r.description}
                          </p>
                        ) : null}

                        {r.points.length ? (
                          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-black">
                            {r.points.map((pt) => (
                              <li
                                key={pt}
                                className="flex items-center gap-1"
                              >
                                <Check className="h-3 w-3 text-sunset" />
                                {pt}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="font-display text-xl font-bold leading-none text-black sm:text-2xl">
                          ${r.price || deal.offerPrice} <span className="text-[10px] text-black font-bold"> / Night </span>
                        </p>

                        

                        {/* Hide booking button for Visa */}
                        {!isVisa && (
                          <button
                            onClick={() =>
                              open({
                                variant: "booking",
                                title: `${r.title}: ${deal.title}`,
                                amount:
                                  r.price || deal.offerPrice,
                                currency: "AED",
                                itemType: "deal",
                                itemId: `${deal.slug}:${r.title}`,
                              })
                            }
                            className="mt-2 rounded-[10px] bg-sunset-gradient px-4 py-2 text-xs font-bold text-white shadow-glow transition-transform hover:scale-105"
                          >
                            Book
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {active === "amenities" &&
              bullets(deal.amenities)}

            {active === "documents" &&
              bullets(deal.documents)}

            {active === "eligibility" &&
              bullets(deal.eligibility)}

            {active === "good" &&
              bullets(deal.goodToKnow, "info")}

            {active === "bring" &&
              bullets(deal.whatToBring)}

            {active === "meeting" && (
              <div className="space-y-3">
                {deal.meeting ? (
                  <div className="flex items-start gap-3 rounded-[10px]">
                    

                    <p className="text-sm text-[13px] font-semibold text-black">
                      {deal.meeting}
                    </p>
                  </div>
                ) : null}

                {deal.location ? (
                  <p className="text-sm">
                    <span className="font-semibold text-10px text-black">
                      Location : {" "}
                    </span>
                    {deal.location}
                  </p>
                ) : null}

                {deal.pickupTime ? (
                  <p className="text-sm">
                    <span className="font-semibold text-10px text-black">
                      Pickup time : {" "}
                    </span>
                    {deal.pickupTime}
                  </p>
                ) : null}
              </div>
            )}

            {active === "policies" &&
              bullets(deal.policies, "shield")}

            {active === "terms" &&
              bullets(deal.terms, "info")}
          </div>

          {/* =================================================
              GALLERY
          ================================================== */}

          {deal.gallery.length > 1 && (
            <div className="mt-8">
              <h2 className="mb-3 font-display text-lg font-bold text-black sm:text-xl">
                Gallery
              </h2>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {deal.gallery.map((g) => (
                  <button
                    key={g}
                    onClick={() => setLightbox(g)}
                    className="group overflow-hidden rounded-[10px] ring-1 ring-border"
                  >
                    <img
                      src={g}
                      alt={deal.title}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            SIDEBAR
        ====================================================== */}

        <aside className="self-start lg:sticky lg:top-24">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-premium sm:p-6">

            {/* Price */}

            <div className="flex items-end gap-2">
              <p className="font-display text-3xl font-bold text-sunset sm:text-4xl">
                ${deal.offerPrice}
              </p>

              {deal.price > deal.offerPrice ? (
                <p className="mb-1 text-sm font-bold text-black line-through">
                  ${deal.price}
                </p>
              ) : null}
            </div>

            <p className="text-xs font-semibold text-coral">
              Save {deal.discount}
              {/* {deal.validTill
                ? ` · Valid till ${deal.validTill}`
                : ""} */}
            </p>

            {/* =================================================
                ACTION BUTTONS

                VISA:
                - No booking/payment button
                - Apply for Visa -> WhatsApp

                OTHER:
                - Booking/payment button
                - Enquiry -> Google Form
            ================================================== */}

            <div className="mt-5 space-y-2.5">

              {/* ===============================================
                  BOOK / APPLY BUTTON

                  IMPORTANT:
                  Visa category does NOT render this button.
              ================================================ */}

              {!isVisa && (
                <button
                  onClick={() =>
                    open({
                      variant: "booking",
                      title: cta,
                      amount: deal.offerPrice,
                      currency: "AED",
                      itemType: "deal",
                      itemId: deal.slug,
                    })
                  }
                  className="w-full rounded-2xl bg-sunset-gradient py-3.5 font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
                >
                  {cta}
                </button>
              )}

              {/* ===============================================
                  ENQUIRY / VISA APPLICATION BUTTON

                  Visa -> WhatsApp
                  Other -> Google Form
              ================================================ */}

              <button
                type="button"
                onClick={handleEnquiry}
                className="w-full rounded-2xl bg-secondary py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
              >
                {isVisa
                  ? "Apply for Visa"
                  : "Send an enquiry"}
              </button>
            </div>

            {/* <p className="mt-4 text-center text-xs text-muted-foreground">
              Instant response · No spam
            </p> */}
          </div>

          <Link
            to="/deals"
            className="mt-4 block text-center text-sm font-bold text-black hover:text-sunset"
          >
            ← All deals
          </Link>
        </aside>
      </section>

      {/* =====================================================
          LIGHTBOX
      ====================================================== */}

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt={deal.title}
            className="max-h-[85vh] w-auto rounded-2xl object-contain"
          />

          <button
            aria-label="Close"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}
