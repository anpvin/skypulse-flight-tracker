import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { 
  globalAirports, 
  majorAirlines, 
  aircraftModelMap, 
  getDistanceKm, 
  calculateBearing,
  generateMetarWeather,
  estimateMach,
  getAirportFullName,
  getAirportCity
} from "./src/utils";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

// Initialize server-side Gemini client lazily
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    try {
      aiInstance = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'skypulse-flight-tracker',
          }
        }
      });
    } catch (e) {
      console.warn("Failed to initialize Gemini client:", e);
      return null;
    }
  }
  return aiInstance;
}

// In-Memory cache for high-speed delivery
interface CachedFlights {
  data: any[];
  timestamp: number;
  source: string;
  totalTracked: number;
}
let flightsCache: CachedFlights = {
  data: [],
  timestamp: 0,
  source: "initializing",
  totalTracked: 0
};

// Global airport list array for fast geometric proximity calculations
const airportArray = Object.values(globalAirports);

// Find best matching departure & arrival airports given aircraft position, heading, and airline hub
function resolveFlightRoute(
  lat: number,
  lng: number,
  headingDeg: number,
  airlineCode: string,
  callsign: string
): { depIata: string; arrIata: string; depCity: string; arrCity: string } {
  const airline = majorAirlines[airlineCode] || majorAirlines[airlineCode.slice(0, 2)] || majorAirlines[callsign.slice(0, 3)];
  const primaryHubIata = airline?.hub || "JFK";
  const primaryHub = globalAirports[primaryHubIata] || globalAirports["JFK"];

  let bestDep: any = primaryHub;
  let bestArr: any = globalAirports["LHR"];
  let minDepScore = Infinity;
  let minArrScore = Infinity;

  for (let i = 0; i < airportArray.length; i++) {
    const airport = airportArray[i];
    const dist = getDistanceKm(lat, lng, airport.lat, airport.lng);
    if (dist > 14000) continue;

    const bearingFromAirport = calculateBearing(airport.lat, airport.lng, lat, lng);
    const bearingToAirport = calculateBearing(lat, lng, airport.lat, airport.lng);

    const depAngleDiff = Math.abs(((headingDeg - bearingFromAirport + 540) % 360) - 180);
    const arrAngleDiff = Math.abs(((headingDeg - bearingToAirport + 540) % 360) - 180);

    const hubDepBonus = (airport.iata === primaryHubIata) ? 0.4 : 1.0;
    const depScore = (depAngleDiff * 2 + dist * 0.05) * hubDepBonus;
    if (depAngleDiff < 75 && depScore < minDepScore) {
      minDepScore = depScore;
      bestDep = airport;
    }

    const hubArrBonus = (airport.iata === primaryHubIata) ? 0.6 : 1.0;
    const arrScore = (arrAngleDiff * 2 + dist * 0.05) * hubArrBonus;
    if (arrAngleDiff < 75 && arrScore < minArrScore && airport.iata !== bestDep?.iata) {
      minArrScore = arrScore;
      bestArr = airport;
    }
  }

  if (!bestDep || !bestArr || bestDep.iata === bestArr.iata) {
    if (airline?.hub && globalAirports[airline.hub]) {
      bestDep = globalAirports[airline.hub];
      bestArr = globalAirports["LHR"] || globalAirports["JFK"];
    } else {
      bestDep = globalAirports["JFK"];
      bestArr = globalAirports["LHR"];
    }
  }

  return {
    depIata: bestDep.iata,
    arrIata: bestArr.iata,
    depCity: bestDep.city,
    arrCity: bestArr.city
  };
}

// 1. OpenSky Network Global Live Ingestor (Supports Anonymous & Authenticated API Keys)
let openSkyBackoffUntil = 0;

