import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Plane, Compass, Navigation, Thermometer, CloudRain, 
  ChevronDown, ChevronUp, Radio, Activity, Wind, 
  Gauge, ShieldCheck, Zap, AlertTriangle, ArrowUpRight,
  ArrowDownRight, Eye, Bot, Cpu, Sparkles, Volume2, Download 
} from "lucide-react";
import { Flight, FlightDetailed } from "../types";
import { getAirportCity, getFlightTimes, getBarometricPressure, estimateMach, getAltitudeColor, speakAtcRadio, downloadFlightDossier } from "../utils";

function SVGGauge({ title, value, unit, percent, color, icon, subtitle }: any) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(1, percent)) / 100) * circumference;

  return (
    <div className="glass-panel p-4 rounded-2xl flex items-center justify-between shadow-xl border border-white/8">
      <div className="flex flex-col">
        <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400">{title}</span>
        <span className="text-2xl font-mono font-black text-white mt-1">
          {value} <span className="text-xs text-slate-400 font-bold">{unit}</span>
        </span>
        {subtitle && <span className="text-[9px] font-mono text-cyan-400 font-semibold mt-0.5">{subtitle}</span>}
      </div>

      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle cx="32" cy="32" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={color}
            strokeWidth="5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">{icon}</div>
      </div>
    </div>
  );
}

