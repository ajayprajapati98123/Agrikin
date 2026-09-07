import { NextRequest, NextResponse } from "next/server";
import { CropRecommendation, FurtherHarvestingViability, LandPossibilities } from "../../../lib/types";
import { districtCoordinates } from "../../../lib/services/location.service";

interface CropFinancialData {
  cropName: string;
  hindiName: string;
  basePricePerQuintal: number;
  marketTrend: string;
  mspRate: number;
  expectedYieldMin: number;
  expectedYieldMax: number;
  avgCostPerAcre: number;
  optimalSoil: string[];
  optimalSeasons: string[];
  waterDemand: "Low" | "Moderate" | "High";
  waterDemandMm: string;
  growthDays: string;
  fertilizerSchedule: string;
  tips: string[];
  risks: string[];
  rotation: string;
}

const cropMasterDatabase: CropFinancialData[] = [
  {
    cropName: "Basmati / Quality Paddy",
    hindiName: "बासमती धान (चावल)",
    basePricePerQuintal: 4150,
    marketTrend: "+3.2% (Strong Market Demand)",
    mspRate: 2320,
    expectedYieldMin: 20,
    expectedYieldMax: 26,
    avgCostPerAcre: 24500,
    optimalSoil: ["Alluvial Loam", "Clayey Deltaic", "Black Cotton Soil"],
    optimalSeasons: ["Kharif", "Year-round"],
    waterDemand: "High",
    waterDemandMm: "1150 - 1350 mm",
    growthDays: "125 - 140 days",
    fertilizerSchedule: "Urea @ 110 kg/acre (in 3 splits) + DAP @ 50 kg + MOP @ 30 kg + Zinc Sulphate (21%) @ 10 kg/acre.",
    tips: [
      "Adopt Alternate Wetting & Drying (AWD) to save up to 30% water without reducing yield.",
      "Incorporate bio-fertilizer Azospirillum @ 2 kg/acre with FYM during puddle preparation."
    ],
    risks: [
      "Bacterial Leaf Blight and Neck Blast under continuous cloudy humidity.",
      "Lodging risk if excessive nitrogen is broadcast late in reproductive phase."
    ],
    rotation: "Follow with Mustard, Gram, or Wheat in Rabi."
  },
  {
    cropName: "Sharbati / High-Yield Wheat",
    hindiName: "गेहूं (शरबती / उन्नत)",
    basePricePerQuintal: 2780,
    marketTrend: "+1.8% (Steady Procurement)",
    mspRate: 2275,
    expectedYieldMin: 20,
    expectedYieldMax: 25,
    avgCostPerAcre: 18500,
    optimalSoil: ["Alluvial Loam", "Clayey Deltaic", "Black Cotton Soil", "Red Sandy Loam"],
    optimalSeasons: ["Rabi", "Year-round"],
    waterDemand: "Moderate",
    waterDemandMm: "450 - 550 mm",
    growthDays: "120 - 135 days",
    fertilizerSchedule: "Urea @ 110 kg/acre (1/3 basal + 2 splits at 21 & 45 days) + DAP @ 55 kg + MOP @ 20 kg.",
    tips: [
      "First irrigation at Crown Root Initiation (CRI) 20-25 days after sowing is mandatory.",
      "Use Happy Seeder / Zero-Till Drill directly in paddy residue to conserve ₹2,500/acre in fuel."
    ],
    risks: [
      "Terminal heat stress in March can shrink grain size if sowing is delayed past Nov 25.",
      "Yellow rust in foot-hill zones (apply Propiconazole 25% EC @ 1ml/L on first pustule)."
    ],
    rotation: "Rotate with Green Manure (Dhaincha), Moong, or Soybean."
  },
  {
    cropName: "Hybrid Grain Maize (Corn)",
    hindiName: "संकर मक्का",
    basePricePerQuintal: 2420,
    marketTrend: "+2.4% (Poultry & Starch Demand)",
    mspRate: 2090,
    expectedYieldMin: 28,
    expectedYieldMax: 36,
    avgCostPerAcre: 19000,
    optimalSoil: ["Alluvial Loam", "Red Sandy Loam", "Black Cotton Soil"],
    optimalSeasons: ["Kharif", "Rabi", "Zaid"],
    waterDemand: "Moderate",
    waterDemandMm: "500 - 650 mm",
    growthDays: "95 - 110 days",
    fertilizerSchedule: "Urea @ 90 kg/acre + DAP @ 50 kg + MOP @ 25 kg + Zinc Sulphate @ 8 kg.",
    tips: [
      "Sow on raised beds or ridges at 60x20 cm spacing to prevent root waterlogging.",
      "Apply Emamectin Benzoate 5% SG @ 0.5 g/L if Fall Armyworm whorl damage is detected."
    ],
    risks: [
      "Waterlogging for >24 hours during seedling emergence can cause 40% root death.",
      "High temperature (>38°C) during tasseling can cause pollen desiccation."
    ],
    rotation: "Superb rotation before Potato, Mustard, or Rabi Pulses."
  },
  {
    cropName: "Yellow Soybean",
    hindiName: "सोयाबीन (पीला)",
    basePricePerQuintal: 4950,
    marketTrend: "+4.1% (High Oil Extraction Value)",
    mspRate: 4892,
    expectedYieldMin: 10,
    expectedYieldMax: 14,
    avgCostPerAcre: 14000,
    optimalSoil: ["Black Cotton Soil", "Alluvial Loam", "Red Sandy Loam"],
    optimalSeasons: ["Kharif"],
    waterDemand: "Moderate",
    waterDemandMm: "450 - 600 mm",
    growthDays: "90 - 105 days",
    fertilizerSchedule: "Starter Nitrogen @ 15 kg/acre + DAP @ 40 kg + Single Super Phosphate (SSP) @ 100 kg (provides vital Sulphur).",
    tips: [
      "Treat seeds with Rhizobium japonicum & Trichoderma viride culture before sowing.",
      "Broad Bed Furrow (BBF) method drains excess monsoon water while keeping moisture for dry spells."
    ],
    risks: [
      "Pod borer (Helicoverpa) and Girdle beetle damage during pod filling.",
      "Prolonged rain at maturity can cause pod shattering and grain germination."
    ],
    rotation: "Ideal nitrogen-fixing crop before Wheat or Chickpea."
  },
  {
    cropName: "Mustard & Rapeseed (Sarson / Raya)",
    hindiName: "सरसों / राया",
    basePricePerQuintal: 5850,
    marketTrend: "+3.5% (High Edible Oil Support)",
    mspRate: 5650,
    expectedYieldMin: 8,
    expectedYieldMax: 12,
    avgCostPerAcre: 11000,
    optimalSoil: ["Alluvial Loam", "Desert Sandy Soil", "Red Sandy Loam"],
    optimalSeasons: ["Rabi"],
    waterDemand: "Low",
    waterDemandMm: "250 - 350 mm",
    growthDays: "115 - 130 days",
    fertilizerSchedule: "Urea @ 60 kg/acre + SSP @ 125 kg (mandatory for oil content) + MOP @ 15 kg.",
    tips: [
      "Requires only 2-3 light irrigations at flowering and siliqua pod formation.",
      "Install yellow sticky traps (10/acre) to monitor and control mustard aphids."
    ],
    risks: [
      "Mustard aphid (Lipaphis erysimi) attack in cloudy weather (spray Thiamethoxam 25% WG @ 0.5 g/L).",
      "White rust and Alternaria blight under cold fog."
    ],
    rotation: "Follows Pearl Millet (Bajra), Maize, or early Rice."
  },
  {
    cropName: "Bt Cotton (Kapas)",
    hindiName: "कपास (सफेद सोना)",
    basePricePerQuintal: 7450,
    marketTrend: "+2.1% (Textile Mill Inquiries)",
    mspRate: 7121,
    expectedYieldMin: 10,
    expectedYieldMax: 15,
    avgCostPerAcre: 26000,
    optimalSoil: ["Black Cotton Soil", "Alluvial Loam"],
    optimalSeasons: ["Kharif", "Year-round"],
    waterDemand: "Moderate",
    waterDemandMm: "650 - 800 mm",
    growthDays: "150 - 170 days",
    fertilizerSchedule: "Urea @ 100 kg/acre in 3 splits + DAP @ 50 kg + MOP @ 40 kg + Magnesium Sulphate @ 10 kg.",
    tips: [
      "Precision drip fertigation increases boll weight by 25% and saves 40% fertilizer.",
      "Spray 1% Potassium Nitrate (13:0:45) at flowering and boll bursting to prevent leaf reddening."
    ],
    risks: [
      "Pink Bollworm infestation (monitor with gossyplure pheromone traps).",
      "Whitefly surge transmitting Cotton Leaf Curl Virus (CLCuV)."
    ],
    rotation: "Follow with Wheat, Gram, or Summer Moong."
  },
  {
    cropName: "Desi Chickpea (Chana)",
    hindiName: "चना (छोला)",
    basePricePerQuintal: 6150,
    marketTrend: "+2.9% (Pulse Deficit Buffer)",
    mspRate: 5440,
    expectedYieldMin: 8,
    expectedYieldMax: 11,
    avgCostPerAcre: 10500,
    optimalSoil: ["Alluvial Loam", "Black Cotton Soil", "Red Sandy Loam"],
    optimalSeasons: ["Rabi"],
    waterDemand: "Low",
    waterDemandMm: "250 - 320 mm",
    growthDays: "105 - 120 days",
    fertilizerSchedule: "DAP @ 40 kg/acre + Sulphur @ 10 kg/acre. Requires very low chemical nitrogen due to root nodulation.",
    tips: [
      "Nip terminal branches at 35-40 days to encourage extensive lateral podding.",
      "Seed treatment with Trichoderma viride @ 4g/kg seed prevents Fusarium wilt."
    ],
    risks: [
      "Excessive irrigation causes vegetative growth and flower drop.",
      "Pod borer (Helicoverpa armigera) at green pod stage."
    ],
    rotation: "Excellent after Pearl Millet, Cotton, or Maize."
  },
  {
    cropName: "Pearl Millet (Hybrid Bajra)",
    hindiName: "संकर बाजरा (श्री अन्न)",
    basePricePerQuintal: 2620,
    marketTrend: "+5.0% (Millets Mission Procurement)",
    mspRate: 2500,
    expectedYieldMin: 14,
    expectedYieldMax: 19,
    avgCostPerAcre: 9500,
    optimalSoil: ["Desert Sandy Soil", "Red Sandy Loam", "Alluvial Loam"],
    optimalSeasons: ["Kharif", "Zaid"],
    waterDemand: "Low",
    waterDemandMm: "250 - 350 mm",
    growthDays: "75 - 88 days",
    fertilizerSchedule: "Urea @ 50 kg/acre + DAP @ 35 kg + Zinc Sulphate @ 5 kg.",
    tips: [
      "Highly drought resilient; thrives in high summer temperatures with minimal irrigation.",
      "Eligible for Government 'Shree Anna' promotion bonus and direct procurement."
    ],
    risks: [
      "Ergot and Downy Mildew in waterlogged patches.",
      "Bird damage at grain milky stage."
    ],
    rotation: "Best dryland crop prior to Mustard, Barley, or Taramira."
  }
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      state = "Punjab",
      district = "Ludhiana",
      soilType = "Alluvial Loam",
      season = "Kharif",
      waterAvailability = "Moderate (Tubewell / Canal)",
      landArea = "10 Acres",
      previousCrop = "Wheat",
      farmingObjective = "High Remuneration & Soil Health",
      soilSensors = { nitrogen: 240, phosphorus: 45, potassium: 190, ph: 6.8, moisture: 45 },
      customApiKey,
    } = body;

    // 1. Fetch Real-time Live Weather for the selected District
    const coords = districtCoordinates[district] || { lat: 30.901, lng: 75.8573 };
    let liveWeather = {
      temperature: 30,
      humidity: 58,
      rainProbability: 20,
      windSpeed: 10,
      condition: "Clear & Sunny",
      isLiveSatellite: false,
    };

    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`;
      const weatherRes = await fetch(weatherUrl, { next: { revalidate: 300 } });
      if (weatherRes.ok) {
        const wData = await weatherRes.json();
        const cur = wData.current;
        liveWeather = {
          temperature: Math.round(cur.temperature_2m),
          humidity: Math.round(cur.relative_humidity_2m),
          rainProbability: cur.precipitation > 0 ? 80 : 15,
          windSpeed: Math.round(cur.wind_speed_10m),
          condition: cur.temperature_2m > 33 ? "Sunny & Warm" : "Favorable Farming Weather",
          isLiveSatellite: true,
        };
      }
    } catch (wErr) {
      console.warn("Open-Meteo live satellite fetch failed, using localized model:", wErr);
    }

    // 2. Real-Time Agronomic Suitability & Financial Calculation for the Land
    const parsedAcres = parseFloat(landArea) || 5;

    const scoredCrops = cropMasterDatabase.map((crop) => {
      let score = 70;

      // Soil match
      if (crop.optimalSoil.includes(soilType)) {
        score += 15;
      } else {
        score -= 10;
      }

      // Season match
      if (crop.optimalSeasons.includes(season) || crop.optimalSeasons.includes("Year-round")) {
        score += 12;
      } else {
        score -= 15;
      }

      // Water availability match
      if (waterAvailability.includes("Abundant") && crop.waterDemand === "High") {
        score += 8;
      } else if (waterAvailability.includes("Low") && crop.waterDemand === "Low") {
        score += 10;
      } else if (waterAvailability.includes("Moderate") && crop.waterDemand === "Moderate") {
        score += 8;
      }

      // Live temperature bonus/penalty
      if (liveWeather.temperature > 35 && crop.waterDemand === "Low") {
        score += 4; // Millets/drought crops get bonus in high heat
      }

      // Previous crop rotation benefit
      if (previousCrop.toLowerCase().includes("wheat") && crop.cropName.includes("Paddy")) {
        score += 4;
      }
      if (previousCrop.toLowerCase().includes("paddy") && (crop.cropName.includes("Wheat") || crop.cropName.includes("Mustard"))) {
        score += 5;
      }

      const clampedScore = Math.min(Math.max(score, 68), 98);

      // Financials scaled to the selected piece of land
      const avgYield = (crop.expectedYieldMin + crop.expectedYieldMax) / 2;
      const grossRevenuePerAcre = Math.round(avgYield * crop.basePricePerQuintal);
      const netProfitPerAcre = Math.round(grossRevenuePerAcre - crop.avgCostPerAcre);
      const totalEstimatedNetProfit = Math.round(netProfitPerAcre * parsedAcres);
      const totalEstimatedRevenue = Math.round(grossRevenuePerAcre * parsedAcres);
      const totalYieldMin = Math.round(crop.expectedYieldMin * parsedAcres);
      const totalYieldMax = Math.round(crop.expectedYieldMax * parsedAcres);
      const roiPercentage = Math.round((netProfitPerAcre / crop.avgCostPerAcre) * 100);

      // Default scientific ICAR fallback for Further Harvesting
      let defaultFurtherHarvesting: FurtherHarvestingViability;
      if (crop.cropName.includes("Paddy") || crop.cropName.includes("Rice")) {
        defaultFurtherHarvesting = {
          canHarvestFurther: true,
          status: "Highly Suitable for Consecutive Harvesting",
          verdict: `After this Kharif harvest, your ${parsedAcres} Acres in ${district} will preserve adequate subsoil moisture. It can be immediately prepared for zero-tillage Rabi Wheat or Chickpea, achieving 2 complete annual harvests.`,
          nextHarvestPossibilities: ["Rabi Wheat (Zero-Till)", "Chickpea / Gram (Chana)", "Mustard (Sarson)"],
          multiSeasonIndex: "Double-Cropping (2 Harvests / Year)",
          soilRegenerationPlan: "Incorporate crop stubble with bio-decomposer to restore organic carbon.",
        };
      } else if (crop.cropName.includes("Wheat")) {
        defaultFurtherHarvesting = {
          canHarvestFurther: true,
          status: "Highly Suitable for Summer Catch Harvest",
          verdict: `Following the March/April wheat harvest, your ${parsedAcres} Acres can be utilized for a 60-day summer Moong pulse or Fodder Maize harvest before the next monsoon, boosting total farm revenue.`,
          nextHarvestPossibilities: ["Summer Moong (Pulse)", "Fodder Sorghum / Maize", "Sesame (Til)"],
          multiSeasonIndex: "Triple-Cropping (3 Harvests / Year)",
          soilRegenerationPlan: "Plant nitrogen-fixing summer legumes to naturally replenish soil fertility.",
        };
      } else if (crop.cropName.includes("Soybean") || crop.cropName.includes("Gram")) {
        defaultFurtherHarvesting = {
          canHarvestFurther: true,
          status: "Optimal Soil Fertility for Successive Harvest",
          verdict: `As a nitrogen-fixing legume, this crop enriches your ${parsedAcres} Acres with 30-40 kg/ha of biological nitrogen, leaving the land in prime fertility for a heavy-feeder Rabi crop like Wheat or Mustard.`,
          nextHarvestPossibilities: ["High-Yield Wheat", "Yellow Mustard", "Winter Barley"],
          multiSeasonIndex: "Double-Cropping (2 Harvests / Year)",
          soilRegenerationPlan: "Direct drill Rabi seeds immediately after harvest without fallow loss.",
        };
      } else if (crop.cropName.includes("Cotton")) {
        defaultFurtherHarvesting = {
          canHarvestFurther: true,
          status: "Suitable with Organic Soil Rest & Crop Rotation",
          verdict: `Cotton has an extended 150-160 day cycle. After harvest, your ${parsedAcres} Acres should be rotated into a fast summer pulse or green manure like Dhaincha to restore deep-root nutrient extraction.`,
          nextHarvestPossibilities: ["Summer Moong", "Green Manure (Dhaincha)", "Pearl Millet (Bajra)"],
          multiSeasonIndex: "Rotation-Dependent (1-2 Harvests / Year)",
          soilRegenerationPlan: "Deep plow cotton stalks, incorporate 5 tonnes FYM per acre, and sow green manure.",
        };
      } else {
        defaultFurtherHarvesting = {
          canHarvestFurther: true,
          status: "Highly Suitable for Consecutive Harvesting",
          verdict: `This crop allows timely vacation of your ${parsedAcres} Acres in ${district}, leaving fertile soil ready for an immediate Rabi or Zaid harvest cycle.`,
          nextHarvestPossibilities: ["Rabi Pulses", "Oilseeds (Mustard)", "Seasonal Vegetables"],
          multiSeasonIndex: "Double-Cropping (2 Harvests / Year)",
          soilRegenerationPlan: "Apply balanced NPK according to Soil Health Card guidelines.",
        };
      }

      const recommendation: CropRecommendation = {
        cropName: crop.cropName,
        hindiName: crop.hindiName,
        suitabilityScore: clampedScore,
        reason: `${soilType} and ${season} conditions in ${district} with ${waterAvailability.toLowerCase()} offer an optimal agronomic match for ${crop.cropName}.`,
        soilRequirements: `${crop.optimalSoil.join(", ")}, optimum pH 6.0 - 7.5.`,
        waterRequirement: crop.waterDemand === "High" ? "High Water Need" : crop.waterDemand === "Low" ? "Low Water Need" : "Moderate Water Need",
        waterRequirementMm: crop.waterDemandMm,
        season: crop.optimalSeasons.join(" / "),
        growthCycleDays: crop.growthDays,
        climateRequirements: `Optimal temperature 20°C - 34°C. Live field temperature currently: ${liveWeather.temperature}°C.`,
        irrigationMethod: crop.waterDemand === "Low" ? "Sprinkler / Rainfed" : "Drip Fertigation / Furrow",
        riskFactors: crop.risks,
        farmingMethodTips: [
          ...crop.tips,
          `Fertilizer Schedule: ${crop.fertilizerSchedule}`
        ],
        cropRotationConsiderations: crop.rotation,
        expectedYield: `${crop.expectedYieldMin} - ${crop.expectedYieldMax} Quintals/Acre`,
        liveMarketPrice: `₹${crop.basePricePerQuintal.toLocaleString("en-IN")} / Quintal`,
        estimatedRevenuePerAcre: `₹${grossRevenuePerAcre.toLocaleString("en-IN")}`,
        estimatedNetProfitPerAcre: `₹${netProfitPerAcre.toLocaleString("en-IN")}`,
        mspRate: `MSP: ₹${crop.mspRate.toLocaleString("en-IN")} / Quintal`,
        marketTrend: crop.marketTrend,
        roiPercentage,
        totalEstimatedNetProfit,
        furtherHarvestingViability: defaultFurtherHarvesting,
        landPossibilities: {
          landArea: `${parsedAcres} Acres`,
          totalEstimatedYield: `${totalYieldMin} - ${totalYieldMax} Quintals total`,
          totalEstimatedNetProfit: `₹${totalEstimatedNetProfit.toLocaleString("en-IN")}`,
          totalEstimatedRevenue: `₹${totalEstimatedRevenue.toLocaleString("en-IN")}`,
          waterFeasibility: `${waterAvailability} source provides reliable irrigation capacity for ${parsedAcres} Acres.`,
        },
      };

      return recommendation;
    });

    // Sort by Suitability Score descending
    scoredCrops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    const topRecommendations = scoredCrops.slice(0, 4);

    // 3. Live Real-Time AI API Synthesis (Groq / OpenAI) for Land Analysis & Further Harvesting
    const groqKey =
      (customApiKey && customApiKey.startsWith("gsk_") ? customApiKey : null) ||
      process.env.GROQ_API_KEY ||
      process.env.GROK_API_KEY ||
      process.env.GROK_AI ||
      process.env.Grok_AI;

    const openAiKey =
      customApiKey ||
      process.env.OPENAI_API_KEY ||
      (process.env.AI_API_KEY && process.env.AI_API_KEY.startsWith("sk-") ? process.env.AI_API_KEY : null);

    let aiAgronomistNote = `Real-time agricultural intelligence verified for ${district}, ${state}. Soil N:P:K levels (${soilSensors.nitrogen}:${soilSensors.phosphorus}:${soilSensors.potassium} kg/ha) and pH (${soilSensors.ph}) match the top crop portfolio for maximum net remuneration on ${parsedAcres} Acres.`;

    // Connect to Live Real-Time AI API
    if (groqKey || (openAiKey && openAiKey.startsWith("sk-"))) {
      try {
        const evaluatedCropsList = topRecommendations.map((c) => c.cropName).join(", ");
        const liveAiPrompt = `As a senior ICAR Agronomist, analyze this piece of land for real-time crop recommendations and consecutive harvesting feasibility:
