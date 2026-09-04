"use client";

import React, { useState } from "react";
import Link from "next/link";
import { irrigationMethods } from "../../lib/data/irrigation-data";
import { cropsDatabase } from "../../lib/data/crop-database";
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
} from "lucide-react";

export default function FarmingMethodsPage() {
  const [selectedMethodId, setSelectedMethodId] = useState<string>("drip-irrigation");
  const [selectedCropId, setSelectedCropId] = useState<string>("wheat");

  const currentMethod = irrigationMethods.find((m) => m.id === selectedMethodId) || irrigationMethods[0];
  const currentCrop = cropsDatabase.find((c) => c.id === selectedCropId) || cropsDatabase[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-cyan-900 via-teal-900 to-emerald-950 text-white p-8 sm:p-10 shadow-xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-semibold">
            <Droplets className="w-3.5 h-3.5 text-cyan-300" />
            <span>Water Conservation & Yield Optimization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Modern Farming & Irrigation Knowledge Center
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/90 max-w-2xl leading-relaxed">
            Master high-efficiency micro-irrigation systems, fertigation automation, and crop-specific modern agronomic protocols to maximize every drop of water.
          </p>
        </div>

        <Link
          href="/farming-methods/irrigation"
          className="px-5 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-emerald-950 font-extrabold text-xs shadow-md transition-all self-start md:self-auto flex items-center gap-2"
        >
          <span>Direct Irrigation Guide</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* SECTION 1: MODERN METHODS OF IRRIGATION */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 dark:border-emerald-800 pb-4">
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Modern Methods of Irrigation</span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
              4 Core Systems
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Compare water efficiency, suitable terrain, installation costs, and maintenance protocols.
          </p>
        </div>

        {/* Irrigation Method Selection Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {irrigationMethods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMethodId(m.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                selectedMethodId === m.id
                  ? "bg-emerald-800 text-white border-emerald-800 shadow-md scale-[1.02]"
                  : "bg-white dark:bg-emerald-950 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-emerald-800 hover:bg-emerald-50/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{m.icon}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedMethodId === m.id
                      ? "bg-white/20 text-white"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {m.waterEfficiencyPercent}% Efficiency
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-snug">{m.name}</h3>
                <div className={`text-[11px] mt-0.5 ${selectedMethodId === m.id ? "text-emerald-200" : "text-stone-400"}`}>
                  {m.hindiName}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Irrigation Method Deep-Dive Card */}
        <div className="bg-white dark:bg-emerald-950 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-emerald-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-emerald-800">
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

            <div className="bg-emerald-50 dark:bg-emerald-900/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center shrink-0">
              <div className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
                {currentMethod.waterEfficiency}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Estimated Water Savings</div>
            </div>
          </div>

          {/* Working Principle & Suitability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                ⚙️ Working Mechanism
              </h4>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-stone-100 dark:border-emerald-800">
                {currentMethod.howItWorks}
              </p>
              <div>
                <strong>Suitable Terrain: </strong>
                <span className="text-stone-600 dark:text-stone-300">{Array.isArray(currentMethod.suitableTerrain) ? currentMethod.suitableTerrain.join(", ") : currentMethod.suitableTerrain}</span>
              </div>
              <div>
                <strong>Typical Cost: </strong>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{currentMethod.installationCost}</span>
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
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-medium"
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

          {/* Advantages vs Limitations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-4 border-t border-stone-200 dark:border-emerald-800">
            {/* Advantages */}
            <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 space-y-2">
              <h4 className="font-bold text-sm text-green-900 dark:text-green-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Agronomic Advantages</span>
              </h4>
              <ul className="space-y-1.5 text-stone-700 dark:text-stone-300">
                {currentMethod.advantages.map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitations */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-amber-600" />
                <span>Limitations & Bottlenecks</span>
              </h4>
              <ul className="space-y-1.5 text-stone-700 dark:text-stone-300">
                {currentMethod.limitations.map((lim, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-amber-600 font-bold">!</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Maintenance & Automation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-4 border-t border-stone-200 dark:border-emerald-800">
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-stone-500" />
                <span>Maintenance Guidelines</span>
              </h4>
              <ul className="space-y-1 text-stone-600 dark:text-stone-300 list-disc list-inside">
                {currentMethod.maintenanceGuidelines.map((g, idx) => (
                  <li key={idx} className="leading-relaxed">{g}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>Smart Automation Possibilities</span>
              </h4>
              <ul className="space-y-1 text-stone-600 dark:text-stone-300 list-disc list-inside">
                {currentMethod.automationPossibilities.map((a, idx) => (
                  <li key={idx} className="leading-relaxed">{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CROP-SPECIFIC MODERN FARMING PRACTICES */}
      <section className="space-y-6 pt-6 border-t border-stone-200 dark:border-emerald-800">
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
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCropId === crop.id
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-white dark:bg-emerald-950 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-emerald-800 hover:bg-emerald-50"
              }`}
            >
              {crop.name} ({crop.hindiName})
            </button>
          ))}
        </div>

        {/* Selected Crop Guide Details */}
        <div className="bg-white dark:bg-emerald-950 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-emerald-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-emerald-800">
            <div>
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
                {currentCrop.name} ({currentCrop.hindiName})
              </h3>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                Season: {currentCrop.season} • Duration: {currentCrop.durationDays} • Water: {currentCrop.waterRequirementMm}
              </div>
            </div>
            <div className="text-xs text-stone-500">
              <strong>Major States: </strong>{currentCrop.statesGrowing.join(", ")}
            </div>
          </div>

          {/* 8 Agronomic Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800 space-y-1">
              <strong className="text-stone-900 dark:text-stone-100">1. Seed & Variety Selection:</strong>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {currentCrop.farmingMethodGuide.seedVariety}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800 space-y-1">
              <strong className="text-stone-900 dark:text-stone-100">2. Planting & Sowing Method:</strong>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {currentCrop.farmingMethodGuide.plantingMethod}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800 space-y-1">
              <strong className="text-stone-900 dark:text-stone-100">3. Water Management:</strong>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {currentCrop.farmingMethodGuide.waterManagement}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800 space-y-1">
              <strong className="text-stone-900 dark:text-stone-100">4. Nutrient & Fertilizer Management:</strong>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {currentCrop.farmingMethodGuide.nutrientManagement}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800 space-y-1">
              <strong className="text-stone-900 dark:text-stone-100">5. Weed Management:</strong>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {currentCrop.farmingMethodGuide.weedManagement}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800 space-y-1">
              <strong className="text-stone-900 dark:text-stone-100">6. Pest & Disease Monitoring:</strong>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {currentCrop.farmingMethodGuide.pestMonitoring}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800 space-y-1">
              <strong className="text-stone-900 dark:text-stone-100">7. Mechanization:</strong>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {currentCrop.farmingMethodGuide.mechanization}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800 space-y-1">
              <strong className="text-stone-900 dark:text-stone-100">8. Harvest & Storage Considerations:</strong>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {currentCrop.farmingMethodGuide.harvestStorage}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
