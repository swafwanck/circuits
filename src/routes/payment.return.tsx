import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { API_BASE_URL } from "./../lib/api";

export const Route = createFileRoute("/payment/return")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Payment status | Circuit Travels" },
      { name: "description", content: "Your booking payment status and confirmation details." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PaymentReturnPage,
});

function PaymentReturnPage() {
  const [status, setStatus] = useState<string>("Checking your payment…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref") ?? "";
    const resultCode = params.get("resultCode") ?? "";
    if (resultCode) {
      setStatus(
        /authorised|received|pending/i.test(resultCode)
          ? "Payment successful — your booking is confirmed."
          : `Payment ${resultCode.toLowerCase()}. Please try again or contact us.`,
      );
      return;
    }
    if (!ref) {
      setStatus("No payment reference found.");
      return;
    }
    fetch(`${API_BASE_URL}/api/payments/${encodeURIComponent(ref)}/`)
      .then((r) => r.json())
      .then((d) => setStatus(`Payment status: ${d?.status ?? "unknown"}`))
      .catch(() => setStatus("We couldn't verify your payment. Please contact us."));
  }, []);

  return (
    <main className="mx-auto grid min-h-[60vh] w-full max-w-xl place-items-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">Payment</h1>
        <p className="mt-3 text-sm text-muted-foreground">{status}</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
