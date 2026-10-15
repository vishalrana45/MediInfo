# MediInfo — Web Medicine Intelligence & Healthcare Radar..🏥💊

> **MediInfo** is a clinical-grade medicine intelligence and patient safety web application. It combines computer vision, multimodal AI, family medication tracking, and a live healthcare network to empower families and patients with verified drug information, emergency services, and safe pharmaceutical management.

---

## ✨ Key Features

### 1. 📷 Smart Medicine & Pill Identification Scanner
- **Live Camera & Photo Upload**: Capture tablet imprints, blister pack foil, or syrup packaging.
- **Multimodal AI Analysis**: Powered by Google Gemini 3.8 Flash to extract active salt molecules, brand names, therapeutic class, standard adult/pediatric dosages, and contraindications.
- **Instant Monograph**: Access indications, side effects, black-box warnings, food interactions, and missed-dose rules.

### 2. 📋 Doctor Prescription OCR & Regimen Digitizer
- Scans handwritten and printed prescriptions from physicians and clinics.
- Automatically structures medications, dosages, frequency (OD/BD/TDS), treatment duration, and doctor instructions.
- One-click import directly into the **Family Medicine Cabinet** and **Dose Reminders**.

### 3. 👨‍👩‍👧‍👦 Family Medicine Cabinet & Regimen Vault
- **Member-Specific Inventories**: Separate profiles for parents, children, seniors, and dependents with age, blood group, and allergy tags.
- **Disease & Regimen View**: Clear view of which family member has which diagnosed condition (e.g., Type 2 Diabetes, Hypertension, Asthma) and what daily medications they are taking for it.
- **Expiry & Cold-Chain Alarms**: Automated 30-day expiration alerts, expired medicine lockouts, and refrigeration alerts (2°C–8°C for insulins and vaccines).
- **Stock Meter**: Visual tracker showing remaining units with 1-click dose logging.

### 4. 📍 24/7 Healthcare Finder & Interactive Medical Radar
- **Pinpoint GPS Detection**: High-accuracy device GPS with fallback network IP detection and regional metro hubs (Delhi NCR, Mumbai, Bengaluru, Pune, Chandigarh, etc.).
- **Verified Care Network**: Real-time discovery of 24/7 pharmacies, trauma centers, tertiary hospitals, and emergency clinics.
- **Direct Navigation**: 1-click turn-by-turn directions in Google Maps, direct facility phone calling, and live opening status.

### 5. 🚚 Emergency Medicine Transport & Live GPS Courier Tracker
- **Rapid Courier Dispatch**: Order SOS medications, emergency inhalers, prescription refills, and cold-chain insulins directly from nearby pharmacies and hospitals.
- **Live GPS Courier Radar**: Real-time interactive tracker with moving courier marker, speed telemetry (km/h), satellite lock status, cold-chain temperature sensor (2°C–8°C), and OTP delivery verification.

### 6. 🩸 Inter-Hospital Blood Bank & Organ Donor Network
- Live regional availability of blood units by blood group and component (Packed Red Blood Cells, Platelets, Fresh Frozen Plasma).
- Real-time organ donation tracker with **Cold Ischemia Time** countdown clocks (Heart, Liver, Kidneys, Lungs, Corneas).

### 7. ⚠️ Clinical Drug-Drug Interaction Checker
- Multi-medication safety scanner checking for severe, moderate, and minor pharmacological interactions, QT prolongation risks, and overlapping toxicity.

### 8. 🌐 Bilingual Experience (English & हिन्दी)
- Complete native translation in English and Hindi for universal accessibility across India and global communities.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Framer Motion), Lucide Icons |
| **Backend** | Express 4, Node.js (via `tsx`), Google GenAI SDK (`@google/genai`) |
| **Maps & Location** | Google Maps JavaScript API Loader, OpenStreetMap Reverse Geocoding, IP Geolocation |
| **Styling & Fonts** | Tailwind CSS v4, Manrope & Inter Typography |

---

## 📁 Project Architecture

```
mediinfo/
├── public/                 # Static assets, brand logos, favicons
├── server.ts               # Express backend API & Vite middleware proxy
├── src/
│   ├── components/         # React modular UI components
│   │   ├── assistant/      # AI health assistant & voice modals
│   │   ├── cabinet/        # Family Medicine Cabinet & Disease tracker
│   │   ├── finder/         # Healthcare finder, radar canvas & maps
│   │   ├── modules/        # Feature cards, interactions, comparisons
│   │   ├── network/        # Blood bank & organ donor network
│   │   ├── reminders/      # Smart dose scheduler & adherence
│   │   └── transport/      # Medical courier booking & GPS live tracker
│   ├── data/               # Curated medicine monographs & drug interactions
│   ├── services/           # Gemini AI, GPS location, translation & storage
│   ├── types.ts            # Core TypeScript interfaces & clinical schemas
│   ├── App.tsx             # Root application orchestrator
│   └── main.tsx            # React DOM entry point
├── package.json            # Scripts & dependencies
├── vite.config.ts          # Vite build configuration
└── README.md               # Documentation

---

⚠️ Medical Disclaimer
MediInfo is an informational medical tool designed to support patient safety and health literacy. It is not a substitute for professional medical advice, clinical diagnosis, or physician consultations. In life-threatening emergencies, immediately contact local emergency services (112 / 102 / 911).

---

👤 Author & Maintainer
- Vishal Rana
- Email: vishalrana8999@gmail.com
