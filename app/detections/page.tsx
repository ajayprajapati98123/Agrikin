"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/i18n/i18n-context";
import { DetectionResult } from "../../lib/types";
import {
  UploadCloud,
  Camera,
  AlertTriangle,
  Sparkles,
  Cpu,
  Trash2,
  RefreshCw,
  ScanEye,
  Key,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function DetectionsPage() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<"crop" | "produce" | "soil">("crop");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [providerUsed, setProviderUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // API Key controls
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleDemoImages: Record<"crop" | "produce" | "soil", string[]> = {
    crop: [
      "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop&q=80",
    ],
    produce: [
      "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&auto=format&fit=crop&q=80",
    ],
    soil: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80",
    ],
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const maxDim = 800;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } else {
          resolve(img.src);
        }
      };

      img.onerror = reject;
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    if (selectedImages.length + files.length > 10) {
      setError("Maximum 10 images allowed per diagnostic session.");
      return;
    }

    for (const file of files) {
      try {
        const compressed = await compressImage(file);
        setSelectedImages((prev) => [...prev, compressed].slice(0, 10));
      } catch (err) {
        console.warn("Failed to compress image, using raw data:", err);
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setSelectedImages((prev) => [...prev, reader.result as string].slice(0, 10));
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const loadSampleImages = () => {
    setSelectedImages(sampleDemoImages[activeCategory]);
    setResult(null);
    setError(null);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setSelectedImages([]);
    setResult(null);
    setError(null);
  };

  const runAnalysis = async () => {
    if (!selectedImages || selectedImages.length === 0) {
      setError("Please upload at least one crop image.");
      return;
    }

    setAnalyzing(true);
    setError("");
    setResult(null);
    setProviderUsed("");

    try {
      const response = await fetch("/api/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: activeCategory,
          imageUrls: selectedImages.slice(0, 5),
          customApiKey: customApiKey.trim() || undefined,
        }),
      });

      let data: any;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid response. Please try again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Crop analysis failed. Server status: ${response.status}`
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.error || "AI could not analyze this image."
        );
      }

      if (!data?.result) {
        throw new Error(
          "AI analysis completed, but no result was returned."
        );
      }

      setResult(data.result);
      setProviderUsed(
        data.provider || "Grok AI Vision (Realtime)"
      );

    } catch (error: unknown) {
      console.error("Detection error:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Unable to analyze the crop image. Please try again."
        );
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-950 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700 text-xs font-semibold mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>Grok AI & Multi-Spectral Agricultural Vision Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            AI Agricultural Detection
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl mt-1">
            Detect leaf pathologies, grade harvested produce quality, and observe surface soil condition using Grok AI models calibrated with authentic Indian agronomic science.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className="px-3.5 py-3 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-950/40 hover:bg-cyan-50 text-stone-700 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 border border-[#EAE3D5] dark:border-cyan-800 transition-all"
            title="AI Model Settings"
          >
            <Key className="w-3.5 h-3.5 text-cyan-700" />
            <span className="hidden sm:inline">AI Key Settings</span>
          </button>

          <Link
            href="/detections/live"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>Launch Live Camera Scan</span>
          </Link>
        </div>
      </div>

      {/* AI Vision Connection Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#083344] via-[#0E5266] to-[#042129] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-cyan-500/40 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-cyan-700/60 border border-cyan-400/40">
            <Cpu className="w-4 h-4 text-cyan-200" />
          </span>
          <div>
            <div className="font-bold flex items-center gap-2">
              <span>Connected AI Engine: Grok AI Vision (Qwen 3.8-27B Multimodal)</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200 text-[10px] font-bold border border-cyan-400/40">
                Active & Realtime
              </span>
            </div>
            <p className="text-[11px] text-cyan-200/80">
              Field photos are visually diagnosed in real time using Grok LPU inference calibrated with ICAR agricultural pathology protocols.
            </p>
          </div>
        </div>

        {showKeyConfig && (
          <div className="w-full sm:w-80 mt-2 sm:mt-0 flex gap-1.5">
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="Enter optional Grok/OpenAI key"
              className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-cyan-400/40 text-white text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400"
            />
            <button
              onClick={() => {
                alert("API key saved for this diagnostic session!");
                setShowKeyConfig(false);
              }}
              className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-cyan-950 font-bold rounded-xl text-xs"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Three Categories Selector */}
      <div className="grid grid-cols-3 gap-3 p-1.5 rounded-2xl bg-[#FAF7F0] dark:bg-cyan-950 border border-[#EAE3D5] dark:border-cyan-800 text-xs font-bold">
        {[
          { id: "crop", icon: "🌱", label: "Crop Disease Detection" },
          { id: "produce", icon: "🥕", label: "Produce Quality Grading" },
          { id: "soil", icon: "🧪", label: "Soil Health Assessment" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id as any);
              setResult(null);
            }}
            className={`py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeCategory === cat.id
                ? "bg-[#FFFEFD] dark:bg-cyan-700 text-cyan-950 dark:text-white shadow-xs font-extrabold"
                : "text-stone-600 dark:text-stone-300 hover:text-stone-900"
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            <span className="hidden sm:inline">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Upload & Photo Tray (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFEFD] dark:bg-[#083344] p-6 sm:p-8 rounded-3xl border border-[#EAE3D5] dark:border-cyan-800/60 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                Photo Upload ({selectedImages.length}/10 images)
              </h3>
              <p className="text-xs text-stone-500">
                Upload up to 10 clear photos (JPG, PNG, WEBP).
              </p>
            </div>
            <button
              onClick={loadSampleImages}
              className="text-xs text-cyan-700 dark:text-cyan-400 hover:underline font-semibold"
            >
              Load Sample Images
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-cyan-300 dark:border-cyan-700 rounded-3xl p-8 text-center cursor-pointer hover:bg-cyan-50/40 dark:hover:bg-cyan-900/20 transition-all space-y-3"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFiles}
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <div className="w-14 h-14 mx-auto rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-800 dark:text-cyan-200">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-sm text-stone-800 dark:text-stone-200">
                Click to browse or drop field photos here
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                Maximum 10 images • Connected to Grok AI Vision for real-time agricultural diagnostics
              </p>
            </div>
          </div>

          {/* Thumbnails Tray */}
          {selectedImages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 dark:text-stone-300">Selected Samples</span>
                <button
                  onClick={clearAll}
                  className="text-stone-400 hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {selectedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden aspect-square border border-[#EAE3D5] dark:border-cyan-800 shadow-xs"
                  >
                    <img src={img} alt={`Sample ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center opacity-90 group-hover:opacity-100 shadow"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <button
            onClick={runAnalysis}
            disabled={analyzing || selectedImages.length === 0}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Specimen with Grok AI Vision...</span>
              </>
            ) : (
              <>
                <ScanEye className="w-4 h-4" />
                <span>Analyze Specimen with AI Vision ({selectedImages.length})</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Structured Diagnostic Report (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="bg-[#FFFEFD] dark:bg-[#083344] p-6 sm:p-8 rounded-3xl border border-cyan-400/50 shadow-xl space-y-5 animate-fadeIn">
              {/* Header Badge & Title */}
              <div className="space-y-2 pb-4 border-b border-[#EAE3D5] dark:border-cyan-800">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {result.cropName && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-800 to-teal-800 text-white shadow-xs">
                        🌾 {result.cropName}
                      </span>
                    )}
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-950 border border-cyan-200">
                      Confidence: {result.confidence}%
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      result.severity === "Severe"
                        ? "bg-red-100 text-red-800"
                        : result.severity === "Moderate"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-cyan-100 text-cyan-900"
                    }`}
                  >
                    Severity: {result.severity}
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 pt-1">
                  {result.detectionName}
                </h2>

                {result.diagnosis && result.diagnosis !== result.detectionName && (
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-[#FAF7F0] dark:bg-cyan-950/20 p-2.5 rounded-xl border border-[#EAE3D5] dark:border-cyan-900/40">
                    {result.diagnosis}
                  </p>
                )}

                {/* Pathogen / Pest Chips */}
                {(result.possibleDisease || result.possiblePest || result.possibleDeficiency) && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.possibleDisease?.map((d, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[10px] font-semibold border border-purple-200 dark:border-purple-800">
                        🦠 {d}
                      </span>
                    ))}
                    {result.possiblePest?.map((p, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-[10px] font-semibold border border-amber-200 dark:border-amber-800">
                        🐛 {p}
                      </span>
                    ))}
                    {result.possibleDeficiency?.map((df, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-200 dark:border-blue-800">
                        ⚡ {df}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                  <span>Analyzed at {new Date(result.analyzedAt).toLocaleTimeString()} • {result.category.toUpperCase()}</span>
                  {providerUsed && (
                    <span className="font-bold text-cyan-700 dark:text-cyan-400">
                      ⚡ {providerUsed}
                    </span>
                  )}
                </div>
              </div>

              {/* Observed Symptoms */}
              <div className="space-y-1.5 text-xs">
                <h4 className="font-bold text-stone-800 dark:text-stone-200">🔍 Observed Symptoms</h4>
                <ul className="space-y-1 text-stone-600 dark:text-stone-300 list-disc list-inside">
                  {result.observedSymptoms.map((s, idx) => (
                    <li key={idx} className="leading-relaxed">{s}</li>
                  ))}
                </ul>
              </div>

              {/* Possible Causes */}
              <div className="space-y-1.5 text-xs">
                <h4 className="font-bold text-stone-800 dark:text-stone-200">⚠️ Probable Etiology</h4>
                <ul className="space-y-1 text-stone-600 dark:text-stone-300 list-disc list-inside">
                  {result.possibleCauses.map((c, idx) => (
                    <li key={idx} className="leading-relaxed">{c}</li>
                  ))}
                </ul>
              </div>

              {/* Recommended Actions */}
              <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 space-y-1.5 text-xs">
                <h4 className="font-bold text-cyan-950 dark:text-cyan-200">✅ Recommended Actions & Indian Remedies</h4>
                <ul className="space-y-1 text-cyan-900 dark:text-cyan-100 list-disc list-inside">
                  {result.recommendedActions.map((a, idx) => (
                    <li key={idx} className="leading-relaxed">{a}</li>
                  ))}
                </ul>
              </div>

              {/* Preventive Measures */}
              <div className="space-y-1.5 text-xs">
                <h4 className="font-bold text-stone-800 dark:text-stone-200">🛡️ Preventive Measures</h4>
                <ul className="space-y-1 text-stone-600 dark:text-stone-300 list-disc list-inside">
                  {result.preventiveMeasures.map((p, idx) => (
                    <li key={idx} className="leading-relaxed">{p}</li>
                  ))}
                </ul>
              </div>

              {/* Expert & Lab Notice */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                <strong>Agronomist Consultation:</strong>
                <p>{result.expertConsultation}</p>
              </div>

              {/* Scientific & Soil Disclaimer */}
              <div className="text-[10px] text-stone-500 leading-relaxed italic border-t border-[#EAE3D5] dark:border-cyan-900 pt-3">
                {result.scientificDisclaimer}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-3xl bg-[#FAF7F0] dark:bg-cyan-950/40 border-2 border-dashed border-[#EAE3D5] dark:border-cyan-800 flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-3">
              <ScanEye className="w-12 h-12 text-cyan-500/50 dark:text-cyan-600" />
              <div className="font-bold text-sm text-stone-600 dark:text-stone-300">
                Awaiting Image Upload
              </div>
              <p className="text-xs max-w-xs text-stone-400">
                Select or upload photos on the left and click "Analyze Specimen with AI Vision" to generate a scientifically accurate diagnosis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}