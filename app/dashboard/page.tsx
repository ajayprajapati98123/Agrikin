"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "../../lib/store/app-store";
import { useLanguage } from "../../lib/i18n/i18n-context";
import { WeatherService } from "../../lib/services/weather.service";
import { WeatherData } from "../../lib/types";
import { DhartiMaaChatModal } from "../../components/dharti-maa/dharti-maa-chat-modal";
import {
  Sprout,
  CloudSun,
  Users,
  ScanEye,
  Building2,
  Droplets,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Compass,
} from "lucide-react";

export default function DashboardPage() {
  const { currentUser, farmers, userCoords, requestLocation, connectWithFarmer, connectedFarmerIds } = useApp();
  const { language, t } = useLanguage();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [dhartiMaaOpen, setDhartiMaaOpen] = useState(false);

  useEffect(() => {
    async function loadWeather() {
      const lat = userCoords?.lat || 30.9010;
      const lng = userCoords?.lng || 75.8573;
      const data = await WeatherService.getWeatherByCoords(
        lat,
        lng,
        currentUser?.district ? `${currentUser.district}, ${currentUser.state}` : "Ludhiana, Punjab",
        currentUser?.state || "Punjab",
        currentUser?.district || "Ludhiana"
      );
      setWeather(data);
    }
    loadWeather();
  }, [userCoords, currentUser]);

  const nearbyFarmers = farmers.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* 1. Header Banner with Farmer Greeting & Quick Actions */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Farm Operations Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser?.name || "Kisan Friend"} 🌱
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-xl">
            {currentUser?.district}, {currentUser?.state} • Cultivating: {currentUser?.crops?.join(", ") || "Wheat, Basmati"}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/detections"
            className="px-3.5 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-stone-100 font-bold text-xs shadow transition-all flex items-center gap-1.5"
          >
            <ScanEye className="w-4 h-4 text-emerald-700" />
            <span>Detect Crop</span>
          </Link>
          <Link
            href="/krishi-connect"
            className="px-3.5 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs border border-emerald-500 transition-all flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Find Farmer</span>
          </Link>
          <Link
            href="/weather"
            className="px-3.5 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs border border-emerald-500 transition-all flex items-center gap-1.5"
          >
            <CloudSun className="w-4 h-4" />
            <span>Check Weather</span>
          </Link>
          <button
            onClick={() => setDhartiMaaOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 text-emerald-950 font-bold text-xs shadow transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Dharti Maa</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Intelligence Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-800 dark:text-stone-100 font-bold text-sm">
              <CloudSun className="w-5 h-5 text-sky-600" />
              <span>Live Weather Station</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
              {weather ? `${weather.district}` : "Syncing..."}
            </span>
          </div>

          {weather ? (
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-stone-900 dark:text-stone-100">
                  {weather.temperature}°C
                </span>
                <span className="text-xs text-stone-500">
                  Feels like {weather.feelsLike}°C • {weather.conditionText}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-stone-100 dark:border-emerald-900">
                <div>
                  <div className="font-bold text-stone-800 dark:text-stone-200">{weather.humidity}%</div>
                  <div className="text-[10px] text-stone-400">Humidity</div>
                </div>
                <div>
                  <div className="font-bold text-stone-800 dark:text-stone-200">{weather.rainProbability}%</div>
                  <div className="text-[10px] text-stone-400">Rain Prob.</div>
                </div>
                <div>
                  <div className="font-bold text-stone-800 dark:text-stone-200">{weather.windSpeedKmh} km/h</div>
                  <div className="text-[10px] text-stone-400">Wind ({weather.windDirection})</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-200/80">
                <strong>Advisory:</strong> {weather.agriculturalAdvisory.irrigationAdvice}
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-2 py-6">
              <div className="h-6 bg-stone-200 rounded w-1/2" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
            </div>
          )}

          <Link
            href="/weather"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 pt-1"
          >
            <span>7-Day Agricultural Forecast</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* My Crops Management */}
        <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-800 dark:text-stone-100 font-bold text-sm">
              <Sprout className="w-5 h-5 text-green-600" />
              <span>My Active Crops</span>
            </div>
            <Link
              href="/profile"
              className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Edit
            </Link>
          </div>

          <div className="space-y-2.5">
            {(currentUser?.crops || ["Wheat", "Basmati Rice"]).map((crop, idx) => (
              <div
                key={crop}
                className="p-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-100 dark:border-emerald-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <div className="font-bold text-stone-800 dark:text-stone-200">{crop}</div>
                    <div className="text-[10px] text-stone-500">
                      {idx === 0 ? "Vegetative Stage • Tillering" : "Grain Filling • Subsurface Wetting"}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-[10px] font-semibold">
                  Healthy
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/cropify"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 pt-1"
          >
            <span>Explore Next Season Crop Recommendations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Govt Scheme Status */}
        <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-800 dark:text-stone-100 font-bold text-sm">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Government Schemes Active</span>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
              DBT Verified
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 space-y-1">
              <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200">
                <span>PM-Kisan Samman Nidhi</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹2,000 Credited</span>
              </div>
              <div className="text-stone-500 text-[11px]">Installment 17 active • eKYC Complete</div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-100 dark:border-emerald-800/80 space-y-1">
              <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200">
                <span>PMKSY Drip Subsidy</span>
                <span className="text-amber-600 font-semibold">Eligible (55%)</span>
              </div>
              <div className="text-stone-500 text-[11px]">Documents verified for 5-acre micro-irrigation</div>
            </div>
          </div>

          <Link
            href="/govt-schemes"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 pt-1"
          >
            <span>View All 5 Schemes & Application Portals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Krishi Connect Nearby Matches */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <span>Nearby Farmers, Traders & Input Suppliers</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Location-aware approximate matching. Connect directly to trade or exchange equipment.
            </p>
          </div>

          <button
            onClick={() => requestLocation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-emerald-900/60 hover:bg-emerald-100 text-stone-700 dark:text-stone-200 text-xs font-semibold"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>Recalibrate GPS Distance</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {nearbyFarmers.map((f) => {
            const isConnected = connectedFarmerIds.includes(f.id);
            return (
              <div
                key={f.id}
                className="p-5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800 flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={f.photo}
                      alt={f.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                    />
                    <div>
                      <div className="font-bold text-sm text-stone-900 dark:text-stone-100">{f.name}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        <span>{f.approxLocation}</span>
                      </div>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-800/80 px-2 py-0.2 rounded-full">
                        {f.distanceKm ? `${f.distanceKm} km away` : "Nearby"}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-700 dark:text-stone-300 space-y-1">
                    <div><strong>Product:</strong> {f.product}</div>
                    <div><strong>Qty:</strong> {f.quantity} • <strong>Price:</strong> {f.price}</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-stone-200 dark:border-emerald-800">
                  <Link
                    href={`/krishi-connect/chat/${f.id}`}
                    className="flex-1 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold text-center transition-colors"
                  >
                    Chat & Call
                  </Link>
                  <button
                    onClick={() => connectWithFarmer(f.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      isConnected
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-white hover:bg-stone-100 text-stone-800 border border-stone-300"
                    }`}
                  >
                    {isConnected ? "Connected ✓" : "Connect"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-right">
          <Link
            href="/krishi-connect"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <span>Explore All Farmers in Krishi Connect</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Interactive Dharti Maa Modal */}
      <DhartiMaaChatModal isOpen={dhartiMaaOpen} onClose={() => setDhartiMaaOpen(false)} />
    </div>
  );
}
