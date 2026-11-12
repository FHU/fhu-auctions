import Image from "next/image";
import { brand } from "@/config/brand";

interface BrandLockupProps {
  /**
   * "white": on maroon/dark backgrounds. "maroon": on white/gray.
   * "auto": on theme surfaces (maroon in light theme, white in dark theme).
   */
  variant?: "white" | "maroon" | "auto";
  /** "lg" ~220px wide on large screens (fhu.edu header size); "sm" for compact spots */
  size?: "lg" | "sm";
  className?: string;
}

const LOGOS = {
  white: { src: "/brand/fhu-logo-white.png", width: 620, height: 176 },
  maroon: { src: "/brand/fhu-logo-maroon.png", width: 1145, height: 327 },
};

/**
 * Official FHU lockup + divider + sub-site label ("AUCTIONS").
 * The FHU logo is used as supplied (never recolored).
 */
export function BrandLockup({
  variant = "white",
  size = "lg",
  className = "",
}: BrandLockupProps) {
  const imgClass = size === "lg" ? "h-10 lg:h-[62px] w-auto" : "h-9 w-auto";
  const labelSize = size === "lg" ? "text-lg lg:text-2xl" : "text-lg";

  const logo = (v: "white" | "maroon", extra = "") => (
    <Image
      src={LOGOS[v].src}
      alt={brand.orgName}
      width={LOGOS[v].width}
      height={LOGOS[v].height}
      priority
      className={`${imgClass} ${extra}`}
    />
  );

  const colors = {
    white: { divider: "bg-white/60", label: "text-fhu-gold" },
    maroon: { divider: "bg-fhu-maroon/40", label: "text-fhu-maroon" },
    auto: { divider: "bg-base-content/30", label: "text-primary" },
  }[variant];

  return (
    <span className={`flex items-center gap-3 lg:gap-4 ${className}`}>
      {variant === "auto" ? (
        <>
          {logo("maroon", "fhu-on-light")}
          {logo("white", "fhu-on-dark")}
        </>
      ) : (
        logo(variant)
      )}
      <span
        aria-hidden="true"
        className={`self-stretch w-px my-1 ${colors.divider}`}
      />
      <span className={`fhu-lockup-label ${labelSize} ${colors.label}`}>
        {brand.siteLabel}
      </span>
    </span>
  );
}
