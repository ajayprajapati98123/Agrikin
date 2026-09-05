import {
  KrishiConnectProfile,
  ChatMessage,
  ConnectionRecord,
  ConnectionStatus,
  KrishiConversation,
} from "../types";
import { calculateDistanceKm } from "./location.service";
import { getDistrictCoordinates } from "../data/india-locations";

const STORAGE_KEY_PROFILES = "agrikin_krishi_profiles_v2";
const STORAGE_KEY_ACTIVE_PROFILE = "agrikin_krishi_active_profile";
const STORAGE_KEY_CONNECTIONS = "agrikin_krishi_connections_v2";
const STORAGE_KEY_BLOCKED = "agrikin_krishi_blocked_v2";
const STORAGE_KEY_REPORTS = "agrikin_krishi_reports_v2";
const STORAGE_KEY_MESSAGES_PREFIX = "agrikin_krishi_msgs_";

// Comprehensive realistic seed profiles representing both SELLERS (Farmers, FPOs, Suppliers) and BUYERS (Processors, Mandi Aggregators, Retailers)
export const initialKrishiProfiles: KrishiConnectProfile[] = [
  {
    id: "kc-seller-1",
    entityType: "INDIVIDUAL",
    registrationType: "SELLER",
    role: "farmer",
    category: "Farmer",
    name: "Gurpreet Singh Sandhu",
    firstName: "Gurpreet",
    middleName: "Singh",
    lastName: "Sandhu",
    guardianRelation: "S/o",
    guardianName: "Balwinder Singh Sandhu",
    dob: "1982-04-12",
    age: 44,
    gender: "Male",
    email: "gurpreet.sandhu@agrikin.in",
    phone: "+91 98141 23456",
    permanentAddress: {
      line1: "House No 42, Main Pind Road",
      line2: "Near Canal Bridge",
      state: "Punjab",
      district: "Ludhiana",
      tehsil: "Samrala",
      village: "Samrala Rural",
      pincode: "141114",
    },
    currentAddressSameAsPermanent: true,
    crops: ["Basmati Rice", "Sharbati Wheat", "Yellow Mustard"],
    product: "Organic 1121 Pusa Basmati Rice (Export Grade)",
    quantity: "350",
    unit: "Quintals",
    price: "₹4,350 / Quintal",
    availability: "Immediate Dispatch from Farm Gate",
    experience: "21 Years",
    bio: "Certified natural farming practitioner. Practicing laser leveling, bio-fertilizer inoculation, and direct seeded rice (DSR) to conserve groundwater in Punjab. Full harvest lot moisture tested under 12.5%.",
    photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
    radiusKm: 150,
    coordinates: { lat: 30.9010, lng: 75.8573 },
    approxLocation: "Samrala, Ludhiana",
    state: "Punjab",
    district: "Ludhiana",
    tehsil: "Samrala",
    village: "Samrala Rural",
    verified: true,
    distanceKm: 4.8,
    rating: 4.9,
    totalTrades: 38,
    createdAt: "2026-01-10T08:30:00Z",
  },
  {
    id: "kc-buyer-1",
    entityType: "INSTITUTIONAL",
    registrationType: "BUYER",
    role: "buyer",
    category: "Processor",
    name: "Golden Grains Agro Foods Pvt Ltd",
    firstName: "Vikram",
    lastName: "Chadha",
    guardianRelation: "S/o",
    guardianName: "O. P. Chadha",
    dob: "1980-09-18",
    age: 46,
    gender: "Male",
    email: "procurement@goldengrains.in",
    phone: "+91 98720 88990",
    permanentAddress: {
      line1: "Plot 18-B, Focal Point Industrial Zone",
      line2: "Phase 5",
      state: "Punjab",
      district: "Ludhiana",
      tehsil: "Ludhiana East",
      village: "Focal Point",
      pincode: "141010",
    },
    currentAddressSameAsPermanent: true,
    crops: ["Basmati Rice", "Wheat", "Maize"],
    cropsRequired: ["Basmati Rice (1121, 1509)", "Sharbati Wheat"],
    primaryCrop: "Basmati Rice 1121",
    product: "Procuring 1121 Basmati & Sharbati Wheat in Bulk",
    quantity: "1500",
    quantityRequired: "1,500 Quintals",
    unit: "Quintals",
    price: "₹4,200 - ₹4,500 / Quintal",
    priceRange: "₹4,200 - ₹4,500 / Qtl",
    availability: "Immediate RTGS / Digital Mandi Clearance",
    timeline: "Within 15 Days",
    experience: "16 Years in Agro Processing",
    bio: "Modern grain milling and export processing unit. Direct farm procurement with electronic weighing bridge, immediate quality laboratory inspection, and automated NEFT/RTGS settlement within 24 hours.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    radiusKm: 250,
    coordinates: { lat: 30.9080, lng: 75.8750 },
    approxLocation: "Focal Point, Ludhiana",
    state: "Punjab",
    district: "Ludhiana",
    tehsil: "Ludhiana East",
    verified: true,
    distanceKm: 7.2,
    rating: 4.8,
    totalTrades: 124,
    createdAt: "2026-01-12T10:00:00Z",
  },
  {
    id: "kc-seller-2",
    entityType: "INDIVIDUAL",
    registrationType: "SELLER",
    role: "farmer",
    category: "Farmer",
    name: "Rameshwar Patil",
    firstName: "Rameshwar",
    lastName: "Patil",
    guardianRelation: "S/o",
    guardianName: "Baburao Patil",
    dob: "1985-02-14",
    age: 41,
    gender: "Male",
    email: "rameshwar.patil@agrikin.in",
    phone: "+91 94231 67890",
    permanentAddress: {
      line1: "Gat No 118, Pimpalgaon Baswant Road",
      state: "Maharashtra",
      district: "Nashik",
      tehsil: "Niphad",
      village: "Pimpalgaon Baswant",
      pincode: "422209",
    },
    currentAddressSameAsPermanent: true,
    crops: ["Red Onion", "Thompson Seedless Grapes", "Pomegranate"],
    product: "Nashik Garwa Onion (Grade A, Big Size)",
    quantity: "280",
    unit: "Quintals",
    price: "₹2,680 / Quintal",
    availability: "Stored in Aerated Chawl, Ready to Load",
    experience: "15 Years",
    bio: "Leading horticulturist and onion producer from Niphad valley. Utilizing automated drip fertigation and proper curing techniques for extended shelf life during long-distance transit.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    radiusKm: 300,
    coordinates: { lat: 20.1667, lng: 73.9833 },
    approxLocation: "Pimpalgaon Baswant, Nashik",
    state: "Maharashtra",
    district: "Nashik",
    tehsil: "Niphad",
    verified: true,
    distanceKm: 12.4,
    rating: 4.95,
    totalTrades: 62,
    createdAt: "2026-01-15T11:20:00Z",
  },
  {
    id: "kc-buyer-2",
    entityType: "INSTITUTIONAL",
    registrationType: "BUYER",
    role: "buyer",
    category: "Retailer",
    name: "FreshMandi Logistics & Supply Chain",
    firstName: "Anand",
    lastName: "Kulkarni",
    guardianRelation: "S/o",
    guardianName: "Shashikant Kulkarni",
    dob: "1988-11-05",
    age: 38,
    gender: "Male",
    email: "procurement@freshmandi.in",
    phone: "+91 98224 45566",
    permanentAddress: {
      line1: "APMC Market Yard, Complex D",
      state: "Maharashtra",
      district: "Pune",
      tehsil: "Haveli",
      village: "Gultekdi",
      pincode: "411037",
    },
    currentAddressSameAsPermanent: true,
    crops: ["Red Onion", "Potato", "Tomato", "Pomegranate"],
    cropsRequired: ["Nashik Garwa Onion", "Table Grapes", "Pomegranates"],
    primaryCrop: "Red Onion",
    product: "Seeking Grade A Red Onion & Pomegranates",
    quantity: "800",
    quantityRequired: "800 Quintals weekly",
    unit: "Quintals",
    price: "₹2,600 - ₹2,850 / Quintal",
    priceRange: "₹2,600 - ₹2,850 / Qtl",
    availability: "Daily direct crate collection with cold-chain trucks",
    timeline: "Ongoing Contract / Weekly Orders",
    experience: "10 Years in B2B Agri Retail",
    bio: "Connecting top regional horticulture clusters directly to Mumbai-Pune hypermarket chains. We supply crates, handle farm-gate weighing, and clear payments instantly.",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    radiusKm: 250,
    coordinates: { lat: 18.5204, lng: 73.8567 },
    approxLocation: "Gultekdi APMC, Pune",
    state: "Maharashtra",
    district: "Pune",
    tehsil: "Haveli",
    verified: true,
    distanceKm: 18.5,
    rating: 4.85,
    totalTrades: 190,
    createdAt: "2026-01-18T14:45:00Z",
  },
  {
    id: "kc-seller-3",
    entityType: "INDIVIDUAL",
    registrationType: "SELLER",
    role: "farmer",
    category: "Farmer",
    name: "Sunita Devi Verma",
    firstName: "Sunita",
    lastName: "Verma",
    guardianRelation: "W/o",
    guardianName: "Manoj Kumar Verma",
    dob: "1987-07-22",
    age: 39,
    gender: "Female",
    email: "sunita.verma@agrikin.in",
    phone: "+91 94500 11223",
    permanentAddress: {
      line1: "Ganga Kinare, Gram Rohania",
      state: "Uttar Pradesh",
      district: "Varanasi",
      tehsil: "Raja Talab",
      village: "Rohania",
      pincode: "221108",
    },
    currentAddressSameAsPermanent: true,
    crops: ["Yellow Mustard", "Wheat", "Green Peas", "Marigold"],
    product: "High Oil Content Pusa Mustard Seeds",
    quantity: "120",
    unit: "Quintals",
    price: "₹5,850 / Quintal",
    availability: "Cleaned and bagged in 50kg bags",
    experience: "11 Years",
    bio: "President of Maa Annapurna Women Farmers Producer Group. Specialized in indigenous, high-oil mustard seed varieties grown with vermicompost and Trichoderma bio-fungicides.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    radiusKm: 100,
    coordinates: { lat: 25.3176, lng: 82.9739 },
    approxLocation: "Rohania, Varanasi",
    state: "Uttar Pradesh",
    district: "Varanasi",
    tehsil: "Raja Talab",
    verified: true,
    distanceKm: 21.0,
    rating: 4.9,
    totalTrades: 27,
    createdAt: "2026-01-20T09:15:00Z",
  },
  {
    id: "kc-buyer-3",
    entityType: "INSTITUTIONAL",
    registrationType: "BUYER",
    role: "buyer",
    category: "Wholesaler",
    name: "Kashi Oil Mills & Agro Traders",
    firstName: "Rajesh",
    lastName: "Gupta",
    guardianRelation: "S/o",
    guardianName: "Kedarnath Gupta",
    dob: "1978-03-30",
    age: 48,
    gender: "Male",
    email: "orders@kashioilmills.com",
    phone: "+91 94152 33445",
    permanentAddress: {
      line1: "Industrial Estate, Chandpur",
      state: "Uttar Pradesh",
      district: "Varanasi",
      tehsil: "Varanasi Sadar",
      village: "Chandpur",
      pincode: "221106",
    },
    currentAddressSameAsPermanent: true,
    crops: ["Mustard", "Sesame", "Linseed"],
    cropsRequired: ["Yellow Mustard", "Black Mustard"],
    primaryCrop: "Yellow Mustard",
    product: "Continuous Procurement of Clean Mustard Seeds",
    quantity: "600",
    quantityRequired: "600 Quintals",
    unit: "Quintals",
    price: "₹5,750 - ₹6,000 / Quintal",
    priceRange: "₹5,750 - ₹6,000 / Qtl",
    availability: "Spot payment against test report",
    timeline: "Throughout Season",
    experience: "24 Years in Edible Oil",
    bio: "Leading traditional cold-pressed kachi ghani mustard oil manufacturer in Purvanchal. We incentivize farmers with premium rates for oil content exceeding 40%.",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80",
    radiusKm: 180,
    coordinates: { lat: 25.3280, lng: 82.9550 },
    approxLocation: "Chandpur Industrial, Varanasi",
    state: "Uttar Pradesh",
    district: "Varanasi",
    tehsil: "Varanasi Sadar",
    verified: true,
    distanceKm: 23.5,
    rating: 4.75,
    totalTrades: 88,
    createdAt: "2026-01-22T13:10:00Z",
  },
  {
    id: "kc-seller-4",
    entityType: "INDIVIDUAL",
    registrationType: "SELLER",
    role: "farmer",
    category: "Farmer",
    name: "K. Venkateshwarlu Reddy",
    firstName: "Venkateshwarlu",
    lastName: "Reddy",
    guardianRelation: "S/o",
    guardianName: "Malla Reddy",
    dob: "1983-08-19",
    age: 43,
    gender: "Male",
    email: "venkat.reddy@agrikin.in",
    phone: "+91 99890 34567",
    permanentAddress: {
      line1: "Survey No 204, Miryalaguda Road",
      state: "Telangana",
      district: "Nalgonda",
      tehsil: "Miryalaguda",
      village: "Miryalaguda Rural",
      pincode: "508207",
    },
    currentAddressSameAsPermanent: true,
    crops: ["BPT 5204 (Sona Masoori) Paddy", "Cotton", "Red Gram"],
    product: "Direct Harvested BPT 5204 Sona Masoori Paddy",
    quantity: "450",
    unit: "Bags (75kg each)",
    price: "₹2,280 / Bag",
    availability: "Ready at Threshing Floor",
    experience: "17 Years",
    bio: "Paddy cultivator with automated water-saving AWD (alternate wetting and drying) technique. Minimum pesticide residues, pure grain strain with excellent cooking aroma.",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    radiusKm: 200,
    coordinates: { lat: 16.8722, lng: 79.5639 },
    approxLocation: "Miryalaguda, Nalgonda",
    state: "Telangana",
    district: "Nalgonda",
    tehsil: "Miryalaguda",
    verified: true,
    distanceKm: 28.0,
    rating: 4.9,
    totalTrades: 45,
    createdAt: "2026-01-25T15:30:00Z",
  },
  {
    id: "kc-seller-5",
    entityType: "INSTITUTIONAL",
    registrationType: "SELLER",
    role: "seller",
    category: "Input Supplier",
    name: "BioKisan Agri Inputs & Microbial Lab",
    firstName: "Dr. Suresh",
    lastName: "Patel",
    guardianRelation: "S/o",
    guardianName: "Kantibhai Patel",
    dob: "1975-06-10",
    age: 51,
    gender: "Male",
    email: "sales@biokisan.in",
    phone: "+91 98250 11998",
    permanentAddress: {
      line1: "GIDC Industrial Estate, Gondal Road",
      state: "Gujarat",
      district: "Rajkot",
      tehsil: "Rajkot",
      village: "Kothariya",
      pincode: "360004",
    },
    currentAddressSameAsPermanent: true,
    crops: ["Groundnut", "Cotton", "Cumin", "Castor"],
    product: "Certified Bio-Fungicide (Trichoderma) & Cold-Pressed Neem Cake",
    quantity: "1200",
    unit: "50kg Bags",
    price: "₹880 / Bag",
    availability: "Dispatch in 24 Hours with Certificate of Analysis",
    experience: "14 Years in Bio-Tech",
    bio: "Government-certified microbial bio-control manufacturer. Supplies pure CFU count Trichoderma viride, Pseudomonas fluorescens, and enriched organic manure for natural disease suppression.",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    radiusKm: 500,
    coordinates: { lat: 22.3039, lng: 70.8022 },
    approxLocation: "Gondal Road, Rajkot",
    state: "Gujarat",
    district: "Rajkot",
    tehsil: "Rajkot",
    verified: true,
    distanceKm: 34.0,
    rating: 4.92,
    totalTrades: 210,
    createdAt: "2026-01-26T12:00:00Z",
  }
];

