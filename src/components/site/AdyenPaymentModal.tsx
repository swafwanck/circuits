import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShieldCheck, Loader2 } from "lucide-react";

export type AdyenSessionPayload = {
  session: { id: string; sessionData: string };
  client_key: string;
  environment?: string;
  amount?: string | number;
  currency?: string;
  booking_reference?: string;
};

/**
 * On-site Adyen Drop-in inside a popup — card, wallets, UPI etc.
 * No payment link is generated; the customer pays right here.
 */
export function AdyenPaymentModal({
  payload,
  onClose,
}: {
  payload: AdyenSessionPayload | null;
  onClose: () => void;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!payload) return;
    setError(null);
    setLoading(true);
    let cancelled = false;
    let dropin: { unmount?: () => void } | null = null;

    (async () => {
      try {
        const AdyenWeb: any = await import("@adyen/adyen-web");
        await import("@adyen/adyen-web/styles/adyen.css" as string).catch(() => undefined);
        const { AdyenCheckout, Dropin } = AdyenWeb;
        const checkout = await AdyenCheckout({
          environment: payload.environment || "test",
          clientKey: payload.client_key,
          session: payload.session,
          countryCode: "AE",
          onPaymentCompleted: (result: any) => {
            window.location.href = `/payment/return?ref=${encodeURIComponent(
              payload.booking_reference ?? "",
            )}&resultCode=${result?.resultCode ?? ""}`;
          },
          onError: (err: any) => setError(err?.message ?? "Payment failed. Please try again."),
        });
        if (cancelled || !mountRef.current) return;
        dropin = new Dropin(checkout, { showPayButton: true });
        (dropin as any).mount(mountRef.current);
        setLoading(false);
      } catch (e) {
        if (!cancelled) {
          setError((e as Error)?.message ?? "Could not load the payment form.");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      try { dropin?.unmount?.(); } catch { /* noop */ }
    };
  }, [payload]);

  return (
    <AnimatePresence>
      {payload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[140] grid place-items-center bg-foreground/70 p-3 backdrop-blur-sm sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-card p-5 shadow-2xl sm:p-6"
          >
            <button
              onClick={onClose}
              aria-label="Close payment"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-secondary hover:bg-secondary/70"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="pr-10 text-lg font-bold">Secure payment</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              {payload.booking_reference ? `Booking ${payload.booking_reference} — ` : ""}
              {payload.currency ?? "AED"} {payload.amount ?? ""}
            </p>

            {error ? (
              <p className="mt-5 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            ) : null}

            {loading && !error ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading payment methods…
              </div>
            ) : null}

            <div ref={mountRef} className="mt-4" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
