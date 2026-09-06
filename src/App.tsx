import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import L from "leaflet";
import { 
  Plane, Search, Compass, Navigation, Radio, 
  MapPin, Activity, ShieldCheck, BarChart2, Layers,
  CloudRain, Crosshair, RefreshCw, X, Sliders, 
  ExternalLink, Sparkles, Building2, Volume2 
} from "lucide-react";
import { Flight, FlightDetailed, AircraftCategory } from "./types";
import { RadarTab } from "./components/RadarTab";
import { SearchTab } from "./components/SearchTab";
import { BriefingTab } from "./components/BriefingTab";
import { AnalyticsTab } from "./components/AnalyticsTab";
import { AtcCommsTab } from "./components/AtcCommsTab";
import { AirportExplorerTab } from "./components/AirportExplorerTab";
import { Cockpit3DModal } from "./components/Cockpit3DModal";
import { 
  getAirportCoords, getAirportFullName, getAirportCity, 
  getAirlineName, getFlightTimes, getBarometricPressure, 
  getAircraftModel, getAircraftClassification, calculateBearing, 
  getDistanceKm, getAltitudeColor, getGreatCircleArcPoints, 
  estimateMach 
} from "./utils";

interface FlightAnimState {
  lat: number;
  lng: number;
  dir: number;
  targetLat: number;
  targetLng: number;
  targetDir: number;
  speedKnots: number;
  lastFrameMs: number;
}

// Forward trajectory vector calculator
function getVectorPoint(lat: number, lng: number, headingDeg: number, distanceKm: number): [number, number] {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const deg = (r: number) => (r * 180) / Math.PI;
  const brng = rad(headingDeg);
  const lat1 = rad(lat);
  const lon1 = rad(lng);
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distanceKm / R) +
    Math.cos(lat1) * Math.sin(distanceKm / R) * Math.cos(brng)
  );
  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(distanceKm / R) * Math.cos(lat1),
    Math.cos(distanceKm / R) - Math.sin(lat1) * Math.sin(lat2)
  );
  return [deg(lat2), deg(lon2)];
}

