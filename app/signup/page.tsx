"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "../../components/brand-logo";
import { AuthService } from "../../lib/services/auth.service";
import { indianStatesAndDistricts } from "../../lib/services/location.service";
import { useApp } from "../../lib/store/app-store";
import { useLanguage } from "../../lib/i18n/i18n-context";
import { Eye, EyeOff, User, Phone, Mail, Lock, MapPin, Sprout, AlertCircle, Check } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { setCurrentUser } = useApp();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    state: "Punjab",
    district: "Ludhiana",
    crops: ["Wheat", "Basmati Rice"],
    age: "38",
    role: "farmer" as "farmer" | "buyer" | "seller",
  });

  const [cropInput, setCropInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedStateObj = indianStatesAndDistricts.find((s) => s.state === formData.state);
  const districtOptions = selectedStateObj ? selectedStateObj.districts : ["Ludhiana", "Amritsar"];

  const handleAddCrop = () => {
    if (cropInput.trim() && !formData.crops.includes(cropInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        crops: [...prev.crops, cropInput.trim()],
      }));
      setCropInput("");
    }
  };

  const handleRemoveCrop = (cropToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      crops: prev.crops.filter((c) => c !== cropToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.crops.length === 0) {
      setError("Please specify at least one crop.");
      return;
    }

    setLoading(true);
    const res = AuthService.signUp({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      state: formData.state,
      district: formData.district,
      crops: formData.crops,
      age: parseInt(formData.age, 10) || 35,
      role: formData.role,
    });

    if (res.success && res.user) {
      setCurrentUser(res.user);
      router.push("/dashboard");
    } else {
      setError(res.error || "Failed to create account. Please review details.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-[#FAF7F0] via-[#F3EFE6] to-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-[#FFFEFD] rounded-3xl shadow-2xl border border-[#EAE3D5] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Indian Farmer Illustration & Agricultural Scenery */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#083344] via-[#0E5266] to-[#042129] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Agricultural Graphic Overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-4">
            <BrandLogo size="md" showWordmark={true} />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-6">
              Empowering India's Kisan Community
            </h2>
            <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed">
              "Technology should empower the farmer, not replace the farmer." Join a nationwide network of progressive cultivators, buyers, and agricultural scientists.
            </p>
          </div>

          {/* Farmer Artwork Card */}
          <div className="relative z-10 my-8 bg-[#041E27]/80 border border-cyan-400/30 rounded-2xl p-4 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80"
                alt="Indian Farmer"
                className="w-14 h-14 rounded-full object-cover border-2 border-cyan-300 shadow-md"
              />
              <div>
                <div className="font-bold text-sm text-white">Sukhwinder Singh</div>
                <div className="text-xs text-cyan-200">Ludhiana, Punjab</div>
                <div className="text-[10px] text-cyan-300 font-semibold mt-0.5">🌾 Organic Basmati & Wheat</div>
              </div>
            </div>
            <p className="text-xs text-stone-300 italic">
              "ȺցɾìҠìղ gave me direct buyer contacts in Delhi and helped me detect yellow rust two weeks before it could damage my wheat yield."
            </p>
          </div>

          <div className="relative z-10 text-[11px] text-cyan-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-cyan-400" />
            <span>Encrypted & Privacy-First Architecture</span>
          </div>
        </div>

        {/* Right: Registration Card */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-[#FFFEFD]">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Join ȺցɾìҠìղ
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Create your farmer profile to access AI tools, direct matchmaking & live weather.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rameshwar Patil"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EAE3D5] bg-[#FAF7F0] text-stone-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EAE3D5] bg-[#FAF7F0] text-stone-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="kisan@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EAE3D5] bg-[#FAF7F0] text-stone-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#EAE3D5] bg-[#FAF7F0] text-stone-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
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
            </div>

            {/* State & District */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  State *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => {
                    const newState = e.target.value;
                    const st = indianStatesAndDistricts.find((s) => s.state === newState);
                    setFormData({
                      ...formData,
                      state: newState,
                      district: st ? st.districts[0] : "Ludhiana",
                    });
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EAE3D5] bg-[#FAF7F0] text-stone-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  {indianStatesAndDistricts.map((s) => (
                    <option key={s.state} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  District *
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EAE3D5] bg-[#FAF7F0] text-stone-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  {districtOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="90"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EAE3D5] bg-[#FAF7F0] text-stone-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Role Choice */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                I am primarily a *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "farmer", label: "Farmer / Producer" },
                  { id: "buyer", label: "Crop Buyer / Mandi Trader" },
                  { id: "seller", label: "Agri-Input Provider" },
                ].map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setFormData({ ...formData, role: r.id as any })}
                    className={`py-2 px-2 text-center rounded-xl border font-semibold transition-all ${formData.role === r.id
                      ? "bg-gradient-to-r from-cyan-800 to-teal-800 text-white border-cyan-800"
                      : "bg-[#FAF7F0] text-stone-700 border-[#EAE3D5] hover:border-cyan-400"
                      }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Crops Growing */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Crops You're Growing *
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={cropInput}
                  onChange={(e) => setCropInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCrop())}
                  placeholder="e.g. Cotton, Mustard, Sugarcane..."
                  className="flex-1 px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FAF7F0] text-stone-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCrop}
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl transition-colors"
                >
                  Add Crop
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.crops.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-900 border border-cyan-200 px-2.5 py-1 rounded-lg font-medium"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => handleRemoveCrop(c)}
                      className="text-cyan-700 hover:text-red-600 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-800 to-teal-800 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? "Registering Farmer Profile..." : "🌱 Sign Up"}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center text-xs text-stone-500">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-700 font-bold hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
