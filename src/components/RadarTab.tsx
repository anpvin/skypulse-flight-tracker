import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plane, Info, ChevronUp, ChevronDown, X, Radio, 
  Layers, Sliders, Crosshair, CloudRain, Search, 
  ArrowUpRight, ArrowDownRight, Compass, Navigation,
  Activity, Eye, Maximize2 
} from "lucide-react";
import { Flight, FlightDetailed } from "../types";
import { getAltitudeColor, getAirlineName, getAirportCity, detectEmergencySquawks } from "../utils";

interface RadarTabProps {
  activeTab: string;
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  tileMode: "dark" | "satellite";
  setTileMode: React.Dispatch<React.SetStateAction<"dark" | "satellite">>;
  weatherEnabled: boolean;
  setWeatherEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  followFlight: boolean;
  setFollowFlight: React.Dispatch<React.SetStateAction<boolean>>;
  flights: Flight[];
  selectedFlight: Flight | null;
  selectedFlightDetails: FlightDetailed | null;
  setActiveTab: (t: string) => void;
  closeDetailsPanel: () => void;
  minAltitudeFilter?: number;
  setMinAltitudeFilter?: (alt: number) => void;
  onSelectFlight?: (flight: Flight) => void;
}

export function RadarTab({
  activeTab,
  mapContainerRef,
  tileMode,
  setTileMode,
  weatherEnabled,
  setWeatherEnabled,
  followFlight,
  setFollowFlight,
  flights,
  selectedFlight,
  selectedFlightDetails,
  setActiveTab,
  closeDetailsPanel,
  minAltitudeFilter,
  setMinAltitudeFilter,
  onSelectFlight
}: RadarTabProps) {
  const [isHudExpanded, setIsHudExpanded] = useState(false);
  const [showRangeRings, setShowRangeRings] = useState(true);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [radarSearchQuery, setRadarSearchQuery] = useState("");
  const [showAltitudeLegend, setShowAltitudeLegend] = useState(true);

  // Reset to minimized whenever a new flight is selected
  useEffect(() => {
    setIsHudExpanded(false);
  }, [selectedFlight?.hex]);

  const quickSearchResults = useMemo(() => {
    if (!radarSearchQuery.trim()) return [];
    const q = radarSearchQuery.trim().toLowerCase();
    return flights
      .filter((f: Flight) => 
        (f.flight_iata || "").toLowerCase().includes(q) ||
        (f.flight_number || "").toLowerCase().includes(q) ||
        (f.dep_iata || "").toLowerCase().includes(q) ||
        (f.arr_iata || "").toLowerCase().includes(q) ||
        (f.airline_name || "").toLowerCase().includes(q) ||
        (f.hex || "").toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [flights, radarSearchQuery]);

  const emergencyFlights = useMemo(() => detectEmergencySquawks(flights), [flights]);
  const selectedAltColor = selectedFlight ? getAltitudeColor(selectedFlight.alt) : { hex: "#38bdf8" };

  return (
    <div
      className={`flex-1 w-full h-full relative overflow-hidden ${
        activeTab === "radar" ? "block animate-fade-in" : "hidden pointer-events-none absolute w-0 h-0 overflow-hidden"
      }`}
    >
      {/* Underlying Leaflet Map Engine */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0 bg-[#07090e]" />

      {/* Live Squawk 7700 Emergency Alert Beacon */}
      {emergencyFlights.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 bg-red-600/90 border border-red-400 text-white font-mono text-xs font-black rounded-full shadow-[0_0_25px_rgba(239,68,68,0.8)] animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <span>EMERGENCY SQUAWK 7700 DETECTED: {emergencyFlights[0].flight_iata || emergencyFlights[0].hex}</span>
          <button
            onClick={() => onSelectFlight && onSelectFlight(emergencyFlights[0])}
            className="ml-2 px-2.5 py-0.5 bg-black text-white text-[10px] rounded-full hover:bg-white hover:text-black cursor-pointer uppercase transition-colors"
          >
            INTERCEPT
          </button>
        </div>
      )}

      {/* Rotating Cyber Radar Sweeper Beam */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden opacity-25">
        <div className="w-[150vmax] h-[150vmax] radar-sweeper" />
      </div>

      {/* Range Rings SVG Overlay */}
      {showRangeRings && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <circle cx="500" cy="500" r="160" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="500" cy="500" r="320" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="500" cy="500" r="480" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="6 6" />
            <line x1="500" y1="0" x2="500" y2="1000" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="500" x2="1000" y2="500" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
            <text x="510" y="335" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">100 NM</text>
            <text x="510" y="175" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">250 NM</text>
            <text x="510" y="25" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">400 NM</text>
          </svg>
        </div>
      )}

      {/* Top Left: Tactical Radar Header & Status */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-2">
        <div className="px-3.5 py-2 glass-panel rounded-xl text-cyan-400 text-xs font-mono font-black flex items-center gap-2.5 shadow-2xl border border-cyan-500/30">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span>SKYPULSE ADS-B RADAR</span>
        </div>
        
        <div className="px-3 py-1.5 glass-panel-subtle rounded-xl text-slate-300 text-[10px] font-mono flex items-center gap-2 shadow-lg">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>ACTIVE BLIPS: <strong className="text-white text-xs">{flights.length.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Top Right: Tactical Map Controls & Layer Selector */}
      <div className="absolute top-4 right-3 z-20 flex flex-col items-end gap-1.5 font-mono text-[10px]">
        {/* Quick Search on Radar Button */}
        <button
          onClick={() => setShowQuickSearch(prev => !prev)}
          className={`px-3 py-1.5 backdrop-blur-xl transition-all rounded-xl border shadow-xl flex items-center gap-1.5 cursor-pointer font-extrabold ${
            showQuickSearch
              ? "bg-blue-600 border-blue-400 text-white shadow-blue-500/30"
              : "glass-panel text-slate-300 hover:text-white hover:border-white/20"
          }`}
          title="Search Flights on Radar"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>SEARCH</span>
        </button>

        {/* Map Tile Style Switcher */}
        <div className="flex bg-black/70 border border-white/12 rounded-xl p-0.5 backdrop-blur-xl shadow-xl">
          <button
            onClick={() => setTileMode("satellite")}
            className={`px-2.5 py-1.5 rounded-lg text-[9px] font-extrabold uppercase transition-all cursor-pointer ${
              tileMode === "satellite"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            title="High-Resolution Satellite Map"
          >
            🛰️ SATELLITE
          </button>
          <button
            onClick={() => setTileMode("dark")}
            className={`px-2.5 py-1.5 rounded-lg text-[9px] font-extrabold uppercase transition-all cursor-pointer ${
              tileMode === "dark"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            title="Dark Vector Tactical Map"
          >
            🗺️ VECTOR
          </button>
        </div>

        {/* Doppler Weather Radar Toggle */}
        <button
          onClick={() => setWeatherEnabled(prev => !prev)}
          className={`px-3 py-1.5 backdrop-blur-xl transition-all rounded-xl border shadow-xl flex items-center gap-1.5 cursor-pointer font-extrabold ${
            weatherEnabled
              ? "bg-cyan-600/40 border-cyan-400 text-cyan-300 shadow-cyan-500/25"
              : "glass-panel text-slate-300 hover:text-white hover:border-white/20"
          }`}
          title="Toggle NEXRAD Doppler Weather Precipitation"
        >
          <CloudRain className={`w-3.5 h-3.5 ${weatherEnabled ? "text-cyan-300 animate-pulse" : "text-slate-400"}`} />
          <span>WX RADAR {weatherEnabled ? "ON" : "OFF"}</span>
        </button>

        {/* Range Rings Toggle */}
        <button
          onClick={() => setShowRangeRings(prev => !prev)}
          className={`px-3 py-1.5 backdrop-blur-xl transition-all rounded-xl border shadow-xl flex items-center gap-1.5 cursor-pointer font-extrabold ${
            showRangeRings
              ? "bg-blue-600/30 border-blue-400 text-blue-300"
              : "glass-panel text-slate-400 hover:text-white"
          }`}
          title="Toggle Tactical Range Rings"
        >
          <span>⭕ RINGS {showRangeRings ? "ON" : "OFF"}</span>
        </button>

        {/* Autopilot Follow Mode */}
        <button
          onClick={() => setFollowFlight(prev => !prev)}
          className={`px-3 py-1.5 backdrop-blur-xl transition-all rounded-xl border shadow-xl flex items-center gap-1.5 cursor-pointer font-extrabold ${
            followFlight
              ? "bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-emerald-500/25"
              : "glass-panel text-slate-400 hover:text-white"
          }`}
          title="Lock camera to follow selected aircraft"
        >
          <Crosshair className={`w-3.5 h-3.5 ${followFlight ? "text-emerald-400 animate-spin" : "text-slate-400"}`} style={{ animationDuration: "8s" }} />
          <span>FOLLOW {followFlight ? "ON" : "OFF"}</span>
        </button>
      </div>

      {/* Quick Search Dropdown Drawer */}
      <AnimatePresence>
        {showQuickSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-4 z-30 w-80 glass-panel rounded-2xl p-3 shadow-2xl border border-white/15 font-mono"
          >
            <div className="relative mb-2">
              <input
                type="text"
                autoFocus
                placeholder="Search Call, Flight #, Airport..."
                value={radarSearchQuery}
                onChange={(e) => setRadarSearchQuery(e.target.value)}
                className="w-full bg-black/60 border border-blue-400/40 rounded-xl py-2 pl-3 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              {radarSearchQuery && (
                <button onClick={() => setRadarSearchQuery("")} className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin">
              {quickSearchResults.length === 0 ? (
                <div className="text-[10px] text-slate-400 py-3 text-center">
                  {radarSearchQuery ? "No matching flights" : "Type to filter active radar"}
                </div>
              ) : (
                quickSearchResults.map((f: Flight) => (
                  <div
                    key={f.hex}
                    onClick={() => {
                      setShowQuickSearch(false);
                      setRadarSearchQuery("");
                      setActiveTab("briefing");
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-blue-600/30 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-extrabold text-white">{f.flight_iata || f.flight_number}</span>
                      <span className="text-[9px] text-slate-400 ml-2">{f.dep_iata} ➔ {f.arr_iata}</span>
                    </div>
                    <span className="text-[10px] font-bold text-cyan-400">FL{Math.round(f.alt / 100)}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Left: Altitude Color Legend */}
      <div className="absolute bottom-24 md:bottom-6 left-4 z-20 font-mono text-[9px] hidden lg:block">
        <div className="glass-panel-subtle rounded-xl p-2.5 border border-white/8 space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between gap-4 text-slate-400 font-extrabold pb-1 border-b border-white/10 uppercase tracking-widest">
            <span>ALTITUDE BANDS</span>
            <button onClick={() => setShowAltitudeLegend(p => !p)} className="text-slate-500 hover:text-white">
              {showAltitudeLegend ? "−" : "+"}
            </button>
          </div>
          {showAltitudeLegend && (
            <div className="space-y-1 font-bold">
              <div className="flex items-center gap-2 text-purple-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]" />
                <span>FL390+ (Stratosphere)</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
                <span>FL310 - FL390 (High Cruise)</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
                <span>FL200 - FL310 (Mid Level)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                <span>FL100 - FL200 (Transition)</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
                <span>&lt; FL100 (Approach / Climb)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Center: Selected Flight HUD Control Panel */}
      <div className="absolute bottom-20 md:bottom-6 left-3 right-3 md:left-1/2 md:-translate-x-1/2 md:w-max z-20 pointer-events-auto">
        <AnimatePresence>
          {selectedFlight ? (
            !isHudExpanded ? (
              /* Minimized Compact Flight Pill */
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="glass-panel px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-4 font-mono text-xs w-full max-w-xl mx-auto border border-blue-500/40"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-blue-600 text-white rounded-xl rotate-45 shrink-0 shadow-lg shadow-blue-500/30">
                    <Plane className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm tracking-wide">{selectedFlight.flight_iata || selectedFlight.flight_number}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-white/10 rounded font-bold text-slate-300">{selectedFlight.aircraft_type || "AIRLINER"}</span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-bold flex items-center gap-2 mt-0.5">
                      <span style={{ color: selectedAltColor.hex }}>FL{Math.round(selectedFlight.alt / 100)}</span>
                      <span>•</span>
                      <span className="text-orange-400">{selectedFlight.speed} km/h</span>
                      <span className="hidden sm:inline text-slate-400">• {selectedFlight.dep_iata} ➔ {selectedFlight.arr_iata}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsHudExpanded(true)}
                    className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/60 border border-blue-400/40 text-blue-200 rounded-xl font-black text-[10px] tracking-wider transition-all cursor-pointer flex items-center gap-1 uppercase"
                  >
                    <ChevronUp className="w-3.5 h-3.5" /> EXPAND
                  </button>
                  <button
                    onClick={() => setActiveTab("briefing")}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-[10px] tracking-wider transition-all cursor-pointer flex items-center gap-1 uppercase shadow-lg shadow-blue-600/30"
                  >
                    AVIONICS DECK →
                  </button>
                  <button
                    onClick={closeDetailsPanel}
                    className="p-1.5 bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
                    title="Deselect Flight"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Expanded Flight HUD Panel */
              <motion.div 
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                className="glass-panel p-5 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-5 md:gap-8 w-full md:max-w-full font-mono text-xs border border-blue-500/40"
              >
                <div className="flex items-center gap-3.5 w-full md:w-auto">
                  <div className="p-2.5 bg-blue-600 text-white rounded-2xl rotate-45 shadow-xl shadow-blue-600/30 shrink-0">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-black text-white tracking-wide">{selectedFlight.flight_iata || selectedFlight.flight_number}</div>
                    <div className="text-[10px] text-slate-400 block mt-0.5 uppercase truncate max-w-[180px]">
                      {selectedFlight.airline_name || selectedFlightDetails?.airlineName || "Commercial Transport"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center justify-between w-full md:w-auto gap-4 md:gap-8 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6">
                  <div>
                    <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">ALTITUDE</span>
                    <span className="font-black text-sm block mt-0.5" style={{ color: selectedAltColor.hex }}>
                      FL{Math.round(selectedFlight.alt / 100)} ({selectedFlight.alt.toLocaleString()} ft)
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">GROUND SPEED</span>
                    <span className="font-black text-orange-400 text-sm block mt-0.5">
                      {selectedFlight.speed} km/h ({selectedFlight.speed_knots || Math.round(selectedFlight.speed / 1.852)} kts)
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">ORIGIN</span>
                    <span className="font-black text-white text-sm block mt-0.5">{selectedFlight.dep_iata}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">DESTINATION</span>
                    <span className="font-black text-cyan-400 text-sm block mt-0.5">{selectedFlight.arr_iata}</span>
                  </div>
                </div>

                <div className="flex gap-2.5 w-full md:w-auto pt-2 md:pt-0 items-center">
                  <button
                    onClick={() => setIsHudExpanded(false)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 font-bold rounded-xl transition-all cursor-pointer text-[10px] flex items-center gap-1 uppercase"
                  >
                    <ChevronDown className="w-3.5 h-3.5" /> MINIMIZE
                  </button>
                  <button
                    onClick={() => setActiveTab("briefing")}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all cursor-pointer text-[11px] w-full shrink-0 shadow-lg shadow-blue-600/30 uppercase"
                  >
                    📂 AVIONICS DECK
                  </button>
                  <button
                    onClick={closeDetailsPanel}
                    className="hidden md:flex p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer items-center justify-center"
                    title="Deselect"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel px-5 py-3 rounded-2xl shadow-2xl font-mono text-xs text-slate-300 text-center flex items-center justify-center gap-2.5 border border-white/10"
            >
              <Info className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>TAP ANY AIRCRAFT ON RADAR OR USE SEARCH TO VIEW FULL TELEMETRY</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

