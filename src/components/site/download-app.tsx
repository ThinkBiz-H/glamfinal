import { Smartphone, CheckCircle, QrCode, Star, Sparkles } from "lucide-react";

export function DownloadApp() {
  return (
    <section aria-label="Download GlamRide App" className="w-full">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
        {/* Decorative Background Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/15 blur-[100px]" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Left Column: Info & Badges */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-white backdrop-blur-md uppercase mb-4">
              <Smartphone className="size-3.5 text-cyan-400" />
              <span>Mobile Experience</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Salon & Spa Luxury, <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-primary bg-clip-text text-transparent">
                Right in Your Pocket.
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-white/70 max-w-xl leading-relaxed">
              Download the official GlamRide mobile app for seamless appointments, live GPS tracking of your beautician, and exclusive subscriber perks.
            </p>

            {/* Benefit Bullets */}
            <div className="mt-6 space-y-3 text-xs sm:text-sm text-white/85">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="size-4 text-cyan-400 shrink-0" />
                <span>Book any service in under 60 seconds with instant confirmation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="size-4 text-cyan-400 shrink-0" />
                <span>Live real-time location tracking of your certified expert</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="size-4 text-cyan-400 shrink-0" />
                <span>Secure payments via UPI, Cards, Netbanking or Cash on Delivery</span>
              </div>
            </div>

            {/* App Store Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* Google Play Store Badge */}
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert("GlamRide mobile app is available on Google Play & iOS App Store!");
                }}
                className="group flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 shadow-lg backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105"
              >
                <svg className="size-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a1.99 1.99 0 0 1-.61-1.436V3.25c0-.563.228-1.077.609-1.436zm11.597 11.599l2.126 2.126-11.45 6.46 9.324-8.586zm2.126-2.826l3.14 1.77c.895.505.895 1.33 0 1.835l-3.14 1.77-2.338-2.338 2.338-2.037zm-2.126-2.827L5.882 1.174l11.45 6.46-2.126 2.126z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="text-[10px] uppercase tracking-wider text-white/60">GET IT ON</span>
                  <p className="text-sm font-bold text-white">Google Play</p>
                </div>
              </a>

              {/* Apple App Store Badge */}
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert("GlamRide mobile app is available on Google Play & iOS App Store!");
                }}
                className="group flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 shadow-lg backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105"
              >
                <svg className="size-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.93.04-2.09.63-2.76 1.41-.58.67-1.1 1.76-.96 2.82 1.05.08 2.15-.53 2.78-1.3" />
                </svg>
                <div className="text-left leading-none">
                  <span className="text-[10px] uppercase tracking-wider text-white/60">Download on the</span>
                  <p className="text-sm font-bold text-white">App Store</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Scan Card & Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-xs rounded-3xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-xl shadow-2xl">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-cyan-400 text-black shadow-md">
                <QrCode className="size-8" />
              </div>

              <h3 className="text-lg font-bold text-white">Scan to Download</h3>
              <p className="mt-1 text-xs text-white/70">
                Point your phone camera to download the GlamRide App instantly.
              </p>

              {/* QR Code graphic container */}
              <div className="my-5 mx-auto grid size-36 place-items-center rounded-2xl bg-white p-2.5 shadow-inner">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://theglamride.com"
                  alt="Download GlamRide App QR Code"
                  className="size-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-300">
                <Star className="size-4 fill-amber-300" />
                <span>4.8 Rating from 10k+ App Users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
