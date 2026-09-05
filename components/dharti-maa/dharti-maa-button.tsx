"use client";

import React, { useState } from "react";
import { DhartiMaaAvatar } from "./dharti-maa-avatar";
import { DhartiMaaChatModal } from "./dharti-maa-chat-modal";
import { useLanguage } from "../../lib/i18n/i18n-context";
import { Sparkles } from "lucide-react";

export const DhartiMaaFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  return (
    <>
      {/* Floating Bottom-Left Button */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#083344] via-[#0E5266] to-[#042129] hover:from-[#0E5266] hover:to-[#083344] text-white pl-2 pr-4 py-2 rounded-full shadow-xl shadow-cyan-950/30 border-2 border-cyan-400/60 hover:border-cyan-300 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-400/40"
          aria-label="Ask Dharti Maa AI"
        >
          {/* Circular Original Avatar */}
          <div className="relative">
            <DhartiMaaAvatar size="md" className="border border-white/50" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400 border border-cyan-900"></span>
            </span>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1 font-bold text-sm leading-tight text-white group-hover:text-cyan-200 transition-colors">
              <span>🌱 Dharti Maa</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            </div>
            <div className="text-[10px] text-cyan-200 font-medium leading-none">
              {language === "hi" ? "कृषि एआई सहायक" : "Agri AI Assistant"}
            </div>
          </div>
        </button>
      </div>

      {/* Interactive Modal */}
      <DhartiMaaChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
