"use client";

import React from "react";
import Link from "next/link";
import { governmentSchemes } from "../../../lib/data/schemes-data";
import { ArrowLeft, ExternalLink, CheckCircle2, FileText, ShieldAlert } from "lucide-react";

export default function PMFBYPage() {
  const scheme = governmentSchemes.find((s) => s.id === "pmfby")!;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24">
      <Link
        href="/govt-schemes"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-800 dark:text-cyan-300 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Schemes</span>
      </Link>

      <div className="bg-[#FFFEFD] dark:bg-[#082933] rounded-3xl p-6 sm:p-10 border border-[#EAE3D5] dark:border-cyan-800 shadow-xl space-y-8">
        <div className="space-y-3 pb-6 border-b border-[#EAE3D5] dark:border-cyan-800">
          <div className="flex items-center justify-between">
            <span className="text-4xl">🛡️</span>
            <a
              href="https://www.pmfby.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <span>Visit PMFBY Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            PRADHAN MANTRI FASAL BIMA YOJANA (PMFBY)
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-cyan-700 dark:text-cyan-400">
            Comprehensive Crop Loss Protection from Sowing to Post-Harvest
          </p>
        </div>

        {/* Farmer Premium Rates Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
            <div className="font-extrabold text-lg text-amber-900 dark:text-amber-200">2.0%</div>
            <div className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">All Kharif Food & Oilseeds</div>
          </div>
          <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 text-center">
            <div className="font-extrabold text-lg text-cyan-900 dark:text-cyan-200">1.5%</div>
            <div className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">All Rabi Food & Oilseeds</div>
          </div>
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 text-center">
            <div className="font-extrabold text-lg text-teal-900 dark:text-teal-200">5.0%</div>
            <div className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">Annual Commercial / Horticulture</div>
          </div>
        </div>

        {/* Coverage Stages */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            Coverage against Natural Calamities:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-700 dark:text-stone-300">
            <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-cyan-900/20 border border-[#EAE3D5] dark:border-cyan-800">
              <strong>1. Prevented Sowing / Planting Risk:</strong> Deficit rainfall or adverse seasonal conditions preventing sowing.
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-cyan-900/20 border border-[#EAE3D5] dark:border-cyan-800">
              <strong>2. Standing Crop (Sowing to Harvest):</strong> Comprehensive drought, dry spells, flood, pest attack, and hailstorm.
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-cyan-900/20 border border-[#EAE3D5] dark:border-cyan-800">
              <strong>3. Post-Harvest Losses:</strong> Coverage for up to 14 days for produce kept in 'cut and spread' condition in field.
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-cyan-900/20 border border-[#EAE3D5] dark:border-cyan-800">
              <strong>4. Localized Calamities:</strong> Loss caused by hailstorm, landslide, inundation, and cloudburst affecting isolated plots.
            </div>
          </div>
        </div>

        {/* Claim Window Notification */}
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-900 dark:text-red-200 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
          <p>
            <strong>72-Hour Intimation Rule:</strong> In case of localized crop loss or mid-season calamity, the farmer must inform within 72 hours through the Crop Insurance App, Toll-Free Number, or nearest bank/CSC.
          </p>
        </div>

        {/* Application Process */}
        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            🏦 How to Apply on National Crop Insurance Portal
          </h3>
          <div className="space-y-3">
            {scheme.stepByStepProcess.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-900/20 border border-[#EAE3D5] dark:border-cyan-800">
                <span className="w-6 h-6 rounded-full bg-cyan-800 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  {i + 1}
                </span>
                <span className="text-stone-700 dark:text-stone-300 leading-relaxed pt-0.5">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Link */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#083344] via-[#0E4A5C] to-[#042129] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm">Pradhan Mantri Fasal Bima Yojana Portal:</div>
            <div className="text-xs text-cyan-200">Calculate premium and submit policy at https://www.pmfby.gov.in/</div>
          </div>
          <a
            href="https://www.pmfby.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-[#083344] font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow"
          >
            <span>Open PMFBY Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
