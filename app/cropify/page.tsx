"use client";

import React, { useState } from "react";
import { AIService } from "../../lib/services/ai.service";
import { CropRecommendation } from "../../lib/types";
import { indianStatesAndDistricts } from "../../lib/services/location.service";
import {
  Sprout,
  Sparkles,
  ArrowRight,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  Compass,
  RotateCw,
  Layers,
  Thermometer,
} from "lucide-react";

export default function CropifyPage() {
  const [formData, setFormData] = useState({
    state: "Punjab",
    district: "Ludhiana",
    region: "North India",
    soilType: "Alluvial Loam",
    season: "Kharif",
    waterAvailability: "Moderate (Tubewell / Canal)",
    landArea: "10 Acres",
    previousCrop: "Wheat",
    farmingObjective: "High Remuneration & Soil Health",
  });

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendation[] | null>(null);

  const selectedStateObj = indianStatesAndDistricts.find((s) => s.state === formData.state);
  const districtOptions = selectedStateObj ? selectedStateObj.districts : ["Ludhiana", "Amritsar"];

  const handleRecommend = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const results = AIService.recommendCrops(formData);
      setRecommendations(results);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-green-950 text-white p-8 sm:p-10 shadow-xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-semibold">
            <Sprout className="w-3.5 h-3.5 text-yellow-400" />
            <span>AI Agronomic Suitability Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Cropify: Find the Right Crop for Your Land
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            Eliminate trial-and-error. Input your geographical district, soil characteristics, water availability, and prior rotation to receive mathematically ranked crop suitability models.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-1 shrink-0">
          <div className="text-yellow-300 font-bold">🌾 11+ Indian Crops Analyzed</div>
          <div className="text-emerald-200">Cereals, Oilseeds, Pulses & Millets</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-emerald-950 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-emerald-800 shadow-sm space-y-5">
          <div>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
              Field & Soil Parameters
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Enter real conditions to calculate estimated suitability.
            </p>
          </div>

          <form onSubmit={handleRecommend} className="space-y-4 text-xs">
            {/* State & District */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => {
                    const st = indianStatesAndDistricts.find((s) => s.state === e.target.value);
                    setFormData({
                      ...formData,
                      state: e.target.value,
                      district: st ? st.districts[0] : "Ludhiana",
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
                >
                  {indianStatesAndDistricts.map((s) => (
                    <option key={s.state} value={s.state}>{s.state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">District</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
                >
                  {districtOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Region & Season */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Geographic Region</label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
                >
                  <option value="North India">North India (Indo-Gangetic)</option>
                  <option value="South India">South India (Peninsular)</option>
                  <option value="Central India">Central India (Plateau)</option>
                  <option value="West India">West India (Arid / Semi-Arid)</option>
                  <option value="East India">East India (Delta & Coastal)</option>
                  <option value="Northeast India">Northeast India (Hilly)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Cropping Season</label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
                >
                  <option value="Kharif">Kharif (Monsoon / Autumn)</option>
                  <option value="Rabi">Rabi (Winter / Spring)</option>
                  <option value="Zaid">Zaid (Summer)</option>
                  <option value="Year-round">Year-round / Perennial</option>
                </select>
              </div>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Soil Texture / Type</label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
              >
                <option value="Alluvial Loam">Alluvial Loam (High Fertility, Indo-Gangetic)</option>
                <option value="Black Cotton Soil">Black Cotton Soil (Heavy Clay, Moisture Retentive)</option>
                <option value="Red Sandy Loam">Red Sandy Loam (Well-Drained, Iron Rich)</option>
                <option value="Laterite Soil">Laterite Soil (Porous, Acidic to Neutral)</option>
                <option value="Clayey Deltaic">Clayey Deltaic (Wetland / Paddy Suitable)</option>
                <option value="Desert Sandy Soil">Desert Sandy Soil (Low Organic, High Infiltration)</option>
              </select>
            </div>

            {/* Water Availability */}
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Water Availability</label>
              <select
                value={formData.waterAvailability}
                onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
              >
                <option value="Abundant (Assured Canal + Borewell)">Abundant (Assured Canal + Borewell)</option>
                <option value="Moderate (Tubewell / Canal)">Moderate (Tubewell / Canal)</option>
                <option value="Rainfed / Deficit (Dryland Farming)">Rainfed / Deficit (Dryland Farming)</option>
              </select>
            </div>

            {/* Previous Crop & Land Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Previous Crop</label>
                <input
                  type="text"
                  value={formData.previousCrop}
                  onChange={(e) => setFormData({ ...formData, previousCrop: e.target.value })}
                  placeholder="e.g. Wheat, Paddy, Cotton"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Cultivable Area</label>
                <input
                  type="text"
                  value={formData.landArea}
                  onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                  placeholder="e.g. 5 Acres"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            {/* Objective */}
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Farming Objective</label>
              <select
                value={formData.farmingObjective}
                onChange={(e) => setFormData({ ...formData, farmingObjective: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
              >
                <option value="High Remuneration & Soil Health">High Remuneration & Soil Health</option>
                <option value="Water Conservation & Low Input">Water Conservation & Low Input Cost</option>
                <option value="Household Food Security & Dairy Fodder">Household Food Security & Dairy Fodder</option>
                <option value="Export & Mandi Premium">Export & Mandi Premium Grading</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Calculating Agronomic Scores...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Recommend Best Crops</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Recommendations (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {recommendations ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100">
                  Ranked Crop Recommendations for Your Land
                </h3>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-full">
                  {recommendations.length} Matches Found
                </span>
              </div>

              <div className="space-y-5">
                {recommendations.map((rec, index) => (
                  <div
                    key={rec.cropName}
                    className="p-6 rounded-3xl bg-white dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800 shadow-sm space-y-4 hover:shadow-md transition-all"
                  >
                    {/* Top Row: Crop Name, Hindi Name, Suitability % */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-extrabold flex items-center justify-center">
                            #{index + 1}
                          </span>
                          <h4 className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
                            {rec.cropName}
                          </h4>
                          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            ({rec.hindiName})
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                          {rec.reason}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
                          {rec.suitabilityScore}%
                        </div>
                        <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                          Estimated Suitability
                        </div>
                      </div>
                    </div>

                    {/* Agronomic Matrix Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-2 border-t border-stone-100 dark:border-emerald-900">
                      <div className="p-2 rounded-xl bg-stone-50 dark:bg-emerald-900/30">
                        <div className="text-[10px] text-stone-400">Duration</div>
                        <div className="font-bold text-stone-800 dark:text-stone-200">{rec.growthCycleDays}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-stone-50 dark:bg-emerald-900/30">
                        <div className="text-[10px] text-stone-400">Water Req.</div>
                        <div className="font-bold text-stone-800 dark:text-stone-200">{rec.waterRequirement}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-stone-50 dark:bg-emerald-900/30">
                        <div className="text-[10px] text-stone-400">Season</div>
                        <div className="font-bold text-stone-800 dark:text-stone-200">{rec.season.split(" ")[0]}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-stone-50 dark:bg-emerald-900/30">
                        <div className="text-[10px] text-stone-400">Irrigation</div>
                        <div className="font-bold text-emerald-700 dark:text-emerald-400 truncate">{rec.irrigationMethod.split(" ")[0]}</div>
                      </div>
                    </div>

                    {/* Risk Factors & Rotation Tips */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-stone-100 dark:border-emerald-900">
                      <div className="space-y-1">
                        <strong className="text-amber-800 dark:text-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Watch For:
                        </strong>
                        <ul className="text-stone-600 dark:text-stone-300 list-disc list-inside space-y-0.5">
                          {rec.riskFactors.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <strong className="text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <RotateCw className="w-3.5 h-3.5" /> Crop Rotation:
                        </strong>
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                          {rec.cropRotationConsiderations}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cropify Disclaimer */}
              <div className="p-4 rounded-2xl bg-stone-100 dark:bg-emerald-950/60 border border-stone-200 dark:border-emerald-800 text-[11px] text-stone-500 text-center leading-relaxed">
                ⚖️ <strong>Agronomic Notice:</strong> Suitability scores are estimated based on provided regional parameters. Actual crop yields are contingent on local microclimates, farm management, certified seed vigor, and pest surveillance.
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[420px] rounded-3xl bg-stone-50 dark:bg-emerald-950/40 border-2 border-dashed border-stone-200 dark:border-emerald-800 flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-3">
              <Sprout className="w-14 h-14 text-stone-300 dark:text-emerald-700" />
              <div className="font-bold text-sm text-stone-700 dark:text-stone-300">
                Ready to Analyze Your Farm's Potential
              </div>
              <p className="text-xs max-w-sm text-stone-400">
                Complete the field parameters on the left and click "Recommend Best Crops" to trigger the multi-factor agronomy evaluation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
