import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import { API_BASE_URL } from "./../lib/api";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

/** Service options offered on the contact + call-back forms. */
const SERVICES = ["package", "visa", "activity", "deal", "hotel"] as const;


export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Circuit Travels — Plan Your Trip" },
      { name: "description", content: "Tell us your dream trip. A travel concierge replies within 24 hours." },
      { property: "og:title", content: "Contact Circuit Travels" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "", website: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      // Django stores the message in Postgres, then emails it (Gmail) + posts to Google Form.
      const res = await fetch(`${API_BASE_URL}/api/contacts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setForm({ name: "", email: "", phone: "", service: "", message: "", website: "" });
      setState("sent");
    } catch {
      setState("error");
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container-page py-16 md:py-20 grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-coral font-semibold">Get in touch</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl font-bold">Let's design your <span className="text-coral">next chapter</span>.</h1>
          <p className="mt-4 text-muted-foreground text-lg">Drop us a line — a real human will reply within 24 hours with a personal itinerary draft.</p>

          <div className="mt-10 space-y-4">
            {[
              { i: Mail, l: "Email", v: "circuitholidays@gmail.com" },
              { i: Phone, l: "Phone", v: "02-2461174" },
              { i: MessageCircle, l: "WhatsApp", v: "971 56 2759 994" },
              { i: MapPin, l: "Head Office", v: "09 shabia - opp. Rich & fresh supermarket - Musaffah - ME9 - Abu Dhabi - United Arab Emirates" },
              { i: MapPin, l: "Branch Office", v: "As Salam - 4 Ad Daqayiq St - Al Zahiyah - E16 02 - Abu Dhabi - United Arab Emirates" },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl bg-card p-4 shadow-glass">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sunset-gradient text-white shadow-glow"><c.i className="h-5 w-5" /></span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-black font-semibold">{c.l}</p>
                  <p className="mt-0.5 font-semibold text-black">{c.v}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="rounded-3xl bg-card p-8 shadow-premium space-y-4 h-[580px]">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Full name" placeholder="Your name" required maxLength={120} value={form.name} onChange={set("name")} />
            <Field label="Email" placeholder="you@email.com" type="email" required maxLength={160} value={form.email} onChange={set("email")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Phone" placeholder="Phone Number" type="tel" maxLength={40} value={form.phone} onChange={set("phone")} />
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service</span>
              <select
                required
                value={form.service}
                onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                className="mt-1 w-full cursor-pointer appearance-none rounded-2xl bg-secondary bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat px-4 py-3 pr-10 text-sm outline-none transition-all duration-300 hover:bg-secondary/80 focus:ring-2 focus:ring-primary focus:scale-[1.01]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>\")",
                }}
              >
                <option value="">Select a service</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tell us about your dream trip</span>
            <textarea rows={5} maxLength={4000} value={form.message} onChange={set("message")} className="mt-1 w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Where, when, with whom, and what mood?" />
          </label>
          {/* honeypot — hidden from humans, filled by bots and rejected server-side */}
          <input
            type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
            value={form.website} onChange={set("website")}
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />
          <button type="submit" disabled={state === "sending"} className="w-full rounded-2xl bg-sunset-gradient py-3.5 font-semibold text-white shadow-glow hover:scale-[1.01] transition-transform disabled:opacity-70">
            {state === "sending" ? "Sending…" : "Send to a travel concierge"}
          </button>
          {state === "sent" && <p className="text-[12px] text-center font-semibold text-primary">Thanks! Your message is with our team — we'll reply within 24h.</p>}
          {state === "error" && <p className="text-[12px] text-center font-semibold text-destructive">We couldn't send that. Please try again or email us directly.</p>}
          {/* <p className="text-[11px] text-muted-foreground text-center">We'll never share your details. Replies within 24h.</p> */}
        </form>

      </section>

      <section className="container-page pb-20">
        <div className="overflow-hidden rounded-3xl shadow-premium">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3635.1636714667684!2d54.5332892753543!3d24.340790678272153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e474e95635377%3A0x80d0d8dd71154942!2sCircuit%20Holidays%20%26%20Travels!5e0!3m2!1sen!2sin!4v1786378854629!5m2!1sen!2sin" width="1300" height="600" loading="lazy"></iframe>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-black">{label}</span>
      <input {...rest} className="mt-1 w-full rounded-[10px] bg-secondary px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-sunset" />
    </label>
  );
}