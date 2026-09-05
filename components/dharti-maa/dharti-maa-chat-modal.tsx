"use client";

import React, { useState, useRef, useEffect } from "react";
import { DhartiMaaAvatar } from "./dharti-maa-avatar";
import { AIService } from "../../lib/services/ai.service";
import { useLanguage } from "../../lib/i18n/i18n-context";
import { useApp } from "../../lib/store/app-store";
import { X, Send, Image as ImageIcon, Mic, RefreshCw, Sparkles, ExternalLink, Key, Cpu, Check } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  sender: "user" | "dharti-maa";
  text: string;
  provider?: string;
  timestamp: string;
  image?: string;
}

export const DhartiMaaChatModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { language, t } = useLanguage();
  const { currentUser } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "dharti-maa",
      text: language === "hi"
        ? "नमस्ते किसान भाई! मैं धरती माँ हूँ, आपकी व्यक्तिगत कृषि एआई सहायक। आज आपकी फसल, सिंचाई, रोग या सरकारी योजनाओं से संबंधित क्या सहायता करूँ?"
        : "Namaste! I am Dharti Maa, your personal agricultural AI guide. How can I assist your farm, irrigation, pest control, or government scheme queries today?",
      provider: "OpenAI GPT-4o & Indian Agronomy Engine",
      timestamp: "Just now",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("agrikin_openai_api_key") || "";
      if (savedKey) setCustomApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (keyVal: string) => {
    setCustomApiKey(keyVal);
    if (typeof window !== "undefined") {
      localStorage.setItem("agrikin_openai_api_key", keyVal);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = language === "hi"
    ? [
        "मेरी फसल के पत्ते पीले क्यों हो रहे हैं?",
        "इस मौसम में कौन सी फसल लगाएं?",
        "ड्रिप सिंचाई पर कितनी सरकारी सब्सिडी है?",
        "क्या बारिश से मेरी फसल प्रभावित होगी?",
        "पीएम-किसान योजना में आवेदन कैसे करें?",
      ]
    : [
        "Why are my crop leaves turning yellow?",
        "What crop should I grow for high profit?",
        "Which irrigation method saves the most water?",
        "How do I apply for PM-Kisan & KCC loans?",
        "Will upcoming rain affect my wheat crop?",
      ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() && !selectedImage) return;

    const userMsg: Message = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: textToSend.trim(),
      image: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSelectedImage(null);
    setLoading(true);

    try {
      const response = await AIService.chatWithDhartiMaa(
        textToSend,
        messages.map((m) => ({ sender: m.sender, text: m.text })),
        {
          userCrop: currentUser?.crops?.[0] || "Wheat",
          state: currentUser?.state || "Punjab",
          district: currentUser?.district || "Ludhiana",
          language: language,
        },
        selectedImage || undefined,
        customApiKey.trim() || undefined
      );

      const aiMsg: Message = {
        id: "ai-" + Date.now(),
        sender: "dharti-maa",
        text: response.text,
        provider: response.provider,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const errorMsg: Message = {
        id: "ai-err-" + Date.now(),
        sender: "dharti-maa",
        text: language === "hi"
          ? "माफ़ कीजिए, नेटवर्क में कुछ विलंब हो रहा है। कृपया पुनः प्रयास करें।"
          : "Dharti Maa is temporarily experiencing network latency. Please retry shortly.",
        timestamp: "Now",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMic = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInput(language === "hi" ? "मेरी गेहूं की फसल में दीमक का प्रकोप है, क्या उपाय करूँ?" : "How do I control termite attack in my wheat field?");
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-start p-2 sm:p-6 bg-black/40 backdrop-blur-sm animate-fadeIn">
      {/* Container aligned bottom-left near button on desktop */}
      <div className="relative w-full max-w-lg h-[92vh] sm:h-[650px] bg-[#FFFEFD] rounded-2xl sm:rounded-3xl shadow-2xl border border-cyan-500/30 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#083344] via-[#0E5266] to-[#042129] px-5 py-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <DhartiMaaAvatar size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg leading-tight text-white">🌱 Dharti Maa</h3>
                <span className="bg-cyan-500/30 text-cyan-200 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-cyan-400/40">
                  AI Companion
                </span>
              </div>
              <p className="text-xs text-cyan-100/90">
                {language === "hi" ? "आपकी डिजिटल कृषि मार्गदर्शक" : "Personal Agricultural AI Guide"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              title="OpenAI API Settings"
            >
              <Key className="w-4 h-4 text-cyan-200" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* OpenAI Connection Settings Drawer */}
        {showSettings && (
          <div className="p-3.5 bg-[#083344] text-white border-b border-cyan-800 text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Cpu className="w-4 h-4 text-cyan-400" />
                OpenAI GPT-4o Connection
              </span>
              <span className="text-[10px] text-cyan-300 bg-cyan-900 px-2 py-0.5 rounded-full border border-cyan-500/40">
                Active
              </span>
            </div>
            <p className="text-[11px] text-cyan-100/80 leading-relaxed">
              Enter your OpenAI API key (<code className="bg-cyan-950 px-1 py-0.5 rounded text-cyan-200">sk-...</code>) to connect Dharti Maa directly to OpenAI GPT-4o, or leave empty to use our built-in agricultural agronomy engine.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="sk-proj-..."
                value={customApiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                className="flex-1 bg-cyan-950 border border-cyan-600/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
              />
              {customApiKey && (
                <span className="text-cyan-400 text-xs self-center flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#FAF7F0] border-b border-[#EAE3D5] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Sparkles className="w-4 h-4 text-cyan-700 shrink-0" />
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-xs bg-[#FFFEFD] hover:bg-cyan-50 text-cyan-900 px-3 py-1.5 rounded-full whitespace-nowrap border border-cyan-200 transition-all shadow-xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#FAF7F0] to-[#FFFEFD]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "dharti-maa" && <DhartiMaaAvatar size="sm" className="mt-1 shrink-0" />}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-cyan-800 to-teal-800 text-white rounded-br-none"
                    : "bg-[#FFFEFD] text-stone-800 border border-[#EAE3D5] rounded-bl-none"
                }`}
              >
                {m.image && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-cyan-200">
                    <img src={m.image} alt="Uploaded crop sample" className="w-full max-h-48 object-cover" />
                  </div>
                )}
                <div className="whitespace-pre-line leading-relaxed">{m.text}</div>
                <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-cyan-100/50">
                  {m.provider ? (
                    <span className="text-[9px] text-cyan-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                      {m.provider}
                    </span>
                  ) : <span></span>}
                  <span
                    className={`text-[10px] ${
                      m.sender === "user" ? "text-cyan-200" : "text-stone-400"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2.5">
              <DhartiMaaAvatar size="sm" className="mt-1" />
              <div className="bg-[#FFFEFD] border border-[#EAE3D5] rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-600 animate-spin" />
                <span className="text-xs text-stone-600">
                  {language === "hi" ? "धरती माँ कृषि डेटा का विश्लेषण कर रही हैं..." : "Dharti Maa is reviewing agronomic data..."}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Selected Image Preview */}
        {selectedImage && (
          <div className="px-4 py-2 bg-cyan-50 flex items-center justify-between border-t border-cyan-200">
            <div className="flex items-center gap-2">
              <img src={selectedImage} alt="Preview" className="w-10 h-10 rounded object-cover border" />
              <span className="text-xs text-cyan-900 font-medium">
                {language === "hi" ? "फसल फोटो संलग्न की गई" : "Crop photo attached"}
              </span>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-stone-500 hover:text-red-600 text-xs font-semibold"
            >
              ✕ Remove
            </button>
          </div>
        )}

        {/* Voice Recording Indicator */}
        {isRecording && (
          <div className="px-4 py-2 bg-red-50 text-red-700 text-xs flex items-center justify-between border-t border-red-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
              <span>{language === "hi" ? "आवाज सुनी जा रही है... बोलिए" : "Listening to voice input... speak now"}</span>
            </div>
            <button onClick={toggleMic} className="font-bold text-red-800 hover:underline">
              Stop
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-[#FFFEFD] border-t border-[#EAE3D5] flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-xl bg-[#FAF7F0] hover:bg-cyan-50 text-stone-600 hover:text-cyan-700 flex items-center justify-center transition-colors border border-[#EAE3D5]"
            title="Attach crop photo"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={toggleMic}
            className={`w-10 h-10 rounded-xl border border-[#EAE3D5] ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-[#FAF7F0] hover:bg-cyan-50 text-stone-600 hover:text-cyan-700"
            } flex items-center justify-center transition-colors`}
            title="Voice input"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={
              language === "hi"
                ? "फसल, रोग, मौसम या योजना के बारे में पूछें..."
                : "Ask about crops, diseases, irrigation, schemes..."
            }
            className="flex-1 bg-[#FAF7F0] border border-[#EAE3D5] rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={(!input.trim() && !selectedImage) || loading}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Safety Disclaimer Footer */}
        <div className="px-4 py-1.5 bg-[#FAF7F0] border-t border-[#EAE3D5] text-[10px] text-stone-500 text-center">
          {language === "hi"
            ? "⚠️ धरती माँ की सलाह मार्गदर्शक है। गंभीर कृषि निर्णय हेतु नजदीकी KVK या कृषि अधिकारी से संपर्क करें।"
            : "⚠️ Guidance is informational. For critical field decisions, consult your local KVK or agricultural officer."}
        </div>
      </div>
    </div>
  );
};
