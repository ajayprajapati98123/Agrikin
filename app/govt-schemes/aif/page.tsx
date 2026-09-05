"use client";

import React from "react";
import Link from "next/link";
import { governmentSchemes } from "../../../lib/data/schemes-data";
import { ArrowLeft, ExternalLink, CheckCircle2, FileText } from "lucide-react";

export default function AIFPage() {
  const scheme = governmentSchemes.find((s) => s.id === "aif")!;

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
            <span className="text-4xl">{scheme.icon}</span>
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <span>Visit Official AIF Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            {scheme.fullName}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-cyan-700 dark:text-cyan-400">
            {scheme.theme} • {scheme.tagline}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-950 dark:text-cyan-100 space-y-2">
          <h3 className="font-bold text-sm text-cyan-900 dark:text-cyan-300">
            💰 Financial Support & Interest Subvention
          </h3>
          <p className="leading-relaxed">{scheme.financialSupport}</p>
        </div>

        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-600" />
            <span>Eligible Beneficiaries & Projects</span>
          </h3>
          <ul className="space-y-2 text-stone-600 dark:text-stone-300">
            {scheme.eligibility.map((el, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="text-cyan-600 font-bold">•</span>
                <span>{el}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cyan-700" />
            <span>Documents Required</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scheme.documentsRequired.map((doc, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-cyan-900/20 border border-[#EAE3D5] dark:border-cyan-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="text-stone-800 dark:text-stone-200">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            🏦 Application Walkthrough
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

        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#083344] via-[#0E4A5C] to-[#042129] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm">Agriculture Infrastructure Fund Official Portal:</div>
            <div className="text-xs text-cyan-200">Apply online via https://agriinfra.dac.gov.in/</div>
          </div>
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-[#083344] font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow"
          >
            <span>Open AIF Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200">
          <strong>Notice:</strong> Benefits, eligibility and financial terms are subject to current government guidelines. ȺցɾìҠìղ is not an official Government of India website.
        </div>
      </div>
    </div>
  );
}
