"use client";

import React, { useState, useEffect, useRef } from "react";
import { Video, VideoOff, Mic, MicOff, RefreshCw, PhoneOff, AlertTriangle, ShieldCheck } from "lucide-react";

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  peerName: string;
  peerRole: string;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  peerName,
  peerRole,
}) => {
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let timer = setInterval(() => {
      setDurationSeconds((prev) => prev + 1);
    }, 1000);

    // Initialize local media stream
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: true,
        });
        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setCameraError(null);
      } catch (err) {
        console.warn("Camera/Microphone permission denied or device absent:", err);
        setCameraError("Camera access not granted or virtual device active. Visual simulation enabled.");
      }
    }

    initCamera();

    return () => {
      clearInterval(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, facingMode]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-stone-900 rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 bg-black/40 flex items-center justify-between text-white border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Inspection Call with {peerName}</span>
              <span className="text-xs text-stone-400 capitalize">({peerRole})</span>
            </div>
            <p className="text-[11px] text-amber-300">
              ⚠️ Video calls are limited in duration to conserve agricultural field bandwidth.
            </p>
          </div>
          <div className="px-3 py-1 bg-white/10 rounded-full font-mono text-xs font-bold text-emerald-300">
            {formatTimer(durationSeconds)}
          </div>
        </div>

        {/* Video Stage */}
        <div className="relative h-[360px] sm:h-[420px] bg-stone-950 flex items-center justify-center overflow-hidden">
          {/* Peer Screen (Mock Feed) */}
          <div className="w-full h-full relative flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000&auto=format&fit=crop&q=80"
              alt="Peer Farm Lot Inspection"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs text-white">
              🌾 {peerName}'s Farm Lot Preview (Live Feed)
            </div>
          </div>

          {/* Local Farmer PiP Preview */}
          <div className="absolute top-4 right-4 w-28 sm:w-36 h-36 sm:h-48 rounded-2xl overflow-hidden bg-black/80 border-2 border-emerald-500 shadow-2xl">
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
            <div className="absolute bottom-1 right-2 text-[9px] text-white/80 bg-black/60 px-1 rounded">
              You
            </div>
          </div>

          {cameraError && (
            <div className="absolute top-4 left-4 max-w-xs bg-amber-950/80 border border-amber-600/50 p-2.5 rounded-xl text-amber-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}
        </div>

        {/* Call Controls Bar */}
        <div className="p-4 bg-stone-950/90 border-t border-white/10 flex items-center justify-center gap-4">
          <button
            onClick={toggleMic}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              micActive ? "bg-stone-800 hover:bg-stone-700 text-white" : "bg-red-600 text-white"
            }`}
            title={micActive ? "Mute Microphone" : "Unmute Microphone"}
          >
            {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleCamera}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              cameraActive ? "bg-stone-800 hover:bg-stone-700 text-white" : "bg-red-600 text-white"
            }`}
            title={cameraActive ? "Turn Off Camera" : "Turn On Camera"}
          >
            {cameraActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={switchCamera}
            className="w-12 h-12 rounded-full bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center transition-colors"
            title="Switch Front/Rear Camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="w-14 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-lg"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
