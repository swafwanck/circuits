import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, LinkIcon, Copy, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { api } from "./../lib/api";

export const Route = createFileRoute("/admin/payment-links")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Generate payment link — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PaymentLinksPage,
});

type LinkResponse = {
  payment_link?: string;
  url?: string;
  reference?: string;
  id?: string;
};

function PaymentLinksPage() {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    amount: "",
    currency: "AED",
    description: "",
  });

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.customer_email || !amount || amount <= 0) {
      toast.error("Enter a valid customer email and amount");
      return;
    }
    setLoading(true);
    setLink(null);
    try {
      const data = await api.post<LinkResponse>("/api/payment-links/", {
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        amount,
        currency: form.currency || "AED",
        description: form.description,
      });
      const url = data.payment_link ?? data.url ?? null;
      setLink(url);
      if (url) toast.success("Payment link generated");
      else toast.message("Link created — check the payment records page");
    } catch (err) {
      toast.error((err as Error).message || "Failed to generate link");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary";

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-primary">Adyen Payment Gateway</p>
          <h1 className="mt-1 text-xl font-bold sm:text-2xl">Generate a payment link</h1>
          <p className="mt-1 max-w-lg text-sm text-muted-foreground">
            Create a secure Adyen-hosted payment link, send it to the customer, and the
            booking is auto-marked paid on webhook verification.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
            <ShieldCheck className="h-3.5 w-3.5" /> PCI-compliant
          </span>
          <Link
            to="/admin/payment-link-records"
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted"
          >
            <LinkIcon className="h-3.5 w-3.5" /> View all links
          </Link>
        </div>
      </div>

      <form onSubmit={generate} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <label className="mb-1 block text-xs font-semibold text-muted-foreground">
            Customer name
          </label>
          <input
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            maxLength={120}
            className={inputClass}
            placeholder="Alex Kumar"
          />
        </div>
        <div className="min-w-0">
          <label className="mb-1 block text-xs font-semibold text-muted-foreground">
            Customer email <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            required
            value={form.customer_email}
            onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
            maxLength={200}
            className={inputClass}
            placeholder="alex@example.com"
          />
        </div>
        <div className="min-w-0">
          <label className="mb-1 block text-xs font-semibold text-muted-foreground">
            Amount <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            required
            min="1"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className={inputClass}
            placeholder="1250.00"
          />
        </div>
        <div className="min-w-0">
          <label className="mb-1 block text-xs font-semibold text-muted-foreground">Currency</label>
          <select
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className={inputClass}
          >
            <option value="AED">AED — UAE Dirham</option>
            <option value="USD">USD — US Dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — Pound</option>
            <option value="INR">INR — Rupee</option>
          </select>
        </div>
        <div className="min-w-0 sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-muted-foreground">
            Description
          </label>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={200}
            className={inputClass}
            placeholder="Bali Honeymoon Package — Booking #A1023"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
            Generate Adyen link
          </button>
          {link && (
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs">
              <span className="min-w-0 flex-1 truncate">{link}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  toast.success("Copied");
                }}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-card text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
