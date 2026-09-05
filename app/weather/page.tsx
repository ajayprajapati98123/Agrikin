"use client";

import React, { useState, useEffect } from "react";
import { WeatherService } from "../../lib/services/weather.service";
import { WeatherData } from "../../lib/types";
import { useApp } from "../../lib/store/app-store";
import { indianStatesAndDistricts, districtCoordinates } from "../../lib/services/location.service";
import {
  CloudSun,
  Compass,
  Droplets,
  Wind,
  Sun,
  Moon,
  AlertTriangle,
  Calendar,
  Sparkles,
  MapPin,
  RefreshCw,
  Clock,
  Sunrise,
  Sunset,
  Gauge,
  CheckCircle2,
} from "lucide-react";

export default function WeatherPage() {
  const { userCoords, requestLocation, currentUser } = useApp();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [manualState, setManualState] = useState(currentUser?.state || "Uttar Pradesh");
  const [manualDistrict, setManualDistrict] = useState(currentUser?.district || "Bareilly");

  const selectedStateObj = indianStatesAndDistricts.find((s) => s.state === manualState);
  const districtOptions = selectedStateObj
    ? selectedStateObj.districts
    : ["Bareilly", "Lucknow", "Varanasi"];

  const loadWeather = async (
    lat: number,
    lng: number,
    locName: string,
    state: string,
    dist: string,
    isRefresh = false
  ) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await WeatherService.getWeatherByCoords(lat, lng, locName, state, dist);
      setWeather(data);
    } catch (e) {
      console.error("Failed to load live weather:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const defaultCoords = districtCoordinates[manualDistrict] || { lat: 28.3670, lng: 79.4304 };
    const lat = userCoords?.lat || defaultCoords.lat;
    const lng = userCoords?.lng || defaultCoords.lng;
    loadWeather(lat, lng, `${manualDistrict}, ${manualState}`, manualState, manualDistrict);
  }, []);

  const handleUseCurrentLocation = async () => {
    await requestLocation();
    if (userCoords) {
      loadWeather(
        userCoords.lat,
        userCoords.lng,
        "Current GPS Location",
        "Local State",
        "Local District"
      );
    }
  };

  const handleManualLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const coords = districtCoordinates[manualDistrict] || { lat: 28.3670, lng: 79.4304 };
    loadWeather(coords.lat, coords.lng, `${manualDistrict}, ${manualState}`, manualState, manualDistrict);
  };

  const handleManualRefresh = () => {
    const coords = districtCoordinates[manualDistrict] || { lat: 28.3670, lng: 79.4304 };
    loadWeather(coords.lat, coords.lng, `${manualDistrict}, ${manualState}`, manualState, manualDistrict, true);
  };

  const getUvLabel = (uv: number, isDay: boolean) => {
    if (!isDay || uv === 0) return `${uv} (None • Night)`;
    if (uv <= 2) return `${uv} (Low)`;
    if (uv <= 5) return `${uv} (Moderate)`;
    if (uv <= 7) return `${uv} (High)`;
    if (uv <= 10) return `${uv} (Very High)`;
    return `${uv} (Extreme)`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#083344] via-[#0E5266] to-[#042129] text-white p-6 sm:p-10 shadow-xl border border-cyan-500/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-semibold">
            <CloudSun className="w-3.5 h-3.5 text-yellow-400" />
            <span>WMO Real-Time Meteorological Station & Satellite Reanalysis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Agricultural Weather Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/90 max-w-2xl leading-relaxed">
            Live satellite telemetry paired with ICAR agronomic models for precision spraying windows, evapotranspiration irrigation planning, and heat/frost defense.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handleManualRefresh}
            disabled={loading || refreshing}
            className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-sm"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-yellow-300" : ""}`} />
            <span>{refreshing ? "Updating..." : "Refresh Live"}</span>
          </button>

          <button
            onClick={handleUseCurrentLocation}
            className="px-5 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-cyan-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Use My GPS</span>
          </button>
        </div>
      </div>

      {/* Manual District Selector Bar */}
      <div className="p-4 rounded-2xl bg-[#FFFEFD] dark:bg-[#083344] border border-[#EAE3D5] dark:border-cyan-800/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form onSubmit={handleManualLocationSubmit} className="flex flex-wrap items-center gap-3 text-xs flex-1">
          <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
            <span>Select Region:</span>
          </span>

          <select
            value={manualState}
            onChange={(e) => {
              const st = e.target.value;
              setManualState(st);
              const obj = indianStatesAndDistricts.find((s) => s.state === st);
              setManualDistrict(obj ? obj.districts[0] : "Bareilly");
            }}
            className="px-3 py-2 rounded-xl border border-[#EAE3D5] dark:border-cyan-800 bg-[#FAF7F0] dark:bg-cyan-950/40 text-stone-900 dark:text-stone-100 font-medium cursor-pointer focus:ring-2 focus:ring-cyan-600 focus:outline-none"
          >
            {indianStatesAndDistricts.map((s) => (
              <option key={s.state} value={s.state}>{s.state}</option>
            ))}
          </select>

          <select
            value={manualDistrict}
            onChange={(e) => setManualDistrict(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#EAE3D5] dark:border-cyan-800 bg-[#FAF7F0] dark:bg-cyan-950/40 text-stone-900 dark:text-stone-100 font-medium cursor-pointer focus:ring-2 focus:ring-cyan-600 focus:outline-none"
          >
            {districtOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Update Weather
          </button>
        </form>

        {weather?.lastUpdated && (
          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5 self-end sm:self-auto">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>Live Sync: <strong>{weather.lastUpdated} IST</strong></span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-16 text-center space-y-4 rounded-3xl bg-[#FFFEFD] dark:bg-[#083344] border border-[#EAE3D5] dark:border-cyan-800/60 shadow-xs">
          <RefreshCw className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
          <div className="font-bold text-stone-800 dark:text-stone-200 text-sm">
            Retrieving Real-Time Satellite & Atmospheric Weather Data...
          </div>
        </div>
      ) : weather ? (
        <div className="space-y-8">
          {/* Main Weather Card */}
          <div className="rounded-3xl bg-[#FFFEFD] dark:bg-[#083344] p-6 sm:p-10 border border-[#EAE3D5] dark:border-cyan-800/60 shadow-xs space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EAE3D5] dark:border-cyan-800">
              <div>
                <span className="text-xs font-bold text-cyan-800 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                  Live Agricultural Conditions
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
                  {weather.locationName}
                </h2>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-2">
                  <span>{weather.conditionText} • Indian Standard Time (IST)</span>
                  {weather.lastUpdated && (
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-700 font-bold text-[10px]">
                      Updated at {weather.lastUpdated}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {weather.isDay ? (
                    <Sun className="w-10 h-10 text-amber-500 animate-spin-slow" />
                  ) : (
                    <Moon className="w-10 h-10 text-indigo-400" />
                  )}
                  <div className="text-5xl sm:text-6xl font-extrabold text-stone-900 dark:text-stone-100">
                    {weather.temperature}°C
                  </div>
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 space-y-0.5 pl-2 border-l border-[#EAE3D5] dark:border-cyan-800">
                  <div>Feels like: <strong>{weather.feelsLike}°C</strong></div>
                  <div>Precipitation: <strong>{weather.precipitationMm} mm</strong></div>
                  {weather.pressureHpa && (
                    <div>Pressure: <strong>{weather.pressureHpa} hPa</strong></div>
                  )}
                </div>
              </div>
            </div>

            {/* Meteorological Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-950/30 border border-[#EAE3D5] dark:border-cyan-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                  <Droplets className="w-4 h-4 text-cyan-600" />
                  <span>Humidity</span>
                </div>
                <div className="text-xl font-bold text-stone-900 dark:text-stone-100">{weather.humidity}%</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-950/30 border border-[#EAE3D5] dark:border-cyan-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                  <CloudSun className="w-4 h-4 text-teal-600" />
                  <span>Rain Probability</span>
                </div>
                <div className="text-xl font-bold text-stone-900 dark:text-stone-100">{weather.rainProbability}%</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-950/30 border border-[#EAE3D5] dark:border-cyan-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                  <Wind className="w-4 h-4 text-teal-600" />
                  <span>Wind Speed</span>
                </div>
                <div className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {weather.windSpeedKmh} km/h ({weather.windDirection})
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-900/30 border border-[#EAE3D5] dark:border-cyan-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                  {weather.isDay ? (
                    <Sun className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-indigo-400" />
                  )}
                  <span>UV Index</span>
                </div>
                <div className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {getUvLabel(weather.uvIndex, weather.isDay)}
                </div>
              </div>
            </div>

            {/* Solar & Daycycle Times */}
            {(weather.sunrise || weather.sunset) && (
              <div className="flex flex-wrap items-center gap-4 text-xs p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200">
                {weather.sunrise && (
                  <div className="flex items-center gap-1.5">
                    <Sunrise className="w-4 h-4 text-amber-600" />
                    <span>Sunrise: <strong>{weather.sunrise}</strong></span>
                  </div>
                )}
                {weather.sunset && (
                  <div className="flex items-center gap-1.5">
                    <Sunset className="w-4 h-4 text-orange-600" />
                    <span>Sunset: <strong>{weather.sunset}</strong></span>
                  </div>
                )}
                <span className="text-stone-400 hidden sm:inline">•</span>
                <span className="text-[11px] text-stone-600 dark:text-stone-300">
                  Prime early morning foliar spray window starts at dawn (6:00 AM - 8:30 AM).
                </span>
              </div>
            )}

            {/* Tailored Agricultural Advisory Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/30 dark:to-teal-900/30 border border-cyan-300 dark:border-cyan-700 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-extrabold text-sm text-cyan-950 dark:text-cyan-200">
                <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span>Actionable Field Advisory for Farmers (ICAR Aligned)</span>
              </div>
              <p className="text-cyan-950 dark:text-cyan-100 text-sm leading-relaxed">
                {weather.agriculturalAdvisory.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-[#FFFEFD] dark:bg-[#082933] rounded-xl border border-cyan-200 dark:border-cyan-800">
                  <strong className="text-stone-800 dark:text-stone-200">Irrigation Advice: </strong>
                  <p className="mt-1 text-stone-600 dark:text-stone-300 leading-relaxed">
                    {weather.agriculturalAdvisory.irrigationAdvice}
                  </p>
                </div>
                <div className="p-3 bg-[#FFFEFD] dark:bg-[#082933] rounded-xl border border-cyan-200 dark:border-cyan-800">
                  <strong className="text-stone-800 dark:text-stone-200">Chemical Spray Window: </strong>
                  <div className={`mt-1 font-bold ${
                    weather.agriculturalAdvisory.sprayingCondition === "Favorable"
                      ? "text-teal-600 dark:text-teal-400"
                      : weather.agriculturalAdvisory.sprayingCondition === "Caution"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {weather.agriculturalAdvisory.sprayingCondition}
                  </div>
                </div>
                <div className="p-3 bg-[#FFFEFD] dark:bg-[#082933] rounded-xl border border-cyan-200 dark:border-cyan-800">
                  <strong className="text-stone-800 dark:text-stone-200">Fungal / Pest Risk: </strong>
                  <div className={`mt-1 font-bold ${
                    weather.agriculturalAdvisory.pestRisk === "High"
                      ? "text-red-600 dark:text-red-400"
                      : weather.agriculturalAdvisory.pestRisk === "Moderate"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-teal-600 dark:text-teal-400"
                  }`}>
                    {weather.agriculturalAdvisory.pestRisk}
                  </div>
                </div>
              </div>

              {weather.agriculturalAdvisory.criticalWarning && (
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{weather.agriculturalAdvisory.criticalWarning}</span>
                </div>
              )}
            </div>
          </div>

          {/* 24-Hour Hourly Trend */}
          {weather.hourly && weather.hourly.length > 0 && (
            <div className="rounded-3xl bg-[#FFFEFD] dark:bg-[#082933] p-6 sm:p-8 border border-[#EAE3D5] dark:border-cyan-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                  <span>24-Hour Hourly Agricultural Trend</span>
                </h3>
                <span className="text-xs text-stone-400">Scroll to view hourly forecast →</span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                {weather.hourly.map((h, idx) => (
                  <div
                    key={idx}
                    className="min-w-[85px] p-3 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-900/20 border border-[#EAE3D5] dark:border-cyan-800/80 flex flex-col items-center justify-between text-center space-y-1.5 shrink-0"
                  >
                    <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400">{h.time}</div>
                    <div className="text-lg font-extrabold text-stone-900 dark:text-stone-100">{h.temp}°C</div>
                    <div className="text-[10px] text-cyan-700 dark:text-cyan-400 font-semibold">
                      {h.rainProb}% Rain
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7-Day Outlook */}
          <div className="rounded-3xl bg-[#FFFEFD] dark:bg-[#082933] p-6 sm:p-8 border border-[#EAE3D5] dark:border-cyan-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-700 dark:text-cyan-400" />
              <span>7-Day Agricultural Outlook</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
              {weather.forecast.map((day, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-900/20 border border-[#EAE3D5] dark:border-cyan-800/80 flex flex-col justify-between items-center text-center space-y-2"
                >
                  <div className="font-bold text-stone-800 dark:text-stone-200">{day.dayName}</div>
                  <div className="text-xl">
                    {day.condition.includes("Rain") || day.condition.includes("Shower")
                      ? "🌧️"
                      : day.condition.includes("Cloud") || day.condition.includes("Overcast")
                      ? "⛅"
                      : "☀️"}
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-stone-900 dark:text-stone-100">
                      {day.maxTemp}° / {day.minTemp}°
                    </div>
                    <div className="text-[10px] text-cyan-700 dark:text-cyan-400 font-semibold">
                      {day.rainProb}% Rain
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advisory Disclaimer */}
          <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#082933]/60 text-stone-500 text-[11px] text-center leading-relaxed border border-[#EAE3D5] dark:border-cyan-900">
            🌾 <strong>Meteorological Advisory Note:</strong> Data is synchronized directly from WMO-compliant satellite reanalysis and high-resolution numerical weather models. Local microclimates, unexpected convective thunderstorms, and canal release shifts may alter field conditions.
          </div>
        </div>
      ) : null}
    </div>
  );
}
