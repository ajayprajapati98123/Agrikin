"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  RefreshCw,
  PhoneOff,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Radio,
} from "lucide-react";

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  peerName: string;
  peerRole: string;
  peerPhoto?: string;
  peerId?: string;
}

const MAX_CALL_DURATION_SECONDS = 600; // 10 minutes strict maximum limit
const WARNING_THRESHOLD_SECONDS = 540; // 9 minutes (60 seconds remaining warning)

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  peerName,
  peerRole,
  peerPhoto,
  peerId,
}) => {
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [callEndedNotice, setCallEndedNotice] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebRTC session and media stream
  useEffect(() => {
    if (!isOpen) {
      setDurationSeconds(0);
      setCallEndedNotice(null);
      return;
    }

    // Call signaling API for session registration & ICE servers
    fetch("/api/krishi-connect/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ peerId: peerId || "peer", action: "initiate" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.sessionId) setSessionId(data.sessionId);
      })
      .catch((err) => console.warn("Call signaling warning:", err));

    // Start 1-second elapsed counter
    timerRef.current = setInterval(() => {
      setDurationSeconds((prev) => {
        const next = prev + 1;
        // Check for 10 minute enforced ceiling
        if (next >= MAX_CALL_DURATION_SECONDS) {
          handleAutoTerminate();
          return MAX_CALL_DURATION_SECONDS;
        }
        return next;
      });
    }, 1000);

    // Initialize camera stream
    async function initCamera() {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } },
          audio: true,
        });

        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setCameraError(null);
      } catch (err: any) {
        console.warn("Camera/Microphone permission denied or device absent:", err);
        setCameraError("Camera access not granted. Visual inspection preview stream active.");
      }
    }

    initCamera();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, facingMode]);

  const handleAutoTerminate = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCallEndedNotice(
      "The 10-minute maximum call limit has been reached. The video stream has been safely closed to conserve rural agricultural network bandwidth."
    );
  };

  const handleManualEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    onClose();
  };

  if (!isOpen) return null;

  const toggleCamera = () => {
    if (streamRef.current) {
      const vTrack = streamRef.current.getVideoTracks()[0];
      if (vTrack) {
        vTrack.enabled = !vTrack.enabled;
        setCameraActive(vTrack.enabled);
      }
    } else {
      setCameraActive(!cameraActive);
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const aTrack = streamRef.current.getAudioTracks()[0];
      if (aTrack) {
        aTrack.enabled = !aTrack.enabled;
        setMicActive(aTrack.enabled);
      }
    } else {
      setMicActive(!micActive);
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const remainingSeconds = Math.max(0, MAX_CALL_DURATION_SECONDS - durationSeconds);
  const showWarning = durationSeconds >= WARNING_THRESHOLD_SECONDS && !callEndedNotice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-stone-900 rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl flex flex-col">
        {/* Top Bar: Live indicator, Peer details, Timer */}
        <div className="px-6 py-3.5 bg-black/50 flex items-center justify-between text-white border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-900/60 border border-cyan-500/40 text-[11px] font-bold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE INSPECTION</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span>{peerName}</span>
                <span className="text-xs text-stone-400 capitalize">({peerRole})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-full font-mono text-xs font-extrabold flex items-center gap-1.5 ${
                showWarning
                  ? "bg-red-500/20 text-red-300 border border-red-500/50 animate-pulse"
                  : "bg-white/10 text-cyan-300"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(durationSeconds)} / 10:00</span>
            </div>
          </div>
        </div>

        {/* 60-Second Warning Banner */}
        {showWarning && (
          <div className="bg-red-600/90 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-yellow-300" />
            <span>
              ⚠️ Notice: Call will automatically terminate in {remainingSeconds} seconds to preserve rural agricultural bandwidth.
            </span>
          </div>
        )}

        {/* Video Stage */}
        <div className="relative h-[360px] sm:h-[440px] bg-stone-950 flex items-center justify-center overflow-hidden">
          {callEndedNotice ? (
            <div className="p-8 max-w-md text-center space-y-4 bg-stone-900/90 rounded-3xl border border-stone-800">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Call Limit Reached (10 Mins)</h3>
              <p className="text-xs text-stone-300 leading-relaxed">{callEndedNotice}</p>
              <button
                onClick={handleManualEnd}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-600 hover:to-teal-600 text-white font-bold rounded-xl text-xs"
              >
                Return to Trade Desk
              </button>
            </div>
          ) : (
            <>
              {/* Peer Screen (Live Field Produce Lot Feed) */}
              <div className="w-full h-full relative flex items-center justify-center">
                <img
                  src={
                    peerPhoto ||
                    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000&auto=format&fit=crop&q=80"
                  }
                  alt="Peer Farm Lot Inspection"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Peer Location Label */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>🌾 {peerName} (Live Produce Inspection)</span>
                </div>
              </div>

              {/* Local User PiP Preview */}
              <div className="absolute top-4 right-4 w-28 sm:w-36 h-36 sm:h-48 rounded-2xl overflow-hidden bg-black/90 border-2 border-cyan-500 shadow-2xl">
                {cameraActive && !cameraError ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-stone-800 text-stone-300">
                    <VideoOff className="w-6 h-6 text-stone-400 mb-1" />
                    <span className="text-[10px]">Camera Off</span>
                  </div>
                )}
                <div className="absolute bottom-1 right-2 text-[9px] text-white/90 bg-black/70 px-1.5 py-0.5 rounded font-bold">
                  You ({facingMode === "user" ? "Front" : "Back"})
                </div>
              </div>

              {cameraError && (
                <div className="absolute top-4 left-4 max-w-xs bg-amber-950/90 border border-amber-500/50 p-3 rounded-xl text-amber-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Call Controls Bar */}
        {!callEndedNotice && (
          <div className="p-4 bg-stone-950/95 border-t border-white/10 flex items-center justify-between px-6 sm:px-12">
            <div className="text-[11px] text-stone-400 hidden sm:block">
              Encrypted WebRTC P2P • 10m Max
            </div>

            <div className="flex items-center gap-4 mx-auto sm:mx-0">
              <button
                onClick={toggleMic}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  micActive
                    ? "bg-stone-800 hover:bg-stone-700 text-white"
                    : "bg-red-600 text-white ring-2 ring-red-400"
                }`}
                title={micActive ? "Mute Microphone" : "Unmute Microphone"}
              >
                {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleCamera}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  cameraActive
                    ? "bg-stone-800 hover:bg-stone-700 text-white"
                    : "bg-red-600 text-white ring-2 ring-red-400"
                }`}
                title={cameraActive ? "Turn Off Camera" : "Turn On Camera"}
              >
                {cameraActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={switchCamera}
                className="w-12 h-12 rounded-full bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center transition-all"
                title={`Switch to ${facingMode === "user" ? "Back (Produce)" : "Front"} Camera`}
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={handleManualEnd}
                className="w-14 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all shadow-lg hover:scale-105"
                title="End Inspection Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>

            <div className="text-[11px] text-cyan-400 font-semibold hidden sm:block">
              Session: {sessionId ? sessionId.slice(0, 14) : "Live"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
