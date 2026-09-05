"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "../../../lib/store/app-store";
import { formatDistance } from "../../../lib/services/location.service";
import {
  KrishiConnectService,
  initialKrishiProfiles,
} from "../../../lib/services/krishi-connect.service";
import { KrishiConnectProfile, ConnectionStatus } from "../../../lib/types";
import { VideoCallModal } from "../../../components/krishi-connect/video-call-modal";
import {
  ArrowLeft,
  MessageSquare,
  Video,
  ShieldCheck,
  MapPin,
  Award,
  Sprout,
  Compass,
  Star,
  Check,
  MoreVertical,
  Ban,
  ShieldAlert,
  Building2,
  Calendar,
  Truck,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function FarmerProfileView() {
  const params = useParams();
  const router = useRouter();
  const profileId = params?.id as string;

  const [profile, setProfile] = useState<KrishiConnectProfile | null>(null);
  const [connStatus, setConnStatus] = useState<ConnectionStatus>("NOT_CONNECTED");
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("Inaccurate harvest specifications");
  const [reportNotes, setReportNotes] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) return;

    // Fetch from service or seed
    const found =
      KrishiConnectService.getProfileById(profileId) ||
      initialKrishiProfiles.find((p) => p.id === profileId) ||
      initialKrishiProfiles[0];

    setProfile(found);
    setConnStatus(KrishiConnectService.getConnectionStatus(found.id));
    setIsBlocked(KrishiConnectService.isBlocked(found.id));
  }, [profileId]);

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-stone-500 text-sm">Loading agricultural profile...</p>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConnect = () => {
    if (connStatus === "NOT_CONNECTED") {
      KrishiConnectService.sendConnectionRequest(profile.id);
      setConnStatus("REQUEST_SENT");
      showToast(`Trade connection request dispatched to ${profile.name}.`);
    } else if (connStatus === "REQUEST_SENT") {
      KrishiConnectService.acceptConnection(profile.id);
      setConnStatus("CONNECTED");
      showToast(`🤝 Connected with ${profile.name}! You can now initiate direct video call & chat.`);
    }
  };

  const handleBlockToggle = () => {
    if (isBlocked) {
      KrishiConnectService.unblockUser(profile.id);
      setIsBlocked(false);
      showToast(`${profile.name} has been unblocked.`);
    } else {
      if (confirm(`Are you sure you want to block ${profile.name}?`)) {
        KrishiConnectService.blockUser(profile.id);
        setIsBlocked(true);
        showToast(`${profile.name} has been blocked.`);
      }
    }
    setShowOptionsMenu(false);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    KrishiConnectService.reportUser({
      peerId: profile.id,
      peerName: profile.name,
      reason: reportReason,
      details: reportNotes,
    });
    setShowReportModal(false);
    showToast(`Report submitted for review by ȺցɾìҠìղ agricultural moderation.`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-[#083344] text-white border border-cyan-500 shadow-2xl text-xs font-semibold flex items-center gap-2">
          <span>🌾</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/krishi-connect"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-800 dark:text-cyan-300 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Krishi Connect Marketplace</span>
        </Link>

        {/* Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-cyan-50 dark:hover:bg-cyan-900/40"
            title="Moderation & Safety"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showOptionsMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#FFFEFD] dark:bg-[#082933] shadow-xl border border-[#EAE3D5] dark:border-cyan-800 py-1.5 z-40 text-xs">
              <button
                onClick={handleBlockToggle}
                className="w-full flex items-center gap-2 px-4 py-2 text-stone-700 dark:text-stone-200 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 text-left"
              >
                <Ban className="w-3.5 h-3.5 text-red-500" />
                <span>{isBlocked ? "Unblock User" : "Block User"}</span>
              </button>
              <button
                onClick={() => {
                  setShowOptionsMenu(false);
                  setShowReportModal(true);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-stone-700 dark:text-stone-200 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 text-left"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>Report Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-[#FFFEFD] dark:bg-[#082933] rounded-3xl p-6 sm:p-10 border border-[#EAE3D5] dark:border-cyan-800 shadow-xl space-y-8">
        {/* Header: Photo, Name, Verified, Location, Role */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#EAE3D5] dark:border-cyan-800">
          <div className="flex items-center gap-5">
            <img
              src={profile.photo}
              alt={profile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-cyan-600 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                  {profile.name}
                </h1>
                {profile.verified && (
                  <ShieldCheck className="w-5 h-5 text-cyan-600 fill-cyan-100 dark:fill-cyan-900" />
                )}
              </div>

              <div className="text-xs text-stone-500 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-700" />
                  <span>{profile.district}, {profile.state}</span>
                </span>
                <span>•</span>
                <span className="font-semibold text-cyan-700 dark:text-cyan-400">
                  {formatDistance(profile.distanceKm)}
                </span>
                {profile.rating && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-bold text-yellow-700 dark:text-yellow-400">
                      <Star className="w-3.5 h-3.5 fill-yellow-400" />
                      <span>{profile.rating}</span>
                    </span>
                  </>
                )}
              </div>

              <div className="pt-1 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 dark:bg-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700">
                  {profile.registrationType} • {profile.category}
                </span>
                <span className="text-[11px] text-stone-400">
                  {profile.totalTrades || 10}+ Verified Trades
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 sm:self-center">
            <Link
              href={`/krishi-connect/chat/${profile.id}`}
              className="px-5 py-3 bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-600 hover:to-teal-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </Link>

            <button
              onClick={() => setIsVideoOpen(true)}
              className="px-4 py-3 bg-[#FAF7F0] dark:bg-cyan-900/60 hover:bg-cyan-50 text-stone-800 dark:text-stone-100 rounded-2xl text-xs font-bold flex items-center gap-2 border border-[#EAE3D5] dark:border-cyan-700 transition-all"
              title="Inspect produce lot live (10 min ceiling)"
            >
              <Video className="w-4 h-4 text-cyan-700 dark:text-cyan-300" />
              <span>Video Call</span>
            </button>

            <button
              onClick={handleConnect}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-xs ${
                connStatus === "CONNECTED"
                  ? "bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-900 dark:text-cyan-200"
                  : connStatus === "REQUEST_SENT"
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-[#FFFEFD] dark:bg-cyan-800 hover:bg-[#FAF7F0] text-stone-800 dark:text-stone-100 border border-[#EAE3D5] dark:border-cyan-700"
              }`}
            >
              {connStatus === "CONNECTED"
                ? "Connected ✓"
                : connStatus === "REQUEST_SENT"
                ? "Request Sent ⏳"
                : "Connect"}
            </button>
          </div>
        </div>

        {/* Key Trade Specifications Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
            Trade & Listing Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-900/30 border border-[#EAE3D5] dark:border-cyan-800">
              <div className="text-[11px] text-stone-500 font-semibold">
                {profile.registrationType === "BUYER" ? "Required Commodity" : "Available Produce"}
              </div>
              <div className="font-extrabold text-sm text-stone-900 dark:text-stone-100 mt-1">
                {profile.product}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-900/30 border border-[#EAE3D5] dark:border-cyan-800">
              <div className="text-[11px] text-stone-500 font-semibold">
                {profile.registrationType === "BUYER" ? "Target Demand Quantity" : "Available Stock Quantity"}
              </div>
              <div className="font-extrabold text-sm text-stone-900 dark:text-stone-100 mt-1">
                {profile.quantityRequired || `${profile.quantity} ${profile.unit || "Quintals"}`}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-900/30 border border-[#EAE3D5] dark:border-cyan-800">
              <div className="text-[11px] text-stone-500 font-semibold">
                {profile.registrationType === "BUYER" ? "Target Price Range" : "Quoted Dispatch Price"}
              </div>
              <div className="font-extrabold text-sm text-cyan-700 dark:text-cyan-400 mt-1">
                {profile.priceRange || profile.price}
              </div>
            </div>
          </div>
        </div>

        {/* Agricultural Practice & Background */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
            Practices & Background
          </h3>
          <div className="p-5 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-900/20 border border-[#EAE3D5] dark:border-cyan-800 text-xs text-stone-700 dark:text-stone-300 leading-relaxed space-y-3">
            <p>{profile.bio}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#EAE3D5]/60 dark:border-cyan-800/60 text-[11px]">
              <div>
                <span className="text-stone-500 block">Experience:</span>
                <strong className="text-stone-900 dark:text-stone-100">{profile.experience}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">Availability / Dispatch:</span>
                <strong className="text-stone-900 dark:text-stone-100">{profile.availability}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">Operating Radius:</span>
                <strong className="text-stone-900 dark:text-stone-100">{profile.radiusKm || 100} km</strong>
              </div>
              <div>
                <span className="text-stone-500 block">Weighing / Mandi:</span>
                <strong className="text-cyan-700 dark:text-cyan-300">Electronic Calibrated</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/80 flex items-center gap-3 text-xs text-cyan-900 dark:text-cyan-200">
          <Lock className="w-5 h-5 text-cyan-600 shrink-0" />
          <p>
            Exact GPS coordinates are protected under ȺցɾìҠìղ security standards. Communication occurs over encrypted channels with 10-minute video inspection sessions.
          </p>
        </div>
      </div>

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        peerName={profile.name}
        peerRole={profile.registrationType || profile.role}
        peerPhoto={profile.photo}
        peerId={profile.id}
      />

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleReportSubmit}
            className="bg-[#FFFEFD] dark:bg-[#082933] rounded-3xl p-6 max-w-md w-full border border-[#EAE3D5] dark:border-cyan-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  Report {profile.name}
                </h3>
                <p className="text-[11px] text-stone-500">AgriKin Moderation Team</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                Reason for Reporting
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EAE3D5] dark:border-cyan-800 bg-[#FAF7F0] dark:bg-cyan-900/40 text-xs"
              >
                <option value="Inaccurate harvest specifications">Inaccurate harvest specifications</option>
                <option value="Suspicious pricing or fraudulent demand">Suspicious pricing or fraudulent demand</option>
                <option value="Unresponsive after agreement">Unresponsive after agreement</option>
                <option value="Inappropriate communication">Inappropriate communication</option>
                <option value="Other agricultural grievance">Other agricultural grievance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                Additional Notes
              </label>
              <textarea
                rows={3}
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                placeholder="Provide specific lot or dispute details..."
                className="w-full p-3 rounded-xl border border-[#EAE3D5] dark:border-cyan-800 bg-[#FAF7F0] dark:bg-cyan-900/40 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-[#FAF7F0] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
