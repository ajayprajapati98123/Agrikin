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
      <div className="rounded-3xl bg-gradient-to-br from-[#083344] via-[#0E5266] to-[#042129] text-white p-8 sm:p-10 shadow-xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-cyan-300" />
            <span>Official Government of India Schemes Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Government Agricultural Schemes
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/90 max-w-2xl leading-relaxed">
            Direct, verified walkthroughs for India's major agricultural welfare, micro-irrigation subsidies, crop insurance, and institutional credit programs.
          </p>
        </div>

        <div className="shrink-0 bg-[#062834]/80 backdrop-blur-md p-4 rounded-2xl border border-cyan-400/20 text-xs space-y-1 relative z-10 shadow-md">
          <div className="text-cyan-300 font-bold">🏛️ Authentic Portals</div>
          <div className="text-stone-300">All links open official .gov.in websites</div>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#EAE3D5] text-stone-800 text-xs flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-700 shrink-0" />
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
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#EAE3D5] bg-[#FFFEFD] text-stone-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((scheme) => (
          <div
            key={scheme.id}
            className="p-6 rounded-3xl bg-[#FFFEFD] border border-[#EAE3D5] shadow-sm hover:shadow-lg hover:border-cyan-400 transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2.5 bg-cyan-50 rounded-2xl border border-cyan-200">
                  {scheme.icon}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-900 border border-cyan-200">
                  Central Scheme
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-stone-900">
                  {scheme.name}
                </h3>
                <p className="text-[11px] text-cyan-700 font-semibold mt-0.5">
                  {scheme.theme}
                </p>
              </div>

              <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                {scheme.summary}
              </p>

              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EAE3D5] text-xs text-stone-800 font-medium">
                💰 <strong>Assistance:</strong> {scheme.financialSupport}
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE3D5] flex items-center justify-between gap-3">
              <Link
                href={`/govt-schemes/${scheme.slug}`}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>View Process</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-[#EAE3D5] hover:bg-[#FAF7F0] text-stone-600 transition-colors"
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
