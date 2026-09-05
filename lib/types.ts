export type Language = "en" | "hi";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  crops: string[];
  age: number;
  role: "farmer" | "buyer" | "seller";
  bio?: string;
  avatarUrl?: string;
  landArea?: string;
  experience?: string;
  createdAt: string;
}

export interface FarmerListing {
  id: string;
  name: string;
  role: "farmer" | "buyer" | "seller";
  state: string;
  district: string;
  approxLocation: string;
  coordinates: { lat: number; lng: number };
  crops: string[];
  product: string;
  quantity: string;
  price: string;
  availability: string;
  experience: string;
  bio: string;
  photo: string;
  verified: boolean;
  distanceKm?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  read: boolean;
}

export interface DetectionResult {
  id: string;
  category: "crop" | "produce" | "soil";
  detectionName: string;
  confidence: number;
  severity: "Low" | "Moderate" | "Severe";
  observedSymptoms: string[];
  possibleCauses: string[];
  recommendedActions: string[];
  preventiveMeasures: string[];
  expertConsultation: string;
  scientificDisclaimer: string;
  analyzedAt: string;
  imageUrls: string[];
}

export interface WeatherData {
  locationName: string;
  state: string;
  district: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  rainProbability: number;
  precipitationMm: number;
  windSpeedKmh: number;
  windDirection: string;
  uvIndex: number;
  conditionText: string;
  conditionCode: string;
  isDay: boolean;
  forecast: Array<{
    date: string;
    dayName: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    rainProb: number;
  }>;
  agriculturalAdvisory: {
    summary: string;
    irrigationAdvice: string;
    sprayingCondition: "Favorable" | "Unfavorable" | "Caution";
    pestRisk: "Low" | "Moderate" | "High";
    criticalWarning?: string;
  };
}

export interface CropRecommendation {
  cropName: string;
  hindiName: string;
  suitabilityScore: number;
  reason: string;
  soilRequirements: string;
  waterRequirement: string;
  waterRequirementMm?: string;
  season: string;
  growthCycleDays: string;
  climateRequirements: string;
  irrigationMethod: string;
  riskFactors: string[];
  farmingMethodTips: string[];
  cropRotationConsiderations: string;
  expectedYield?: string;
  liveMarketPrice?: string;
  estimatedRevenuePerAcre?: string;
  estimatedNetProfitPerAcre?: string;
  mspRate?: string;
  marketTrend?: string;
  roiPercentage?: number;
  totalEstimatedNetProfit?: number;
}

export interface GovernmentScheme {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  theme: string;
  tagline: string;
  icon: string;
  summary: string;
  financialSupport: string;
  eligibility: string[];
  documentsRequired: string[];
  stepByStepProcess: string[];
  officialUrl: string;
  applicationMode: string;
  keyBenefits: string[];
  monitoringDetails: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "connection" | "weather" | "detection" | "system";
  timestamp: string;
  read: boolean;
  link?: string;
}
