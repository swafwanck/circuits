import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Plane, ShieldCheck, Sparkles, Headphones, Globe2, ArrowRight,
  Compass, Heart, Building2, Palmtree, MapPin, TrendingUp, Phone,
} from "lucide-react";

import bghero from "./../assets/image/bg-hero.png";

import { WhatsAppIcon } from "./../components/site/WhatsAppIcon";
import { Header } from "./../components/site/Header";
import { Footer } from "./../components/site/Footer";
import { SectionHeader } from "./../components/site/Section";
import { PackageCard } from "./../components/site/PackageCard";
import { HeroSlider } from "./../components/site/HeroSlider";
import { GallerySlider } from "./../components/site/GallerySlider";
import { TestimonialsSlider } from "./../components/site/TestimonialsSlider";
import { useEnquiry } from "./../components/site/EnquiryProvider";
import { useHomePackages, useHomeDeals, useHomeActivities, useHomeHotels, useHomeVisas, useGallery } from "./../lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Circuit Travels — Curated Travel & Worldwide Visa Services" },
      { name: "description", content: "Hand-crafted travel packages, hotels, UAE activities and seamless visa support for 60+ countries — all under one roof." },
      { property: "og:title", content: "Circuit Travels — Curated Travel Journeys" },
      { property: "og:description", content: "Packages, deals, hotels, activities and worldwide visas." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { data: packages = [] } = useHomePackages();
  const { data: deals = [] } = useHomeDeals();
  const { data: activities = [] } = useHomeActivities();
  const { data: hotels = [] } = useHomeHotels();
  const { data: visas = [] } = useHomeVisas();
  const { data: galleryItems = [], isLoading: galleryLoading } = useGallery();
  const galleryTiles = galleryItems
    .flatMap((g) => g.images.map((src) => ({ src, label: g.place || g.title })))
    .slice(0, 8);


  const trending = packages.slice(0, 3);
  const topDeals = deals.slice(0, 4);
  const topActivities = activities.slice(0, 4);
  const topHotels = hotels.slice(0, 3);
  const topVisas = visas.slice(0, 6);
  const { open } = useEnquiry();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO — bento composition, no search bar */}
      {/* <section className="container-page pt-3 sm:pt-5"> */}
      <section className="w-full">
        <motion.div
          // initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          // className="overflow-hidden rounded-[1.25rem] sm:rounded-[2rem] shadow-premium"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          className="w-full"
        >
          <HeroSlider />
        </motion.div>
      </section>


      {/* GALLERY POSTER SLIDER */}
      < section className="container-page pb-15 sm:pb-24 pt-19" >
        {/* <div className="mb-6 sm:mb-10">
          <SectionHeader align="left" eyebrow="Poster Wall" title={<>Travel <span className="italic text-gradient-sunset">postcards</span> in motion</>} subtitle="A rotating showcase of the destinations we love — tap through the reel." />
        </div> */}
        < GallerySlider />
      </section >

      {/* TRENDING PACKAGES */}
      < section className="container-page pb-10 sm:pb-24 " >
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeader align="left" eyebrow="Packages" title="Curated Journeys for Every Explorer" subtitle="Premium travel experiences crafted for unforgettable memories." />
          <Link to="/packages" className="hidden md:inline-flex shrink-0 items-center gap-1 rounded-[14px] bg-secondary px-5 py-2.5 text-sm font-bold text-black hover:bg-sunset hover:text-white transition-colors">
            Packages <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {trending.map((p, i) => <PackageCard key={p.slug} pkg={p} index={i} />)}
        </div>

        <div className="mt-6 flex md:hidden justify-center">
          <Link to="/packages" className="inline-flex items-center gap-1 rounded-[14px] bg-secondary px-5 py-2.5 text-sm font-bold text-black hover:bg-sunset hover:text-white">
            Packages <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section >


      <section className="relative">
        <div className="absolute inset-0 bg-mesh blur-3xl opacity-70" />
        <div className="absolute top-24 -left-24 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-sky/10 blur-3xl animate-float" />
        <div className="absolute -top-10 right-0 h-72 w-72 sm:h-96 sm:w-96 rounded-full animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative container-page pt-5 sm:pt-5 pb-14 sm:pb-20">
          {/* <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-ocean-deep">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-sunset" /> Travel · Visa · Hotels · Activities
            </span>
            <h1 className="mt-4 sm:mt-5 font-display text-[1.6rem] xs:text-[2rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem] font-bold sm:leading-[1] text-ocean-deep break-words">
              Journeys, <span className="text-gradient-sunset italic">crafted</span>
              <br />for the <span className="text-gradient-ocean">wonderstruck</span>.
            </h1>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl">
              Hand-curated packages, exclusive deals, world-class hotels, UAE experiences and seamless visas — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              <a
                href="tel:+971502475643"
                className="rounded-full bg-sunset-gradient px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-glow hover:scale-[1.03] transition-transform inline-flex items-center gap-2"
              >
                <Phone className="h-4 w-4" /> Call Us
              </a>
              <a
                href="https://wa.me/971502475643"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-glow hover:scale-[1.03] transition-transform inline-flex items-center gap-2"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>


          </motion.div> */}

          {/* BENTO grid: slider + tiles */}
          <div className="mt-8 sm:mt-10 grid gap-3 sm:gap-4 md:gap-5 grid-cols-2 md:grid-cols-6 md:grid-rows-[auto_auto]">
            {/* <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
              className="col-span-2 md:col-span-4 md:row-span-2"
            >
              <HeroSlider />
            </motion.div> */}
            {/* <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="col-span-2 md:col-span-4 md:row-span-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-ocean-deep">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-sunset" /> Travel · Visa · Hotels · Activities
            </span>
            {/* <h1 className="mt-4 sm:mt-5 font-display text-[1.6rem] xs:text-[2rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem] font-bold sm:leading-[1] text-ocean-deep break-words"> */}
            {/* <h1 className="mt-3 sm:mt-4 font-display text-[1.35rem] xs:text-[1.6rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] text-ocean-deep break-words">
              Journeys, <span className="text-gradient-sunset">crafted</span>
              <br />for the wonderstruck.
            </h1> */}
            {/* <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl"> */}
            {/* <p className="mt-3 text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl">
              Hand-curated packages, exclusive deals, world-class hotels, UAE experiences and seamless visas — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              <a
                href="tel:+971502475643"
                className="rounded-full bg-sunset-gradient px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-glow hover:scale-[1.03] transition-transform inline-flex items-center gap-2"
              >
                <Phone className="h-4 w-4" /> Call Us
              </a>
              <a
                href="https://wa.me/971502475643"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-glow hover:scale-[1.03] transition-transform inline-flex items-center gap-2"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>


          </motion.div> */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative col-span-2 md:col-span-4 md:row-span-2 overflow-hidden rounded-[2rem] min-h-[550px]"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={bghero}
                  alt="Hero background"
                  className="h-full w-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 " />
              </div>

              {/* Hero Content */}
              <div className="relative z-10 flex h-full flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12">

                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-ocean-deep shadow">
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-sunset" />
                  Travel · Visa · Hotels · Activities
                </span>

                <h1 className="mt-4 font-display text-[1.5rem] sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-black">
                  Journeys,
                  <span className="text-gradient-sunset"> crafted</span>
                  <br />
                  for the wonderstruck.
                </h1>

                <p className="mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-slate-700 text-black">
                  Hand-curated packages, exclusive deals, world-class hotels,
                  UAE experiences and seamless visas — all in one place.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="tel:+971586416434"
                    className="inline-flex items-center gap-2 rounded-full bg-sunset-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
                  >
                    <Phone className="h-4 w-4" />
                    Call Us
                  </a>

                  <a href="https://wa.me/971562759994"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>

              </div>
            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
              className="col-span-2 md:col-span-2 relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-ocean-gradient p-5 sm:p-7 text-white "
            >
              <div className="absolute -top-16 -right-16 h-40 sm:h-48 w-40 sm:w-48 rounded-full" />
              <div className="relative">
                <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-black" />
                <h3 className="mt-3 font-display text-xl sm:text-2xl font-bold">Visa in your inbox</h3>
                <p className="mt-2 text-xs sm:text-sm text-white/85">60+ countries · Real humans · No paperwork pain.</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["🇦🇪 UAE", "🇬🇧 UK", "🇺🇸 US", "🇯🇵 Japan"].map((f) => (
                    <span key={f} className="rounded-full glass-dark px-2.5 py-1 text-[10px] font-medium">{f}</span>
                  ))}
                </div>
                <Link to="/visa" className="mt-5 inline-flex items-center gap-1 rounded-full bg-white text-ocean-deep px-4 py-2 text-xs font-bold hover:scale-105 transition-transform">
                  Apply now <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }}
              className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-sunset-gradient p-4 sm:p-6 text-white md:col-span-1 min-w-0"
            >
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] opacity-90">Live Deals</p>
              <p className="mt-1 font-display text-base sm:text-xl md:text-2xl font-bold leading-tight break-words">Flash offers weekly</p>
              <Link to="/deals" className="mt-3 inline-block text-xs font-bold underline underline-offset-4">View →</Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
              className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-mint-gradient p-4 sm:p-6 text-ocean-deep md:col-span-1 min-w-0"
            >
              <Compass className="h-5 w-5 sm:h-6 sm:w-6" />
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] opacity-80">UAE Activities</p>
              <p className="mt-1 font-display text-base sm:text-xl md:text-2xl font-bold leading-tight break-words">Book instantly</p>
              <Link to="/activities-uae" className="mt-3 inline-block text-xs font-bold underline underline-offset-4">View →</Link>
            </motion.div>
          </div>
        </div>
      </section >

      {/* DEALS STRIP */}
      < section className="container-page pb-16 pt-19 sm:pb-20" >
        <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br from-sunset via-coral to-ocean p-6 sm:p-10 md:p-12 text-white shadow-premium">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/20 blur-3xl animate-blob" />
          <div className="relative flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-6">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full glass-dark px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"><Heart className="h-3 w-3" /> Deals of the week</span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold">Flash offers, fresh drops.</h2>
              <p className="mt-2 text-sm sm:text-base text-white/85 max-w-md">Save up to 40% on hand-picked packages, hotels, visas & activities — refreshed every Monday.</p>
            </div>
            <Link to="/deals" className="rounded-[14px] bg-white text-black px-5 sm:px-6 py-3 text-sm font-bold shadow-premium hover:scale-105 transition-transform whitespace-nowrap">Deals →</Link>
          </div>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {topDeals.map((d) => (
              <Link key={d.slug} to="/deals/$slug" params={{ slug: d.slug }} className="group block overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={d.image} alt={d.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <span className="absolute top-2 left-2 rounded-full bg-white text-ocean-deep px-2 py-0.5 text-[10px] font-bold">{d.discount}</span>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">{d.category}</p>
                  <p className="mt-1 font-display text-sm sm:text-base font-bold leading-tight line-clamp-2">{d.title}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-lg sm:text-xl font-bold">${d.offerPrice}</span>
                    <span className="text-[12px] font-base line-through">${d.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section >

      {/* UAE ACTIVITIES */}
      < section className="container-page pb-16 sm:pb-24" >
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeader align="left" eyebrow="Activities in UAE" title={<>Do more than <span className=" text-gradient-sunset">sightsee</span></>} subtitle="Desert safaris, Burj Khalifa, yacht cruises & more." />
          <Link to="/activities-uae" className="hidden md:inline-flex shrink-0 items-center gap-1 rounded-[14px] bg-secondary px-5 py-2.5 text-sm font-bold text-black hover:bg-sunset hover:text-white">
            Activities <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {topActivities.map((a, i) => (
            <Link key={a.slug} to="/activities-uae/$slug" params={{ slug: a.slug }} className="group block overflow-hidden rounded-3xl bg-card shadow-glass hover:shadow-premium transition-all hover:-translate-y-1"
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={a.image} alt={a.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[11px] opacity-90 flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.city} · {a.duration}</p>
                  <h3 className="mt-1 font-display text-base sm:text-lg font-bold leading-tight line-clamp-2">{a.name}</h3>
                </div>
              </div>
              <div className="p-3 sm:p-4 flex flex-col gap-2">
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                  Skip-the-line entry, expert guide & instant confirmation — enjoy hassle-free {a.city} highlights.
                </p>
                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[12px] text-black line-through">${a.price}</p>
                    <p className="font-display text-lg sm:text-xl font-bold text-black leading-none">${a.offerPrice}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-semibold text-primary group-hover:bg-red-500 group-hover:text-white transition-all">View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex md:hidden justify-center">
          <Link to="/activities-uae" className="inline-flex items-center gap-1 rounded-[14px] bg-secondary px-5 py-2.5 text-sm font-bold text-black hover:bg-sunset hover:text-white">
            Activities <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section >

      {/* VISA SECTION — clean redesigned cards */}
      < section className="container-page pb-16 sm:pb-24" >
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeader align="left" eyebrow="Worldwide Visas" title={<>Visas made <span className="text-gradient-sunset">effortless</span></>} subtitle="60+ countries · Document checklist · Real-time status updates." />
          <Link to="/visa" className="hidden md:inline-flex shrink-0 items-center gap-1 rounded-[14px] bg-secondary px-5 py-2.5 text-sm font-bold text-black hover:bg-sunset hover:text-white">
            Visas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {topVisas.map((v) => (
            <Link
              key={v.slug}
              to="/visa/$slug"
              params={{ slug: v.slug }}
              className="group relative flex items-stretch gap-3 sm:gap-4 overflow-hidden rounded-2xl bg-card p-2.5 sm:p-3 shadow-glass hover:shadow-premium hover:-translate-y-0.5 transition-all"
            >
              {/* Left: text content */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1.5 sm:py-2 pl-1.5 sm:pl-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-base leading-none">{v.flag}</span>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold truncate">{v.type}</p>
                  </div>
                  <h3 className="mt-1 font-display text-base sm:text-lg font-bold text-ocean-deep leading-tight truncate">{v.country}</h3>
                  <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-1">
                    <span className="rounded-full bg-sky/40 text-ocean-deep px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold">⏱ {v.processing}</span>
                    <span className="rounded-full bg-secondary text-primary px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold">✓ {v.validity}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    {/* <p className="text-[9px] text-muted-foreground leading-none">starts from</p> */}
                    <p className="font-display text-base sm:text-lg font-bold text-ocean-deep leading-tight">${v.fee}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-red-500 text-white px-2.5 py-1 text-[10px] font-bold group-hover:scale-105 transition-transform">
                    Apply →
                  </span>
                </div>
              </div>

              {/* Right: image */}
              <div className="relative w-24 xs:w-28 sm:w-32 md:w-36 shrink-0 overflow-hidden rounded-xl">
                <img src={v.image} alt={v.country} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-tr from-ocean-deep/40 via-transparent to-transparent" />
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex md:hidden justify-center">
          <Link to="/visa" className="inline-flex items-center gap-1 rounded-[14px] bg-secondary px-5 py-2.5 text-sm font-bold text-black hover:bg-sunset hover:text-white">
            Visa <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section >

      {/* HOTELS */}
      < section className="container-page pb-16 sm:pb-24" >
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeader align="left" eyebrow="Stays" title={<>Iconic <span className="text-gradient-sunset">hotels</span> worldwide</>} subtitle="Handpicked stays from luxury icons to boutique gems." />
          <Link to="/hotels" className="hidden md:inline-flex shrink-0 items-center gap-1 rounded-[14px] bg-secondary px-5 py-2.5 text-sm font-bold text-black hover:bg-sunset hover:text-white">
            Hotels <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {topHotels.map((h) => (
            <Link key={h.slug} to="/hotels/$slug" params={{ slug: h.slug }} className="group block overflow-hidden rounded-3xl bg-card shadow-glass hover:shadow-premium transition-all hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={h.image} alt={h.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                {/* <span className="absolute top-3 left-3 rounded-full bg-white/95 text-ocean-deep px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-glass">★ Handpicked</span> */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[11px] opacity-90 flex items-center gap-1"><Building2 className="h-3 w-3" /> {h.city}, {h.country}</p>
                  <h3 className="mt-1 font-display text-lg font-bold leading-tight line-clamp-1">{h.name}</h3>
                </div>
              </div>
              <div className="p-3 sm:p-4 flex flex-col gap-2">
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                  Prime location, complimentary breakfast & free cancellation — a boutique stay in the heart of {h.city}.
                </p>
                {/* <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-secondary text-primary px-2 py-0.5 text-[10px] font-semibold">Free WiFi</span>
                  <span className="rounded-full bg-sky/50 text-ocean-deep px-2 py-0.5 text-[10px] font-semibold">Breakfast</span>
                  <span className="rounded-full bg-mint/60 text-ocean-deep px-2 py-0.5 text-[10px] font-semibold">Pay at hotel</span>
                </div> */}
                <div className="flex items-end justify-between gap-2 pt-1">
                  <div>
                    {/* <p className="text-[10px] text-muted-foreground">from</p> */}
                    <p className="font-display text-lg sm:text-xl font-bold text-black leading-none">${h.pricePerNight}<span className="text-[13px] font-sans font-bold text-black">/ night</span></p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-semibold text-primary group-hover:bg-red-500 group-hover:text-white transition-all">View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex md:hidden justify-center">
          <Link to="/hotels" className="inline-flex items-center gap-1 rounded-[14px] bg-secondary px-5 py-2.5 text-sm font-bold text-black hover:bg-sunset hover:text-white">
            Hotels <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </section >





      {/* ============================================================
    GALLERY SECTION
============================================================ */}

      <section className="container-page py-10 sm:py-14">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
          <SectionHeader
            align="left"
            eyebrow="Gallery"
            title={
              <>
                Moments from the{" "}
                <span className="text-gradient-sunset">road</span>
              </>
            }
            subtitle="A visual diary of the places we send our travellers."
          />

          {/* Desktop Gallery Button */}
          <Link
            to="/gallery"
            className="hidden shrink-0 items-center gap-1 rounded-[14px] bg-secondary px-5 py-2.5 text-sm font-bold text-black hover:bg-sunset hover:text-white md:inline-flex"
          >
            Gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ============================================================
      LOADING
  ============================================================ */}

        {galleryLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {Array.from({ length: 9}).map((_, i) => (
              <div
                key={`gallery-skeleton-${i}`}
                className="aspect-square animate-pulse rounded-2xl bg-muted sm:rounded-3xl"
              />
            ))}
          </div>
        ) : galleryTiles.length > 0 ? (
          <>
            {/* ========================================================
          GALLERY GRID

          IMPORTANT:
          slice(0, 8) means maximum 8 images.
      ======================================================== */}

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {galleryTiles.slice(0, 8).map((g, i) => (
                <Link
                  key={`${g.label}-${i}`}
                  to="/gallery"
                  className="group relative aspect-square overflow-hidden rounded-2xl shadow-glass sm:rounded-3xl"
                >
                  {/* Image */}
                  <img
                    src={g.src}
                    alt={g.label || `Gallery image ${i + 1}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Label */}
                  {g.label ? (
                    <span className="absolute bottom-3 left-3 font-display text-sm font-bold text-white sm:text-base">
                      {g.label}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>

            {/* If API returns fewer than 8 images */}
            {/* {galleryTiles.length < 8 && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Showing {galleryTiles.length} gallery images.
              </p>
            )} */}
          </>
        ) : (
          /* ============================================================
             EMPTY STATE
          ============================================================ */

          <p className="rounded-[10px] p-8 text-center text-base text-black">
            No Photos
          </p>
        )}

        {/* ============================================================
      MOBILE GALLERY BUTTON
  ============================================================ */}

        <div className="mt-6 flex justify-center md:hidden">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1 rounded-[14px] bg-secondary px-5 py-2.5 text-sm font-bold text-black hover:bg-sunset hover:text-white"
          >
            Gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>




      {/* WHY US */}
      < section className="container-page pb-16 sm:pb-24" >
        <SectionHeader eyebrow="Why Circuit Travels" title="Built around how you actually travel" />
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: Sparkles, title: "Hand-crafted", text: "No recycled itineraries. Designed by humans who've walked the streets.", g: "bg-sunset-gradient" },
            { icon: ShieldCheck, title: "Visa Included", text: "Documentation, embassy bookings, follow-up. We don't disappear after sign-up.", g: "bg-sunset-gradient" },
            { icon: Headphones, title: "24/7 On-trip", text: "WhatsApp support from a real person, every hour of your journey.", g: "bg-sunset-gradient" },
            { icon: Globe2, title: "Best Price Promise", text: "Find it cheaper elsewhere within 24h and we'll match — and gift you an upgrade.", g: "bg-sunset-gradient" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-3xl bg-card p-5 sm:p-6 shadow-glass hover:shadow-premium hover:-translate-y-1 transition-all">
              <div className={`grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-2xl ${f.g} text-white shadow-glow`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg sm:text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section >

      {/* TESTIMONIALS — slider */}
      < section className="bg-secondary/60 py-16 sm:py-24" >
        <div className="container-page">
          <SectionHeader eyebrow="Loved by travellers" title="Stories from our travellers. Here's a taste." />
          <div className="mt-8 sm:mt-12">
            <TestimonialsSlider />
          </div>
        </div>
      </section >

      {/* CTA */}
      < section className="container-page py-16 sm:py-20" >
        <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-hero p-8 sm:p-12 text-ocean-deep text-center">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sunset/30 blur-3xl animate-blob" />
          <div className="relative">
            <Palmtree className="h-8 w-8 mx-auto text-sunset" />
            <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold">Ready when you are.</h2>
            <p className="mt-3 text-sm sm:text-base text-ocean-deep/80 max-w-lg mx-auto">Tell us your dream — we'll turn it into a full itinerary + best-price quote within 24 hours.</p>
            <button
              onClick={() => open({ title: "Plan my trip", subtitle: "Share your details — we'll craft the perfect journey." })}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-sunset-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-glow hover:scale-105 transition-transform"
            >
              <Plane className="h-4 w-4" /> Start Planning
            </button>
          </div>
        </div>
      </section >

      <Footer />
    </div >
  );
}
