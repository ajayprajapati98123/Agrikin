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
  AlertTriangle,
  Calendar,
  Sparkles,
  MapPin,
  RefreshCw,
  Info,
} from "lucide-react";

export default function WeatherPage() {
  const { userCoords, requestLocation, hasLocationPermission, currentUser } = useApp();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [manualState, setManualState] = useState(currentUser?.state || "Punjab");
  const [manualDistrict, setManualDistrict] = useState(currentUser?.district || "Ludhiana");

  const selectedStateObj = indianStatesAndDistricts.find((s) => s.state === manualState);
  const districtOptions = selectedStateObj ? selectedStateObj.districts : ["Ludhiana", "Amritsar"];

  const loadWeather = async (lat: number, lng: number, locName: string, state: string, dist: string) => {
    setLoading(true);
    const data = await WeatherService.getWeatherByCoords(lat, lng, locName, state, dist);
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    const lat = userCoords?.lat || districtCoordinates[manualDistrict]?.lat || 30.9010;
    const lng = userCoords?.lng || districtCoordinates[manualDistrict]?.lng || 75.8573;
    loadWeather(lat, lng, `${manualDistrict}, ${manualState}`, manualState, manualDistrict);
  }, []);

  const handleUseCurrentLocation = async () => {
    await requestLocation();
    if (userCoords) {
      loadWeather(userCoords.lat, userCoords.lng, "Current Approximate Location", "Local State", "Local District");
    }
  };

  const handleManualLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const coords = districtCoordinates[manualDistrict] || { lat: 28.6139, lng: 77.2090 };
    loadWeather(coords.lat, coords.lng, `${manualDistrict}, ${manualState}`, manualState, manualDistrict);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-900 via-teal-900 to-emerald-950 text-white p-8 sm:p-10 shadow-xl border border-sky-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/30 border border-sky-400/40 text-sky-200 text-xs font-semibold">
            <CloudSun className="w-3.5 h-3.5 text-yellow-400" />
            <span>Meteorological Satellite Station</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Agricultural Weather Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-sky-100/90 max-w-2xl leading-relaxed">
            Location-aware atmospheric forecasts paired with agronomic decision support for precision spraying, irrigation planning, and frost/heat defense.
          </p>
        </div>

        <button
          onClick={handleUseCurrentLocation}
          className="px-5 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-extrabold text-xs shadow-md transition-all self-start md:self-auto flex items-center gap-2"
        >
          <Compass className="w-4 h-4" />
          <span>Use My GPS Location</span>
        </button>
      </div>

      {/* Manual District Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800 shadow-sm">
        <form onSubmit={handleManualLocationSubmit} className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Select Region:</span>
          </span>

          <select
            value={manualState}
            onChange={(e) => {
              const st = e.target.value;
              setManualState(st);
              const obj = indianStatesAndDistricts.find((s) => s.state === st);
              setManualDistrict(obj ? obj.districts[0] : "Ludhiana");
            }}
            className="px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100 font-medium"
          >
            {indianStatesAndDistricts.map((s) => (
              <option key={s.state} value={s.state}>{s.state}</option>
            ))}
          </select>

          <select
            value={manualDistrict}
            onChange={(e) => setManualDistrict(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100 font-medium"
          >
            {districtOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition-colors"
          >
            Update Weather
          </button>
        </form>
      </div>

      {loading ? (
        <div className="p-16 text-center space-y-4 rounded-3xl bg-white dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <div className="font-bold text-stone-800 dark:text-stone-200 text-sm">
            Retrieving Hyper-Local Satellite Reanalysis Data...
          </div>
        </div>
      ) : weather ? (
        <div className="space-y-8">
          {/* Main Weather Card */}
          <div className="rounded-3xl bg-white dark:bg-emerald-950 p-6 sm:p-10 border border-stone-200 dark:border-emerald-800 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200 dark:border-emerald-800">
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Live Agricultural Conditions
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
                  {weather.locationName}
                </h2>
                <div className="text-xs text-stone-500 mt-0.5">
                  {weather.conditionText} • Indian Standard Time (IST)
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-5xl sm:text-6xl font-extrabold text-stone-900 dark:text-stone-100">
                  {weather.temperature}°C
                </div>
                <div className="text-xs text-stone-500 space-y-0.5">
                  <div>Feels like: <strong>{weather.feelsLike}°C</strong></div>
                  <div>Precipitation: <strong>{weather.precipitationMm} mm</strong></div>
                </div>
              </div>
            </div>

            {/* Meteorological Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-100 dark:border-emerald-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>Humidity</span>
                </div>
                <div className="text-xl font-bold text-stone-900 dark:text-stone-100">{weather.humidity}%</div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-100 dark:border-emerald-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <CloudSun className="w-4 h-4 text-blue-600" />
                  <span>Rain Probability</span>
                </div>
                <div className="text-xl font-bold text-stone-900 dark:text-stone-100">{weather.rainProbability}%</div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-100 dark:border-emerald-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Wind className="w-4 h-4 text-teal-600" />
                  <span>Wind Speed</span>
                </div>
                <div className="text-xl font-bold text-stone-900 dark:text-stone-100">{weather.windSpeedKmh} km/h ({weather.windDirection})</div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-100 dark:border-emerald-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>UV Index</span>
                </div>
                <div className="text-xl font-bold text-stone-900 dark:text-stone-100">{weather.uvIndex} (Moderate)</div>
              </div>
            </div>

            {/* Tailored Agricultural Advisory Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-300 dark:border-emerald-700 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-900 dark:text-emerald-200">
                <Sparkles className="w-4 h-4 text-yellow-600" />
                <span>Actionable Field Advisory for Farmers</span>
              </div>
              <p className="text-emerald-950 dark:text-emerald-100 text-sm leading-relaxed">
                {weather.agriculturalAdvisory.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white dark:bg-emerald-950 rounded-xl border border-emerald-200">
                  <strong>Irrigation Advice: </strong>
                  <p className="mt-1 text-stone-600 dark:text-stone-300">{weather.agriculturalAdvisory.irrigationAdvice}</p>
                </div>
                <div className="p-3 bg-white dark:bg-emerald-950 rounded-xl border border-emerald-200">
                  <strong>Chemical Spray Window: </strong>
                  <div className={`mt-1 font-bold ${
                    weather.agriculturalAdvisory.sprayingCondition === "Favorable" ? "text-green-600" : "text-amber-600"
                  }`}>
                    {weather.agriculturalAdvisory.sprayingCondition}
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-emerald-950 rounded-xl border border-emerald-200">
                  <strong>Fungal / Pest Risk: </strong>
                  <div className="mt-1 font-bold text-amber-600">
                    {weather.agriculturalAdvisory.pestRisk}
                  </div>
                </div>
              </div>

              {weather.agriculturalAdvisory.criticalWarning && (
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-300 text-red-900 dark:text-red-200 flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{weather.agriculturalAdvisory.criticalWarning}</span>
                </div>
              )}
            </div>
          </div>

          {/* 7-Day Outlook */}
          <div className="rounded-3xl bg-white dark:bg-emerald-950 p-6 sm:p-8 border border-stone-200 dark:border-emerald-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <span>7-Day Agricultural Outlook</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
              {weather.forecast.map((day, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-100 dark:border-emerald-800/80 flex flex-col justify-between items-center text-center space-y-2"
                >
                  <div className="font-bold text-stone-800 dark:text-stone-200">{day.dayName}</div>
                  <div className="text-xl">
                    {day.condition.includes("Rain") ? "🌧️" : day.condition.includes("Cloud") ? "⛅" : "☀️"}
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-stone-900 dark:text-stone-100">{day.maxTemp}° / {day.minTemp}°</div>
                    <div className="text-[10px] text-sky-600 font-semibold">{day.rainProb}% Rain</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advisory Disclaimer */}
          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-emerald-950/60 text-stone-500 text-[11px] text-center leading-relaxed">
            🌾 <strong>Disclaimer:</strong> Weather advice is presented as meteorological guidance, not a guaranteed forecast. Local microclimates, sudden convective storm cells, and canal release shifts may alter field conditions.
          </div>
        </div>
      ) : null}
    </div>
  );
}
