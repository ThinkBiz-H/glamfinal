import { ShieldCheck, Sparkles, HeartHandshake, CircleDollarSign, CheckCircle2 } from "lucide-react";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    highlight: "Top 1% Certified Experts",
    description:
      "Every beauty therapist undergoes rigorous identity verification, police background checks, and trade skill audits before visiting your home.",
    accent: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    pill: "bg-blue-50 text-blue-700",
  },
  {
    icon: Sparkles,
    title: "Premium Products",
    highlight: "100% Sealed Mono-dose Kits",
    description:
      "We strictly use authentic top-tier brands (O3+, Rica, L'Oréal). Single-use packaging is opened in front of you for guaranteed purity and zero dilution.",
    accent: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    pill: "bg-amber-50 text-amber-700",
  },
  {
    icon: HeartHandshake,
    title: "Safe & Hygienic",
    highlight: "Zero-Mess Guarantee",
    description:
      "Hospital-standard sterilization with disposable bed covers, sanitary gloves, sanitized tools, and complete post-service clean up.",
    accent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    pill: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: CircleDollarSign,
    title: "Transparent Pricing",
    highlight: "No Hidden Charges",
    description:
      "The price shown is the final price you pay. No extra travel charges, no surprise taxes, and transparent duration for every single treatment.",
    accent: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    pill: "bg-purple-50 text-purple-700",
  },
];

const STATS = [
  { value: "50,000+", label: "Happy Bookings" },
  { value: "4.8 ★", label: "Average Client Rating" },
  { value: "100%", label: "Single-Use Kits" },
  { value: "60 Mins", label: "Express Slot Available" },
];

export function WhyChooseUs() {
  return (
    <section aria-label="Why Choose GlamRide" className="w-full">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-widest text-primary uppercase mb-2">
          The GlamRide Standard
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
          Why Choose GlamRide?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-neutral-600">
          We bring high-end salon and spa excellence right to your doorstep with uncompromising hygiene and perfection.
        </p>
      </div>

      {/* 4 Feature Pillars */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/40"
            >
              <div>
                <div
                  className={`inline-grid size-14 place-items-center rounded-2xl border transition-transform duration-300 group-hover:scale-110 ${pillar.accent}`}
                >
                  <Icon className="size-7" />
                </div>

                <div className="mt-5">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider mb-2 ${pillar.pill}`}
                  >
                    {pillar.highlight}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-neutral-900 pt-4 border-t border-neutral-100">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>100% Quality Assurance</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Luxury Stats Bar */}
      <div className="mt-10 sm:mt-14 rounded-3xl border border-neutral-200/80 bg-gradient-to-r from-neutral-900 via-neutral-950 to-black p-6 sm:p-10 text-white shadow-xl">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {STATS.map((stat, i) => (
            <div key={i} className={i > 0 ? "pt-4 sm:pt-0" : ""}>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-1.5 text-xs sm:text-sm font-medium text-white/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
