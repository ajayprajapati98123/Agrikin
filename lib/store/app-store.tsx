"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AppNotification, FarmerListing } from "../types";
import { AuthService } from "../services/auth.service";
import { initialFarmers } from "../data/farmers-seed";
import { calculateDistanceKm } from "../services/location.service";

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  userCoords: { lat: number; lng: number } | null;
  hasLocationPermission: boolean;
  requestLocation: () => Promise<boolean>;
  farmers: FarmerListing[];
  connectedFarmerIds: string[];
  connectWithFarmer: (farmerId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false);
  const [connectedFarmerIds, setConnectedFarmerIds] = useState<string[]>([]);
  const [farmers, setFarmers] = useState<FarmerListing[]>(initialFarmers);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "notif-1",
      title: "🌦️ Weather Alert: Spray Window Open",
      message: "Morning winds remain under 8 km/h with 0% rain probability. Optimal window for foliar spray.",
      type: "weather",
      timestamp: "15m ago",
      read: false,
      link: "/weather",
    },
    {
      id: "notif-2",
      title: "🌾 Connection Request: Rameshwar Patil",
      message: "Rameshwar Patil (Nashik) requested to connect regarding Grade A Onion harvest supply.",
      type: "connection",
      timestamp: "1h ago",
      read: false,
      link: "/krishi-connect",
    },
    {
      id: "notif-3",
      title: "🏛️ PM-Kisan 17th Installment Credited",
      message: "Direct DBT installment disbursed to Aadhaar-verified beneficiary accounts.",
      type: "system",
      timestamp: "1d ago",
      read: true,
      link: "/govt-schemes/pm-kisan",
    },
  ]);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);

    const savedConnections = localStorage.getItem("agrikin_connections");
    if (savedConnections) {
      try {
        setConnectedFarmerIds(JSON.parse(savedConnections));
      } catch (e) {}
    }
  }, []);

  const requestLocation = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !("geolocation" in navigator)) {
        // Fallback default coordinates (Punjab Agricultural Hub)
        setUserCoords({ lat: 30.9010, lng: 75.8573 });
        setHasLocationPermission(true);
        updateFarmerDistances(30.9010, 75.8573);
        resolve(true);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserCoords({ lat, lng });
          setHasLocationPermission(true);
          updateFarmerDistances(lat, lng);
          resolve(true);
        },
        (err) => {
          console.warn("Geolocation permission not granted, using state center", err);
          // Set sensible fallback coordinates
          const fallbackLat = 30.9010;
          const fallbackLng = 75.8573;
          setUserCoords({ lat: fallbackLat, lng: fallbackLng });
          setHasLocationPermission(true);
          updateFarmerDistances(fallbackLat, fallbackLng);
          resolve(true);
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    });
  };

  const updateFarmerDistances = (userLat: number, userLng: number) => {
    setFarmers((prev) =>
      prev.map((f) => {
        const dist = calculateDistanceKm(userLat, userLng, f.coordinates.lat, f.coordinates.lng);
        return {
          ...f,
          distanceKm: dist,
        };
      })
    );
  };

  const connectWithFarmer = (farmerId: string) => {
    if (!connectedFarmerIds.includes(farmerId)) {
      const updated = [...connectedFarmerIds, farmerId];
      setConnectedFarmerIds(updated);
      localStorage.setItem("agrikin_connections", JSON.stringify(updated));

      // Add connection notification
      const farmer = farmers.find((f) => f.id === farmerId);
      const newNotif: AppNotification = {
        id: "notif-" + Date.now(),
        title: `🤝 Connection Sent: ${farmer?.name || "Farmer"}`,
        message: `Your trade request has been dispatched. You can now chat or start a video call.`,
        type: "connection",
        timestamp: "Just now",
        read: false,
        link: `/krishi-connect/chat/${farmerId}`,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        userCoords,
        hasLocationPermission,
        requestLocation,
        farmers,
        connectedFarmerIds,
        connectWithFarmer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
