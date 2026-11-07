import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Tag,
  Plane,
  Hotel,
  Ticket,
  ClipboardList,
  MessageSquare,
  MapPin,
  Images,
  CreditCard,
  ArrowUpRight,
  Plus,
  Link2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { listAll } from "./../lib/api";
import { RESOURCES } from "./../components/admin/resources";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: AdminDashboard,
});

type Row = Record<string, unknown>;

function useRows(key: string) {
  const res = RESOURCES[key];
  return useQuery({
    queryKey: ["admin", key, "rows"],
    queryFn: () => listAll<Row>(res.path),
    retry: false,
    staleTime: 60_000,
  });
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthlySeries(rows: Row[], field = "created_at") {
  const now = new Date();
  const buckets = Array.from({ length: 6 }, (_, k) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - k), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTHS[d.getMonth()], value: 0 };
  });
  for (const r of rows) {
    const raw = r[field] ?? r["created"] ?? r["date"];
    if (typeof raw !== "string") continue;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) continue;
    const hit = buckets.find((b) => b.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (hit) hit.value += 1;
  }
  return buckets;
}

function num(v: unknown) {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : 0;
}

function StatCard({
  label,
  value,
  loading,
  error,
  icon: Icon,
  to,
  tone,
}: {
  label: string;
  value: number | string;
  loading?: boolean;
  error?: boolean;
  icon: typeof Package;
  to: string;
  tone: string;
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-premium"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
      </div>
      <p className="mt-4 truncate text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
        {loading ? <span className="text-muted-foreground">…</span> : error ? <span className="text-sm text-destructive">offline</span> : value}
      </p>
    </Link>
  );
}

