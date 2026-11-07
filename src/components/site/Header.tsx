import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { useEnquiry } from "./EnquiryProvider";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/packages", label: "Packages" },
  { to: "/deals", label: "Deals" },
  { to: "/activities-uae", label: "UAE Activities" },
  { to: "/visa", label: "Visa" },
  { to: "/hotels", label: "Hotels" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { open: openEnquiry } = useEnquiry();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-border/60 shadow-glass">
        <div className="container-page flex h-16 lg:h-20 items-center justify-between gap-3">

          {/* Logo */}
          <div className="shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden gap-2 lg:flex flex-1 items-center justify-center min-w-0">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="group gap-2 inline-flex items-center justify-center
                  px-2.5 xl:px-3
                  py-2
                  text-[13px] lg:text-[14px] xl:text-[15px]
                  font-bold
                  text-black
                  rounded-[15px]
                  whitespace-nowrap
                  transition-all
                  hover:bg-black
                  hover:text-white"
                activeProps={{
                  className:
                    "group inline-flex gapitems-center justify-center px-2.5 xl:px-3 py-2 text-[13px] lg:text-[14px] xl:text-[15px] font-bold rounded-[15px] bg-black text-sunset shadow-glass whitespace-nowrap",
                }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Button */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              onClick={() =>
                openEnquiry({
                  title: "Plan my trip",
                  subtitle: "Tell us where you want to go — we'll craft it.",
                })
              }
              className="rounded-[15px] bg-sunset-gradient px-5 py-2.5 text-base font-bold text-white shadow-glow transition-transform hover:scale-105 whitespace-nowrap"
            >
              Plan My Trip
            </button>
          </div>

          {/* Mobile + Tablet Hamburger */}
          <button
            className="lg:hidden relative grid h-10 w-10 place-items-center rounded-[10px] bg-black shrink-0"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 h-0.5 w-6 rounded-full bg-sunset transition-all duration-300 ${
                  open
                    ? "top-1/2 -translate-y-1/2 rotate-45"
                    : "top-0"
                }`}
              />

              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 rounded-full bg-sunset transition-all duration-300 ${
                  open ? "w-0 opacity-0" : "w-6 opacity-100"
                }`}
              />

              <span
                className={`absolute left-0 h-0.5 rounded-full bg-sunset transition-all duration-300 ${
                  open
                    ? "top-1/2 w-6 -translate-y-1/2 -rotate-45"
                    : "bottom-0 w-4"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[80] bg-ocean-deep/50 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="fixed top-0 right-0 z-[90] h-full w-[85%] max-w-sm bg-background shadow-premium lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <Logo />
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
                {nav.map((n, idx) => (
                  <motion.div
                    key={n.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      activeOptions={{ exact: n.to === "/" }}
                      className="block rounded-[15px] px-4 py-3.5 text-base font-bold transition-colors hover:bg-black hover:text-white"
                      activeProps={{
                        className:
                          "block rounded-[15px] px-4 py-3.5 text-base font-bold bg-black text-sunset",
                      }}
                    >
                      {n.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="border-t border-border p-5">
                <button
                  onClick={() => {
                    setOpen(false);
                    openEnquiry({
                      title: "Plan my trip",
                    });
                  }}
                  className="w-full rounded-[15px] bg-sunset-gradient px-5 py-3.5 text-base font-bold text-white shadow-glow"
                >
                  Plan My Trip
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}