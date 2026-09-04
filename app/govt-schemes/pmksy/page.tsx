"use client";

import React from "react";
import Link from "next/link";
import { governmentSchemes } from "../../../lib/data/schemes-data";
import { ArrowLeft, ExternalLink, CheckCircle2, FileText, Droplets, ShieldCheck } from "lucide-react";

export default function PMKSYPage() {
  const scheme = governmentSchemes.find((s) => s.id === "pmksy")!;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24">
      <Link
        href="/govt-schemes"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Schemes</span>
      </Link>

      <div className="bg-white dark:bg-emerald-950 rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-emerald-800 shadow-xl space-y-8">
        <div className="space-y-3 pb-6 border-b border-stone-200 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <span className="text-4xl">💧</span>
            <a
              href="https://www.pmksy.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <span>Visit PMKSY National Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            PRADHAN MANTRI KRISHI SINCHAYI YOJANA (PMKSY)
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            Theme: "Har Khet Ko Pani" • Sub-Theme: "Per Drop More Crop"
          </p>
        </div>

        {/* 4 Pillars of PMKSY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 space-y-1">
            <div className="font-bold text-cyan-900 dark:text-cyan-200">1. Per Drop More Crop (PDMC)</div>
            <p className="text-stone-600 dark:text-stone-300">
              Precision micro-irrigation systems (Drip and Sprinkler) providing up to 55% direct financial subsidy for small & marginal farmers.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-1">
            <div className="font-bold text-blue-900 dark:text-blue-200">2. Har Khet Ko Pani (HKKP)</div>
            <p className="text-stone-600 dark:text-stone-300">
              Creating new water sources through minor irrigation, command area development, and reviving traditional water bodies.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1">
            <div className="font-bold text-emerald-900 dark:text-emerald-200">3. Accelerated Irrigation Benefit (AIBP)</div>
            <p className="text-stone-600 dark:text-stone-300">
              Expedited completion of major and medium canal irrigation infrastructure across river valley basins.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1">
            <div className="font-bold text-amber-900 dark:text-amber-200">4. Watershed Development</div>
            <p className="text-stone-600 dark:text-stone-300">
              Rainwater harvesting, contour bunding, farm ponds, and soil moisture conservation on rainfed arable lands.
            </p>
          </div>
        </div>

        {/* Subsidy Info */}
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-100 space-y-2">
          <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
            💰 Micro-Irrigation Subsidy Scale
          </h3>
          <p className="leading-relaxed">
            • <strong>Small & Marginal Farmers:</strong> Up to 55% financial assistance for installing Drip / Micro-Sprinkler kits.<br />
            • <strong>Other Farmers:</strong> Up to 45% financial assistance with DBT disbursement directly to approved vendor/farmer bank account.
          </p>
        </div>

        {/* Eligibility Criteria */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Eligibility Criteria</span>
          </h3>
          <ul className="space-y-2 text-stone-600 dark:text-stone-300">
            {scheme.eligibility.map((el, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{el}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Application Process */}
        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            🏦 Step-by-Step Subsidy Application Process
          </h3>
          <div className="space-y-3">
            {scheme.stepByStepProcess.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  {i + 1}
                </span>
                <span className="text-stone-700 dark:text-stone-300 leading-relaxed pt-0.5">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Link */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-900 to-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm">Pradhan Mantri Krishi Sinchayi Yojana National Portal:</div>
            <div className="text-xs text-teal-200">Visit https://www.pmksy.gov.in/ for circulars and state MIS links</div>
          </div>
          <a
            href="https://www.pmksy.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow"
          >
            <span>Open PMKSY Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
