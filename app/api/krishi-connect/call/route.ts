import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { peerId, callerId = "usr-current", action = "initiate" } = body;

    const sessionId = `call-sess-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // STUN/TURN servers for WebRTC peer connection
    const iceServers = [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ];

    return NextResponse.json({
      success: true,
      sessionId,
      peerId,
      callerId,
      maxDurationSeconds: 600, // 10 minute enforced ceiling to conserve field bandwidth
      warningThresholdSeconds: 60, // 60s countdown warning
      iceServers,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initialize call session" },
      { status: 500 }
    );
  }
}
