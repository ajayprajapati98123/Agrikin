"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "../../lib/store/app-store";
import { useLanguage } from "../../lib/i18n/i18n-context";
import { formatDistance } from "../../lib/services/location.service";
import {
  Users,
  Search,
  Filter,
  MapPin,
  Compass,
  Check,
  MessageSquare,
  Video,
  ShieldCheck,
  ArrowUpDown,
} from "lucide-react";

export default function KrishiConnectPage() {
  const { farmers, connectedFarmerIds, connectWithFarmer, requestLocation, hasLocationPermission } = useApp();
  const { t } = useLanguage();

  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState<number>(50);
  const [showLocationDialog, setShowLocationDialog] = useState(!hasLocationPermission);

  const handleGrantLocation = async () => {
    setShowLocationDialog(false);
    await requestLocation();
  };

  const filteredFarmers = farmers.filter((f) => {
    const matchesRole = roleFilter === "all" || f.role === roleFilter;
    const matchesSearch =
      searchQuery === "" ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.crops.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistance = f.distanceKm === undefined || f.distanceKm <= maxDistance;
    return matchesRole && matchesSearch && matchesDistance;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Location Permission Modal / Banner */}
      {showLocationDialog && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white shadow-xl border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-yellow-300">
              <Compass className="w-5 h-5" />
              <span>Allow ȺցɾìҠìղ to access your approximate location?</span>
            </div>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              We use your approximate location to calculate distance to nearby farmers, buyers, and sellers. Your exact residential or farm coordinates are <strong>never</strong> exposed to other users; only approximate distances (e.g. "5.8 km away") are displayed.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleGrantLocation}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-bold rounded-xl text-xs shadow transition-all"
            >
              Allow Approximate Location
            </button>
            <button
              onClick={() => setShowLocationDialog(false)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs"
            >
              Skip for Now
            </button>
          </div>
        </div>
      )}

      {/* Header & Mission */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300 text-xs font-semibold mb-2">
            <span>🌾 AgriKin Matchmaking Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Krishi Connect
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl mt-1">
            Connect agricultural buyers, sellers, and farmers based on crop type, produce quantity, expected price, and proximity. Zero middlemen, direct field transactions.
          </p>
        </div>

        <button
          onClick={() => requestLocation()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 dark:bg-emerald-900/60 hover:bg-emerald-100 text-stone-700 dark:text-stone-200 text-xs font-bold self-start md:self-auto"
        >
          <Compass className="w-4 h-4 text-emerald-700" />
          <span>Update My Location</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop, product, farmer name, or district..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="md:col-span-4 flex rounded-xl bg-stone-100 dark:bg-emerald-900/40 p-1 text-xs">
            {[
              { id: "all", label: "All" },
              { id: "farmer", label: "Farmers" },
              { id: "buyer", label: "Buyers" },
              { id: "seller", label: "Input Sellers" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRoleFilter(r.id)}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center ${
                  roleFilter === r.id
                    ? "bg-white dark:bg-emerald-700 text-emerald-900 dark:text-white shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Max Distance Slider */}
          <div className="md:col-span-3 flex items-center gap-2 text-xs px-2">
            <span className="text-stone-500 whitespace-nowrap">Within:</span>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <span className="font-bold text-emerald-800 dark:text-emerald-300 whitespace-nowrap">
              {maxDistance} km
            </span>
          </div>
        </div>
      </div>

      {/* Farmer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarmers.map((farmer) => {
          const isConnected = connectedFarmerIds.includes(farmer.id);
          return (
            <div
              key={farmer.id}
              className="rounded-3xl bg-white dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Photo, Role Badge, Approx Distance */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={farmer.photo}
                        alt={farmer.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600 shadow"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                            {farmer.name}
                          </h3>
                          {farmer.verified && (
                            <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                          )}
                        </div>
                        <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{farmer.district}, {farmer.state}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        farmer.role === "buyer"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : farmer.role === "seller"
                          ? "bg-blue-100 text-blue-900 border border-blue-300"
                          : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      }`}
                    >
                      {farmer.role}
                    </span>
                  </div>

                  {/* Distance Indicator */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-emerald-900/40 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    <Compass className="w-3 h-3 text-emerald-700" />
                    <span>{formatDistance(farmer.distanceKm)}</span>
                  </div>

                  {/* Product, Quantity & Price Details */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-100 dark:border-emerald-800/80 space-y-1.5 text-xs">
                    <div>
                      <span className="text-stone-500 font-medium">Offering / Requirement: </span>
                      <strong className="text-stone-900 dark:text-stone-100">{farmer.product}</strong>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-stone-200/60 dark:border-emerald-800/60">
                      <div>
                        <span className="text-stone-500">Qty: </span>
                        <strong className="text-stone-800 dark:text-stone-200">{farmer.quantity}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500">Price: </span>
                        <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{farmer.price}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {farmer.bio}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-stone-50/80 dark:bg-emerald-900/40 border-t border-stone-100 dark:border-emerald-800/80 flex items-center gap-2">
                <Link
                  href={`/krishi-connect/chat/${farmer.id}`}
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat & Inspect</span>
                </Link>

                <button
                  onClick={() => connectWithFarmer(farmer.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isConnected
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-white dark:bg-emerald-800 text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-emerald-700 hover:bg-stone-50"
                  }`}
                >
                  {isConnected ? "Connected ✓" : "Connect"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
