"use client";

import React, { useState } from "react";
import Link from "next/link";
import { irrigationMethods, IrrigationMethod } from "../../lib/data/irrigation-data";
import { cropsDatabase } from "../../lib/data/crop-database";
import { DetailedFarmingMethod } from "../api/farming-methods/route";
import { SwaahVoiceAssistant, SwaahLanguage } from "../../components/swaah-voice-assistant";
import {
  Droplets,
  Sprout,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Wrench,
  Cpu,
  Layers,
  ShieldCheck,
  Search,
  X,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Calendar,
  AlertTriangle,
  Coins,
  Settings,
  Flame,
  HelpCircle,
} from "lucide-react";

export default function FarmingMethodsPage() {
  const [selectedMethodId, setSelectedMethodId] = useState<string>("drip-irrigation");
  const [selectedCropId, setSelectedCropId] = useState<string>("wheat");

  // Search form state
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Modal / Pop-up state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<"howToDoIt" | "howToApplyIt" | "howToRunIt" | "maintenance" | "costs" | "expert">("howToDoIt");
  const [modalData, setModalData] = useState<DetailedFarmingMethod | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Swaah Voice Assistant state
  const [isSwaahOpen, setIsSwaahOpen] = useState(false);
  const [swaahActiveMethod, setSwaahActiveMethod] = useState<string>("drip-irrigation");
  const [swaahLang, setSwaahLang] = useState<SwaahLanguage>("hi");

  const currentMethod = irrigationMethods.find((m) => m.id === selectedMethodId) || irrigationMethods[0];
  const currentCrop = cropsDatabase.find((c) => c.id === selectedCropId) || cropsDatabase[0];

  // Open Pop-up by fetching from real-time API
  const handleOpenMethodModal = async (methodQuery: string) => {
    setModalLoading(true);
    setIsModalOpen(true);
    setSearchError(null);

    try {
      const res = await fetch(`/api/farming-methods?query=${encodeURIComponent(methodQuery)}`);
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      const json = await res.json();
      if (json.success && json.data) {
        setModalData(json.data);
      } else {
        throw new Error(json.error || "Failed to load real-time farming method data.");
      }
    } catch (err: any) {
      console.error("Farming method fetch error:", err);
      setSearchError(err?.message || "Failed to fetch real-time method details.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    handleOpenMethodModal(searchQuery.trim());
  };

  const quickMethodChips = [
    { label: "💧 Drip Irrigation", query: "Drip Irrigation" },
    { label: "🌦️ Sprinkler Irrigation", query: "Sprinkler Irrigation" },
    { label: "🌊 Surface Flood Irrigation", query: "Surface Irrigation" },
    { label: "🌱 Subsurface Drip (SDI)", query: "Subsurface Drip Irrigation" },
    { label: "🧪 Hydroponics", query: "Hydroponics" },
    { label: "🌾 Zero Budget Natural Farming", query: "Zero Budget Natural Farming (ZBNF)" },
    { label: "🏡 Polyhouse & Greenhouse", query: "Polyhouse Farming" },
    { label: "🌬️ Aeroponics", query: "Aeroponics" },
    { label: "🛡️ Plastic Mulch Farming", query: "Plastic Mulching Farming" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#083344] via-[#0E5266] to-[#042129] text-white p-6 sm:p-10 shadow-xl border border-cyan-500/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-semibold">
            <Droplets className="w-3.5 h-3.5 text-cyan-300" />
            <span>Water Conservation & High-Tech Yield Optimization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Modern Farming & Irrigation Knowledge Center
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/90 max-w-2xl leading-relaxed">
            Master micro-irrigation systems, fertigation automation, and sustainable agronomic protocols. Click any method or type in the search box to view real-time operational pop-up guides.
          </p>
        </div>

        <Link
          href="/farming-methods/irrigation"
          className="px-5 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-extrabold text-xs shadow-md transition-all self-start md:self-auto flex items-center gap-2"
        >
          <span>Direct Irrigation Calculator</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* SEARCH / QUERY FORM: Ask AI for Any Farming Method */}
      <div className="rounded-3xl bg-[#FFFEFD] dark:bg-[#083344] p-6 sm:p-8 border border-[#EAE3D5] dark:border-cyan-800/60 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span>Real-Time Farming Method Intelligence Engine</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Type any farming method to generate an instant pop-up guide: how to do it, how to apply it, how to run it, and maintenance schedules.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-200 text-[10px] font-bold self-start sm:self-auto border border-cyan-300 dark:border-cyan-700">
            ⚡ Live ICAR API Connected
          </span>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type any method: e.g. Hydroponics, Zero Budget Natural Farming, Polyhouse, Aeroponics, Mulching..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-950/40 border border-[#EAE3D5] dark:border-cyan-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <button
            type="submit"
            disabled={searching || !searchQuery.trim()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {searching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Guide...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Open Pop-Up Guide ⚡</span>
              </>
            )}
          </button>
        </form>

        {searchError && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-semibold text-stone-400">Popular Quick Guides (Click to open Pop-up):</div>
          <div className="flex flex-wrap gap-2">
            {quickMethodChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(chip.query);
                  handleOpenMethodModal(chip.query);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] dark:bg-cyan-950/30 hover:bg-cyan-50 dark:hover:bg-cyan-900/60 text-stone-700 dark:text-stone-200 text-xs font-medium border border-[#EAE3D5] dark:border-cyan-800 transition-all cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: MODERN METHODS OF IRRIGATION (THE 4 CORE METHODS) */}
      <section className="space-y-6">
        <div className="border-b border-[#EAE3D5] dark:border-cyan-800 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>Modern Methods of Irrigation</span>
              <span className="text-xs font-semibold text-cyan-900 dark:text-cyan-200 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-700 px-2.5 py-0.5 rounded-full">
                4 Core Systems
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Click any of the 4 core farming methods below to open the complete interactive operational pop-up window.
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-300 dark:border-cyan-800">
            👆 Click on any card to launch Pop-up
          </span>
        </div>

        {/* 4 Core Irrigation Method Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {irrigationMethods.map((m) => (
            <div
              key={m.id}
              onClick={() => {
                setSelectedMethodId(m.id);
                handleOpenMethodModal(m.name);
              }}
              className="group p-5 rounded-3xl border text-left transition-all flex flex-col justify-between cursor-pointer bg-[#FFFEFD] dark:bg-[#083344] text-stone-800 dark:text-stone-200 border-[#EAE3D5] dark:border-cyan-800/60 hover:border-cyan-400 hover:shadow-xl hover:-translate-y-1 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 group-hover:scale-110 transition-transform">
                  {m.icon}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700">
                  {m.waterEfficiencyPercent}% Water Savings
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-base leading-snug group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                  {m.name}
                </h3>
                <div className="text-xs font-medium text-stone-400">
                  {m.hindiName}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mt-1">
                  {m.definition}
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMethodId(m.id);
                    handleOpenMethodModal(m.name);
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 group-hover:bg-gradient-to-r group-hover:from-cyan-800 group-hover:to-teal-800 text-cyan-950 dark:text-cyan-200 group-hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs border border-cyan-200 dark:border-cyan-800 group-hover:border-transparent"
                >
                  <span>Open Pop-Up Guide</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSwaahActiveMethod(m.id);
                    setIsSwaahOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-[#083344] font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>🎙️ स्वाहा से सुनें (Swaah Voice)</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Quick View Banner */}
        <div className="bg-white dark:bg-[#082933] rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-cyan-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-cyan-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{currentMethod.icon}</span>
                <h3 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                  {currentMethod.name} ({currentMethod.hindiName})
                </h3>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 max-w-3xl leading-relaxed">
                {currentMethod.definition}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => {
                  setSwaahActiveMethod(currentMethod.id);
                  setIsSwaahOpen(true);
                }}
                className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#083344] font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>🎙️ स्वाहा आवाज सहायक (Swaah)</span>
              </button>

              <button
                onClick={() => handleOpenMethodModal(currentMethod.name)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-700 to-teal-700 hover:bg-[#083344] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Launch Full Operational Pop-Up</span>
              </button>
            </div>
          </div>

          {/* Quick Snapshot Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                ⚙️ Working Mechanism
              </h4>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-cyan-900/20 p-4 rounded-2xl border border-stone-100 dark:border-cyan-800">
                {currentMethod.howItWorks}
              </p>
              <div>
                <strong>Suitable Terrain: </strong>
                <span className="text-stone-600 dark:text-stone-300">
                  {Array.isArray(currentMethod.suitableTerrain)
                    ? currentMethod.suitableTerrain.join(", ")
                    : currentMethod.suitableTerrain}
                </span>
              </div>
              <div>
                <strong>Estimated Cost: </strong>
                <span className="text-cyan-700 dark:text-cyan-400 font-bold">
                  {currentMethod.installationCost}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                🌾 Recommended Crops & Soils
              </h4>
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-stone-700 dark:text-stone-300 mb-1">Crops:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentMethod.suitableCrops.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-lg bg-cyan-100 dark:bg-cyan-900 text-cyan-950 dark:text-cyan-100 font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-stone-700 dark:text-stone-300 mb-1">Soils:</div>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                    {currentMethod.suitableSoil.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CROP-SPECIFIC MODERN FARMING PRACTICES */}
      <section className="space-y-6 pt-6 border-t border-stone-200 dark:border-cyan-800">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            Crop-Specific Modern Cultivation Guides
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Standard operating procedures from seed selection to post-harvest storage.
          </p>
        </div>

        {/* Crop Selection Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {cropsDatabase.map((crop) => (
            <button
              key={crop.id}
              onClick={() => setSelectedCropId(crop.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCropId === crop.id
                  ? "bg-gradient-to-r from-cyan-700 to-teal-700 text-white shadow-xs"
                  : "bg-white dark:bg-[#082933] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-cyan-800 hover:bg-cyan-50"
              }`}
            >
              {crop.name} ({crop.hindiName})
            </button>
          ))}
        </div>

        {/* Selected Crop Guide Details */}
        <div className="bg-white dark:bg-[#082933] rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-cyan-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-cyan-800">
            <div>
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
                {currentCrop.name} ({currentCrop.hindiName})
              </h3>
              <div className="text-xs text-cyan-700 dark:text-cyan-400 font-semibold mt-0.5">
                Season: {currentCrop.season} • Duration: {currentCrop.durationDays} • Water: {currentCrop.waterRequirementMm}
              </div>
            </div>
            <div className="text-xs text-stone-500">
              <strong>Major States: </strong>{currentCrop.statesGrowing.join(", ")}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 space-y-1">
              <strong className="text-stone-900 dark:text-stone-100">1. Seed & Variety Selection:</strong>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {currentCrop.farmingMethodGuide.seedVariety}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 space-y-1">
              <strong className="text-stone-900 dark:text-stone-100">2. Planting & Sowing Method:</strong>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {currentCrop.farmingMethodGuide.plantingMethod}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 space-y-1">
              <strong className="text-stone-900 dark:text-stone-100">3. Water Management:</strong>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {currentCrop.farmingMethodGuide.waterManagement}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 space-y-1">
              <strong className="text-stone-900 dark:text-stone-100">4. Nutrient & Fertilizer Management:</strong>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {currentCrop.farmingMethodGuide.nutrientManagement}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POP-UP MODAL: Interactive Full Operational Farming Method Guide */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white dark:bg-[#082933] w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-cyan-500/40 flex flex-col overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#083344] via-[#0E4A5C] to-[#042129] text-white flex items-center justify-between gap-4 border-b border-cyan-700/50 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-white/10 backdrop-blur-sm">
                  {modalData?.icon || "🌱"}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                      {modalData?.name || "Loading Farming Method..."}
                    </h2>
                    {modalData?.waterEfficiency && (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-[#083344] font-extrabold text-[11px]">
                        {modalData.waterEfficiency}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-cyan-200 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>{modalData?.hindiName}</span>
                    <span>•</span>
                    <span className="text-[10px] text-cyan-300/80">
                      ⚡ Live Real-Time ICAR Agronomic Intel
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSwaahActiveMethod(modalData?.id || modalData?.name || "drip-irrigation");
                    setIsSwaahOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#083344] font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  title="स्वाहा आवाज सहायक से सुनें (Listen with Swaah)"
                >
                  <span>🎙️ स्वाहा से सुनें</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Close Pop-up"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex overflow-x-auto bg-stone-100 dark:bg-cyan-900/40 p-1.5 border-b border-stone-200 dark:border-cyan-800 text-xs font-bold gap-1 shrink-0 scrollbar-none">
              {[
                { id: "howToDoIt", label: "🛠️ How to Do It", icon: Settings },
                { id: "howToApplyIt", label: "🌱 How to Apply It", icon: Sprout },
                { id: "howToRunIt", label: "⚙️ How to Run It", icon: Cpu },
                { id: "maintenance", label: "🔧 Maintenance Schedule", icon: Wrench },
                { id: "costs", label: "💰 Costs & Subsidies", icon: Coins },
                { id: "expert", label: "🌾 Expert Advice", icon: Sparkles },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeModalTab === tab.id
                      ? "bg-white dark:bg-gradient-to-r from-cyan-700 to-teal-700 text-[#083344] dark:text-white shadow-xs font-extrabold"
                      : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Body Content (Scrollable) */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {modalLoading ? (
                <div className="p-16 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
                  <div className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                    Connecting to Real-Time AI Agronomic Engine...
                  </div>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Retrieving installation blueprints, daily operating pressure, fertigation protocols, and maintenance schedules.
                  </p>
                </div>
              ) : modalData ? (
                <>
                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 text-[#083344] dark:text-cyan-100 text-xs sm:text-sm leading-relaxed">
                    <strong>Overview: </strong>
                    {modalData.summary}
                  </div>

                  {/* TAB 1: HOW TO DO IT */}
                  {activeModalTab === "howToDoIt" && (
                    <div className="space-y-4">
                      <div className="border-b border-stone-200 dark:border-cyan-800 pb-2 flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                          🛠️ Step-by-Step Implementation Guide
                        </h3>
                        <span className="text-xs text-cyan-700 dark:text-cyan-400 font-semibold">
                          {modalData.howToDoIt.length} Steps
                        </span>
                      </div>

                      <div className="space-y-3">
                        {modalData.howToDoIt.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 flex gap-3.5 items-start"
                          >
                            <span className="w-7 h-7 rounded-xl bg-gradient-to-r from-cyan-700 to-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
                              {item.step}
                            </span>
                            <div className="space-y-1 flex-1">
                              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                                {item.title}
                              </h4>
                              <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: HOW TO APPLY IT */}
                  {activeModalTab === "howToApplyIt" && (
                    <div className="space-y-5">
                      <div className="border-b border-stone-200 dark:border-cyan-800 pb-2">
                        <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                          🌱 Field Setup & Crop Suitability
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 space-y-1.5">
                          <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-cyan-700" />
                            <span>Field & Bed Preparation</span>
                          </h4>
                          <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed">
                            {modalData.howToApplyIt.fieldSetup}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 space-y-1.5">
                          <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                            <Sprout className="w-4 h-4 text-cyan-700" />
                            <span>Soil Requirements</span>
                          </h4>
                          <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed">
                            {modalData.howToApplyIt.soilRequirements}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 space-y-2">
                        <h4 className="font-bold text-stone-900 dark:text-stone-100">
                          🌾 Recommended Compatible Crops
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {modalData.howToApplyIt.suitableCrops.map((crop, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-xl bg-cyan-100 dark:bg-cyan-900 text-cyan-950 dark:text-cyan-100 font-bold text-xs"
                            >
                              ✓ {crop}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 text-xs">
                        <strong>Terrain Suitability: </strong>
                        <span className="text-stone-700 dark:text-stone-300">
                          {modalData.howToApplyIt.suitableTerrain}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: HOW TO RUN IT */}
                  {activeModalTab === "howToRunIt" && (
                    <div className="space-y-4">
                      <div className="border-b border-stone-200 dark:border-cyan-800 pb-2">
                        <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                          ⚙️ Daily Operational Workflow & Operating Parameters
                        </h3>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 space-y-2">
                        <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-cyan-700" />
                          <span>Daily Operational Checklist</span>
                        </h4>
                        <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed">
                          {modalData.howToRunIt.dailyOperation}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 space-y-2">
                        <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-cyan-700" />
                          <span>Key Operating Parameters & Pressures</span>
                        </h4>
                        <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed">
                          {modalData.howToRunIt.operatingParameters}
                        </p>
                      </div>

                      {modalData.howToRunIt.fertigationWorkflow && (
                        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 space-y-2">
                          <h4 className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-600" />
                            <span>Fertigation & Nutritional Schedule</span>
                          </h4>
                          <p className="text-blue-950 dark:text-blue-100 text-xs leading-relaxed">
                            {modalData.howToRunIt.fertigationWorkflow}
                          </p>
                        </div>
                      )}

                      {modalData.howToRunIt.bestTimeOfDay && (
                        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 text-xs flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            <strong>Optimal Time of Day: </strong>
                            {modalData.howToRunIt.bestTimeOfDay}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: MAINTENANCE SCHEDULE */}
                  {activeModalTab === "maintenance" && (
                    <div className="space-y-5">
                      <div className="border-b border-stone-200 dark:border-cyan-800 pb-2 flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                          🔧 Routine Maintenance Schedule & Courses
                        </h3>
                        <span className="text-xs text-stone-400">Preventive Care</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {modalData.maintenance.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-gradient-to-r from-cyan-700 to-teal-700 text-cyan-950 dark:text-white font-extrabold text-[11px]">
                                {m.period}
                              </span>
                              {m.priority && (
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    m.priority === "High"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-stone-100 text-stone-600"
                                  }`}
                                >
                                  {m.priority} Priority
                                </span>
                              )}
                            </div>
                            <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed pt-1">
                              {m.action}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Troubleshooting section */}
                      {modalData.troubleshooting && modalData.troubleshooting.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>Common Field Bottlenecks & Troubleshooting</span>
                          </h4>
                          <div className="space-y-2">
                            {modalData.troubleshooting.map((t, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-1 text-xs"
                              >
                                <strong className="text-amber-950 dark:text-amber-200">Issue: {t.issue}</strong>
                                <p className="text-stone-700 dark:text-stone-300">
                                  <strong>Remedy: </strong>{t.remedy}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: COSTS & SUBSIDIES */}
                  {activeModalTab === "costs" && (
                    <div className="space-y-5">
                      <div className="border-b border-stone-200 dark:border-cyan-800 pb-2">
                        <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                          💰 Economics, Capital Investment & Government Subsidies
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 space-y-1">
                          <div className="text-xs text-stone-500">Estimated Cost per Acre</div>
                          <div className="text-xl sm:text-2xl font-extrabold text-cyan-800 dark:text-cyan-300">
                            {modalData.costsAndSubsidies.costPerAcre}
                          </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 space-y-1">
                          <div className="text-xs text-stone-500">Payback & ROI Period</div>
                          <div className="text-xl sm:text-2xl font-extrabold text-teal-800 dark:text-teal-300">
                            {modalData.costsAndSubsidies.paybackPeriod}
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 space-y-3">
                        <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-cyan-700" />
                          <span>Government Schemes & Financial Assistance</span>
                        </h4>
                        <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed">
                          {modalData.costsAndSubsidies.governmentSubsidies}
                        </p>

                        {modalData.costsAndSubsidies.schemes && (
                          <div className="pt-2">
                            <div className="text-xs font-semibold text-stone-500 mb-1.5">Applicable Schemes:</div>
                            <div className="flex flex-wrap gap-2">
                              {modalData.costsAndSubsidies.schemes.map((s, idx) => (
                                <Link
                                  key={idx}
                                  href="/govt-schemes"
                                  className="px-3 py-1 rounded-xl bg-white dark:bg-gradient-to-r from-cyan-700 to-teal-700 border border-cyan-300 dark:border-cyan-700 text-cyan-950 dark:text-cyan-200 text-xs font-bold hover:underline"
                                >
                                  🏛️ {s} →
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: EXPERT ADVICE */}
                  {activeModalTab === "expert" && (
                    <div className="space-y-5">
                      <div className="border-b border-stone-200 dark:border-cyan-800 pb-2">
                        <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                          🌾 ICAR Agronomic Advisory & Key Best Practices
                        </h3>
                      </div>

                      <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/30 dark:to-teal-900/30 border border-cyan-300 dark:border-cyan-700 space-y-3">
                        <div className="flex items-center gap-2 font-extrabold text-sm text-cyan-950 dark:text-cyan-200">
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                          <span>Senior Agronomist Field Recommendations</span>
                        </div>
                        <p className="text-[#083344] dark:text-cyan-100 text-xs sm:text-sm leading-relaxed">
                          {modalData.expertAdvice}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        📍 <strong>KVK Consultation:</strong> For on-field technical assistance, flow rate testing, and subsidy document verification, visit your District Krishi Vigyan Kendra (KVK) or Assistant Director of Agriculture (Micro-Irrigation).
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-12 text-center text-stone-400">
                  No data available for this farming method.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-stone-50 dark:bg-[#082933] border-t border-stone-200 dark:border-cyan-800 flex items-center justify-between gap-3 shrink-0">
              <div className="text-[11px] text-stone-500 hidden sm:block">
                ⚡ Real-time updates powered by Grok AI & ICAR Database
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-200 dark:bg-cyan-900 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close Pop-Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Swaah Voice Assistant Pop-Up Modal and Floating Launcher */}
      <SwaahVoiceAssistant
        isOpen={isSwaahOpen}
        onClose={() => setIsSwaahOpen(false)}
        initialMethod={swaahActiveMethod}
        initialLanguage={swaahLang}
      />
    </div>
  );
}