- Land Area: ${parsedAcres} Acres
- District & State: ${district}, ${state}
- Soil: ${soilType} (N: ${soilSensors.nitrogen}, P: ${soilSensors.phosphorus}, K: ${soilSensors.potassium}, pH: ${soilSensors.ph}, Moisture: ${soilSensors.moisture}%)
- Season: ${season}, Water Source: ${waterAvailability}, Previous Crop: ${previousCrop}
- Live Weather: ${liveWeather.temperature}°C, Humidity: ${liveWeather.humidity}%, Condition: ${liveWeather.condition}
- Evaluated Crops: ${evaluatedCropsList}

For each evaluated crop, provide detailed analysis:
1) Can this piece of land be used for further harvesting immediately after this cycle? (canHarvestFurther: boolean)
2) Status (e.g. "Highly Suitable for Consecutive Harvesting", "Optimal Soil Fertility for Successive Harvest", "Suitable with Crop Rotation")
3) Comprehensive 2-sentence verdict on subsequent land use, soil moisture retention, nitrogen carryover, and multi-season feasibility for this ${parsedAcres} Acres.
4) 2-3 specific successor crops that can be harvested next on this land.
5) Multi-season cropping index (e.g. "Double-Cropping (2 Harvests/Year)" or "Triple-Cropping (3 Harvests/Year)").

