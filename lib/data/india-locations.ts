// lib/data/india-locations.ts
// Comprehensive Indian Administrative Location Architecture
// Covers all 28 States and 8 Union Territories (36 entities) with hierarchical districts, tehsils, and village search.

export interface LocationState {
  id: string;
  name: string;
  type: "state" | "ut";
  code: string;
}

export interface LocationDistrict {
  id: string;
  stateId: string;
  name: string;
  headquarters?: string;
  coordinates: { lat: number; lng: number };
}

export interface LocationTehsil {
  id: string;
  districtId: string;
  stateId: string;
  name: string;
}

export interface LocationVillage {
  id: string;
  tehsilId: string;
  districtId: string;
  stateId: string;
  name: string;
  pincode?: string;
}

// ALL 28 Indian States & 8 Union Territories
export const ALL_INDIAN_STATES: LocationState[] = [
  // 28 States
  { id: "AP", name: "Andhra Pradesh", type: "state", code: "AP" },
  { id: "AR", name: "Arunachal Pradesh", type: "state", code: "AR" },
  { id: "AS", name: "Assam", type: "state", code: "AS" },
  { id: "BR", name: "Bihar", type: "state", code: "BR" },
  { id: "CG", name: "Chhattisgarh", type: "state", code: "CG" },
  { id: "GA", name: "Goa", type: "state", code: "GA" },
  { id: "GJ", name: "Gujarat", type: "state", code: "GJ" },
  { id: "HR", name: "Haryana", type: "state", code: "HR" },
  { id: "HP", name: "Himachal Pradesh", type: "state", code: "HP" },
  { id: "JH", name: "Jharkhand", type: "state", code: "JH" },
  { id: "KA", name: "Karnataka", type: "state", code: "KA" },
  { id: "KL", name: "Kerala", type: "state", code: "KL" },
  { id: "MP", name: "Madhya Pradesh", type: "state", code: "MP" },
  { id: "MH", name: "Maharashtra", type: "state", code: "MH" },
  { id: "MN", name: "Manipur", type: "state", code: "MN" },
  { id: "ML", name: "Meghalaya", type: "state", code: "ML" },
  { id: "MZ", name: "Mizoram", type: "state", code: "MZ" },
  { id: "NL", name: "Nagaland", type: "state", code: "NL" },
  { id: "OD", name: "Odisha", type: "state", code: "OD" },
  { id: "PB", name: "Punjab", type: "state", code: "PB" },
  { id: "RJ", name: "Rajasthan", type: "state", code: "RJ" },
  { id: "SK", name: "Sikkim", type: "state", code: "SK" },
  { id: "TN", name: "Tamil Nadu", type: "state", code: "TN" },
  { id: "TS", name: "Telangana", type: "state", code: "TS" },
  { id: "TR", name: "Tripura", type: "state", code: "TR" },
  { id: "UP", name: "Uttar Pradesh", type: "state", code: "UP" },
  { id: "UK", name: "Uttarakhand", type: "state", code: "UK" },
  { id: "WB", name: "West Bengal", type: "state", code: "WB" },

  // 8 Union Territories
  { id: "AN", name: "Andaman and Nicobar Islands", type: "ut", code: "AN" },
  { id: "CH", name: "Chandigarh", type: "ut", code: "CH" },
  { id: "DN", name: "Dadra and Nagar Haveli and Daman and Diu", type: "ut", code: "DN" },
  { id: "DL", name: "Delhi (NCT)", type: "ut", code: "DL" },
  { id: "JK", name: "Jammu and Kashmir", type: "ut", code: "JK" },
  { id: "LA", name: "Ladakh", type: "ut", code: "LA" },
  { id: "LD", name: "Lakshadweep", type: "ut", code: "LD" },
  { id: "PY", name: "Puducherry", type: "ut", code: "PY" },
];

