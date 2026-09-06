"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AgriculturalAnimatedHero } from "../components/hero/agricultural-animated-hero";
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
      color: "from-cyan-700 to-teal-800",
      bgLight: "bg-[#FFFEFD] dark:bg-[#083344]",
      border: "border-[#EAE3D5] dark:border-cyan-800/60 hover:border-cyan-400",
      btnText: "Find Traders",
    },
    {
      id: "detections",
      title: t("feature2Title"),
      desc: t("feature2Desc"),
      icon: "🔬",
      route: "/detections",
      badge: "Vision AI",
      color: "from-cyan-600 to-teal-700",
      bgLight: "bg-[#FFFEFD] dark:bg-[#083344]",
      border: "border-[#EAE3D5] dark:border-cyan-800/60 hover:border-cyan-400",
      btnText: "Run Diagnostic",
    },
    {
      id: "govt-schemes",
      title: t("feature3Title"),
      desc: t("feature3Desc"),
      icon: "🏛️",
      route: "/govt-schemes",
      badge: "Direct Subsidies",
      color: "from-cyan-800 to-sky-700",
      bgLight: "bg-[#FFFEFD] dark:bg-[#083344]",
      border: "border-[#EAE3D5] dark:border-cyan-800/60 hover:border-cyan-400",
      btnText: "Check Eligibility",
    },
    {
      id: "farming-methods",
      title: t("feature4Title"),
      desc: t("feature4Desc"),
      icon: "💧",
      route: "/farming-methods",
      badge: "Water & Efficiency",
      color: "from-cyan-600 to-teal-700",
      bgLight: "bg-[#FFFEFD] dark:bg-[#083344]",
      border: "border-[#EAE3D5] dark:border-cyan-800/60 hover:border-cyan-400",
      btnText: "Learn Irrigation",
    },
    {
      id: "cropify",
      title: t("feature5Title"),
      desc: t("feature5Desc"),
      icon: "🌱",
      route: "/cropify",
      badge: "Yield Optimizer",
      color: "from-teal-700 to-cyan-800",
      bgLight: "bg-[#FFFEFD] dark:bg-[#083344]",
      border: "border-[#EAE3D5] dark:border-cyan-800/60 hover:border-cyan-400",
      btnText: "Recommend Crops",
    },
    {
      id: "weather",
      title: t("feature6Title"),
      desc: t("feature6Desc"),
      icon: "🌦️",
      route: "/weather",
      badge: "Agri-Advisory",
      color: "from-cyan-600 to-blue-600",
      bgLight: "bg-[#FFFEFD] dark:bg-[#083344]",
      border: "border-[#EAE3D5] dark:border-cyan-800/60 hover:border-cyan-400",
      btnText: "Live Forecast",
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-16 bg-gradient-to-b from-[#FDFBF7] via-[#ECFEFF]/40 to-[#FAF7F0] dark:from-[#082933] dark:via-[#0E3D48] dark:to-[#082933] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFEFF] dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-700 text-xs font-semibold text-cyan-950 dark:text-cyan-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>India's Premier Digital Agriculture Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 dark:text-stone-50 leading-[1.12] tracking-tight">
                Smart Farming <br />
                <span className="bg-gradient-to-r from-cyan-700 via-teal-600 to-cyan-500 bg-clip-text text-transparent">
                  Starts Here.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
                AI-powered agricultural intelligence, trusted information and farmer connections — all in one place. Built specifically for India's hardworking cultivators.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-800 via-teal-800 to-cyan-900 hover:from-cyan-700 hover:to-cyan-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                >
                  <span>{t("exploreBtn")}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  onClick={() => setDhartiMaaOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-[#FAF7F0] dark:bg-[#082933] hover:bg-[#FDFBF7] text-cyan-950 dark:text-cyan-100 font-bold text-sm border-2 border-cyan-600/40 transition-all flex items-center gap-2.5 shadow-sm"
                >
                  <DhartiMaaAvatar size="sm" />
                  <span>{t("askDhartiMaa")}</span>
                </button>
              </div>

              {/* Verified Trust Stats */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#EAE3D5] dark:border-cyan-800/60 text-xs">
                <div>
                  <div className="font-extrabold text-lg text-cyan-800 dark:text-cyan-300">100%</div>
                  <div className="text-stone-500 dark:text-stone-400">Govt Verified Schemes</div>
                </div>
                <div>
                  <div className="font-extrabold text-lg text-cyan-800 dark:text-cyan-300">10-Photo</div>
                  <div className="text-stone-500 dark:text-stone-400">AI Leaf & Soil Diagnostics</div>
                </div>
                <div>
                  <div className="font-extrabold text-lg text-cyan-800 dark:text-cyan-300">Bilingual</div>
                  <div className="text-stone-500 dark:text-stone-400">English & हिंदी Native</div>
                </div>
              </div>
            </div>

            {/* Right: Real Animated Agricultural Landscape */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl p-1.5 bg-gradient-to-br from-cyan-600/25 via-teal-500/10 to-cyan-500/20 shadow-2xl border border-cyan-500/30">
                <AgriculturalAnimatedHero />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SIX CORE AGRICULTURAL FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-cyan-800 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-800">
            <span>🌾 Integrated Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
            Six Pillars of Agricultural Empowerment
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base">
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
                  <div className="text-3xl p-2.5 rounded-2xl bg-[#FDFBF7] dark:bg-cyan-950/80 shadow-xs border border-[#EAE3D5] dark:border-cyan-800">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                    {f.badge}
                  </span>
                </div>

                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 mb-2 leading-snug">
                  {f.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href={f.route}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
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
        <div className="relative rounded-3xl bg-gradient-to-br from-[#083344] via-[#0E4756] to-[#042129] text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-cyan-500/40">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Avatar & Intro */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-4">
                <DhartiMaaAvatar size="lg" className="border-2 border-yellow-400" />
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Meet 🌱 Dharti Maa
                  </h3>
                  <p className="text-cyan-300 text-sm font-medium">
                    Your AI companion for smarter, resilient farming.
                  </p>
                </div>
              </div>

              <p className="text-cyan-100/90 text-sm sm:text-base leading-relaxed">
                Dharti Maa combines deep Indian agronomic research with localized weather intelligence. She understands regional soils, seasonal disease cycles, government subsidies, and converses naturally in both Hindi and English.
              </p>

              {/* Sample Chat Preview */}
              <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-cyan-700/60 space-y-3 text-xs">
                <div className="flex items-start gap-2 text-stone-200">
                  <span className="font-bold text-amber-300">Farmer:</span>
                  <span>"My tomato leaves are turning yellow with concentric dark spots. What should I do?"</span>
                </div>
                <div className="flex items-start gap-2 text-cyan-200 bg-[#042129]/80 p-2.5 rounded-xl border border-cyan-800">
                  <span className="font-bold text-yellow-300">Dharti Maa:</span>
                  <span>"This strongly indicates Early Blight (Alternaria solani). Inspect for target-like rings. Prune lower diseased foliage, apply Mancozeb 75% WP @ 2.5g/L, and ensure water does not splash on foliage..."</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setDhartiMaaOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-[#083344] font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Talk to Dharti Maa Now</span>
                </button>
                <span className="text-xs text-cyan-300">
                  ⚡ Always available at bottom-left on all pages
                </span>
              </div>
            </div>

            {/* Right: Key Assurances */}
            <div className="lg:col-span-5 bg-[#042129]/70 rounded-2xl p-6 border border-cyan-800/80 space-y-4">
              <h4 className="font-bold text-sm text-yellow-300 uppercase tracking-wider">
                Dharti Maa Safety Guarantees
              </h4>
              <ul className="space-y-3 text-xs text-cyan-100">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Fake Guarantees:</strong> Transparently presents guidance as scientific advice without false yield promises.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>No Fabricated Soil Chemistries:</strong> Never fakes laboratory NPK/pH values from photos; directs farmers to accredited labs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>KVK Integration:</strong> Automatically recommends nearest Krishi Vigyan Kendra for high-risk outbreaks.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* 6. GOVERNMENT SCHEMES & IRRIGATION HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#083344] via-[#0E5266] to-[#042129] text-white shadow-xl space-y-8 border border-cyan-500/40">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">
              🏛️ Government Initiatives
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Official Indian Agricultural Schemes Center
            </h3>
            <p className="text-cyan-100/90 text-sm">
              Clear document checklists, step-by-step registration paths, and direct links to official portals: PM-Kisan, PMKSY (Har Khet Ko Pani), PMFBY (Fasal Bima), KCC, and AIF.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <Link
              href="/govt-schemes/pm-kisan"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/15 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-yellow-300">PM-Kisan</div>
              <div className="text-cyan-200">₹6,000 Annual Direct DBT</div>
            </Link>
            <Link
              href="/govt-schemes/pmksy"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/15 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-yellow-300">PMKSY</div>
              <div className="text-cyan-200">55% Micro-Irrigation Subsidy</div>
            </Link>
            <Link
              href="/govt-schemes/pmfby"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/15 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-yellow-300">PMFBY</div>
              <div className="text-cyan-200">Subsidized Crop Insurance</div>
            </Link>
            <Link
              href="/govt-schemes/kcc"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/15 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-yellow-300">Kisan Credit Card</div>
              <div className="text-cyan-200">4% Subsidized Crop Credit</div>
            </Link>
            <Link
              href="/govt-schemes/aif"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/15 space-y-1 block backdrop-blur-xs"
            >
              <div className="font-bold text-yellow-300">Agri Infra Fund</div>
              <div className="text-cyan-200">Post-Harvest Debt Financing</div>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FARMER IMPACT & PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            "Technology should empower the farmer, not replace the farmer."
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm">
            ȺցɾìҠìղ is engineered as a true companion in the field, helping reduce resource waste, protect crop investments, and connect communities across rural India.
          </p>
        </div>

      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#083344] via-[#0E4756] to-[#042129] text-white text-center space-y-6 shadow-2xl border border-cyan-500/40">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to Transform Your Farm with ȺցɾìҠìղ?
          </h2>
          <p className="text-cyan-100 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of forward-looking Indian farmers utilizing real-time intelligence, direct trade connections, and personalized AI agricultural mentorship.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/signup"
              className="px-8 py-3.5 rounded-2xl bg-[#FAF7F0] hover:bg-white text-[#083344] font-extrabold text-sm shadow-lg transition-all"
            >
              Get Started for Free 🌱
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-2xl bg-cyan-900/80 hover:bg-cyan-800 text-white font-bold text-sm border border-cyan-500/60 transition-all"
            >
              Sign In to Your Farm
            </Link>
            <Link
              href="/krishi-connect/login"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-cyan-950 font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <span>🌾</span>
              <span>Dedicated Krishi Connect Sign In</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-cyan-800/60 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-cyan-200">
            <span className="flex items-center gap-1.5 font-bold text-yellow-300">
              <span>🌾</span>
              <span>Dedicated Agricultural Trade Portal:</span>
            </span>
            <div className="flex items-center gap-3">
              <Link
                href="/krishi-connect/login"
                className="text-white font-bold underline underline-offset-4 hover:text-yellow-300 transition-colors"
              >
                Dedicated Sign In &rarr;
              </Link>
              <span>•</span>
              <Link
                href="/krishi-connect/signup"
                className="text-cyan-100 font-semibold hover:text-white transition-colors"
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