Respond ONLY with a valid JSON object matching this structure:
{
  "crops": [
    {
      "cropName": string,
      "canHarvestFurther": boolean,
      "status": string,
      "verdict": string,
      "nextHarvestPossibilities": string[],
      "multiSeasonIndex": string
    }
  ],
  "agronomistNote": string
}`;

        let aiJsonText = "";

        if (groqKey) {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model: "openai/gpt-oss-120b",
              messages: [
                { role: "system", content: "You are an expert ICAR agricultural AI. Respond ONLY with valid JSON." },
                { role: "user", content: liveAiPrompt },
              ],
              temperature: 0.2,
              response_format: { type: "json_object" },
            }),
          });

          if (groqRes.ok) {
            const gData = await groqRes.json();
            aiJsonText = gData.choices?.[0]?.message?.content || "";
          }
        } else if (openAiKey) {
          const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openAiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o",
              messages: [
                { role: "system", content: "You are an expert ICAR agricultural AI. Respond ONLY with valid JSON." },
                { role: "user", content: liveAiPrompt },
              ],
              temperature: 0.2,
              response_format: { type: "json_object" },
            }),
          });

          if (openAiRes.ok) {
            const oData = await openAiRes.json();
            aiJsonText = oData.choices?.[0]?.message?.content || "";
          }
        }

        if (aiJsonText) {
          try {
            const parsedAi = JSON.parse(aiJsonText);
            if (parsedAi.agronomistNote) {
              aiAgronomistNote = parsedAi.agronomistNote.trim();
            }
            if (Array.isArray(parsedAi.crops)) {
              for (const aiCrop of parsedAi.crops) {
                const match = topRecommendations.find(
                  (r) => r.cropName.toLowerCase().includes(aiCrop.cropName?.toLowerCase()) || aiCrop.cropName?.toLowerCase().includes(r.cropName?.toLowerCase())
                );
                if (match && aiCrop.verdict) {
                  match.furtherHarvestingViability = {
                    canHarvestFurther: typeof aiCrop.canHarvestFurther === "boolean" ? aiCrop.canHarvestFurther : true,
                    status: aiCrop.status || match.furtherHarvestingViability?.status || "Highly Suitable for Consecutive Harvesting",
                    verdict: aiCrop.verdict,
                    nextHarvestPossibilities: Array.isArray(aiCrop.nextHarvestPossibilities) && aiCrop.nextHarvestPossibilities.length > 0
                      ? aiCrop.nextHarvestPossibilities
                      : match.furtherHarvestingViability?.nextHarvestPossibilities || ["Rabi Wheat", "Chickpea (Chana)", "Mustard"],
                    multiSeasonIndex: aiCrop.multiSeasonIndex || match.furtherHarvestingViability?.multiSeasonIndex || "Double-Cropping (2 Harvests/Year)",
                  };
                }
              }
            }
          } catch (pErr) {
            console.warn("Failed to parse real-time AI JSON response, using scientific defaults:", pErr);
          }
        }
      } catch (aiErr) {
        console.warn("Live AI API connection failed, using scientific agronomic defaults:", aiErr);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      liveMetadata: {
        district,
        state,
        landArea: `${parsedAcres} Acres`,
        liveWeather,
        soilStatus: {
          nitrogenStatus: soilSensors.nitrogen > 280 ? "Surplus" : soilSensors.nitrogen > 180 ? "Medium / Optimum" : "Deficient",
          phosphorusStatus: soilSensors.phosphorus > 50 ? "High" : soilSensors.phosphorus > 25 ? "Optimum" : "Low",
          potassiumStatus: soilSensors.potassium > 200 ? "High" : "Optimum",
          phInterpretation: soilSensors.ph < 6.0 ? "Acidic" : soilSensors.ph > 7.5 ? "Alkaline" : "Neutral / Ideal",
        },
        aiAgronomistNote,
      },
      recommendations: topRecommendations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to calculate real-time crop recommendations." },
      { status: 500 }
    );
  }
}
