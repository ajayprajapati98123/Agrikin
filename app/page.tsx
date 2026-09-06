"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Play,
  FileText,
  ShoppingBag,
  HeartHandshake,
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
      color: "from-amber-400 to-[#D4AF37]",
      bgLight: "bg-[#0C1E1A]",
      border: "border-[#D4AF37]/30 hover:border-[#D4AF37]",
      btnText: "Find Traders",
    },
    {
      id: "detections",
      title: t("feature2Title"),
      desc: t("feature2Desc"),
      icon: "🔬",
      route: "/detections",
      badge: "Vision AI",
      color: "from-amber-400 to-[#D4AF37]",
      bgLight: "bg-[#0C1E1A]",
      border: "border-[#D4AF37]/30 hover:border-[#D4AF37]",
      btnText: "Run Diagnostic",
    },
    {
      id: "govt-schemes",
      title: t("feature3Title"),
      desc: t("feature3Desc"),
      icon: "🏛️",
      route: "/govt-schemes",
      badge: "Direct Subsidies",
      color: "from-amber-400 to-[#D4AF37]",
      bgLight: "bg-[#0C1E1A]",
      border: "border-[#D4AF37]/30 hover:border-[#D4AF37]",
      btnText: "Check Eligibility",
    },
    {
      id: "farming-methods",
      title: t("feature4Title"),
      desc: t("feature4Desc"),
      icon: "💧",
      route: "/farming-methods",
      badge: "Water & Efficiency",
      color: "from-amber-400 to-[#D4AF37]",
      bgLight: "bg-[#0C1E1A]",
      border: "border-[#D4AF37]/30 hover:border-[#D4AF37]",
      btnText: "Learn Irrigation",
    },
    {
      id: "cropify",
      title: t("feature5Title"),
      desc: t("feature5Desc"),
      icon: "🌱",
      route: "/cropify",
      badge: "Yield Optimizer",
      color: "from-amber-400 to-[#D4AF37]",
      bgLight: "bg-[#0C1E1A]",
      border: "border-[#D4AF37]/30 hover:border-[#D4AF37]",
      btnText: "Recommend Crops",
    },
    {
      id: "weather",
      title: t("feature6Title"),
      desc: t("feature6Desc"),
      icon: "🌦️",
      route: "/weather",
      badge: "Agri-Advisory",
      color: "from-amber-400 to-[#D4AF37]",
      bgLight: "bg-[#0C1E1A]",
      border: "border-[#D4AF37]/30 hover:border-[#D4AF37]",
      btnText: "Live Forecast",
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-24 pb-20 bg-[#071411] text-stone-100 selection:bg-[#D4AF37]/30 selection:text-white">
      {/* 1. HERO SECTION (100% MATCH WITH REFERENCE DESIGN) */}
      <section className="relative pt-10 sm:pt-16 pb-16 bg-gradient-to-b from-[#071411] via-[#0B1E19] to-[#071411] text-white overflow-hidden">
        {/* Ambient Golden Sunburst Backdrop Lighting */}
        <div className="absolute right-[-10%] top-[5%] w-[800px] h-[800px] bg-gradient-to-br from-[#D4AF37]/20 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute left-[-10%] bottom-0 w-[500px] h-[500px] bg-emerald-950/25 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Reference Tag: SMARTER TOMORROW FOR OUR FARMERS */}
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#D4AF37]">
                <span>🍃</span>
                <span>SMARTER TOMORROW FOR OUR FARMERS</span>
                <span>🌾</span>
              </div>

              {/* Reference Editorial Headline */}
              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.06] tracking-tight text-[#FDFBF7]">
                Connecting <br />
                Farmers to a <br />
                <span className="font-serif italic font-normal text-[#D4AF37] drop-shadow-sm">
                  Brighter Tomorrow
                </span>
              </h1>

              {/* Reference Subtitle */}
              <p className="text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed font-light">
                Krishi Connect bridges the gap between farmers, markets, experts and opportunities — for a stronger, smarter and sustainable agriculture ecosystem.
              </p>

              {/* Action Buttons (Strictly preserving all buttons and handlers!) */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {/* Primary Button: Get Started */}
                <Link
                  href="/dashboard"
                  className="px-8 py-4 rounded-full font-bold text-sm text-[#071411] bg-gradient-to-r from-[#F5DE98] via-[#D4AF37] to-[#B8860B] hover:from-[#FFF0B8] hover:to-[#D4AF37] shadow-xl shadow-[#D4AF37]/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group"
                >
                  <span>{t("exploreBtn") || "Get Started"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {/* Secondary Button: Watch Our Story / Talk to Dharti Maa */}
                <button
                  onClick={() => setDhartiMaaOpen(true)}
                  className="px-7 py-4 rounded-full font-bold text-sm text-stone-200 bg-white/5 hover:bg-white/10 border border-[#D4AF37]/35 hover:border-[#D4AF37] transition-all flex items-center gap-3 backdrop-blur-md shadow-md active:scale-95 group"
                >
                  <span className="w-7 h-7 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#071411] transition-all text-xs">
                    ▶
                  </span>
                  <span>Watch Our Story</span>
                </button>
              </div>

              {/* Reference 4 Trust Pillars Row */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-lg">
                    🌾
                  </div>
                  <div className="text-xs font-semibold text-stone-200 leading-tight">
                    Better <br />
                    <span className="text-[#D4AF37]">Markets</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-lg">
                    📋
                  </div>
                  <div className="text-xs font-semibold text-stone-200 leading-tight">
                    Reliable <br />
                    <span className="text-[#D4AF37]">Information</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-lg">
                    👥
                  </div>
                  <div className="text-xs font-semibold text-stone-200 leading-tight">
                    A Stronger <br />
                    <span className="text-[#D4AF37]">Farming Community</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-lg">
                    🌱
                  </div>
                  <div className="text-xs font-semibold text-stone-200 leading-tight">
                    Sustainable <br />
                    <span className="text-[#D4AF37]">Agriculture</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Floating Island Centerpiece */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-[560px] aspect-square flex items-center justify-center">
                {/* Sunburst Portal Glow behind island */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/35 via-amber-400/20 to-transparent blur-3xl animate-pulseSlow" />

                {/* 3D Floating Terrarium Island Image matching reference */}
                <div className="relative z-10 w-full h-full rounded-full overflow-hidden p-2">
                  <img
                    src="/images/krishi-hero-island.jpg"
                    alt="Krishi Connect - Farms Flourish People Thrive"
                    className="w-full h-full object-cover rounded-full shadow-2xl transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Floating Script Calligraphy Badge: "Farms Flourish People Thrive" */}
                <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 font-script text-3xl sm:text-4xl text-[#FFF4D0] drop-shadow-xl -rotate-6 select-none pointer-events-none">
                  Farms <br />&nbsp;&nbsp;Flourish <br />&nbsp;&nbsp;&nbsp;&nbsp;People Thrive
                </div>

                {/* Floating Badge on Right: Sustainable Farming Brighter Futures */}
                <div className="absolute top-14 -right-2 lg:-right-6 z-20 hidden sm:flex flex-col items-end text-right text-xs font-semibold text-[#D4AF37] space-y-0.5 select-none pointer-events-none drop-shadow">
                  <span>Sustainable</span>
                  <span>Farming</span>
                  <span>Brighter</span>
                  <span className="flex items-center gap-1">
                    Futures <span className="text-sm">🍃</span>
                  </span>
                </div>

                {/* Ambient floating leaf graphic */}
                <div className="absolute -bottom-4 -left-2 z-20 text-3xl animate-float pointer-events-none opacity-85">
                  🍃
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reference Organic Wave Transition Divider */}
        <div className="relative w-full pt-16 pb-2 border-t border-white/5 mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-stone-300">
            <div className="flex items-center gap-3">
              <span className="font-script text-2xl sm:text-3xl text-[#FFF4D0]">
                Good Food Brighter Lives 🍃
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-400">
              <span className="text-[#D4AF37]">🌾</span>
              <span>Rooted in Trust. Growing for Generations.</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#D4AF37] px-3.5 py-1 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10">
              <span>SCROLL</span>
              <span>↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SIX CORE AGRICULTURAL FEATURES (OBSIDIAN & GOLD THEME) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3.5 py-1 rounded-full border border-[#D4AF37]/30">
            <span>🌾 Integrated Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Six Pillars of Agricultural Empowerment
          </h2>
          <p className="text-stone-300 text-sm sm:text-base">
            Every tool is designed to solve real daily field challenges, increase yield, save input costs, and maximize farmer profit.
          </p>
        </div>

        {/* 6 Feature Cards with Obsidian & Gold Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {sixFeatures.map((f) => (
            <div
              key={f.id}
              className={`group flex flex-col justify-between p-5 rounded-3xl ${f.bgLight} border ${f.border} shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl p-2.5 rounded-2xl bg-black/40 shadow-xs border border-[#D4AF37]/30">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                    {f.badge}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white mb-2 leading-snug">
                  {f.title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href={f.route}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#F5DE98] to-[#D4AF37] hover:brightness-110 text-[#071411] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md"
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
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0C1E1A] via-[#102D26] to-[#071411] text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-[#D4AF37]/35">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

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
                  <span className="font-bold text-[#D4AF37]">Farmer:</span>
                  <span>"My tomato leaves are turning yellow with concentric dark spots. What should I do?"</span>
                </div>
                <div className="flex items-start gap-2 text-stone-200 bg-[#071411]/80 p-2.5 rounded-xl border border-[#D4AF37]/20">
                  <span className="font-bold text-yellow-300">Dharti Maa:</span>
                  <span>"This strongly indicates Early Blight (Alternaria solani). Inspect for target-like rings. Prune lower diseased foliage, apply Mancozeb 75% WP @ 2.5g/L, and ensure water does not splash on foliage..."</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setDhartiMaaOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F5DE98] via-[#D4AF37] to-[#B8860B] hover:brightness-110 text-[#071411] font-extrabold text-sm shadow-lg transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Talk to Dharti Maa Now</span>
                </button>
                <span className="text-xs text-[#D4AF37]">
                  ⚡ Always available at bottom-left on all pages
                </span>
              </div>
            </div>

            {/* Right: Key Assurances */}
            <div className="lg:col-span-5 bg-black/40 rounded-2xl p-6 border border-[#D4AF37]/30 space-y-4">
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
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0C1E1A] via-[#12332A] to-[#071411] text-white shadow-xl space-y-8 border border-[#D4AF37]/35">
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
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-[#D4AF37]/25 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-[#D4AF37]">PM-Kisan</div>
              <div className="text-stone-300">₹6,000 Annual Direct DBT</div>
            </Link>
            <Link
              href="/govt-schemes/pmksy"
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-[#D4AF37]/25 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-[#D4AF37]">PMKSY</div>
              <div className="text-stone-300">55% Micro-Irrigation Subsidy</div>
            </Link>
            <Link
              href="/govt-schemes/pmfby"
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-[#D4AF37]/25 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-[#D4AF37]">PMFBY</div>
              <div className="text-stone-300">Subsidized Crop Insurance</div>
            </Link>
            <Link
              href="/govt-schemes/kcc"
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-[#D4AF37]/25 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-[#D4AF37]">Kisan Credit Card</div>
              <div className="text-stone-300">4% Subsidized Crop Credit</div>
            </Link>
            <Link
              href="/govt-schemes/aif"
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-[#D4AF37]/25 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-[#D4AF37]">Agri Infra Fund</div>
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
          <p className="text-stone-300 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            <span style={{ color: "#D4AF37" }}>ȺցɾìҠìղ</span> is engineered as a true companion in the field, helping reduce resource waste, protect crop investments, and connect communities across rural India.
          </p>
          <div className="w-20 h-1 rounded-full mx-auto mt-2" style={{ backgroundColor: "#D4AF37" }} />
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#0C1E1A] via-[#143B31] to-[#071411] text-white text-center space-y-6 shadow-2xl border border-[#D4AF37]/40">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to Transform Your Farm with ȺցɾìҠìղ?
          </h2>
          <p className="text-stone-200 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of forward-looking Indian farmers utilizing real-time intelligence, direct trade connections, and personalized AI agricultural mentorship.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/signup"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F5DE98] via-[#D4AF37] to-[#B8860B] hover:brightness-110 text-[#071411] font-extrabold text-sm shadow-xl transition-all"
            >
              Get Started for Free 🌱
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-[#D4AF37]/40 transition-all"
            >
              Sign In to Your Farm
            </Link>
            <Link
              href="/krishi-connect/login"
              className="px-8 py-3.5 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37] font-black text-sm shadow-lg transition-all flex items-center gap-2"
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
