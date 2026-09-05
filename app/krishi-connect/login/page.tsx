"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../../lib/store/app-store";
import { KrishiConnectService, initialKrishiProfiles } from "../../../lib/services/krishi-connect.service";
import { BrandLogo } from "../../../components/brand-logo";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sprout,
  Users,
  Compass,
  CheckCircle2,
  Lock,
  Mail,
  HelpCircle,
} from "lucide-react";

export default function KrishiConnectLoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/krishi-connect/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Login failed");
      }

      // Save active Krishi Connect profile & sync platform user
      KrishiConnectService.setActiveProfile(data.profile);
      if (setCurrentUser) {
        setCurrentUser({
          id: data.profile.id,
          name: data.profile.name,
          email: data.profile.email,
          phone: data.profile.phone,
          state: data.profile.state,
          district: data.profile.district,
          crops: data.profile.crops || [],
          age: data.profile.age || 35,
          role: data.profile.role,
          bio: data.profile.bio,
          avatarUrl: data.profile.photo,
          experience: data.profile.experience,
          createdAt: data.profile.createdAt,
        });
      }

      router.push("/krishi-connect");
    } catch (err: any) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (profileId: string) => {
    const profile = initialKrishiProfiles.find((p) => p.id === profileId);
    if (profile) {
      setEmail(profile.email);
      setPassword("kisanPass123");
      KrishiConnectService.setActiveProfile(profile);
      if (setCurrentUser) {
        setCurrentUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          state: profile.state,
          district: profile.district,
          crops: profile.crops || [],
          age: profile.age || 40,
          role: profile.role,
          bio: profile.bio,
          avatarUrl: profile.photo,
          experience: profile.experience,
          createdAt: profile.createdAt,
        });
      }
      setTimeout(() => router.push("/krishi-connect"), 400);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#FAF7F0] via-[#ECFEFF]/25 to-[#FAF7F0] dark:from-[#062834] dark:via-[#083344] dark:to-[#062834] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-700 text-cyan-950 dark:text-cyan-200 text-xs font-bold shadow-2xs">
          <Sprout className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
          <span>🌾 कृषि कनेक्ट • Krishi Connect</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
          Krishi Connect Sign In
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-sm mx-auto">
          Sign in to access your agricultural network, marketplace listings, and direct farmer connections.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#FFFEFD] dark:bg-[#083344]/95 backdrop-blur-md py-8 px-6 sm:px-10 rounded-3xl border border-[#EAE3D5] dark:border-cyan-800 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. kisan@agrikin.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE3D5] dark:border-cyan-800 bg-[#FAF7F0] dark:bg-cyan-950/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200">
                  Password
                </label>
                <span className="text-[11px] text-stone-400">Min. 6 characters</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secret password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#EAE3D5] dark:border-cyan-800 bg-[#FAF7F0] dark:bg-cyan-950/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-extrabold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Krishi Connect</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Sign-in Helpers for Testing */}
          <div className="pt-4 border-t border-[#EAE3D5] dark:border-cyan-900">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              <span>Quick Demo Profiles (1-Click Test)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("kc-seller-1")}
                className="p-2.5 rounded-xl border border-cyan-200 dark:border-cyan-800/80 bg-cyan-50/60 dark:bg-cyan-900/30 hover:bg-cyan-100 text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-cyan-900 dark:text-cyan-200 truncate">
                  🌾 Farmer / Seller
                </div>
                <div className="text-[10px] text-stone-500 truncate">Gurpreet (Ludhiana)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("kc-buyer-1")}
                className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/80 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100 text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-amber-900 dark:text-amber-200 truncate">
                  🏢 Buyer / Processor
                </div>
                <div className="text-[10px] text-stone-500 truncate">Golden Grains Ltd</div>
              </button>
            </div>
          </div>

          {/* Links to Signup & Main Portal */}
          <div className="space-y-2 pt-2 text-center text-xs">
            <p className="text-stone-600 dark:text-stone-400">
              Don&apos;t have a Krishi Connect account?{" "}
              <Link
                href="/krishi-connect/signup"
                className="font-bold text-cyan-700 dark:text-cyan-400 hover:underline"
              >
                Register here (4-Step Verification)
              </Link>
            </p>
            <p className="text-stone-500 dark:text-stone-500 text-[11px]">
              Looking for main platform login?{" "}
              <Link href="/login" className="text-stone-700 dark:text-stone-300 font-semibold hover:underline">
                ȺցɾìҠìղ Central Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
