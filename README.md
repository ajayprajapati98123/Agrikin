# ȺցɾìҠìղ (AgriKin) - Agricultural Technology Platform for India

**ȺցɾìҠìղ** is a production-grade digital agriculture platform designed specifically for Indian farmers, agronomy experts, and agri-traders. It combines multi-spectral computer vision, real-time location-aware farmer matching, satellite weather forecasting, and **🌱 Dharti Maa** — an intelligent agricultural AI companion powered by **OpenAI GPT-4o** and calibrated with Indian Council of Agricultural Research (ICAR) agronomic intelligence.

---

## 🌟 Key Features

1. **Photographic Animated Hero Section**:
   - High-fidelity photograph of an Indian farmer in terraced crop fields during morning sunrise (`public/images/hero-farmer.jpg`).
   - Micro-animations: breathing Ken Burns zoom, drifting atmospheric morning mist, solar flares, shimmering morning rays, and interactive telemetry badges (Soil Moisture 78%, Photoperiod, Kharif Phase).

2. **🌱 Dharti Maa Agricultural AI Companion (OpenAI GPT-4o)**:
   - Floating round chatbot available at the **bottom-left corner** of every page, plus a dedicated workspace at `/ai-assistant`.
   - Connected directly to **OpenAI GPT-4o** via `/api/dharti-maa`.
   - Multi-modal: accepts uploaded crop photos in chat for visual inspection.
   - Grounded in verified Indian agronomy: CIBRC-approved formulations (Mancozeb, Difenoconazole, Imidacloprid, Chlorpyrifos, *Trichoderma*), balanced NPK (4:2:1), wheat Crown Root Initiation (CRI) irrigation, PMKSY 55% micro-irrigation subsidies, and official Government schemes (PM-Kisan, PMFBY, KCC, AIF).
   - High-fidelity domain-expert fallback engine when offline or if an API key is not supplied.

3. **Multi-Spectral AI Detections (OpenAI GPT-4o Vision)**:
   - Located at `/detections` with batch processing up to 10 photos.
   - Connected to **OpenAI GPT-4o Vision** via `/api/detect`.
   - Diagnoses crop leaf diseases (Blight, Rust, Mildew, Chlorosis), grades harvest produce quality (Grade A / B), and inspects topsoil tilth & aggregation.
   - Optical live camera scanner mode at `/detections/live`.

4. **Krishi Connect & WebRTC Video Call**:
   - Location-aware marketplace matching farmers, buyers, and suppliers within regional proximity (e.g. `4.5 km away`).
   - Interactive 1-to-1 chat (`/krishi-connect/chat/[id]`) with image attachments and typing receipts.
   - Built-in WebRTC video inspection for remote crop diagnostics.

5. **Government Schemes Portal (`/govt-schemes`)**:
   - Official step-by-step checklists and direct `.gov.in` application links for:
     * **PM-Kisan Samman Nidhi** (`pmkisan.gov.in`) - ₹6,000/yr via DBT.
     * **Pradhan Mantri Fasal Bima Yojana (PMFBY)** (`pmfby.gov.in`) - 2% Kharif / 1.5% Rabi crop insurance with 72h claim window.
     * **Kisan Credit Card (KCC)** - 4% effective subsidized interest rate.
     * **PM Krishi Sinchayi Yojana (PMKSY)** (`pmksy.gov.in`) - 55% micro-irrigation subsidy.
     * **Agriculture Infrastructure Fund (AIF)** (`agriinfra.dac.gov.in`) - 3% interest subvention up to ₹2 Crore.

6. **Cropify Recommender & Live Weather**:
   - `/cropify`: Agronomic crop recommendation algorithm based on Nitrogen, Phosphorus, Potassium, soil pH, and annual rainfall.
   - `/weather`: Live satellite reanalysis from Open-Meteo with 7-day forecast, hourly precipitation risk, and calm morning chemical spray windows.

7. **Bilingual Engine (English & हिंदी)**:
   - Instant toggle (`EN | हिंदी`) across the entire navigation, headers, cards, and Dharti Maa responses.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (`.env`)
Create or edit `.env` in the root directory:
```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
AUTH_SECRET="agrikin-production-jwt-secret-key-2026"

# OpenAI API Key (Optional: Can also be entered in the UI)
OPENAI_API_KEY="your-openai-api-key-here"

# Live Weather
WEATHER_API_KEY="open-meteo"
```

### 3. Run in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Directory Structure

```
agrikin/
├── app/
│   ├── page.tsx                      # Homepage with Animated Hero & 6 Pillars
│   ├── ai-assistant/page.tsx         # Full-page Dharti Maa AI Assistant
│   ├── api/
│   │   ├── detect/route.ts           # OpenAI GPT-4o Vision Detection API
│   │   └── dharti-maa/route.ts       # OpenAI GPT-4o Conversational Chat API
│   ├── cropify/page.tsx              # Crop Suitability Recommender
│   ├── dashboard/page.tsx            # Farm Operations Hub
│   ├── detections/                   # Multi-Spectral Image Diagnostics
│   │   ├── page.tsx                  # 10-Image Batch Uploader
│   │   └── live/page.tsx             # Live Camera Scanner
│   ├── farming-methods/              # Irrigation & Agronomy Guides
│   ├── govt-schemes/                 # Official Indian Schemes Repository
│   ├── krishi-connect/               # Farmer Matching & WebRTC Chat
│   ├── login/page.tsx                # Demo Login
│   ├── profile/page.tsx              # Farmer Profile
│   ├── signup/page.tsx               # Registration
│   └── weather/page.tsx              # Live Weather Dashboard
├── components/
│   ├── brand-logo.tsx                # Exact 'ȺցɾìҠìղ' wordmark with SVG emblem
│   ├── dharti-maa/                   # Dharti Maa Floating Bot & Modal
│   ├── hero/
│   │   └── agricultural-animated-hero.tsx # Cinematic Animated Hero
│   └── navbar.tsx & footer.tsx
├── lib/
│   ├── i18n/                         # Bilingual Engine (English & हिंदी)
│   ├── services/                     # AI, Weather, Auth & Location Services
│   └── types.ts                      # Universal Data Models
└── public/
    └── images/
        └── hero-farmer.jpg           # Authentic Photographic Hero Asset
```

---

## ⚖️ Legal Disclaimer
**ȺցɾìҠìղ** is an independent agricultural technology platform and is not an official Government of India website. All government schemes link directly to verified official `.gov.in` portals. AI guidance is advisory and informational.
