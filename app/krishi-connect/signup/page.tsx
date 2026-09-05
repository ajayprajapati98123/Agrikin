"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../../lib/store/app-store";
import {
  ALL_INDIAN_STATES,
  getDistrictsByState,
  getTehsilsByDistrict,
  searchVillages,
  LocationDistrict,
  LocationTehsil,
  LocationVillage,
} from "../../../lib/data/india-locations";
import { KrishiConnectService } from "../../../lib/services/krishi-connect.service";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  User,
  ShieldCheck,
  MapPin,
  Sprout,
  Compass,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building2,
  Briefcase,
  Store,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface SignupFormState {
  // Step 1: Basic
  entityType: "INDIVIDUAL" | "INSTITUTIONAL";
  registrationType: "SELLER" | "BUYER";
  registeredState: string;
  registeredDistrict: string;
  category: string;

  // Step 2: Identity
  firstName: string;
  middleName: string;
  lastName: string;
  guardianRelation: "S/o" | "D/o" | "W/o";
  guardianName: string;
  dob: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  email: string;
  phone: string;

  // Step 3: Address
  permLine1: string;
  permLine2: string;
  permState: string;
  permDistrict: string;
  permTehsil: string;
  permVillage: string;
  permPincode: string;
  currentAddressSameAsPerm: boolean;
  currLine1: string;
  currLine2: string;
  currState: string;
  currDistrict: string;
  currTehsil: string;
  currVillage: string;
  currPincode: string;

  // Step 4: Profile & Trade
  productOrCrop: string;
  quantity: string;
  unit: string;
  priceOrRange: string;
  availabilityOrTimeline: string;
  experience: string;
  bio: string;
  photoUrl: string;
  radiusKm: number;
}

const DRAFT_STORAGE_KEY = "agrikin_krishi_signup_draft_v2";

