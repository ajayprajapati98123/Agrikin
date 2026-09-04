"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "../../components/brand-logo";
import { AuthService } from "../../lib/services/auth.service";
import { useApp } from "../../lib/store/app-store";
import { useLanguage } from "../../lib/i18n/i18n-context";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useApp();
  const { t } = useLanguage();

  const [email, setEmail] = useState("kisan@agrikin.in");
  const [password, setPassword] = useState("farmer123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    const res = AuthService.login(email, password);

    if (res.success && res.user) {
      setCurrentUser(res.user);
      router.push("/dashboard");
    } else {
      setError(res.error || "Authentication failed. Please check credentials.");
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("kisan@agrikin.in");
    setPassword("farmer123");
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-stone-100 via-emerald-50/30 to-stone-100 dark:from-emerald-950 dark:via-emerald-900/30 dark:to-emerald-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Centered Glass / Soft Card */}
        <div className="relative rounded-3xl bg-white/90 dark:bg-emerald-900/70 backdrop-blur-xl p-8 sm:p-10 shadow-2xl border border-emerald-500/20 text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <BrandLogo size="lg" showWordmark={true} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              ȺցɾìҠìղ Login
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Sign in to manage your farm, check live weather & match with traders.
            </p>
          </div>

          {/* 1-Click Demo Fill Banner */}
          <button
            type="button"
            onClick={fillDemoAccount}
            className="w-full py-2 px-3 bg-emerald-100/70 dark:bg-emerald-800/40 hover:bg-emerald-200/60 dark:hover:bg-emerald-700/50 rounded-xl border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
            <span>Click to autofill sample farmer credentials</span>
          </button>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
            {/* Email Address */}
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                📧 Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kisan@agrikin.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-950 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">
                  🔒 Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Password reset token dispatched to registered mobile number.")}
                  className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
                >
                  Forgot your password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-950 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Log In"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Bottom Link to Signup */}
          <div className="pt-4 border-t border-stone-200 dark:border-emerald-800/80 text-xs text-stone-500 dark:text-stone-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
