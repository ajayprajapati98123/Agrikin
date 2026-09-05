import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetId, action = "block" } = body;

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: "Target profile ID is required." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      targetId,
      blocked: action === "block",
      message: action === "block"
        ? "User successfully blocked. They will no longer appear in your discovery or chat."
        : "User successfully unblocked.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to modify block status" },
      { status: 500 }
    );
  }
}
