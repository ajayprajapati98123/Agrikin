"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { DetectionResult } from "../../lib/types";
import { useLanguage } from "../../lib/i18n/i18n-context";
import {
  ScanEye,
  Camera,
  UploadCloud,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Key,
  Cpu,
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

  // OpenAI Key controls
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleDemoImages: Record<"crop" | "produce" | "soil", string[]> = {
    crop: [
      "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=600&auto=format&fit=crop&q=80",
    ],
    produce: [
      "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&auto=format&fit=crop&q=80",
    ],
    soil: [
      "https://images.unsplash.com/photo-1584473457406-6240486418e9?w=600&auto=format&fit=crop&q=80",
    ],
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    if (selectedImages.length + files.length > 10) {
      setError("Maximum 10 images allowed per diagnostic session.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setSelectedImages((prev) => [...prev, reader.result as string].slice(0, 10));
        }
      };
      reader.readAsDataURL(file);
    });
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
    if (selectedImages.length === 0) {
      setError("Please upload or attach at least 1 image to analyze.");
      return;
    }
    setError(null);
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: activeCategory,
          imageUrls: selectedImages,
          customApiKey: customApiKey.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Diagnostic request failed");
      }

      const data = await res.json();
      setResult(data.result);
      setProviderUsed(data.provider || "OpenAI GPT-4o Vision");
    } catch (err: any) {
      setError(err.message || "Diagnostic failed. Please retry.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>OpenAI Vision & Multi-Spectral Computer Vision Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            AI Agricultural Detection
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl mt-1">
            Detect leaf pathologies, grade harvested produce quality, and observe surface soil condition using OpenAI Vision models calibrated with authentic Indian agronomic data.
          </p>
        </div>

        {/* Live Camera Scanner Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className="px-3.5 py-3 rounded-2xl bg-stone-100 dark:bg-emerald-900/40 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 border border-stone-200 dark:border-emerald-800 transition-all"
            title="OpenAI Vision Settings"
          >
            <Key className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">OpenAI Settings</span>
          </button>

          <Link
            href="/detections/live"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>Launch Live Camera Scan</span>
          </Link>
        </div>
      </div>

      {/* OpenAI Vision Connection Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-emerald-500/30 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-emerald-700/60 border border-emerald-400/40">
            <Cpu className="w-4 h-4 text-emerald-200" />
          </span>
          <div>
            <div className="font-bold flex items-center gap-2">
              <span>Connected AI Architecture: OpenAI GPT-4o Vision</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-bold border border-emerald-400/40">
                Active
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80">
              Photographs are sent to OpenAI Vision with scientific verification prompts tailored for Indian agriculture.
            </p>
          </div>
        </div>

        {showKeyConfig && (
          <div className="w-full sm:w-80 mt-2 sm:mt-0 flex gap-1.5">
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="Enter optional OpenAI key (sk-...)"
              className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-emerald-400/40 text-white text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400"
            />
            <button
              onClick={() => {
                alert("OpenAI key saved for this diagnostic session!");
                setShowKeyConfig(false);
              }}
              className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-bold rounded-xl text-xs"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Three Categories Selector */}
      <div className="grid grid-cols-3 gap-3 p-1.5 rounded-2xl bg-stone-100 dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800 text-xs font-bold">
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
                ? "bg-white dark:bg-emerald-800 text-emerald-950 dark:text-white shadow-sm font-extrabold"
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
        <div className="lg:col-span-7 bg-white dark:bg-emerald-950 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-emerald-800 shadow-sm space-y-6">
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
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
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
            className="border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-3xl p-8 text-center cursor-pointer hover:bg-emerald-50/40 dark:hover:bg-emerald-900/20 transition-all space-y-3"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFiles}
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-800 dark:text-emerald-200">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-sm text-stone-800 dark:text-stone-200">
                Click to browse or drop field photos here
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                Maximum 10 images • Connected to OpenAI Vision for accurate diagnostics
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
                    className="relative group rounded-xl overflow-hidden aspect-square border border-stone-200 dark:border-emerald-800 shadow-xs"
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
            className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running OpenAI Vision Diagnostics...</span>
              </>
            ) : (
              <>
                <ScanEye className="w-4 h-4" />
                <span>Analyze with OpenAI Vision ({selectedImages.length})</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Structured Diagnostic Report (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="bg-white dark:bg-emerald-950 p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-xl space-y-5 animate-fadeIn">
              {/* Header Badge & Title */}
              <div className="space-y-1.5 pb-4 border-b border-stone-200 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                    Confidence: {result.confidence}%
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      result.severity === "Severe"
                        ? "bg-red-100 text-red-800"
                        : result.severity === "Moderate"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    Severity: {result.severity}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 pt-1">
                  {result.detectionName}
                </h2>
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>Analyzed at {new Date(result.analyzedAt).toLocaleTimeString()} • {result.category.toUpperCase()}</span>
                  {providerUsed && (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
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
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 space-y-1.5 text-xs">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200">✅ Recommended Actions & Indian Remedies</h4>
                <ul className="space-y-1 text-emerald-800 dark:text-emerald-100 list-disc list-inside">
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
              <div className="text-[10px] text-stone-500 leading-relaxed italic border-t border-stone-100 dark:border-emerald-900 pt-3">
                {result.scientificDisclaimer}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-3xl bg-stone-50 dark:bg-emerald-950/40 border-2 border-dashed border-stone-200 dark:border-emerald-800 flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-3">
              <ScanEye className="w-12 h-12 text-stone-300 dark:text-emerald-700" />
              <div className="font-bold text-sm text-stone-600 dark:text-stone-300">
                Awaiting Image Upload
              </div>
              <p className="text-xs max-w-xs text-stone-400">
                Select or upload photos on the left and click "Analyze with OpenAI Vision" to generate a scientifically accurate diagnosis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}