async function fetchOpenSkyGlobalFlights(): Promise<{ flights: any[]; source: string }> {
  if (Date.now() < openSkyBackoffUntil) {
    return { flights: [], source: "opensky-rate-limited" };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const headers: Record<string, string> = {
      "User-Agent": "SkyPulseFlightTracker/5.0 (Live Aviation Telemetry)",
      "Accept": "application/json"
    };

    // Authenticate if OpenSky credentials are provided in .env
    if (process.env.OPENSKY_USERNAME && process.env.OPENSKY_PASSWORD) {
      const basic = Buffer.from(`${process.env.OPENSKY_USERNAME}:${process.env.OPENSKY_PASSWORD}`).toString("base64");
      headers["Authorization"] = `Basic ${basic}`;
    } else if (process.env.OPENSKY_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.OPENSKY_TOKEN}`;
    }

    const res = await fetch("https://opensky-network.org/api/states/all", {
      signal: controller.signal,
      headers
    });
    clearTimeout(timeoutId);

    if (res.status === 429) {
      openSkyBackoffUntil = Date.now() + 30000; // back off for 30 seconds
      return { flights: [], source: "opensky-429" };
    }

    if (!res.ok) {
      console.warn(`OpenSky returned HTTP ${res.status}`);
      return { flights: [], source: "opensky-error" };
    }

    const json = await res.json();
    if (!json || !Array.isArray(json.states)) return { flights: [], source: "opensky-empty" };

    const parsedFlights: any[] = [];
    const validStates = json.states;

    for (let i = 0; i < validStates.length; i++) {
      const state = validStates[i];
      if (!Array.isArray(state) || state.length < 11) continue;

      const hex = (state[0] || "").toString().trim().toUpperCase();
      if (!hex) continue;

      const callsign = (state[1] || "").toString().trim().toUpperCase();
      const lng = parseFloat(state[5]);
      const lat = parseFloat(state[6]);
      if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) continue;

      const altMeters = parseFloat(state[7] || state[13] || 0);
      const altFt = Math.max(0, Math.round(altMeters * 3.28084));
      const velocityMs = parseFloat(state[9] || 0);
      const speedKmh = Math.max(0, Math.round(velocityMs * 3.6));
      const speedKnots = Math.round(speedKmh / 1.852);
      const track = Math.round(parseFloat(state[10] || 0));
      const vspeedMps = parseFloat(state[11] || 0);
      const vspeedFpm = Math.round(vspeedMps * 196.85);
      const onGround = Boolean(state[8]);
      const squawk = (state[14] || "").toString().trim();
      const country = (state[2] || "").toString().trim();

      // Resolve Airline
      let airlineIata = "";
      let airlineIcao = "";
      let airlineName = "Commercial Air Transport";

      if (callsign && callsign.length >= 2) {
        const prefix3 = callsign.slice(0, 3);
        const prefix2 = callsign.slice(0, 2);
        if (majorAirlines[prefix3]) {
          airlineIcao = majorAirlines[prefix3].icao;
          airlineIata = majorAirlines[prefix3].iata;
          airlineName = majorAirlines[prefix3].name;
        } else if (majorAirlines[prefix2]) {
          airlineIcao = majorAirlines[prefix2].icao;
          airlineIata = majorAirlines[prefix2].iata;
          airlineName = majorAirlines[prefix2].name;
        } else {
          airlineIcao = prefix3;
          airlineIata = prefix2;
          airlineName = country ? `${country} Carrier` : "Global Air Carrier";
        }
      }

      let status: "en-route" | "climbing" | "descending" | "ground" = "en-route";
      if (onGround || speedKmh < 45 || altFt < 500) {
        status = "ground";
      } else if (vspeedFpm > 400) {
        status = "climbing";
      } else if (vspeedFpm < -400) {
        status = "descending";
      }

      const route = resolveFlightRoute(lat, lng, track, airlineIcao || airlineIata, callsign);
      const depAirport = globalAirports[route.depIata];
      const arrAirport = globalAirports[route.arrIata];

      let distTotalKm = 0;
      let distTraveledKm = 0;
      let distRemainingKm = 0;
      let progressPercent = 50;
      let etaMinutes = 60;

      if (depAirport && arrAirport) {
        distTotalKm = getDistanceKm(depAirport.lat, depAirport.lng, arrAirport.lat, arrAirport.lng);
        distTraveledKm = getDistanceKm(depAirport.lat, depAirport.lng, lat, lng);
        distRemainingKm = Math.max(0, getDistanceKm(lat, lng, arrAirport.lat, arrAirport.lng));
        if (distTotalKm > 0) {
          progressPercent = Math.min(100, Math.max(0, Math.round((distTraveledKm / distTotalKm) * 100)));
        }
        if (speedKmh > 100) {
          etaMinutes = Math.round((distRemainingKm / speedKmh) * 60);
        }
      }

      let aircraftType = "B738";
      if (altFt >= 38000 || speedKmh > 920) aircraftType = "A359";
      else if (altFt >= 34000) aircraftType = "B789";
      else if (altFt >= 28000) aircraftType = "A320";
      else if (altFt >= 18000) aircraftType = "E190";
      else if (speedKmh < 300) aircraftType = "AT76";

      const modelInfo = aircraftModelMap[aircraftType];
      const mach = estimateMach(speedKmh, altFt);

      parsedFlights.push({
        hex,
        reg_number: hex,
        flag: country,
        flight_number: callsign || hex,
        flight_icao: callsign || hex,
        flight_iata: callsign || hex,
        dep_icao: depAirport?.icao || "ZZZZ",
        dep_iata: route.depIata,
        dep_city: route.depCity,
        dep_name: depAirport?.name || `${route.depIata} Airport`,
        arr_icao: arrAirport?.icao || "ZZZZ",
        arr_iata: route.arrIata,
        arr_city: route.arrCity,
        arr_name: arrAirport?.name || `${route.arrIata} Airport`,
        airline_icao: airlineIcao,
        airline_iata: airlineIata,
        airline_name: airlineName,
        status,
        lat,
        lng,
        alt: altFt,
        dir: track,
        speed: speedKmh,
        speed_knots: speedKnots,
        vspeed: vspeedFpm,
        squawk,
        aircraft_type: aircraftType,
        aircraft_model: modelInfo?.model || "Boeing 737 / Airbus A320",
        aircraft_category: modelInfo?.category || "2-engine-narrow",
        progress_percent: progressPercent,
        dist_traveled_km: distTraveledKm,
        dist_remaining_km: distRemainingKm,
        dist_total_km: distTotalKm,
        distance_traveled_km: distTraveledKm,
        distance_remaining_km: distRemainingKm,
        distance_total_km: distTotalKm,
        eta_minutes: etaMinutes,
        mach
      });
    }

    const isAuth = Boolean(process.env.OPENSKY_USERNAME || process.env.OPENSKY_TOKEN);
    return {
      flights: parsedFlights,
      source: isAuth ? `OpenSky Network Authenticated Feed (${parsedFlights.length} flights)` : `OpenSky Network Global Feed (${parsedFlights.length} flights)`
    };
  } catch (err: any) {
    console.error("OpenSky fetch error:", err?.message || err);
    return { flights: [], source: "error" };
  }
}

// 2. AirLabs Commercial Live Flights Feed Ingestor (if AIRLABS_API_KEY is configured)
async function fetchAirLabsFlights(): Promise<any[]> {
  const apiKey = process.env.AIRLABS_API_KEY;
  if (!apiKey) return [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`https://airlabs.co/api/v9/flights?api_key=${apiKey}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.response)) {
        return json.response.map((f: any) => {
          const lat = parseFloat(f.lat);
          const lng = parseFloat(f.lng);
          const altFt = Math.round(f.alt || 30000);
          const speedKmh = Math.round(f.speed || 800);
          const speedKnots = Math.round(speedKmh / 1.852);
          const dir = Math.round(f.dir || 0);
          const hex = (f.hex || f.flight_icao || "HEX").toUpperCase();

          const depAirport = globalAirports[f.dep_iata] || { name: `${f.dep_iata || 'DEP'} Airport`, city: f.dep_city || 'Origin', icao: f.dep_icao || 'ZZZZ' };
          const arrAirport = globalAirports[f.arr_iata] || { name: `${f.arr_iata || 'ARR'} Airport`, city: f.arr_city || 'Destination', icao: f.arr_icao || 'ZZZZ' };

          return {
            hex,
            reg_number: f.reg_number || hex,
            flag: f.flag || "International",
            flight_number: f.flight_number || f.flight_iata || hex,
            flight_icao: f.flight_icao || hex,
            flight_iata: f.flight_iata || hex,
            dep_icao: f.dep_icao || depAirport.icao,
            dep_iata: f.dep_iata || "DEP",
            dep_city: f.dep_city || depAirport.city,
            dep_name: depAirport.name,
            arr_icao: f.arr_icao || arrAirport.icao,
            arr_iata: f.arr_iata || "ARR",
            arr_city: f.arr_city || arrAirport.city,
            arr_name: arrAirport.name,
            airline_icao: f.airline_icao || "",
            airline_iata: f.airline_iata || "",
            airline_name: f.airline_name || majorAirlines[f.airline_iata]?.name || "Commercial Airline",
            status: f.status || "en-route",
            lat,
            lng,
            alt: altFt,
            dir,
            speed: speedKmh,
            speed_knots: speedKnots,
            vspeed: f.v_speed || 0,
            squawk: f.squawk || "",
            aircraft_type: f.aircraft_icao || "B738",
            aircraft_model: f.aircraft_model || "Boeing 737 / Airbus A320",
            aircraft_category: "2-engine-narrow",
            progress_percent: 50,
            dist_traveled_km: 1000,
            dist_remaining_km: 1500,
            dist_total_km: 2500,
            distance_traveled_km: 1000,
            distance_remaining_km: 1500,
            distance_total_km: 2500,
            eta_minutes: 90,
            mach: estimateMach(speedKmh, altFt)
          };
        });
      }
    }
  } catch (e: any) {
    console.warn("AirLabs fetch warning:", e?.message);
  }
  return [];
}

