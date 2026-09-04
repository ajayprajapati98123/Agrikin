import React from "react";

export const DhartiMaaAvatar: React.FC<{ size?: "sm" | "md" | "lg" | "xl"; className?: string }> = ({
  size = "md",
  className = "",
}) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={`relative ${sizeMap[size]} rounded-full overflow-hidden shadow-lg border-2 border-emerald-400 bg-gradient-to-br from-emerald-900 via-teal-800 to-green-700 flex items-center justify-center ${className}`}>
      {/* SVG Vector Artwork: Mother Earth + Nature + Sprout */}
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dhartiBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064E3B" />
            <stop offset="50%" stopColor="#047857" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="auraGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Halo / Aura */}
        <circle cx="50" cy="46" r="38" fill="url(#auraGold)" opacity="0.25" />

        {/* Earth Silhouette */}
        <circle cx="50" cy="50" r="34" fill="url(#dhartiBg)" />
        
        {/* Soft Earth Continents */}
        <path d="M35 38C40 34 46 36 50 32C55 28 62 30 68 35C65 42 60 48 55 52C48 56 38 52 35 45Z" fill="#047857" opacity="0.6" />

        {/* Serene Divine Face of Mother Earth */}
        <circle cx="50" cy="46" r="16" fill="#FDF2E9" />
        
        {/* Crown of Wheat & Leaves */}
        <path d="M36 38C38 32 44 30 50 30C56 30 62 32 64 38C60 36 55 35 50 35C45 35 40 36 36 38Z" fill="#15803D" />
        <circle cx="50" cy="28" r="3.5" fill="#FBBF24" />
        {/* Tilak / Bindi */}
        <circle cx="50" cy="42" r="1.5" fill="#DC2626" />

        {/* Eyes (Gentle, Meditative) */}
        <path d="M44 46C45 48 47 48 48 46" stroke="#451A03" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M52 46C53 48 55 48 56 46" stroke="#451A03" strokeWidth="1.2" strokeLinecap="round" />
        {/* Gentle Smile */}
        <path d="M47 52C48 54 52 54 53 52" stroke="#B91C1C" strokeWidth="1.2" strokeLinecap="round" />

        {/* Sprouting Golden Leaf / Nurturing Hands */}
        <path d="M50 64C42 64 34 72 32 82C44 82 56 78 68 82C66 72 58 64 50 64Z" fill="#22C55E" />
        <path d="M50 60L50 74" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 66C54 62 60 62 62 64C62 68 56 70 50 70" fill="#86EFAC" />
        <path d="M50 68C46 64 40 64 38 66C38 70 44 72 50 72" fill="#4ADE80" />
      </svg>
    </div>
  );
};