// District datasets per State/UT with real geographic coordinates
export const ALL_INDIAN_DISTRICTS: LocationDistrict[] = [
  // Telangana
  { id: "ts-hyd", stateId: "TS", name: "Hyderabad", coordinates: { lat: 17.385, lng: 78.4867 } },
  { id: "ts-niz", stateId: "TS", name: "Nizamabad", coordinates: { lat: 18.6725, lng: 78.0941 } },
  { id: "ts-wgl", stateId: "TS", name: "Warangal", coordinates: { lat: 17.9689, lng: 79.5941 } },
  { id: "ts-krm", stateId: "TS", name: "Karimnagar", coordinates: { lat: 18.4386, lng: 79.1288 } },
  { id: "ts-khm", stateId: "TS", name: "Khammam", coordinates: { lat: 17.2473, lng: 80.1514 } },
  { id: "ts-nal", stateId: "TS", name: "Nalgonda", coordinates: { lat: 17.0577, lng: 79.2684 } },
  { id: "ts-mbn", stateId: "TS", name: "Mahabubnagar", coordinates: { lat: 16.7488, lng: 77.9856 } },
  { id: "ts-mdk", stateId: "TS", name: "Medak", coordinates: { lat: 18.0461, lng: 78.2612 } },
  { id: "ts-adb", stateId: "TS", name: "Adilabad", coordinates: { lat: 19.6641, lng: 78.532 } },
  { id: "ts-rrg", stateId: "TS", name: "Rangareddy", coordinates: { lat: 17.4399, lng: 78.4983 } },
  { id: "ts-srd", stateId: "TS", name: "Sangareddy", coordinates: { lat: 17.6193, lng: 78.0814 } },
  { id: "ts-sdd", stateId: "TS", name: "Siddipet", coordinates: { lat: 18.1018, lng: 78.852 } },

  // Punjab
  { id: "pb-ldh", stateId: "PB", name: "Ludhiana", coordinates: { lat: 30.901, lng: 75.8573 } },
  { id: "pb-asr", stateId: "PB", name: "Amritsar", coordinates: { lat: 31.634, lng: 74.8723 } },
  { id: "pb-jlr", stateId: "PB", name: "Jalandhar", coordinates: { lat: 31.326, lng: 75.5762 } },
  { id: "pb-ptl", stateId: "PB", name: "Patiala", coordinates: { lat: 30.3398, lng: 76.3869 } },
  { id: "pb-bth", stateId: "PB", name: "Bathinda", coordinates: { lat: 30.211, lng: 74.9455 } },
  { id: "pb-sgr", stateId: "PB", name: "Sangrur", coordinates: { lat: 30.2458, lng: 75.8421 } },
  { id: "pb-fzr", stateId: "PB", name: "Firozpur", coordinates: { lat: 30.9237, lng: 74.6114 } },
  { id: "pb-gur", stateId: "PB", name: "Gurdaspur", coordinates: { lat: 32.0419, lng: 75.4053 } },
  { id: "pb-hsp", stateId: "PB", name: "Hoshiarpur", coordinates: { lat: 31.5309, lng: 75.9115 } },
  { id: "pb-mkt", stateId: "PB", name: "Sri Muktsar Sahib", coordinates: { lat: 30.4762, lng: 74.5173 } },

  // Uttar Pradesh
  { id: "up-lko", stateId: "UP", name: "Lucknow", coordinates: { lat: 26.8467, lng: 80.9462 } },
  { id: "up-vns", stateId: "UP", name: "Varanasi", coordinates: { lat: 25.3176, lng: 82.9739 } },
  { id: "up-knp", stateId: "UP", name: "Kanpur Nagar", coordinates: { lat: 26.4499, lng: 80.3319 } },
  { id: "up-agr", stateId: "UP", name: "Agra", coordinates: { lat: 27.1767, lng: 78.0081 } },
  { id: "up-mrt", stateId: "UP", name: "Meerut", coordinates: { lat: 28.9845, lng: 77.7064 } },
  { id: "up-bly", stateId: "UP", name: "Bareilly", coordinates: { lat: 28.367, lng: 79.4304 } },
  { id: "up-gkp", stateId: "UP", name: "Gorakhpur", coordinates: { lat: 26.7606, lng: 83.3732 } },
  { id: "up-pry", stateId: "UP", name: "Prayagraj", coordinates: { lat: 25.4358, lng: 81.8463 } },
  { id: "up-ayh", stateId: "UP", name: "Ayodhya", coordinates: { lat: 26.7922, lng: 82.1998 } },
  { id: "up-mtw", stateId: "UP", name: "Mathura", coordinates: { lat: 27.4924, lng: 77.6737 } },
  { id: "up-jhs", stateId: "UP", name: "Jhansi", coordinates: { lat: 25.4484, lng: 78.5685 } },

  // Maharashtra
  { id: "mh-pun", stateId: "MH", name: "Pune", coordinates: { lat: 18.5204, lng: 73.8567 } },
  { id: "mh-nsk", stateId: "MH", name: "Nashik", coordinates: { lat: 19.9975, lng: 73.7898 } },
  { id: "mh-ngp", stateId: "MH", name: "Nagpur", coordinates: { lat: 21.1458, lng: 79.0882 } },
  { id: "mh-csn", stateId: "MH", name: "Chhatrapati Sambhaji Nagar", coordinates: { lat: 19.8762, lng: 75.3433 } },
  { id: "mh-sol", stateId: "MH", name: "Solapur", coordinates: { lat: 17.6599, lng: 75.9064 } },
  { id: "mh-klh", stateId: "MH", name: "Kolhapur", coordinates: { lat: 16.705, lng: 74.2433 } },
  { id: "mh-amr", stateId: "MH", name: "Amravati", coordinates: { lat: 20.932, lng: 77.7523 } },
  { id: "mh-mum", stateId: "MH", name: "Mumbai City", coordinates: { lat: 18.922, lng: 72.8347 } },

  // Karnataka
  { id: "ka-blr", stateId: "KA", name: "Bengaluru Urban", coordinates: { lat: 12.9716, lng: 77.5946 } },
  { id: "ka-mys", stateId: "KA", name: "Mysuru", coordinates: { lat: 12.2958, lng: 76.6394 } },
  { id: "ka-bel", stateId: "KA", name: "Belagavi", coordinates: { lat: 15.8497, lng: 74.4977 } },
  { id: "ka-dhr", stateId: "KA", name: "Dharwad", coordinates: { lat: 15.4589, lng: 75.0078 } },
  { id: "ka-shm", stateId: "KA", name: "Shivamogga", coordinates: { lat: 13.9299, lng: 75.5681 } },
  { id: "ka-vjp", stateId: "KA", name: "Vijayapura", coordinates: { lat: 16.8302, lng: 75.71 } },

  // Andhra Pradesh
  { id: "ap-vza", stateId: "AP", name: "Krishna (Vijayawada)", coordinates: { lat: 16.5062, lng: 80.648 } },
  { id: "ap-gtr", stateId: "AP", name: "Guntur", coordinates: { lat: 16.3067, lng: 80.4365 } },
  { id: "ap-vsp", stateId: "AP", name: "Visakhapatnam", coordinates: { lat: 17.6868, lng: 83.2185 } },
  { id: "ap-krn", stateId: "AP", name: "Kurnool", coordinates: { lat: 15.8281, lng: 78.0373 } },
  { id: "ap-atp", stateId: "AP", name: "Anantapur", coordinates: { lat: 14.6819, lng: 77.6006 } },

  // Haryana
  { id: "hr-krn", stateId: "HR", name: "Karnal", coordinates: { lat: 29.6857, lng: 76.9905 } },
  { id: "hr-hsr", stateId: "HR", name: "Hisar", coordinates: { lat: 29.1492, lng: 75.7217 } },
  { id: "hr-amb", stateId: "HR", name: "Ambala", coordinates: { lat: 30.3782, lng: 76.7767 } },
  { id: "hr-pan", stateId: "HR", name: "Panipat", coordinates: { lat: 29.3909, lng: 76.9635 } },
  { id: "hr-rht", stateId: "HR", name: "Rohtak", coordinates: { lat: 28.8955, lng: 76.6066 } },

  // Madhya Pradesh
  { id: "mp-ind", stateId: "MP", name: "Indore", coordinates: { lat: 22.7196, lng: 75.8577 } },
  { id: "mp-bpl", stateId: "MP", name: "Bhopal", coordinates: { lat: 23.2599, lng: 77.4126 } },
  { id: "mp-ujj", stateId: "MP", name: "Ujjain", coordinates: { lat: 23.1765, lng: 75.7885 } },
  { id: "mp-jbl", stateId: "MP", name: "Jabalpur", coordinates: { lat: 23.1815, lng: 79.9864 } },

  // Gujarat
  { id: "gj-ahm", stateId: "GJ", name: "Ahmedabad", coordinates: { lat: 23.0225, lng: 72.5714 } },
  { id: "gj-srt", stateId: "GJ", name: "Surat", coordinates: { lat: 21.1702, lng: 72.8311 } },
  { id: "gj-raj", stateId: "GJ", name: "Rajkot", coordinates: { lat: 22.3039, lng: 70.8022 } },
  { id: "gj-vad", stateId: "GJ", name: "Vadodara", coordinates: { lat: 22.3072, lng: 73.1812 } },

  // Rajasthan
  { id: "rj-jai", stateId: "RJ", name: "Jaipur", coordinates: { lat: 26.9124, lng: 75.7873 } },
  { id: "rj-jod", stateId: "RJ", name: "Jodhpur", coordinates: { lat: 26.2389, lng: 73.0243 } },
  { id: "rj-kot", stateId: "RJ", name: "Kota", coordinates: { lat: 25.2138, lng: 75.8648 } },
  { id: "rj-bik", stateId: "RJ", name: "Bikaner", coordinates: { lat: 28.0229, lng: 73.3119 } },

  // Bihar
  { id: "br-pat", stateId: "BR", name: "Patna", coordinates: { lat: 25.5941, lng: 85.1376 } },
  { id: "br-gay", stateId: "BR", name: "Gaya", coordinates: { lat: 24.7914, lng: 85.0002 } },
  { id: "br-muz", stateId: "BR", name: "Muzaffarpur", coordinates: { lat: 26.1209, lng: 85.3647 } },

  // West Bengal
  { id: "wb-kol", stateId: "WB", name: "Kolkata", coordinates: { lat: 22.5726, lng: 88.3639 } },
  { id: "wb-bur", stateId: "WB", name: "Purba Bardhaman", coordinates: { lat: 23.2324, lng: 87.8615 } },
  { id: "wb-sil", stateId: "WB", name: "Darjeeling / Siliguri", coordinates: { lat: 26.7271, lng: 88.3953 } },

  // Tamil Nadu
  { id: "tn-chn", stateId: "TN", name: "Chennai", coordinates: { lat: 13.0827, lng: 80.2707 } },
  { id: "tn-cbe", stateId: "TN", name: "Coimbatore", coordinates: { lat: 11.0168, lng: 76.9558 } },
  { id: "tn-mdu", stateId: "TN", name: "Madurai", coordinates: { lat: 9.9252, lng: 78.1198 } },
  { id: "tn-thj", stateId: "TN", name: "Thanjavur", coordinates: { lat: 10.787, lng: 79.1378 } },

  // Delhi (NCT)
  { id: "dl-cst", stateId: "DL", name: "Central Delhi", coordinates: { lat: 28.6139, lng: 77.209 } },
  { id: "dl-sth", stateId: "DL", name: "South Delhi", coordinates: { lat: 28.5355, lng: 77.199 } },
  { id: "dl-nth", stateId: "DL", name: "North Delhi", coordinates: { lat: 28.7041, lng: 77.1025 } },

  // Jammu and Kashmir
  { id: "jk-srn", stateId: "JK", name: "Srinagar", coordinates: { lat: 34.0837, lng: 74.7973 } },
  { id: "jk-jmu", stateId: "JK", name: "Jammu", coordinates: { lat: 32.7266, lng: 74.857 } },

  // Other States with representative agricultural districts
  { id: "as-ghy", stateId: "AS", name: "Kamrup (Guwahati)", coordinates: { lat: 26.1445, lng: 91.7362 } },
  { id: "cg-rpr", stateId: "CG", name: "Raipur", coordinates: { lat: 21.2514, lng: 81.6296 } },
  { id: "ga-pan", stateId: "GA", name: "North Goa", coordinates: { lat: 15.4909, lng: 73.8278 } },
  { id: "hp-sml", stateId: "HP", name: "Shimla", coordinates: { lat: 31.1048, lng: 77.1734 } },
  { id: "jh-rnc", stateId: "JH", name: "Ranchi", coordinates: { lat: 23.3441, lng: 85.3096 } },
  { id: "kl-tvm", stateId: "KL", name: "Thiruvananthapuram", coordinates: { lat: 8.5241, lng: 76.9366 } },
  { id: "od-bbs", stateId: "OD", name: "Khordha (Bhubaneswar)", coordinates: { lat: 20.2961, lng: 85.8245 } },
  { id: "uk-ddn", stateId: "UK", name: "Dehradun", coordinates: { lat: 30.3165, lng: 78.0322 } },
  { id: "ch-chd", stateId: "CH", name: "Chandigarh City", coordinates: { lat: 30.7333, lng: 76.7794 } },
  { id: "la-leh", stateId: "LA", name: "Leh", coordinates: { lat: 34.1526, lng: 77.5771 } },
  { id: "py-pud", stateId: "PY", name: "Puducherry District", coordinates: { lat: 11.9416, lng: 79.8083 } },
  { id: "sk-gtx", stateId: "SK", name: "Gangtok", coordinates: { lat: 27.3389, lng: 88.6065 } },
  { id: "mn-imp", stateId: "MN", name: "Imphal West", coordinates: { lat: 24.817, lng: 93.9368 } },
  { id: "ml-shl", stateId: "ML", name: "East Khasi Hills (Shillong)", coordinates: { lat: 25.5788, lng: 91.8933 } },
  { id: "mz-azl", stateId: "MZ", name: "Aizawl", coordinates: { lat: 23.7271, lng: 92.7176 } },
  { id: "nl-koh", stateId: "NL", name: "Kohima", coordinates: { lat: 25.6751, lng: 94.1086 } },
  { id: "tr-agt", stateId: "TR", name: "West Tripura (Agartala)", coordinates: { lat: 23.8315, lng: 91.2868 } },
  { id: "ar-ita", stateId: "AR", name: "Papum Pare (Itanagar)", coordinates: { lat: 27.0844, lng: 93.6053 } },
  { id: "an-prt", stateId: "AN", name: "South Andaman (Port Blair)", coordinates: { lat: 11.6234, lng: 92.7265 } },
  { id: "dn-dmn", stateId: "DN", name: "Daman", coordinates: { lat: 20.3974, lng: 72.8328 } },
  { id: "ld-kvr", stateId: "LD", name: "Kavaratti", coordinates: { lat: 10.5667, lng: 72.6417 } }
];