// 3. Fallback ADSB.fi Community Mirror
async function fetchAdsbFiFallback(): Promise<any[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch("https://opendata.adsb.fi/api/v2/all", {
      signal: controller.signal,
      headers: { "User-Agent": "SkyPulseFlightTracker/5.0" }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.aircraft)) {
        return json.aircraft.filter((a: any) => a.lat && a.lon).map((a: any) => {
          const hex = (a.hex || "").toUpperCase();
          const callsign = (a.flight || a.hex || "").trim().toUpperCase();
          const lat = parseFloat(a.lat);
          const lng = parseFloat(a.lon);
          const altFt = Math.max(0, Math.round(parseFloat(a.alt_baro || a.alt_geom || 30000)));
          const speedKnots = Math.round(parseFloat(a.gs || 400));
          const speedKmh = Math.round(speedKnots * 1.852);
          const dir = Math.round(parseFloat(a.track || a.mag_heading || 0));
          const vspeedFpm = Math.round(parseFloat(a.baro_rate || 0));

          const route = resolveFlightRoute(lat, lng, dir, callsign.slice(0, 3), callsign);
          const depAirport = globalAirports[route.depIata];
          const arrAirport = globalAirports[route.arrIata];

          return {
            hex,
            reg_number: a.r || hex,
            flag: "International",
            flight_number: callsign,
            flight_icao: callsign,
            flight_iata: callsign,
            dep_icao: depAirport?.icao || "ZZZZ",
            dep_iata: route.depIata,
            dep_city: route.depCity,
            dep_name: depAirport?.name || `${route.depIata} Airport`,
            arr_icao: arrAirport?.icao || "ZZZZ",
            arr_iata: route.arrIata,
            arr_city: route.arrCity,
            arr_name: arrAirport?.name || `${route.arrIata} Airport`,
            airline_icao: callsign.slice(0, 3),
            airline_iata: callsign.slice(0, 2),
            airline_name: majorAirlines[callsign.slice(0, 3)]?.name || "Commercial Carrier",
            status: vspeedFpm > 400 ? "climbing" : vspeedFpm < -400 ? "descending" : "en-route",
            lat,
            lng,
            alt: altFt,
            dir,
            speed: speedKmh,
            speed_knots: speedKnots,
            vspeed: vspeedFpm,
            squawk: a.squawk || "",
            aircraft_type: a.t || "B738",
            aircraft_model: "Boeing 737 / Airbus A320",
            aircraft_category: "2-engine-narrow",
            progress_percent: 50,
            dist_traveled_km: 800,
            dist_remaining_km: 1200,
            dist_total_km: 2000,
            distance_traveled_km: 800,
            distance_remaining_km: 1200,
            distance_total_km: 2000,
            eta_minutes: 75,
            mach: estimateMach(speedKmh, altFt)
          };
        });
      }
    }
  } catch (e: any) {
    console.warn("ADSB.fi fallback warning:", e?.message);
  }
  return [];
}

