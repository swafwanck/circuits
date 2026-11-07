import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/payment/checkout")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Secure Checkout | Circuit Travels" },
      { name: "description", content: "Complete your booking payment securely with card, wallets and UPI." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: CheckoutPage,
});

type StoredSession = {
  session: { id: string; sessionData: string };
  client_key: string;
  environment: string;
  amount: string;
  currency: string;
  booking_reference: string;
};

function CheckoutPage() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StoredSession | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("adyen_checkout");
    if (!raw) {
      setError("No active payment session. Please start your booking again.");
      return;
    }
    const parsed = JSON.parse(raw) as StoredSession;
    setData(parsed);

    let cancelled = false;
    (async () => {
      try {
        const AdyenWeb = await import("@adyen/adyen-web");
        await import("@adyen/adyen-web/styles/adyen.css").catch(() => undefined);
        const { AdyenCheckout, Dropin } = AdyenWeb as any;
        const checkout = await AdyenCheckout({
          environment: parsed.environment || "test",
          clientKey: parsed.client_key,
          session: parsed.session,
          countryCode: "AE",
          onPaymentCompleted: (result: any) => {
            sessionStorage.removeItem("adyen_checkout");
            window.location.href = `/payment/return?ref=${encodeURIComponent(
              parsed.booking_reference,
            )}&resultCode=${result?.resultCode ?? ""}`;
          },
          onError: (err: any) => setError(err?.message ?? "Payment failed. Please try again."),
        });
        if (cancelled || !mountRef.current) return;
        new Dropin(checkout, { showPayButton: true }).mount(mountRef.current);
      } catch (e) {
        setError((e as Error)?.message ?? "Could not load the payment form.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
      <h1 className="text-2xl font-extrabold sm:text-3xl">Secure checkout</h1>
      {data && (
        <p className="mt-1 text-sm text-muted-foreground">
          Booking {data.booking_reference} — {data.currency} {data.amount}
        </p>
      )}
      {error ? (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-destructive">{error}</p>
          <Link to="/" className="mt-3 inline-block text-sm font-semibold text-primary">
            Back to home
          </Link>
        </div>
      ) : (
        <div ref={mountRef} className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-6" />
      )}
    </main>
  );
}
