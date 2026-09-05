import { NextRequest, NextResponse } from "next/server";
import { WeatherData } from "../../../lib/types";
import { districtCoordinates } from "../../../lib/services/location.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GeocodeResult {
  latitude: number;
  longitude: number;
  name: string;
  admin1?: string;
}

// Helper: Geocode location name dynamically via Open-Meteo free geocoding
async function geocodeLocation(query: string): Promise<GeocodeResult | null> {
  try {
    const cleanQuery = query.split(",")[0].trim();
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      cleanQuery
    )}&count=5&language=en&format=json`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 }, // Cache geocode coordinates for 24h
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (Array.isArray(data.results) && data.results.length > 0) {
      // Prioritize results from India (country_code "IN")
      const indiaResult =
        data.results.find((r: any) => r.country_code === "IN") || data.results[0];
      return {
        latitude: indiaResult.latitude,
        longitude: indiaResult.longitude,
        name: indiaResult.name,
        admin1: indiaResult.admin1,
      };
    }

    return null;
  } catch (err) {
    console.warn("Geocoding error:", err);
    return null;
  }
}

// Convert degree to 16-point compass
function degToCompass(num: number): string {
  const val = Math.floor(num / 22.5 + 0.5);
  const arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return arr[val % 16];
}

// Map WMO Weather Codes with Day/Night context
function mapWeatherCode(code: number, isDay: boolean): { text: string; code: string } {
  switch (code) {
    case 0:
      return {
        text: isDay ? "Clear Sunny Skies" : "Clear Starry Skies",
        code: isDay ? "clear_day" : "clear_night",
      };
    case 1:
      return {
        text: isDay ? "Mainly Sunny" : "Mainly Clear Night",
        code: isDay ? "partly_cloudy_day" : "partly_cloudy_night",
      };
    case 2:
      return {
        text: isDay ? "Partly Cloudy" : "Partly Cloudy Night",
        code: isDay ? "partly_cloudy_day" : "partly_cloudy_night",
      };
    case 3:
      return { text: "Overcast Cloud Cover", code: "overcast" };
    case 45:
    case 48:
      return { text: "Dense Fog & Ground Mist", code: "fog" };
    case 51:
    case 53:
    case 55:
      return { text: "Light Drizzle & Mist Showers", code: "drizzle" };
    case 61:
      return { text: "Light Monsoon Rain", code: "light_rain" };
    case 63:
      return { text: "Moderate Rain Showers", code: "rain" };
    case 65:
      return { text: "Heavy Downpour Rain", code: "heavy_rain" };
    case 80:
    case 81:
    case 82:
      return { text: "Torrential Rain Showers", code: "heavy_rain" };
    case 95:
      return { text: "Thunderstorm & Lightning Activity", code: "thunderstorm" };
    case 96:
    case 99:
      return { text: "Severe Thunderstorm with Hail Risk", code: "thunderstorm" };
    default:
      return {
        text: isDay ? "Mild Agricultural Weather" : "Calm Night Atmosphere",
        code: "fair",
      };
  }
}

// Generate ICAR Agricultural Field Advisory
function generateAgriculturalAdvisory(
  temp: number,
  humidity: number,
  rainProb: number,
  windSpeed: number,
  precipMm: number
) {
  let irrigationAdvice =
    "Soil moisture balance is optimal. Irrigate according to standard crop phenological cycle.";
  let sprayingCondition: "Favorable" | "Unfavorable" | "Caution" = "Favorable";
  let pestRisk: "Low" | "Moderate" | "High" = "Low";
  let summary = "Stable atmospheric conditions across field sectors.";
  let criticalWarning: string | undefined = undefined;

  // Rain & Spray Window
  if (rainProb > 60 || precipMm > 1.0) {
    summary = "High probability of rain or precipitation in the region.";
    irrigationAdvice =
      "Rain is anticipated. Suspend scheduled canal or tube-well irrigation to prevent waterlogging and nitrogen leaching.";
    sprayingCondition = "Unfavorable";
    criticalWarning =
      "Postpone all chemical pesticide and foliar fertilizer sprays to prevent chemical wash-off and environmental waste.";
  } else if (windSpeed > 15) {
    summary = "Elevated wind velocities detected.";
    sprayingCondition = "Unfavorable";
    criticalWarning =
      "Avoid spraying. Wind speeds exceed 15 km/h, creating extreme droplet drift away from target foliar canopy.";
  } else if (temp > 38) {
    summary = "Extreme daytime heat conditions observed.";
    irrigationAdvice =
      "High evapotranspiration rate. Apply light frequent irrigation during late evening or early morning to reduce plant heat stress.";
    sprayingCondition = "Caution";
  } else if (temp < 10) {
    summary = "Low ambient temperatures observed.";
    irrigationAdvice =
      "Cold soil slows nutrient uptake. Irrigate lightly before sunset to moderate nocturnal ground temperatures against frost.";
    sprayingCondition = "Caution";
  }

  // Disease & Pest Risk
  if (humidity > 80 && temp >= 20 && temp <= 32) {
    pestRisk = "High";
    if (!criticalWarning) {
      criticalWarning =
        "Warm temperature combined with high humidity (>80%) creates ideal conditions for fungal spore germination (Blights, Downy Mildew, Blast).";
    }
  } else if (humidity > 65) {
    pestRisk = "Moderate";
  }

  return {
    summary,
    irrigationAdvice,
    sprayingCondition,
    pestRisk,
    criticalWarning,
  };
}

// Format ISO time to readable 12-hour clock (e.g. "05:52 AM")
function formatTime12h(isoStr?: string): string | undefined {
  if (!isoStr) return undefined;
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return undefined;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    let latStr = searchParams.get("lat");
    let lngStr = searchParams.get("lng");
    const districtParam = searchParams.get("district") || "";
    const stateParam = searchParams.get("state") || "";
    const queryParam = searchParams.get("q") || "";

    let resolvedLat: number | null = latStr ? parseFloat(latStr) : null;
    let resolvedLng: number | null = lngStr ? parseFloat(lngStr) : null;
    let locationName = districtParam || queryParam || "Punjab Agricultural Basin";
    let stateName = stateParam || "Punjab";
    let districtName = districtParam || queryParam || "Ludhiana";

    // 1. Resolve coordinates from static dictionary if district is supplied
    if (resolvedLat === null || resolvedLng === null || isNaN(resolvedLat) || isNaN(resolvedLng)) {
      const matchDistrict = districtParam || queryParam;
      if (matchDistrict && districtCoordinates[matchDistrict]) {
        resolvedLat = districtCoordinates[matchDistrict].lat;
        resolvedLng = districtCoordinates[matchDistrict].lng;
        districtName = matchDistrict;
      }
    }

    // 2. Dynamic geocoding fallback if not found in static dictionary
    if (resolvedLat === null || resolvedLng === null || isNaN(resolvedLat) || isNaN(resolvedLng)) {
      const targetQuery = districtParam
        ? `${districtParam}, ${stateParam}`
        : queryParam || "Ludhiana, Punjab";

      const geo = await geocodeLocation(targetQuery);
      if (geo) {
        resolvedLat = geo.latitude;
        resolvedLng = geo.longitude;
        districtName = geo.name;
        if (geo.admin1) stateName = geo.admin1;
        locationName = `${districtName}, ${stateName}`;
      } else {
        // Default to Bareilly or Ludhiana
        resolvedLat = 28.3670;
        resolvedLng = 79.4304;
        locationName = "Bareilly, Uttar Pradesh";
        stateName = "Uttar Pradesh";
        districtName = "Bareilly";
      }
    }

    // 3. Fetch Real-time Live Weather from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${resolvedLat}&longitude=${resolvedLng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,is_day,surface_pressure,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset&timezone=Asia%2FKolkata`;

    const weatherRes = await fetch(weatherUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 }, // Cache on server for 60 seconds
    });

    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo returned status ${weatherRes.status}`);
    }

    const data = await weatherRes.json();
    const current = data.current;
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const isDay = current.is_day === 1;
    const conditionInfo = mapWeatherCode(current.weather_code, isDay);

    // Calculate real rain probability
    const rainProb = daily.precipitation_probability_max?.[0] !== undefined
      ? daily.precipitation_probability_max[0]
      : current.rain > 0
      ? 90
      : 10;

    // Real UV Index (0 at night, live current reading, or max)
    const uvIndex = isDay
      ? typeof current.uv_index === "number"
        ? Math.round(current.uv_index)
        : Math.round(daily.uv_index_max?.[0] || 6)
      : 0;

    // 7-Day Forecast
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const forecast = (daily.time || []).slice(0, 7).map((timeStr: string, idx: number) => {
      const d = new Date(timeStr);
      const code = daily.weather_code?.[idx] ?? 0;
      return {
        date: timeStr,
        dayName: idx === 0 ? "Today" : dayNames[d.getDay()],
        maxTemp: Math.round(daily.temperature_2m_max?.[idx] ?? 30),
        minTemp: Math.round(daily.temperature_2m_min?.[idx] ?? 20),
        condition: mapWeatherCode(code, true).text,
        rainProb: daily.precipitation_probability_max?.[idx] ?? 15,
      };
    });

    // 24-Hour Hourly Trend (next 24 hours from current index)
    const hourlyList: Array<{ time: string; temp: number; rainProb: number; condition: string }> = [];
    if (Array.isArray(hourly.time)) {
      const nowIsoHour = new Date().toISOString().slice(0, 13);
      let startIndex = hourly.time.findIndex((t: string) => t.startsWith(nowIsoHour));
      if (startIndex === -1) startIndex = 0;

      for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time.length); i++) {
        const timeStr = hourly.time[i];
        const hDate = new Date(timeStr);
        const hourLabel = hDate.toLocaleTimeString("en-IN", {
          hour: "numeric",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });
        const hCode = hourly.weather_code?.[i] ?? 0;
        const hHour = hDate.getHours();
        const hIsDay = hHour >= 6 && hHour < 19;

        hourlyList.push({
          time: i === startIndex ? "Now" : hourLabel,
          temp: Math.round(hourly.temperature_2m?.[i] ?? current.temperature_2m),
          rainProb: hourly.precipitation_probability?.[i] ?? 0,
          condition: mapWeatherCode(hCode, hIsDay).text,
        });
      }
    }

    // Agricultural advisory
    const advisory = generateAgriculturalAdvisory(
      current.temperature_2m,
      current.relative_humidity_2m,
      rainProb,
      current.wind_speed_10m,
      current.precipitation || 0
    );

    const weatherData: WeatherData = {
      locationName: locationName || `${districtName}, ${stateName}`,
      state: stateName,
      district: districtName,
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      rainProbability: rainProb,
      precipitationMm: current.precipitation ?? 0,
      windSpeedKmh: Math.round(current.wind_speed_10m),
      windDirection: degToCompass(current.wind_direction_10m),
      uvIndex,
      conditionText: conditionInfo.text,
      conditionCode: conditionInfo.code,
      isDay,
      forecast,
      agriculturalAdvisory: advisory,
      hourly: hourlyList,
      sunrise: formatTime12h(daily.sunrise?.[0]),
      sunset: formatTime12h(daily.sunset?.[0]),
      lastUpdated: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }),
      pressureHpa: current.surface_pressure ? Math.round(current.surface_pressure) : undefined,
    };

    return NextResponse.json(
      {
        success: true,
        data: weatherData,
        coordinates: { lat: resolvedLat, lng: resolvedLng },
        timestamp: new Date().toISOString(),
        source: "Open-Meteo Realtime Satellite & Atmospheric Model (WMO Certified)",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch real-time weather.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lat = body.lat;
    const lng = body.lng;
    const district = body.district;
    const state = body.state;
    const q = body.q;

    // Delegate to GET handler using query string
    const params = new URLSearchParams();
    if (lat !== undefined) params.set("lat", String(lat));
    if (lng !== undefined) params.set("lng", String(lng));
    if (district) params.set("district", district);
    if (state) params.set("state", state);
    if (q) params.set("q", q);

    const getReq = new NextRequest(`${req.nextUrl.origin}/api/weather?${params.toString()}`);
    return GET(getReq);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Invalid POST request body" },
      { status: 400 }
    );
  }
}
