import React from "react";
import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { Phone, Mail, ShieldCheck, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-[#083344] via-[#062936] to-[#031A22] text-[#FDFBF7] pt-16 pb-12 border-t border-cyan-800/60 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-cyan-800/60">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" showWordmark={true} href="/" />
            <p className="text-cyan-100/80 text-sm max-w-sm leading-relaxed">
              Smart Farming. Stronger Farmers. Empowering India's agricultural backbone with real-time AI diagnostics, hyper-local weather intelligence, direct market networking, and verified government scheme access.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-cyan-300">
              <span className="flex items-center gap-1.5 bg-cyan-900/60 border border-cyan-700/50 px-3 py-1.5 rounded-full">
                <Phone className="w-3.5 h-3.5 text-yellow-400" /> Kisan Helpline: 1800-180-1551
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Core Ecosystem</h4>
            <ul className="space-y-2.5 text-xs text-cyan-200/90">
              <li>
                <Link href="/dashboard" className="hover:text-cyan-300 transition-colors">Farmer Dashboard</Link>
              </li>
              <li>
                <Link href="/krishi-connect" className="hover:text-cyan-300 transition-colors">Krishi Connect Marketplace</Link>
              </li>
              <li>
                <Link href="/detections" className="hover:text-cyan-300 transition-colors">AI Disease & Soil Detections</Link>
              </li>
              <li>
                <Link href="/cropify" className="hover:text-cyan-300 transition-colors">Cropify AI Recommendations</Link>
              </li>
              <li>
                <Link href="/weather" className="hover:text-cyan-300 transition-colors">Agri Weather Intelligence</Link>
              </li>
            </ul>
          </div>

          {/* Govt Schemes & Knowledge */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Verified Knowledge</h4>
            <ul className="space-y-2.5 text-xs text-cyan-200/90">
              <li>
                <Link href="/govt-schemes/pm-kisan" className="hover:text-cyan-300 transition-colors">PM-Kisan Samman Nidhi</Link>
              </li>
              <li>
                <Link href="/govt-schemes/pmksy" className="hover:text-cyan-300 transition-colors">PMKSY (Har Khet Ko Pani)</Link>
              </li>
              <li>
                <Link href="/govt-schemes/pmfby" className="hover:text-cyan-300 transition-colors">PMFBY (Crop Insurance)</Link>
              </li>
              <li>
                <Link href="/govt-schemes/kcc" className="hover:text-cyan-300 transition-colors">Kisan Credit Card (KCC)</Link>
              </li>
              <li>
                <Link href="/farming-methods/irrigation" className="hover:text-cyan-300 transition-colors">Modern Irrigation Methods</Link>
              </li>
            </ul>
          </div>

          {/* Trust & Helpline */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Support & Trust</h4>
            <ul className="space-y-2.5 text-xs text-cyan-200/90">
              <li>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Bank-Grade Privacy</span>
              </li>
              <li>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Geolocation Anonymity</span>
              </li>
              <li>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Scientific Disclaimers</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Government Disclaimer Banner */}
        <div className="my-8 p-4 rounded-2xl bg-cyan-900/30 border border-cyan-700/40 text-center">
          <p className="text-xs sm:text-sm font-medium text-cyan-200 leading-relaxed">
            🏛️ <strong>Disclaimer:</strong> ȺցɾìҠìղ is an independent agricultural technology platform and is not an official Government of India website. All scheme procedures, subsidies, and official links point directly to authentic government departments (e.g. pmkisan.gov.in, pmksy.gov.in, agriinfra.dac.gov.in).
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cyan-400/80">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} ȺցɾìҠìղ. Dedicated with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
            <span>to the farmers feeding the nation.</span>
          </div>
          <div className="flex gap-6">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Security Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
