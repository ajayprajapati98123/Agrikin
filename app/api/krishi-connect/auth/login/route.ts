import { NextRequest, NextResponse } from "next/server";
import { initialKrishiProfiles } from "../../../../../lib/services/krishi-connect.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Find profile in seed or create synthetic profile for valid credentials
    const cleanEmail = email.trim().toLowerCase();
    const existing = initialKrishiProfiles.find(
      (p) => p.email.toLowerCase() === cleanEmail
    );

    const profile = existing || {
      id: "kc-user-" + Date.now(),
      entityType: "INDIVIDUAL" as const,
      registrationType: "SELLER" as const,
      role: "farmer" as const,
      category: "Farmer" as const,
      name: email.split("@")[0].toUpperCase(),
      email: cleanEmail,
      phone: "+91 98765 43210",
      permanentAddress: {
        line1: "Main Farm Road",
        state: "Punjab",
        district: "Ludhiana",
        tehsil: "Ludhiana West",
        village: "Sarabha",
        pincode: "141001",
      },
      currentAddressSameAsPermanent: true,
      crops: ["Wheat", "Rice"],
      product: "Certified Quality Harvest",
      quantity: "150",
      unit: "Quintals",
      price: "₹3,800 / Quintal",
      availability: "Immediate",
      experience: "8 Years",
      bio: "Progressive cultivator authenticated via ȺցɾìҠìղ Krishi Connect network.",
      photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      radiusKm: 50,
      coordinates: { lat: 30.9010, lng: 75.8573 },
      approxLocation: "Ludhiana, Punjab",
      state: "Punjab",
      district: "Ludhiana",
      verified: true,
      rating: 5.0,
      totalTrades: 3,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      token: "kc-token-" + Date.now(),
      profile,
      message: "Successfully signed in to Krishi Connect.",
    });
  } catch (error: any) {
    console.error("Error in Krishi Connect login API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