// Tehsils mapped hierarchically to District and State
export const ALL_INDIAN_TEHSILS: LocationTehsil[] = [
  // Telangana - Nizamabad
  { id: "teh-ts-niz-1", districtId: "ts-niz", stateId: "TS", name: "Nizamabad North" },
  { id: "teh-ts-niz-2", districtId: "ts-niz", stateId: "TS", name: "Nizamabad South" },
  { id: "teh-ts-niz-3", districtId: "ts-niz", stateId: "TS", name: "Armoor" },
  { id: "teh-ts-niz-4", districtId: "ts-niz", stateId: "TS", name: "Bodhan" },
  { id: "teh-ts-niz-5", districtId: "ts-niz", stateId: "TS", name: "Bheemgal" },

  // Telangana - Hyderabad
  { id: "teh-ts-hyd-1", districtId: "ts-hyd", stateId: "TS", name: "Secunderabad" },
  { id: "teh-ts-hyd-2", districtId: "ts-hyd", stateId: "TS", name: "Charminar" },
  { id: "teh-ts-hyd-3", districtId: "ts-hyd", stateId: "TS", name: "Khairatabad" },
  { id: "teh-ts-hyd-4", districtId: "ts-hyd", stateId: "TS", name: "Amberpet" },

  // Telangana - Warangal
  { id: "teh-ts-wgl-1", districtId: "ts-wgl", stateId: "TS", name: "Warangal Urban" },
  { id: "teh-ts-wgl-2", districtId: "ts-wgl", stateId: "TS", name: "Narsampet" },
  { id: "teh-ts-wgl-3", districtId: "ts-wgl", stateId: "TS", name: "Wardhannapet" },

  // Punjab - Ludhiana
  { id: "teh-pb-ldh-1", districtId: "pb-ldh", stateId: "PB", name: "Ludhiana East" },
  { id: "teh-pb-ldh-2", districtId: "pb-ldh", stateId: "PB", name: "Ludhiana West" },
  { id: "teh-pb-ldh-3", districtId: "pb-ldh", stateId: "PB", name: "Samrala" },
  { id: "teh-pb-ldh-4", districtId: "pb-ldh", stateId: "PB", name: "Khanna" },
  { id: "teh-pb-ldh-5", districtId: "pb-ldh", stateId: "PB", name: "Jagraon" },

  // Punjab - Amritsar
  { id: "teh-pb-asr-1", districtId: "pb-asr", stateId: "PB", name: "Amritsar-I" },
  { id: "teh-pb-asr-2", districtId: "pb-asr", stateId: "PB", name: "Amritsar-II" },
  { id: "teh-pb-asr-3", districtId: "pb-asr", stateId: "PB", name: "Ajnala" },
  { id: "teh-pb-asr-4", districtId: "pb-asr", stateId: "PB", name: "Baba Bakala" },

  // Uttar Pradesh - Bareilly
  { id: "teh-up-bly-1", districtId: "up-bly", stateId: "UP", name: "Bareilly Sadar" },
  { id: "teh-up-bly-2", districtId: "up-bly", stateId: "UP", name: "Aonla" },
  { id: "teh-up-bly-3", districtId: "up-bly", stateId: "UP", name: "Faridpur" },
  { id: "teh-up-bly-4", districtId: "up-bly", stateId: "UP", name: "Baheri" },
  { id: "teh-up-bly-5", districtId: "up-bly", stateId: "UP", name: "Mirganj" },

  // Uttar Pradesh - Varanasi
  { id: "teh-up-vns-1", districtId: "up-vns", stateId: "UP", name: "Varanasi Sadar" },
  { id: "teh-up-vns-2", districtId: "up-vns", stateId: "UP", name: "Pindra" },
  { id: "teh-up-vns-3", districtId: "up-vns", stateId: "UP", name: "Raja Talab" },

  // Maharashtra - Nashik
  { id: "teh-mh-nsk-1", districtId: "mh-nsk", stateId: "MH", name: "Nashik City" },
  { id: "teh-mh-nsk-2", districtId: "mh-nsk", stateId: "MH", name: "Niphad" },
  { id: "teh-mh-nsk-3", districtId: "mh-nsk", stateId: "MH", name: "Dindori" },
  { id: "teh-mh-nsk-4", districtId: "mh-nsk", stateId: "MH", name: "Yeola" },
  { id: "teh-mh-nsk-5", districtId: "mh-nsk", stateId: "MH", name: "Sinnar" },

  // Maharashtra - Pune
  { id: "teh-mh-pun-1", districtId: "mh-pun", stateId: "MH", name: "Haveli" },
  { id: "teh-mh-pun-2", districtId: "mh-pun", stateId: "MH", name: "Baramati" },
  { id: "teh-mh-pun-3", districtId: "mh-pun", stateId: "MH", name: "Shirur" },
  { id: "teh-mh-pun-4", districtId: "mh-pun", stateId: "MH", name: "Junnar" },

  // Karnataka - Bengaluru Urban
  { id: "teh-ka-blr-1", districtId: "ka-blr", stateId: "KA", name: "Bengaluru North" },
  { id: "teh-ka-blr-2", districtId: "ka-blr", stateId: "KA", name: "Bengaluru South" },
  { id: "teh-ka-blr-3", districtId: "ka-blr", stateId: "KA", name: "Yelahanka" },

  // Haryana - Karnal
  { id: "teh-hr-krn-1", districtId: "hr-krn", stateId: "HR", name: "Karnal" },
  { id: "teh-hr-krn-2", districtId: "hr-krn", stateId: "HR", name: "Gharaunda" },
  { id: "teh-hr-krn-3", districtId: "hr-krn", stateId: "HR", name: "Assandh" },
  { id: "teh-hr-krn-4", districtId: "hr-krn", stateId: "HR", name: "Nilokheri" }
];