// Custom Plane Marker generator with Multi-Category Silhouette & Altitude Band Coloring
function createPlaneIcon(flight: any, rotation: number, isSelected: boolean) {
  const classification = getAircraftClassification(flight);
  const altColor = getAltitudeColor(flight.alt || 30000);
  const size = isSelected ? Math.max(32, classification.selectedSize + 6) : classification.baseSize;
  const cat = flight.category || "passenger";

  const isMilitary = cat === "military" || flight.aircraft_type === "F35" || flight.aircraft_type === "F22" || flight.aircraft_type === "EF2000" || flight.aircraft_type === "B2";
  const isHelicopter = cat === "helicopter" || flight.aircraft_type === "H145" || flight.aircraft_type === "EC135" || flight.aircraft_type === "UH60" || flight.aircraft_type === "AH64";
  const isCargo = cat === "cargo";
  const isBizJet = cat === "business_jet";
  const isGA = cat === "general_aviation";
  const isLighterThanAir = cat === "lighter_than_air";
  const isGlider = cat === "glider";
  const isDrone = cat === "drone";
  const isGroundVehicle = cat === "ground_vehicle";
  const isOther = cat === "other";
  const isNonCategorized = cat === "non_categorized";

  const fillColor = isSelected 
    ? "#00f0ff" 
    : isMilitary 
    ? "#f43f5e" 
    : isHelicopter 
    ? "#10b981" 
    : isCargo 
    ? "#f59e0b" 
    : isBizJet
    ? "#38bdf8"
    : isGA 
    ? "#c084fc" 
    : isLighterThanAir
    ? "#0ea5e9"
    : isGlider
    ? "#14b8a6"
    : isDrone
    ? "#fb923c"
    : isGroundVehicle
    ? "#eab308"
    : isOther
    ? "#f97316"
    : isNonCategorized
    ? "#94a3b8"
    : altColor.hex;

  const strokeColor = isSelected ? "#ffffff" : "#07090e";
  const glow = isSelected 
    ? "drop-shadow(0 0 16px rgba(0,240,255,1)) drop-shadow(0 0 4px rgba(255,255,255,0.9))" 
    : isMilitary
    ? "drop-shadow(0 0 8px rgba(244,63,94,0.9)) drop-shadow(0 0 2px rgba(0,0,0,0.9))"
    : isHelicopter
    ? "drop-shadow(0 0 8px rgba(16,185,129,0.9)) drop-shadow(0 0 2px rgba(0,0,0,0.9))"
    : isDrone
    ? "drop-shadow(0 0 8px rgba(251,146,60,0.9)) drop-shadow(0 0 2px rgba(0,0,0,0.9))"
    : isGroundVehicle
    ? "drop-shadow(0 0 8px rgba(234,179,8,0.9)) drop-shadow(0 0 2px rgba(0,0,0,0.9))"
    : `drop-shadow(0 0 5px ${altColor.hex}99) drop-shadow(0 0 2px rgba(0,0,0,0.9))`;

  let svgContent = "";

  if (isMilitary) {
    // Delta-Wing Supersonic Fighter / Stealth Bomber Silhouette
    svgContent = `
      <svg width="${size}" height="${size}" viewBox="0 0 28 28" fill="${fillColor}" stroke="${strokeColor}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 1 L16.5 9 L27 18 L24 20.5 L16.5 17.5 L16 26 L18.5 27.5 L18.5 28 L14 27 L9.5 28 L9.5 27.5 L12 26 L11.5 17.5 L4 20.5 L1 18 L11.5 9 Z"/>
        <circle cx="14" cy="27" r="1.5" fill="#00f0ff" opacity="0.9"/>
      </svg>
    `;
  } else if (isHelicopter) {
    // Helicopter Rotorcraft with 4-Blade Spinning Rotor Silhouette
    svgContent = `
      <svg width="${size}" height="${size}" viewBox="0 0 26 26" fill="${fillColor}" stroke="${strokeColor}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="13" cy="11" r="3.5"/>
        <line x1="13" y1="1" x2="13" y2="21" stroke="#ffffff" stroke-width="1.2" opacity="0.8"/>
        <line x1="3" y1="11" x2="23" y2="11" stroke="#ffffff" stroke-width="1.2" opacity="0.8"/>
        <path d="M13 14 L13 25 L11 26 L15 26 Z"/>
        <line x1="10" y1="25" x2="16" y2="25" stroke="#ffffff" stroke-width="1"/>
      </svg>
    `;
  } else if (isDrone) {
    // Twin-Boom Surveillance & Combat UAV Drone Silhouette
    svgContent = `
      <svg width="${size}" height="${size}" viewBox="0 0 28 28" fill="${fillColor}" stroke="${strokeColor}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2 L16 10 L27 12 L27 14 L16 13 L16 22 L20 25 L18 26 L14 24 L10 26 L8 25 L12 22 L12 13 L1 14 L1 12 L12 10 Z"/>
        <circle cx="14" cy="4" r="1.5" fill="#ffffff"/>
      </svg>
    `;
  } else if (isGroundVehicle) {
    // Airport Operations & Crash Fire Tender Vehicle Silhouette
    svgContent = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fillColor}" stroke="${strokeColor}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="7" y="2" width="10" height="20" rx="3"/>
        <rect x="9" y="5" width="6" height="4" rx="1" fill="#ffffff" opacity="0.8"/>
        <circle cx="6" cy="7" r="1.8" fill="#ffffff"/>
        <circle cx="18" cy="7" r="1.8" fill="#ffffff"/>
        <circle cx="6" cy="17" r="1.8" fill="#ffffff"/>
        <circle cx="18" cy="17" r="1.8" fill="#ffffff"/>
      </svg>
    `;
  } else if (isLighterThanAir) {
    // Aerodynamic Airship / Blimp / Balloon Silhouette
    svgContent = `
      <svg width="${size}" height="${size}" viewBox="0 0 26 26" fill="${fillColor}" stroke="${strokeColor}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="13" cy="12" rx="7" ry="11"/>
        <polygon points="13,23 9,26 17,26"/>
        <rect x="11.5" y="14" width="3" height="5" rx="1" fill="#ffffff" opacity="0.8"/>
      </svg>
    `;
  } else if (isGlider) {
    // Ultra-High-Aspect Ratio Sailplane Silhouette
    svgContent = `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 2 C15.2 2 14.8 5 14.8 14 L14.8 24 L12 27 L12 28.5 L16 27 L20 28.5 L20 27 L17.2 24 L17.2 14 C17.2 5 16.8 2 16 2 Z"/>
        <path d="M14.8 12 L1 15.5 L1 17 L14.8 14.5 Z"/>
        <path d="M17.2 12 L31 15.5 L31 17 L17.2 14.5 Z"/>
      </svg>
    `;
  } else if (isBizJet) {
    // Sleek Executive Business Jet Silhouette
    svgContent = `
      <svg width="${size}" height="${size}" viewBox="0 0 26 26" fill="${fillColor}" stroke="${strokeColor}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 1 C12 1 11.2 4 11.2 10 L11.2 18 L8 21 L8 23 L13 21.5 L18 23 L18 21 L14.8 18 L14.8 10 C14.8 4 14 1 13 1 Z"/>
        <path d="M11.2 10 L2 16 L2 17.5 L11.2 14 Z"/>
        <path d="M14.8 10 L24 16 L24 17.5 L14.8 14 Z"/>
        <rect x="10" y="15" width="1.5" height="3.5" rx="0.7" fill="#ffffff" opacity="0.8"/>
        <rect x="14.5" y="15" width="1.5" height="3.5" rx="0.7" fill="#ffffff" opacity="0.8"/>
      </svg>
    `;
  } else if (classification.category === "4-engine" || isCargo) {
    // 4-Engine Heavy Widebody / Cargo (A380 / B747 / B777F)
    svgContent = `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 1.8 C14.2 1.8 13.5 4.8 13.5 11 L13.5 21 L10 24 L10 26.5 L16 24.8 L22 26.5 L22 24 L18.5 21 L18.5 11 C18.5 4.8 17.8 1.8 16 1.8 Z"/>
        <path d="M13.5 11 L2 18 L2 20.5 L13.5 16 Z"/>
        <path d="M18.5 11 L30 18 L30 20.5 L18.5 16 Z"/>
        <rect x="4.5" y="14.5" width="2" height="4" rx="1" fill="#ffffff" opacity="0.8"/>
        <rect x="8.5" y="12.5" width="2" height="4" rx="1" fill="#ffffff" opacity="0.8"/>
        <rect x="21.5" y="12.5" width="2" height="4" rx="1" fill="#ffffff" opacity="0.8"/>
        <rect x="25.5" y="14.5" width="2" height="4" rx="1" fill="#ffffff" opacity="0.8"/>
      </svg>
    `;
  } else if (classification.category === "2-engine-wide") {
    // Twin-Engine Widebody (B777 / A350 / B787)
    svgContent = `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 2.5 C14.5 2.5 13.8 5.5 13.8 11.5 L13.8 21.5 L11 24.5 L11 26.5 L16 25 L21 26.5 L21 24.5 L18.2 21.5 L18.2 11.5 C18.2 5.5 17.5 2.5 16 2.5 Z"/>
        <path d="M13.8 11.5 L3 18 L3 20 L13.8 16 Z"/>
        <path d="M18.2 11.5 L29 18 L29 20 L18.2 16 Z"/>
        <rect x="7.8" y="13" width="2.2" height="4.2" rx="1" fill="#ffffff" opacity="0.8"/>
        <rect x="22" y="13" width="2.2" height="4.2" rx="1" fill="#ffffff" opacity="0.8"/>
      </svg>
    `;
  } else if (classification.category === "2-engine-narrow") {
    // Narrowbody Jet (A320 / B737)
    svgContent = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fillColor}" stroke="${strokeColor}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 1.8 C11 1.8 10.2 4.2 10.2 8.5 L10.2 15.8 L7 18.2 L7 19.8 L12 18.5 L17 19.8 L17 18.2 L13.8 15.8 L13.8 8.5 C13.8 4.2 13 1.8 12 1.8 Z"/>
        <path d="M10.2 8.5 L2 13.5 L2 15 L10.2 12 Z"/>
        <path d="M13.8 8.5 L22 13.5 L22 15 L13.8 12 Z"/>
        <rect x="6" y="10.5" width="1.6" height="3" rx="0.8" fill="#ffffff" opacity="0.8"/>
        <rect x="16.4" y="10.5" width="1.6" height="3" rx="0.8" fill="#ffffff" opacity="0.8"/>
      </svg>
    `;
  } else {
    // Regional / General Aviation
    svgContent = `
      <svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="${fillColor}" stroke="${strokeColor}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 1.5 C9.3 1.5 8.8 3.5 8.8 7 L8.8 12.8 L6 14.8 L6 16 L10 15 L14 16 L14 14.8 L11.2 12.8 L11.2 7 C11.2 3.5 10.7 1.5 10 1.5 Z"/>
        <path d="M8.8 7 L1.8 11 L1.8 12 L8.8 9.8 Z"/>
        <path d="M11.2 7 L18.2 11 L18.2 12 L11.2 9.8 Z"/>
      </svg>
    `;
  }

  return L.divIcon({
    className: "custom-plane-container",
    html: `
      <div style="transform: rotate(${rotation}deg); transform-origin: center center; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; filter: ${glow};">
        ${svgContent}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function App() {
  const [activeTab, setActiveTab] = useState("radar");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loadingFlights, setLoadingFlights] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFlightNumOnly, setSearchFlightNumOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<AircraftCategory | "all">("all");
  const [minAltitudeFilter, setMinAltitudeFilter] = useState(0);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedFlightDetails, setSelectedFlightDetails] = useState<FlightDetailed | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [tileMode, setTileMode] = useState<"dark" | "satellite">("dark");
  const [weatherEnabled, setWeatherEnabled] = useState(false);
  const [followFlight, setFollowFlight] = useState(true);
  const [visibleFlightsCount, setVisibleFlightsCount] = useState(40);
  const loadMoreIncrement = 50;
  const [cockpitFlight, setCockpitFlight] = useState<Flight | null>(null);
  const [showCockpitModal, setShowCockpitModal] = useState(false);

  // Map references
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const briefingMapRef = useRef<L.Map | null>(null);
  const briefingMapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [hex: string]: L.Marker }>({});
  const animStatesRef = useRef<{ [hex: string]: FlightAnimState }>({});
  const pathLayerRef = useRef<L.LayerGroup | null>(null);

  // Invalidate Leaflet map size on tab switch to fix gray/blank tile glitches
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "radar" && mapRef.current) {
        mapRef.current.invalidateSize();
      } else if (activeTab === "briefing" && briefingMapRef.current) {
        briefingMapRef.current.invalidateSize();
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Fetch live transponder vector telemetry from backend API
  const fetchFlights = useCallback(async () => {
    try {
      const response = await fetch("/api/flights");
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data && Array.isArray(data.flights)) {
          data.flights.forEach((f: Flight) => {
            const existing = animStatesRef.current[f.hex];
            const newDir = f.dir || 0;

            if (!existing) {
              animStatesRef.current[f.hex] = {
                lat: f.lat,
                lng: f.lng,
                dir: newDir,
                targetLat: f.lat,
                targetLng: f.lng,
                targetDir: newDir,
                speedKnots: f.speed_knots || Math.round(f.speed / 1.852) || 450,
                lastFrameMs: performance.now(),
              };
            } else {
              const errDist = getDistanceKm(existing.lat, existing.lng, f.lat, f.lng);
              if (errDist > 30) {
                existing.lat = f.lat;
                existing.lng = f.lng;
                existing.dir = newDir;
              }
              existing.targetLat = f.lat;
              existing.targetLng = f.lng;
              existing.targetDir = newDir;
              existing.speedKnots = f.speed_knots || Math.round(f.speed / 1.852) || existing.speedKnots;
            }
          });

          setFlights(data.flights);
          
          // Live sync selected flight
          setSelectedFlight(prev => {
            if (!prev) return null;
            const fresh = data.flights.find((f: Flight) => f.hex === prev.hex);
            return fresh ? { ...prev, ...fresh } : prev;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching live flight data:", error);
    } finally {
      setLoadingFlights(false);
    }
  }, []);

  useEffect(() => {
    fetchFlights();
    const interval = setInterval(fetchFlights, 3500);
    return () => clearInterval(interval);
  }, [fetchFlights]);

  // Fetch rich flight details (Copilot AI, METAR weather, technical specs)
  const fetchFlightDetails = async (flight: Flight) => {
    setLoadingDetails(true);
    setSelectedFlightDetails(null);

    const fallbackAirlineName = flight.airline_name || getAirlineName(flight.airline_iata || flight.flight_iata?.substring(0, 2) || flight.hex);
    const times = getFlightTimes(flight.flight_iata || flight.hex);
    const model = getAircraftModel(flight);
    const depName = getAirportFullName(flight.dep_iata);
    const arrName = getAirportFullName(flight.arr_iata);

    try {
      const flightIataParam = encodeURIComponent(flight.flight_iata || flight.flight_number || flight.hex);
      const url = `/api/flight-details?flight_iata=${flightIataParam}&dep_iata=${encodeURIComponent(flight.dep_iata || '')}&arr_iata=${encodeURIComponent(flight.arr_iata || '')}&hex=${encodeURIComponent(flight.hex || '')}&reg_number=${encodeURIComponent(flight.reg_number || '')}&alt=${flight.alt || 35000}&speed=${flight.speed || 850}&dir=${flight.dir || 90}&vspeed=${flight.vspeed || 0}&aircraft_type=${encodeURIComponent(flight.aircraft_type || '')}`;
      
      const response = await fetch(url);
      const isJson = response.headers.get("content-type")?.includes("application/json");
      if (response.ok && isJson) {
        const data = await response.json();
        setSelectedFlightDetails({
          airlineName: data.airlineName || fallbackAirlineName,
          departureCity: data.departureCity || flight.dep_city || getAirportCity(flight.dep_iata),
          arrivalCity: data.arrivalCity || flight.arr_city || getAirportCity(flight.arr_iata),
          departureTime: data.departureTime || times.depTime,
          arrivalTime: data.arrivalTime || times.arrTime,
          aircraftModel: data.aircraftModel || model,
          flightDuration: data.flightDuration || times.duration,
          departureAirportFullName: data.departureAirportFullName || depName,
          arrivalAirportFullName: data.arrivalAirportFullName || arrName,
          copilotAnalysis: data.copilotAnalysis,
          currentWeather: data.currentWeather
        });
      } else {
        setSelectedFlightDetails({
          airlineName: fallbackAirlineName,
          departureCity: flight.dep_city || getAirportCity(flight.dep_iata),
          arrivalCity: flight.arr_city || getAirportCity(flight.arr_iata),
          departureTime: times.depTime,
          arrivalTime: times.arrTime,
          aircraftModel: model,
          flightDuration: times.duration,
          departureAirportFullName: depName,
          arrivalAirportFullName: arrName
        });
      }
    } catch (error) {
      console.error("Error fetching flight details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Filtered flights for the Search Tab
  const filteredFlights = useMemo(() => {
    const qRaw = searchQuery.trim().toLowerCase();
    const qClean = qRaw.replace(/\s+/g, "");

    return flights.filter(f => {
      const iataClean = (f.flight_iata || "").toLowerCase().replace(/\s+/g, "");
      const numClean = (f.flight_number || "").toLowerCase().replace(/\s+/g, "");
      const hexClean = (f.hex || "").toLowerCase().replace(/\s+/g, "");

      const matchSearch = qRaw === "" || (
        iataClean.includes(qClean) ||
        numClean.includes(qClean) ||
        hexClean.includes(qClean) ||
        (f.dep_iata || "").toLowerCase().includes(qRaw) ||
        (f.arr_iata || "").toLowerCase().includes(qRaw) ||
        (f.dep_city || "").toLowerCase().includes(qRaw) ||
        (f.arr_city || "").toLowerCase().includes(qRaw) ||
        (f.airline_name || "").toLowerCase().includes(qRaw) ||
        (f.aircraft_type || "").toLowerCase().includes(qRaw)
      );
      
      const matchStatus = statusFilter === "all" || 
        (statusFilter === "high" && f.alt >= 35000) ||
        (statusFilter === "climbing" && (f.vspeed || 0) > 300) ||
        (statusFilter === "descending" && (f.vspeed || 0) < -300) ||
        (statusFilter === "ground" && f.status === "ground");

      const matchAlt = minAltitudeFilter === 0 || f.alt >= minAltitudeFilter;

      const matchCategory = selectedCategory === "all" || 
        f.category === selectedCategory ||
        ((selectedCategory === "passenger" || selectedCategory === "commercial") && (f.category === "passenger" || f.category === "commercial")) ||
        (selectedCategory === "military" && (f.category === "military" || f.aircraft_type === "F35" || f.aircraft_type === "F22" || f.aircraft_type === "EF2000" || f.aircraft_type === "B2")) ||
        (selectedCategory === "helicopter" && (f.category === "helicopter" || f.aircraft_type === "H145" || f.aircraft_type === "EC135" || f.aircraft_type === "UH60"));

      return matchSearch && matchStatus && matchAlt && matchCategory;
    });
  }, [flights, searchQuery, statusFilter, minAltitudeFilter, selectedCategory]);

  // Initialize Radar Map
  useEffect(() => {
    if (activeTab !== "radar" || !mapContainerRef.current) return;
    
    if (!mapRef.current) {
      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
      try {
        mapRef.current = L.map(mapContainerRef.current, {
          zoomControl: false,
          attributionControl: false,
          preferCanvas: true
        }).setView([28, 15], 3);

        L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
      } catch (err) {
        console.warn("Radar map init notice:", err);
      }
    }

    const tileUrl = tileMode === "satellite" 
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapRef.current?.removeLayer(layer);
      }
    });
    
    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(mapRef.current);

    if (weatherEnabled) {
      L.tileLayer('https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png', {
        opacity: 0.65,
        maxZoom: 19,
        attribution: 'Iowa Environmental Mesonet'
      }).addTo(mapRef.current);
    }
  }, [activeTab, tileMode, weatherEnabled]);

  // Viewport tracking state for dynamic radar flight streaming
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);

  useEffect(() => {
    if (activeTab !== "radar" || !mapRef.current) return;
    
    const updateBounds = () => {
      if (mapRef.current) {
        setMapBounds(mapRef.current.getBounds().pad(0.35));
      }
    };

    mapRef.current.on("moveend zoomend", updateBounds);
    updateBounds();

    return () => {
      mapRef.current?.off("moveend zoomend", updateBounds);
    };
  }, [activeTab]);

  // High performance Leaflet animation & marker management loop
  useEffect(() => {
    if (activeTab !== "radar" || !mapRef.current) return;
    
    // Viewport-aware flight collection: show ALL flights within the user's view!
    let displayList: Flight[] = [];
    
    let candidateFlights = flights;
    if (selectedCategory && selectedCategory !== "all") {
      candidateFlights = candidateFlights.filter(f => 
        f.category === selectedCategory ||
        ((selectedCategory === "passenger" || selectedCategory === "commercial") && (f.category === "passenger" || f.category === "commercial")) ||
        (selectedCategory === "military" && (f.category === "military" || f.aircraft_type === "F35" || f.aircraft_type === "F22" || f.aircraft_type === "EF2000" || f.aircraft_type === "B2")) ||
        (selectedCategory === "helicopter" && (f.category === "helicopter" || f.aircraft_type === "H145" || f.aircraft_type === "EC135" || f.aircraft_type === "UH60"))
      );
    }

    if (mapBounds && mapRef.current.getZoom() > 4) {
      // Zoomed into region/country/city: show 100% of flights in view!
      const inView = candidateFlights.filter(f => mapBounds.contains([f.lat, f.lng]));
      displayList = inView.slice(0, 3000);
    } else {
      // Zoomed out globally: display up to 2,500 active aircraft across continents
      displayList = candidateFlights.slice(0, 2500);
    }

    // Always ensure selected flight is rendered
    if (selectedFlight && !displayList.some(f => f.hex === selectedFlight.hex)) {
      displayList.push(selectedFlight);
    }

    const currentHexes = new Set(displayList.map(f => f.hex));
    
    // Remove stale markers
    Object.keys(markersRef.current).forEach(hex => {
      if (!currentHexes.has(hex)) {
        mapRef.current?.removeLayer(markersRef.current[hex]);
        delete markersRef.current[hex];
        delete animStatesRef.current[hex];
      }
    });

    // Create / update markers
    displayList.forEach(flight => {
      const isSelected = selectedFlight?.hex === flight.hex;
      const initialHeading = flight.dir || 0;

      if (!animStatesRef.current[flight.hex]) {
        animStatesRef.current[flight.hex] = {
          lat: flight.lat,
          lng: flight.lng,
          dir: initialHeading,
          targetLat: flight.lat,
          targetLng: flight.lng,
          targetDir: initialHeading,
          speedKnots: flight.speed_knots || Math.round(flight.speed / 1.852) || 450,
          lastFrameMs: performance.now()
        };
      }

      if (!markersRef.current[flight.hex]) {
        const icon = createPlaneIcon(flight, initialHeading, isSelected);
        const marker = L.marker([flight.lat, flight.lng], { icon, zIndexOffset: isSelected ? 1000 : 1 })
          .addTo(mapRef.current!)
          .on("click", () => {
            setSelectedFlight(flight);
            fetchFlightDetails(flight);
          });
        markersRef.current[flight.hex] = marker;
      } else {
        const currentMarker = markersRef.current[flight.hex];
        const icon = createPlaneIcon(flight, animStatesRef.current[flight.hex].dir, isSelected);
        currentMarker.setIcon(icon);
        currentMarker.setZIndexOffset(isSelected ? 1000 : 1);
      }
    });

    if (!pathLayerRef.current) {
      pathLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }

    let animFrameId: number;

    const renderLoop = (now: number) => {
      if (!mapRef.current) return;
      const selectedHex = selectedFlight?.hex;

      displayList.forEach(flight => {
        const anim = animStatesRef.current[flight.hex];
        const marker = markersRef.current[flight.hex];
        if (!anim || !marker) return;

        const deltaMs = Math.min(50, now - (anim.lastFrameMs || now));
        anim.lastFrameMs = now;

        // Bounded dead-reckoning extrapolation
        const speedKmPerMs = (anim.speedKnots * 1.852) / 3600000;
        const stepDistanceKm = Math.min(0.05, speedKmPerMs * deltaMs);

        const radHeading = (anim.dir * Math.PI) / 180;
        const radLat = (anim.lat * Math.PI) / 180;
        const dLat = (stepDistanceKm / 6371) * (180 / Math.PI) * Math.cos(radHeading);
        const dLng = (stepDistanceKm / 6371) * (180 / Math.PI) * Math.sin(radHeading) / Math.max(0.1, Math.cos(radLat));

        anim.targetLat += dLat;
        anim.targetLng += dLng;

        // Smooth position interpolation (lerp factor)
        anim.lat += (anim.targetLat - anim.lat) * 0.12;
        anim.lng += (anim.targetLng - anim.lng) * 0.12;

        // Smooth heading angular interpolation
        const angleDiff = ((anim.targetDir - anim.dir + 540) % 360) - 180;
        anim.dir = (anim.dir + angleDiff * 0.12 + 360) % 360;

        marker.setLatLng([anim.lat, anim.lng]);

        // Direct DOM transform update for plane rotation
        const el = marker.getElement();
        if (el) {
          const inner = el.querySelector(".custom-plane-container > div") as HTMLElement;
          if (inner) {
            inner.style.transform = `rotate(${anim.dir}deg)`;
          }
        }

        // Camera follow selected aircraft
        if (flight.hex === selectedHex && followFlight) {
          mapRef.current.panTo([anim.lat, anim.lng], { animate: false });
        }

        // Great-circle trajectory and velocity vector
        if (flight.hex === selectedHex && pathLayerRef.current) {
          pathLayerRef.current.clearLayers();

          const depCoords = getAirportCoords(flight.dep_iata);
          const arrCoords = getAirportCoords(flight.arr_iata);
          const currentCoords: [number, number] = [anim.lat, anim.lng];

          const speed = flight.speed || 500;
          const forwardVectorPoint = getVectorPoint(anim.lat, anim.lng, anim.dir, Math.max(25, speed * 0.2));

          // Traveled Arc from Departure
          if (depCoords) {
            const traveledArc = getGreatCircleArcPoints(depCoords, currentCoords, 25);
            L.polyline(traveledArc, { color: '#00f0ff', weight: 3.5, opacity: 0.95 }).addTo(pathLayerRef.current);

            const depIcon = L.divIcon({
              className: "dep-node",
              html: `<div class="flex items-center gap-1.5 bg-black/90 border border-cyan-400 text-cyan-300 font-mono text-[9px] font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_#00f0ff]"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>${flight.dep_iata}</div>`,
              iconSize: [55, 20],
              iconAnchor: [27, 10]
            });
            L.marker(depCoords, { icon: depIcon }).addTo(pathLayerRef.current);
          }

          // Dynamic Forward Speed Vector
          L.polyline([currentCoords, forwardVectorPoint], { color: '#00ff9d', weight: 3, opacity: 1, dashArray: '4, 4' }).addTo(pathLayerRef.current);

          // Remaining Arc to Destination
          if (arrCoords) {
            const remainingArc = getGreatCircleArcPoints(currentCoords, arrCoords, 25);
            L.polyline(remainingArc, { color: '#f59e0b', weight: 2.5, opacity: 0.8, dashArray: '6, 8' }).addTo(pathLayerRef.current);

            const arrIcon = L.divIcon({
              className: "arr-node",
              html: `<div class="flex items-center gap-1.5 bg-black/90 border border-amber-400 text-amber-300 font-mono text-[9px] font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_#f59e0b]"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>${flight.arr_iata}</div>`,
              iconSize: [55, 20],
              iconAnchor: [27, 10]
            });
            L.marker(arrCoords, { icon: arrIcon }).addTo(pathLayerRef.current);
          }
        }
      });

      if (!selectedFlight && pathLayerRef.current) {
        pathLayerRef.current.clearLayers();
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [flights, activeTab, selectedFlight, followFlight]);

  // Briefing mini-map handler
  useEffect(() => {
    if (activeTab === "briefing" && briefingMapContainerRef.current && selectedFlight) {
      if (!briefingMapRef.current) {
        if ((briefingMapContainerRef.current as any)._leaflet_id) {
          delete (briefingMapContainerRef.current as any)._leaflet_id;
        }
        try {
          briefingMapRef.current = L.map(briefingMapContainerRef.current, {
            zoomControl: false,
            attributionControl: false,
            preferCanvas: true
          });
        } catch (err) {
          console.warn("Briefing map init notice:", err);
        }
      }

      const tileUrl = tileMode === "satellite" 
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

      briefingMapRef.current.eachLayer((layer) => {
        briefingMapRef.current?.removeLayer(layer);
      });
      L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(briefingMapRef.current);

      const depCoords = getAirportCoords(selectedFlight.dep_iata);
      const arrCoords = getAirportCoords(selectedFlight.arr_iata);
      const currentCoords: [number, number] = [selectedFlight.lat, selectedFlight.lng];

      const airportIcon = L.divIcon({
        className: 'airport-node',
        html: `<div class="w-3 h-3 bg-black border-2 border-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      if (depCoords) L.marker(depCoords, { icon: airportIcon }).addTo(briefingMapRef.current);
      if (arrCoords) L.marker(arrCoords, { icon: airportIcon }).addTo(briefingMapRef.current);

      const planeIcon = createPlaneIcon(selectedFlight, selectedFlight.dir || 0, true);
      L.marker(currentCoords, { icon: planeIcon }).addTo(briefingMapRef.current);

      if (depCoords && arrCoords) {
        const fullArc = getGreatCircleArcPoints(depCoords, arrCoords, 40);
        const traveledArc = getGreatCircleArcPoints(depCoords, currentCoords, 25);
        
        L.polyline(fullArc, { color: 'rgba(255,255,255,0.2)', dashArray: '5, 8', weight: 2 }).addTo(briefingMapRef.current);
        L.polyline(traveledArc, { color: '#00f0ff', weight: 3.5 }).addTo(briefingMapRef.current);
        
        const bounds = L.latLngBounds([depCoords, arrCoords, currentCoords]);
        briefingMapRef.current.fitBounds(bounds, { padding: [35, 35] });
      } else {
        briefingMapRef.current.setView(currentCoords, 6);
      }
    }
  }, [activeTab, selectedFlight, tileMode]);

  // Analytics Chart Data Aggregations
  const { airlineChartData, altitudeChartData, speedChartData } = useMemo(() => {
    const airlines: Record<string, number> = {};
    const alts: Record<string, number> = { "< 10k": 0, "10k-20k": 0, "20k-30k": 0, "30k-38k": 0, "38k+": 0 };
    const speeds: Record<string, number> = { "< 400": 0, "400-600": 0, "600-800": 0, "800-950": 0, "950+": 0 };
    
    flights.forEach(f => {
      const name = f.airline_name || getAirlineName(f.airline_iata || f.flight_iata?.substring(0, 2) || f.hex);
      if (name && name !== "Unknown Airline") airlines[name] = (airlines[name] || 0) + 1;
      
      if (f.alt < 10000) alts["< 10k"]++; 
      else if (f.alt < 20000) alts["10k-20k"]++; 
      else if (f.alt < 30000) alts["20k-30k"]++; 
      else if (f.alt < 38000) alts["30k-38k"]++; 
      else alts["38k+"]++;

      if (f.speed < 400) speeds["< 400"]++; 
      else if (f.speed < 600) speeds["400-600"]++; 
      else if (f.speed < 800) speeds["600-800"]++; 
      else if (f.speed < 950) speeds["800-950"]++; 
      else speeds["950+"]++;
    });
    
    return {
      airlineChartData: Object.entries(airlines).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, val]) => ({ name: name.length > 14 ? name.substring(0, 14) + "..." : name, Flights: val })),
      altitudeChartData: Object.entries(alts).map(([name, val]) => ({ name, Airplanes: val })),
      speedChartData: Object.entries(speeds).map(([name, val]) => ({ name, Airplanes: val }))
    };
  }, [flights]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#07090e] text-slate-200 font-sans overflow-hidden">
      
      {/* Mobile Top Avionics Bar */}
      <header className="h-11 border-b border-white/10 flex md:hidden items-center justify-between px-3.5 glass-panel shrink-0 z-20 shadow-lg">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-cyan-400 rotate-45" />
          <span className="font-mono text-xs font-black tracking-wider text-white">SKYPULSE</span>
          <span className="text-[9px] px-1 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-extrabold">LIVE</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono text-slate-400 font-bold">{flights.length.toLocaleString()} AIRCRAFT</span>
          <a
            href="https://naufal.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono font-black text-cyan-300 hover:text-white flex items-center gap-1 underline underline-offset-2"
          >
            <span>NAUFAL.IN</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </header>

      {/* Top Glass Cockpit Avionics Header (Desktop) */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 md:px-6 glass-panel shrink-0 z-20 hidden md:flex shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-600/30 border border-blue-400/50 rounded-xl shadow-lg shadow-blue-500/20">
            <Plane className="w-5 h-5 text-cyan-400 rotate-45" />
          </div>
          <div>
            <h1 className="font-mono text-sm font-black tracking-widest uppercase text-white flex items-center gap-1.5">
              <span>SKYPULSE ADS-B</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-extrabold">LIVE</span>
            </h1>
            <span className="text-[9px] font-mono font-extrabold text-slate-400 tracking-wider block -mt-0.5">
              GLOBAL FLIGHT TRACKER & AVIONICS TELEMETRY
            </span>
          </div>
        </div>

        {/* Center: Live Transponder Telemetry Indicator */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-black/60 border border-cyan-500/30 rounded-xl shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-slate-300 font-extrabold text-[11px] uppercase tracking-wider">
              TRANSPONDERS: <strong className="text-white text-xs">{flights.length.toLocaleString()}</strong> ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-[10px] uppercase">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>60 FPS DEAD RECKONING</span>
          </div>
        </div>
        
        {/* Right: Modern Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "radar", label: "TACTICAL RADAR", icon: MapPin },
            { id: "search", label: "FLIGHT BOARD", icon: Search },
            { id: "briefing", label: "AVIONICS DECK", icon: Plane },
            { id: "comms", label: "ATC COMMS", icon: Radio },
            { id: "airports", label: "AIRPORT HUBS", icon: Building2 },
            { id: "analytics", label: "SPECTRUM STATS", icon: BarChart2 }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "radar") fetchFlights();
              }} 
              className={`px-3 py-1.5 text-[10px] font-mono font-black tracking-wider rounded-xl cursor-pointer select-none border transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-blue-600 text-white border-blue-400/60 shadow-lg shadow-blue-600/30" 
                  : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#07090e]">
        <RadarTab 
          activeTab={activeTab}
          mapContainerRef={mapContainerRef}
          tileMode={tileMode}
          setTileMode={setTileMode}
          weatherEnabled={weatherEnabled}
          setWeatherEnabled={setWeatherEnabled}
          followFlight={followFlight}
          setFollowFlight={setFollowFlight}
          flights={flights}
          selectedFlight={selectedFlight}
          selectedFlightDetails={selectedFlightDetails}
          setActiveTab={setActiveTab}
          closeDetailsPanel={() => setSelectedFlight(null)}
          minAltitudeFilter={minAltitudeFilter}
          setMinAltitudeFilter={setMinAltitudeFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onOpen3DCockpit={(flight: Flight) => {
            setCockpitFlight(flight);
            setShowCockpitModal(true);
          }}
          onSelectFlight={(flight: Flight) => {
            setSelectedFlight(flight);
            fetchFlightDetails(flight);
            if (mapRef.current) {
              mapRef.current.setView([flight.lat, flight.lng], 7);
            }
          }}
        />

        <SearchTab 
          activeTab={activeTab}
          visibleFlightsCount={visibleFlightsCount}
          setVisibleFlightsCount={setVisibleFlightsCount}
          loadMoreIncrement={loadMoreIncrement}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchFlightNumOnly={searchFlightNumOnly}
          setSearchFlightNumOnly={setSearchFlightNumOnly}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          loadingFlights={loadingFlights}
          filteredFlights={filteredFlights}
          flights={flights}
          selectedFlight={selectedFlight}
          setSelectedFlight={setSelectedFlight}
          fetchFlightDetails={fetchFlightDetails}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onOpen3DCockpit={(flight: Flight) => {
            setCockpitFlight(flight);
            setShowCockpitModal(true);
          }}
          setActiveTabMain={(tab: string) => {
            setActiveTab(tab);
            if (tab === "radar" && selectedFlight && mapRef.current) {
              mapRef.current.setView([selectedFlight.lat, selectedFlight.lng], 7);
            }
          }}
        />

        <BriefingTab 
          activeTab={activeTab}
          selectedFlight={selectedFlight}
          selectedFlightDetails={selectedFlightDetails}
          loadingDetails={loadingDetails}
          progressPercent={selectedFlight?.progress_percent || 50}
          distanceStats={{
            traveledKm: selectedFlight?.distance_traveled_km || 0,
            totalKm: (selectedFlight?.distance_traveled_km || 0) + (selectedFlight?.distance_remaining_km || 0),
            remainingKm: selectedFlight?.distance_remaining_km || 0
          }}
          briefingMapContainerRef={briefingMapContainerRef}
          tileMode={tileMode}
          setTileMode={setTileMode}
          setActiveTab={setActiveTab}
          onOpen3DCockpit={(flight: Flight) => {
            setCockpitFlight(flight);
            setShowCockpitModal(true);
          }}
        />

        <AtcCommsTab 
          activeTab={activeTab}
          flights={flights}
          selectedFlight={selectedFlight}
          onSelectFlight={(flight: Flight) => {
            setSelectedFlight(flight);
            fetchFlightDetails(flight);
          }}
          setActiveTab={setActiveTab}
        />

        <AirportExplorerTab 
          activeTab={activeTab}
          flights={flights}
          onSelectAirport={(iata: string, lat: number, lng: number) => {
            if (mapRef.current) {
              mapRef.current.setView([lat, lng], 8);
            }
          }}
          setActiveTab={setActiveTab}
        />

        <AnalyticsTab
          activeTab={activeTab}
          airlineChartData={airlineChartData}
          altitudeChartData={altitudeChartData}
          speedChartData={speedChartData}
          flights={flights}
        />
      </main>
      
      {/* Sleek Cockpit Footer */}
      <footer className="h-8 border-t border-white/10 hidden md:flex items-center justify-between px-6 bg-[#07090e] shrink-0 text-[10px] font-mono text-slate-400 font-extrabold tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ADS-B MODE-S GLOBAL SATELLITE STREAM ONLINE</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>OPENSKY NETWORK REAL-TIME AIRSPACE</span>
          <span>•</span>
          <span className="text-cyan-400">SKYPULSE GLASS COCKPIT</span>
          <span>•</span>
          <a 
            href="https://naufal.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-cyan-300 hover:text-white transition-colors underline underline-offset-2 flex items-center gap-1 font-black"
          >
            <span>NAUFAL.IN</span>
            <ExternalLink className="w-3 h-3 text-cyan-300" />
          </a>
        </div>
      </footer>

      {/* Mobile Glass Bottom Navigation */}
      <nav className="md:hidden flex items-center justify-around px-1 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] glass-panel border-t border-white/10 shrink-0 overflow-x-auto">
        {[
          { id: "radar", icon: MapPin, label: "Radar" },
          { id: "search", icon: Search, label: "Board" },
          { id: "briefing", icon: Plane, label: "Avionics" },
          { id: "comms", icon: Radio, label: "ATC" },
          { id: "airports", icon: Building2, label: "Hubs" },
          { id: "analytics", icon: BarChart2, label: "Stats" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[52px] h-12 rounded-xl transition-all cursor-pointer ${
                isActive ? "text-cyan-300 bg-cyan-500/15 border border-cyan-500/30" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? "glow-cyan" : ""}`} />
              <span className="text-[8px] font-black tracking-wider font-mono uppercase">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 3D Real-time Cockpit / Orbital Flight Simulator Modal */}
      {showCockpitModal && cockpitFlight && (
        <Cockpit3DModal
          flight={cockpitFlight}
          onClose={() => setShowCockpitModal(false)}
          onFocusOnMap={(f) => {
            setSelectedFlight(f);
            setActiveTab("radar");
            if (mapRef.current) {
              mapRef.current.setView([f.lat, f.lng], 7);
            }
          }}
        />
      )}
    </div>
  );
}