export class KrishiConnectService {
  /**
   * Retrieves all registered Krishi Connect profiles from storage or initial seed
   */
  static getProfiles(): KrishiConnectProfile[] {
    if (typeof window === "undefined") return initialKrishiProfiles;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not parse stored profiles, falling back to seed", e);
    }
    this.saveProfiles(initialKrishiProfiles);
    return initialKrishiProfiles;
  }

  static saveProfiles(profiles: KrishiConnectProfile[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.error("Failed to save Krishi profiles to localStorage", e);
    }
  }

  static getProfileById(id: string): KrishiConnectProfile | null {
    const all = this.getProfiles();
    return all.find((p) => p.id === id) || null;
  }

  /**
   * Active logged-in Krishi Connect profile
   */
  static getActiveProfile(): KrishiConnectProfile | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {}
    // If no active Krishi profile yet, default to first profile for instant demo experience
    return null;
  }

  static setActiveProfile(profile: KrishiConnectProfile | null): void {
    if (typeof window === "undefined") return;
    if (profile) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_PROFILE, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_PROFILE);
    }
  }

  /**
   * Register a new Krishi Connect profile (from the 4-step signup wizard)
   */
  static registerProfile(newProfileData: Partial<KrishiConnectProfile>): KrishiConnectProfile {
    const all = this.getProfiles();
    const id = "kc-user-" + Date.now();
    const state = newProfileData.permanentAddress?.state || "Punjab";
    const district = newProfileData.permanentAddress?.district || "Ludhiana";
    const coords =
      newProfileData.coordinates ||
      getDistrictCoordinates(state, district);

    const profile: KrishiConnectProfile = {
      id,
      entityType: newProfileData.entityType || "INDIVIDUAL",
      registrationType: newProfileData.registrationType || "SELLER",
      role: (newProfileData.registrationType?.toLowerCase() as any) || "farmer",
      category: newProfileData.category || "Farmer",
      name:
        newProfileData.name ||
        `${newProfileData.firstName || ""} ${newProfileData.lastName || ""}`.trim() ||
        "Kisan User",
      firstName: newProfileData.firstName,
      middleName: newProfileData.middleName,
      lastName: newProfileData.lastName,
      guardianRelation: newProfileData.guardianRelation || "S/o",
      guardianName: newProfileData.guardianName || "",
      dob: newProfileData.dob,
      age: newProfileData.age || 35,
      gender: newProfileData.gender || "Male",
      email: (newProfileData.email || "").toLowerCase().trim(),
      phone: (newProfileData.phone || "").trim(),
      permanentAddress: newProfileData.permanentAddress || {
        line1: "Main Village Road",
        state,
        district,
        tehsil: newProfileData.permanentAddress?.tehsil || district,
        village: newProfileData.permanentAddress?.village || "Rural Sector",
        pincode: newProfileData.permanentAddress?.pincode || "141001",
      },
      currentAddressSameAsPermanent: newProfileData.currentAddressSameAsPermanent ?? true,
      currentAddress: newProfileData.currentAddressSameAsPermanent
        ? newProfileData.permanentAddress
        : newProfileData.currentAddress,
      crops: newProfileData.crops || ["Wheat", "Paddy"],
      product: newProfileData.product || (newProfileData.registrationType === "BUYER" ? "Crop Procurement" : "Farm Harvest"),
      quantity: newProfileData.quantity || "100",
      unit: newProfileData.unit || "Quintals",
      price: newProfileData.price || "₹3,500 / Quintal",
      availability: newProfileData.availability || "In Stock",
      cropsRequired: newProfileData.cropsRequired,
      primaryCrop: newProfileData.primaryCrop,
      quantityRequired: newProfileData.quantityRequired,
      priceRange: newProfileData.priceRange,
      timeline: newProfileData.timeline,
      experience: newProfileData.experience || "5 Years",
      bio: newProfileData.bio || "Dedicated agricultural producer utilizing ȺցɾìҠìղ digital network.",
      photo:
        newProfileData.photo ||
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      radiusKm: newProfileData.radiusKm || 50,
      coordinates: coords,
      approxLocation: `${district}, ${state}`,
      state,
      district,
      tehsil: newProfileData.permanentAddress?.tehsil,
      village: newProfileData.permanentAddress?.village,
      verified: true,
      rating: 5.0,
      totalTrades: 1,
      createdAt: new Date().toISOString(),
    };

    all.unshift(profile);
    this.saveProfiles(all);
    this.setActiveProfile(profile);
    return profile;
  }

  /**
   * Role-Aware Discovery Algorithm:
   * - If viewer is BUYER: Discover SELLERS / Farmers.
   * - If viewer is SELLER: Discover BUYERS.
   * - Never show viewer's own profile!
   * - Calculate distance from viewer's coordinates (or reference coordinates).
   */
  static getDiscoveries(options: {
    viewerProfile?: KrishiConnectProfile | null;
    referenceCoords?: { lat: number; lng: number } | null;
    roleFilter?: "all" | "sellers" | "buyers" | "farmer" | "buyer" | "seller";
    searchQuery?: string;
    maxDistanceKm?: number;
    state?: string;
    crop?: string;
  }): KrishiConnectProfile[] {
    const all = this.getProfiles();
    const viewer = options.viewerProfile || this.getActiveProfile();
    const blockedIds = this.getBlockedUserIds();

    const userLat =
      options.referenceCoords?.lat ||
      viewer?.coordinates?.lat ||
      30.9010; // Default Punjab reference
    const userLng =
      options.referenceCoords?.lng ||
      viewer?.coordinates?.lng ||
      75.8573;

    // 1. Filter out blocked users & self
    let candidates = all.filter((p) => {
      if (viewer && p.id === viewer.id) return false;
      if (blockedIds.includes(p.id)) return false;
      return true;
    });

    // 2. Compute distances
    candidates = candidates.map((p) => {
      const dist = calculateDistanceKm(userLat, userLng, p.coordinates.lat, p.coordinates.lng);
      return {
        ...p,
        distanceKm: Math.round(dist * 10) / 10,
      };
    });

    // 3. Apply Role Discovery Logic
    if (options.roleFilter && options.roleFilter !== "all") {
      if (options.roleFilter === "sellers") {
        candidates = candidates.filter(
          (p) => p.registrationType === "SELLER" || p.role === "farmer" || p.role === "seller"
        );
      } else if (options.roleFilter === "buyers") {
        candidates = candidates.filter(
          (p) => p.registrationType === "BUYER" || p.role === "buyer"
        );
      } else {
        candidates = candidates.filter((p) => p.role === options.roleFilter);
      }
    } else if (viewer) {
      // Automatic role-aware matching if "all" is not forced
      // When viewer is BUYER, default prioritize SELLERS
      // When viewer is SELLER, default prioritize BUYERS
      if (viewer.registrationType === "BUYER") {
        // Boost sellers to top
        candidates.sort((a, b) => {
          if (a.registrationType === "SELLER" && b.registrationType !== "SELLER") return -1;
          if (b.registrationType === "SELLER" && a.registrationType !== "SELLER") return 1;
          return (a.distanceKm || 0) - (b.distanceKm || 0);
        });
      } else if (viewer.registrationType === "SELLER") {
        // Boost buyers to top
        candidates.sort((a, b) => {
          if (a.registrationType === "BUYER" && b.registrationType !== "BUYER") return -1;
          if (b.registrationType === "BUYER" && a.registrationType !== "BUYER") return 1;
          return (a.distanceKm || 0) - (b.distanceKm || 0);
        });
      }
    }

    // 4. Search Query Filter (Crop, Name, Product, District)
    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      candidates = candidates.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.product.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.crops.some((c) => c.toLowerCase().includes(q)) ||
          (p.cropsRequired && p.cropsRequired.some((c) => c.toLowerCase().includes(q)))
      );
    }

    // 5. Max Distance Filter
    if (options.maxDistanceKm && options.maxDistanceKm > 0) {
      candidates = candidates.filter(
        (p) => p.distanceKm === undefined || p.distanceKm <= options.maxDistanceKm!
      );
    }

    // 6. State Filter
    if (options.state && options.state !== "all") {
      candidates = candidates.filter((p) => p.state.toLowerCase() === options.state!.toLowerCase());
    }

    // Sort primarily by distance
    return candidates.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }

  /**
   * Connection System (NOT_CONNECTED -> REQUEST_SENT -> CONNECTED -> BLOCKED)
   */
  static getConnections(): ConnectionRecord[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONNECTIONS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  static saveConnections(connections: ConnectionRecord[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_CONNECTIONS, JSON.stringify(connections));
    } catch (e) {}
  }

  static getConnectionStatus(targetUserId: string, currentUserId?: string): ConnectionStatus {
    const viewerId = currentUserId || this.getActiveProfile()?.id || "usr-current";
    if (this.isBlocked(targetUserId)) return "BLOCKED";

    const records = this.getConnections();
    const match = records.find(
      (r) =>
        (r.senderId === viewerId && r.receiverId === targetUserId) ||
        (r.senderId === targetUserId && r.receiverId === viewerId)
    );

    return match ? match.status : "NOT_CONNECTED";
  }

  static sendConnectionRequest(targetUserId: string, currentUserId?: string): ConnectionStatus {
    const viewerId = currentUserId || this.getActiveProfile()?.id || "usr-current";
    const records = this.getConnections();
    const existingIndex = records.findIndex(
      (r) =>
        (r.senderId === viewerId && r.receiverId === targetUserId) ||
        (r.senderId === targetUserId && r.receiverId === viewerId)
    );

    const now = new Date().toISOString();
    if (existingIndex >= 0) {
      records[existingIndex].status = "CONNECTED";
      records[existingIndex].updatedAt = now;
      this.saveConnections(records);
      return "CONNECTED";
    }

    const newRecord: ConnectionRecord = {
      id: "conn-" + Date.now(),
      senderId: viewerId,
      receiverId: targetUserId,
      status: "REQUEST_SENT",
      createdAt: now,
      updatedAt: now,
    };
    records.push(newRecord);
    this.saveConnections(records);
    return "REQUEST_SENT";
  }

  static acceptConnection(targetUserId: string, currentUserId?: string): ConnectionStatus {
    const viewerId = currentUserId || this.getActiveProfile()?.id || "usr-current";
    const records = this.getConnections();
    const existing = records.find(
      (r) =>
        (r.senderId === targetUserId && r.receiverId === viewerId) ||
        (r.senderId === viewerId && r.receiverId === targetUserId)
    );
    if (existing) {
      existing.status = "CONNECTED";
      existing.updatedAt = new Date().toISOString();
      this.saveConnections(records);
      return "CONNECTED";
    }
    return this.sendConnectionRequest(targetUserId, currentUserId);
  }

  /**
   * Real-time Chat & Conversations
   */
  static getConversations(currentUserId?: string): KrishiConversation[] {
    const viewerId = currentUserId || this.getActiveProfile()?.id || "usr-current";
    const profiles = this.getProfiles().filter((p) => p.id !== viewerId);

    // Build active conversations list
    const conversations: KrishiConversation[] = profiles.map((peer) => {
      const msgs = this.getMessages(peer.id, viewerId);
      const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : undefined;
      const unreadCount = msgs.filter((m) => !m.read && m.senderId === peer.id).length;

      return {
        id: `conv-${peer.id}`,
        participantIds: [viewerId, peer.id],
        peer,
        lastMessage: lastMsg,
        unreadCount,
        updatedAt: lastMsg?.createdAt || peer.createdAt,
      };
    });

    // Sort by recent activity
    return conversations.sort((a, b) => {
      const timeA = new Date(a.updatedAt).getTime();
      const timeB = new Date(b.updatedAt).getTime();
      return timeB - timeA;
    });
  }

  static getMessages(peerId: string, currentUserId?: string): ChatMessage[] {
    if (typeof window === "undefined") return [];
    const viewerId = currentUserId || this.getActiveProfile()?.id || "usr-current";
    const key = `${STORAGE_KEY_MESSAGES_PREFIX}${peerId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}

    // Seeded initial exchange
    const initial: ChatMessage[] = [
      {
        id: `msg-${peerId}-1`,
        senderId: peerId,
        receiverId: viewerId,
        text: `Sat Sri Akal / Namaste ji! Welcome to ȺցɾìҠìղ Krishi Connect. We have fresh agricultural harvest and verified mandi supplies ready for direct field trade.`,
        timestamp: "10:00 AM",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        read: true,
      },
      {
        id: `msg-${peerId}-2`,
        senderId: viewerId,
        receiverId: peerId,
        text: `Namaste! Could you please share the moisture certificate and let me know if immediate loading at the farm gate is possible?`,
        timestamp: "10:05 AM",
        createdAt: new Date(Date.now() - 3300000).toISOString(),
        read: true,
      },
      {
        id: `msg-${peerId}-3`,
        senderId: peerId,
        receiverId: viewerId,
        text: `Yes, moisture is well calibrated below 12.5%. Graded in export quality bags. We can also schedule a quick video inspection call to examine the crop live!`,
        timestamp: "10:08 AM",
        createdAt: new Date(Date.now() - 3000000).toISOString(),
        read: true,
      },
    ];

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(initial));
      } catch (e) {}
    }
    return initial;
  }

  static sendMessage(
    peerId: string,
    text: string,
    imageUrl?: string,
    attachmentType?: ChatMessage["attachmentType"],
    currentUserId?: string
  ): ChatMessage {
    const viewerId = currentUserId || this.getActiveProfile()?.id || "usr-current";
    const list = this.getMessages(peerId, viewerId);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg: ChatMessage = {
      id: "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      senderId: viewerId,
      receiverId: peerId,
      conversationId: `conv-${peerId}`,
      text: text.trim(),
      imageUrl,
      attachmentType,
      timestamp: timeStr,
      createdAt: now.toISOString(),
      read: false,
    };

    const updated = [...list, newMsg];
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`${STORAGE_KEY_MESSAGES_PREFIX}${peerId}`, JSON.stringify(updated));
      } catch (e) {}
    }
    return newMsg;
  }

  static simulatePeerReply(
    peerId: string,
    peerName: string,
    onReply: (reply: ChatMessage) => void,
    currentUserId?: string
  ): void {
    const viewerId = currentUserId || this.getActiveProfile()?.id || "usr-current";
    setTimeout(() => {
      const responses = [
        `Thank you for confirming! We can arrange truck loading directly to your destination mandi.`,
        `Understood. I will upload the weighing bridge slip and quality report right away.`,
        `Sounds great. Feel free to click the Video Call button above so we can verify the grain quality live!`,
        `Noted! We have 250 quintals available for immediate dispatch with digital weighing.`,
        `Payment terms: 50% upon dispatch weighment slip and remainder on delivery clearance.`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const replyMsg: ChatMessage = {
        id: "msg-peer-" + Date.now(),
        senderId: peerId,
        receiverId: viewerId,
        conversationId: `conv-${peerId}`,
        text: randomResponse,
        timestamp: timeStr,
        createdAt: now.toISOString(),
        read: true,
      };

      const current = this.getMessages(peerId, viewerId);
      const updated = [...current, replyMsg];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`${STORAGE_KEY_MESSAGES_PREFIX}${peerId}`, JSON.stringify(updated));
        } catch (e) {}
      }
      onReply(replyMsg);
    }, 2000);
  }

  /**
   * Moderation & Safety: Block & Report
   */
  static blockUser(peerId: string): void {
    if (typeof window === "undefined") return;
    const blocked = this.getBlockedUserIds();
    if (!blocked.includes(peerId)) {
      blocked.push(peerId);
      localStorage.setItem(STORAGE_KEY_BLOCKED, JSON.stringify(blocked));
    }
  }

  static unblockUser(peerId: string): void {
    if (typeof window === "undefined") return;
    let blocked = this.getBlockedUserIds();
    blocked = blocked.filter((id) => id !== peerId);
    localStorage.setItem(STORAGE_KEY_BLOCKED, JSON.stringify(blocked));
  }

  static isBlocked(peerId: string): boolean {
    return this.getBlockedUserIds().includes(peerId);
  }

  static getBlockedUserIds(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BLOCKED);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  static reportUser(reportData: {
    peerId: string;
    peerName: string;
    reason: string;
    details: string;
    reporterId?: string;
  }): boolean {
    if (typeof window === "undefined") return true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_REPORTS);
      const list = raw ? JSON.parse(raw) : [];
      list.push({
        id: "rep-" + Date.now(),
        ...reportData,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }
}
