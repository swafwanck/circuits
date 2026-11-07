import { useEffect, useState } from "react";
import { Outlet, createFileRoute, useNavigate, useRouterState, Link } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";

import { AdminSidebar } from "./../components/admin/AdminSidebar";
import { useAdminTheme } from "./../components/admin/useAdminTheme";
import { Toaster } from "./../components/ui/sonner";
import { getToken, getAdminUser, logout } from "./../lib/api";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Panel" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
  notFoundComponent: AdminNotFound,
});

function AdminNotFound() {
  return (
    <div className="grid min-h-[50vh] place-items-center px-4 text-center">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">404</p>
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">Admin page not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This admin section doesn't exist or has moved.
        </p>
        <Link
          to="/admin"
          className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  useAdminTheme();

  useEffect(() => {
    const check = () => setAuthed(!!getToken());
    check();
    setReady(true);
    window.addEventListener("admin-auth-changed", check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("admin-auth-changed", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!authed && pathname !== "/admin/login") {
      navigate({ to: "/admin/login" });
    }
  }, [ready, authed, pathname, navigate]);

  useEffect(() => {
    setMobileNav(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  if (!ready || !authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading admin…</p>
      </div>
    );
  }

  const user = getAdminUser();
  const firstName = (user?.username ?? "Admin").split(/[\s.@]/)[0];
  const cap = firstName.charAt(0).toUpperCase() + firstName.slice(1);


  return (
    // <div className="flex min-h-screen w-full bg-background text-foreground">
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <AdminSidebar
        mobileOpen={mobileNav}
        onClose={() => setMobileNav(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      {/* <div className="flex min-w-0 flex-1 flex-col"> */}
      {/* <div className="flex min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain"> */}
      <div className="no-scrollbar flex min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-3 py-3 backdrop-blur sm:px-6 sm:py-4 lg:px-8">
          {/* Left Side */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileNav(true)}
              aria-label="Open menu"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-card lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold sm:text-lg">
                Welcome back, {cap}!
              </h2>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                Here's what's happening across your travel operations today.
              </p>
            </div>
          </div>

          {/* Right Side */}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate({ to: "/admin/login" });
            }}
            aria-label="Log out"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-black hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>
        <main className="flex-1 no-scrollbar overflow-x-hidden p-3 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}