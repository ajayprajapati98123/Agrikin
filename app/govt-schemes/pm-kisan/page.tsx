"use client";

import React from "react";
import Link from "next/link";
import { governmentSchemes } from "../../../lib/data/schemes-data";
import { ArrowLeft, ExternalLink, CheckCircle2, FileText, AlertCircle, Building2 } from "lucide-react";

export default function PMKisanPage() {
  const scheme = governmentSchemes.find((s) => s.id === "pm-kisan")!;

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
        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-stone-200 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <span className="text-4xl">{scheme.icon}</span>
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <span>Visit Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            {scheme.fullName}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {scheme.theme} • {scheme.tagline}
          </p>
        </div>

        {/* Financial Support Card */}
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-100 space-y-2">
          <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
            <span>💰 Financial Benefits</span>
          </h3>
          <p className="leading-relaxed">{scheme.financialSupport}</p>
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

        {/* Documents Required */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Documents Required</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scheme.documentsRequired.map((doc, i) => (
              <div key={i} className="p-3 rounded-xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-stone-800 dark:text-stone-200">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Official Application Process */}
        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            🏦 Official Step-by-Step Application Process
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

        {/* Official Portal Direct Action */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm">To register for PM-Kisan Samman Nidhi Scheme:</div>
            <div className="text-xs text-blue-200">Open the official portal in a new tab: https://pmkisan.gov.in/</div>
          </div>
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow"
          >
            <span>Click Here</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Mandatory Note */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200">
          <strong>Important:</strong> Benefits, eligibility and financial terms are subject to current government guidelines. ȺցɾìҠìղ is not an official Government of India website.
        </div>
      </div>
    </div>
  );
}