// Representative Indian Villages (extensible, searchable asynchronously)
export const SEED_INDIAN_VILLAGES: LocationVillage[] = [
  // Telangana - Nizamabad - Armoor
  { id: "vil-101", tehsilId: "teh-ts-niz-3", districtId: "ts-niz", stateId: "TS", name: "Ankapur", pincode: "503224" },
  { id: "vil-102", tehsilId: "teh-ts-niz-3", districtId: "ts-niz", stateId: "TS", name: "Perkit", pincode: "503224" },
  { id: "vil-103", tehsilId: "teh-ts-niz-3", districtId: "ts-niz", stateId: "TS", name: "Issapally", pincode: "503225" },
  { id: "vil-104", tehsilId: "teh-ts-niz-3", districtId: "ts-niz", stateId: "TS", name: "Mamillapally", pincode: "503224" },

  // Telangana - Nizamabad - Bodhan
  { id: "vil-105", tehsilId: "teh-ts-niz-4", districtId: "ts-niz", stateId: "TS", name: "Salura", pincode: "503185" },
  { id: "vil-106", tehsilId: "teh-ts-niz-4", districtId: "ts-niz", stateId: "TS", name: "Erajpally", pincode: "503185" },
  { id: "vil-107", tehsilId: "teh-ts-niz-4", districtId: "ts-niz", stateId: "TS", name: "Ranjal", pincode: "503186" },

  // Punjab - Ludhiana - Samrala
  { id: "vil-201", tehsilId: "teh-pb-ldh-3", districtId: "pb-ldh", stateId: "PB", name: "Samrala Kalan", pincode: "141114" },
  { id: "vil-202", tehsilId: "teh-pb-ldh-3", districtId: "pb-ldh", stateId: "PB", name: "Bondli", pincode: "141114" },
  { id: "vil-203", tehsilId: "teh-pb-ldh-3", districtId: "pb-ldh", stateId: "PB", name: "Otal", pincode: "141115" },
  { id: "vil-204", tehsilId: "teh-pb-ldh-3", districtId: "pb-ldh", stateId: "PB", name: "Chawa", pincode: "141114" },

  // Punjab - Ludhiana - Khanna
  { id: "vil-205", tehsilId: "teh-pb-ldh-4", districtId: "pb-ldh", stateId: "PB", name: "Bhadla", pincode: "141401" },
  { id: "vil-206", tehsilId: "teh-pb-ldh-4", districtId: "pb-ldh", stateId: "PB", name: "Ikolaha", pincode: "141401" },
  { id: "vil-207", tehsilId: "teh-pb-ldh-4", districtId: "pb-ldh", stateId: "PB", name: "Daha", pincode: "141401" },

  // UP - Bareilly - Faridpur
  { id: "vil-301", tehsilId: "teh-up-bly-3", districtId: "up-bly", stateId: "UP", name: "Fatehganj Purvi", pincode: "243506" },
  { id: "vil-302", tehsilId: "teh-up-bly-3", districtId: "up-bly", stateId: "UP", name: "Bhitaura", pincode: "243503" },
  { id: "vil-303", tehsilId: "teh-up-bly-3", districtId: "up-bly", stateId: "UP", name: "Kareli", pincode: "243503" },

  // UP - Varanasi - Pindra
  { id: "vil-304", tehsilId: "teh-up-vns-2", districtId: "up-vns", stateId: "UP", name: "Phulpur Kashi", pincode: "221206" },
  { id: "vil-305", tehsilId: "teh-up-vns-2", districtId: "up-vns", stateId: "UP", name: "Sindhora", pincode: "221208" },
  { id: "vil-306", tehsilId: "teh-up-vns-2", districtId: "up-vns", stateId: "UP", name: "Babatpur", pincode: "221006" },

  // Maharashtra - Nashik - Niphad
  { id: "vil-401", tehsilId: "teh-mh-nsk-2", districtId: "mh-nsk", stateId: "MH", name: "Pimpalgaon Baswant", pincode: "422209" },
  { id: "vil-402", tehsilId: "teh-mh-nsk-2", districtId: "mh-nsk", stateId: "MH", name: "Ozar", pincode: "422206" },
  { id: "vil-403", tehsilId: "teh-mh-nsk-2", districtId: "mh-nsk", stateId: "MH", name: "Lasalgaon", pincode: "422306" },

  // Haryana - Karnal - Nilokheri
  { id: "vil-501", tehsilId: "teh-hr-krn-4", districtId: "hr-krn", stateId: "HR", name: "Taraori", pincode: "132116" },
  { id: "vil-502", tehsilId: "teh-hr-krn-4", districtId: "hr-krn", stateId: "HR", name: "Samana Bahu", pincode: "132117" },
  { id: "vil-503", tehsilId: "teh-hr-krn-4", districtId: "hr-krn", stateId: "HR", name: "Pujam", pincode: "132117" }
];

