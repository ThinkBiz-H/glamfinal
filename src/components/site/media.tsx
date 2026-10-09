import { useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * One frame per image role, so every image in the app is sized the same way:
 * the frame owns the shape (aspect ratio / height + overflow + rounding) and
 * the image only fits inside it. API images vary in size, so product imagery
 * uses `object-contain` (never cropped or stretched); only full-bleed banners
 * use `object-cover`.
 */
const variants = {
  /** Full-bleed hero banner — fills its positioned parent. */
  banner: { frame: "h-full bg-neutral-900", img: "object-cover" },
  /** Service / package / subcategory cards. */
  card: { frame: "aspect-4/3", img: "object-contain p-2" },
  /** Category tiles. */
  square: { frame: "aspect-square", img: "object-contain p-1.5" },
  /** Package / service detail hero image. */
  detail: { frame: "aspect-4/3", img: "object-contain p-3 sm:p-4" },
  /** Small list thumbnails (cart, bookings). Size it with `className`, e.g. `size-14`. */
  thumb: { frame: "aspect-square rounded-xl border border-border", img: "object-contain p-0.5" },
} as const;

export type MediaVariant = keyof typeof variants;

type MediaImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "className" | "src"> & {
  src?: string | null | undefined;
  alt: string;
  variant: MediaVariant;
  /** Classes for the frame (rounding, size, responsive overrides). */
  className?: string | undefined;
  /** Extra classes for the <img> itself. */
  imgClassName?: string | undefined;
  /** Subtle zoom when a parent `.group` is hovered; padding keeps it inside the frame. */
  zoomOnHover?: boolean | undefined;
  /** Rendered when there's no src or the image fails to load. */
  fallback?: ReactNode | undefined;
};

export function MediaImage({
  src,
  alt,
  variant,
  className,
  imgClassName,
  zoomOnHover = false,
  fallback,
  loading = "lazy",
  ...imgProps
}: MediaImageProps) {
  // Tracks which src failed, so a new src gets a fresh attempt automatically.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const v = variants[variant];
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <span className={cn("relative block w-full overflow-hidden bg-muted/60", v.frame, className)}>
      {showImage ? (
        <img
          src={src ?? undefined}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={() => setFailedSrc(src ?? null)}
          className={cn(
            "absolute inset-0 h-full w-full",
            v.img,
            zoomOnHover && "transition-transform duration-500 group-hover:scale-105",
            imgClassName,
          )}
          {...imgProps}
        />
      ) : (
        (fallback ?? (
          <span
            role="img"
            aria-label={alt || "Image unavailable"}
            className="absolute inset-0 grid place-items-center text-muted-foreground/60"
          >
            <ImageOff className="size-6" />
          </span>
        ))
      )}
    </span>
  );
}
