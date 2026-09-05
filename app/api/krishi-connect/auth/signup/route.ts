import { NextRequest, NextResponse } from "next/server";
import { getDistrictCoordinates } from "../../../../../lib/data/india-locations";
import { KrishiConnectProfile } from "../../../../../lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Step 1 Validation: Registration Type
    const registrationType = body.registrationType;
    if (!registrationType || (registrationType !== "BUYER" && registrationType !== "SELLER")) {
      return NextResponse.json(
        { success: false, error: "Registration Type (BUYER or SELLER) is strictly mandatory." },
        { status: 400 }
      );
    }

    // Step 2 Validation: Names & Age
    const firstName = (body.firstName || "").trim();
    const lastName = (body.lastName || "").trim();
    if (!firstName) {
      return NextResponse.json(
        { success: false, error: "First Name is required." },
        { status: 400 }
      );
    }

    const age = Number(body.age);
    if (!age || age < 18) {
      return NextResponse.json(
        { success: false, error: "You must be at least 18 years old to register on Krishi Connect." },
        { status: 400 }
      );
    }

    // Step 3 Validation: Address & State/District
    const perm = body.permanentAddress;
    if (!perm || !perm.state || !perm.district || !perm.line1 || !perm.pincode) {
      return NextResponse.json(
        { success: false, error: "Complete permanent address (State, District, Address Line 1, and 6-digit PIN) is required." },
        { status: 400 }
      );
    }

    // PIN code validation
    if (!/^\d{6}$/.test(perm.pincode.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 6-digit Indian PIN Code." },
        { status: 400 }
      );
    }

    // Contact Validation
    const email = (body.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email address is required." },
        { status: 400 }
      );
    }

    const phone = (body.phone || "").trim();
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { success: false, error: "Valid 10-digit mobile number is required." },
        { status: 400 }
      );
    }

    // Determine role and coordinates
    const role = registrationType === "BUYER" ? "buyer" : "farmer";
    const coords = getDistrictCoordinates(perm.state, perm.district);
    const fullName = `${firstName} ${body.middleName ? body.middleName.trim() + " " : ""}${lastName}`.trim();

    const profile: KrishiConnectProfile = {
      id: "kc-usr-" + Date.now(),
      entityType: body.entityType || "INDIVIDUAL",
      registrationType,
      role,
      category: body.category || (registrationType === "BUYER" ? "Trader" : "Farmer"),
      name: fullName,
      firstName,
      middleName: body.middleName?.trim(),
      lastName,
      guardianRelation: body.guardianRelation || "S/o",
      guardianName: body.guardianName?.trim() || "",
      dob: body.dob || "",
      age,
      gender: body.gender || "Male",
      email,
      phone,
      permanentAddress: {
        line1: perm.line1.trim(),
        line2: perm.line2?.trim() || "",
        state: perm.state,
        district: perm.district,
        tehsil: perm.tehsil?.trim() || perm.district,
        village: perm.village?.trim() || "Village Area",
        pincode: perm.pincode.trim(),
      },
      currentAddressSameAsPermanent: body.currentAddressSameAsPermanent ?? true,
      currentAddress: body.currentAddressSameAsPermanent
        ? perm
        : body.currentAddress || perm,
      crops: body.crops || (registrationType === "BUYER" ? ["Wheat", "Paddy"] : [body.product || "Wheat"]),
      product: body.product || (registrationType === "BUYER" ? "Crop Procurement Requirement" : "Fresh Farm Produce"),
      quantity: body.quantity || "100",
      unit: body.unit || "Quintals",
      price: body.price || "₹3,500 / Quintal",
      availability: body.availability || "Immediate Dispatch",
      cropsRequired: body.cropsRequired,
      primaryCrop: body.primaryCrop,
      quantityRequired: body.quantityRequired,
      priceRange: body.priceRange,
      timeline: body.timeline,
      experience: body.experience || "5 Years",
      bio: body.bio || `${fullName} - Registered agricultural partner from ${perm.district}, ${perm.state}.`,
      photo:
        body.photo ||
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      radiusKm: body.radiusKm || 50,
      coordinates: coords,
      approxLocation: `${perm.district}, ${perm.state}`,
      state: perm.state,
      district: perm.district,
      tehsil: perm.tehsil,
      village: perm.village,
      verified: true,
      rating: 5.0,
      totalTrades: 1,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      token: "kc-token-" + Date.now(),
      profile,
      message: "Krishi Connect profile successfully registered!",
    });
  } catch (error: any) {
    console.error("Error in Krishi Connect signup API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
