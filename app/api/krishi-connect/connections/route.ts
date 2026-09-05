import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetId = searchParams.get("targetId");

  return NextResponse.json({
    success: true,
    status: targetId ? "CONNECTED" : "NOT_CONNECTED",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetId, action = "connect" } = body;

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: "Target profile ID is required" },
        { status: 400 }
      );
    }

    const newStatus = action === "accept" ? "CONNECTED" : "REQUEST_SENT";

    return NextResponse.json({
      success: true,
      status: newStatus,
      message: action === "accept"
        ? "Connection request accepted. You can now chat and inspect crops via video."
        : "Connection request dispatched to partner.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process connection" },
      { status: 500 }
    );
  }
}
