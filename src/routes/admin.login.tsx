import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Plane, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { login, API_BASE_URL } from "./../lib/api";
// import logo from "./../../src/assets/image/logo_3.png";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login — Circuit Travels" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Enter your username and password");
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password);
      toast.success("Signed in");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error((err as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left showcase */}
      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-4 rounded-3xl overflow-hidden bg-[linear-gradient(135deg,#0b3763_0%,#0f4a80_45%,#f97316_120%)]">
          {/* aurora blobs */}
          <div className="absolute -top-20 -left-16 h-80 w-80 rounded-full bg-sky-400/40 blur-3xl" />
          <div className="absolute bottom-0 -right-10 h-96 w-96 rounded-full bg-orange-500/40 blur-3xl" />
          {/* logo */}
          {/* <div className="absolute top-8 left-8 z-10 rounded-2xl bg-white/95 backdrop-blur px-4 py-3">
            <img src={logo} alt="Circuit Travels & Holidays LLC" className="h-10 w-auto" />
          </div> */}
          {/* central plane */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative">
              <div className="absolute inset-0 -m-16 rounded-full bg-white/10 blur-2xl" />
              <div className="relative grid h-56 w-56 place-items-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
                <Plane className="h-28 w-28 text-white rotate-[-25deg] drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
          </div>
          {/* tagline */}
          <div className="absolute bottom-10 left-8 right-8 z-10 text-white">
            <h2 className="font-display text-4xl font-bold leading-tight">
              Crafting Journeys, <span className="italic text-orange-300">the Circuit way.</span>
            </h2>
            <p className="mt-2 text-sm text-white/80 max-w-md">
              Admin console for Circuit Travels &amp; Holidays LLC — manage packages, bookings, visas &amp; more.
            </p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          {/* mobile logo */}
          {/* <div className="lg:hidden mb-8 flex justify-center">
            <img src={logo} alt="Circuit Travels" className="h-14 w-auto" />
          </div> */}

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0b1730]">
            Login to your account
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Manage packages, bookings, payments and enquiries from a single, secure dashboard.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-[#0b1730]">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={64}
                required
                placeholder="Enter your username"
                className="w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0b3763] focus:ring-2 focus:ring-[#0b3763]/10"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-[#0b1730]">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={128}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 pr-11 text-sm outline-none transition focus:border-[#0b3763] focus:ring-2 focus:ring-[#0b3763]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-lg text-[#6b7280] hover:text-[#0b3763]"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-2 flex justify-end">
                {/* <a href="#" className="text-xs font-semibold text-[#0b3763] hover:underline">
                  Forgot password?
                </a> */}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0b1730] py-3 text-sm font-semibold text-white shadow-[0_15px_30px_-15px_rgba(11,23,48,0.7)] transition hover:brightness-110 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Login
            </button>

            {/* <div className="flex items-center justify-center gap-2 text-[11px] text-[#6b7280]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                Protected by JWT auth · CSRF · HTTPS
              </span>
            </div> */}

            {/* <p className="text-center text-[11px] text-[#9ca3af] break-all">
              API: <code>{API_BASE_URL}</code>
            </p> */}
          </form>
        </div>
      </div>
    </div>
  );
}
