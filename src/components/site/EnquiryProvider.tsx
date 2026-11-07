import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X, Send, Sparkles } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";

import { API_BASE_URL } from "./../../lib/api";

export type EnquiryChannel = "whatsapp" | "email";
export type EnquiryContext = {
  title?: string;
  subtitle?: string;
  channel?: EnquiryChannel; // "whatsapp" only for visa/call-back; everything else is emailed
  variant?: "enquiry" | "booking";
  // Booking-only fields — the form data is stored in the database and emailed
  // to the business mailbox. Online payment returns in a later update.
  amount?: number;
  currency?: string;
  itemType?: "package" | "deal" | "activity" | "hotel" | "visa";
  itemId?: string;
  /** Title of the selected item (e.g. visa country) — stored in DB + sent to WhatsApp/email */
  itemTitle?: string;
  /** Force-show/hide the service selector (detail pages never show it). */
  askService?: boolean;
};

/** Service options offered on the call-back / generic enquiry form. */
const SERVICE_OPTIONS = ["package", "visa", "activity", "deal", "hotel"] as const;

type Ctx = { open: (opts?: EnquiryContext) => void };
const EnquiryCtx = createContext<Ctx>({ open: () => {} });

export const useEnquiry = () => useContext(EnquiryCtx);

type EnquiryResponse = { id?: number; whatsapp_url?: string };

/** Business WhatsApp number (digits only) — plain wa.me deep link, no third-party API. */
const WHATSAPP_NUMBER = "971562759994";

function buildWhatsAppLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function openWhatsAppInNewTab(url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Single source of truth: Django stores every submission in Postgres and
 * emails the business mailbox (info@circuitholidays.com, cc the Gmail address).
 * Visa/call-back enquiries additionally open a WhatsApp chat in a new tab
 * while this page stays in place.
 */
async function submitToDjango(path: string, payload: Record<string, unknown>): Promise<EnquiryResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return (await res.json()) as EnquiryResponse;
  } catch {
    return null; // Django may not be reachable in preview.
  }
}


