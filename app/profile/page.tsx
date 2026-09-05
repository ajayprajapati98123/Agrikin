"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../../lib/store/app-store";
import { AuthService } from "../../lib/services/auth.service";
import { indianStatesAndDistricts } from "../../lib/services/location.service";
import { PhotoEditorModal } from "../../components/profile/photo-editor-modal";
import { User, Phone, Mail, MapPin, Sprout, Briefcase, Award, Check, Save, Camera, Upload, Sliders } from "lucide-react";

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "Punjab",
    district: "Ludhiana",
    crops: [] as string[],
    role: "farmer" as "farmer" | "buyer" | "seller",
    bio: "",
    landArea: "10 Acres",
    experience: "15 Years",
    avatarUrl: "",
  });

  const [cropInput, setCropInput] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);

  const handlePhotoSaved = (newUrl: string) => {
    setFormData((prev) => ({ ...prev, avatarUrl: newUrl }));
    const updated = AuthService.updateUserProfile({ avatarUrl: newUrl });
    setCurrentUser(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        state: currentUser.state || "Punjab",
        district: currentUser.district || "Ludhiana",
        crops: currentUser.crops || ["Wheat", "Paddy"],
        role: currentUser.role || "farmer",
        bio: currentUser.bio || "",
        landArea: currentUser.landArea || "10 Acres",
        experience: currentUser.experience || "15 Years",
        avatarUrl: currentUser.avatarUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400",
      });
    }
  }, [currentUser]);

  const selectedStateObj = indianStatesAndDistricts.find((s) => s.state === formData.state);
  const districtOptions = selectedStateObj ? selectedStateObj.districts : ["Ludhiana", "Amritsar"];

  const handleAddCrop = () => {
    if (cropInput.trim() && !formData.crops.includes(cropInput.trim())) {
      setFormData({ ...formData, crops: [...formData.crops, cropInput.trim()] });
      setCropInput("");
    }
  };

  const handleRemoveCrop = (c: string) => {
    setFormData({ ...formData, crops: formData.crops.filter((item) => item !== c) });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = AuthService.updateUserProfile(formData);
    setCurrentUser(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="bg-white dark:bg-emerald-950 rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-emerald-800 shadow-xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-emerald-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              Farmer Profile & Settings
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Manage your agricultural identity, crops, land size, and market role.
            </p>
          </div>

          {saveSuccess && (
            <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profile Saved Successfully!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Avatar Studio Section */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="relative group shrink-0">
                <img
                  src={formData.avatarUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200"}
                  alt="Farmer Photo"
                  className="w-24 h-24 rounded-full object-cover border-4 border-emerald-600 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setPhotoEditorOpen(true)}
                  className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity font-bold text-xs cursor-pointer"
                  title="Edit & Crop Photo"
                >
                  <Camera className="w-6 h-6 mb-0.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoEditorOpen(true)}
                  className="absolute -bottom-1 -right-1 p-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-transform active:scale-95 cursor-pointer"
                  title="Edit & Crop Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                    Profile Photograph & Digital ID
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-700">
                    Live Photo API Active
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 max-w-sm">
                  Upload any image from your mobile device, snap via camera, apply crop & filters, or AI auto-tune.
                </p>
                <div className="pt-1.5 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPhotoEditorOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Open Photo Studio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoEditorOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-emerald-900/60 border border-stone-200 dark:border-emerald-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300 text-[11px]">Direct Image URL</label>
              <input
                type="text"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-stone-900 dark:text-stone-100 text-xs"
              />
            </div>
          </div>

          {/* Core Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">State</label>
              <select
                value={formData.state}
                onChange={(e) => {
                  const st = indianStatesAndDistricts.find((s) => s.state === e.target.value);
                  setFormData({
                    ...formData,
                    state: e.target.value,
                    district: st ? st.districts[0] : "Ludhiana",
                  });
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
              >
                {indianStatesAndDistricts.map((s) => (
                  <option key={s.state} value={s.state}>{s.state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">District</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
              >
                {districtOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Land Holding Area</label>
              <input
                type="text"
                value={formData.landArea}
                onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                placeholder="e.g. 8.5 Acres"
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Farming Experience</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g. 15 Years"
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          {/* Role Choice */}
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Marketplace Role</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "farmer", label: "Farmer / Producer" },
                { id: "buyer", label: "Crop Buyer / Mandi Trader" },
                { id: "seller", label: "Agri-Input Provider" },
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setFormData({ ...formData, role: r.id as any })}
                  className={`py-2.5 px-3 rounded-xl border font-bold transition-all ${
                    formData.role === r.id
                      ? "bg-emerald-800 text-white border-emerald-800"
                      : "bg-stone-50 dark:bg-emerald-900/30 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-emerald-800"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Crops Tag Editor */}
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Cultivated Crops</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={cropInput}
                onChange={(e) => setCropInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCrop())}
                placeholder="Add crop name..."
                className="flex-1 px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
              />
              <button
                type="button"
                onClick={handleAddCrop}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.crops.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 px-3 py-1 rounded-xl font-bold"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => handleRemoveCrop(c)}
                    className="text-emerald-700 hover:text-red-600 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Farmer Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-stone-200 dark:border-emerald-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Interactive Photo Editor Modal Studio */}
      <PhotoEditorModal
        isOpen={photoEditorOpen}
        onClose={() => setPhotoEditorOpen(false)}
        currentPhotoUrl={formData.avatarUrl}
        onPhotoSaved={handlePhotoSaved}
      />
    </div>
  );
}
