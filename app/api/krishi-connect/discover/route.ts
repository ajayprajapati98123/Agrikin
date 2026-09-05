import { NextRequest, NextResponse } from "next/server";
import {
  KrishiConnectService,
  initialKrishiProfiles,
} from "../../../../lib/services/krishi-connect.service";
import { calculateDistanceKm } from "../../../../lib/services/location.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roleFilter = (searchParams.get("role") as any) || "all";
    const searchQuery = searchParams.get("q") || "";
    const maxDistanceKm = searchParams.get("maxDistance")
      ? Number(searchParams.get("maxDistance"))
      : 0;
    const state = searchParams.get("state") || "";
    const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : 30.9010;
    const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : 75.8573;
    const viewerId = searchParams.get("viewerId") || "";

    // Calculate distances & filter
    let results = initialKrishiProfiles.filter((p) => {
      if (viewerId && p.id === viewerId) return false;
      return true;
    });

    results = results.map((p) => {
      const dist = calculateDistanceKm(lat, lng, p.coordinates.lat, p.coordinates.lng);
      return {
        ...p,
        distanceKm: Math.round(dist * 10) / 10,
      };
    });

    if (roleFilter !== "all") {
      if (roleFilter === "sellers" || roleFilter === "seller") {
        results = results.filter(
          (p) => p.registrationType === "SELLER" || p.role === "farmer" || p.role === "seller"
        );
      } else if (roleFilter === "buyers" || roleFilter === "buyer") {
        results = results.filter(
          (p) => p.registrationType === "BUYER" || p.role === "buyer"
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.product.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.crops.some((c) => c.toLowerCase().includes(q)) ||
          (p.cropsRequired && p.cropsRequired.some((c) => c.toLowerCase().includes(q)))
      );
    }

    if (maxDistanceKm > 0) {
      results = results.filter(
        (p) => p.distanceKm === undefined || p.distanceKm <= maxDistanceKm
      );
    }

    if (state && state !== "all") {
      results = results.filter((p) => p.state.toLowerCase() === state.toLowerCase());
    }

    results.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    return NextResponse.json({
      success: true,
      count: results.length,
      referenceCoords: { lat, lng },
      profiles: results,
    });
  } catch (error: any) {
    console.error("Error in Krishi Connect discover API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to discover profiles" },
      { status: 500 }
    );
  }
}
