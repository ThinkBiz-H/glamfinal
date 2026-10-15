import { Star, ShieldCheck, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const REVIEWS = [
  {
    id: 1,
    name: "Pooja Sharma",
    location: "Vasant Vihar, New Delhi",
    rating: 5,
    service: "O3+ Shine & Glow Facial + Rica Waxing",
    date: "Verified booking · 3 days ago",
    comment:
      "The beautician arrived exactly on time with a sealed kit. She opened all single-use sachets right in front of me. The facial glow was better than my regular salon, and I didn't have to deal with traffic!",
    avatar: "PS",
  },
  {
    id: 2,
    name: "Ananya Deshmukh",
    location: "Bandra West, Mumbai",
    rating: 5,
    service: "Korean Manicure & Pedicure Ritual",
    date: "Verified booking · 1 week ago",
    comment:
      "Absolute bliss! The foot massage was heavenly, and she left my living room spotless. Having a full luxury spa session at home while my baby napped was life-changing.",
    avatar: "AD",
  },
  {
    id: 3,
    name: "Meera Krishnan",
    location: "Indiranagar, Bengaluru",
    rating: 5,
    service: "Platinum Karwa Chauth Package",
    date: "Verified booking · 2 weeks ago",
    comment:
      "Booked the package for a family wedding function. Saved almost 50% compared to local high-end salons and the service quality was five-star. Truly professional and gentle.",
    avatar: "MK",
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    location: "Sector 54, Gurugram",
    rating: 5,
    service: "Full Body Waxing & Detan",
    date: "Verified booking · 4 days ago",
    comment:
      "Rica waxing was virtually painless! The therapist wore sterile gloves, used clean disposable sheets, and took proper care throughout. Will definitely book again.",
    avatar: "SK",
  },
];

export function CustomerReviews() {
  return (
    <section aria-label="Customer Reviews" className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-10">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold tracking-widest text-emerald-700 uppercase mb-2">
            Real Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
            Loved by 50,000+ Happy Women
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-xl">
            Read verified reviews from clients who enjoy 5-star salon pampering in the comfort of home.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-neutral-200/80 bg-white px-4 py-2.5 shadow-sm">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-sm font-extrabold text-neutral-900">4.8 / 5.0</span>
          <span className="text-xs text-neutral-500">(12,000+ ratings)</span>
        </div>
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        className="pb-12"
      >
        {REVIEWS.map((review) => (
          <SwiperSlide key={review.id} className="h-auto">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-lift hover:border-primary/30">
              <div>
                {/* Header: Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="size-6 text-neutral-200" />
                </div>

                {/* Service Tag */}
                <span className="inline-block rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-800 mb-3 line-clamp-1">
                  {review.service}
                </span>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic mb-6">
                  "{review.comment}"
                </p>
              </div>

              {/* Author footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <div className="grid size-10 place-items-center rounded-full bg-neutral-900 font-bold text-xs text-white">
                  {review.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                      {review.name}
                    </p>
                    <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-neutral-500 truncate">{review.location}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
