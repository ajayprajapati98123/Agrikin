"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Square,
  X,
  Sparkles,
  ChevronRight,
  Droplets,
  HelpCircle,
  Radio,
  Settings2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export type SwaahLanguage = "hi" | "en";

interface SwaahProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialMethod?: string;
  initialLanguage?: SwaahLanguage;
}

const LANGUAGE_CONFIG: Record<
  SwaahLanguage,
  {
    name: string;
    nativeName: string;
    speechLang: string;
    greeting: string;
    placeholder: string;
    speakBtnText: string;
    listeningText: string;
    thinkingText: string;
    methods: { id: string; title: string; icon: string }[];
    aspects: { id: string; label: string; icon: string }[];
  }
> = {
  hi: {
    name: "Hindi",
    nativeName: "हिंदी (Hindi)",
    speechLang: "hi-IN",
    greeting:
      "नमस्ते किसान साथी! मैं स्वाहा हूँ। आपको कौन सी खेती या सिंचाई विधि के बारे में जानना है? नीचे दिए किसी भी बटन को दबाएं या बोलकर पूछें।",
    placeholder: "उदाहरण: ड्रिप सिंचाई कैसे लगाएं?",
    speakBtnText: "बोलकर पूछें (Tap & Speak)",
    listeningText: "मैं सुन रही हूँ, बोलिए...",
    thinkingText: "स्वाहा जवाब तैयार कर रही है...",
    methods: [
      { id: "drip-irrigation", title: "ड्रिप (टपक) सिंचाई", icon: "💧" },
      { id: "sprinkler-irrigation", title: "स्प्रिंकलर (फव्वारा) सिंचाई", icon: "🌦️" },
      { id: "surface-irrigation", title: "सतही (बहाव) सिंचाई", icon: "🌊" },
      { id: "subsurface-irrigation", title: "उप-सतह ड्रिप सिंचाई", icon: "🌱" },
    ],
    aspects: [
      { id: "all", label: "पूरी जानकारी", icon: "🔊" },
      { id: "howToDoIt", label: "कैसे लगाएं?", icon: "🛠️" },
      { id: "howToApplyIt", label: "उपयुक्त फसल व मिट्टी", icon: "🌱" },
      { id: "howToRunIt", label: "रोजाना कैसे चलाएं?", icon: "⚙️" },
      { id: "maintenance", label: "रखरखाव व सफाई", icon: "🔧" },
      { id: "costs", label: "खर्च व सब्सिडी", icon: "💰" },
    ],
  },
  en: {
    name: "English",
    nativeName: "English",
    speechLang: "en-IN",
    greeting:
      "Namaste farmer friend! I am Swaah, your voice guide for farming methods. Which method would you like me to explain? Tap any button below or speak.",
    placeholder: "Example: How to setup drip irrigation?",
    speakBtnText: "Tap to Speak (Voice Input)",
    listeningText: "Listening, please speak...",
    thinkingText: "Swaah is thinking...",
    methods: [
      { id: "drip-irrigation", title: "Drip Irrigation", icon: "💧" },
      { id: "sprinkler-irrigation", title: "Sprinkler Irrigation", icon: "🌦️" },
      { id: "surface-irrigation", title: "Surface Flood Irrigation", icon: "🌊" },
      { id: "subsurface-irrigation", title: "Subsurface Drip (SDI)", icon: "🌱" },
    ],
    aspects: [
      { id: "all", label: "Full Guide", icon: "🔊" },
      { id: "howToDoIt", label: "How to Do It", icon: "🛠️" },
      { id: "howToApplyIt", label: "Crops & Soil", icon: "🌱" },
      { id: "howToRunIt", label: "Daily Operation", icon: "⚙️" },
      { id: "maintenance", label: "Maintenance", icon: "🔧" },
      { id: "costs", label: "Costs & Subsidies", icon: "💰" },
    ],
  },
};

