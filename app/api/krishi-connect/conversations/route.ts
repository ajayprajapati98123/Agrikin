import { NextRequest, NextResponse } from "next/server";
import { initialKrishiProfiles } from "../../../../lib/services/krishi-connect.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const viewerId = searchParams.get("userId") || "usr-current";

    const peers = initialKrishiProfiles.filter((p) => p.id !== viewerId);

    const conversations = peers.map((peer, idx) => ({
      id: `conv-${peer.id}`,
      participantIds: [viewerId, peer.id],
      peer,
      lastMessage: {
        id: `msg-${peer.id}-last`,
        senderId: peer.id,
        receiverId: viewerId,
        text: `Namaste! Regarding the ${peer.product} listing, we have verified stocks ready for trade.`,
        timestamp: `${10 + idx}:30 AM`,
        createdAt: new Date(Date.now() - (idx * 3600000)).toISOString(),
        read: idx > 0,
      },
      unreadCount: idx === 0 ? 1 : 0,
      updatedAt: new Date(Date.now() - (idx * 3600000)).toISOString(),
    }));

    return NextResponse.json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
