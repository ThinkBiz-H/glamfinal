import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { useHomeData } from "@/hooks/use-catalog";

const footerLink = "text-white/70 transition-colors hover:text-white";

export function Footer() {
  const { categories } = useHomeData();
  return (
    <footer className="mt-10 border-t border-white/10 bg-black text-white/70">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TheGlamRide" className="h-16 w-auto object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-xl font-bold tracking-tight text-white">
                TheGlamRide
              </span>
              <span className="text-xs text-white/60">Beauty At Home</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Salon-grade beauty and wellness rituals, delivered to your home by vetted professionals.
            Transparent pricing, single-use products, zero commute.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <span
                key={i}
                className="grid size-9 place-items-center rounded-xl border border-white/15 text-white transition-colors duration-200 hover:bg-white/10"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Popular services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
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
          <h3 className="text-sm font-semibold text-white">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
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
                Support
              </Link>
            </li>
            <li>
              <Link to="/privacy" className={footerLink}>
                Privacy policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className={footerLink}>
                Terms of service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Talk to us</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-white" /> infotheglamride@gmail.com
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-white/60 sm:px-8">
        © {new Date().getFullYear()} TheGlamRide Beauty Technologies. Crafted with care in India.
      </div>
    </footer>
  );
}
