export interface IndianDistrict {
  state: string;
  districts: string[];
}

export const indianStatesAndDistricts: IndianDistrict[] = [
  {
    state: "Punjab",
    districts: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Sangrur", "Firozpur"]
  },
  {
    state: "Haryana",
    districts: ["Karnal", "Hisar", "Ambala", "Rohtak", "Sirsa", "Kurukshetra", "Panipat"]
  },
  {
    state: "Uttar Pradesh",
    districts: ["Varanasi", "Lucknow", "Agra", "Kanpur", "Prayagraj", "Meerut", "Bareilly", "Gorakhpur"]
  },
  {
    state: "Maharashtra",
    districts: ["Nashik", "Pune", "Nagpur", "Aurangabad (Chhatrapati Sambhaji Nagar)", "Solapur", "Kolhapur", "Amravati"]
  },
  {
    state: "Madhya Pradesh",
    districts: ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Gwalior", "Hoshangabad (Narmadapuram)", "Dewas"]
  },
  {
    state: "Gujarat",
    districts: ["Rajkot", "Ahmedabad", "Surat", "Vadodara", "Junagadh", "Bhavnagar", "Mehsana"]
  },
  {
    state: "Rajasthan",
    districts: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Sri Ganganagar", "Udaipur", "Alwar"]
  },
  {
    state: "Karnataka",
    districts: ["Bengaluru Rural", "Belagavi", "Mysuru", "Dharwad", "Shivamogga", "Ballari", "Vijayapura"]
  },
  {
    state: "Tamil Nadu",
    districts: ["Thanjavur", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Dindigul"]
  },
  {
    state: "Andhra Pradesh",
    districts: ["Guntur", "Krishna", "East Godavari", "West Godavari", "Kurnool", "Anantapur"]
  }
];

export const districtCoordinates: Record<string, { lat: number; lng: number }> = {
  // Punjab
  "Ludhiana": { lat: 30.9010, lng: 75.8573 },
  "Amritsar": { lat: 31.6340, lng: 74.8723 },
  "Jalandhar": { lat: 31.3260, lng: 75.5762 },
  "Patiala": { lat: 30.3398, lng: 76.3869 },
  "Bathinda": { lat: 30.2110, lng: 74.9455 },
  "Sangrur": { lat: 30.2458, lng: 75.8421 },
  "Firozpur": { lat: 30.9237, lng: 74.6114 },

  // Haryana
  "Karnal": { lat: 29.6857, lng: 76.9905 },
  "Hisar": { lat: 29.1492, lng: 75.7217 },
  "Ambala": { lat: 30.3782, lng: 76.7767 },
  "Rohtak": { lat: 28.8955, lng: 76.6066 },
  "Sirsa": { lat: 29.5349, lng: 75.0287 },
  "Kurukshetra": { lat: 29.9695, lng: 76.8783 },
  "Panipat": { lat: 29.3909, lng: 76.9635 },

  // Uttar Pradesh
  "Varanasi": { lat: 25.3176, lng: 82.9739 },
  "Lucknow": { lat: 26.8467, lng: 80.9462 },
  "Agra": { lat: 27.1767, lng: 78.0081 },
  "Kanpur": { lat: 26.4499, lng: 80.3319 },
  "Prayagraj": { lat: 25.4358, lng: 81.8463 },
  "Meerut": { lat: 28.9845, lng: 77.7064 },
  "Bareilly": { lat: 28.3670, lng: 79.4304 },
  "Gorakhpur": { lat: 26.7606, lng: 83.3732 },

  // Maharashtra
  "Nashik": { lat: 19.9975, lng: 73.7898 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Nagpur": { lat: 21.1458, lng: 79.0882 },
  "Aurangabad (Chhatrapati Sambhaji Nagar)": { lat: 19.8762, lng: 75.3433 },
  "Solapur": { lat: 17.6599, lng: 75.9064 },
  "Kolhapur": { lat: 16.7050, lng: 74.2433 },
  "Amravati": { lat: 20.9320, lng: 77.7523 },

  // Madhya Pradesh
  "Indore": { lat: 22.7196, lng: 75.8577 },
  "Bhopal": { lat: 23.2599, lng: 77.4126 },
  "Ujjain": { lat: 23.1765, lng: 75.7885 },
  "Jabalpur": { lat: 23.1815, lng: 79.9864 },
  "Gwalior": { lat: 26.2183, lng: 78.1828 },
  "Hoshangabad (Narmadapuram)": { lat: 22.7519, lng: 77.7289 },
  "Dewas": { lat: 22.9676, lng: 76.0534 },

  // Gujarat
  "Rajkot": { lat: 22.3039, lng: 70.8022 },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Surat": { lat: 21.1702, lng: 72.8311 },
  "Vadodara": { lat: 22.3072, lng: 73.1812 },
  "Junagadh": { lat: 21.5222, lng: 70.4579 },
  "Bhavnagar": { lat: 21.7645, lng: 72.1519 },
  "Mehsana": { lat: 23.5880, lng: 72.3693 },

  // Rajasthan
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Jodhpur": { lat: 26.2389, lng: 73.0243 },
  "Kota": { lat: 25.2138, lng: 75.8648 },
  "Bikaner": { lat: 28.0229, lng: 73.3119 },
  "Sri Ganganagar": { lat: 29.9094, lng: 73.8799 },
  "Udaipur": { lat: 24.5854, lng: 73.7125 },
  "Alwar": { lat: 27.5530, lng: 76.6346 },

  // Karnataka
  "Bengaluru Rural": { lat: 13.2284, lng: 77.5819 },
  "Belagavi": { lat: 15.8497, lng: 74.4977 },
  "Mysuru": { lat: 12.2958, lng: 76.6394 },
  "Dharwad": { lat: 15.4589, lng: 75.0078 },
  "Shivamogga": { lat: 13.9299, lng: 75.5681 },
  "Ballari": { lat: 15.1394, lng: 76.9214 },
  "Vijayapura": { lat: 16.8302, lng: 75.7100 },

  // Tamil Nadu
  "Thanjavur": { lat: 10.7870, lng: 79.1378 },
  "Coimbatore": { lat: 11.0168, lng: 76.9558 },
  "Madurai": { lat: 9.9252, lng: 78.1198 },
  "Tiruchirappalli": { lat: 10.7905, lng: 78.7047 },
  "Salem": { lat: 11.6643, lng: 78.1460 },
  "Erode": { lat: 11.3410, lng: 77.7172 },
  "Dindigul": { lat: 10.3673, lng: 77.9803 },

  // Andhra Pradesh
  "Guntur": { lat: 16.3067, lng: 80.4365 },
  "Krishna": { lat: 16.1809, lng: 81.1303 },
  "East Godavari": { lat: 17.0005, lng: 81.8040 },
  "West Godavari": { lat: 16.7107, lng: 81.0952 },
  "Kurnool": { lat: 15.8281, lng: 78.0373 },
  "Anantapur": { lat: 14.6819, lng: 77.6006 }
};

/**
 * Calculates distance in kilometers between two coordinates using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined || isNaN(distanceKm)) return "Location nearby";
  return `${distanceKm.toFixed(1)} km away`;
}
