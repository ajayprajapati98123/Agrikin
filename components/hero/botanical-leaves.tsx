"use client";

import React from "react";

export const BotanicalLeaf: React.FC<{
  className?: string;
  size?: number;
  rotation?: number;
  flip?: boolean;
  blur?: boolean;
  opacity?: number;
  delay?: string;
}> = ({
  className = "",
  size = 64,
  rotation = 0,
  flip = false,
  blur = false,
  opacity = 0.9,
  delay = "0s",
}) => {
  return (
    <div
      className={`pointer-events-none select-none transition-transform duration-1000 ${className}`}
      style={{
        width: size,
        height: size * 0.75,
        transform: `rotate(${rotation}deg) ${flip ? "scaleX(-1)" : ""}`,
        filter: blur ? "blur(2px) drop-shadow(0 15px 25px rgba(0,0,0,0.65))" : "drop-shadow(0 12px 20px rgba(0,0,0,0.5))",
        opacity,
        animationDelay: delay,
      }}
    >
      <svg
        viewBox="0 0 100 75"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#183D1B" />
            <stop offset="35%" stopColor="#2E6830" />
            <stop offset="70%" stopColor="#4D9344" />
            <stop offset="100%" stopColor="#7EBF58" />
          </linearGradient>
          <linearGradient id="leafRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#82C785" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1E4720" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Leaf Blade Outer Surface */}
        <path
          d="M8,68 C18,36 45,14 94,6 C86,42 60,66 8,68 Z"
          fill="url(#leafGrad)"
          stroke="url(#leafRim)"
          strokeWidth="1.2"
        />

        {/* Leaf Center Midrib (Main Vein) */}
        <path
          d="M8,68 Q46,42 94,6"
          stroke="#9EE387"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Secondary Lateral Veins */}
        <path
          d="M26,56 Q38,48 48,46 M38,46 Q54,36 66,33 M54,34 Q70,22 80,18"
          stroke="#BFF2AE"
          strokeWidth="0.85"
          strokeLinecap="round"
          strokeOpacity="0.55"
        />
        <path
          d="M30,59 Q24,51 22,46 M44,48 Q38,40 36,34 M60,36 Q52,28 50,22"
          stroke="#BFF2AE"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />
      </svg>
    </div>
  );
};
