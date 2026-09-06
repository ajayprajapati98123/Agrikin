"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AgriculturalAnimatedHero } from "../components/hero/agricultural-animated-hero";
import { BotanicalLeaf } from "../components/hero/botanical-leaves";
import { DhartiMaaAvatar } from "../components/dharti-maa/dharti-maa-avatar";
import { DhartiMaaChatModal } from "../components/dharti-maa/dharti-maa-chat-modal";
import { useLanguage } from "../lib/i18n/i18n-context";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  Sprout,
  ScanEye,
  Building2,
  Droplets,
  CloudSun,
  Activity,
  CheckCircle2,
  TrendingUp,
  MapPin,
} from "lucide-react";

export default function HomePage() {
  const { language, t } = useLanguage();
  const [dhartiMaaOpen, setDhartiMaaOpen] = useState(false);

  const sixFeatures = [
    {
      id: "krishi-connect",
      title: t("feature1Title"),
      desc: t("feature1Desc"),
      icon: "🌾",
      route: "/krishi-connect",
      badge: "Marketplace",
      color: "from-[#0A1612] via-[#0E241E] to-[#07110D]",
      bgLight: "bg-[#FFFEFD]",
      border: "border-[#EAE3D5] hover:border-[#D4AF37]/70",
      btnText: "Find Traders",
    },
    {
      id: "detections",
      title: t("feature2Title"),
      desc: t("feature2Desc"),
      icon: "🔬",
      route: "/detections",
      badge: "Vision AI",
      color: "from-[#0A1612] via-[#0E241E] to-[#07110D]",
      bgLight: "bg-[#FFFEFD]",
      border: "border-[#EAE3D5] hover:border-[#D4AF37]/70",
      btnText: "Run Diagnostic",
    },
    {
      id: "govt-schemes",
      title: t("feature3Title"),
      desc: t("feature3Desc"),
      icon: "🏛️",
      route: "/govt-schemes",
      badge: "Direct Subsidies",
      color: "from-[#0A1612] via-[#0E241E] to-[#07110D]",
      bgLight: "bg-[#FFFEFD]",
      border: "border-[#EAE3D5] hover:border-[#D4AF37]/70",
      btnText: "Check Eligibility",
    },
    {
      id: "farming-methods",
      title: t("feature4Title"),
      desc: t("feature4Desc"),
      icon: "💧",
      route: "/farming-methods",
      badge: "Water & Efficiency",
      color: "from-[#0A1612] via-[#0E241E] to-[#07110D]",
      bgLight: "bg-[#FFFEFD]",
      border: "border-[#EAE3D5] hover:border-[#D4AF37]/70",
      btnText: "Learn Irrigation",
    },
    {
      id: "cropify",
      title: t("feature5Title"),
      desc: t("feature5Desc"),
      icon: "🌱",
      route: "/cropify",
      badge: "Yield Optimizer",
      color: "from-[#0A1612] via-[#0E241E] to-[#07110D]",
      bgLight: "bg-[#FFFEFD]",
      border: "border-[#EAE3D5] hover:border-[#D4AF37]/70",
      btnText: "Recommend Crops",
    },
    {
      id: "weather",
      title: t("feature6Title"),
      desc: t("feature6Desc"),
      icon: "🌦️",
      route: "/weather",
      badge: "Agri-Advisory",
      color: "from-[#0A1612] via-[#0E241E] to-[#07110D]",
      bgLight: "bg-[#FFFEFD]",
      border: "border-[#EAE3D5] hover:border-[#D4AF37]/70",
      btnText: "Live Forecast",
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-24 pb-20">
      {/* 1. HERO SECTION (CHARCOAL + GOLD AMBIENCE WITH PRESERVED SECOND WEBSITE UI) */}
      <section className="relative pt-8 sm:pt-14 pb-0 bg-gradient-to-b from-[#060C0A] via-[#081410] to-[#0B1A15] text-white overflow-hidden">
        {/* Ambient Golden Sunburst Halo Behind Right Visual (from Reference Image) */}
        <div className="absolute right-[-40px] lg:right-6 top-1/2 -translate-y-1/2 w-[520px] sm:w-[660px] lg:w-[740px] h-[520px] sm:h-[660px] lg:h-[740px] rounded-full border border-[#D4AF37]/35 pointer-events-none -z-0 shadow-[0_0_90px_rgba(212,175,55,0.12)]" />
        <div className="absolute right-[-20px] lg:right-16 top-1/4 w-[500px] sm:w-[620px] h-[500px] sm:h-[620px] bg-gradient-to-br from-[#F5DE98]/22 via-[#D4AF37]/12 to-transparent rounded-full blur-3xl pointer-events-none -z-0 animate-pulseSun" />

        {/* Ambient Distant Dawn Glow */}
        <div className="absolute left-[-10%] bottom-0 w-[480px] h-[400px] bg-gradient-to-t from-emerald-950/25 via-[#D4AF37]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Atmospheric Floating Botanical Leaves for Cinematic 3D Depth */}
        <div className="absolute top-10 left-8 sm:left-14 animate-floatSlow pointer-events-none select-none z-10">
          <BotanicalLeaf size={66} rotation={-16} opacity={0.88} />
        </div>
        <div className="absolute top-16 right-[38%] animate-floatSlow pointer-events-none select-none z-10 hidden sm:block">
          <BotanicalLeaf size={52} rotation={42} delay="2s" opacity={0.8} />
        </div>
        <div className="absolute bottom-20 right-6 sm:right-12 animate-floatSlow pointer-events-none select-none z-10 hidden md:block">
          <BotanicalLeaf size={60} rotation={-14} flip={true} delay="3.5s" opacity={0.78} />
        </div>

        {/* Cinematic Foreground Leaf with Optical Depth-of-Field Blur (Reference Style) */}
        <div className="absolute -bottom-6 left-4 sm:left-10 lg:left-16 animate-floatSway pointer-events-none select-none z-20">
          <BotanicalLeaf size={125} rotation={-26} blur={true} opacity={0.92} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content (Preserved exactly as-is!) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 text-xs font-semibold text-[#D4AF37] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>India's Premier Digital Agriculture Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#FDFBF7] leading-[1.12] tracking-tight">
                Smart Farming <br />
                <span className="bg-gradient-to-r from-[#FFF6DD] via-[#D4AF37] to-[#F5DE98] bg-clip-text text-transparent">
                  Starts Here.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed">
                AI-powered agricultural intelligence, trusted information and farmer connections — all in one place. Built specifically for India's hardworking cultivators.
              </p>

              {/* Action Buttons (Strictly preserved!) */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#F5DE98] via-[#D4AF37] to-[#B8860B] hover:from-[#FFF0B8] hover:to-[#D4AF37] text-[#071411] font-extrabold text-sm shadow-xl shadow-[#D4AF37]/25 transition-all flex items-center gap-2 group hover:scale-105 active:scale-95"
                >
                  <span>{t("exploreBtn")}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  onClick={() => setDhartiMaaOpen(true)}
                  className="px-6 py-3.5 rounded-full bg-black/40 hover:bg-black/60 text-stone-100 font-bold text-sm border-2 border-[#D4AF37]/45 hover:border-[#D4AF37] transition-all flex items-center gap-2.5 shadow-md backdrop-blur-md active:scale-95"
                >
                  <DhartiMaaAvatar size="sm" />
                  <span>{t("askDhartiMaa")}</span>
                </button>
              </div>

              {/* Verified Trust Stats */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#D4AF37]/25 text-xs">
                <div>
                  <div className="font-extrabold text-lg text-[#D4AF37]">100%</div>
                  <div className="text-stone-300">Govt Verified Schemes</div>
                </div>
                <div>
                  <div className="font-extrabold text-lg text-[#D4AF37]">10-Photo</div>
                  <div className="text-stone-300">AI Leaf & Soil Diagnostics</div>
                </div>
                <div>
                  <div className="font-extrabold text-lg text-[#D4AF37]">Bilingual</div>
                  <div className="text-stone-300">English & हिंदी Native</div>
                </div>
              </div>
            </div>

            {/* Right: Real Animated Agricultural Landscape (Framed with Gold Rim Portal Depth) */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl p-2 bg-gradient-to-br from-[#D4AF37]/35 via-emerald-600/10 to-[#D4AF37]/20 shadow-2xl shadow-[#D4AF37]/20 border-2 border-[#D4AF37]/45 backdrop-blur-md">
                <AgriculturalAnimatedHero />
              </div>
            </div>
          </div>
        </div>

        {/* Sweeping Organic Ivory Wave Transition (Reference Style from Image 1) */}
        <div className="relative w-full mt-14 z-10">
          <div className="w-full overflow-hidden leading-none">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative block w-full h-16 sm:h-24 md:h-28"
              preserveAspectRatio="none"
            >
              {/* Delicate Golden Accent Stroke on Wave Rim */}
              <path
                d="M0,45 C320,115 640,-15 1080,75 C1240,105 1360,65 1440,55"
                stroke="#D4AF37"
                strokeWidth="1.5"
                strokeOpacity="0.45"
                fill="none"
              />
              {/* Sweeping Organic Wave filled with Ivory Porcelain (#FAF7F0) */}
              <path
                d="M0,45 C320,115 640,-15 1080,75 C1240,105 1360,65 1440,55 L1440,120 L0,120 Z"
                fill="#FAF7F0"
              />
            </svg>
          </div>

          {/* Slogan & Scroll Indicator resting seamlessly on the Ivory Wave */}
          <div className="bg-[#FAF7F0] -mt-1 pb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-stone-700">
              <div className="flex items-center gap-2">
                <span className="text-[#D4AF37] text-base">🌾</span>
                <span className="font-semibold text-stone-700 tracking-wide">Rooted in Trust. Growing for Generations.</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#8A6A12] font-bold px-3.5 py-1 rounded-full border border-[#D4AF37]/45 bg-[#D4AF37]/15 shadow-xs">
                <span>SCROLL</span>
                <span>↓</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SIX CORE AGRICULTURAL FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#6B500B] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/40 shadow-xs">
            <span>🌾 Integrated Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
            Six Pillars of Agricultural Empowerment
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Every tool is designed to solve real daily field challenges, increase yield, save input costs, and maximize farmer profit.
          </p>
        </div>

        {/* 6 Feature Cards: Horizontal on Desktop, Grid on Tablet/Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {sixFeatures.map((f) => (
            <div
              key={f.id}
              className={`group flex flex-col justify-between p-5 rounded-3xl ${f.bgLight} border ${f.border} shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl p-2.5 rounded-2xl bg-[#FAF7F0] shadow-xs border border-[#EAE3D5]">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#6B500B] border border-[#D4AF37]/30">
                    {f.badge}
                  </span>
                </div>

                <h3 className="font-bold text-base text-stone-900 mb-2 leading-snug">
                  {f.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href={f.route}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0A1612] via-[#0E241E] to-[#07110D] hover:from-[#133028] hover:to-[#0E241E] text-[#FAF7F0] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs border border-[#D4AF37]/30 hover:border-[#D4AF37]"
                >
                  <span>{f.btnText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MEET DHARTI MAA (SPECIAL FEATURE SPOTLIGHT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#091512] via-[#0E251F] to-[#06100D] text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-[#D4AF37]/35">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#D4AF37]/12 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Avatar & Intro */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-4">
                <DhartiMaaAvatar size="lg" className="border-2 border-[#D4AF37]" />
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Meet 🌱 Dharti Maa
                  </h3>
                  <p className="text-[#D4AF37] text-sm font-medium">
                    Your AI companion for smarter, resilient farming.
                  </p>
                </div>
              </div>

              <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
                Dharti Maa combines deep Indian agronomic research with localized weather intelligence. She understands regional soils, seasonal disease cycles, government subsidies, and converses naturally in both Hindi and English.
              </p>

              {/* Sample Chat Preview */}
              <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-[#D4AF37]/30 space-y-3 text-xs">
                <div className="flex items-start gap-2 text-stone-200">
                  <span className="font-bold text-[#F5DE98]">Farmer:</span>
                  <span>"My tomato leaves are turning yellow with concentric dark spots. What should I do?"</span>
                </div>
                <div className="flex items-start gap-2 text-stone-100 bg-[#06100D]/80 p-2.5 rounded-xl border border-[#D4AF37]/25">
                  <span className="font-bold text-[#D4AF37]">Dharti Maa:</span>
                  <span>"This strongly indicates Early Blight (Alternaria solani). Inspect for target-like rings. Prune lower diseased foliage, apply Mancozeb 75% WP @ 2.5g/L, and ensure water does not splash on foliage..."</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setDhartiMaaOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F5DE98] via-[#D4AF37] to-[#B8860B] hover:from-[#FFF0B8] hover:to-[#D4AF37] text-[#071411] font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Talk to Dharti Maa Now</span>
                </button>
                <span className="text-xs text-stone-300">
                  ⚡ Always available at bottom-left on all pages
                </span>
              </div>
            </div>

            {/* Right: Key Assurances */}
            <div className="lg:col-span-5 bg-[#06100D]/80 rounded-2xl p-6 border border-[#D4AF37]/30 space-y-4">
              <h4 className="font-bold text-sm text-[#D4AF37] uppercase tracking-wider">
                Dharti Maa Safety Guarantees
              </h4>
              <ul className="space-y-3 text-xs text-stone-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Zero Fake Guarantees:</strong> Transparently presents guidance as scientific advice without false yield promises.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>No Fabricated Soil Chemistries:</strong> Never fakes laboratory NPK/pH values from photos; directs farmers to accredited labs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>KVK Integration:</strong> Automatically recommends nearest Krishi Vigyan Kendra for high-risk outbreaks.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GOVERNMENT SCHEMES & IRRIGATION HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#091512] via-[#0E231D] to-[#06100D] text-white shadow-xl space-y-8 border border-[#D4AF37]/35">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              🏛️ Government Initiatives
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Official Indian Agricultural Schemes Center
            </h3>
            <p className="text-stone-300 text-sm">
              Clear document checklists, step-by-step registration paths, and direct links to official portals: PM-Kisan, PMKSY (Har Khet Ko Pani), PMFBY (Fasal Bima), KCC, and AIF.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <Link
              href="/govt-schemes/pm-kisan"
              className="p-4 rounded-2xl bg-[#12241F]/60 hover:bg-[#18312A]/85 transition-all border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-[#F5DE98]">PM-Kisan</div>
              <div className="text-stone-300">₹6,000 Annual Direct DBT</div>
            </Link>
            <Link
              href="/govt-schemes/pmksy"
              className="p-4 rounded-2xl bg-[#12241F]/60 hover:bg-[#18312A]/85 transition-all border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-[#F5DE98]">PMKSY</div>
              <div className="text-stone-300">55% Micro-Irrigation Subsidy</div>
            </Link>
            <Link
              href="/govt-schemes/pmfby"
              className="p-4 rounded-2xl bg-[#12241F]/60 hover:bg-[#18312A]/85 transition-all border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-[#F5DE98]">PMFBY</div>
              <div className="text-stone-300">Subsidized Crop Insurance</div>
            </Link>
            <Link
              href="/govt-schemes/kcc"
              className="p-4 rounded-2xl bg-[#12241F]/60 hover:bg-[#18312A]/85 transition-all border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-[#F5DE98]">Kisan Credit Card</div>
              <div className="text-stone-300">4% Subsidized Crop Credit</div>
            </Link>
            <Link
              href="/govt-schemes/aif"
              className="p-4 rounded-2xl bg-[#12241F]/60 hover:bg-[#18312A]/85 transition-all border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-[#F5DE98]">Agri Infra Fund</div>
              <div className="text-stone-300">Post-Harvest Debt Financing</div>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FARMER IMPACT & PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#D4AF37]/15 border border-[#D4AF37]/40 shadow-xs" style={{ color: "#D4AF37" }}>
            <span>✨</span>
            <span>ȺցɾìҠìղ Philosophy</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl font-black tracking-tight leading-snug drop-shadow-xs"
            style={{ color: "#D4AF37" }}
          >
            "Technology should empower the farmer, not replace the farmer."
          </h2>
          <p className="text-stone-800 text-sm sm:text-base font-semibold max-w-2xl mx-auto leading-relaxed">
            <span style={{ color: "#D4AF37" }}>ȺցɾìҠìղ</span> is engineered as a true companion in the field, helping reduce resource waste, protect crop investments, and connect communities across rural India.
          </p>
          <div className="w-20 h-1 rounded-full mx-auto mt-2" style={{ backgroundColor: "#D4AF37" }} />
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#091512] via-[#0E241E] to-[#06100D] text-white text-center space-y-6 shadow-2xl border border-[#D4AF37]/35">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to Transform Your Farm with ȺցɾìҠìղ?
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of forward-looking Indian farmers utilizing real-time intelligence, direct trade connections, and personalized AI agricultural mentorship.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/signup"
              className="px-8 py-3.5 rounded-2xl bg-[#FAF7F0] hover:bg-white text-[#071411] font-extrabold text-sm shadow-lg transition-all"
            >
              Get Started for Free 🌱
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-2xl bg-[#071411]/85 hover:bg-[#071411] text-white font-bold text-sm border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all"
            >
              Sign In to Your Farm
            </Link>
            <Link
              href="/krishi-connect/login"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#F5DE98] via-[#D4AF37] to-[#B8860B] hover:from-[#FFF0B8] hover:to-[#D4AF37] text-[#071411] font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <span>🌾</span>
              <span>Dedicated Krishi Connect Sign In</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-stone-300">
            <span className="flex items-center gap-1.5 font-bold text-[#D4AF37]">
              <span>🌾</span>
              <span>Dedicated Agricultural Trade Portal:</span>
            </span>
            <div className="flex items-center gap-3">
              <Link
                href="/krishi-connect/login"
                className="text-white font-bold underline underline-offset-4 hover:text-[#D4AF37] transition-colors"
              >
                Dedicated Sign In &rarr;
              </Link>
              <span>•</span>
              <Link
                href="/krishi-connect/signup"
                className="text-stone-300 font-semibold hover:text-white transition-colors"
              >
                4-Step Buyer/Seller Register
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Dharti Maa Modal */}
      <DhartiMaaChatModal isOpen={dhartiMaaOpen} onClose={() => setDhartiMaaOpen(false)} />
    </div>
  );
}