/* Authentic Glass Cockpit Primary Flight Display (PFD) */
function PrimaryFlightDisplay({ flight }: { flight: Flight }) {
  const pitch = Math.max(-20, Math.min(20, (flight.vspeed || 0) / 150));
  const roll = Math.max(-30, Math.min(30, ((flight.dir % 40) - 20) * 0.5));
  const mach = estimateMach(flight.alt, flight.speed);
  const baro = getBarometricPressure(flight.alt);

  return (
    <div className="glass-panel rounded-3xl p-4 md:p-5 shadow-2xl border border-cyan-500/30 relative overflow-hidden font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-black text-white uppercase tracking-wider">PRIMARY FLIGHT DISPLAY (PFD)</span>
        </div>
        <span className="text-cyan-400 text-[10px] font-bold">MACH {mach} • {baro.inHg} inHg</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 items-center">
        {/* Left: Airspeed Tape */}
        <div className="bg-black/60 rounded-2xl p-3 border border-white/10 flex flex-col items-center justify-center">
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">AIRSPEED (GS)</span>
          <span className="text-3xl font-black text-white mt-1">{flight.speed}</span>
          <span className="text-xs text-cyan-400 font-bold">KM/H</span>
          <div className="mt-2 pt-2 border-t border-white/10 w-full text-center text-[10px] text-slate-300">
            {flight.speed_knots || Math.round(flight.speed / 1.852)} KNOTS
          </div>
        </div>

        {/* Center: Artificial Horizon Attitude Indicator */}
        <div className="h-44 rounded-2xl border-2 border-white/20 relative overflow-hidden flex items-center justify-center shadow-inner">
          <div
            className="pfd-horizon absolute w-[200%] h-[200%] transition-transform duration-500"
            style={{
              transform: `translateY(${pitch}px) rotate(${-roll}deg)`
            }}
          />
          {/* Pitch Ladder Marks */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center space-y-4 opacity-70">
            <div className="w-12 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white/60"></div>
            <div className="w-16 h-0.5 bg-yellow-400"></div>
            <div className="w-6 h-0.5 bg-white/60"></div>
            <div className="w-12 h-0.5 bg-white"></div>
          </div>
          {/* Miniature Airplane Reticle */}
          <div className="absolute z-10 flex items-center gap-1 pointer-events-none">
            <div className="w-8 h-1 bg-yellow-400 rounded-l shadow-[0_0_8px_#facc15]"></div>
            <div className="w-3 h-3 border-2 border-yellow-400 rounded-full bg-black/50"></div>
            <div className="w-8 h-1 bg-yellow-400 rounded-r shadow-[0_0_8px_#facc15]"></div>
          </div>
          {/* Bank Angle Roll Arc */}
          <div className="absolute top-2 text-[9px] font-black text-white/90 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
            ROLL: {roll > 0 ? `+${roll.toFixed(0)}°` : `${roll.toFixed(0)}°`}
          </div>
        </div>

        {/* Right: Altitude & Vertical Speed Tape */}
        <div className="bg-black/60 rounded-2xl p-3 border border-white/10 flex flex-col items-center justify-center">
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">ALTITUDE</span>
          <span className="text-3xl font-black text-cyan-400 mt-1">FL{Math.round(flight.alt / 100)}</span>
          <span className="text-xs text-slate-300 font-bold">{flight.alt.toLocaleString()} FT</span>
          <div className="mt-2 pt-2 border-t border-white/10 w-full text-center text-[10px]">
            {(flight.vspeed || 0) > 200 ? (
              <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +{flight.vspeed} FPM
              </span>
            ) : (flight.vspeed || 0) < -200 ? (
              <span className="text-amber-400 font-bold flex items-center justify-center gap-1">
                <ArrowDownRight className="w-3 h-3" /> {flight.vspeed} FPM
              </span>
            ) : (
              <span className="text-slate-400 font-bold">LEVEL CRUISE</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BriefingTab({
  activeTab,
  selectedFlight,
  selectedFlightDetails,
  loadingDetails,
  progressPercent,
  distanceStats,
  briefingMapContainerRef,
  tileMode,
  setTileMode,
  setActiveTab
}: any) {
  const [isTrackRouteMinimized, setIsTrackRouteMinimized] = useState(false);

  if (activeTab !== "briefing") return null;

  const altPercent = Math.min(100, (selectedFlight?.alt || 0) / 450);
  const speedPercent = Math.min(100, (selectedFlight?.speed || 0) / 10);
  const headingPercent = ((selectedFlight?.dir || 0) / 360) * 100;
  const mach = selectedFlight ? estimateMach(selectedFlight.alt, selectedFlight.speed) : "0.00";

  return (
    <motion.div
      key="briefing-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 overflow-y-auto lg:overflow-hidden h-full scrollbar-thin scrollbar-thumb-slate-800"
    >
      {!selectedFlight ? (
        <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-3xl glass-panel border border-cyan-500/30 flex items-center justify-center shadow-2xl relative">
            <Plane className="w-10 h-10 text-cyan-400 rotate-45" />
            <span className="absolute inset-0 rounded-3xl border border-cyan-400/40 animate-ping" style={{ animationDuration: "3s" }}></span>
          </div>
          <div>
            <h2 className="text-xl font-mono font-black tracking-wide text-white uppercase">Avionics Terminal Standby</h2>
            <p className="text-xs text-slate-400 font-bold leading-relaxed mt-2 uppercase font-mono tracking-wider max-w-md mx-auto">
              Select an active flight from the Live Search Board or Tactical Radar to initialize 3D primary flight display telemetry and route briefing.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("search")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-extrabold rounded-2xl cursor-pointer shadow-lg shadow-blue-500/30 text-xs tracking-widest uppercase transition-all"
          >
            📂 OPEN FLIGHT SEARCH BOARD
          </button>
        </div>
      ) : (
        <div className="min-h-full w-full flex flex-col lg:flex-row p-4 md:p-6 gap-5 lg:overflow-hidden h-full">
          {/* Main Left Avionics Area */}
          <div className="flex-1 flex flex-col overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {/* Quick Navigation Action Header */}
            <div className="flex flex-wrap items-center justify-between pb-1 font-mono text-xs shrink-0 gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("search")}
                  className="px-3 py-1.5 glass-panel text-slate-300 hover:text-white rounded-xl font-bold text-[10px] flex items-center gap-1.5 transition-colors cursor-pointer uppercase border border-white/10"
                >
                  ← FLIGHT BOARD
                </button>
                {onOpen3DCockpit && (
                  <button
                    onClick={() => onOpen3DCockpit(selectedFlight)}
                    className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-black text-[10px] flex items-center gap-1.5 transition-all cursor-pointer uppercase shadow-lg shadow-cyan-500/30"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>3D COCKPIT SIMULATOR</span>
                  </button>
                )}
                <button
                  onClick={() => speakAtcRadio(`${selectedFlight.flight_iata || selectedFlight.hex}, climb and maintain Flight Level ${Math.round((selectedFlight.alt || 30000) / 100)}, heading ${selectedFlight.dir || 90} degrees. Altimeter 29.92.`)}
                  className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/60 text-emerald-300 hover:text-white rounded-xl font-extrabold text-[10px] flex items-center gap-1.5 transition-colors cursor-pointer uppercase border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                  title="Speak synthesized ATC clearance"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PLAY RADIO CLEARANCE</span>
                </button>
                <button
                  onClick={() => downloadFlightDossier(selectedFlight, selectedFlightDetails)}
                  className="px-3 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/60 text-cyan-300 hover:text-white rounded-xl font-extrabold text-[10px] flex items-center gap-1.5 transition-colors cursor-pointer uppercase border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                  title="Download Flight Dossier JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>EXPORT DOSSIER</span>
                </button>
              </div>

              <button
                onClick={() => setActiveTab("radar")}
                className="px-4 py-1.5 bg-blue-600/30 hover:bg-blue-600/60 text-blue-300 hover:text-white rounded-xl font-extrabold text-[10px] flex items-center gap-1.5 transition-colors cursor-pointer uppercase border border-blue-500/40 shadow-lg shadow-blue-500/20"
              >
                TACTICAL RADAR VIEW →
              </button>
            </div>

            {/* Primary Flight Display (PFD) HUD */}
            <PrimaryFlightDisplay flight={selectedFlight} />

            {/* Visual Route Arc Progress Bar */}
            <div className="glass-panel p-5 rounded-3xl shadow-2xl border border-white/8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-mono font-black tracking-wide text-white uppercase">
                      {selectedFlight.flight_iata || selectedFlight.flight_number || "FLIGHT-LOG"}
                    </h2>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30 uppercase tracking-widest">
                      {selectedFlight.aircraft_type || "AIRLINER"}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30 uppercase tracking-widest">
                      HEX: {selectedFlight.hex}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest mt-1">
                    {selectedFlight.airline_name || selectedFlightDetails?.airlineName || "Commercial Carrier"}
                  </p>
                </div>
                {selectedFlightDetails?.aircraftModel && (
                  <div className="text-left sm:text-right font-mono">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-widest">AIRCRAFT MODEL</span>
                    <span className="text-cyan-400 font-extrabold block mt-0.5 text-xs">{selectedFlightDetails.aircraftModel}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 font-mono">
                <div className="text-left w-full sm:w-[28%] shrink-0">
                  <div className="text-3xl font-black text-white">{selectedFlight.dep_iata || "DEP"}</div>
                  <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wide mt-1 leading-tight">
                    {selectedFlight.dep_city || (selectedFlight.dep_iata ? getAirportCity(selectedFlight.dep_iata) : "Origin Hub")}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold mt-2">
                    DEPARTURE: <span className="text-slate-300">{selectedFlightDetails?.departureTime || getFlightTimes(selectedFlight.hex).depTime}</span>
                  </div>
                </div>

                <div className="flex-grow w-full sm:w-auto px-2 relative flex flex-col items-center justify-center">
                  <div className="text-[11px] font-mono text-cyan-400 font-extrabold mb-1.5 tracking-wider uppercase text-center flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>ROUTE PROGRESS: {progressPercent.toFixed(1)}%</span>
                  </div>

                  {/* Realtime Track Progress Bar */}
                  <div className="w-full relative h-3.5 bg-black/60 rounded-full overflow-visible my-1 flex items-center border border-white/10 p-0.5 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.6)]" 
                      style={{ width: `${Math.max(2, Math.min(100, progressPercent))}%` }}
                    />
                    <div 
                      className="absolute z-10 transition-all duration-300 -translate-x-1/2" 
                      style={{ left: `${Math.max(2, Math.min(98, progressPercent))}%` }}
                    >
                      <div className="p-1.5 bg-black/90 border border-cyan-400 rounded-full shadow-[0_0_12px_#00f0ff]">
                        <Plane className="w-3.5 h-3.5 text-cyan-400 rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Distance Breakdown Labels */}
                  {selectedFlight.distance_traveled_km ? (
                    <div className="flex items-center justify-between w-full text-[9px] font-mono text-slate-400 mt-1.5 font-bold px-1">
                      <span className="text-slate-500">{selectedFlight.distance_traveled_km.toLocaleString()} km flown</span>
                      <span className="text-cyan-400 font-extrabold">{selectedFlight.distance_remaining_km?.toLocaleString()} km remaining</span>
                      <span className="text-slate-300">{(selectedFlight.distance_traveled_km + (selectedFlight.distance_remaining_km || 0)).toLocaleString()} km total</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full text-[9px] font-mono text-slate-400 mt-1.5 font-bold px-1">
                      <span>{selectedFlight.dep_iata || "ACTIVE"}</span>
                      <span className="text-cyan-400">GREAT-CIRCLE ARC</span>
                      <span>{selectedFlight.arr_iata || "DEST"}</span>
                    </div>
                  )}
                </div>

                <div className="text-right w-full sm:w-[28%] shrink-0">
                  <div className="text-3xl font-black text-cyan-400">{selectedFlight.arr_iata || "ARR"}</div>
                  <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wide mt-1 leading-tight">
                    {selectedFlight.arr_city || (selectedFlight.arr_iata ? getAirportCity(selectedFlight.arr_iata) : "Destination")}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold mt-2">
                    EST. ARRIVAL: <span className="text-slate-300">{selectedFlightDetails?.arrivalTime || getFlightTimes(selectedFlight.hex).arrTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Circular Telemetry Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SVGGauge
                title="BARO ALTITUDE"
                value={selectedFlight.alt.toLocaleString()}
                unit="FT"
                percent={altPercent}
                color="#00f0ff"
                icon={<Activity className="w-5 h-5 text-cyan-400" />}
                subtitle={`FL${Math.round(selectedFlight.alt / 100)}`}
              />

              <SVGGauge
                title="GROUND VELOCITY"
                value={selectedFlight.speed}
                unit="KM/H"
                percent={speedPercent}
                color="#10b981"
                icon={<Navigation className="w-5 h-5 text-emerald-400" />}
                subtitle={`MACH ${mach}`}
              />

              <SVGGauge
                title="TRUE TRACK"
                value={`${selectedFlight.dir}°`}
                unit="HDG"
                percent={headingPercent}
                color="#f59e0b"
                icon={<Compass className="w-5 h-5 text-amber-400" />}
                subtitle="MAGNETIC NORTH"
              />
            </div>

            {/* AI Copilot Telemetry Briefing */}
            {selectedFlightDetails?.copilotAnalysis && (
              <div className="glass-panel-amber p-4 rounded-2xl shadow-xl font-mono text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-black mb-1.5 uppercase tracking-wider">
                  <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>SKYCOPILOT SITUATIONAL BRIEFING</span>
                </div>
                <p className="text-slate-200 leading-relaxed font-semibold">
                  {selectedFlightDetails.copilotAnalysis}
                </p>
              </div>
            )}

            {/* Weather Cards */}
            {selectedFlightDetails?.currentWeather && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                <div className="glass-panel p-4 rounded-2xl border border-white/8">
                  <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest block">ORIGIN METAR WEATHER ({selectedFlight.dep_iata})</span>
                  <div className="text-xs text-slate-200 font-bold mt-2 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{selectedFlightDetails.currentWeather.departure}</span>
                  </div>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-white/8">
                  <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest block">DESTINATION METAR WEATHER ({selectedFlight.arr_iata})</span>
                  <div className="text-xs text-slate-200 font-bold mt-2 flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{selectedFlightDetails.currentWeather.arrival}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Mini-Map Interactive Tracker */}
          <div
            className={`w-full lg:w-[340px] xl:w-[400px] shrink-0 flex flex-col glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 ${
              isTrackRouteMinimized ? "h-auto" : "min-h-[320px] h-[360px] lg:h-full"
            }`}
          >
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between shrink-0 font-mono text-[10px] bg-black/40">
              <div className="flex items-center gap-2">
                <span className="text-white font-extrabold uppercase tracking-widest">AERO-VEX MINI-MAP</span>
                <span className="text-emerald-400 font-black uppercase animate-pulse">GPS LIVE</span>
              </div>
              <button
                onClick={() => setIsTrackRouteMinimized((prev) => !prev)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-[9px] flex items-center gap-1 transition-colors cursor-pointer uppercase"
              >
                {isTrackRouteMinimized ? <><ChevronDown className="w-3 h-3" /> EXPAND</> : <><ChevronUp className="w-3 h-3" /> MINIMIZE</>}
              </button>
            </div>

            {!isTrackRouteMinimized && (
              <div
                onClick={() => setActiveTab("radar")}
                className="flex-1 relative cursor-pointer group overflow-hidden min-h-[250px]"
                title="Click to focus on full Tactical Radar"
              >
                <div ref={briefingMapContainerRef} className="w-full h-full absolute inset-0 z-0 bg-[#07090e]" />
                <div className="absolute inset-0 z-10 bg-black/10 group-hover:bg-black/0 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white font-mono text-[10px] font-black px-4 py-2 rounded-2xl shadow-2xl transition-all tracking-wider border border-blue-400/50 uppercase">
                    🔍 CLICK TO FOCUS ON FULL RADAR
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

