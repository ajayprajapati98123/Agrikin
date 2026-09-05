"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Upload,
  Camera,
  RotateCw,
  RotateCcw,
  Sparkles,
  Sliders,
  Check,
  RefreshCw,
  Sun,
  Contrast,
  Palette,
  FlipHorizontal,
  ZoomIn,
  Move,
  Image as ImageIcon,
} from "lucide-react";

interface PhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl?: string;
  onPhotoSaved: (newUrl: string) => void;
}

type FilterPreset = "none" | "golden_sunrise" | "vibrant_harvest" | "clean_portrait" | "monochrome";

export const PhotoEditorModal: React.FC<PhotoEditorModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  onPhotoSaved,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    currentPhotoUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400"
  );
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FilterPreset>("none");
  const [saving, setSaving] = useState<boolean>(false);
  const [aiEnhanceActive, setAiEnhanceActive] = useState<boolean>(false);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"adjust" | "filters" | "samples">("adjust");

  // Camera capture state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const sampleAvatars = [
    {
      name: "Sukhwinder (Punjab)",
      url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Rameshwar (Maharashtra)",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Kavita (Madhya Pradesh)",
      url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Arjun (Haryana)",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    },
  ];

  // Stop camera when closing or unmounting
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen, stopCamera]);

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      alert("Unable to access camera. Please check camera permissions or upload an image file.");
    }
  };

  // Capture from Camera
  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const offscreen = document.createElement("canvas");
    offscreen.width = video.videoWidth || 640;
    offscreen.height = video.videoHeight || 640;
    const ctx = offscreen.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, offscreen.width, offscreen.height);
      const dataUrl = offscreen.toDataURL("image/jpeg", 0.92);
      setSelectedImage(dataUrl);
      resetAdjustments();
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSelectedImage(reader.result);
          resetAdjustments();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAdjustments = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setRotation(0);
    setIsFlipped(false);
    setActiveFilter("none");
    setAiEnhanceActive(false);
    setAiScore(null);
  };

  // Apply AI Auto-Enhance
  const handleAiAutoEnhance = () => {
    setAiEnhanceActive(true);
    setBrightness(8);
    setContrast(12);
    setSaturation(15);
    setActiveFilter("vibrant_harvest");
    setAiScore(96);
  };

  // Redraw Canvas whenever any adjustment changes
  useEffect(() => {
    if (!isOpen || isCameraActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = selectedImage;

    img.onload = () => {
      const size = 320;
      canvas.width = size;
      canvas.height = size;

      ctx.clearRect(0, 0, size, size);

      // Build CSS Filter string
      let filterString = `brightness(${100 + brightness}%) contrast(${100 + contrast}%) saturate(${100 + saturation}%)`;
      if (activeFilter === "golden_sunrise") {
        filterString += " sepia(20%) hue-rotate(-10deg)";
      } else if (activeFilter === "vibrant_harvest") {
        filterString += " saturate(130%) contrast(110%)";
      } else if (activeFilter === "clean_portrait") {
        filterString += " brightness(105%) contrast(105%)";
      } else if (activeFilter === "monochrome") {
        filterString += " grayscale(100%) contrast(120%)";
      }

      ctx.filter = filterString;

      ctx.save();
      // Translate to center
      ctx.translate(size / 2 + pan.x, size / 2 + pan.y);
      ctx.rotate((rotation * Math.PI) / 180);
      if (isFlipped) ctx.scale(-1, 1);
      ctx.scale(zoom, zoom);

      // Draw image centered
      const aspect = img.width / img.height;
      let drawW = size;
      let drawH = size;
      if (aspect > 1) {
        drawW = size * aspect;
      } else {
        drawH = size / aspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    };
  }, [
    selectedImage,
    zoom,
    pan,
    brightness,
    contrast,
    saturation,
    rotation,
    isFlipped,
    activeFilter,
    isOpen,
    isCameraActive,
  ]);

  // Handle Drag / Pan inside preview
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Save final image
  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setSaving(true);
    try {
      // Create high-res 400x400 circular cropped output
      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = 400;
      outputCanvas.height = 400;
      const oCtx = outputCanvas.getContext("2d");
      if (oCtx) {
        // Draw the current canvas scaled
        oCtx.drawImage(canvas, 0, 0, 400, 400);
      }
      const dataUrl = outputCanvas.toDataURL("image/jpeg", 0.92);

      // Call photo edit API
      const savedKey = typeof window !== "undefined" ? localStorage.getItem("agrikin_openai_api_key") : null;
      const res = await fetch("/api/photo/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: dataUrl,
          operations: {
            brightness,
            contrast,
            saturation,
            rotation,
            filter: activeFilter,
            aiEnhance: aiEnhanceActive,
          },
          customApiKey: savedKey || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save image via API");
      }

      const result = await res.json();
      onPhotoSaved(result.imageUrl || dataUrl);
      onClose();
    } catch (err: any) {
      console.warn("API save error, using direct canvas render:", err);
      const fallbackUrl = canvas.toDataURL("image/jpeg", 0.92);
      onPhotoSaved(fallbackUrl);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#082933] rounded-3xl shadow-2xl border border-cyan-500/30 flex flex-col max-h-[92vh] overflow-hidden text-stone-900 dark:text-stone-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#083344] via-[#0E4A5C] to-[#042129] px-6 py-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-700/60 border border-cyan-400/40">
              <ImageIcon className="w-4 h-4 text-cyan-200" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">Farmer Profile Photo Studio</h3>
                <span className="bg-cyan-500/30 text-cyan-200 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-cyan-400/40">
                  Live Editor API
                </span>
              </div>
              <p className="text-[11px] text-cyan-200/90">
                Upload, crop, filter, and AI-enhance your dashboard & Krishi Connect profile picture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Top Action Bar: Upload or Camera */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 dark:bg-cyan-900/40 p-3 rounded-2xl border border-stone-200 dark:border-cyan-800">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-600 hover:to-teal-600 text-white font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
              </button>

              {!isCameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-cyan-800 border border-stone-200 dark:border-cyan-700 hover:bg-stone-100 text-stone-700 dark:text-stone-200 font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Use Camera</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3.5 py-2 rounded-xl bg-red-600 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel Camera</span>
                </button>
              )}
            </div>

            {/* AI Auto-Enhance Button */}
            <button
              type="button"
              onClick={handleAiAutoEnhance}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                aiEnhanceActive
                  ? "bg-amber-500 text-[#083344] ring-2 ring-amber-300"
                  : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-[#083344]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Auto-Enhance</span>
              {aiScore && <span className="bg-cyan-950/20 px-1.5 py-0.5 rounded text-[10px]">{aiScore}%</span>}
            </button>
          </div>

          {/* Main Visual Editor Workspace */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Left: Viewport Preview */}
            <div className="flex flex-col items-center justify-center p-4 bg-stone-100 dark:bg-cyan-900/30 rounded-3xl border border-stone-200 dark:border-cyan-800/80 relative">
              {isCameraActive ? (
                <div className="w-72 h-72 rounded-full overflow-hidden relative border-4 border-cyan-500 shadow-xl bg-black">
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                  <div className="absolute inset-0 flex items-end justify-center pb-4 bg-gradient-to-t from-black/60 to-transparent">
                    <button
                      type="button"
                      onClick={captureCameraPhoto}
                      className="px-4 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg flex items-center gap-1.5 text-xs animate-pulse"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  {/* Round Avatar Cutout Window */}
                  <div
                    className="w-72 h-72 rounded-full overflow-hidden border-4 border-cyan-600 dark:border-cyan-500 shadow-2xl bg-stone-900 flex items-center justify-center cursor-grab active:cursor-grabbing relative"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    title="Click and drag to reposition photo"
                  >
                    <canvas ref={canvasRef} className="w-full h-full object-cover pointer-events-none" />

                    {/* Circular Grid overlay hint */}
                    <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
                  </div>

                  {/* Drag reposition hint */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-[#082933] text-white text-[10px] font-semibold flex items-center gap-1 border border-cyan-600/40 shadow-sm pointer-events-none">
                    <Move className="w-3 h-3 text-cyan-400" />
                    <span>Drag to reposition</span>
                  </div>
                </div>
              )}

              {/* Transform quick buttons */}
              <div className="flex items-center gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev - 90) % 360)}
                  className="p-2 rounded-xl bg-white dark:bg-cyan-800 border border-stone-200 dark:border-cyan-700 hover:bg-stone-50 text-stone-700 dark:text-stone-200 transition-all shadow-xs"
                  title="Rotate Left 90°"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="p-2 rounded-xl bg-white dark:bg-cyan-800 border border-stone-200 dark:border-cyan-700 hover:bg-stone-50 text-stone-700 dark:text-stone-200 transition-all shadow-xs"
                  title="Rotate Right 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsFlipped((prev) => !prev)}
                  className={`p-2 rounded-xl border transition-all shadow-xs ${
                    isFlipped
                      ? "bg-cyan-700 text-white border-cyan-600"
                      : "bg-white dark:bg-cyan-800 border-stone-200 dark:border-cyan-700 text-stone-700 dark:text-stone-200"
                  }`}
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={resetAdjustments}
                  className="p-2 rounded-xl bg-white dark:bg-cyan-800 border border-stone-200 dark:border-cyan-700 hover:bg-stone-50 text-stone-700 dark:text-stone-200 transition-all shadow-xs"
                  title="Reset All Adjustments"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Controls Tab Panel */}
            <div className="space-y-4">
              {/* Tab Navigation */}
              <div className="flex border-b border-stone-200 dark:border-cyan-800 pb-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("adjust")}
                  className={`pb-1 px-3 font-bold transition-colors ${
                    activeTab === "adjust"
                      ? "text-cyan-700 dark:text-cyan-400 border-b-2 border-cyan-600"
                      : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                  }`}
                >
                  Sliders & Zoom
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("filters")}
                  className={`pb-1 px-3 font-bold transition-colors ${
                    activeTab === "filters"
                      ? "text-cyan-700 dark:text-cyan-400 border-b-2 border-cyan-600"
                      : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                  }`}
                >
                  Filter Presets
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("samples")}
                  className={`pb-1 px-3 font-bold transition-colors ${
                    activeTab === "samples"
                      ? "text-cyan-700 dark:text-cyan-400 border-b-2 border-cyan-600"
                      : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                  }`}
                >
                  Sample Avatars
                </button>
              </div>

              {/* Tab 1: Sliders */}
              {activeTab === "adjust" && (
                <div className="space-y-3.5 pt-1">
                  {/* Zoom Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                      <span className="flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5 text-cyan-600" /> Zoom Scale
                      </span>
                      <span>{Math.round(zoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="2.5"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-cyan-600 cursor-pointer"
                    />
                  </div>

                  {/* Brightness Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                      <span className="flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-500" /> Brightness
                      </span>
                      <span>{brightness > 0 ? `+${brightness}` : brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full accent-cyan-600 cursor-pointer"
                    />
                  </div>

                  {/* Contrast Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                      <span className="flex items-center gap-1">
                        <Contrast className="w-3.5 h-3.5 text-teal-600" /> Contrast
                      </span>
                      <span>{contrast > 0 ? `+${contrast}` : contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full accent-cyan-600 cursor-pointer"
                    />
                  </div>

                  {/* Saturation Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                      <span className="flex items-center gap-1">
                        <Palette className="w-3.5 h-3.5 text-pink-500" /> Color Saturation
                      </span>
                      <span>{saturation > 0 ? `+${saturation}` : saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={saturation}
                      onChange={(e) => setSaturation(parseInt(e.target.value))}
                      className="w-full accent-cyan-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Filter Presets */}
              {activeTab === "filters" && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { id: "none", name: "Natural (Original)", desc: "True field colors" },
                    { id: "golden_sunrise", name: "Golden Sunrise", desc: "Warm morning glow" },
                    { id: "vibrant_harvest", name: "Vibrant Harvest", desc: "Enhanced richness" },
                    { id: "clean_portrait", name: "Studio Portrait", desc: "Balanced skin tone" },
                    { id: "monochrome", name: "B&W Classic", desc: "Artistic grayscale" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFilter(f.id as FilterPreset)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        activeFilter === f.id
                          ? "border-cyan-600 bg-cyan-50 dark:bg-cyan-900/60 font-bold"
                          : "border-stone-200 dark:border-cyan-800/80 hover:bg-stone-50 dark:hover:bg-cyan-900/30"
                      }`}
                    >
                      <div className="text-xs text-stone-900 dark:text-stone-100">{f.name}</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">{f.desc}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Tab 3: Sample Avatars */}
              {activeTab === "samples" && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {sampleAvatars.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedImage(s.url);
                        resetAdjustments();
                      }}
                      className="p-2 rounded-xl border border-stone-200 dark:border-cyan-800 hover:border-cyan-500 flex items-center gap-2 bg-stone-50 dark:bg-cyan-900/40 text-left transition-all"
                    >
                      <img src={s.url} alt={s.name} className="w-9 h-9 rounded-full object-cover border" />
                      <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200 leading-tight">
                        {s.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* AI Verification Notice */}
              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 text-[10px] text-cyan-950 dark:text-cyan-200 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-cyan-600" />
                  <span>Instant Cross-Platform Sync</span>
                </div>
                <p className="text-cyan-700 dark:text-cyan-300">
                  Saving will immediately update your photo across your Farm Operations Dashboard, Krishi Connect listings, and top navigation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-stone-50 dark:bg-[#082933] border-t border-stone-200 dark:border-cyan-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-cyan-800 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-600 hover:to-teal-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-md disabled:opacity-50 transition-all"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing with API...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Apply & Save Profile Photo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
