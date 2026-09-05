import { NextRequest, NextResponse } from "next/server";
import {
  getIndianStates,
  getDistrictsByState,
  getTehsilsByDistrict,
  searchVillages,
  getDistrictCoordinates,
} from "../../../../lib/data/india-locations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "states";
    const state = searchParams.get("state") || "";
    const district = searchParams.get("district") || "";
    const tehsil = searchParams.get("tehsil") || "";
    const query = searchParams.get("q") || "";

    if (type === "states") {
      const states = getIndianStates();
      return NextResponse.json({
        success: true,
        count: states.length,
        states,
      });
    }

    if (type === "districts") {
      if (!state) {
        return NextResponse.json(
          { success: false, error: "Missing state parameter" },
          { status: 400 }
        );
      }
      const districts = getDistrictsByState(state);
      return NextResponse.json({
        success: true,
        state,
        count: districts.length,
        districts,
      });
    }

    if (type === "tehsils") {
      if (!state || !district) {
        return NextResponse.json(
          { success: false, error: "Missing state or district parameter" },
          { status: 400 }
        );
      }
      const tehsils = getTehsilsByDistrict(state, district);
      const coords = getDistrictCoordinates(state, district);
      return NextResponse.json({
        success: true,
        state,
        district,
        coordinates: coords,
        count: tehsils.length,
        tehsils,
      });
    }

    if (type === "villages") {
      if (!state || !district) {
        return NextResponse.json(
          { success: false, error: "Missing state or district parameter" },
          { status: 400 }
        );
      }
      const villages = searchVillages(state, district, tehsil, query);
      return NextResponse.json({
        success: true,
        state,
        district,
        tehsil,
        count: villages.length,
        villages,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid type. Must be states, districts, tehsils, or villages" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error in locations API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
