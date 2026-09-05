import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetId, targetName = "User", reason = "Spam / Inappropriate Listing", notes = "" } = body;

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: "Target profile ID is required." },
        { status: 400 }
      );
    }

    const reportId = "rep-" + Date.now();

    return NextResponse.json({
      success: true,
      reportId,
      message: `Report filed successfully for ${targetName}. The ȺցɾìҠìղ agricultural moderation team will investigate within 24 hours.`,
      reportedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit report" },
      { status: 500 }
    );
  }
}
