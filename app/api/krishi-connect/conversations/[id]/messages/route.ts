import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const peerId = params.id.replace("conv-", "");
    const now = new Date();

    const messages = [
      {
        id: `msg-${peerId}-1`,
        senderId: peerId,
        receiverId: "usr-current",
        conversationId: `conv-${peerId}`,
        text: `Sat Sri Akal / Namaste ji! Welcome to ȺցɾìҠìղ Krishi Connect. We have fresh agricultural harvest and verified mandi supplies ready for direct field trade.`,
        timestamp: "10:00 AM",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        read: true,
      },
      {
        id: `msg-${peerId}-2`,
        senderId: "usr-current",
        receiverId: peerId,
        conversationId: `conv-${peerId}`,
        text: `Namaste! Could you please share the moisture certificate and let me know if immediate loading at the farm gate is possible?`,
        timestamp: "10:05 AM",
        createdAt: new Date(Date.now() - 3300000).toISOString(),
        read: true,
      },
      {
        id: `msg-${peerId}-3`,
        senderId: peerId,
        receiverId: "usr-current",
        conversationId: `conv-${peerId}`,
        text: `Yes, moisture is well calibrated below 12.5%. Graded in export quality bags. We can also schedule a quick video inspection call to examine the crop live!`,
        timestamp: "10:08 AM",
        createdAt: new Date(Date.now() - 3000000).toISOString(),
        read: true,
      },
    ];

    return NextResponse.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const peerId = params.id.replace("conv-", "");
    const body = await req.json();
    const { text = "", imageUrl, attachmentType = "produce_sample", senderId = "usr-current" } = body;

    if (!text.trim() && !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Message text or image is required." },
        { status: 400 }
      );
    }

    const now = new Date();
    const newMsg = {
      id: "msg-" + Date.now(),
      senderId,
      receiverId: peerId,
      conversationId: `conv-${peerId}`,
      text: text.trim(),
      imageUrl,
      attachmentType,
      timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: now.toISOString(),
      read: false,
    };

    return NextResponse.json({
      success: true,
      message: newMsg,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
