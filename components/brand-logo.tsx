import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  className?: string;
  href?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showWordmark = true,
  className = "",
  href = "/",
}) => {
  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  }[size];

  const wordmarkSize = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-5xl",
  }[size];

  const logoGraphic = (
    <div className={`relative flex items-center gap-3 ${className}`}>
      {/* Golden Leaf Emblem matching Reference */}
      <div className={`relative ${iconDimensions} rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#B8860B] to-[#7A4A10] p-0.5 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center overflow-hidden border border-[#D4AF37]/40 group`}>
        <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#0C1E1A] to-[#071411] flex items-center justify-center p-1.5">
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full text-[#D4AF37] drop-shadow transition-transform duration-300 group-hover:scale-110 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Elegant double leaf motif */}
            <path d="M12 2C6.48 2 2 6.48 2 12c0 2.21.72 4.25 1.93 5.91C4.3 16.5 5 15.34 6 14.5c2.5-2.1 6.5-2.2 9-0.5 1.8 1.2 2.8 3.3 2.6 5.5 2.63-1.84 4.4-4.94 4.4-8.5 0-4.97-3.58-9-8-9zm-1 14.5c-2.07 0-3.75-1.68-3.75-3.75S8.93 9 11 9s3.75 1.68 3.75 3.75-1.68 3.75-3.75 3.75z" opacity="0.3"/>
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L3.8 21.4c-.11.27.02.57.29.68.1.04.2.04.3.01.21-.06.74-.25 1.55-.59 3.89-1.62 9.06-4.5 11.06-13.5z" fill="url(#goldGrad)"/>
            <path d="M17 8C10.5 8.5 7.5 13 6.5 17c2.5-1 5.5-1.5 8-1.5 1.5 0 2.8.2 4 .5-.3-2.5-.7-5.5-1.5-8z" fill="#F5DE98" opacity="0.9"/>
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF6DD"/>
                <stop offset="50%" stopColor="#D4AF37"/>
                <stop offset="100%" stopColor="#996515"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-black tracking-tight text-white font-brand select-none leading-none ${wordmarkSize}`}
              style={{ letterSpacing: "-0.02em" }}
            >
              Krishi Connect
            </span>
            <span className="text-[10px] font-bold text-[#D4AF37] opacity-75 hidden sm:inline">
              (ȺցɾìҠìղ)
            </span>
          </div>
          <span className="text-[10px] tracking-wider font-medium text-[#D4AF37] opacity-90 mt-1">
            Farms Today · Stronger Tomorrow
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-95 transition-opacity">
        {logoGraphic}
      </Link>
    );
  }

  return logoGraphic;
};
