"use client";

import React, { useState } from "react";
import Link from "next/link";
import { governmentSchemes } from "../../lib/data/schemes-data";
import { Building2, ExternalLink, ArrowRight, CheckCircle2, ShieldCheck, Search } from "lucide-react";

export default function GovernmentSchemesHub() {
  const [search, setSearch] = useState("");

  const filtered = governmentSchemes.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.theme.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-yellow-400" />
            <span>Official Government of India Schemes Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Government Agricultural Schemes
          </h1>
          <p className="text-xs sm:text-sm text-blue-200/90 max-w-2xl leading-relaxed">
            Direct, verified walkthroughs for India's major agricultural welfare, micro-irrigation subsidies, crop insurance, and institutional credit programs.
          </p>
        </div>

        <div className="shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-1">
          <div className="text-yellow-300 font-bold">🏛️ Authentic Portals</div>
          <div className="text-stone-300">All links open official .gov.in websites</div>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="leading-relaxed">
          <strong>Official Transparency Notice:</strong> ȺցɾìҠìղ is an independent agricultural technology platform and is not an official Government of India website. All scheme procedures, application steps, and subsidies link directly to authentic national departments. Benefits and financial terms are subject to current government guidelines.
        </p>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search schemes by name or keyword..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((scheme) => (
          <div
            key={scheme.id}
            className="p-6 rounded-3xl bg-white dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200">
                  {scheme.icon}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                  Central Scheme
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100">
                  {scheme.name}
                </h3>
                <p className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold mt-0.5">
                  {scheme.theme}
                </p>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                {scheme.summary}
              </p>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-100 dark:border-emerald-800 text-xs text-stone-800 dark:text-stone-200 font-medium">
                💰 <strong>Assistance:</strong> {scheme.financialSupport}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-emerald-800/80 flex items-center justify-between gap-3">
              <Link
                href={`/govt-schemes/${scheme.slug}`}
                className="flex-1 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Process</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-stone-200 dark:border-emerald-800 hover:bg-stone-50 text-stone-600 dark:text-stone-300"
                title="Visit Official Government Portal"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