export const SwaahVoiceAssistant: React.FC<SwaahProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  initialMethod,
  initialLanguage = "hi",
}) => {
  // Modal state
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const handleClose = () => {
    stopSpeech();
    if (externalOnClose) externalOnClose();
    else setInternalIsOpen(false);
  };

  const handleOpen = () => {
    setInternalIsOpen(true);
  };

  // Language state (Only Hindi & English)
  const [currentLang, setCurrentLang] = useState<SwaahLanguage>(initialLanguage);
  const langConfig = LANGUAGE_CONFIG[currentLang] || LANGUAGE_CONFIG.hi;

  // Active query / method
  const [activeMethod, setActiveMethod] = useState<string>(initialMethod || "drip-irrigation");
  const [activeAspect, setActiveAspect] = useState<string>("all");
  const [spokenText, setSpokenText] = useState<string>("");
  const [methodTitle, setMethodTitle] = useState<string>("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Audio / Speech Synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.92);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Speech Recognition (STT) state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // Sync initial method when prop changes
  useEffect(() => {
    if (initialMethod) {
      setActiveMethod(initialMethod);
      fetchAndExplain(initialMethod, currentLang, "all");
    }
  }, [initialMethod]);

  // Handle external open trigger
  useEffect(() => {
    if (externalIsOpen) {
      if (!spokenText) {
        fetchAndExplain(activeMethod, currentLang, activeAspect);
      }
    } else {
      stopSpeech();
    }
  }, [externalIsOpen]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  // Fetch explanation from API and start speaking
  const fetchAndExplain = async (methodQuery: string, lang: SwaahLanguage, aspect: string = "all") => {
    setLoading(true);
    setErrorMsg(null);
    stopSpeech();

    try {
      const res = await fetch(
        `/api/swaah?query=${encodeURIComponent(methodQuery)}&lang=${lang}&aspect=${aspect}`
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();

      if (data.success) {
        setMethodTitle(data.methodTitle || methodQuery);
        setSpokenText(data.spokenText || "");
        setHighlights(data.highlights || []);
        speakOutLoud(data.spokenText, lang);
      } else {
        throw new Error(data.error || "Failed to load voice guidance.");
      }
    } catch (err: any) {
      console.error("Swaah fetch error:", err);
      setErrorMsg(
        currentLang === "hi"
          ? "आवाज कनेक्ट होने में कुछ रुकावट आई, कृपया दोबारा दबाएं।"
          : "Voice connection delayed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Text-to-Speech Engine
  const speakOutLoud = (textToSpeak: string, lang: SwaahLanguage) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    if (!textToSpeak.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    const targetSpeechLang = LANGUAGE_CONFIG[lang]?.speechLang || "hi-IN";
    utterance.lang = targetSpeechLang;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) =>
        v.lang === targetSpeechLang ||
        v.lang.startsWith(targetSpeechLang.split("-")[0]) ||
        v.name.toLowerCase().includes(langConfig.name.toLowerCase())
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      if (e.error !== "canceled" && e.error !== "interrupted") {
        console.warn("SpeechSynthesis error:", e);
      }
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (isSpeaking && !isPaused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  const resumeSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else if (spokenText) {
        speakOutLoud(spokenText, currentLang);
      }
    }
  };

  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const replaySpeech = () => {
    stopSpeech();
    if (spokenText) {
      speakOutLoud(spokenText, currentLang);
    }
  };

  // Speech-to-Text (STT) Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    stopSpeech();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg(
        currentLang === "hi"
          ? "इस ब्राउज़र में माइक सपोर्ट उपलब्ध नहीं है। कृपया नीचे दिए किसी बटन को दबाएं।"
          : "Voice recognition is not supported in this browser. Please tap a method button below."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = langConfig.speechLang;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join("");
        setTranscript(currentTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          setActiveMethod(transcript.trim());
          fetchAndExplain(transcript.trim(), currentLang, activeAspect);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setErrorMsg(
            currentLang === "hi"
              ? "माइक्रोफोन की अनुमति नहीं मिली। कृपया नीचे दिए बटन को दबाएं।"
              : "Microphone permission denied. Tap a method button below."
          );
        }
      };

      recognition.start();
    } catch (err) {
      console.warn("Failed to start voice recognition:", err);
      setIsListening(false);
    }
  };

  const handleSelectLanguage = (newLang: SwaahLanguage) => {
    setCurrentLang(newLang);
    stopSpeech();
    fetchAndExplain(activeMethod, newLang, activeAspect);
  };

  const handleSelectMethod = (methodId: string) => {
    setActiveMethod(methodId);
    setActiveAspect("all");
    fetchAndExplain(methodId, currentLang, "all");
  };

  const handleSelectAspect = (aspectId: string) => {
    setActiveAspect(aspectId);
    fetchAndExplain(activeMethod, currentLang, aspectId);
  };

  return (
    <>
      {/* SMALL, COMPACT Floating Launcher Icon - placed neatly at the bottom right */}
      {!isOpen && (
        <aside aria-label="Swaah Voice Assistant Trigger" className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => {
              handleOpen();
              if (!spokenText) {
                fetchAndExplain(activeMethod, currentLang, "all");
              } else {
                replaySpeech();
              }
            }}
            className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#083344] to-[#0E5266] hover:from-[#0E5266] hover:to-[#083344] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all border border-cyan-400/50 cursor-pointer"
            title="स्वाहा आवाज सहायक (Swaah Voice Guide)"
          >
            <span className="w-6 h-6 rounded-full bg-cyan-400 text-cyan-950 flex items-center justify-center font-bold text-xs shadow-xs">
              🎙️
            </span>
            <span className="text-xs font-bold text-cyan-100 pr-1">
              स्वाहा (Swaah)
            </span>
          </button>
        </aside>
      )}

      {/* Swaah Voice Assistant Pop-Up Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#FFFEFD] rounded-3xl shadow-2xl border-2 border-cyan-500/40 flex flex-col overflow-hidden max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#083344] via-[#0E5266] to-[#042129] px-5 py-4 text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                {/* Swaah Animated Avatar */}
                <div className="relative">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 p-0.5 shadow-md ${
                      isSpeaking ? "animate-pulse ring-4 ring-cyan-400/50" : ""
                    }`}
                  >
                    <div className="w-full h-full bg-[#083344] rounded-[13px] flex items-center justify-center text-xl">
                      🌾
                    </div>
                  </div>
                  {isSpeaking && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 text-[8px] text-white font-bold items-center justify-center">
                        🔊
                      </span>
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-cyan-200">
                      स्वाहा (Swaah) • आवाज सहायक
                    </h3>
                    <span className="bg-cyan-400/20 text-cyan-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-300/30">
                      Voice Guide
                    </span>
                  </div>
                  <p className="text-xs text-cyan-100/80 font-medium">
                    {currentLang === "hi"
                      ? "खेती और सिंचाई को बोलकर समझाने वाली साथी"
                      : "Voice guide for modern farming and irrigation"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Slower speech toggle */}
                <button
                  onClick={() => setSpeechRate((prev) => (prev === 0.92 ? 0.78 : 0.92))}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                    speechRate < 0.9
                      ? "bg-cyan-400 text-cyan-950 border-cyan-300"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }`}
                  title="Toggle slower voice speed"
                >
                  {speechRate < 0.9 ? "🐢 धीमी आवाज" : "⚡ सामान्य गति"}
                </button>

                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close Swaah"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Language Selector: Only Hindi and English */}
            <div className="bg-[#FAF7F0] px-4 py-2 border-b border-[#EAE3D5] flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-stone-700">
                🗣️ भाषा चुनें (Select Language):
              </span>
              <div className="flex items-center gap-1.5">
                {(["hi", "en"] as SwaahLanguage[]).map((langKey) => (
                  <button
                    key={langKey}
                    onClick={() => handleSelectLanguage(langKey)}
                    className={`px-3 py-1 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      currentLang === langKey
                        ? "bg-gradient-to-r from-cyan-700 to-teal-700 text-white ring-2 ring-cyan-400 scale-105"
                        : "bg-[#FFFEFD] text-stone-700 hover:bg-stone-200 border border-[#EAE3D5]"
                    }`}
                  >
                    <span>{LANGUAGE_CONFIG[langKey].nativeName}</span>
                    {currentLang === langKey && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Audio Sound Wave Visualizer & Status */}
              <div className="rounded-2xl bg-gradient-to-br from-cyan-50 via-teal-50 to-[#FAF7F0] p-3.5 border border-cyan-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {/* Visual Soundwave Bars */}
                  <div className="flex items-center gap-1 h-7 px-1">
                    {[35, 70, 50, 85, 60, 75, 40].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isSpeaking
                            ? "bg-cyan-600 animate-pulse"
                            : isListening
                            ? "bg-red-500 animate-bounce"
                            : "bg-cyan-300"
                        }`}
                        style={{
                          height: isSpeaking ? `${h}%` : isListening ? `${100 - h}%` : "30%",
                          animationDelay: `${i * 120}ms`,
                        }}
                      />
                    ))}
                  </div>

                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-stone-900 flex items-center gap-1">
                      {isSpeaking ? (
                        <span className="text-cyan-700 flex items-center gap-1">
                          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                          <span>स्वाहा बोल रही है (Speaking)</span>
                        </span>
                      ) : isListening ? (
                        <span className="text-red-600 flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5 animate-spin" />
                          <span>{langConfig.listeningText}</span>
                        </span>
                      ) : loading ? (
                        <span className="text-cyan-700">
                          {langConfig.thinkingText}
                        </span>
                      ) : (
                        <span>{methodTitle || "तैयार (Ready)"}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      {isSpeaking
                        ? "आवाज ध्यान से सुनें"
                        : "किसी भी बटन को दबाएं, स्वाहा बोलकर सुनाएगी"}
                    </p>
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="flex items-center gap-1 shrink-0 bg-[#FFFEFD] p-1 rounded-xl border border-cyan-200 shadow-xs">
                  {isSpeaking && !isPaused ? (
                    <button
                      onClick={pauseSpeech}
                      className="p-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white transition-transform active:scale-95 cursor-pointer"
                      title="Pause"
                    >
                      <Pause className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={resumeSpeech}
                      className="p-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white transition-transform active:scale-95 cursor-pointer"
                      title="Play"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={replaySpeech}
                    className="p-2 rounded-lg bg-[#FAF7F0] hover:bg-stone-200 text-stone-700 transition-transform active:scale-95 cursor-pointer"
                    title="Replay"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={stopSpeech}
                    className="p-2 rounded-lg bg-[#FAF7F0] hover:bg-stone-200 text-stone-700 transition-transform active:scale-95 cursor-pointer"
                    title="Stop"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Big Mic Button: Speak in Hindi or English */}
              <div>
                <button
                  onClick={toggleListening}
                  className={`w-full py-3 px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md ${
                    isListening
                      ? "bg-red-600 hover:bg-red-700 text-white ring-4 ring-red-300 animate-pulse"
                      : "bg-gradient-to-r from-cyan-700 via-teal-700 to-cyan-800 hover:from-cyan-800 hover:to-teal-900 text-white"
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 animate-spin" />
                      <span>{langConfig.listeningText} (रोकने के लिए दबाएं)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>🎙️ {langConfig.speakBtnText}</span>
                    </>
                  )}
                </button>
                {transcript && (
                  <p className="mt-1.5 text-xs text-stone-600 text-center italic">
                    "{transcript}"
                  </p>
                )}
                {errorMsg && (
                  <p className="mt-1.5 text-xs text-red-600 font-semibold flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errorMsg}</span>
                  </p>
                )}
              </div>

              {/* 4 Core Methods: Large One-Tap Audio Cards */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-600 px-1">
                  <span>👇 विधि चुनें (सुनने के लिए दबाएं):</span>
                  <span className="text-[11px] text-cyan-700">4 मुख्य विधियां</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {langConfig.methods.map((m) => {
                    const isSelected = activeMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => handleSelectMethod(m.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-br from-[#083344] to-[#0E5266] text-white border-cyan-400 shadow-md ring-2 ring-cyan-400/50 scale-[1.01]"
                            : "bg-[#FAF7F0] text-stone-800 border-[#EAE3D5] hover:border-cyan-400 hover:bg-stone-100"
                        }`}
                      >
                        <span className="text-xl shrink-0 p-1 rounded-xl bg-white/10">{m.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-extrabold text-xs truncate">
                            {m.title}
                          </div>
                          <div className="text-[10px] text-cyan-300 font-semibold flex items-center gap-1 mt-0.5">
                            <Volume2 className="w-2.5 h-2.5 shrink-0" />
                            <span>सुनें 🔊</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Aspect Pills */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-stone-600 px-1">
                  🎯 क्या सुनना चाहते हैं? (Select Topic):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {langConfig.aspects.map((asp) => (
                    <button
                      key={asp.id}
                      onClick={() => handleSelectAspect(asp.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        activeAspect === asp.id
                          ? "bg-cyan-700 text-white ring-2 ring-cyan-400 shadow-xs"
                          : "bg-[#FAF7F0] text-stone-700 hover:bg-stone-200 border border-[#EAE3D5]"
                      }`}
                    >
                      <span>{asp.icon}</span>
                      <span>{asp.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spoken Text Box */}
              <div className="rounded-2xl bg-[#FFFEFD] p-4 border-2 border-cyan-500/30 shadow-inner space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-1.5">
                  <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm text-stone-900">
                    <span className="text-cyan-600">🔊</span>
                    <span>{methodTitle || "विस्तृत विवरण"}</span>
                  </div>
                  <button
                    onClick={replaySpeech}
                    className="text-xs text-cyan-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>दोबारा सुनें (Replay)</span>
                  </button>
                </div>

                <p className="text-stone-800 text-xs sm:text-sm leading-relaxed font-medium">
                  {spokenText || langConfig.greeting}
                </p>

                {highlights && highlights.length > 0 && (
                  <div className="pt-2 border-t border-[#EAE3D5] flex flex-wrap gap-1.5">
                    {highlights.map((h, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-cyan-50 text-cyan-900 text-[11px] font-bold border border-cyan-200 flex items-center gap-1"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-[#FAF7F0] border-t border-[#EAE3D5] flex items-center justify-between gap-3 shrink-0">
              <div className="text-[11px] text-stone-500 flex items-center gap-1">
                <span>🌾 स्वाहा आवाज सहायक • ICAR द्वारा प्रमाणित</span>
              </div>

              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
