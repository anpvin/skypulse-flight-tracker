<div align="center">

# ✈️ SkyPulse ADS-B
### Real-Time Global Flight Tracker & Glass Cockpit Avionics Radar

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Express](https://img.shields.io/badge/Express-4.22-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<p align="center">
  A cyber-aviation glass cockpit radar tracking <strong>10,000+ real-time commercial and general aviation flights</strong> across the globe with 60 FPS dead-reckoning, Primary Flight Display (PFD) attitude indicators, Great-Circle route arcs, and NEXRAD Doppler weather overlays.
</p>

[Key Features](#-key-features) •
[Quick Start](#-quick-start) •
[Publish to GitHub](#-publishing-to-github-guide) •
[Architecture](#-architecture) •
[Configuration](#-configuration)

</div>

---

## 🌟 Key Features

### 📡 1. Tactical Live Flight Radar
- **10,000+ Active Transponders**: Live worldwide Mode-S ADS-B telemetry stream refreshed continuously.
- **Dynamic Viewport Streaming**: Automatically loads and renders 100% of aircraft in view whenever you pan or zoom into any city, country, or region.
- **Altitude-Band Color Silhouettes**:
  - 🟣 **Stratosphere (FL390+)**: Neon Purple (`#a855f7`)
  - 🔵 **High Cruise (FL310 - FL390)**: Neon Cyan (`#06b6d4`)
  - 🔷 **Mid Cruise (FL200 - FL310)**: Avionics Blue (`#3b82f6`)
  - 🟢 **Transition (FL100 - FL200)**: Emerald Green (`#10b981`)
  - 🟡 **Climb / Approach (< FL100)**: Amber (`#f59e0b`)
  - 🔴 **Ground / Taxi**: Alert Red (`#ef4444`)
- **Dual Map Layers**: High-Res Satellite Imagery (*Esri World Imagery*) & Dark Cyber Vector (*CartoDB Dark Matter*).
- **NEXRAD Doppler Weather Radar**: Real-time precipitation reflectivity layer from the Iowa Environmental Mesonet.
- **Live Squawk 7700 Emergency Alert Beacon**: Real-time detection and one-click radar intercept of general emergencies and radio failures.
- **Autopilot Follow Camera**: Locks camera tracking onto any selected aircraft in flight.
- **60 FPS Dead-Reckoning**: Smooth mathematical interpolation loop for realistic heading rotation and position advances between API polling intervals.

### 🎙️ 2. Live ATC Radio & Voice Synthesizer Deck
- **Web Speech API Voice Synthesizer**: Generates and speaks realistic ICAO phraseology radio clearances for any active flight with one click.
- **VHF Frequency Tuner**: Switch between Center Control (124.500 MHz), High-Altitude Oceanic (128.850 MHz), Approach Radar (119.700 MHz), Tower (118.700 MHz), and Ground Ops (121.900 MHz).
- **TCAS Conflict Monitor**: Real-time Traffic Alert and Collision Avoidance System calculating separation minimums and altitude deltas.
- **Emergency Squawk Monitor**: Live scanner for Squawk 7700 (General Emergency), 7600 (Radio Comm Failure), and 7500 (Unlawful Interference).

### 🏢 3. 300+ Global International Airport Hubs Explorer
- **Worldwide Hubs Browser**: Comprehensive directory of over 300 major international aerodromes across all continents.
- **Live Airport Traffic**: Real-time active departure and arrival counts computed dynamically from global flights.
- **NOAA METAR Weather**: Live decoded surface observations including temperature, cloud ceilings, barometric QNH, and wind vectors.
- **One-Click Radar Jump**: Center radar camera instantly over any international airport.

### 🛩️ 4. Glass Cockpit Primary Flight Display (PFD)
- **Artificial Horizon**: Real-time Pitch and Roll attitude indicator dynamically reacting to climb/descent rates and turns.
- **Avionics Tapes**: Barometric Altitude Tape (`ft` & `FL`), Airspeed Tape (`km/h` & `knots`), and Vertical Speed Indicator (`FPM`).
- **Atmospheric Physics**: ISA Mach Number estimator ($M = \frac{v}{a(T)}$) and Barometric Pressure calculation (`hPa` and `inHg`).
- **Geodesic Great-Circle Route Arcs**: Calculates and draws authentic Earth-curvature route paths, flight progress percentages, distance traveled, and distance remaining.
- **Flight Dossier Export**: One-click download of complete JSON flight dossier including telemetry, routing, weather, and aircraft specifications.

### 📋 5. Real-Time Flight Board & Search Engine
- **Card View & Dense Table View**: Switch seamlessly between interactive telemetry cards and high-density tabular flight boards.
- **Multi-Field Search**: Search by Flight Number (e.g. `UAE201`), ICAO Callsign, Hex Code, Airline Name, Origin/Destination City, or Aircraft Model.
- **Status Filter Chips**: Quick filtering for High Cruise (FL350+), Climbing, Descending, and Ground operations.
- **Regional Filters**: Fast filtering across North America, Europe, Asia / Middle East, Latin America, and Oceania.
- **Multi-Parameter Sorting**: Sort live lists by Altitude, Ground Speed, Route Progress %, or Flight Number.

### 📊 6. Airspace Spectrum Analytics
- **Live Fleet KPIs**: Active transponder count, global average cruise level, peak velocity, and top airline carrier.
- **Visual Analytics**: Interactive Recharts graphs displaying carrier distribution, altitude layer histograms, and speed spectrums.

---

## 🛠️ Tech Stack

| Component | Technologies Used |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite 6 |
| **Styling & Theme** | Tailwind CSS v4, Glassmorphism, CSS Hardware Acceleration |
| **Mapping & Geospatial**| Leaflet 1.9, CartoDB Dark Matter, Esri Satellite, IEM NEXRAD |
| **Backend & Ingestion** | Node.js, Express 4, TypeScript (`tsx`), OpenSky Network ADS-B API |
| **Physics & Math** | Great-Circle Geodesic Formula, ISA Standard Atmosphere, Mach Calculator |
| **Icons & Animation** | Lucide React, Motion (Framer Motion) |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/skypulse-flight-tracker.git
cd skypulse-flight-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment (Optional)
Copy the example environment file:
```bash
cp .env.example .env
```
*(Optional) You can add your free Google Gemini API Key if you want AI-assisted flight copilot commentary.*

### 4. Start the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

To run the production build:
```bash
npm start
```

---

## 🌐 Publishing to GitHub (Step-by-Step Guide)

Follow these exact steps to publish this repository to your GitHub account:

### Step 1: Initialize Git in your project folder
Open your terminal in the project directory (`flight`) and run:
```bash
git init
```

### Step 2: Stage and commit all files
```bash
git add .
git commit -m "feat: initial release of SkyPulse Real-Time Flight Tracker & Glass Cockpit"
```

### Step 3: Rename your default branch to `main`
```bash
git branch -M main
```

### Step 4: Create a New Repository on GitHub
1. Go to [GitHub.com](https://github.com) and click the **`+`** icon (top right) ➔ **New repository**.
2. **Repository Name**: `skypulse-flight-tracker` *(or `flight-tracker`)*
3. **Description**: `Real-time global flight tracker and glass cockpit radar powered by live ADS-B Mode-S transponders, 60fps dead-reckoning, and avionics telemetry.`
4. Choose **Public**.
5. **Do NOT** check "Add a README file" (we already have one).
6. Click **Create repository**.

### Step 5: Link your local repository and push
Copy the URL of your new GitHub repository and run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/skypulse-flight-tracker.git
git push -u origin main
```

*(Replace `YOUR_USERNAME` with your actual GitHub username).*

---

## 📂 Project Structure

```
flight/
├── src/
│   ├── components/
│   │   ├── RadarTab.tsx        # Tactical Radar, satellite tiles, weather overlay & HUD
│   │   ├── SearchTab.tsx       # Flight board, table/card views, filters & sorting
│   │   ├── BriefingTab.tsx     # Primary Flight Display (PFD), attitude indicator & METAR
│   │   └── AnalyticsTab.tsx    # Airspace telemetry KPI cards and Recharts graphs
│   ├── types.ts                # TypeScript definitions (Flight, Telemetry, Weather)
│   ├── utils.ts                # Airport database (300+), airlines (350+), geodesics & math
│   ├── App.tsx                 # Main application controller, viewport culler & render loop
│   ├── index.css               # Glass cockpit Obsidian dark theme & animations
│   └── main.tsx                # React root mount
├── server.ts                   # Express server with OpenSky Network ADS-B ingestion pipeline
├── index.html                  # HTML entry point with metadata and favicon
├── package.json                # Dependencies and build scripts
├── vite.config.ts              # Vite bundler configuration with Tailwind CSS v4
└── README.md                   # Repository documentation
```

---

---

## ⚙️ Supported API Keys & Data Providers

SkyPulse works **100% out of the box** without any required API keys. To unlock advanced high-frequency feeds, authentic airline schedules, real-time NOAA METAR observations, and AI copilot analysis, you can add any of the following optional keys to your `.env` file:

| Provider | Environment Variable | Registration Link | Benefits |
|---|---|---|---|
| **OpenSky Network** | `OPENSKY_USERNAME`<br>`OPENSKY_PASSWORD` | [opensky-network.org](https://opensky-network.org/) | Unlocks 10x higher rate limits, sub-second polling, and 15,000+ live ADS-B Mode-S transponders. |
| **AirLabs API** | `AIRLABS_API_KEY` | [airlabs.co](https://airlabs.co/) | Real-time commercial airline schedules, actual route codes, terminal/gate numbers, and live delay tracking. |
| **NOAA AviationWeather** | *(Built-in / Zero Config)* | [aviationweather.gov](https://aviationweather.gov/) | Real-time live decoded METAR weather observations for 300+ international hubs worldwide. |
| **Google Gemini AI** | `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com/) | Real-time AI Copilot route intelligence, passenger load estimation, and tactical ATC clearance chat. |

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with precision for aviators, flight simmers, and aviation enthusiasts.</sub>
</div>
