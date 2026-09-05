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
  conversationId?: string;
  text: string;
  imageUrl?: string;
  attachmentType?: "produce_sample" | "soil_report" | "weighing_slip" | "crop_disease" | "general";
  timestamp: string;
  createdAt?: string;
  read: boolean;
}

export type KrishiEntityType = "INDIVIDUAL" | "INSTITUTIONAL";
export type KrishiRole = "BUYER" | "SELLER" | "farmer" | "buyer" | "seller" | "input_seller";
export type KrishiCategory =
  | "Farmer"
  | "Trader"
  | "FPO"
  | "Processor"
  | "Retailer"
  | "Wholesaler"
  | "Input Supplier"
  | "Exporter"
  | "Other";

export interface IndianAddress {
  line1: string;
  line2?: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  pincode: string;
}

export interface KrishiConnectProfile {
  id: string;
  userId?: string;
  entityType: KrishiEntityType;
  registrationType: "BUYER" | "SELLER";
  role: "farmer" | "buyer" | "seller";
  category: KrishiCategory;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  guardianRelation?: "S/o" | "D/o" | "W/o";
  guardianName?: string;
  dob?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  email: string;
  phone: string;
  permanentAddress: IndianAddress;
  currentAddressSameAsPermanent: boolean;
  currentAddress?: IndianAddress;
  crops: string[];
  product: string;
  quantity: string;
  unit?: string;
  price: string;
  availability: string;
  cropsRequired?: string[];
  primaryCrop?: string;
  quantityRequired?: string;
  priceRange?: string;
  timeline?: string;
  experience: string;
  bio: string;
  photo: string;
  radiusKm?: number;
  coordinates: { lat: number; lng: number };
  approxLocation: string;
  state: string;
  district: string;
  tehsil?: string;
  village?: string;
  verified: boolean;
  distanceKm?: number;
  rating?: number;
  totalTrades?: number;
  createdAt: string;
}

export type ConnectionStatus = "NOT_CONNECTED" | "REQUEST_SENT" | "CONNECTED" | "BLOCKED";

export interface ConnectionRecord {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface KrishiConversation {
  id: string;
  participantIds: string[];
  peer: KrishiConnectProfile;
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}

export interface DetectionResult {
  id: string;
  category: "crop" | "produce" | "soil";
  detectionName: string;
  confidence: number;
  severity: "Low" | "Moderate" | "Severe" | "None";
  observedSymptoms: string[];
  possibleCauses: string[];
  recommendedActions: string[];
  preventiveMeasures: string[];
  expertConsultation: string;
  scientificDisclaimer: string;
  analyzedAt: string;
  imageUrls: string[];
  cropName?: string;
  diagnosis?: string;
  possibleDisease?: string[];
  possiblePest?: string[];
  possibleDeficiency?: string[];
  expertAdvice?: string;
  disclaimer?: string;
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
  hourly?: Array<{
    time: string;
    temp: number;
    rainProb: number;
    condition: string;
  }>;
  sunrise?: string;
  sunset?: string;
  lastUpdated?: string;
  pressureHpa?: number;
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
