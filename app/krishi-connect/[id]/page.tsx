"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "../../../lib/store/app-store";
import { formatDistance } from "../../../lib/services/location.service";
import { ArrowLeft, MessageSquare, Video, ShieldCheck, MapPin, Award, Sprout, Compass } from "lucide-react";

export default function FarmerProfileView() {
  const params = useParams();
  const { farmers, connectWithFarmer, connectedFarmerIds } = useApp();
  const farmerId = params?.id as string;

  const farmer = farmers.find((f) => f.id === farmerId) || farmers[0];
  const isConnected = connectedFarmerIds.includes(farmer.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 pb-24 space-y-6">
      <Link
        href="/krishi-connect"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Krishi Connect</span>
      </Link>

      <div className="bg-white dark:bg-emerald-950 rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-emerald-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-stone-200 dark:border-emerald-800">
          <div className="flex items-center gap-5">
            <img
              src={farmer.photo}
              alt={farmer.name}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-emerald-600 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">{farmer.name}</h1>
                {farmer.verified && <ShieldCheck className="w-5 h-5 text-emerald-600" />}
              </div>
              <div className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{farmer.approxLocation}</span>
                <span>�</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {formatDistance(farmer.distanceKm)}
                </span>
              </div>
              <span className="inline-block mt-2 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                {farmer.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/krishi-connect/chat/${farmer.id}`}
              className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat & Call</span>
            </Link>
            <button
              onClick={() => connectWithFarmer(farmer.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                isConnected
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
              }`}
            >
              {isConnected ? "Connected ?" : "Send Connection"}
            </button>
          </div>
        </div>

        {/* Trade Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800">
            <div className="text-[11px] text-stone-500">Produce / Listing</div>
            <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">{farmer.product}</div>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800">
            <div className="text-[11px] text-stone-500">Available Quantity</div>
            <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">{farmer.quantity}</div>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800">
            <div className="text-[11px] text-stone-500">Quoted Price</div>
            <div className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{farmer.price}</div>
          </div>
        </div>

        {/* Bio & Agricultural Practice */}
        <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">Farmer Background & Farming Practices</h3>
          <p className="leading-relaxed">{farmer.bio}</p>
          <div className="pt-2">
            <strong>Experience:</strong> {farmer.experience} � <strong>Availability:</strong> {farmer.availability}
          </div>
        </div>
      </div>
    </div>
  );
}