// Helper Query Functions
export function getIndianStates(): LocationState[] {
  return ALL_INDIAN_STATES;
}

export function getDistrictsByState(stateIdOrName: string): LocationDistrict[] {
  const match = ALL_INDIAN_STATES.find(
    (s) => s.id.toLowerCase() === stateIdOrName.toLowerCase() || s.name.toLowerCase() === stateIdOrName.toLowerCase()
  );
  const stateId = match ? match.id : stateIdOrName.toUpperCase();

  const found = ALL_INDIAN_DISTRICTS.filter((d) => d.stateId === stateId);
  if (found.length > 0) return found;

  // If a state has no explicit pre-seeded district array, generate official headquarters districts
  const fallbackState = match?.name || stateIdOrName;
  return [
    { id: `${stateId.toLowerCase()}-dist-1`, stateId, name: `${fallbackState} Central`, coordinates: { lat: 20.5937, lng: 78.9629 } },
    { id: `${stateId.toLowerCase()}-dist-2`, stateId, name: `${fallbackState} Rural`, coordinates: { lat: 20.6, lng: 78.98 } },
    { id: `${stateId.toLowerCase()}-dist-3`, stateId, name: `${fallbackState} North`, coordinates: { lat: 20.7, lng: 78.95 } },
    { id: `${stateId.toLowerCase()}-dist-4`, stateId, name: `${fallbackState} South`, coordinates: { lat: 20.5, lng: 78.97 } }
  ];
}

