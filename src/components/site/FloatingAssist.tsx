import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Phone, PhoneCall } from "lucide-react";
import { WhatsAppIcon } from "./../../components/site/WhatsAppIcon";
import { useEnquiry } from "./../../components/site/EnquiryProvider";

const NUMBERS = [
  { value: "971586416434", tel: "+971586416434" },
  { value: "971586416435", tel: "+971586416435" },
  { value: "971542122315", tel: "+971542122315" },
  { value: "971542122317", tel: "+971542122317" },
];
const WHATSAPP = "971586416434";

export function FloatingAssist() {
  const [open, setOpen] = useState(false);
  const { open: openEnquiry } = useEnquiry();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Centered modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] grid place-items-center bg-black/50 backdrop-blur-sm p-3 sm:p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[420px] rounded-2xl bg-white shadow-premium border border-border overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2 px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-border">
                <div className="min-w-0">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-ocean-deep">Need Assistance?</h3>
                  <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground leading-snug">
                    Travel consultants available 7 days · 9:30 AM – 7:30 PM
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="shrink-0 grid h-8 w-8 place-items-center rounded-full hover:bg-secondary transition text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-4 sm:px-5 py-3 sm:py-4 bg-white border-b border-border">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-2">Call us directly</p>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-3 gap-y-1.5">
                  {NUMBERS.map((n) => (
                    <a
                      key={n.tel}
                      href={`tel:${n.tel}`}
                      className="flex items-center gap-2 py-1 text-ocean-deep hover:text-primary transition"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="text-xs sm:text-sm font-semibold tracking-tight truncate">{n.value}</span>
                    </a>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  openEnquiry({
                    title: "Request a Call Back",
                    subtitle: "Share your details — we'll call you within 30 minutes.",
                    itemTitle: "Call Back Request",
                    askService: true,
                    channel: "whatsapp",
                  });
                }}
                className="w-full text-left px-4 sm:px-5 py-3 sm:py-4 bg-white border-b border-border hover:bg-secondary/40 transition"
              >
                <span className="flex items-center gap-2 text-ocean-deep font-semibold text-sm">
                  <PhoneCall className="h-4 w-4 text-primary" /> Request a Call Back
                </span>
                <span className="mt-1 block text-[11px] sm:text-xs text-muted-foreground">Our team will call you within 30 minutes.</span>
              </button>

              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block px-4 sm:px-5 py-3 sm:py-4 bg-white hover:bg-secondary/40 transition"
              >
                <span className="flex items-center gap-2 text-ocean-deep font-semibold text-sm">
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp Chat
                </span>
                <span className="mt-1 block text-[11px] sm:text-xs text-muted-foreground">Instant replies on WhatsApp.</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating stack: WhatsApp on top, Need Assistance below */}
      <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end gap-2 sm:gap-3">
        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="group relative grid h-11 w-11 sm:h-14 sm:w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-premium hover:scale-110 transition-transform"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
          <WhatsAppIcon className="relative h-5 w-5 sm:h-7 sm:w-7" />
        </a>
        <button
          onClick={() => setOpen(true)}
          aria-label="Need Assistance"
          className="inline-flex items-center gap-1.5 rounded-full bg-white text-ocean-deep border border-border shadow-premium hover:scale-105 transition-transform px-3 sm:px-4 py-2 sm:py-2.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-sunset opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sunset" />
          </span>
          <span className="text-[11px] sm:text-xs font-bold leading-none whitespace-nowrap">
            Need Assistance
          </span>
        </button>
      </div>
    </>
  );
}
