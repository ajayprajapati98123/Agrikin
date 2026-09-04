import { User } from "../types";

const STORAGE_KEY_USER = "agrikin_auth_user";
const STORAGE_KEY_TOKEN = "agrikin_auth_token";

export class AuthService {
  /**
   * Returns current logged-in user or default sample demo user
   */
  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(STORAGE_KEY_USER);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    // Default seed user so the user can test the app without being locked out!
    const defaultUser: User = {
      id: "usr-demo-1",
      name: "Sukhwinder Singh",
      email: "kisan@agrikin.in",
      phone: "+91 98765 43210",
      state: "Punjab",
      district: "Ludhiana",
      crops: ["Wheat", "Basmati Rice", "Mustard"],
      age: 42,
      role: "farmer",
      bio: "Progressive farmer adopting organic amendments, zero-tillage wheat sowing, and solar irrigation systems.",
      avatarUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
      landArea: "12.5 Acres",
      experience: "19 Years",
      createdAt: "2026-01-15T10:00:00Z"
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultUser));
    return defaultUser;
  }

  static signUp(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    state: string;
    district: string;
    crops: string[];
    age: number;
    role?: "farmer" | "buyer" | "seller";
  }): { success: boolean; user?: User; error?: string } {
    if (!userData.name || userData.name.trim().length < 3) {
      return { success: false, error: "Please provide a valid full name (at least 3 characters)." };
    }
    if (!userData.email || !userData.email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (!userData.phone || userData.phone.replace(/\D/g, "").length < 10) {
      return { success: false, error: "Please provide a 10-digit mobile number." };
    }
    if (!userData.password || userData.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }
    if (!userData.state || !userData.district) {
      return { success: false, error: "Please select your state and district." };
    }

    const newUser: User = {
      id: "usr-" + Date.now(),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      phone: userData.phone.trim(),
      state: userData.state,
      district: userData.district,
      crops: userData.crops.length > 0 ? userData.crops : ["Wheat", "Paddy"],
      age: Number(userData.age) || 35,
      role: userData.role || "farmer",
      bio: "Farmer from " + userData.district + ", " + userData.state,
      avatarUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
      landArea: "5 Acres",
      experience: "10 Years",
      createdAt: new Date().toISOString()
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, "jwt-token-" + Date.now());
    }

    return { success: true, user: newUser };
  }

  static login(email: string, pass: string): { success: boolean; user?: User; error?: string } {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (!pass || pass.length < 5) {
      return { success: false, error: "Please enter your password (minimum 6 characters)." };
    }

    // Retrieve existing user or create/update session
    let user = this.getCurrentUser();
    if (user && user.email === email.trim().toLowerCase()) {
      // logged in
    } else {
      user = {
        id: "usr-" + Date.now(),
        name: email.split("@")[0].toUpperCase(),
        email: email.trim().toLowerCase(),
        phone: "+91 98765 00000",
        state: "Punjab",
        district: "Ludhiana",
        crops: ["Wheat", "Mustard"],
        age: 38,
        role: "farmer",
        bio: "Progressive cultivator utilizing ȺցɾìҠìղ digital tools.",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        landArea: "8 Acres",
        experience: "12 Years",
        createdAt: new Date().toISOString()
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TOKEN, "jwt-token-" + Date.now());
    }

    return { success: true, user };
  }

  static updateUserProfile(updatedFields: Partial<User>): User {
    const current = this.getCurrentUser();
    const updated: User = { ...current, ...updatedFields } as User;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    }
    return updated;
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }

  static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(STORAGE_KEY_USER);
  }
}
