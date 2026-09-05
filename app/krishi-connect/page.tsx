"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../lib/store/app-store";
import { useLanguage } from "../../lib/i18n/i18n-context";
import { formatDistance } from "../../lib/services/location.service";
import {
  KrishiConnectService,
  initialKrishiProfiles,
} from "../../lib/services/krishi-connect.service";
import { KrishiConnectProfile, ConnectionStatus } from "../../lib/types";
import { ALL_INDIAN_STATES } from "../../lib/data/india-locations";
import { VideoCallModal } from "../../components/krishi-connect/video-call-modal";
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
  Radio,
  SlidersHorizontal,
  UserCheck,
  ExternalLink,
  Sparkles,
  LayoutGrid,
  Map as MapIcon,
  PhoneCall,
  LogIn,
  UserPlus,
  RefreshCw,
  Star,
  Sprout,
  Building2,
  ShoppingCart,
} from "lucide-react";

export default function KrishiConnectPage() {
  const router = useRouter();
  const { userCoords, requestLocation, hasLocationPermission } = useApp();
  const { t } = useLanguage();

  const [activeProfile, setActiveProfile] = useState<KrishiConnectProfile | null>(null);
  const [profiles, setProfiles] = useState<KrishiConnectProfile[]>([]);
  const [connections, setConnections] = useState<{ [id: string]: ConnectionStatus }>({});
  const [selectedState, setSelectedState] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("matched");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState<number>(150);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedVideoPeer, setSelectedVideoPeer] = useState<KrishiConnectProfile | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Load active profile and initial discovery results
  useEffect(() => {
    const profile = KrishiConnectService.getActiveProfile();
    setActiveProfile(profile);

    // If active profile exists, default to role-matched discovery
    if (profile) {
      if (profile.registrationType === "BUYER") {
        setRoleFilter("sellers");
      } else {
        setRoleFilter("buyers");
      }
    } else {
      setRoleFilter("all");
    }

    refreshProfiles();
  }, []);

  // Refresh discovery profiles based on active filters
  const refreshProfiles = () => {
    const profile = KrishiConnectService.getActiveProfile();
    const referenceCoords = userCoords || profile?.coordinates || { lat: 30.9010, lng: 75.8573 };

    const discovered = KrishiConnectService.getDiscoveries({
      viewerProfile: profile,
      referenceCoords,
      roleFilter: roleFilter as any,
      searchQuery,
      maxDistanceKm: maxDistance > 250 ? 0 : maxDistance,
      state: selectedState,
    });

    setProfiles(discovered);

    // Sync connection statuses
    const connMap: { [id: string]: ConnectionStatus } = {};
    discovered.forEach((p) => {
      connMap[p.id] = KrishiConnectService.getConnectionStatus(p.id, profile?.id);
    });
    setConnections(connMap);
  };

  useEffect(() => {
    refreshProfiles();
  }, [roleFilter, searchQuery, maxDistance, selectedState, userCoords]);

  const handleGrantLocation = async () => {
    setShowLocationModal(false);
    await requestLocation();
    refreshProfiles();
  };

  const handleConnect = (peer: KrishiConnectProfile) => {
    const currentStatus = connections[peer.id] || "NOT_CONNECTED";
    let nextStatus: ConnectionStatus = "REQUEST_SENT";

    if (currentStatus === "REQUEST_SENT") {
      nextStatus = "CONNECTED";
      KrishiConnectService.acceptConnection(peer.id, activeProfile?.id);
      showToast(`🤝 Connected with ${peer.name}! You can now initiate direct chat and video inspection.`);
    } else if (currentStatus === "NOT_CONNECTED") {
      nextStatus = "REQUEST_SENT";
      KrishiConnectService.sendConnectionRequest(peer.id, activeProfile?.id);
      showToast(`📨 Trade connection request dispatched to ${peer.name}.`);
    }

    setConnections((prev) => ({ ...prev, [peer.id]: nextStatus }));
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-[#083344] text-white border border-cyan-500 shadow-2xl text-xs font-semibold flex items-center gap-2 animate-slideIn">
          <span>🌾</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Geolocation Permission Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#082933] rounded-3xl p-6 max-w-lg w-full border border-stone-200 dark:border-cyan-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  Allow Approximate Geolocation Access?
                </h3>
                <p className="text-[11px] text-stone-500">AgriKin Krishi Connect Matchmaking</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800/80 text-xs text-stone-700 dark:text-stone-300 space-y-2 leading-relaxed">
              <p>
                We use your approximate device location to calculate relative distances to nearby farmers, grain buyers, and input providers.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-bold text-cyan-800 dark:text-cyan-300">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span>Zero coordinate leak: Exact farm or home GPS is never shared with peers.</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#083344]/40 rounded-xl"
              >
                Skip for Now
              </button>
              <button
                onClick={handleGrantLocation}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-600 hover:to-teal-600 rounded-xl shadow-md"
              >
                Allow Approximate Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner: Active User Session or Sign In / Sign Up Prompt */}
      {activeProfile ? (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#083344] via-[#0E5266] to-[#042129] text-white shadow-xl border border-cyan-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={activeProfile.photo}
              alt={activeProfile.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-yellow-400 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-yellow-300">
                  {activeProfile.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase">
                  {activeProfile.registrationType} • {activeProfile.category}
                </span>
              </div>
              <p className="text-xs text-cyan-200 mt-0.5">
                Operating from <strong>{activeProfile.district}, {activeProfile.state}</strong> •{" "}
                {activeProfile.registrationType === "BUYER"
                  ? "Priority finding: Verified Crop Sellers & Farmers"
                  : "Priority finding: Mandi Aggregators & Direct Buyers"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/krishi-connect/chats"
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-cyan-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Trade Chats</span>
            </Link>
            <Link
              href="/krishi-connect/login"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold"
            >
              Switch Account
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-[#083344] via-[#0E5266] to-[#042129] text-white border border-cyan-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-300 text-xs font-bold mb-1">
              <Sprout className="w-4 h-4" />
              <span>Join India&apos;s Direct Agricultural Protocol</span>
            </div>
            <p className="text-xs text-cyan-100 max-w-xl">
              Sign in or register your 4-step verified profile to chat directly with nearby farmers, access live mandi video inspection, and post trade requirements.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/krishi-connect/login"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/krishi-connect/signup"
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register (Buyer / Seller)</span>
            </Link>
          </div>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-300 text-xs font-semibold mb-2 border border-cyan-200 dark:border-cyan-800">
            <span>🌾 ȺցɾìҠìղ Matchmaking Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Krishi Connect Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl mt-1">
            Zero middlemen, direct field transactions. Connecting certified farmers, mandi traders, food processors, and input suppliers across all 36 Indian States & UTs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/krishi-connect/chats"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Chats & Messages</span>
          </Link>

          <button
            onClick={() => setShowLocationModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F0] dark:bg-cyan-950/60 hover:bg-cyan-50 text-stone-700 dark:text-stone-200 text-xs font-bold transition-colors border border-[#EAE3D5] dark:border-cyan-800"
            title="Update approximate location"
          >
            <Compass className="w-4 h-4 text-cyan-700" />
            <span className="hidden sm:inline">Calibrate Location</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#FFFEFD] dark:bg-[#083344] border border-[#EAE3D5] dark:border-cyan-800/60 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop (Basmati, Onion), partner name, or district..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#EAE3D5] dark:border-cyan-800 bg-[#FAF7F0] dark:bg-cyan-950/40 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
            />
          </div>

          {/* State / UT Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#EAE3D5] dark:border-cyan-800 bg-[#FAF7F0] dark:bg-cyan-950/40 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
            >
              <option value="all">🇮🇳 All 36 States & UTs</option>
              {ALL_INDIAN_STATES.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Distance Slider */}
          <div className="md:col-span-4 flex items-center gap-3 px-2">
            <span className="text-xs text-stone-500 whitespace-nowrap">Radius:</span>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-cyan-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-cyan-800 dark:text-cyan-300 whitespace-nowrap min-w-[55px] text-right">
              {maxDistance > 250 ? "Pan-India" : `${maxDistance} km`}
            </span>
          </div>
        </div>

        {/* Role Tabs & View Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#EAE3D5] dark:border-cyan-900">
          {/* Role Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF7F0] dark:bg-cyan-950/50 p-1 rounded-2xl text-xs border border-[#EAE3D5] dark:border-cyan-800">
            {[
              { id: "all", label: "All Marketplace" },
              { id: "sellers", label: "🌾 Sellers & Farmers" },
              { id: "buyers", label: "🏢 Buyers & Mandi Demand" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                  roleFilter === tab.id
                    ? "bg-[#FFFEFD] dark:bg-cyan-700 text-cyan-950 dark:text-white shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-500 font-semibold">
              {profiles.length} listings found
            </span>
            <div className="flex items-center bg-[#FAF7F0] dark:bg-cyan-950/50 p-1 rounded-xl border border-[#EAE3D5]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-cyan-700 text-cyan-900 dark:text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "map"
                    ? "bg-white dark:bg-cyan-700 text-cyan-900 dark:text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                title="Regional Map View"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Overview Mode */}
      {viewMode === "map" && (
        <div className="p-6 rounded-3xl bg-[#FFFEFD] dark:bg-[#083344] border border-[#EAE3D5] dark:border-cyan-800/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-cyan-700" />
              <span>Regional Agricultural Clustering Map</span>
            </h3>
            <span className="text-xs text-stone-500">
              Showing approximate distribution across Indian states
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {[
              { region: "North India (Punjab, Haryana, UP)", count: profiles.filter(p => ["Punjab", "Uttar Pradesh", "Haryana"].includes(p.state)).length, hub: "Wheat, Basmati, Mustard" },
              { region: "West India (Maharashtra, Gujarat)", count: profiles.filter(p => ["Maharashtra", "Gujarat"].includes(p.state)).length, hub: "Onion, Grapes, Groundnut" },
              { region: "South India (Telangana, Karnataka, TN)", count: profiles.filter(p => ["Telangana", "Tamil Nadu", "Karnataka"].includes(p.state)).length, hub: "Sona Masoori, Cotton, Spices" },
              { region: "Central India (MP, Rajasthan)", count: profiles.filter(p => ["Madhya Pradesh", "Rajasthan"].includes(p.state)).length, hub: "Soybean, Pulses, Mustard" },
            ].map((reg) => (
              <div key={reg.region} className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-950/30 border border-[#EAE3D5] dark:border-cyan-800 space-y-1.5">
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100">{reg.region}</div>
                <div className="text-lg font-black text-cyan-700 dark:text-cyan-400">{reg.count} Active Traders</div>
                <div className="text-[11px] text-stone-500">{reg.hub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profiles Cards Grid */}
      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((peer) => {
            const connStatus = connections[peer.id] || "NOT_CONNECTED";
            const isConnected = connStatus === "CONNECTED";
            const isPending = connStatus === "REQUEST_SENT";

            return (
              <div
                key={peer.id}
                className="rounded-3xl bg-[#FFFEFD] dark:bg-[#083344] border border-[#EAE3D5] dark:border-cyan-800/60 shadow-xs hover:shadow-xl hover:border-cyan-300 transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Card Top Details */}
                <div className="p-6 space-y-4">
                  {/* Photo, Name, Verified, Role */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={peer.photo}
                        alt={peer.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-600 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/krishi-connect/${peer.id}`}
                            className="font-bold text-base text-stone-900 dark:text-stone-100 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors"
                          >
                            {peer.name}
                          </Link>
                          {peer.verified && (
                            <ShieldCheck className="w-4 h-4 text-cyan-600 fill-cyan-100 dark:fill-cyan-900" />
                          )}
                        </div>
                        <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-700" />
                          <span>{peer.district}, {peer.state}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        peer.registrationType === "BUYER" || peer.role === "buyer"
                          ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800"
                          : "bg-cyan-50 text-cyan-950 border border-cyan-300 dark:bg-cyan-950/60 dark:text-cyan-200 dark:border-cyan-800"
                      }`}
                    >
                      {peer.category || peer.registrationType}
                    </span>
                  </div>

                  {/* Distance & Rating Badges */}
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F0] dark:bg-cyan-950/40 text-[11px] font-semibold text-cyan-800 dark:text-cyan-300 border border-[#EAE3D5]">
                      <Compass className="w-3 h-3 text-cyan-700" />
                      <span>{formatDistance(peer.distanceKm)}</span>
                    </div>

                    {peer.rating && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-50 dark:bg-yellow-950/40 text-[11px] font-bold text-yellow-800 dark:text-yellow-300 border border-yellow-200/60 dark:border-yellow-800/40">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" />
                        <span>{peer.rating}</span>
                        <span className="text-stone-400 font-normal">({peer.totalTrades} trades)</span>
                      </div>
                    )}
                  </div>

                  {/* Product Specification Box */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-950/20 border border-[#EAE3D5] dark:border-cyan-800/80 space-y-1.5 text-xs">
                    <div>
                      <span className="text-stone-500 font-medium">
                        {peer.registrationType === "BUYER" ? "Seeking / Procuring: " : "Offering / Produce: "}
                      </span>
                      <strong className="text-stone-900 dark:text-stone-100">{peer.product}</strong>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-[#EAE3D5] dark:border-cyan-800/60">
                      <div>
                        <span className="text-stone-500">Qty: </span>
                        <strong className="text-stone-800 dark:text-stone-200">
                          {peer.quantityRequired || `${peer.quantity} ${peer.unit || "Quintals"}`}
                        </strong>
                      </div>
                      <div>
                        <span className="text-stone-500">Rate: </span>
                        <strong className="text-cyan-700 dark:text-cyan-400 font-bold">
                          {peer.priceRange || peer.price}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Bio Snippet */}
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {peer.bio}
                  </p>
                </div>

                {/* Card Actions Bottom Bar */}
                <div className="px-6 py-4 bg-[#FAF7F0]/80 dark:bg-cyan-950/40 border-t border-[#EAE3D5] dark:border-cyan-800/80 flex items-center gap-2">
                  <Link
                    href={`/krishi-connect/chat/${peer.id}`}
                    className="flex-1 py-2.5 bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat & Trade</span>
                  </Link>

                  <button
                    onClick={() => setSelectedVideoPeer(peer)}
                    className="p-2.5 rounded-xl bg-white dark:bg-cyan-800/80 hover:bg-cyan-100 text-cyan-800 dark:text-cyan-200 transition-colors border border-[#EAE3D5]"
                    title="Start Live Video Inspection Call (10m max)"
                  >
                    <Video className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleConnect(peer)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isConnected
                        ? "bg-cyan-100 text-cyan-900 border border-cyan-300 dark:bg-cyan-900/60 dark:text-cyan-200"
                        : isPending
                        ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-200"
                        : "bg-white dark:bg-cyan-800 text-stone-800 dark:text-stone-100 border border-[#EAE3D5] dark:border-cyan-700 hover:bg-[#FAF7F0]"
                    }`}
                  >
                    {isConnected ? "Connected ✓" : isPending ? "Pending ⏳" : "Connect"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#082933] border border-stone-200 dark:border-cyan-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-cyan-900 text-stone-400 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-stone-800 dark:text-stone-200">
            No agricultural matches found with current filters
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try broadening your radius slider to 150+ km or selecting &quot;All 36 States & UTs&quot; to see pan-India agricultural trade listings.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedState("all");
              setMaxDistance(250);
              setRoleFilter("all");
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Video Call Modal */}
      {selectedVideoPeer && (
        <VideoCallModal
          isOpen={true}
          onClose={() => setSelectedVideoPeer(null)}
          peerName={selectedVideoPeer.name}
          peerRole={selectedVideoPeer.registrationType || selectedVideoPeer.role}
          peerPhoto={selectedVideoPeer.photo}
          peerId={selectedVideoPeer.id}
        />
      )}
    </div>
  );
}
