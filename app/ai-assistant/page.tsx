"use client";

import React, { useState, useEffect } from "react";
import { DhartiMaaAvatar } from "../../components/dharti-maa/dharti-maa-avatar";
import { AIService } from "../../lib/services/ai.service";
import { useLanguage } from "../../lib/i18n/i18n-context";
import { useApp } from "../../lib/store/app-store";
import { Sparkles, Send, Image as ImageIcon, Mic, RefreshCw, CheckCircle2, Key, Cpu, Check } from "lucide-react";

export default function AIAssistantPage() {
  const { language, t } = useLanguage();
  const { currentUser } = useApp();

  const [messages, setMessages] = useState<Array<{ sender: "user" | "dharti-maa"; text: string; provider?: string; time: string }>>([
    {
      sender: "dharti-maa",
      text: language === "hi"
        ? "नमस्ते किसान भाई! मैं धरती माँ हूँ, आपकी व्यक्तिगत कृषि एआई सहायक। आज आपकी फसल, मिट्टी, सिंचाई, मौसम या सरकारी योजनाओं के बारे में क्या प्रश्न हैं?"
        : "Namaste! I am Dharti Maa, your personal agricultural AI guide at ȺցɾìҠìղ. What farming, disease, irrigation or government scheme query can I assist you with today?",
      provider: "OpenAI GPT-4o & Indian Agronomy Engine",
      time: "Just now",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
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

  const sampleQuestions = language === "hi"
    ? [
        "मेरी फसल के पत्ते पीले क्यों हो रहे हैं?",
        "गेहूं की फसल में पहली सिंचाई कब करनी चाहिए?",
        "ड्रिप सिंचाई पर कितनी सरकारी सब्सिडी मिलती है?",
        "इस मौसम में कौन सी फसल सबसे अधिक लाभ देगी?",
      ]
    : [
        "Why are my tomato leaves turning yellow with brown rings?",
        "When is the critical first irrigation for wheat (CRI stage)?",
        "How much subsidy is available for drip irrigation under PMKSY?",
        "What are the best soil rejuvenation crops after heavy paddy cultivation?",
      ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || loading) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { sender: "user", text: q, time }]);
    setInput("");
    setLoading(true);

    try {
      const response = await AIService.chatWithDhartiMaa(
        q,
        messages.map((m) => ({ sender: m.sender, text: m.text })),
        {
          userCrop: currentUser?.crops?.[0] || "Wheat",
          state: currentUser?.state || "Punjab",
          district: currentUser?.district || "Ludhiana",
          language: language,
        },
        undefined,
        customApiKey.trim() || undefined
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "dharti-maa",
          text: response.text,
          provider: response.provider,
          time,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "dharti-maa",
          text: "Dharti Maa is reviewing live data. Please retry in a moment.",
          time,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-[#083344] via-[#0E5266] to-[#042129] text-white p-6 sm:p-8 shadow-xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="flex items-center gap-5 relative z-10">
          <DhartiMaaAvatar size="xl" className="border-4 border-cyan-300 shrink-0" />
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>AI Agricultural Mentor • OpenAI Connected</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              🌱 Dharti Maa AI Assistant
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed max-w-xl">
              Your 24/7 digital agronomist conversant in Hindi & English, grounded in Indian agricultural science, real-time field data, and OpenAI GPT-4o intelligence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 relative z-10">
          <button
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className="px-3.5 py-2.5 rounded-2xl bg-[#062834]/80 hover:bg-[#062834] border border-cyan-400/40 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Key className="w-3.5 h-3.5 text-cyan-300" />
            <span>OpenAI Settings</span>
          </button>
        </div>
      </div>

      {/* OpenAI Settings Banner Drawer */}
      {showKeyConfig && (
        <div className="p-4 rounded-2xl bg-[#083344] text-white border border-cyan-500/40 text-xs space-y-2 animate-fadeIn shadow-md">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-2 text-cyan-200">
              <Cpu className="w-4 h-4 text-cyan-300" />
              Connected Model: OpenAI GPT-4o
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-800 text-cyan-200 text-[10px] border border-cyan-400/30">
              Active Connection
            </span>
          </div>
          <p className="text-[11px] text-cyan-100/80">
            Dharti Maa connects to OpenAI GPT-4o calibrated with verified Indian agronomy (CIBRC dosages, ICAR practices, and official Government schemes). Enter a custom key or use the built-in server connection.
          </p>
          <div className="flex gap-2 max-w-md">
            <input
              type="password"
              placeholder="sk-proj-..."
              value={customApiKey}
              onChange={(e) => handleSaveApiKey(e.target.value)}
              className="flex-1 bg-cyan-950 border border-cyan-600/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
            />
            {customApiKey && (
              <span className="text-cyan-300 text-xs self-center flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
        </div>
      )}

      {/* Suggested Questions */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="font-bold text-stone-700 self-center mr-1">Quick Prompts:</span>
        {sampleQuestions.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-3.5 py-1.5 rounded-full bg-[#FFFEFD] border border-[#EAE3D5] hover:bg-cyan-50 hover:border-cyan-300 text-stone-800 font-medium transition-all shadow-xs"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-[#FFFEFD] rounded-3xl border border-[#EAE3D5] shadow-md flex flex-col h-[520px] overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs bg-gradient-to-b from-[#FAF7F0] to-[#FFFEFD]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "dharti-maa" && <DhartiMaaAvatar size="sm" className="mt-1" />}
              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-xs leading-relaxed whitespace-pre-line ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-cyan-800 to-teal-800 text-white rounded-br-none"
                    : "bg-[#FFFEFD] text-stone-900 border border-[#EAE3D5] rounded-bl-none"
                }`}
              >
                <div>{m.text}</div>
                <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-cyan-100/40">
                  {m.provider ? (
                    <span className="text-[9px] text-cyan-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                      {m.provider}
                    </span>
                  ) : <span></span>}
                  <span className={`text-[10px] ${m.sender === "user" ? "text-cyan-200" : "text-stone-400"}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 bg-[#FAF7F0] rounded-2xl w-fit text-stone-600 text-xs border border-[#EAE3D5]">
              <RefreshCw className="w-4 h-4 text-cyan-600 animate-spin" />
              <span>Dharti Maa is formulating agronomic advice...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#FAF7F0] border-t border-[#EAE3D5] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              language === "hi"
                ? "फसल, रोग, सिंचाई, मौसम या सरकारी योजनाओं के बारे में पूछें..."
                : "Ask Dharti Maa about crops, pests, irrigation, subsidies..."
            }
            className="flex-1 px-4 py-3 rounded-xl border border-[#EAE3D5] bg-[#FFFEFD] text-stone-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* Safety Guardrails Banner */}
      <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#EAE3D5] text-[11px] text-stone-700 leading-relaxed text-center">
        ⚠️ <strong>Notice:</strong> Dharti Maa AI guidance is informational and educational. Never replace on-site consultation with a qualified agronomist or local Krishi Vigyan Kendra (KVK) for catastrophic crop infestations.
      </div>
    </div>
  );
}
