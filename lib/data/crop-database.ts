export interface CropDetail {
  id: string;
  name: string;
  hindiName: string;
  season: "Kharif" | "Rabi" | "Zaid" | "Year-round";
  category: "Cereal" | "Oilseed" | "Cash Crop" | "Pulse" | "Millet";
  recommendedIrrigation: string;
  waterRequirementMm: string;
  durationDays: string;
  optimalTemperature: string;
  soilSuitability: string[];
  statesGrowing: string[];
  farmingMethodGuide: {
    seedVariety: string;
    plantingMethod: string;
    waterManagement: string;
    nutrientManagement: string;
    weedManagement: string;
    pestMonitoring: string;
    mechanization: string;
    harvestStorage: string;
  };
}

export const cropsDatabase: CropDetail[] = [
  {
    id: "rice",
    name: "Rice (Paddy)",
    hindiName: "धान / चावल",
    season: "Kharif",
    category: "Cereal",
    recommendedIrrigation: "Alternate Wetting and Drying (AWD) / Drip for Aerobic Rice",
    waterRequirementMm: "1100 - 1400 mm",
    durationDays: "115 - 145 days",
    optimalTemperature: "22°C - 32°C",
    soilSuitability: ["Clay Loam", "Silty Clay", "Alluvial"],
    statesGrowing: ["Punjab", "West Bengal", "Uttar Pradesh", "Andhra Pradesh", "Tamil Nadu", "Telangana"],
    farmingMethodGuide: {
      seedVariety: "High-yielding Basmati (PB 1121, PB 1509) or Non-Basmati (MTU 1010, IR 64, Swarna Sub-1 for flood tolerance). Seed treatment with Carbendazim (2g/kg).",
      plantingMethod: "Direct Seeded Rice (DSR) using lucky seed drill or System of Rice Intensification (SRI) with single 12-day-old seedling per hill at 25x25cm spacing.",
      waterManagement: "Shift from continuous deep flooding to Alternate Wetting and Drying (AWD). Keep field moist but not deeply submerged during vegetative phase to save 30% water.",
      nutrientManagement: "NPK 120:60:40 kg/ha. Apply Zinc Sulphate 25 kg/ha basal. Top dress Nitrogen in 3 splits (transplanting, active tillering, panicle initiation).",
      weedManagement: "Pre-emergence Pretilachlor 50 EC @ 1.5 l/ha within 3 days of transplanting or Bispyribac Sodium 10 SC @ 200 ml/ha at 15-20 DAS for post-emergence broadleaf & grasses.",
      pestMonitoring: "Scout for Yellow Stem Borer, Brown Planthopper (BPH), and Bacterial Leaf Blight. Use Pheromone traps @ 10/ha and neem oil spray (1500 ppm).",
      mechanization: "Paddy transplanter for mechanized nursery planting; Combine harvester with straw management system (SMS) to eliminate stubble burning.",
      harvestStorage: "Harvest when 85% grains turn golden yellow (20-22% grain moisture). Sun dry down to 13-14% moisture before hermetic storage in Pusa bins."
    }
  },
  {
    id: "wheat",
    name: "Wheat",
    hindiName: "गेहूं",
    season: "Rabi",
    category: "Cereal",
    recommendedIrrigation: "Sprinkler Irrigation / Border Strip with CRI Stage timing",
    waterRequirementMm: "450 - 550 mm",
    durationDays: "120 - 140 days",
    optimalTemperature: "15°C - 24°C",
    soilSuitability: ["Well-drained Loam", "Clay Loam", "Alluvial"],
    statesGrowing: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan"],
    farmingMethodGuide: {
      seedVariety: "HD 2967, HD 3086, DBW 187 (Karan Vandana), DBW 222, and Sharbati C-306. Seed treatment with Trichoderma viride @ 5g/kg or Carboxin @ 2g/kg.",
      plantingMethod: "Happy Seeder / Super Seeder sowing directly into retained paddy residue (zero tillage) saves fuel, retains soil moisture, and suppresses early weeds.",
      waterManagement: "Critical irrigation stages: 1. Crown Root Initiation (CRI at 21 DAS - critical!), 2. Tillering (40-45 DAS), 3. Late Jointing (60-65 DAS), 4. Flowering (80-85 DAS), 5. Milking (100-105 DAS).",
      nutrientManagement: "Recommended NPK 150:60:40 kg/ha. Apply half N, all P and K at sowing; remaining N split at 1st and 2nd irrigation. Foliar spray of 2% Urea at heading.",
      weedManagement: "Sulfosulfuron 75% + Metsulfuron 5% WG @ 32g/ha or Clodinafop-propargyl @ 60g/ha at 30-35 DAS for control of Phalaris minor (Gulli Danda) and broadleaf weeds.",
      pestMonitoring: "Monitor for Yellow/Stripe Rust (Puccinia striiformis) and Aphids. Spray Tebuconazole 25.9% EC @ 1ml/liter upon initial yellow pustule spotting.",
      mechanization: "Super Seeder for direct drilling, tractor-mounted boom sprayers for uniform foliar fungicide/micronutrient application.",
      harvestStorage: "Harvest when grains become hard and straw turns dry and brittle (moisture <12%). Store in airtight steel silos with neem leaves to prevent storage weevils."
    }
  },
  {
    id: "maize",
    name: "Maize (Corn)",
    hindiName: "मक्का",
    season: "Kharif",
    category: "Cereal",
    recommendedIrrigation: "Drip Irrigation / Furrow Irrigation",
    waterRequirementMm: "500 - 650 mm",
    durationDays: "90 - 110 days",
    optimalTemperature: "21°C - 30°C",
    soilSuitability: ["Deep Loam", "Well-drained Sandy Loam"],
    statesGrowing: ["Karnataka", "Madhya Pradesh", "Bihar", "Telangana", "Maharashtra", "Rajasthan"],
    farmingMethodGuide: {
      seedVariety: "Hybrids like Pioneer P3396, DKC 9108, PMH 1, Ganga 11. Seed treated with Thiamethoxam 30 FS (4ml/kg) to protect against early shoot fly.",
      plantingMethod: "Ridge and furrow sowing at 60cm row-to-row and 20cm plant-to-plant spacing to prevent waterlogging during monsoon downpours.",
      waterManagement: "Extremely sensitive to both waterlogging and drought. Critical watering stages: Tasseling and Silking. Drip fertigation yields highest water productivity.",
      nutrientManagement: "NPK 120:60:50 kg/ha. Apply 25kg/ha Zinc Sulphate. Side-dress Nitrogen at knee-high and silking stages.",
      weedManagement: "Pre-emergence Atrazine 50 WP @ 1.0 kg a.i./ha within 48 hours of sowing. Post-emergence Tembotrione 34.4% SC @ 120ml/ha at 15-20 DAS.",
      pestMonitoring: "High surveillance needed for Fall Armyworm (Spodoptera frugiperda). Install pheromone traps and spray Chlorantraniliprole 18.5 SC (0.4ml/L) or Emamectin Benzoate 5 SG (0.4g/L).",
      mechanization: "Pneumatic precision planter for uniform single-seed metering; Maize dehusker-sheller machines for rapid post-harvest threshing.",
      harvestStorage: "Harvest when husk leaves turn dry papery white and black layer forms at grain base. Dry cobs to 12% moisture before hermetic bag storage."
    }
  },
  {
    id: "soybean",
    name: "Soybean",
    hindiName: "सोयाबीन",
    season: "Kharif",
    category: "Oilseed",
    recommendedIrrigation: "Broad Bed Furrow (BBF) with Sprinkler backup",
    waterRequirementMm: "450 - 600 mm",
    durationDays: "90 - 105 days",
    optimalTemperature: "20°C - 30°C",
    soilSuitability: ["Black Cotton Soil", "Deep Clay Loam", "Alluvial"],
    statesGrowing: ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka", "Telangana"],
    farmingMethodGuide: {
      seedVariety: "JS 20-34, JS 20-98, NRC 127, KDS 726 (Phule Sangam). Treat seed with Bradyrhizobium japonicum culture and Trichoderma (10g/kg).",
      plantingMethod: "Broad Bed Furrow (BBF) system (beds 120cm wide with 30cm furrows) ensures excess rainwater drains off during floods and conserves moisture during dry spells.",
      waterManagement: "Critical stages: Pod initiation and seed filling. Sprinkler irrigation is ideal if monsoon dry spells exceed 12-15 days during flowering/pod development.",
      nutrientManagement: "NPK 20:60:40 kg/ha + 20 kg Sulphur/ha. Legume fixes its own atmospheric nitrogen through nodules; avoid excess chemical N.",
      weedManagement: "Pre-emergence Diclosulam 84 WDG @ 30g/ha within 48 hours, or post-emergence Imazethapyr 10 SL @ 1000ml/ha at 15-20 days after sowing.",
      pestMonitoring: "Girdle beetle, Spodoptera, and Semilooper. Spray Chlorantraniliprole 18.5 SC @ 0.3ml/L or Indoxacarb 14.5 SC @ 1ml/L at economic threshold levels.",
      mechanization: "Multi-crop planter with furrow openers; multi-crop thresher adjusted for low drum speed (350-400 rpm) to prevent seed coat cracking.",
      harvestStorage: "Harvest when 95% pods turn golden brown and leaves shed. Store at 9-10% moisture in cool, aerated warehouse away from direct floor contact."
    }
  },
  {
    id: "cotton",
    name: "Cotton",
    hindiName: "कपास",
    season: "Kharif",
    category: "Cash Crop",
    recommendedIrrigation: "Drip Irrigation with Subsurface option",
    waterRequirementMm: "700 - 900 mm",
    durationDays: "150 - 180 days",
    optimalTemperature: "21°C - 35°C",
    soilSuitability: ["Deep Black Cotton Soil", "Regur Soil", "Well-drained Loam"],
    statesGrowing: ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh", "Haryana", "Punjab"],
    farmingMethodGuide: {
      seedVariety: "Bt-Cotton hybrids (BG-II approved hybrids) adapted to local rainfall zone. Space at 90x60cm or High Density Planting System (HDPS) at 60x10cm.",
      plantingMethod: "Ridge and furrow method or drip bed planting. HDPS with compact varieties allows machine picking and shortens crop window.",
      waterManagement: "Drip irrigation at 0.6-0.8 ETc. Key stages: Square formation, flowering, and boll development. Cease irrigation 20 days prior to final boll opening.",
      nutrientManagement: "NPK 120:60:60 kg/ha. Apply Potassium in split doses to improve fiber strength and boll weight. Foliar spray of 2% DAP and 1% KNO3 during boll development.",
      weedManagement: "Pre-emergence Pendimethalin @ 1.0 kg a.i./ha followed by one inter-cultivation with power weeder at 30 and 60 DAS.",
      pestMonitoring: "Pink Bollworm (Pectinophora gossypiella) monitoring via delta pheromone traps (8/ha). Spray Emamectin Benzoate 5 SG or Profenofos 50 EC upon catching 8 moths/trap/night.",
      mechanization: "Tractor drawn cultivators for inter-row weed control; defoliant spraying (Dropp / Ethrel) prior to mechanical cotton picker harvesting.",
      harvestStorage: "Hand pick clean dry bolls in morning after dew dries. Store raw seed cotton (Kapas) in clean dry room free from dirt, plastic ropes, or foreign contaminants."
    }
  }
];
