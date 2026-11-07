import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 sm:mt-24 bg-black text-white">
      <div className="container-page py-12 sm:py-16 grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" aria-label="Circuit Travels & Holidays LLC" className="inline-flex flex-col leading-tight">
            <span className="font-display text-2xl font-bold tracking-tight text-white">
              Circuit <span className="text-accent">Travels</span>
            </span>
            <span className="mt-1 text-[11px] uppercase tracking-[0.28em] text-white/60">
              &amp; Holidays LLC
            </span>
          </Link>
          <p className="mt-4 text-sm text-white/70 max-w-xs">
            Curated journeys and seamless visa support. Built for travellers who care about the details.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="https://www.facebook.com/circuittravels" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-accent transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com/circuittravels" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-accent transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            {/* <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-sunset transition-colors">
              <Youtube className="h-4 w-4" />
            </a> */}
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/packages" className="hover:text-accent">Packages</Link></li>
            <li><Link to="/deals" className="hover:text-accent">Deals & Offers</Link></li>
            <li><Link to="/visa" className="hover:text-accent">Visa Services</Link></li>
            <li><Link to="/hotels" className="hover:text-accent">Hotels</Link></li>
            <li><Link to="/activities-uae" className="hover:text-accent">UAE Activities</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link to="/gallery" className="hover:text-accent">Gallery</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold">Get in touch</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-accent shrink-0" /> <span className="break-all">info@circuitholidays.com</span></li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-accent shrink-0" /> +971 56 2759 994</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" /> Head Office : 09 shabia - opp. Rich & fresh supermarket - Musaffah - ME9 - Abu Dhabi - United Arab Emirates</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" /> Branch Office : As Salam - 4 Ad Daqayiq St - Al Zahiyah - E16 02 - Abu Dhabi - United Arab Emirates</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60 text-center">
          <p>© {new Date().getFullYear()} Circuit Travels Travel. All rights reserved.</p>
          <p>Crafted for travellers who care about every detail.</p>
        </div>
      </div>
    </footer>
  );
}
