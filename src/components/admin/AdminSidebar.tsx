import { useEffect, useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Tag,
  Plane,
  Hotel,
  Ticket,
  MapPin,
  ClipboardList,
  MessageSquare,
  CreditCard,
  Images,
  Star,
  Quote,
  FileText,
  Mail,
  LogOut,
  Moon,
  Sun,
  Home,
  Link2,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { getAdminUser, logout } from "./../../lib/api";
import { useAdminTheme } from "./useAdminTheme";
// import adminLogo from ".//assets/admin-logo.png.asset.json";

type Item = { title: string; to: string; icon: typeof Package };
type Group = { label: string; icon: typeof Package; items: Item[]; flat?: boolean };

export const NAV_GROUPS: Group[] = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    flat: true,
    items: [{ title: "Dashboard", to: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Home page",
    icon: Images,
    items: [
      { title: "Homepage Slider", to: "/admin/hero-slider", icon: Images },
      // { title: "Package Spotlight", to: "/admin/spotlight", icon: Star },
      { title: "Gallery Slider", to: "/admin/home-slider", icon: Images },
      { title: "Gallery", to: "/admin/gallery", icon: Images },
      { title: "Testimonials", to: "/admin/testimonials", icon: Quote },
      // { title: "Website Content", to: "/admin/settings", icon: FileText },
    ],
  },
  {
    label: "Catalogue",
    icon: Package,
    items: [
      { title: "Packages", to: "/admin/packages", icon: Package },
      { title: "Deals", to: "/admin/deals", icon: Tag },
      { title: "Visas", to: "/admin/visas", icon: Plane },
      { title: "Hotels", to: "/admin/hotels", icon: Hotel },
      { title: "Activities (UAE)", to: "/admin/activities", icon: Ticket },
      // { title: "Destinations", to: "/admin/destinations", icon: MapPin },
    ],
  },
  {
    label: "Enquiries",
    icon: MessageSquare,
    items: [
      { title: "All enquiries", to: "/admin/enquiries", icon: MessageSquare },
      // { title: "Home form", to: "/admin/enquiries/source/home", icon: Home },
      // { title: "Package", to: "/admin/enquiries/source/package", icon: Package },
      // { title: "Deals", to: "/admin/enquiries/source/deal", icon: Tag },
      // { title: "Activities", to: "/admin/enquiries/source/activity", icon: Ticket },
      // { title: "Visa", to: "/admin/enquiries/source/visa", icon: Plane },
      // { title: "Hotel", to: "/admin/enquiries/source/hotel", icon: Hotel },
      { title: "Contact Messages", to: "/admin/contacts", icon: Mail },
    ],
  },
  {
    label: "Bookings",
    icon: ClipboardList,
    items: [
      { title: "All bookings", to: "/admin/bookings", icon: ClipboardList },
      // { title: "Package", to: "/admin/bookings/type/package", icon: Package },
      // { title: "Deal package", to: "/admin/bookings/type/deal_package", icon: Tag },
      // { title: "Activities", to: "/admin/bookings/type/activity", icon: Ticket },
      // { title: "Deal activities", to: "/admin/bookings/type/deal_activity", icon: Ticket },
      // { title: "Hotels", to: "/admin/bookings/type/hotel", icon: Hotel },
      // { title: "Deal hotels", to: "/admin/bookings/type/deal_hotel", icon: Hotel },
    ],
  },
  {
    label: "Payments",
    icon: CreditCard,
    items: [
      { title: "Generate link", to: "/admin/payment-links", icon: Link2 },
      { title: "Payment links", to: "/admin/payment-link-records", icon: Link2 },
      
    ],
  },
];


export function AdminSidebar({
  mobileOpen = false,
  onClose,
  collapsed = false,
  onToggleCollapse,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
} = {}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const user = getAdminUser();
  const { theme, setTheme } = useAdminTheme();

  const isActive = (to: string) =>
    to === "/admin" ? pathname === "/admin" : pathname === to || pathname.startsWith(`${to}/`);

  const groupHasActive = (g: Group) => g.items.some((i) => isActive(i.to));
  const activeGroupLabel = NAV_GROUPS.find(groupHasActive)?.label ?? null;

  const [open, setOpen] = useState<string | null>(activeGroupLabel);
  const [hovered, setHovered] = useState<string | null>(null);

  // Keep the group containing the current route expanded.
  useEffect(() => {
    if (activeGroupLabel) setOpen(activeGroupLabel);
  }, [activeGroupLabel]);

  function handleLogout() {
    logout();
    navigate({ to: "/admin/login" });
  }

  const showItems = (g: Group) =>
    g.flat || open === g.label || hovered === g.label || groupHasActive(g);
  
  return (
    <>
      {mobileOpen ? (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      ) : null}
      <aside
        className={[
          "flex shrink-0 flex-col border-r border-border bg-card p-3 transition-[width,transform] duration-200",
          collapsed ? "lg:w-[76px]" : "lg:w-64",
          // "w-[15.5rem] max-w-[85vw] fixed inset-y-0 left-0 z-50 lg:static lg:translate-x-0 lg:max-w-none",
          "w-[15.5rem] max-w-[85vw] fixed inset-y-0 left-0 z-50 h-screen lg:sticky lg:top-0 lg:translate-x-0 lg:max-w-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex items-center gap-2 px-1 py-2">
          <Link to="/admin" className="flex min-w-0 flex-1 items-center gap-2">
            {/* <img
              src={adminLogo.url}
              alt="Circuit admin"
              className="h-9 w-9 shrink-0 rounded-xl object-contain"
            /> */}
            {!collapsed ? (
              <span className="truncate text-lg font-bold tracking-tight">
                Circuit<span className="text-primary">.</span>
              </span>
            ) : null}
          </Link>
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden h-8 w-8 shrink-0 place-items-center rounded-[10px] text-muted-foreground hover:bg-muted hover:text-foreground lg:grid"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        {/* <nav className="mt-2 flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden pr-1"> */}
        {/* <nav className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden overscroll-contain pr-1"> */}
        <nav className="no-scrollbar mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden overscroll-contain pr-1">
          {NAV_GROUPS.map((group) => {
            const expanded = showItems(group);
            const active = groupHasActive(group);
            return (
              <div
                key={group.label}
                onMouseEnter={() => !group.flat && setHovered(group.label)}
                onMouseLeave={() => setHovered((h) => (h === group.label ? null : h))}
              >
                {!group.flat ? (
                  <button
                    type="button"
                    onClick={() => setOpen((o) => (o === group.label ? null : group.label))}
                    aria-expanded={expanded}
                    title={group.label}
                    className={[
                      "flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-widest transition",
                      collapsed ? "lg:justify-center lg:px-0" : "",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    <group.icon className="h-4 w-4 shrink-0" />
                    <span className={collapsed ? "flex-1 truncate lg:hidden" : "flex-1 truncate"}>
                      {group.label}
                    </span>
                    <ChevronDown
                      className={[
                        "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                        expanded ? "rotate-180" : "",
                        collapsed ? "lg:hidden" : "",
                      ].join(" ")}
                    />
                  </button>
                ) : null}

                <div
                  className={[
                    "grid transition-all duration-200",
                    expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <div className={group.flat ? "space-y-1" : "space-y-1 pt-1"}>
                      {group.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={onClose}
                          title={item.title}
                          tabIndex={expanded ? 0 : -1}
                          className={[
                            "flex items-center gap-3 rounded-[10px] px-3 py-2 text-sm font-medium transition",
                            collapsed ? "lg:justify-center lg:px-0" : group.flat ? "" : "ml-2",
                            isActive(item.to)
                              ? "bg-primary text-primary-foreground shadow-[0_10px_20px_-12px_hsl(0_0%_0%/0.5)]"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          ].join(" ")}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className={collapsed ? "truncate lg:hidden" : "truncate"}>
                            {item.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <div
          className={[
            "mt-2 flex items-center gap-1 rounded-[10px] bg-muted p-1",
            collapsed ? "lg:flex-col lg:rounded-2xl" : "",
          ].join(" ")}
        >
          <button
            onClick={() => setTheme("light")}
            aria-label="Light theme"
            className={[
              "flex flex-1 items-center justify-center gap-1 rounded-[10px] p-2.5 text-xs font-medium",
              theme === "light" ? "bg-primary text-white shadow-sm" : "text-white",
            ].join(" ")}
          >
            <Sun className="h-3.5 w-3.5" />
            <span className={collapsed ? "lg:hidden" : ""}>Light</span>
          </button>
          <button
            onClick={() => setTheme("dark")}
            aria-label="Dark theme"
            className={[
              "flex flex-1 items-center justify-center gap-1 rounded-[10px] p-2.5 text-xs font-medium",
              theme === "dark" ? "bg-primary text-white shadow-sm" : "text-black",
            ].join(" ")}
          >
            <Moon className="h-3.5 w-3.5" />
            <span className={collapsed ? "lg:hidden" : ""}>Dark</span>
          </button>
        </div>

        {/* User card */}
        <div className="mt-3 rounded-[10px] bg-muted p-2.5">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {(user?.username ?? "A").slice(0, 1).toUpperCase()}
            </div>
            <div className={collapsed ? "min-w-0 flex-1 lg:hidden" : "min-w-0 flex-1"}>
              <p className="truncate text-sm font-semibold">{user?.username ?? "Admin"}</p>
              <p className="truncate text-xs text-muted-foreground">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className={[
                "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-white hover:text-black",
                collapsed ? "lg:hidden" : "",
              ].join(" ")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>


      </aside>
    </>
  );
}