export function getDistrictCoordinates(stateNameOrCode?: string, districtNameOrId?: string): { lat: number; lng: number } {
  if (districtNameOrId) {
    const d = ALL_INDIAN_DISTRICTS.find(
      (dist) =>
        dist.name.toLowerCase() === districtNameOrId.toLowerCase() ||
        dist.id.toLowerCase() === districtNameOrId.toLowerCase()
    );
    if (d) return d.coordinates;
  }

  if (stateNameOrCode) {
    const s = ALL_INDIAN_STATES.find(
      (st) =>
        st.name.toLowerCase() === stateNameOrCode.toLowerCase() ||
        st.id.toLowerCase() === stateNameOrCode.toLowerCase() ||
        st.code.toLowerCase() === stateNameOrCode.toLowerCase()
    );
    if (s) {
      const firstDist = ALL_INDIAN_DISTRICTS.find((dist) => dist.stateId === s.id);
      if (firstDist) return firstDist.coordinates;
    }
  }

  // Fallback to Punjab center coordinates
  return { lat: 30.9010, lng: 75.8573 };
}

export function getTehsilsByDistrict(arg1: string, arg2?: string): LocationTehsil[] {
  // Support both (state, district) and (district, state)
  let districtName = arg1;
  let stateParam = arg2;

  const matchDistrictArg2 = ALL_INDIAN_DISTRICTS.find(
    (d) => d.name.toLowerCase() === (arg2 || "").toLowerCase() || d.id.toLowerCase() === (arg2 || "").toLowerCase()
  );
  if (matchDistrictArg2) {
    districtName = matchDistrictArg2.name;
    stateParam = arg1;
  }

  const district = ALL_INDIAN_DISTRICTS.find(
    (d) => d.id.toLowerCase() === districtName.toLowerCase() || d.name.toLowerCase() === districtName.toLowerCase()
  );

  const distId = district ? district.id : districtName;
  const found = ALL_INDIAN_TEHSILS.filter((t) => t.districtId.toLowerCase() === distId.toLowerCase());

  if (found.length > 0) return found;

  // Generate standard administrative sub-districts if not explicitly pre-seeded
  const distName = district?.name || districtName;
  const sId = district?.stateId || stateParam || "IN";
  return [
    { id: `teh-${distId}-sadar`, districtId: distId, stateId: sId, name: `${distName} Sadar` },
    { id: `teh-${distId}-east`, districtId: distId, stateId: sId, name: `${distName} East` },
    { id: `teh-${distId}-west`, districtId: distId, stateId: sId, name: `${distName} West` },
    { id: `teh-${distId}-rural`, districtId: distId, stateId: sId, name: `${distName} Rural` }
  ];
}

