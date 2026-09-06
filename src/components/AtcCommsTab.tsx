import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Radio, Volume2, VolumeX, Mic, ShieldAlert, 
  Activity, Play, Square, RefreshCw, Plane, 
  ExternalLink, Waves, CheckCircle2, ChevronRight 
} from "lucide-react";
import { Flight, AtcTransmission } from "../types";
import { generateAtcTransmission, speakAtcRadio, detectTcasConflicts, detectEmergencySquawks } from "../utils";

interface AtcCommsTabProps {
  activeTab: string;
  flights: Flight[];
  selectedFlight: Flight | null;
  onSelectFlight: (flight: Flight) => void;
  setActiveTab: (tab: string) => void;
}

export function AtcCommsTab({
  activeTab,
  flights,
  selectedFlight,
  onSelectFlight,
  setActiveTab
}: AtcCommsTabProps) {
  const [selectedFreq, setSelectedFreq] = useState("124.500");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTransmissions, setActiveTransmissions] = useState<any[]>([]);
  const [autoPlayVoice, setAutoPlayVoice] = useState(false);
  const [atcLogFilter, setAtcLogFilter] = useState<"ALL" | "EMERGENCY" | "TCAS">("ALL");

  const frequencies = [
    { freq: "124.500", name: "Sector Center Control", band: "VHF Airspace", active: true },
    { freq: "128.850", name: "High Altitude Oceanic", band: "VHF Oceanic", active: true },
    { freq: "119.700", name: "Terminal Approach Control", band: "VHF Radar", active: true },
    { freq: "118.700", name: "Tower Active Runway", band: "VHF Tower", active: true },
    { freq: "121.900", name: "Surface Ground Ops", band: "VHF Ground", active: false }
  ];

  // Generate live simulated radio transmissions from actual real flights
  useEffect(() => {
    if (flights.length === 0) return;

    const sample = flights.slice(0, 30);
    const initialLogs = sample.slice(0, 8).map((f) => generateAtcTransmission(f));
    setActiveTransmissions(initialLogs);

    const interval = setInterval(() => {
      const randomFlight = flights[Math.floor(Math.random() * Math.min(100, flights.length))];
      if (randomFlight) {
        const newTransmission = generateAtcTransmission(randomFlight);
        setActiveTransmissions(prev => [newTransmission, ...prev.slice(0, 25)]);

        if (autoPlayVoice) {
          speakAtcRadio(newTransmission.voiceText);
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [flights, autoPlayVoice]);

  // Proximity conflicts & emergencies
  const tcasConflicts = useMemo(() => detectTcasConflicts(flights, 4), [flights]);
  const emergencyFlights = useMemo(() => detectEmergencySquawks(flights), [flights]);

  const handleSpeak = (text: string) => {
    setIsSpeaking(true);
    speakAtcRadio(text);
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  if (activeTab !== "comms") return null;

  return (
    <motion.div
      key="atc-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 overflow-y-auto px-4 md:px-6 py-5 max-w-full w-full space-y-4 font-mono text-slate-200 scrollbar-thin scrollbar-thumb-slate-800"
    >
      {/* Top Header Card */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/30 border border-blue-400/50 rounded-2xl shadow-lg shadow-blue-500/20">
            <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-white tracking-widest uppercase flex items-center gap-2">
              <span>ATC RADIO COMMS & CLEARANCE DECK</span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-extrabold">LIVE STREAM</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              VHF Air Traffic Control voice synthesizer & real-time radio sector monitoring
            </p>
          </div>
        </div>

        {/* Audio controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setAutoPlayVoice(prev => !prev)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wider flex items-center gap-2 cursor-pointer transition-all border ${
              autoPlayVoice 
                ? "bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30" 
                : "bg-black/60 text-slate-400 border-white/10 hover:text-white"
            }`}
          >
            {autoPlayVoice ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4" />}
            <span>AUTO-BROADCAST {autoPlayVoice ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Frequency Tuner + Live Transmissions + TCAS Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Radio Frequency Tuner (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="text-xs font-black text-white uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-cyan-400" />
                VHF FREQUENCY SELECTOR
              </span>
              <span className="text-[9px] text-cyan-400 font-extrabold">118-136 MHz</span>
            </div>

            <div className="space-y-2">
              {frequencies.map((f) => (
                <button
                  key={f.freq}
                  onClick={() => setSelectedFreq(f.freq)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    selectedFreq === f.freq
                      ? "bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/20"
                      : "bg-black/50 border-white/8 text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div>
                    <div className="text-sm font-black text-white flex items-center gap-2">
                      <span>{f.freq} MHz</span>
                      <span className="text-[8px] px-1.5 py-0.2 bg-white/10 text-slate-300 rounded uppercase">{f.band}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold mt-0.5">{f.name}</div>
                  </div>
                  {selectedFreq === f.freq && (
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </button>
              ))}
            </div>

            {/* Selected Aircraft Clearance Quick Speaker */}
            {selectedFlight ? (
              <div className="p-3.5 bg-black/60 rounded-xl border border-cyan-500/30 space-y-2 mt-4 shadow-inner">
                <div className="text-[10px] text-cyan-400 font-extrabold uppercase flex items-center justify-between">
                  <span>TARGETED CRAFT RADIO</span>
                  <span className="text-white">{selectedFlight.flight_iata || selectedFlight.hex}</span>
                </div>
                <div className="text-xs text-slate-300 font-medium italic">
                  "{selectedFlight.flight_iata || 'Aircraft'}, climb FL{Math.round((selectedFlight.alt || 30000) / 100)}, heading {selectedFlight.dir || 90}°, squawk {selectedFlight.squawk || '2415'}."
                </div>
                <button
                  onClick={() => handleSpeak(`${selectedFlight.flight_iata || 'Aircraft'}, climb and maintain Flight Level ${Math.round((selectedFlight.alt || 30000) / 100)}, heading ${selectedFlight.dir || 90} degrees.`)}
                  className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[11px] rounded-lg cursor-pointer tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>TRANSMIT VOICE CLEARANCE</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-black/40 rounded-xl border border-white/6 text-center text-[10px] text-slate-500 font-bold uppercase">
                Select any aircraft to tune dedicated clearance radio
              </div>
            )}
          </div>

          {/* TCAS Conflict Warning Box */}
          <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-2.5">
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>TCAS CONFLICT ADVISORY MONITOR</span>
            </div>

            {tcasConflicts.length > 0 ? (
              <div className="space-y-2">
                {tcasConflicts.map((c, i) => (
                  <div key={i} className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[10px] space-y-1">
                    <div className="flex items-center justify-between font-extrabold text-amber-300">
                      <span>{c.flight1.flight_iata || c.flight1.hex} ⚡ {c.flight2.flight_iata || c.flight2.hex}</span>
                      <span className="px-1.5 py-0.2 bg-amber-500 text-black font-black rounded text-[9px]">{c.severity}</span>
                    </div>
                    <div className="text-slate-400 flex items-center justify-between font-bold">
                      <span>Separation: <strong className="text-white">{c.distNm} NM</strong></span>
                      <span>Altitude Delta: <strong className="text-white">{c.altDiffFt} ft</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-black/40 rounded-xl text-center text-[10px] text-emerald-400 font-bold uppercase flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sector Clear - Nominal Separation</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Transmissions Log Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
              <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>LIVE AIRSPACE TRANSMISSIONS STREAM</span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl text-[10px] font-bold">
                {["ALL", "EMERGENCY", "TCAS"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAtcLogFilter(tab as any)}
                    className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${
                      atcLogFilter === tab ? "bg-cyan-500 text-black font-black" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmissions List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {activeTransmissions.map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="p-3 bg-black/50 hover:bg-black/80 border border-white/8 hover:border-cyan-500/40 rounded-xl transition-all space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-cyan-400 text-xs">{t.callsign}</span>
                      <span className="px-1.5 py-0.2 bg-white/10 text-slate-300 font-bold rounded text-[9px]">{t.frequency} MHz</span>
                      <span className="text-slate-500 text-[9px]">{t.station}</span>
                    </div>

                    <button
                      onClick={() => handleSpeak(t.voiceText)}
                      className="px-2 py-0.5 bg-blue-600/30 hover:bg-blue-600 border border-blue-400/40 text-blue-300 hover:text-white rounded text-[9px] font-black cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5" /> SPEAK
                    </button>
                  </div>

                  <div className="text-xs text-slate-200 font-medium leading-relaxed pl-2 border-l-2 border-cyan-500/50">
                    "{t.message}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
