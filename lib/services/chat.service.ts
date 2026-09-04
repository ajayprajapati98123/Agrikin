import { ChatMessage } from "../types";

const CHAT_STORAGE_PREFIX = "agrikin_chat_";
const BLOCKED_USERS_KEY = "agrikin_blocked_users";

export class ChatService {
  /**
   * Retrieves messages for a specific farmer peer
   */
  static getMessages(peerId: string): ChatMessage[] {
    if (typeof window === "undefined") return [];
    const key = CHAT_STORAGE_PREFIX + peerId;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }

    // Default seeded greeting conversation with peer
    const initialSeed: ChatMessage[] = [
      {
        id: "msg-1",
        senderId: peerId,
        receiverId: "usr-current",
        text: "Sat Sri Akal / Namaste ji! I noticed your listing on ȺցɾìҠìղ. We have premium quality harvest ready for dispatch.",
        timestamp: "10:15 AM",
        read: true,
      },
      {
        id: "msg-2",
        senderId: "usr-current",
        receiverId: peerId,
        text: "Namaste! What is the moisture level of the grain and what is your best mandi dispatch rate?",
        timestamp: "10:18 AM",
        read: true,
      },
      {
        id: "msg-3",
        senderId: peerId,
        receiverId: "usr-current",
        text: "Moisture is well calibrated under 12.5%, cleaned and graded in 50kg gunny bags. Sample photos available.",
        timestamp: "10:20 AM",
        read: true,
      }
    ];

    localStorage.setItem(key, JSON.stringify(initialSeed));
    return initialSeed;
  }

  /**
   * Sends a message (text or image)
   */
  static sendMessage(peerId: string, text: string, imageUrl?: string): ChatMessage {
    const currentList = this.getMessages(peerId);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      senderId: "usr-current",
      receiverId: peerId,
      text: text.trim(),
      imageUrl,
      timestamp: timeStr,
      read: false,
    };

    const updated = [...currentList, newMsg];
    if (typeof window !== "undefined") {
      localStorage.setItem(CHAT_STORAGE_PREFIX + peerId, JSON.stringify(updated));
    }

    return newMsg;
  }

  /**
   * Auto-reply from peer after delay to demonstrate functional real-time communication
   */
  static simulatePeerReply(
    peerId: string,
    peerName: string,
    onReply: (reply: ChatMessage) => void
  ): void {
    setTimeout(() => {
      const responses = [
        `Thank you for your response! We can arrange transport to your nearest mandi or farm gate.`,
        `Understood. I will send the quality certificate and weighing slip shortly.`,
        `Sounds great. Shall we initiate a quick video call to inspect the lot quality live?`,
        `Noted! We have 200 quintals available ready for immediate loading.`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const peerMsg: ChatMessage = {
        id: "msg-" + Date.now(),
        senderId: peerId,
        receiverId: "usr-current",
        text: randomResponse,
        timestamp: timeStr,
        read: true,
      };

      const currentList = this.getMessages(peerId);
      const updated = [...currentList, peerMsg];
      if (typeof window !== "undefined") {
        localStorage.setItem(CHAT_STORAGE_PREFIX + peerId, JSON.stringify(updated));
      }
      onReply(peerMsg);
    }, 2500);
  }

  /**
   * Block a user
   */
  static blockUser(peerId: string): void {
    if (typeof window === "undefined") return;
    const blocked = this.getBlockedUsers();
    if (!blocked.includes(peerId)) {
      blocked.push(peerId);
      localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(blocked));
    }
  }

  static unblockUser(peerId: string): void {
    if (typeof window === "undefined") return;
    let blocked = this.getBlockedUsers();
    blocked = blocked.filter((id) => id !== peerId);
    localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(blocked));
  }

  static isBlocked(peerId: string): boolean {
    return this.getBlockedUsers().includes(peerId);
  }

  static getBlockedUsers(): string[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(BLOCKED_USERS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return [];
      }
    }
    return [];
  }
}
