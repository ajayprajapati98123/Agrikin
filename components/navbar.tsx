"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./brand-logo";
import { NotificationsDropdown } from "./notifications-dropdown";
import { useLanguage } from "../lib/i18n/i18n-context";
import { useApp } from "../lib/store/app-store";
import { AuthService } from "../lib/services/auth.service";
import { Globe, Menu, X, User as UserIcon, LogOut, ChevronDown } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, setCurrentUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: t("navDashboard") },
    { href: "/krishi-connect", label: t("navKrishiConnect") },
    { href: "/detections", label: t("navDetections") },
    { href: "/govt-schemes", label: t("navGovtSchemes") },
    { href: "/farming-methods", label: t("navFarmingMethods") },
    { href: "/cropify", label: t("navCropify") },
    { href: "/weather", label: t("navWeather") },
  ];

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setProfileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#071411]/92 backdrop-blur-md border-b border-[#D4AF37]/25 transition-colors shadow-lg shadow-black/25">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 h-18 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <BrandLogo size="md" showWordmark={true} href="/" />

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs font-bold"
                    : "text-stone-300 hover:text-[#D4AF37] hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Language Toggle, Notifications, Profile/Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bilingual Switch: English | हिंदी */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-[#D4AF37]/30 text-xs">
            <Globe className="w-3.5 h-3.5 text-[#D4AF37] ml-1.5 mr-1" />
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                language === "en"
                  ? "bg-gradient-to-r from-[#F5DE98] to-[#D4AF37] text-[#071411] shadow-xs font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                language === "hi"
                  ? "bg-gradient-to-r from-[#F5DE98] to-[#D4AF37] text-[#071411] shadow-xs font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Agricultural Notifications */}
          <NotificationsDropdown />

          {/* User Profile / Auth State */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/5 border border-[#D4AF37]/30 transition-colors"
                aria-label="User Profile Menu"
              >
                <img
                  src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=100"}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]"
                />
                <span className="hidden md:inline text-xs font-semibold text-stone-100 max-w-[120px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37] hidden md:inline" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0C1E1A] shadow-2xl border border-[#D4AF37]/30 py-2 z-50 animate-fadeIn text-stone-200">
                  <div className="px-4 py-2 border-b border-white/10">
                    <div className="text-xs font-bold text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-[#D4AF37] capitalize">
                      {currentUser.role} • {currentUser.district}
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-200 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37]"
                  >
                    <span>📊</span> {t("navDashboard")}
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-200 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37]"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#D4AF37]" /> {t("navProfile")}
                  </Link>
                  <Link
                    href="/krishi-connect"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-200 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37]"
                  >
                    <span>🌾</span> <span>Krishi Connect</span>
                  </Link>
                  <Link
                    href="/krishi-connect/chats"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-200 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37]"
                  >
                    <span>💬</span> <span>Trade Chats</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-red-950/40 text-left border-t border-white/10 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> {t("navLogout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-bold text-stone-200 hover:text-[#D4AF37] rounded-xl transition-colors"
              >
                {t("navLogin")}
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 text-xs font-bold text-[#071411] bg-gradient-to-r from-[#F5DE98] to-[#D4AF37] hover:brightness-110 rounded-xl shadow-xs transition-all"
              >
                {t("navSignup")}
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-cyan-50 dark:hover:bg-cyan-900/40 transition-colors"
            aria-label="Open mobile navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FAF7F0] dark:bg-[#082933] border-b border-[#EAE3D5] dark:border-cyan-800 px-4 pt-2 pb-6 space-y-1 shadow-lg animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-800 dark:text-stone-100 hover:bg-cyan-50 dark:hover:bg-cyan-900/40"
            >
              {link.label}
            </Link>
          ))}
          {!currentUser && (
            <div className="pt-3 border-t border-[#EAE3D5] dark:border-cyan-800 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-bold text-cyan-900 bg-cyan-50 rounded-xl border border-cyan-200"
              >
                {t("navLogin")}
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-700 to-teal-700 rounded-xl shadow-xs"
              >
                {t("navSignup")}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
