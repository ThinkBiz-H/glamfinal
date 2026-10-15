import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { useHomeData } from "@/hooks/use-catalog";

const footerLink = "text-white/70 transition-colors hover:text-white";

export function Footer() {
  const { categories } = useHomeData();
  return (
    <footer className="mt-16 border-t border-neutral-800 bg-black text-neutral-400">
      {/* Upper Trust Strip */}
      <div className="border-b border-neutral-800/80 bg-neutral-950/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/5 text-cyan-400 border border-white/10 shrink-0">
              ✨
            </span>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Top 1% Experts</p>
              <p className="text-[11px] text-neutral-400">Rigorous skill testing</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/5 text-cyan-400 border border-white/10 shrink-0">
              🛡️
            </span>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Hospital Hygiene</p>
              <p className="text-[11px] text-neutral-400">Single-use sterile kits</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/5 text-cyan-400 border border-white/10 shrink-0">
              💎
            </span>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Original Brands</p>
              <p className="text-[11px] text-neutral-400">O3+, Rica & L'Oréal</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/5 text-cyan-400 border border-white/10 shrink-0">
              🔒
            </span>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Safe & Transparent</p>
              <p className="text-[11px] text-neutral-400">No hidden salon taxes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TheGlamRide" className="h-14 w-auto object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-xl font-bold tracking-tight text-white">
                TheGlamRide
              </span>
              <span className="text-xs text-neutral-400 font-medium tracking-wide">Luxury At-Home Salon & Spa</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Elevating at-home self care with certified beauty professionals, single-use mono-dose products, and transparent upfront pricing across India.
          </p>
          <div className="mt-6 flex gap-2">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#social"
                onClick={(e) => e.preventDefault()}
                aria-label="Social Link"
                className="grid size-9 place-items-center rounded-xl border border-white/15 bg-white/5 text-white transition-all duration-200 hover:bg-white/20 hover:scale-105"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-widest uppercase text-white">Popular services</h3>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link to="/services/$category" params={{ category: c.id }} className={footerLink}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-widest uppercase text-white">Company</h3>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
            <li>
              <Link to="/about" className={footerLink}>
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className={footerLink}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/faq" className={footerLink}>
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/support" className={footerLink}>
                Support & Helpdesk
              </Link>
            </li>
            <li>
              <Link to="/privacy" className={footerLink}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className={footerLink}>
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-widest uppercase text-white">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-xs sm:text-sm text-neutral-400">
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-cyan-400 shrink-0" />
              <span className="text-white select-all">infotheglamride@gmail.com</span>
            </li>
            <li>
              <p className="text-[11px] text-neutral-400">Available 7 days a week, 9:00 AM – 8:00 PM</p>
            </li>
            <li className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                Accepted Payments
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-neutral-300">
                <span className="rounded bg-white/10 px-2 py-0.5">UPI / GPay</span>
                <span className="rounded bg-white/10 px-2 py-0.5">Cards</span>
                <span className="rounded bg-white/10 px-2 py-0.5">Net Banking</span>
                <span className="rounded bg-white/10 px-2 py-0.5">Cash on Delivery</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-900 bg-black/90 px-5 py-6 text-center text-xs text-neutral-400 sm:px-8">
        © {new Date().getFullYear()} TheGlamRide Beauty Technologies. All rights reserved. Crafted with care in India.
      </div>
    </footer>
  );
}
