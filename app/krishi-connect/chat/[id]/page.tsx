"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "../../../../lib/store/app-store";
import { ChatService } from "../../../../lib/services/chat.service";
import { KrishiConnectService } from "../../../../lib/services/krishi-connect.service";
import { ChatMessage, FarmerListing } from "../../../../lib/types";
import { VideoCallModal } from "../../../../components/krishi-connect/video-call-modal";
import {
  ArrowLeft,
  Video,
  Send,
  Image as ImageIcon,
  ShieldAlert,
  Ban,
  MoreVertical,
  CheckCheck,
  Check,
  MapPin,
} from "lucide-react";

export default function FarmerChatPage() {
  const params = useParams();
  const router = useRouter();
  const { farmers } = useApp();
  const farmerId = params?.id as string;

  const krishiPeer = KrishiConnectService.getProfileById(farmerId);
  const peerFarmer = krishiPeer || farmers.find((f) => f.id === farmerId) || {
    id: farmerId || "peer",
    name: "Gurpreet Singh Sandhu",
    role: "farmer" as const,
    state: "Punjab",
    district: "Ludhiana",
    approxLocation: "Samrala, Ludhiana",
    coordinates: { lat: 30.9010, lng: 75.8573 },
    crops: ["Basmati Rice", "Wheat"],
    product: "Organic 1121 Basmati Rice",
    quantity: "250 Quintals",
    price: "₹4,200 / Quintal",
    availability: "Immediate Dispatch",
    experience: "18 Years",
    bio: "Certified natural farming practitioner.",
    photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400",
    verified: true,
    distanceKm: 4.5,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (farmerId) {
      const msgs = ChatService.getMessages(farmerId);
      setMessages(msgs);
      setIsBlocked(ChatService.isBlocked(farmerId));
    }
  }, [farmerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPeerTyping]);

  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage) || isBlocked) return;

    const newMsg = ChatService.sendMessage(farmerId, inputText, selectedImage || undefined);
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setSelectedImage(null);

    // Simulate peer typing indicator & realistic reply
    setIsPeerTyping(true);
    ChatService.simulatePeerReply(farmerId, peerFarmer.name, (reply) => {
      setIsPeerTyping(false);
      setMessages((prev) => [...prev, reply]);
    });
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

  const handleBlockUser = () => {
    if (isBlocked) {
      ChatService.unblockUser(farmerId);
      setIsBlocked(false);
      alert(`${peerFarmer.name} has been unblocked.`);
    } else {
      const conf = confirm(`Are you sure you want to block ${peerFarmer.name}?`);
      if (conf) {
        ChatService.blockUser(farmerId);
        setIsBlocked(true);
      }
    }
    setShowOptionsMenu(false);
  };

  const handleReportUser = () => {
    alert(`Report filed for ${peerFarmer.name}. Our agricultural moderation team will review this trade chat.`);
    setShowOptionsMenu(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 h-[calc(100vh-80px)] flex flex-col">
      {/* Top Header Card */}
      <div className="p-4 rounded-t-3xl bg-white dark:bg-[#082933] border border-b-0 border-stone-200 dark:border-cyan-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/krishi-connect"
            className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-cyan-900/60 hover:bg-cyan-100 flex items-center justify-center text-stone-700 dark:text-stone-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <img
            src={peerFarmer.photo}
            alt={peerFarmer.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-cyan-600 shadow-sm"
          />

          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-stone-900 dark:text-stone-100">
              <span>{peerFarmer.name}</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Online" />
            </div>
            <div className="text-[11px] text-stone-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-700" />
              <span>{peerFarmer.approxLocation}</span>
              <span>�</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-semibold">
                {peerFarmer.distanceKm ? `${peerFarmer.distanceKm} km away` : "Nearby"}
              </span>
            </div>
          </div>
        </div>

        {/* Video Call & Options Menu */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="px-3 py-2 bg-gradient-to-r from-cyan-700 to-teal-700 hover:bg-[#083344] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
            title="Start Lot Inspection Video Call"
          >
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Start Video Call</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-2 rounded-xl bg-stone-100 dark:bg-cyan-900/60 hover:bg-stone-200 text-stone-700 dark:text-stone-200"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showOptionsMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#082933] shadow-xl border border-stone-200 dark:border-cyan-800 py-1.5 z-30 text-xs">
                <button
                  onClick={handleBlockUser}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-stone-50 dark:hover:bg-[#083344]/40 text-stone-700 dark:text-stone-300 text-left"
                >
                  <Ban className="w-3.5 h-3.5 text-stone-500" />
                  <span>{isBlocked ? "Unblock User" : "Block User"}</span>
                </button>
                <button
                  onClick={handleReportUser}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 text-left"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Report Suspicious Trade</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lot / Trade Details Banner */}
      <div className="px-5 py-2.5 bg-cyan-50 dark:bg-cyan-900/40 border-x border-stone-200 dark:border-cyan-800 text-[11px] text-cyan-950 dark:text-cyan-200 flex flex-wrap items-center justify-between gap-2">
        <div>
          <strong>Listing:</strong> {peerFarmer.product} ({peerFarmer.quantity})
        </div>
        <div>
          <strong>Expected Rate:</strong> <span className="font-bold">{peerFarmer.price}</span>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50 dark:bg-[#082933] border-x border-stone-200 dark:border-cyan-800 text-xs">
        {messages.map((m) => {
          const isMe = m.senderId === "usr-current";
          return (
            <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-xs ${
                  isMe
                    ? "bg-gradient-to-r from-cyan-700 to-teal-700 text-white rounded-br-none"
                    : "bg-white dark:bg-cyan-900 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-cyan-800 rounded-bl-none"
                }`}
              >
                {m.imageUrl && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-cyan-300">
                    <img src={m.imageUrl} alt="Uploaded grain sample" className="w-full max-h-48 object-cover" />
                  </div>
                )}
                <div className="leading-relaxed whitespace-pre-wrap">{m.text}</div>
                <div
                  className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
                    isMe ? "text-cyan-200" : "text-stone-400"
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-cyan-300" />}
                </div>
              </div>
            </div>
          );
        })}

        {isPeerTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-cyan-900 text-stone-500 rounded-2xl rounded-bl-none px-4 py-2 border border-stone-200 dark:border-cyan-800 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[10px]">{peerFarmer.name} is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Selected Image Preview */}
      {selectedImage && (
        <div className="px-4 py-2 bg-cyan-100/70 border-x border-cyan-300 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <img src={selectedImage} alt="Preview" className="w-10 h-10 rounded object-cover border" />
            <span className="text-cyan-950 font-semibold">Image attachment ready to send</span>
          </div>
          <button onClick={() => setSelectedImage(null)} className="text-red-600 font-bold">
            Remove
          </button>
        </div>
      )}

      {/* Blocked Alert or Input Form */}
      {isBlocked ? (
        <div className="p-4 rounded-b-3xl bg-stone-200 dark:bg-cyan-900/60 border border-stone-300 dark:border-cyan-800 text-center text-xs text-stone-600 dark:text-stone-300 font-semibold">
          You have blocked this user. Unblock from options to resume chatting.
        </div>
      ) : (
        <div className="p-3 rounded-b-3xl bg-white dark:bg-[#082933] border border-t-0 border-stone-200 dark:border-cyan-800 flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-cyan-900/60 hover:bg-cyan-100 flex items-center justify-center text-stone-600 dark:text-cyan-300 transition-colors"
            title="Attach grain/produce photo"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type message, dispatch dates, or ask for crop photos..."
            className="flex-1 bg-stone-100 dark:bg-cyan-900/40 border border-stone-200 dark:border-cyan-800 rounded-xl px-4 py-2.5 text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim() && !selectedImage}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-700 to-teal-700 hover:bg-[#083344] text-white flex items-center justify-center disabled:opacity-40 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* WebRTC Video Call Modal */}
      <VideoCallModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        peerName={peerFarmer.name}
        peerRole={peerFarmer.role}
        peerPhoto={peerFarmer.photo}
        peerId={peerFarmer.id}
      />
    </div>
  );
}