export default function KrishiConnectSignupPage() {
  const router = useRouter();
  const { setCurrentUser } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<SignupFormState>({
    entityType: "INDIVIDUAL",
    registrationType: "SELLER",
    registeredState: "Punjab",
    registeredDistrict: "Ludhiana",
    category: "Farmer",
    firstName: "",
    middleName: "",
    lastName: "",
    guardianRelation: "S/o",
    guardianName: "",
    dob: "",
    age: 0,
    gender: "Male",
    email: "",
    phone: "",
    permLine1: "",
    permLine2: "",
    permState: "Punjab",
    permDistrict: "Ludhiana",
    permTehsil: "Samrala",
    permVillage: "Samrala Rural",
    permPincode: "141114",
    currentAddressSameAsPerm: true,
    currLine1: "",
    currLine2: "",
    currState: "Punjab",
    currDistrict: "Ludhiana",
    currTehsil: "Samrala",
    currVillage: "Samrala Rural",
    currPincode: "141114",
    productOrCrop: "",
    quantity: "100",
    unit: "Quintals",
    priceOrRange: "",
    availabilityOrTimeline: "Immediate Dispatch",
    experience: "8 Years",
    bio: "",
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
    radiusKm: 50,
  });

  // Cascading location states
  const [regDistricts, setRegDistricts] = useState<LocationDistrict[]>([]);
  const [permDistricts, setPermDistricts] = useState<LocationDistrict[]>([]);
  const [permTehsils, setPermTehsils] = useState<LocationTehsil[]>([]);
  const [permVillages, setPermVillages] = useState<LocationVillage[]>([]);

  const [currDistricts, setCurrDistricts] = useState<LocationDistrict[]>([]);
  const [currTehsils, setCurrTehsils] = useState<LocationTehsil[]>([]);
  const [currVillages, setCurrVillages] = useState<LocationVillage[]>([]);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {}
  }, []);

  // Auto-save draft on modification
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {}
  }, [formData]);

  // Sync cascading dropdowns for Step 1
  useEffect(() => {
    if (formData.registeredState) {
      const dists = getDistrictsByState(formData.registeredState);
      setRegDistricts(dists);
      if (dists.length > 0 && !dists.some((d) => d.name === formData.registeredDistrict)) {
        setFormData((prev) => ({ ...prev, registeredDistrict: dists[0].name }));
      }
    }
  }, [formData.registeredState]);

  // Sync cascading dropdowns for Step 3 Permanent Address
  useEffect(() => {
    if (formData.permState) {
      const dists = getDistrictsByState(formData.permState);
      setPermDistricts(dists);
      if (dists.length > 0 && !dists.some((d) => d.name === formData.permDistrict)) {
        setFormData((prev) => ({ ...prev, permDistrict: dists[0].name }));
      }
    }
  }, [formData.permState]);

  useEffect(() => {
    if (formData.permState && formData.permDistrict) {
      const tehs = getTehsilsByDistrict(formData.permState, formData.permDistrict);
      setPermTehsils(tehs);
      if (tehs.length > 0 && !tehs.some((t) => t.name === formData.permTehsil)) {
        setFormData((prev) => ({ ...prev, permTehsil: tehs[0].name }));
      }
    }
  }, [formData.permState, formData.permDistrict]);

  useEffect(() => {
    if (formData.permTehsil) {
      const vils = searchVillages(formData.permState, formData.permDistrict, formData.permTehsil, "");
      setPermVillages(vils);
      if (vils.length > 0 && !vils.some((v) => v.name === formData.permVillage)) {
        setFormData((prev) => ({ ...prev, permVillage: vils[0].name }));
      }
    }
  }, [formData.permTehsil, formData.permState, formData.permDistrict]);

  // Sync cascading dropdowns for Step 3 Current Address (if different)
  useEffect(() => {
    if (!formData.currentAddressSameAsPerm && formData.currState) {
      const dists = getDistrictsByState(formData.currState);
      setCurrDistricts(dists);
      if (dists.length > 0 && !dists.some((d) => d.name === formData.currDistrict)) {
        setFormData((prev) => ({ ...prev, currDistrict: dists[0].name }));
      }
    }
  }, [formData.currentAddressSameAsPerm, formData.currState]);

  useEffect(() => {
    if (!formData.currentAddressSameAsPerm && formData.currState && formData.currDistrict) {
      const tehs = getTehsilsByDistrict(formData.currState, formData.currDistrict);
      setCurrTehsils(tehs);
      if (tehs.length > 0 && !tehs.some((t) => t.name === formData.currTehsil)) {
        setFormData((prev) => ({ ...prev, currTehsil: tehs[0].name }));
      }
    }
  }, [formData.currentAddressSameAsPerm, formData.currState, formData.currDistrict]);

  useEffect(() => {
    if (!formData.currentAddressSameAsPerm && formData.currTehsil) {
      const vils = searchVillages(formData.currState, formData.currDistrict, formData.currTehsil, "");
      setCurrVillages(vils);
      if (vils.length > 0 && !vils.some((v) => v.name === formData.currVillage)) {
        setFormData((prev) => ({ ...prev, currVillage: vils[0].name }));
      }
    }
  }, [formData.currentAddressSameAsPerm, formData.currTehsil, formData.currState, formData.currDistrict]);

  // Age calculation from DOB
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dobValue = e.target.value;
    if (!dobValue) return;
    const birthDate = new Date(dobValue);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    setFormData((prev) => ({ ...prev, dob: dobValue, age: Math.max(0, calculatedAge) }));
  };

  // Image file handler with instant base64 preview
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Step Validation & Progression
  const validateStep1 = () => {
    if (!formData.registrationType) {
      setError("Please select whether you are registering as a BUYER or SELLER.");
      return false;
    }
    if (!formData.registeredState || !formData.registeredDistrict) {
      setError("Please select your Registered State and District.");
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First Name and Last Name are required.");
      return false;
    }
    if (!formData.guardianName.trim()) {
      setError("Guardian Name is required.");
      return false;
    }
    if (!formData.dob) {
      setError("Please select your Date of Birth.");
      return false;
    }
    if (formData.age < 18) {
      setError("You must be at least 18 years of age to register on Krishi Connect.");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (formData.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep3 = () => {
    if (!formData.permLine1.trim()) {
      setError("Permanent Address Line 1 is required.");
      return false;
    }
    if (!/^\d{6}$/.test(formData.permPincode.trim())) {
      setError("Please enter a valid 6-digit PIN code for Permanent Address.");
      return false;
    }
    if (!formData.currentAddressSameAsPerm) {
      if (!formData.currLine1.trim()) {
        setError("Current Address Line 1 is required.");
        return false;
      }
      if (!/^\d{6}$/.test(formData.currPincode.trim())) {
        setError("Please enter a valid 6-digit PIN code for Current Address.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) setStep((prev) => (prev - 1) as any);
  };

  // Final Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productOrCrop.trim()) {
      setError(
        formData.registrationType === "SELLER"
          ? "Please specify your Primary Crop or Produce offering."
          : "Please specify the Primary Crop or Commodity you wish to procure."
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        entityType: formData.entityType,
        registrationType: formData.registrationType,
        category: formData.category,
        firstName: formData.firstName.trim(),
        middleName: formData.middleName.trim(),
        lastName: formData.lastName.trim(),
        guardianRelation: formData.guardianRelation,
        guardianName: formData.guardianName.trim(),
        dob: formData.dob,
        age: formData.age,
        gender: formData.gender,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        permanentAddress: {
          line1: formData.permLine1.trim(),
          line2: formData.permLine2.trim(),
          state: formData.permState,
          district: formData.permDistrict,
          tehsil: formData.permTehsil,
          village: formData.permVillage,
          pincode: formData.permPincode.trim(),
        },
        currentAddressSameAsPermanent: formData.currentAddressSameAsPerm,
        currentAddress: formData.currentAddressSameAsPerm
          ? undefined
          : {
              line1: formData.currLine1.trim(),
              line2: formData.currLine2.trim(),
              state: formData.currState,
              district: formData.currDistrict,
              tehsil: formData.currTehsil,
              village: formData.currVillage,
              pincode: formData.currPincode.trim(),
            },
        product: formData.productOrCrop.trim(),
        crops: [formData.productOrCrop.trim()],
        quantity: formData.quantity.trim() || "100",
        unit: formData.unit,
        price: formData.priceOrRange.trim() || "₹3,800 / Quintal",
        availability: formData.availabilityOrTimeline.trim(),
        cropsRequired: formData.registrationType === "BUYER" ? [formData.productOrCrop.trim()] : undefined,
        primaryCrop: formData.productOrCrop.trim(),
        quantityRequired: formData.registrationType === "BUYER" ? `${formData.quantity} ${formData.unit}` : undefined,
        priceRange: formData.priceOrRange.trim(),
        timeline: formData.availabilityOrTimeline.trim(),
        experience: formData.experience,
        bio:
          formData.bio.trim() ||
          `${formData.firstName} ${formData.lastName} - Verified agricultural ${formData.registrationType.toLowerCase()} operating in ${formData.permDistrict}, ${formData.permState}.`,
        photo: formData.photoUrl,
        radiusKm: formData.radiusKm,
      };

      const res = await fetch("/api/krishi-connect/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to register profile");
      }

      // Persist to KrishiConnectService client store & update active user
      KrishiConnectService.registerProfile(data.profile);
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

      // Clear draft
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setStep(5); // Show success screen
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearDraft = () => {
    if (confirm("Are you sure you want to clear your saved draft and start over?")) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#FAF7F0] via-[#ECFEFF]/25 to-[#FAF7F0] dark:from-[#062834] dark:to-[#083344] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-700 text-cyan-900 dark:text-cyan-200 text-xs font-bold shadow-2xs">
            <Sprout className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
            <span>🌾 Krishi Connect • Dedicated Agricultural Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Register on Krishi Connect
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-lg mx-auto">
            Complete the 4-step verified registration to join India&apos;s direct farmer-to-buyer network across all 36 States & Union Territories.
          </p>
        </div>

        {/* 4-Step Progress Indicator */}
        {step <= 4 && (
          <div className="bg-[#FFFEFD] dark:bg-[#083344] rounded-3xl p-5 border border-[#EAE3D5] dark:border-cyan-800/60 shadow-xs">
            <div className="flex items-center justify-between">
              {[
                { s: 1, label: "Basic Reg." },
                { s: 2, label: "Identity" },
                { s: 3, label: "Addresses" },
                { s: 4, label: "Trade Profile" },
              ].map((item, idx) => (
                <div key={item.s} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        step === item.s
                          ? "bg-gradient-to-r from-cyan-800 to-teal-800 text-white ring-4 ring-cyan-100 dark:ring-cyan-900 shadow-md"
                          : step > item.s
                          ? "bg-cyan-600 text-white"
                          : "bg-[#FAF7F0] dark:bg-cyan-950/40 text-stone-400 border border-[#EAE3D5]"
                      }`}
                    >
                      {step > item.s ? <Check className="w-4 h-4" /> : item.s}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-1.5 text-center hidden sm:block ${
                        step === item.s
                          ? "text-cyan-950 dark:text-cyan-200"
                          : "text-stone-500 dark:text-stone-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {idx < 3 && (
                    <div
                      className={`h-1 flex-1 transition-all ${
                        step > item.s
                          ? "bg-cyan-600"
                          : "bg-[#EAE3D5] dark:bg-cyan-900/40"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-stone-100 dark:border-cyan-900/60 text-[11px] text-stone-500">
              <span>Step {step} of 4</span>
              <button
                type="button"
                onClick={clearDraft}
                className="text-stone-400 hover:text-red-500 transition-colors"
              >
                Clear draft
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* ================= STEP 1: BASIC REGISTRATION ================= */}
        {step === 1 && (
          <div className="bg-white dark:bg-[#082933] rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-cyan-800 shadow-xl space-y-6">
            <div className="border-b border-stone-100 dark:border-cyan-900 pb-4">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Store className="w-5 h-5 text-cyan-600" />
                <span>Step 1: Basic Agricultural Registration</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Specify whether you are operating as an Individual or Institution, your primary trading role, and registered state.
              </p>
            </div>

            {/* Entity Type Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-200">
                Entity Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, entityType: "INDIVIDUAL" })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    formData.entityType === "INDIVIDUAL"
                      ? "border-cyan-600 bg-cyan-50/60 dark:bg-cyan-900/40 text-cyan-950 dark:text-cyan-100 ring-2 ring-cyan-500/20 shadow-xs"
                      : "border-stone-200 dark:border-cyan-900 bg-stone-50 dark:bg-cyan-950/40 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  <User className="w-5 h-5 mb-1 text-cyan-600" />
                  <div className="text-xs font-bold">Individual / Farmer</div>
                  <div className="text-[11px] text-stone-500">Sole cultivator, tenant, or trader</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, entityType: "INSTITUTIONAL" })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    formData.entityType === "INSTITUTIONAL"
                      ? "border-cyan-600 bg-cyan-50/60 dark:bg-cyan-900/40 text-cyan-950 dark:text-cyan-100 ring-2 ring-cyan-500/20 shadow-xs"
                      : "border-stone-200 dark:border-cyan-900 bg-stone-50 dark:bg-cyan-950/40 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  <Building2 className="w-5 h-5 mb-1 text-cyan-600" />
                  <div className="text-xs font-bold">Institutional / Enterprise</div>
                  <div className="text-[11px] text-stone-500">FPO, Mandi Agency, Food Processor</div>
                </button>
              </div>
            </div>

            {/* Registration Type: BUYER or SELLER (MANDATORY) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                  Registration Type <span className="text-red-500">* (Mandatory Role)</span>
                </label>
                <span className="text-[11px] text-cyan-700 dark:text-cyan-400 font-semibold">
                  Governs discovery algorithm
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      registrationType: "SELLER",
                      category: "Farmer",
                      availabilityOrTimeline: "Immediate Dispatch",
                    })
                  }
                  className={`p-5 rounded-2xl border text-left transition-all relative ${
                    formData.registrationType === "SELLER"
                      ? "border-cyan-600 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/40 dark:to-teal-900/40 ring-2 ring-cyan-500 shadow-md"
                      : "border-stone-200 dark:border-cyan-900 bg-stone-50 dark:bg-cyan-950/30"
                  }`}
                >
                  {formData.registrationType === "SELLER" && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-cyan-600 text-white text-[10px] font-extrabold">
                      ACTIVE
                    </span>
                  )}
                  <div className="text-2xl mb-1">🌾</div>
                  <div className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                    SELLER / Producer
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                    I produce or supply crops, grains, horticultural yield, or bio-inputs. Buyers in my radius will discover me.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      registrationType: "BUYER",
                      category: "Trader",
                      availabilityOrTimeline: "Within 15 Days",
                    })
                  }
                  className={`p-5 rounded-2xl border text-left transition-all relative ${
                    formData.registrationType === "BUYER"
                      ? "border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 ring-2 ring-amber-500 shadow-md"
                      : "border-stone-200 dark:border-cyan-900 bg-stone-50 dark:bg-cyan-950/30"
                  }`}
                >
                  {formData.registrationType === "BUYER" && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-extrabold">
                      ACTIVE
                    </span>
                  )}
                  <div className="text-2xl mb-1">🏢</div>
                  <div className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                    BUYER / Procurement
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                    I procure crops and agricultural produce directly from farmers and clusters for processing, trading, or retail.
                  </p>
                </button>
              </div>
            </div>

            {/* Registered State & Cascading District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  Registered State / UT <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.registeredState}
                  onChange={(e) => setFormData({ ...formData, registeredState: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                >
                  {ALL_INDIAN_STATES.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.type === "ut" ? "UT" : "State"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  Registered District <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.registeredDistrict}
                  onChange={(e) => setFormData({ ...formData, registeredDistrict: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                >
                  {regDistricts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                Primary Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
              >
                {[
                  "Farmer",
                  "Trader",
                  "FPO",
                  "Processor",
                  "Retailer",
                  "Wholesaler",
                  "Input Supplier",
                  "Exporter",
                  "Other",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Navigation Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 bg-cyan-800 hover:bg-cyan-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Continue to Step 2 (Identity)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: IDENTITY VERIFICATION ================= */}
        {step === 2 && (
          <div className="bg-white dark:bg-[#082933] rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-cyan-800 shadow-xl space-y-6">
            <div className="border-b border-stone-100 dark:border-cyan-900 pb-4">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-600" />
                <span>Step 2: Identity & Demographic Verification</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Provide legal name and demographics for Aadhaar & e-KYC compliance on agricultural mandis.
              </p>
            </div>

            {/* Name Fields: First, Middle, Last */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Gurpreet"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  Middle Name <span className="text-stone-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  placeholder="e.g. Singh"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Sandhu"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Guardian: S/o, D/o, W/o + Name */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  Relation
                </label>
                <select
                  value={formData.guardianRelation}
                  onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                >
                  <option value="S/o">S/o (Son of)</option>
                  <option value="D/o">D/o (Daughter of)</option>
                  <option value="W/o">W/o (Wife of)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  Guardian Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="Father's / Husband's name"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Date of Birth & Auto Age Calculation & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={handleDobChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  Calculated Age
                </label>
                <div className="px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-100 dark:bg-cyan-900/50 text-xs font-bold flex items-center justify-between">
                  <span className={formData.age < 18 ? "text-red-600" : "text-cyan-700 dark:text-cyan-300"}>
                    {formData.age ? `${formData.age} Years` : "—"}
                  </span>
                  {formData.age >= 18 && (
                    <span className="text-[10px] text-cyan-600 bg-cyan-100 dark:bg-cyan-800/80 px-1.5 py-0.5 rounded">
                      Eligible (18+)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Email & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. kisan@agrikin.in"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  10-Digit Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9814123456"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="py-2.5 px-4 rounded-xl border border-stone-300 dark:border-cyan-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 bg-cyan-800 hover:bg-cyan-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Continue to Step 3 (Address)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: ADDRESS DETAILS (CASCADING) ================= */}
        {step === 3 && (
          <div className="bg-white dark:bg-[#082933] rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-cyan-800 shadow-xl space-y-6">
            <div className="border-b border-stone-100 dark:border-cyan-900 pb-4">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-600" />
                <span>Step 3: Permanent & Current Address</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Indian administrative hierarchy: State &rarr; District &rarr; Tehsil &rarr; Village with 6-digit postal code.
              </p>
            </div>

            {/* Permanent Address Section */}
            <div className="space-y-4">
              <div className="text-xs font-extrabold text-cyan-950 dark:text-cyan-300 uppercase tracking-wider">
                Permanent Residential / Farm Address
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.permLine1}
                    onChange={(e) => setFormData({ ...formData, permLine1: e.target.value })}
                    placeholder="House / Farm / Survey No., Street"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                    Address Line 2 <span className="text-stone-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.permLine2}
                    onChange={(e) => setFormData({ ...formData, permLine2: e.target.value })}
                    placeholder="Landmark, Post Office"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cascading: State -> District -> Tehsil -> Village */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                    State / UT <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.permState}
                    onChange={(e) => setFormData({ ...formData, permState: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                  >
                    {ALL_INDIAN_STATES.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.permDistrict}
                    onChange={(e) => setFormData({ ...formData, permDistrict: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                  >
                    {permDistricts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                    Tehsil <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.permTehsil}
                    onChange={(e) => setFormData({ ...formData, permTehsil: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                  >
                    {permTehsils.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                    Village <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.permVillage}
                    onChange={(e) => setFormData({ ...formData, permVillage: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                  >
                    {permVillages.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PIN Code */}
              <div className="max-w-xs">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  6-Digit Indian PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={formData.permPincode}
                  onChange={(e) => setFormData({ ...formData, permPincode: e.target.value })}
                  placeholder="e.g. 141114"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* "Current Address Same as Permanent" Toggle */}
            <div className="pt-4 border-t border-stone-100 dark:border-cyan-900">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.currentAddressSameAsPerm}
                  onChange={(e) =>
                    setFormData({ ...formData, currentAddressSameAsPerm: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-cyan-700 focus:ring-cyan-600"
                />
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Current Address is the same as Permanent Address
                </span>
              </label>
            </div>

            {/* Separate Current Address Fields (if not same) */}
            {!formData.currentAddressSameAsPerm && (
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/20 border border-stone-200 dark:border-cyan-800 space-y-4">
                <div className="text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  Current Operating / Dispatch Address
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                      Current Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.currLine1}
                      onChange={(e) => setFormData({ ...formData, currLine1: e.target.value })}
                      placeholder="Current street / mandi office"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-stone-900 dark:text-stone-100 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                      Current PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.currPincode}
                      onChange={(e) => setFormData({ ...formData, currPincode: e.target.value })}
                      placeholder="6-digit PIN"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-stone-900 dark:text-stone-100 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                      State / UT
                    </label>
                    <select
                      value={formData.currState}
                      onChange={(e) => setFormData({ ...formData, currState: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-xs"
                    >
                      {ALL_INDIAN_STATES.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                      District
                    </label>
                    <select
                      value={formData.currDistrict}
                      onChange={(e) => setFormData({ ...formData, currDistrict: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-xs"
                    >
                      {currDistricts.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                      Tehsil
                    </label>
                    <select
                      value={formData.currTehsil}
                      onChange={(e) => setFormData({ ...formData, currTehsil: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-xs"
                    >
                      {currTehsils.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                      Village
                    </label>
                    <select
                      value={formData.currVillage}
                      onChange={(e) => setFormData({ ...formData, currVillage: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-xs"
                    >
                      {currVillages.map((v) => (
                        <option key={v.id} value={v.name}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="py-2.5 px-4 rounded-xl border border-stone-300 dark:border-cyan-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 bg-cyan-800 hover:bg-cyan-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Continue to Step 4 (Trade Profile)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: TRADE PROFILE & MEDIA ================= */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#082933] rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-cyan-800 shadow-xl space-y-6">
            <div className="border-b border-stone-100 dark:border-cyan-900 pb-4">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-cyan-600" />
                <span>Step 4: Krishi Connect Trade Profile & Media</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {formData.registrationType === "SELLER"
                  ? "Specify the crop or produce you produce and sell, expected rate, and farm lot photos."
                  : "Specify the crops you procure, quantity demand, and target procurement budget."}
              </p>
            </div>

            {/* Role-Specific Fields */}
            {formData.registrationType === "SELLER" ? (
              <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 space-y-4">
                <div className="text-xs font-extrabold text-cyan-950 dark:text-cyan-300 flex items-center gap-1.5">
                  <span>🌾</span>
                  <span>Seller / Farm Produce Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                      Primary Crop / Product Offering <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.productOrCrop}
                      onChange={(e) => setFormData({ ...formData, productOrCrop: e.target.value })}
                      placeholder="e.g. Organic 1121 Pusa Basmati Rice"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                        Available Qty
                      </label>
                      <input
                        type="text"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder="e.g. 250"
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-stone-900 dark:text-stone-100 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                        Unit
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-xs"
                      >
                        <option value="Quintals">Quintals</option>
                        <option value="Bags (50kg)">Bags (50kg)</option>
                        <option value="Bags (75kg)">Bags (75kg)</option>
                        <option value="Metric Tonnes">Metric Tonnes</option>
                        <option value="Kg">Kg</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                      Expected / Quoted Price
                    </label>
                    <input
                      type="text"
                      value={formData.priceOrRange}
                      onChange={(e) => setFormData({ ...formData, priceOrRange: e.target.value })}
                      placeholder="e.g. ₹4,250 / Quintal"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-stone-900 dark:text-stone-100 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                      Harvest Availability
                    </label>
                    <select
                      value={formData.availabilityOrTimeline}
                      onChange={(e) => setFormData({ ...formData, availabilityOrTimeline: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-xs"
                    >
                      <option value="Immediate Dispatch">Immediate Dispatch (In Stock)</option>
                      <option value="Harvest Next Week">Harvest Next Week</option>
                      <option value="Harvest Within 15 Days">Harvest Within 15 Days</option>
                      <option value="Stored in Cold Storage">Stored in Aerated Godown / Cold Storage</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-4">
                <div className="text-xs font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <span>🏢</span>
                  <span>Buyer / Procurement Demand Specifications</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                      Crop / Commodity Required <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.productOrCrop}
                      onChange={(e) => setFormData({ ...formData, productOrCrop: e.target.value })}
                      placeholder="e.g. Sharbati Wheat / Non-GMO Soybean"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                        Required Qty
                      </label>
                      <input
                        type="text"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder="e.g. 500"
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                        Unit
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-xs"
                      >
                        <option value="Quintals">Quintals</option>
                        <option value="Metric Tonnes">Metric Tonnes</option>
                        <option value="Bags">Bags</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                      Target Budget / Price Range
                    </label>
                    <input
                      type="text"
                      value={formData.priceOrRange}
                      onChange={(e) => setFormData({ ...formData, priceOrRange: e.target.value })}
                      placeholder="e.g. ₹4,000 - ₹4,400 / Qtl"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                      Procurement Urgency
                    </label>
                    <select
                      value={formData.availabilityOrTimeline}
                      onChange={(e) => setFormData({ ...formData, availabilityOrTimeline: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-white dark:bg-[#082933] text-xs"
                    >
                      <option value="Immediate / Spot Cash">Immediate / Spot RTGS Settlement</option>
                      <option value="Within 7 Days">Within 7 Days</option>
                      <option value="Within 15 Days">Within 15 Days</option>
                      <option value="Seasonal Contract">Seasonal / Ongoing Monthly Supply</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Photo Upload & Preview */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                Profile / Produce Photo
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={formData.photoUrl}
                  alt="Profile Preview"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-600 shadow-sm"
                />
                <div className="flex-1">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 dark:bg-cyan-900/50 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-cyan-700" />
                    <span>Upload Farm or Profile Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Upload clear photo of yourself, farm, or produce sample (JPG/PNG).
                  </p>
                </div>
              </div>
            </div>

            {/* Experience & Preferred Radius */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                  Agricultural Experience
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-xs"
                >
                  <option value="1-3 Years">1-3 Years (Beginner / New entrant)</option>
                  <option value="5-10 Years">5-10 Years (Experienced producer)</option>
                  <option value="10-20 Years">10-20 Years (Senior cultivator)</option>
                  <option value="20+ Years">20+ Years (Master farmer / Generation)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-200">
                    Trade / Delivery Radius Preference
                  </label>
                  <span className="text-xs font-extrabold text-cyan-700 dark:text-cyan-400 font-mono">
                    {formData.radiusKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={formData.radiusKm}
                  onChange={(e) => setFormData({ ...formData, radiusKm: Number(e.target.value) })}
                  className="w-full accent-cyan-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                  <span>10 km</span>
                  <span>150 km</span>
                  <span>300 km (Pan-India)</span>
                </div>
              </div>
            </div>

            {/* Bio & Practices */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
                Bio & Agricultural Practices
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Mention natural farming practices, soil health management, mandi licenses, quality certifications, or digital payment terms..."
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-cyan-800 bg-stone-50 dark:bg-cyan-900/30 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-none"
              />
            </div>

            {/* Navigation & Submit */}
            <div className="pt-4 flex justify-between items-center border-t border-stone-100 dark:border-cyan-900">
              <button
                type="button"
                onClick={handleBack}
                className="py-2.5 px-4 rounded-xl border border-stone-300 dark:border-cyan-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-8 bg-cyan-800 hover:bg-cyan-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering Profile...</span>
                ) : (
                  <>
                    <span>Complete Registration & Enter Krishi Connect</span>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 5: SUCCESS CONFIRMATION ================= */}
        {step === 5 && (
          <div className="bg-white dark:bg-[#082933] rounded-3xl p-8 sm:p-12 border border-cyan-500/30 shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-cyan-100 dark:bg-cyan-900/80 text-cyan-600 dark:text-cyan-300 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-950 dark:text-cyan-200 text-xs font-extrabold">
                Registration Successful
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                Welcome to ȺցɾìҠìղ Krishi Connect!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                Your profile has been authenticated as a <strong>{formData.registrationType}</strong> in{" "}
                <strong>{formData.permDistrict}, {formData.permState}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-cyan-900/30 max-w-md mx-auto text-left text-xs space-y-1.5 border border-stone-200 dark:border-cyan-800">
              <div className="flex justify-between">
                <span className="text-stone-500">Name:</span>
                <span className="font-bold">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Role:</span>
                <span className="font-bold text-cyan-700 dark:text-cyan-400">{formData.registrationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Primary Offering:</span>
                <span className="font-bold">{formData.productOrCrop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Jurisdiction:</span>
                <span className="font-bold">{formData.permVillage}, {formData.permDistrict}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => router.push("/krishi-connect")}
                className="py-3.5 px-8 bg-cyan-800 hover:bg-cyan-700 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all"
              >
                <span>Launch Krishi Connect Discovery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
