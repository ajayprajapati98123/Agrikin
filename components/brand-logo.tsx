import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  className?: string;
  href?: string;
  variant?: "dark" | "light";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showWordmark = true,
  className = "",
  href = "/",
  variant = "light",
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

  const isLight = variant === "light";

  const logoGraphic = (
    <div className={`relative flex items-center gap-3 ${className}`}>
      {/* Precision Original Vector Logo: Farmer + Nature + Water + Sun + Crops */}
      <div className={`relative ${iconDimensions} rounded-2xl bg-gradient-to-br from-[#0A1A14] via-[#0E2B21] to-[#D4AF37]/30 p-1 shadow-md shadow-black/40 flex items-center justify-center overflow-hidden border border-[#D4AF37]/40 group`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Radiant Golden Sunrise */}
          <circle cx="50" cy="46" r="18" fill="#FBBF24" opacity="0.95" />
          <path d="M50 20V14M50 78V72M20 46H14M86 46H80M27 23L23 19M77 69L73 65M77 23L81 19M27 69L23 73" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />

          {/* Majestic Mountain Silhouette */}
          <path d="M12 70L38 40L54 58L72 38L92 70Z" fill="#064E3B" opacity="0.7" />
          <path d="M38 40L44 48L50 43L54 58L42 54Z" fill="#A7F3D0" opacity="0.5" />

          {/* Gentle Water Ripple / River Stream */}
          <path
            d="M20 78C32 74 42 82 58 77C72 72 82 79 92 76"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Lush Green Crop Field Terraces */}
          <path
            d="M10 84C28 78 45 88 65 82C80 77 92 84 94 85V95H10V84Z"
            fill="#15803D"
          />
          <path
            d="M10 90C30 85 55 94 75 88C85 85 92 88 94 89V95H10V90Z"
            fill="#166534"
          />

          {/* Sprouting Sacred Seedling / Leaf */}
          <path
            d="M50 68C50 56 62 48 68 46C68 56 60 68 50 68Z"
            fill="#4ADE80"
          />
          <path
            d="M50 68C50 58 40 50 34 49C34 58 42 68 50 68Z"
            fill="#22C55E"
          />

          {/* Central Farmer Silhouette + Technological Spark */}
          <circle cx="50" cy="44" r="5" fill="#FEF3C7" />
          <path
            d="M42 43C42 41 46 38 50 38C54 38 58 41 58 43L62 45H38L42 43Z"
            fill="#B45309"
          />
          <path
            d="M44 50C44 48 47 47 50 47C53 47 56 48 56 50V56H44V50Z"
            fill="#FEF3C7"
          />
        </svg>

        {/* Subtle Tech Glow Spark */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping opacity-75" />
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <span
            className={`font-extrabold tracking-tight ${wordmarkSize} font-brand select-none leading-none ${
              isLight ? "text-[#FAF7F0]" : "text-[#071411]"
            }`}
            style={{
              letterSpacing: "-0.03em",
            }}
          >
            ȺցɾìҠìղ
          </span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] mt-1">
            Agri-Tech India
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
