"use client";

import React, { useState, useRef } from "react";
import { Sun, Droplets, Play, Pause } from "lucide-react";

export const AgriculturalAnimatedHero: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[460px] lg:h-[560px] rounded-3xl overflow-hidden shadow-2xl border-2 border-cyan-500/30 group select-none bg-[#041E27]"
    >
      {/* 1. Base Real Photographic Image with Cinematic Ambient Zoom & Pan */}
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-out ${
          isPlaying ? "animate-[pulse_10s_ease-in-out_infinite]" : ""
        }`}
        style={{
          transform: `scale(${isPlaying ? 1.08 : 1.02}) translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: "transform 0.4s ease-out",
        }}
      >
        <img
          src="/images/hero-farmer.jpg"
          alt="Indian Farmer in lush agricultural field at sunrise"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. Animated Sunrise Sunbeam Flare */}
      <div
        className={`absolute -top-10 -left-10 w-96 h-96 pointer-events-none rounded-full bg-gradient-to-br from-yellow-300/40 via-amber-400/20 to-transparent blur-3xl ${
          isPlaying ? "animate-pulse" : ""
        }`}
        style={{ animationDuration: "4s" }}
      />

      {/* 3. Shimmering Sunlight Rays Across the Horizon */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div
          className={`w-[200%] h-full bg-gradient-to-r from-transparent via-cyan-200/20 to-transparent -skew-x-12 ${
            isPlaying ? "animate-[shimmer_8s_linear_infinite]" : ""
          }`}
        />
      </div>

      {/* 4. Drifting Morning Mist & Atmospheric Clouds */}
      <div
        className={`absolute top-16 left-0 right-0 h-36 bg-gradient-to-b from-white/20 via-cyan-100/10 to-transparent pointer-events-none blur-xl ${
          isPlaying ? "animate-[pulseSlow_6s_ease-in-out_infinite]" : ""
        }`}
      />

      {/* 5. Water Canal Glistening Highlight Layer */}
      <div
        className={`absolute bottom-6 left-4 w-64 h-32 bg-gradient-to-tr from-cyan-400/35 to-transparent rounded-full blur-2xl pointer-events-none ${
          isPlaying ? "animate-pulse" : ""
        }`}
        style={{ animationDuration: "3s" }}
      />

      {/* 6. Floating Golden Pollen & Dew Particles */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-yellow-300 opacity-80 shadow-[0_0_8px_#fde047] animate-bounce [animation-duration:3s]" />
          <span className="absolute top-1/3 left-1/2 w-2 h-2 rounded-full bg-cyan-200 opacity-70 shadow-[0_0_10px_#a5f3fc] animate-pulse [animation-duration:4s]" />
          <span className="absolute top-1/2 left-1/4 w-1.5 h-1.5 rounded-full bg-yellow-400 opacity-90 shadow-[0_0_8px_#facc15] animate-bounce [animation-duration:5s]" />
          <span className="absolute top-2/3 left-2/3 w-2 h-2 rounded-full bg-cyan-300 opacity-80 shadow-[0_0_10px_#67e8f9] animate-pulse [animation-duration:3.5s]" />
          <span className="absolute top-1/2 right-1/4 w-1.5 h-1.5 rounded-full bg-yellow-300 opacity-85 shadow-[0_0_8px_#fde047] animate-bounce [animation-duration:4.5s]" />
        </div>
      )}

      {/* 7. Subtle Vignette & Natural Contrast Gradients */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#041E27]/90 via-transparent to-black/20" />

      {/* 8. Interactive Floating Agricultural Badges */}
      {/* Badge 1: Sunrise & Golden Hour */}
      <div
        className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-yellow-400/40 text-[11px] text-yellow-200 font-semibold flex items-center gap-1.5 shadow-lg transition-transform group-hover:scale-105"
      >
        <Sun className="w-3.5 h-3.5 text-yellow-400 animate-spin [animation-duration:12s]" />
        <span>Golden Sunrise • Prime Photosynthesis Window</span>
      </div>

      {/* Badge 2: Canal Water Flow */}
      <div
        className="absolute bottom-16 left-6 hidden sm:flex items-center gap-2 bg-[#083344]/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-cyan-400/40 text-xs text-white shadow-xl"
      >
        <Droplets className="w-4 h-4 text-cyan-400 animate-bounce [animation-duration:2s]" />
        <div>
          <div className="font-bold text-cyan-200">Fresh Mountain Canal</div>
          <div className="text-[10px] text-cyan-100/70">Gravity Feed Irrigation Active</div>
        </div>
      </div>

      {/* Badge 3: Crop Vigor */}
      <div
        className="absolute bottom-6 right-6 flex items-center gap-2 bg-[#083344]/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-cyan-400/50 text-xs text-white shadow-xl"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        <div>
          <div className="font-bold text-cyan-200">Kisan & Healthy Crops</div>
          <div className="text-[10px] text-cyan-100/70">Vegetative Stage • Disease Free</div>
        </div>
      </div>

      {/* 9. Live Animation Controls Pill */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[11px] text-white">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-1 hover:text-yellow-300 transition-colors p-1"
          title={isPlaying ? "Pause Ambient Motion" : "Resume Ambient Motion"}
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{isPlaying ? "Live Motion" : "Paused"}</span>
        </button>
      </div>
    </div>
  );
};