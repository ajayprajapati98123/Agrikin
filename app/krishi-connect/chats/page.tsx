"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  KrishiConnectService,
  initialKrishiProfiles,
} from "../../../lib/services/krishi-connect.service";
import {
  KrishiConnectProfile,
  ChatMessage,
  KrishiConversation,
} from "../../../lib/types";
import { VideoCallModal } from "../../../components/krishi-connect/video-call-modal";
import {
  MessageSquare,
  Video,
  Send,
  Image as ImageIcon,
  ShieldCheck,
  Search,
  ArrowLeft,
  MoreVertical,
  Ban,
  ShieldAlert,
  CheckCheck,
  Check,
  MapPin,
  Compass,
  Paperclip,
  Clock,
  Sparkles,
  Phone,
  User,
  X,
} from "lucide-react";

function KrishiConnectChatsContent() {
  const searchParams = useSearchParams();
  const requestedPeerId = searchParams.get("peer") || "";

  const [activeProfile, setActiveProfile] = useState<KrishiConnectProfile | null>(null);
  const [conversations, setConversations] = useState<KrishiConversation[]>([]);
  const [selectedPeer, setSelectedPeer] = useState<KrishiConnectProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [attachmentType, setAttachmentType] = useState<ChatMessage["attachmentType"]>("produce_sample");
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    const active = KrishiConnectService.getActiveProfile();
    setActiveProfile(active);

    const convs = KrishiConnectService.getConversations(active?.id);
    setConversations(convs);

    // If requestedPeerId provided in URL, select that peer; otherwise select first conversation
    if (requestedPeerId) {
      const match = convs.find((c) => c.peer.id === requestedPeerId);
      if (match) {
        selectConversation(match.peer);
      } else {
        const directPeer =
          KrishiConnectService.getProfileById(requestedPeerId) ||
          initialKrishiProfiles.find((p) => p.id === requestedPeerId);
        if (directPeer) selectConversation(directPeer);
      }
    } else if (convs.length > 0) {
      selectConversation(convs[0].peer);
    }
  }, [requestedPeerId]);

  // Scroll to bottom when messages or typing changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPeerTyping]);

  const selectConversation = (peer: KrishiConnectProfile) => {
    setSelectedPeer(peer);
    const msgs = KrishiConnectService.getMessages(peer.id, activeProfile?.id);
    setMessages(msgs);
    setIsBlocked(KrishiConnectService.isBlocked(peer.id));
    setShowOptionsMenu(false);
  };

  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage) || !selectedPeer || isBlocked) return;

    const newMsg = KrishiConnectService.sendMessage(
      selectedPeer.id,
      inputText,
      selectedImage || undefined,
      selectedImage ? attachmentType : undefined,
      activeProfile?.id
    );

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setSelectedImage(null);

    // Refresh conversation snippet
    setConversations(KrishiConnectService.getConversations(activeProfile?.id));

    // Simulate realistic peer reply
    setIsPeerTyping(true);
    KrishiConnectService.simulatePeerReply(
      selectedPeer.id,
      selectedPeer.name,
      (reply) => {
        setIsPeerTyping(false);
        setMessages((prev) => [...prev, reply]);
        setConversations(KrishiConnectService.getConversations(activeProfile?.id));
      },
      activeProfile?.id
    );
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

  const handleBlockToggle = () => {
    if (!selectedPeer) return;
    if (isBlocked) {
      KrishiConnectService.unblockUser(selectedPeer.id);
      setIsBlocked(false);
      showToast(`${selectedPeer.name} has been unblocked.`);
    } else {
      if (confirm(`Block ${selectedPeer.name} from contacting you?`)) {
        KrishiConnectService.blockUser(selectedPeer.id);
        setIsBlocked(true);
        showToast(`${selectedPeer.name} is now blocked.`);
      }
    }
    setShowOptionsMenu(false);
  };

  const handleReport = () => {
    if (!selectedPeer) return;
    KrishiConnectService.reportUser({
      peerId: selectedPeer.id,
      peerName: selectedPeer.name,
      reason: "Suspicious activity in chat",
      details: "Reported directly from trade chat messenger",
    });
    setShowOptionsMenu(false);
    showToast(`Report filed for ${selectedPeer.name}. Moderation will investigate.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.peer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.peer.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.peer.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-[#083344] text-white border border-cyan-500 shadow-2xl text-xs font-semibold flex items-center gap-2">
          <span>🌾</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main 2-Column Desktop / Mobile Responsive Shell */}
      <div className="bg-white dark:bg-[#082933] rounded-3xl border border-stone-200 dark:border-cyan-800 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-140px)] min-h-[580px]">
        {/* ================= LEFT COLUMN: CONVERSATION LIST ================= */}
        <div
          className={`md:col-span-4 lg:col-span-4 border-r border-stone-200 dark:border-cyan-800 flex flex-col ${
            selectedPeer ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Top Header of Sidebar */}
          <div className="p-4 border-b border-stone-200 dark:border-cyan-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link
                  href="/krishi-connect"
                  className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-cyan-900/60 hover:bg-cyan-100 flex items-center justify-center text-stone-700 dark:text-stone-300"
                  title="Back to Marketplace"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <h2 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                  Trade Messages
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/80 text-cyan-950 dark:text-cyan-200 text-[11px] font-bold">
                {conversations.length} Active
              </span>
            </div>

            {/* Conversation Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/40 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#EAE3D5] dark:divide-cyan-900/60">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const isSelected = selectedPeer?.id === conv.peer.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv.peer)}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                      isSelected
                        ? "bg-cyan-50 dark:bg-cyan-900/50"
                        : "hover:bg-stone-50 dark:hover:bg-[#083344]/20"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.peer.photo}
                        alt={conv.peer.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-cyan-600/40"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-[#082933]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                          {conv.peer.name}
                        </span>
                        <span className="text-[10px] text-stone-400 shrink-0">
                          {conv.lastMessage?.timestamp || "Today"}
                        </span>
                      </div>

                      <div className="text-[11px] text-cyan-700 dark:text-cyan-400 font-semibold truncate mt-0.5">
                        {conv.peer.product}
                      </div>

                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {conv.lastMessage?.text || "Started a new trade inquiry..."}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-cyan-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 self-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-stone-400 space-y-1">
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: ACTIVE CHAT STAGE ================= */}
        <div
          className={`md:col-span-8 lg:col-span-8 flex flex-col h-full ${
            !selectedPeer ? "hidden md:flex" : "flex"
          }`}
        >
          {selectedPeer ? (
            <>
              {/* Chat Top Header */}
              <div className="p-3.5 sm:p-4 border-b border-stone-200 dark:border-cyan-800 flex items-center justify-between bg-stone-50/70 dark:bg-cyan-900/30">
                <div className="flex items-center gap-3">
                  {/* Mobile Back button */}
                  <button
                    onClick={() => setSelectedPeer(null)}
                    className="md:hidden p-1.5 rounded-xl text-stone-600 hover:bg-stone-200"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <img
                    src={selectedPeer.photo}
                    alt={selectedPeer.name}
                    className="w-10 h-10 rounded-2xl object-cover border border-cyan-600"
                  />

                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-stone-900 dark:text-stone-100">
                      <span>{selectedPeer.name}</span>
                      {selectedPeer.verified && (
                        <ShieldCheck className="w-4 h-4 text-cyan-600" />
                      )}
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                      <span className="capitalize">{selectedPeer.registrationType}</span>
                      <span>•</span>
                      <span>{selectedPeer.district}, {selectedPeer.state}</span>
                      <span>•</span>
                      <span className="font-semibold text-cyan-700 dark:text-cyan-400">
                        {selectedPeer.product}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Header Controls: Direct Video Call & Options */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="px-3.5 py-2 bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                    title="Launch WebRTC 10-minute produce inspection call"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Inspect via Video</span>
                  </button>

                  <Link
                    href={`/krishi-connect/${selectedPeer.id}`}
                    className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#083344]/60"
                    title="View Full Profile"
                  >
                    <User className="w-4 h-4" />
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                      className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#083344]/60"
                      title="Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {showOptionsMenu && (
                      <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#082933] shadow-2xl border border-stone-200 dark:border-cyan-800 py-1.5 z-40 text-xs animate-fadeIn">
                        <button
                          onClick={handleBlockToggle}
                          className="w-full flex items-center gap-2 px-4 py-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#083344]/40 text-left"
                        >
                          <Ban className="w-3.5 h-3.5 text-red-500" />
                          <span>{isBlocked ? "Unblock User" : "Block User"}</span>
                        </button>
                        <button
                          onClick={handleReport}
                          className="w-full flex items-center gap-2 px-4 py-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#083344]/40 text-left"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                          <span>Report Chat</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Feed Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#FAF7F0]/50 to-white dark:from-cyan-950/20 dark:to-cyan-950/40">
                {/* Security notice */}
                <div className="p-3 rounded-2xl bg-cyan-50/60 dark:bg-cyan-900/30 border border-cyan-200/80 dark:border-cyan-800 text-center text-[11px] text-cyan-950 dark:text-cyan-200 max-w-md mx-auto flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>
                    Direct field trade channel. Video inspections are capped at 10 minutes to protect rural network stability.
                  </span>
                </div>

                {/* Messages */}
                {messages.map((msg) => {
                  const isSender = msg.senderId === (activeProfile?.id || "usr-current");
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-sm sm:max-w-md rounded-2xl px-4 py-3 space-y-2 text-xs shadow-xs ${
                          isSender
                            ? "bg-cyan-800 text-white rounded-tr-xs"
                            : "bg-white dark:bg-cyan-900/60 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-cyan-800 rounded-tl-xs"
                        }`}
                      >
                        {/* Attached Image (e.g. produce sample, moisture slip) */}
                        {msg.imageUrl && (
                          <div className="space-y-1">
                            <img
                              src={msg.imageUrl}
                              alt="Agricultural Attachment"
                              className="rounded-xl max-h-56 w-full object-cover border border-white/20 cursor-pointer hover:opacity-95 transition-opacity"
                              onClick={() => window.open(msg.imageUrl, "_blank")}
                            />
                            {msg.attachmentType && (
                              <div className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
                                🌾 {msg.attachmentType.replace("_", " ")}
                              </div>
                            )}
                          </div>
                        )}

                        {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                        <div
                          className={`flex items-center justify-end gap-1 text-[10px] ${
                            isSender ? "text-cyan-200" : "text-stone-400"
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isSender && (
                            msg.read ? (
                              <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isPeerTyping && (
                  <div className="flex items-center gap-2 text-stone-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px]">{selectedPeer.name} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Image Preview before Sending */}
              {selectedImage && (
                <div className="p-3 bg-stone-100 dark:bg-cyan-900/60 border-t border-stone-200 dark:border-cyan-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedImage}
                      alt="Attachment Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-cyan-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-100 block">
                        Produce Attachment Ready
                      </span>
                      <select
                        value={attachmentType}
                        onChange={(e) => setAttachmentType(e.target.value as any)}
                        className="text-[10px] rounded border border-stone-300 dark:border-cyan-800 bg-white dark:bg-[#082933] p-0.5"
                      >
                        <option value="produce_sample">Produce Lot Sample</option>
                        <option value="weighing_slip">Weighing Slip</option>
                        <option value="soil_report">Soil Test Certificate</option>
                        <option value="crop_disease">Crop / Leaf Sample</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933]">
                {isBlocked ? (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs rounded-xl text-center font-semibold">
                    You have blocked this user. Unblock from options to resume trade messages.
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Attach Image Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#083344]/40"
                      title="Attach Crop or Weighing Slip Image"
                    >
                      <ImageIcon className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </button>

                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder={`Message ${selectedPeer.name} about ${selectedPeer.product}...`}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!inputText.trim() && !selectedImage}
                      className="p-2.5 bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold disabled:opacity-40 transition-colors shadow-xs"
                      title="Send Message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-cyan-900/50 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="font-bold text-base text-stone-800 dark:text-stone-200">
                Select a conversation
              </h3>
              <p className="text-xs max-w-sm text-stone-500">
                Choose a partner from the sidebar to inspect crop quality, exchange weighment slips, and launch live video calls.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Video Call Modal */}
      {selectedPeer && (
        <VideoCallModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          peerName={selectedPeer.name}
          peerRole={selectedPeer.registrationType || selectedPeer.role}
          peerPhoto={selectedPeer.photo}
          peerId={selectedPeer.id}
        />
      )}
    </div>
  );
}

export default function KrishiConnectChatsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
          <div className="bg-white dark:bg-[#082933] rounded-3xl border border-stone-200 dark:border-cyan-800 shadow-xl h-[calc(100vh-140px)] min-h-[580px] flex items-center justify-center">
            <div className="text-sm font-semibold text-stone-500 dark:text-stone-300">
              Loading trade messages...
            </div>
          </div>
        </div>
      }
    >
      <KrishiConnectChatsContent />
    </Suspense>
  );
}