function Panel({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold sm:text-base">{title}</h3>
          {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

const PIE_COLORS = ["var(--ocean)", "var(--sky)", "var(--mint)", "var(--sunset)", "var(--coral)", "var(--lavender)"];

function AdminDashboard() {
  const bookings = useRows("bookings");
  const enquiries = useRows("enquiries");
  const packages = useRows("packages");
  const deals = useRows("deals");
  const visas = useRows("visas");
  const hotels = useRows("hotels");
  const activities = useRows("activities");
  const destinations = useRows("destinations");
  const gallery = useRows("gallery");
  const payments = useRows("payments");

  const bookingRows = bookings.data ?? [];
  const enquiryRows = enquiries.data ?? [];
  const paymentRows = payments.data ?? [];

  const revenue = paymentRows
    .filter((p) => String(p["status"] ?? "").toLowerCase() === "paid")
    .reduce((sum, p) => sum + num(p["amount"]), 0);

  const trend = monthlySeries(bookingRows).map((b, k) => ({
    month: b.label,
    bookings: b.value,
    enquiries: monthlySeries(enquiryRows)[k].value,
  }));

  const typeCounts = Object.entries(
    bookingRows.reduce<Record<string, number>>((acc, b) => {
      const t = String(b["booking_type"] ?? b["type"] ?? "other").replace(/_/g, " ");
      acc[t] = (acc[t] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const catalogue = [
    { name: "Packages", value: packages.data?.length ?? 0 },
    { name: "Deals", value: deals.data?.length ?? 0 },
    { name: "Visas", value: visas.data?.length ?? 0 },
    { name: "Hotels", value: hotels.data?.length ?? 0 },
    { name: "Activities", value: activities.data?.length ?? 0 },
    { name: "Gallery", value: gallery.data?.length ?? 0 },
  ];

  return (
    <div className="space-y-5">
      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Link
          to="/admin/$resource/new"
          params={{ resource: "packages" }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110"
        >
          <Plus className="h-3.5 w-3.5" /> New package
        </Link>
        <Link
          to="/admin/$resource/new"
          params={{ resource: "deals" }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold hover:bg-muted"
        >
          <Tag className="h-3.5 w-3.5" /> New deal
        </Link>
        <Link
          to="/admin/payment-links"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold hover:bg-muted"
        >
          <Link2 className="h-3.5 w-3.5" /> Payment link
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard
          label="Total bookings"
          value={bookingRows.length}
          loading={bookings.isLoading}
          error={!!bookings.error}
          icon={ClipboardList}
          to="/admin/bookings"
          tone="bg-primary text-primary-foreground"
        />
        <StatCard
          label="Enquiries"
          value={enquiryRows.length}
          loading={enquiries.isLoading}
          error={!!enquiries.error}
          icon={MessageSquare}
          to="/admin/enquiries"
          tone="bg-sky text-white"
        />
        {/* <StatCard
          label="Revenue (paid)"
          value={revenue ? revenue.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
          loading={payments.isLoading}
          error={!!payments.error}
          icon={CreditCard}
          to="/admin/payments"
          tone="bg-mint text-ocean-deep"
        /> */}
        <StatCard
          label="Live packages"
          value={packages.data?.length ?? 0}
          loading={packages.isLoading}
          error={!!packages.error}
          icon={Package}
          to="/admin/packages"
          tone="bg-ocean-deep text-white"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Bookings & enquiries" subtitle="Last 6 months">
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ left: -20, right: 6, top: 6 }}>
                  <defs>
                    <linearGradient id="gBook" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--sky)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="var(--sky)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gEnq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--mint)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--mint)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      color: "var(--foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="bookings" stroke="var(--sky)" fill="url(#gBook)" strokeWidth={2} />
                  <Area type="monotone" dataKey="enquiries" stroke="var(--mint)" fill="url(#gEnq)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <Panel title="Booking mix" subtitle="By type">
          <div className="h-56 sm:h-64">
            {typeCounts.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={typeCounts} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={3}>
                    {typeCounts.map((_, k) => (
                      <Cell key={k} fill={PIE_COLORS[k % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      color: "var(--foreground)",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-xs text-muted-foreground">
                No booking data yet
              </div>
            )}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel
            title="Catalogue overview"
            subtitle="Records per module"
            action={
              <Link to="/admin/packages" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Manage <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            <div className="h-52 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catalogue} margin={{ left: -20, right: 6, top: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      color: "var(--foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="var(--ocean)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <Panel title="Shortcuts" subtitle="Jump to a module">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Visas", to: "/admin/visas", icon: Plane },
              { label: "Hotels", to: "/admin/hotels", icon: Hotel },
              { label: "Activities", to: "/admin/activities", icon: Ticket },
              // { label: "Destinations", to: "/admin/destinations", icon: MapPin },
              { label: "Gallery", to: "/admin/gallery", icon: Images },
              { label: "Payments", to: "/admin/payments", icon: CreditCard },
            ].map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="flex items-center gap-2 rounded-2xl border border-border bg-muted/50 px-3 py-2.5 text-xs font-semibold transition hover:bg-muted"
              >
                <s.icon className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{s.label}</span>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      {/* Recent activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Recent bookings"
          action={
            <Link to="/admin/bookings" className="text-xs font-semibold text-primary">
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {bookingRows.slice(0, 5).map((b, k) => (
              <li key={k} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {String(b["first_name"] ?? "") || "Guest"} {String(b["last_name"] ?? "")}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {String(b["booking_type"] ?? b["type"] ?? "booking").replace(/_/g, " ")}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold">
                  {String(b["payment_status"] ?? b["status"] ?? "new")}
                </span>
              </li>
            ))}
            {!bookingRows.length ? (
              <li className="py-6 text-center text-xs text-muted-foreground">No bookings yet</li>
            ) : null}
          </ul>
        </Panel>

        <Panel
          title="Recent enquiries"
          action={
            <Link to="/admin/enquiries" className="text-xs font-semibold text-primary">
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {enquiryRows.slice(0, 5).map((e, k) => (
              <li key={k} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {String(e["first_name"] ?? e["name"] ?? "Enquiry")} {String(e["last_name"] ?? "")}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {String(e["email"] ?? e["phone"] ?? "")}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold">
                  {String(e["source"] ?? "web")}
                </span>
              </li>
            ))}
            {!enquiryRows.length ? (
              <li className="py-6 text-center text-xs text-muted-foreground">No enquiries yet</li>
            ) : null}
          </ul>
        </Panel>
      </div>
    </div>
  );
}