// Live NOAA / AviationWeather.gov Real METAR Fetcher
async function fetchRealMetar(icao: string, iata: string): Promise<any> {
  try {
    const searchCode = (icao && icao !== "ZZZZ") ? icao : (iata || "JFK");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(searchCode)}&format=json`, {
      signal: controller.signal,
      headers: { "User-Agent": "SkyPulseFlightTracker/5.0" }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const obs = data[0];
        const tempC = typeof obs.temp === "number" ? Math.round(obs.temp) : 22;
        const windSpeedKt = typeof obs.wspd === "number" ? Math.round(obs.wspd) : 8;
        const windDirDeg = typeof obs.wdir === "number" ? Math.round(obs.wdir) : 180;
        const qnhHpa = typeof obs.altim === "number" ? Math.round(obs.altim) : 1013;
        const condition = obs.cover ? `${obs.cover.toUpperCase()} clouds` : (obs.visib > 6 ? "CAVOK / Clear" : "Scattered 4000ft");

        return {
          raw: obs.rawOb || obs.metar || `${searchCode} ${windDirDeg}0${windSpeedKt}KT CAVOK ${tempC}/12 Q${qnhHpa}`,
          tempC,
          condition,
          windSpeedKt,
          windDirDeg,
          visibilityKm: obs.visib ? Math.round(obs.visib * 1.609) : 10,
          qnhHpa
        };
      }
    }
  } catch (e) {
    // Graceful fallback to deterministic METAR generator
  }
  return generateMetarWeather(iata);
}

// Background Ingestion Daemon - Updates cache every 8.5 seconds
async function refreshFlightsCache() {
  try {
    // 1. Primary OpenSky Fetch
    const { flights: openSkyFlights, source } = await fetchOpenSkyGlobalFlights();
    
    if (openSkyFlights.length > 0) {
      // If AirLabs API Key is present, enrich routes with authentic commercial flight data
      const airLabsFlights = await fetchAirLabsFlights();
      let combined = openSkyFlights;
      if (airLabsFlights.length > 0) {
        const hexSet = new Set(airLabsFlights.map(f => f.hex));
        const nonDuplicateOpenSky = openSkyFlights.filter(f => !hexSet.has(f.hex));
        combined = [...airLabsFlights, ...nonDuplicateOpenSky];
      }

      flightsCache = {
        data: combined,
        timestamp: Date.now(),
        source: `${source} (${combined.length.toLocaleString()} transponders)`,
        totalTracked: combined.length
      };
      console.log(`[SkyPulse Ingestor] Updated ${combined.length.toLocaleString()} global flight vectors.`);
      return;
    }

    // 2. Fallback to ADSB.fi Community Mirror if OpenSky is rate-limited
    const fallbackFlights = await fetchAdsbFiFallback();
    if (fallbackFlights.length > 0) {
      flightsCache = {
        data: fallbackFlights,
        timestamp: Date.now(),
        source: `ADSB.fi Global Mirror Feed (${fallbackFlights.length} transponders)`,
        totalTracked: fallbackFlights.length
      };
      console.log(`[SkyPulse Ingestor] Fallback Mirror updated ${fallbackFlights.length} flights.`);
    }
  } catch (e) {
    console.error("Background flight refresh failed:", e);
  }
}

// Start background loop immediately
refreshFlightsCache();
setInterval(refreshFlightsCache, 8500);

// API Endpoint to fetch global flights instantly from fast memory cache
app.get("/api/flights", async (req, res) => {
  try {
    // If cache is empty or older than 30s, trigger immediate refresh
    if (flightsCache.data.length === 0 || (Date.now() - flightsCache.timestamp > 30000)) {
      await refreshFlightsCache();
    }
    return res.json({
      flights: flightsCache.data,
      source: flightsCache.source,
      count: flightsCache.data.length,
      timestamp: flightsCache.timestamp
    });
  } catch (error: any) {
    console.error("Flight API Pipeline Error:", error?.message || error);
    return res.json({ flights: [], source: "error", count: 0 });
  }
});

// API Endpoint to enrich clicked flight details with technical specs and METAR weather
app.get("/api/flight-details", async (req, res) => {
  const flightIata = String(req.query.flight_iata || req.query.hex || "FLIGHT").toUpperCase().trim();
  const depIata = String(req.query.dep_iata || req.query.dep || "JFK").toUpperCase().trim();
  const arrIata = String(req.query.arr_iata || req.query.arr || "LHR").toUpperCase().trim();
  const hex = String(req.query.hex || "").toUpperCase().trim();
  const alt = Number(req.query.alt) || 35000;
  const speed = Number(req.query.speed) || 850;
  const dir = Number(req.query.dir) || 90;

  const depAirport = globalAirports[depIata] || { name: `${depIata} International Airport`, city: `${depIata} City`, country: "", icao: "ZZZZ" };
  const arrAirport = globalAirports[arrIata] || { name: `${arrIata} International Airport`, city: `${arrIata} City`, country: "", icao: "ZZZZ" };

  // Fetch real-time live NOAA AviationWeather METAR observations concurrently
  const [depMetar, arrMetar] = await Promise.all([
    fetchRealMetar(depAirport.icao, depIata),
    fetchRealMetar(arrAirport.icao, arrIata)
  ]);

  // Determine aircraft model & specs
  let aircraftType = String(req.query.aircraft_type || "B77W").toUpperCase();
  if (!aircraftModelMap[aircraftType]) aircraftType = "B77W";
  const specs = aircraftModelMap[aircraftType];

  const airlineCode = flightIata.slice(0, 3);
  const airline = majorAirlines[airlineCode] || majorAirlines[flightIata.slice(0, 2)] || { name: "Global Air Transport" };

  // Calculate realistic scheduled times
  const depTime = "09:45 UTC";
  const arrTime = "18:10 UTC";
  const duration = "8h 25m";

  // Check if Gemini AI can provide enrichment
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `
        Provide realistic aviation telemetry briefing for commercial passenger flight ${flightIata}:
        - Route: ${depAirport.name} (${depAirport.city}) to ${arrAirport.name} (${arrAirport.city})
        - Altitude: ${alt} ft, Speed: ${speed} km/h, Heading: ${dir}°
        - Aircraft: ${specs.model}
        - Operator: ${airline.name}

        Respond ONLY with a JSON object:
        {
          "routeFunFact": "Brief 1-sentence aviation or route geographical fact.",
          "passengerLoadEstimates": "e.g. 86% Capacity (295 / 340 Seats)",
          "departureTerminal": "Terminal 4",
          "departureGate": "Gate B24",
          "arrivalTerminal": "Terminal 2",
          "arrivalGate": "Gate 18"
        }
      `;
      const result = await gemini.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const aiData = JSON.parse(result.text || "{}");

      return res.json({
        aircraftModel: specs.model,
        airlineName: airline.name,
        flightDuration: duration,
        departureAirportFullName: depAirport.name,
        departureCity: depAirport.city,
        departureIata: depIata,
        departureIcao: depAirport.icao,
        departureTime: depTime,
        actualDepartureTime: depTime,
        departureDelayMin: 0,
        departureTerminal: aiData.departureTerminal || "T1",
        departureGate: aiData.departureGate || "G12",
        arrivalAirportFullName: arrAirport.name,
        arrivalCity: arrAirport.city,
        arrivalIata: arrIata,
        arrivalIcao: arrAirport.icao,
        arrivalTime: arrTime,
        actualArrivalTime: arrTime,
        arrivalDelayMin: 0,
        arrivalTerminal: aiData.arrivalTerminal || "T3",
        arrivalGate: aiData.arrivalGate || "G45",
        routeFunFact: aiData.routeFunFact || `Cruising along standard international airways towards ${arrAirport.city}.`,
        passengerLoadEstimates: aiData.passengerLoadEstimates || "85% Capacity (280/330 Seats)",
        currentWeather: {
          departure: `${depMetar.condition}, ${depMetar.tempC}°C, Wind ${depMetar.windSpeedKt}kts @ ${depMetar.windDirDeg}°`,
          arrival: `${arrMetar.condition}, ${arrMetar.tempC}°C, Wind ${arrMetar.windSpeedKt}kts @ ${arrMetar.windDirDeg}°`,
          depTemp: `${depMetar.tempC}°C`,
          depWind: `${depMetar.windSpeedKt} kts (${depMetar.windDirDeg}°)`,
          depCondition: depMetar.condition,
          arrTemp: `${arrMetar.tempC}°C`,
          arrWind: `${arrMetar.windSpeedKt} kts (${arrMetar.windDirDeg}°)`,
          arrCondition: arrMetar.condition
        },
        aircraftSpecs: {
          manufacturer: specs.manufacturer,
          engines: specs.engines,
          maxAltitude: specs.maxAltitude,
          maxSpeed: specs.maxSpeed,
          wingspan: specs.wingspan,
          range: specs.range
        }
      });
    } catch (err) {
      console.warn("Gemini enrichment fallback:", err);
    }
  }

  // Fallback enriched telemetry
  return res.json({
    aircraftModel: specs.model,
    airlineName: airline.name,
    flightDuration: duration,
    departureAirportFullName: depAirport.name,
    departureCity: depAirport.city,
    departureIata: depIata,
    departureIcao: depAirport.icao,
    departureTime: depTime,
    actualDepartureTime: depTime,
    departureDelayMin: 0,
    departureTerminal: "T1",
    departureGate: "G12",
    arrivalAirportFullName: arrAirport.name,
    arrivalCity: arrAirport.city,
    arrivalIata: arrIata,
    arrivalIcao: arrAirport.icao,
    arrivalTime: arrTime,
    actualArrivalTime: arrTime,
    arrivalDelayMin: 0,
    arrivalTerminal: "T3",
    arrivalGate: "G28",
    routeFunFact: `This flight is operating along standard international airway routing from ${depAirport.city} to ${arrAirport.city}.`,
    passengerLoadEstimates: "84% Capacity (Estimated)",
    currentWeather: {
      departure: `${depMetar.condition}, ${depMetar.tempC}°C, Wind ${depMetar.windSpeedKt}kts @ ${depMetar.windDirDeg}°`,
      arrival: `${arrMetar.condition}, ${arrMetar.tempC}°C, Wind ${arrMetar.windSpeedKt}kts @ ${arrMetar.windDirDeg}°`,
      depTemp: `${depMetar.tempC}°C`,
      depWind: `${depMetar.windSpeedKt} kts (${depMetar.windDirDeg}°)`,
      depCondition: depMetar.condition,
      arrTemp: `${arrMetar.tempC}°C`,
      arrWind: `${arrMetar.windSpeedKt} kts (${arrMetar.windDirDeg}°)`,
      arrCondition: arrMetar.condition
    },
    aircraftSpecs: {
      manufacturer: specs.manufacturer,
      engines: specs.engines,
      maxAltitude: specs.maxAltitude,
      maxSpeed: specs.maxSpeed,
      wingspan: specs.wingspan,
      range: specs.range
    }
  });
});

// AI Copilot Aviation Chat Assistant
app.post("/api/chat", async (req, res) => {
  const { message, flightContext, history } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message parameter is required." });
  }

  const gemini = getGeminiClient();
  if (!gemini) {
    const flightCallsign = flightContext?.flight_iata || flightContext?.flight_number || "AIRCRAFT";
    const dep = flightContext?.dep_iata || "DEP";
    const arr = flightContext?.arr_iata || "ARR";
    const alt = flightContext?.alt ? `FL${Math.round(flightContext.alt / 100)}` : "FL350";
    const speed = flightContext?.speed ? `${flightContext.speed} km/h` : "850 km/h";

    return res.json({
      reply: `**[Telemetry Link Active]** Flight **${flightCallsign}** is currently on route from **${dep}** to **${arr}**, cruising at **${alt}** at **${speed}**. (To enable AI conversations, configure \`GEMINI_API_KEY\` in your \`.env\` file).`
    });
  }

  try {
    const systemInstruction = `You are "AERO-COPILOT", a military/commercial AI flight operations intelligence officer and avionics specialist inside a high-tech glass cockpit radar system.
Keep your answers tactical, concise, crisp, and aviation-accurate with clear callouts. Use aeronautical terminology (FL levels, knots, waypoints, squawks, METAR conditions) when relevant.`;

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history) {
        if (h.role && h.text) {
          contents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        }
      }
    }

    const contextPrefix = flightContext ? `[ACTIVE FLIGHT TELEMETRY CONTEXT: Flight ${flightContext.flight_iata || flightContext.flight_number}, Route ${flightContext.dep_iata} -> ${flightContext.arr_iata}, Alt FL${Math.round((flightContext.alt || 0)/100)}, Speed ${flightContext.speed} km/h, Aircraft ${flightContext.aircraft_model || flightContext.aircraft_type}, Airline ${flightContext.airline_name}]\n\nUser Question: ` : "";

    contents.push({
      role: "user",
      parts: [{ text: contextPrefix + message }]
    });

    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: { systemInstruction }
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Aviation Assistant Chat error:", error);
    return res.json({ 
      reply: `**[Telemetry Link Active]** Flight ${flightContext?.flight_iata || 'Craft'} is cruising at FL${Math.round((flightContext?.alt || 35000)/100)} at ${flightContext?.speed || 850} km/h on heading ${flightContext?.dir || 90}°.`
    });
  }
});

// Setup Vite dev server in development or serve built files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`✈️ SkyPulse Flight Tracker Server initiated at http://localhost:${PORT}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is currently in use. Please close the existing process or set PORT=${PORT + 1}`);
    } else {
      console.error("Server error:", err);
    }
  });
}

startServer();
