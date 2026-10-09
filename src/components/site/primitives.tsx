import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { inr, type UiTile } from "@/data/catalog";
import { useApp } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaImage } from "@/components/site/media";
import { toast } from "sonner";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-20", className)}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string | undefined;
  action?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:mb-12",
        align === "center"
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-[0.14em] text-secondary-foreground uppercase">
            <span className="size-1.5 rounded-full bg-highlight" aria-hidden />
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl leading-tight font-bold text-balance sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A browsable subcategory tile (Home → Services level). Links to the package list for that subcategory — matches OLD's SubCategorySection.jsx navigation target exactly (subcat -> package list, not a category page). */
export function TileCard({ tile, index = 0 }: { tile: UiTile; index?: number }) {
  return (
    <Reveal delay={Math.min(index * 0.05, 0.3)} className="h-full">
      <Link
        to="/packages/$subcatId"
        params={{ subcatId: tile.subcatId }}
        search={{ cid: tile.catId, title: tile.title }}
        className="hover-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
      >
        <MediaImage variant="card" src={tile.image} alt={tile.title} zoomOnHover />
        <div className="flex flex-1 items-center p-4 sm:p-5">
          <h3 className="line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary sm:text-base">
            {tile.title}
          </h3>
        </div>
      </Link>
    </Reveal>
  );
}

/** A package/service card within a subcategory's listing. "Add" calls the real server cart (pcapi/add_to_cart.php) directly from the grid to cut a tap versus OLD's detail-page-only flow — same endpoint, just invoked from one screen earlier. */
export function PackageCard({
  pkg,
  index = 0,
}: {
  pkg: {
    id: string;
    name: string;
    image: string;
    price: number;
    strikePrice?: number;
    discountPercent: number;
    subcatId: string;
    catId: string;
  };
  index?: number;
}) {
  const { addToCart, cart, user } = useApp();
  const inCart = cart.some((c) => c.productId === pkg.id);

  return (
    <Reveal delay={Math.min(index * 0.05, 0.3)} className="h-full">
      <article className="hover-lift group relative flex h-full flex-col rounded-3xl border border-border bg-card p-5 shadow-soft">
        <Link
          to="/package/$id"
          params={{ id: pkg.id }}
          search={{ subcatId: pkg.subcatId, cid: pkg.catId }}
          className="-mx-5 -mt-5 mb-4 block overflow-hidden rounded-t-3xl"
        >
          <MediaImage variant="card" src={pkg.image} alt={pkg.name} />
        </Link>
        <div className="mb-5">
          <h3 className="line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary">
            <Link
              to="/package/$id"
              params={{ id: pkg.id }}
              search={{ subcatId: pkg.subcatId, cid: pkg.catId }}
              className="after:absolute after:inset-0"
            >
              {pkg.name}
            </Link>
          </h3>
          {pkg.discountPercent > 0 && (
            <span className="mt-2 inline-block w-fit rounded-full bg-highlight px-2.5 py-0.5 text-xs font-bold text-highlight-foreground">
              {pkg.discountPercent}% OFF
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="font-display text-xl font-bold">{inr(pkg.price)}</p>
            {pkg.strikePrice && (
              <p className="text-xs text-muted-foreground line-through">{inr(pkg.strikePrice)}</p>
            )}
          </div>
          <Button
            variant={inCart ? "secondary" : "default"}
            className="relative z-10"
            onClick={async () => {
              if (!user) {
                toast.error("Please sign in to book a service");
                return;
              }
              await addToCart({
                productId: pkg.id,
                title: pkg.name,
                price: pkg.price,
                image: pkg.image,
              });
              toast.success(`${pkg.name} added to your booking`);
            }}
          >
            {inCart ? <Check className="size-4" /> : <Plus className="size-4" />}
            {inCart ? "Added" : "Add"}
          </Button>
        </div>
      </article>
    </Reveal>
  );
}

/** Loading placeholder with the exact footprint of a TileCard. */
export function TileCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="p-4 sm:p-5">
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

/** Loading placeholder with the exact footprint of a PackageCard. */
export function PackageCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="space-y-2 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <div className="flex items-end justify-between pt-6">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
  icon: Icon,
}: {
  title: string;
  body: string;
  action?: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
      {Icon && (
        <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-accent ring-1 ring-primary/10">
          <Icon className="size-6 text-primary" />
        </span>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
