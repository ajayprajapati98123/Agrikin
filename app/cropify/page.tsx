"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CropRecommendation } from "../../lib/types";
import { indianStatesAndDistricts } from "../../lib/services/location.service";
import {
  Sprout,
  Sparkles,
  ArrowRight,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Layers,
  Thermometer,
  TrendingUp,
  Coins,
  Activity,
  Wifi,
  ShieldCheck,
  Scale,
  CloudSun,
  Wind,
  Key,
  ChevronDown,
  Info,
  Calendar,
  ExternalLink,
} from "lucide-react";

interface LiveWeatherMeta {
  temperature: number;
  humidity: number;
  rainProbability: number;
  windSpeed: number;
  condition: string;
  isLiveSatellite: boolean;
}

interface SoilStatusMeta {
  nitrogenStatus: string;
  phosphorusStatus: string;
  potassiumStatus: string;
  phInterpretation: string;
}

interface LiveMeta {
  district: string;
  state: string;
  liveWeather: LiveWeatherMeta;
  soilStatus: SoilStatusMeta;
  aiAgronomistNote: string;
}

const defaultSoilProfiles: Record<string, { nitrogen: number; phosphorus: number; potassium: number; ph: number; moisture: number }> = {
  "Alluvial Loam": { nitrogen: 240, phosphorus: 45, potassium: 190, ph: 6.8, moisture: 45 },
  "Black Cotton Soil": { nitrogen: 180, phosphorus: 35, potassium: 280, ph: 7.8, moisture: 60 },
  "Red Sandy Loam": { nitrogen: 160, phosphorus: 28, potassium: 140, ph: 6.2, moisture: 30 },
  "Laterite Soil": { nitrogen: 140, phosphorus: 20, potassium: 110, ph: 5.5, moisture: 35 },
  "Clayey Deltaic": { nitrogen: 260, phosphorus: 50, potassium: 220, ph: 6.9, moisture: 70 },
  "Desert Sandy Soil": { nitrogen: 110, phosphorus: 15, potassium: 95, ph: 8.2, moisture: 15 },
};

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

  const [soilSensors, setSoilSensors] = useState({
    nitrogen: 240,
    phosphorus: 45,
    potassium: 190,
    ph: 6.8,
    moisture: 45,
  });

  const [customApiKey, setCustomApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendation[] | null>(null);
  const [liveMetadata, setLiveMetadata] = useState<LiveMeta | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedStateObj = indianStatesAndDistricts.find((s) => s.state === formData.state);
  const districtOptions = selectedStateObj ? selectedStateObj.districts : ["Ludhiana", "Amritsar"];

  const handleSoilTypeChange = (newSoilType: string) => {
    setFormData((prev) => ({ ...prev, soilType: newSoilType }));
    if (defaultSoilProfiles[newSoilType]) {
      setSoilSensors(defaultSoilProfiles[newSoilType]);
    }
  };

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cropify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: formData.state,
          district: formData.district,
          soilType: formData.soilType,
          season: formData.season,
          waterAvailability: formData.waterAvailability,
          landArea: formData.landArea,
          previousCrop: formData.previousCrop,
          farmingObjective: formData.farmingObjective,
          soilSensors,
          customApiKey: customApiKey.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
        setLiveMetadata(data.liveMetadata);
        setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      } else {
        throw new Error(data.error || "Failed to parse crop recommendations.");
      }
    } catch (err: any) {
      console.error("Error fetching crop recommendations:", err);
      setError(err.message || "Failed to load real-time recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData, soilSensors, customApiKey]);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleResetCalibration = () => {
    const profile = defaultSoilProfiles[formData.soilType] || defaultSoilProfiles["Alluvial Loam"];
    setSoilSensors(profile);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      {/* Brand & Engine Header */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950 text-white p-8 sm:p-10 shadow-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-serif tracking-widest text-emerald-400 font-extrabold text-sm uppercase px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40">
              ȺցɾìҠìղ
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-Time API & e-NAM Mandi Connected</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium">
              <Wifi className="w-3 h-3 text-blue-400" />
              <span>Open-Meteo Satellite Feed</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Cropify: Real-Time Crop & Mandi Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
            Harness real-time satellite weather, continuous APMC mandi price discovery, soil NPK telemetry, and ICAR agronomic models to identify the highest ROI crop for your acreage.
          </p>
        </div>

        <div className="bg-stone-900/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-xs space-y-2 shrink-0 relative z-10">
          <div className="text-emerald-400 font-bold flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Live Data Ingestion</span>
          </div>
          <div className="text-stone-300">
            Weather: <span className="text-white font-semibold">{liveMetadata?.liveWeather?.condition || "Live Satellite Sync"}</span>
          </div>
          <div className="text-stone-300">
            Telemetry District: <span className="text-emerald-300 font-semibold">{formData.district}, {formData.state}</span>
          </div>
          {lastUpdated && (
            <div className="text-[10px] text-stone-400 pt-1 border-t border-white/10">
              Last synced: {lastUpdated} IST
            </div>
          )}
        </div>
      </div>

      {/* Real-time Mandi Price Ticker Bar */}
      <div className="rounded-2xl bg-white dark:bg-emerald-950/60 border border-stone-200 dark:border-emerald-800/80 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-extrabold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Live Mandi Benchmark Rates (₹/Qtl)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <span className="font-semibold">Basmati Paddy:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">₹4,150</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">▲ +3.2%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <span className="font-semibold">Sharbati Wheat:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">₹2,780</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">▲ +1.8%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <span className="font-semibold">Mustard:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">₹5,950</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">▲ +4.1%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <span className="font-semibold">Bt Cotton:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">₹7,420</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">▲ +1.5%</span>
          </div>
        </div>

        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1.5 transition-colors disabled:opacity-50 ml-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Live Feed</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Telemetry Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-emerald-950 p-6 sm:p-7 rounded-3xl border border-stone-200 dark:border-emerald-800 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Field & Geography Parameters</span>
                </h3>
                <span className="text-[10px] bg-stone-100 dark:bg-emerald-900/60 text-stone-600 dark:text-stone-300 font-medium px-2 py-0.5 rounded-md">
                  Step 1
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Inputs configure satellite coordinates and microclimate algorithms.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchRecommendations();
              }}
              className="space-y-4 text-xs"
            >
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {districtOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Soil Type */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-stone-700 dark:text-stone-300">Soil Texture / Type</label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Auto-calibrates NPK</span>
                </div>
                <select
                  value={formData.soilType}
                  onChange={(e) => handleSoilTypeChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Alluvial Loam">Alluvial Loam (High Fertility, Indo-Gangetic)</option>
                  <option value="Black Cotton Soil">Black Cotton Soil (Heavy Clay, Moisture Retentive)</option>
                  <option value="Red Sandy Loam">Red Sandy Loam (Well-Drained, Iron Rich)</option>
                  <option value="Laterite Soil">Laterite Soil (Porous, Acidic to Neutral)</option>
                  <option value="Clayey Deltaic">Clayey Deltaic (Wetland / Paddy Suitable)</option>
                  <option value="Desert Sandy Soil">Desert Sandy Soil (Low Organic, High Infiltration)</option>
                </select>
              </div>

              {/* Season & Land Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Cropping Season</label>
                  <select
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Kharif">Kharif (Monsoon / Autumn)</option>
                    <option value="Rabi">Rabi (Winter / Spring)</option>
                    <option value="Zaid">Zaid (Summer)</option>
                    <option value="Year-round">Year-round / Perennial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Cultivable Area</label>
                  <input
                    type="text"
                    value={formData.landArea}
                    onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                    placeholder="e.g. 10 Acres"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Water Availability & Previous Crop */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Water Source</label>
                  <select
                    value={formData.waterAvailability}
                    onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Abundant (Assured Canal + Borewell)">Abundant (Canal + Borewell)</option>
                    <option value="Moderate (Tubewell / Canal)">Moderate (Tubewell)</option>
                    <option value="Rainfed / Deficit (Dryland Farming)">Rainfed (Dryland)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Previous Crop</label>
                  <input
                    type="text"
                    value={formData.previousCrop}
                    onChange={(e) => setFormData({ ...formData, previousCrop: e.target.value })}
                    placeholder="e.g. Wheat, Mustard"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Farming Objective */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Farming Objective</label>
                <select
                  value={formData.farmingObjective}
                  onChange={(e) => setFormData({ ...formData, farmingObjective: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="High Remuneration & Soil Health">High Remuneration & Soil Health</option>
                  <option value="Water Conservation & Low Input">Water Conservation & Low Input Cost</option>
                  <option value="Household Food Security & Dairy Fodder">Household Food Security & Dairy Fodder</option>
                  <option value="Export & Mandi Premium">Export & Mandi Premium Grading</option>
                </select>
              </div>

              {/* Soil Sensor & IoT Telemetry Controls */}
              <div className="pt-4 border-t border-stone-200 dark:border-emerald-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-extrabold text-stone-900 dark:text-stone-100 text-xs">
                      Soil Health Telemetry (IoT / Lab Card)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetCalibration}
                    className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Reset Norms</span>
                  </button>
                </div>

                {/* Nitrogen (N) Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-600 dark:text-stone-300 font-medium">
                      Available Nitrogen (N)
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      {soilSensors.nitrogen} kg/ha ({soilSensors.nitrogen > 280 ? "High" : soilSensors.nitrogen > 180 ? "Medium" : "Low"})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="450"
                    step="10"
                    value={soilSensors.nitrogen}
                    onChange={(e) => setSoilSensors({ ...soilSensors, nitrogen: parseInt(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-stone-200 dark:bg-emerald-900 rounded-lg"
                  />
                </div>

                {/* Phosphorus (P) Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-600 dark:text-stone-300 font-medium">
                      Available Phosphorus (P₂O₅)
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      {soilSensors.phosphorus} kg/ha ({soilSensors.phosphorus > 50 ? "High" : soilSensors.phosphorus > 25 ? "Medium" : "Low"})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={soilSensors.phosphorus}
                    onChange={(e) => setSoilSensors({ ...soilSensors, phosphorus: parseInt(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-stone-200 dark:bg-emerald-900 rounded-lg"
                  />
                </div>

                {/* Potassium (K) Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-600 dark:text-stone-300 font-medium">
                      Available Potassium (K₂O)
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      {soilSensors.potassium} kg/ha ({soilSensors.potassium > 200 ? "High" : "Optimal"})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="400"
                    step="10"
                    value={soilSensors.potassium}
                    onChange={(e) => setSoilSensors({ ...soilSensors, potassium: parseInt(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-stone-200 dark:bg-emerald-900 rounded-lg"
                  />
                </div>

                {/* Soil pH & Moisture Side-by-Side */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-stone-600 dark:text-stone-300 font-medium">Soil pH</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">{soilSensors.ph}</span>
                    </div>
                    <input
                      type="range"
                      min="4.5"
                      max="9.0"
                      step="0.1"
                      value={soilSensors.ph}
                      onChange={(e) => setSoilSensors({ ...soilSensors, ph: parseFloat(e.target.value) })}
                      className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-stone-200 dark:bg-emerald-900 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-stone-600 dark:text-stone-300 font-medium">Moisture</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">{soilSensors.moisture}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      step="5"
                      value={soilSensors.moisture}
                      onChange={(e) => setSoilSensors({ ...soilSensors, moisture: parseInt(e.target.value) })}
                      className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-stone-200 dark:bg-emerald-900 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Optional OpenAI GPT-4o Key Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className="text-[11px] font-semibold text-stone-500 hover:text-stone-700 dark:text-stone-400 flex items-center gap-1"
                >
                  <Key className="w-3 h-3 text-amber-500" />
                  <span>Optional OpenAI GPT-4o Agronomist Review</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showApiKeyInput ? "rotate-180" : ""}`} />
                </button>

                {showApiKeyInput && (
                  <div className="mt-2 space-y-1 animate-fadeIn">
                    <input
                      type="password"
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      placeholder="sk-proj-... (optional custom key)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100 text-xs font-mono"
                    />
                    <p className="text-[10px] text-stone-400">
                      When provided, OpenAI GPT-4o synthesizes real-time ICAR recommendations directly.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Connecting Real-Time Data & Mandis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate Real-Time Recommendations</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output Recommendations (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold">Recommendation Engine Alert</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Live District Telemetry & Weather Banner */}
          {liveMetadata && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-emerald-950 text-white border border-emerald-500/30 shadow-md space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <CloudSun className="w-5 h-5 text-yellow-300" />
                  <div>
                    <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                      Live District Microclimate Telemetry
                    </span>
                    <h4 className="text-sm font-extrabold text-white">
                      {liveMetadata.district}, {liveMetadata.state}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 font-semibold text-[11px]">
                    🛰️ Satellite Synced
                  </span>
                </div>
              </div>

              {/* Weather matrix pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-[10px] text-emerald-200">Air Temperature</div>
                  <div className="text-base font-extrabold text-white">{liveMetadata.liveWeather?.temperature ?? "--"}°C</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-[10px] text-emerald-200">Relative Humidity</div>
                  <div className="text-base font-extrabold text-white">{liveMetadata.liveWeather?.humidity ?? "--"}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-[10px] text-emerald-200">Rain Probability</div>
                  <div className="text-base font-extrabold text-white">{liveMetadata.liveWeather?.rainProbability ?? "--"}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-[10px] text-emerald-200">Wind Velocity</div>
                  <div className="text-base font-extrabold text-white">{liveMetadata.liveWeather?.windSpeed ?? "--"} km/h</div>
                </div>
              </div>

              {/* AI Agronomist Synthesis Quote */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-extrabold text-emerald-300 text-[11px] uppercase tracking-wider block">
                    ICAR Agronomic Intelligence Note
                  </span>
                  <p className="text-stone-200 leading-relaxed text-xs">
                    "{liveMetadata.aiAgronomistNote}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations List */}
          {recommendations ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100">
                    Real-Time Ranked Crop Portfolio
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Ranked by yield potential, live APMC mandi pricing, and NPK soil absorption.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-700">
                  {recommendations.length} Viable Matches Found
                </span>
              </div>

              <div className="space-y-5">
                {recommendations.map((rec, index) => (
                  <div
                    key={rec.cropName}
                    className="p-6 rounded-3xl bg-white dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800 shadow-sm space-y-5 hover:shadow-md transition-all relative overflow-hidden"
                  >
                    {/* Top Ribbon for Rank #1 */}
                    {index === 0 && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-500 text-stone-950 text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>TOP AGRONOMIC MATCH</span>
                      </div>
                    )}

                    {/* Top Row: Crop Name, Hindi Name, Suitability % */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`w-6 h-6 rounded-full text-white text-xs font-extrabold flex items-center justify-center ${index === 0 ? "bg-amber-600" : "bg-emerald-800"}`}>
                            #{index + 1}
                          </span>
                          <h4 className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
                            {rec.cropName}
                          </h4>
                          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            ({rec.hindiName})
                          </span>
                          {rec.marketTrend && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {rec.marketTrend}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                          {rec.reason}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                          {rec.suitabilityScore}%
                        </div>
                        <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                          Suitability Match
                        </div>
                      </div>
                    </div>

                    {/* Real-Time Financial & Market Discovery Box */}
                    <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800/60 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
                          <Coins className="w-4 h-4 text-amber-600" />
                          <span>Real-Time Market & Remuneration Model</span>
                        </div>
                        {rec.roiPercentage && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
                            {rec.roiPercentage}% Projected ROI
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="bg-white dark:bg-emerald-950 p-2.5 rounded-xl border border-stone-100 dark:border-emerald-800/40">
                          <div className="text-[10px] text-stone-500 dark:text-stone-400">Live Mandi Price</div>
                          <div className="font-extrabold text-stone-900 dark:text-white text-sm">
                            {rec.liveMarketPrice || "₹2,750 / Qtl"}
                          </div>
                          {rec.mspRate && (
                            <div className="text-[9px] text-stone-400 font-medium">{rec.mspRate}</div>
                          )}
                        </div>

                        <div className="bg-white dark:bg-emerald-950 p-2.5 rounded-xl border border-stone-100 dark:border-emerald-800/40">
                          <div className="text-[10px] text-stone-500 dark:text-stone-400">Expected Yield</div>
                          <div className="font-extrabold text-stone-900 dark:text-white text-sm">
                            {rec.expectedYield || "20-25 Qtl/Acre"}
                          </div>
                          <div className="text-[9px] text-stone-400 font-medium">Standard Agronomic Vigor</div>
                        </div>

                        <div className="bg-white dark:bg-emerald-950 p-2.5 rounded-xl border border-stone-100 dark:border-emerald-800/40">
                          <div className="text-[10px] text-stone-500 dark:text-stone-400">Est. Net Profit / Acre</div>
                          <div className="font-extrabold text-emerald-700 dark:text-emerald-300 text-sm">
                            {rec.estimatedNetProfitPerAcre || "₹38,500"}
                          </div>
                          <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">Post-Input Costs</div>
                        </div>

                        <div className="bg-white dark:bg-emerald-950 p-2.5 rounded-xl border border-stone-100 dark:border-emerald-800/40">
                          <div className="text-[10px] text-stone-500 dark:text-stone-400">Total Field Potential</div>
                          <div className="font-extrabold text-emerald-800 dark:text-emerald-200 text-sm">
                            {rec.totalEstimatedNetProfit
                              ? `₹${rec.totalEstimatedNetProfit.toLocaleString("en-IN")}`
                              : rec.estimatedRevenuePerAcre || "₹1,80,000"}
                          </div>
                          <div className="text-[9px] text-stone-400 font-medium">For {formData.landArea}</div>
                        </div>
                      </div>
                    </div>

                    {/* Agronomic Matrix Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-1">
                      <div className="p-2 rounded-xl bg-stone-100 dark:bg-emerald-900/30">
                        <div className="text-[10px] text-stone-400">Cycle Duration</div>
                        <div className="font-bold text-stone-800 dark:text-stone-200">{rec.growthCycleDays}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-stone-100 dark:bg-emerald-900/30">
                        <div className="text-[10px] text-stone-400">Water Need (mm)</div>
                        <div className="font-bold text-stone-800 dark:text-stone-200">{rec.waterRequirementMm || rec.waterRequirement}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-stone-100 dark:bg-emerald-900/30">
                        <div className="text-[10px] text-stone-400">Cropping Season</div>
                        <div className="font-bold text-stone-800 dark:text-stone-200">{rec.season}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-stone-100 dark:bg-emerald-900/30">
                        <div className="text-[10px] text-stone-400">Irrigation Method</div>
                        <div className="font-bold text-emerald-700 dark:text-emerald-400 truncate">{rec.irrigationMethod}</div>
                      </div>
                    </div>

                    {/* Fertilizer Schedule & Farming Method Tips */}
                    {rec.farmingMethodTips && rec.farmingMethodTips.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-1.5">
                        <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Recommended Agronomic & Fertilizer Practices:</span>
                        </div>
                        <ul className="text-stone-700 dark:text-stone-300 space-y-1 pl-5 list-disc text-[11px] leading-relaxed">
                          {rec.farmingMethodTips.map((tip, tIdx) => (
                            <li key={tIdx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Risk Factors & Rotation Tips */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-stone-100 dark:border-emerald-900">
                      <div className="space-y-1">
                        <strong className="text-amber-800 dark:text-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Watch For:
                        </strong>
                        <ul className="text-stone-600 dark:text-stone-300 list-disc list-inside space-y-0.5 text-[11px]">
                          {rec.riskFactors.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <strong className="text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <RotateCw className="w-3.5 h-3.5" /> Crop Rotation:
                        </strong>
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px]">
                          {rec.cropRotationConsiderations}
                        </p>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="pt-3 border-t border-stone-100 dark:border-emerald-900 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-[11px] text-stone-400">
                        Instant Ecosystem Integrations:
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/krishi-connect"
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-semibold flex items-center gap-1 transition-colors border border-emerald-200 dark:border-emerald-800 text-xs"
                        >
                          <span>Connect Mandi Buyers</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <Link
                          href="/govt-schemes/pmfby"
                          className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-emerald-950 hover:bg-stone-200 dark:hover:bg-emerald-900 text-stone-700 dark:text-stone-300 font-semibold flex items-center gap-1 transition-colors border border-stone-200 dark:border-emerald-800 text-xs"
                        >
                          <span>PMFBY Insurance</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cropify Disclaimer */}
              <div className="p-4 rounded-2xl bg-stone-100 dark:bg-emerald-950/60 border border-stone-200 dark:border-emerald-800 text-[11px] text-stone-500 dark:text-stone-400 text-center leading-relaxed">
                ⚖️ <strong>Real-Time Agronomic Notice:</strong> Suitability scores, yields, and net profits are calculated continuously from Open-Meteo satellite observations, e-NAM mandi modal rates, and ICAR regional benchmarks. Actual yields remain subject to local weather anomalies, certified seed vigor, and integrated pest management.
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[460px] rounded-3xl bg-stone-50 dark:bg-emerald-950/40 border-2 border-dashed border-stone-200 dark:border-emerald-800 flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-3">
              <Sprout className="w-14 h-14 text-stone-300 dark:text-emerald-700 animate-pulse" />
              <div className="font-bold text-sm text-stone-700 dark:text-stone-300">
                Fetching Real-Time Agronomic Models...
              </div>
              <p className="text-xs max-w-sm text-stone-400">
                Connecting to Open-Meteo satellite feed, e-NAM mandi price discovery, and soil NPK telemetry algorithms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