export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [opts, setOpts] = useState<EnquiryContext>({});
  const emptyForm = { firstName: "", lastName: "", email: "", phone: "", message: "", service: "" };
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const open = (o?: EnquiryContext) => {
    setOpts(o ?? {});
    setSuccessMsg("");
    setVisible(true);
  };
  const close = () => setVisible(false);

  // Generic / call-back enquiries ask which service the visitor needs.
  // Detail (slug) pages already know the service, so the field is hidden there.
  const showService =
    opts.askService ?? (!opts.itemType && !opts.itemTitle && !opts.itemId && opts.variant !== "booking");

  const isBooking = opts.variant === "booking";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const label = isBooking ? "Booking Request" : "Enquiry";
    const itemTitle = opts.itemTitle ?? opts.title ?? label;
    const isCallback = /call back|callback|assist/i.test(`${opts.title ?? ""} ${itemTitle}`);
    const isVisaEnquiry = (opts.itemType ?? form.service) === "visa";
    // Call-back requests and visa enquiries also go to WhatsApp; everything else is emailed.
    const channel: EnquiryChannel =
      opts.channel ?? (isCallback || isVisaEnquiry ? "whatsapp" : "email");

    // ---------- Booking: store the form data + email it (no payment for now) ----------
    if (isBooking) {
      const booking = await submitToDjango("/api/bookings/", {
        customer_name: `${form.firstName} ${form.lastName}`.trim(),
        customer_email: form.email,
        customer_phone: form.phone,
        item_type: opts.itemType,
        item_id: opts.itemId,
        amount: opts.amount,
        currency: opts.currency ?? "AED",
        notes: form.message,
        item_title: itemTitle,
        status: "pending",
      });

      setSubmitting(false);
      if (!booking?.id) {
        alert("We couldn't save your booking request. Please check your details and try again, or contact us directly.");
        return;
      }
      setForm(emptyForm);
      setSuccessMsg(
        `Thank you! Your booking request has been received. A confirmation email is on its way to ${form.email || "you"} and our team will contact you shortly.`,
      );
      return;
    }

    // ---------- Enquiry / call-back ----------
    const service = form.service || opts.itemType || "";
    const payload = {
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phone: form.phone,
      message: form.message,
      channel,
      // Call-back requests also use WhatsApp, but they are not visa enquiries.
      is_visa: (opts.itemType ?? service) === "visa",
      service,
      source: isCallback ? "assistance" : opts.itemType || service || "home",
      item_type: opts.itemType ?? service,
      item_title: itemTitle,
      item_slug: opts.itemId ?? "",
      source_page: typeof window !== "undefined" ? window.location.pathname : "",
      website: "", // honeypot — bots fill it, humans never see it
    };

    if (channel === "whatsapp") {
      // Open synchronously while the submit event still has a user gesture.
      // Waiting for the API first causes browsers to block the new tab.
      const whatsappUrl = buildWhatsAppLink(
        [
          isCallback ? "Request a Call Back" : "Enquiry",
          itemTitle ? `Item: ${itemTitle}` : "",
          service ? `Service: ${service}` : "",
          `Name: ${payload.name}`,
          `Email: ${form.email || "-"}`,
          `Phone: ${form.phone || "-"}`,
          form.message ? `Message: ${form.message}` : "",
        ].filter(Boolean).join("\n"),
      );
      openWhatsAppInNewTab(whatsappUrl);

      // Save the enquiry without navigating the website away from this page.
      await submitToDjango("/api/enquiries/", payload);
      setSubmitting(false);
      setForm(emptyForm);
      setSuccessMsg("Thank you! We've received your request and opened WhatsApp for you — we'll be in touch shortly.");
      return;
    }

    await submitToDjango("/api/enquiries/", payload);

    setSubmitting(false);
    setForm(emptyForm);
    setSuccessMsg("Thank you! Your enquiry has been received — we'll reply within 24 hours.");
  };

  return (
    <EnquiryCtx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] grid place-items-center bg-ocean-deep/70 backdrop-blur-sm p-3 sm:p-4"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl bg-card shadow-premium max-h-[92vh] overflow-y-auto no-scrollbar"
            >
              {successMsg ? (
                <div className="p-8 sm:p-10 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold">Request received</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{successMsg}</p>
                  <button
                    onClick={close}
                    className="mt-6 w-full rounded-full bg-sunset-gradient px-6 py-3.5 font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative bg-hero p-5 sm:p-7 text-ocean-deep overflow-hidden">
                    <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-sunset/40 blur-3xl animate-blob" />
                    <button onClick={close} aria-label="Close" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full glass hover:scale-105 transition">
                      <X className="h-4 w-4" />
                    </button>
                    <span className="relative inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                      <Sparkles className="h-3 w-3" /> {isBooking ? "Book Now" : "Get in Touch"}
                    </span>
                    <h3 className="relative mt-3 font-display text-2xl sm:text-3xl font-bold leading-tight">
                      {opts.title ?? "Plan your trip with us"}
                    </h3>
                    <p className="relative mt-1.5 text-xs sm:text-sm text-ocean-deep/80">
                      {opts.subtitle ?? "Share your details — we'll reply within 24 hours."}
                    </p>
                  </div>

                  <form onSubmit={submit} className="p-5 sm:p-7 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input required maxLength={80} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" className="rounded-xl bg-secondary/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ocean" />
                      <input maxLength={80} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name (optional)" className="rounded-xl bg-secondary/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ocean" />
                      <input required type="email" maxLength={120} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="rounded-xl bg-secondary/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ocean" />
                      <input required maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-xl bg-secondary/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ocean" />
                      {showService ? (
                        <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-1 duration-300">
                          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Service</label>
                          <select
                            required
                            value={form.service}
                            onChange={(e) => setForm({ ...form, service: e.target.value })}
                            className="w-full cursor-pointer appearance-none rounded-xl bg-secondary/60 bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat px-4 py-3 pr-10 text-sm outline-none transition-all duration-300 hover:bg-secondary focus:ring-2 focus:ring-ocean focus:scale-[1.01]"
                            style={{
                              backgroundImage:
                                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>\")",
                            }}
                          >
                            <option value="">Select a service</option>
                            {SERVICE_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </div>
                      ) : null}
                      <textarea maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Additional message (optional)" rows={3} className="sm:col-span-2 rounded-xl bg-secondary/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ocean resize-none" />
                    </div>
                    <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-sunset-gradient px-6 py-3.5 font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-70">
                      {submitting
                        ? "Sending…"
                        : isBooking
                          ? (<>Send booking request <Send className="h-4 w-4" /></>)
                          : (<>Send enquiry <Send className="h-4 w-4" /></>)}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </EnquiryCtx.Provider>
  );
}
