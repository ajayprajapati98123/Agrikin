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
  "Ludhiana": { lat: 30.9010, lng: 75.8573 },
  "Amritsar": { lat: 31.6340, lng: 74.8723 },
  "Karnal": { lat: 29.6857, lng: 76.9905 },
  "Hisar": { lat: 29.1492, lng: 75.7217 },
  "Varanasi": { lat: 25.3176, lng: 82.9739 },
  "Lucknow": { lat: 26.8467, lng: 80.9462 },
  "Nashik": { lat: 19.9975, lng: 73.7898 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Indore": { lat: 22.7196, lng: 75.8577 },
  "Bhopal": { lat: 23.2599, lng: 77.4126 },
  "Rajkot": { lat: 22.3039, lng: 70.8022 },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Thanjavur": { lat: 10.7870, lng: 79.1378 },
  "Guntur": { lat: 16.3067, lng: 80.4365 },
  "Bengaluru Rural": { lat: 13.2284, lng: 77.5819 }
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
