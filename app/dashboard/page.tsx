"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "../../lib/store/app-store";
import { useLanguage } from "../../lib/i18n/i18n-context";
import { WeatherService } from "../../lib/services/weather.service";
import { WeatherData } from "../../lib/types";
import { DhartiMaaChatModal } from "../../components/dharti-maa/dharti-maa-chat-modal";
import { PhotoEditorModal } from "../../components/profile/photo-editor-modal";
import { AuthService } from "../../lib/services/auth.service";
import { districtCoordinates } from "../../lib/services/location.service";
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
  Camera,
} from "lucide-react";

export default function DashboardPage() {
  const { currentUser, setCurrentUser, farmers, userCoords, requestLocation, connectWithFarmer, connectedFarmerIds } = useApp();
  const { language, t } = useLanguage();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [dhartiMaaOpen, setDhartiMaaOpen] = useState(false);
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);

  const handlePhotoSaved = (newUrl: string) => {
    const updated = AuthService.updateUserProfile({ avatarUrl: newUrl });
    setCurrentUser(updated);
  };

  useEffect(() => {
    async function loadWeather() {
      const dist = currentUser?.district || "Bareilly";
      const st = currentUser?.state || "Uttar Pradesh";
      const distCoords = districtCoordinates[dist];
      const lat = userCoords?.lat || distCoords?.lat || 28.3670;
      const lng = userCoords?.lng || distCoords?.lng || 79.4304;
      const data = await WeatherService.getWeatherByCoords(
        lat,
        lng,
        `${dist}, ${st}`,
        st,
        dist
      );
      setWeather(data);
    }
    loadWeather();
  }, [userCoords, currentUser]);

  const nearbyFarmers = farmers.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20 text-stone-100">
      {/* 1. Header Banner with Farmer Greeting & Quick Actions */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0C1E1A] via-[#143B31] to-[#071411] text-white p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/35 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Farmer Profile Avatar with Edit Button */}
          <div className="relative group shrink-0">
            <img
              src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200"}
              alt={currentUser?.name || "Farmer"}
              className="w-20 h-20 rounded-full object-cover border-3 border-[#D4AF37] shadow-xl"
            />
            <button
              onClick={() => setPhotoEditorOpen(true)}
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity font-bold text-[10px] cursor-pointer"
              title="Edit Profile Photo"
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setPhotoEditorOpen(true)}
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-gradient-to-r from-[#F5DE98] to-[#D4AF37] text-[#071411] shadow-md transition-transform active:scale-95 cursor-pointer"
              title="Edit Profile Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Farm Operations Active • {currentUser?.landArea || "12.5 Acres"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FDFBF7]">
              Welcome back, {currentUser?.name || "Kisan Friend"} 🌱
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              {currentUser?.district}, {currentUser?.state} • Cultivating: {currentUser?.crops?.join(", ") || "Wheat, Basmati"}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/detections"
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 font-bold text-xs shadow transition-all flex items-center gap-1.5 border border-[#D4AF37]/30"
          >
            <ScanEye className="w-4 h-4 text-[#D4AF37]" />
            <span>Detect Crop</span>
          </Link>
          <Link
            href="/krishi-connect"
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 font-bold text-xs border border-[#D4AF37]/30 transition-all flex items-center gap-1.5 shadow"
          >
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>Find Farmer</span>
          </Link>
          <Link
            href="/weather"
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 font-bold text-xs border border-[#D4AF37]/30 transition-all flex items-center gap-1.5 shadow"
          >
            <CloudSun className="w-4 h-4 text-[#D4AF37]" />
            <span>Check Weather</span>
          </Link>
          <button
            onClick={() => setDhartiMaaOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F5DE98] to-[#D4AF37] hover:brightness-110 text-[#071411] font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Dharti Maa</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Intelligence Card */}
        <div className="p-6 rounded-3xl bg-[#0C1E1A] border border-[#D4AF37]/25 shadow-xl hover:border-[#D4AF37] transition-all flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <CloudSun className="w-5 h-5 text-[#D4AF37]" />
              <span>Live Weather Station</span>
            </div>
            <span className="text-[11px] font-semibold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2 py-0.5 rounded-full">
              {weather ? `${weather.district}` : "Syncing..."}
            </span>
          </div>

          {weather ? (
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-white">
                  {weather.temperature}°C
                </span>
                <span className="text-xs text-stone-300">
                  Feels like {weather.feelsLike}°C • {weather.conditionText}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-white/10">
                <div>
                  <div className="font-bold text-white">{weather.humidity}%</div>
                  <div className="text-[10px] text-stone-400">Humidity</div>
                </div>
                <div>
                  <div className="font-bold text-white">{weather.rainProbability}%</div>
                  <div className="text-[10px] text-stone-400">Rain Prob.</div>
                </div>
                <div>
                  <div className="font-bold text-white">{weather.windSpeedKmh} km/h</div>
                  <div className="text-[10px] text-stone-400">Wind ({weather.windDirection})</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 text-xs text-stone-200 border border-[#D4AF37]/20">
                <strong className="text-[#D4AF37]">Advisory:</strong> {weather.agriculturalAdvisory.irrigationAdvice}
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-2 py-6">
              <div className="h-6 bg-white/10 rounded w-1/2" />
              <div className="h-4 bg-white/10 rounded w-3/4" />
            </div>
          )}

          <Link
            href="/weather"
            className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 pt-1"
          >
            <span>7-Day Agricultural Forecast</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* My Crops Management */}
        <div className="p-6 rounded-3xl bg-[#0C1E1A] border border-[#D4AF37]/25 shadow-xl hover:border-[#D4AF37] transition-all flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sprout className="w-5 h-5 text-[#D4AF37]" />
              <span>My Active Crops</span>
            </div>
            <Link
              href="/profile"
              className="text-[11px] font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Edit
            </Link>
          </div>

          <div className="space-y-2.5">
            {(currentUser?.crops || ["Wheat", "Basmati Rice"]).map((crop, idx) => (
              <div
                key={crop}
                className="p-3 rounded-2xl bg-black/30 border border-[#D4AF37]/20 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                  <div>
                    <div className="font-bold text-white">{crop}</div>
                    <div className="text-[10px] text-stone-400">
                      {idx === 0 ? "Vegetative Stage • Tillering" : "Grain Filling • Subsurface Wetting"}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-semibold">
                  Healthy
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/cropify"
            className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 pt-1"
          >
            <span>Explore Next Season Crop Recommendations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Govt Scheme Status */}
        <div className="p-6 rounded-3xl bg-[#0C1E1A] border border-[#D4AF37]/25 shadow-xl hover:border-[#D4AF37] transition-all flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Building2 className="w-5 h-5 text-[#D4AF37]" />
              <span>Government Schemes Active</span>
            </div>
            <span className="text-[11px] font-semibold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2 py-0.5 rounded-full">
              DBT Verified
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-black/30 border border-[#D4AF37]/20 space-y-1">
              <div className="flex items-center justify-between font-bold text-white">
                <span>PM-Kisan Samman Nidhi</span>
                <span className="text-[#D4AF37] font-bold">₹2,000 Credited</span>
              </div>
              <div className="text-stone-400 text-[11px]">Installment 17 active • eKYC Complete</div>
            </div>

            <div className="p-3 rounded-2xl bg-black/30 border border-[#D4AF37]/20 space-y-1">
              <div className="flex items-center justify-between font-bold text-white">
                <span>PMKSY Drip Subsidy</span>
                <span className="text-amber-400 font-semibold">Eligible (55%)</span>
              </div>
              <div className="text-stone-400 text-[11px]">Documents verified for 5-acre micro-irrigation</div>
            </div>
          </div>

          <Link
            href="/govt-schemes"
            className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 pt-1"
          >
            <span>View All 5 Schemes & Application Portals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Krishi Connect Nearby Matches */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0C1E1A] border border-[#D4AF37]/25 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              <span>Nearby Farmers, Traders & Input Suppliers</span>
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              Location-aware approximate matching. Connect directly to trade or exchange equipment.
            </p>
          </div>

          <button
            onClick={() => requestLocation()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 text-xs font-semibold border border-[#D4AF37]/30"
          >
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Recalibrate GPS Distance</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {nearbyFarmers.map((f) => {
            const isConnected = connectedFarmerIds.includes(f.id);
            return (
              <div
                key={f.id}
                className="p-5 rounded-3xl bg-black/30 border border-[#D4AF37]/20 flex flex-col justify-between space-y-4 hover:shadow-lg hover:border-[#D4AF37] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={f.photo}
                      alt={f.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-xs"
                    />
                    <div>
                      <div className="font-bold text-sm text-white">{f.name}</div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        <span>{f.approxLocation}</span>
                      </div>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#D4AF37] bg-[#D4AF37]/15 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                        {f.distanceKm ? `${f.distanceKm} km away` : "Nearby"}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-200 space-y-1">
                    <div><strong>Product:</strong> {f.product}</div>
                    <div><strong>Qty:</strong> {f.quantity} • <strong>Price:</strong> {f.price}</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <Link
                    href={`/krishi-connect/chat/${f.id}`}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#F5DE98] to-[#D4AF37] hover:brightness-110 text-[#071411] text-xs font-bold text-center transition-all shadow-md"
                  >
                    Chat & Call
                  </Link>
                  <button
                    onClick={() => connectWithFarmer(f.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      isConnected
                        ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]"
                        : "bg-white/5 hover:bg-white/10 text-stone-200 border border-white/10"
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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:underline"
          >
            <span>Explore All Farmers in Krishi Connect</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Interactive Dharti Maa Modal */}
      <DhartiMaaChatModal isOpen={dhartiMaaOpen} onClose={() => setDhartiMaaOpen(false)} />

      {/* Interactive Profile Photo Editor Modal */}
      <PhotoEditorModal
        isOpen={photoEditorOpen}
        onClose={() => setPhotoEditorOpen(false)}
        currentPhotoUrl={currentUser?.avatarUrl}
        onPhotoSaved={handlePhotoSaved}
      />
    </div>
  );
}
