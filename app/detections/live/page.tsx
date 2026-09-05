"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { AIService } from "../../../lib/services/ai.service";
import { DetectionResult } from "../../../lib/types";
import { Camera, RefreshCw, Mic, X, ArrowLeft, Sparkles, AlertTriangle } from "lucide-react";

export default function LiveDetectionPage() {
  const [cameraActive, setCameraActive] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DetectionResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraError(null);
      } catch (err) {
        console.warn("Live camera access failed or unavailable:", err);
        setCameraError("Camera access was not granted or no optical device detected. Simulation viewport active.");
      }
    }

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode]);

  const captureFrame = async () => {
    let frameDataUrl: string | null = null;

    if (videoRef.current && canvasRef.current && !cameraError) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frameDataUrl = canvas.toDataURL("image/jpeg");
      }
    } else {
      // Fallback high-res leaf sample
      frameDataUrl = "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=600&auto=format&fit=crop&q=80";
    }

    if (frameDataUrl) {
      setCapturedFrame(frameDataUrl);
      setAnalyzing(true);
      try {
        const result = await AIService.detectCropDisease("crop", [frameDataUrl]);
        setDiagnosis(result);
      } catch (e) {
        console.error("Analysis error:", e);
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const resetScan = () => {
    setCapturedFrame(null);
    setDiagnosis(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/detections"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-800 dark:text-cyan-300 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Live Scanner</span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-100 dark:bg-cyan-900/60 rounded-full text-xs font-bold text-cyan-900 dark:text-cyan-200">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>Real-Time Optical Vision Active</span>
        </div>
      </div>

      {/* Main Scanner Container */}
      <div className="relative rounded-3xl bg-black overflow-hidden border border-cyan-500/40 shadow-2xl aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center">
        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Video Feed */}
        {!capturedFrame ? (
          cameraError ? (
            <div className="w-full h-full relative flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=1000&auto=format&fit=crop&q=80"
                alt="Simulated Leaf Scan"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute top-4 left-4 max-w-sm bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
                <span>{cameraError}</span>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <img src={capturedFrame} alt="Captured Crop" className="w-full h-full object-cover" />
        )}

        {/* Reticle / Scanning Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none border-[24px] border-black/30 flex items-center justify-center">
          <div className="w-64 sm:w-80 h-64 sm:h-80 border-2 border-cyan-400/80 rounded-3xl relative">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-yellow-400 rounded-tl-xl" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-yellow-400 rounded-tr-xl" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-yellow-400 rounded-bl-xl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-yellow-400 rounded-br-xl" />

            {!capturedFrame && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-[bounce_2.5s_infinite]" />
            )}
          </div>
        </div>

        {/* AI Assistant Panel Floating Banner */}
        <div className="absolute top-6 inset-x-6 flex justify-center pointer-events-none">
          <div className="bg-black/70 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Show me the affected crop leaf inside the target reticle.</span>
          </div>
        </div>

        {/* Live Diagnostics Card Overlay when Analyzed */}
        {diagnosis && (
          <div className="absolute bottom-24 inset-x-4 sm:inset-x-12 p-5 rounded-2xl bg-black/85 backdrop-blur-md border border-cyan-500 text-white space-y-2 text-xs shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-yellow-300">
                {diagnosis.detectionName}
              </span>
              <span className="px-2 py-0.5 bg-cyan-600 rounded-full font-bold">
                Confidence: {diagnosis.confidence}%
              </span>
            </div>
            <p className="text-cyan-100 line-clamp-2">
              <strong>Action:</strong> {diagnosis.recommendedActions[0]}
            </p>
            <div className="flex justify-end pt-1">
              <button
                onClick={resetScan}
                className="text-xs text-yellow-300 hover:underline font-bold"
              >
                Scan Another Leaf ↺
              </button>
            </div>
          </div>
        )}

        {/* Scanner Controls Bar */}
        <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-6">
          <button
            onClick={switchCamera}
            className="w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all"
            title="Switch Camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={captureFrame}
            disabled={analyzing}
            className="w-18 h-18 rounded-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white p-1 border-4 border-white shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Capture Frame"
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-cyan-900">
              <Camera className="w-7 h-7" />
            </div>
          </button>

          <Link
            href="/detections"
            className="w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all"
            title="End Scan"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