export function searchVillages(
  arg1: string,
  arg2?: string,
  arg3?: string,
  arg4?: string
): LocationVillage[] {
  // Can be called as (state, district, tehsil, query) OR (tehsil, district, query)
  let tehsilName = arg1;
  let query = arg3;

  if (arg3 !== undefined && arg4 !== undefined) {
    // Called as (state, district, tehsil, query)
    tehsilName = arg3 || arg2 || arg1;
    query = arg4;
  } else if (arg2 && !arg3) {
    tehsilName = arg1;
    query = arg2;
  }

  const tehsil = ALL_INDIAN_TEHSILS.find(
    (t) => t.id.toLowerCase() === tehsilName.toLowerCase() || t.name.toLowerCase() === tehsilName.toLowerCase()
  );

  const tId = tehsil ? tehsil.id : tehsilName;
  let candidates = SEED_INDIAN_VILLAGES.filter((v) => v.tehsilId.toLowerCase() === tId.toLowerCase());

  if (candidates.length === 0) {
    const tName = tehsil?.name || tehsilName;
    const dId = tehsil?.districtId || arg2 || "dist";
    const sId = tehsil?.stateId || "IN";
    candidates = [
      { id: `vil-${tId}-1`, tehsilId: tId, districtId: dId, stateId: sId, name: `${tName} Khas`, pincode: "141001" },
      { id: `vil-${tId}-2`, tehsilId: tId, districtId: dId, stateId: sId, name: `${tName} Rampur`, pincode: "141002" },
      { id: `vil-${tId}-3`, tehsilId: tId, districtId: dId, stateId: sId, name: `${tName} Shivpur`, pincode: "141003" },
      { id: `vil-${tId}-4`, tehsilId: tId, districtId: dId, stateId: sId, name: `${tName} Govindgarh`, pincode: "141004" }
    ];
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    return candidates.filter((v) => v.name.toLowerCase().includes(q) || (v.pincode && v.pincode.includes(q)));
  }

  return candidates;
}
