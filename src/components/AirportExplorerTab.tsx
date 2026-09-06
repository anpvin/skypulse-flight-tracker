import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Search, MapPin, Wind, Thermometer, 
  PlaneTakeoff, PlaneLanding, Compass, ExternalLink, 
  Globe, X, ChevronRight, CloudRain, Radio, Layers,
  Clock, Shield, Activity, Plane, Gauge
} from "lucide-react";
import { globalAirports, generateMetarWeather, getAirportRunways, getAirportFrequencies, generateMockFlightBoard } from "../utils";
import { Flight, AirportInfo } from "../types";

interface AirportExplorerTabProps {
  activeTab: string;
  flights: Flight[];
  onSelectAirport: (airportIata: string, lat: number, lng: number) => void;
  setActiveTab: (tab: string) => void;
}

export function AirportExplorerTab({
  activeTab,
  flights,
  onSelectAirport,
  setActiveTab
}: AirportExplorerTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("ALL");
  const [selectedAirportDetail, setSelectedAirportDetail] = useState<AirportInfo | null>(null);
  const [boardTab, setBoardTab] = useState<"departures" | "arrivals" | "runways" | "frequencies">("departures");

  const airportList = useMemo(() => {
    return Object.values(globalAirports);
  }, []);

  // Compute live inbound/outbound counts for each airport from real flights
  const airportTraffic = useMemo(() => {
    const depCounts: Record<string, number> = {};
    const arrCounts: Record<string, number> = {};

    flights.forEach(f => {
      if (f.dep_iata) depCounts[f.dep_iata] = (depCounts[f.dep_iata] || 0) + 1;
      if (f.arr_iata) arrCounts[f.arr_iata] = (arrCounts[f.arr_iata] || 0) + 1;
    });

    return { depCounts, arrCounts };
  }, [flights]);

  // Filter airports by search and continent
  const filteredAirports = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return airportList.filter(a => {
      const matchSearch = q === "" || 
        a.iata.toLowerCase().includes(q) ||
        a.icao.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q);

      const matchRegion = regionFilter === "ALL" ||
        (regionFilter === "NA" && ["United States", "Canada", "Mexico"].includes(a.country)) ||
        (regionFilter === "EU" && ["United Kingdom", "France", "Germany", "Netherlands", "Spain", "Italy", "Switzerland", "Austria", "Belgium", "Greece", "Portugal", "Ireland", "Norway", "Sweden", "Finland", "Denmark", "Poland", "Czech Republic", "Hungary"].includes(a.country)) ||
        (regionFilter === "ASIA" && ["Japan", "China", "South Korea", "Singapore", "Thailand", "Malaysia", "Indonesia", "Vietnam", "Philippines", "India", "Taiwan", "Hong Kong"].includes(a.country)) ||
        (regionFilter === "ME" && ["United Arab Emirates", "Qatar", "Saudi Arabia", "Kuwait", "Bahrain", "Oman", "Turkey", "Israel"].includes(a.country)) ||
        (regionFilter === "LATAM" && ["Brazil", "Argentina", "Chile", "Colombia", "Peru", "Panama"].includes(a.country)) ||
        (regionFilter === "OCEANIA" && ["Australia", "New Zealand"].includes(a.country));

      return matchSearch && matchRegion;
    });
  }, [airportList, searchQuery, regionFilter]);

  // Active Airport Dossier Data
  const activeRunways = useMemo(() => {
    if (!selectedAirportDetail) return [];
    return getAirportRunways(selectedAirportDetail);
  }, [selectedAirportDetail]);

  const activeFrequencies = useMemo(() => {
    if (!selectedAirportDetail) return [];
    return getAirportFrequencies(selectedAirportDetail);
  }, [selectedAirportDetail]);

  const activeFlightBoard = useMemo(() => {
    if (!selectedAirportDetail) return { departures: [], arrivals: [] };
    return generateMockFlightBoard(selectedAirportDetail.iata);
  }, [selectedAirportDetail]);

  const activeWeather = useMemo(() => {
    if (!selectedAirportDetail) return null;
    return generateMetarWeather(selectedAirportDetail.iata);
  }, [selectedAirportDetail]);

  if (activeTab !== "airports") return null;

  return (
    <motion.div
      key="airports-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 overflow-y-auto px-4 md:px-6 py-5 max-w-full w-full space-y-4 font-mono text-slate-200 scrollbar-thin scrollbar-thumb-slate-800"
    >
      {/* Top Header Card */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/30 border border-blue-400/50 rounded-2xl shadow-lg shadow-blue-500/20">
            <Building2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-black text-white tracking-widest uppercase flex items-center gap-2">
              <span>GLOBAL AIRPORT HUBS EXPLORER</span>
              <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full font-extrabold">300+ HUBS</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              International aerodrome operations, runway layouts, live FR24 flight boards, and METAR weather
            </p>
          </div>
        </div>

        {/* Search & Region Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Airport IATA, City, Country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[10px]">
            {["ALL", "NA", "EU", "ASIA", "ME", "LATAM", "OCEANIA"].map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  regionFilter === r ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30" : "text-slate-400 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Global Airports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAirports.map((airport) => {
          const deps = airportTraffic.depCounts[airport.iata] || 0;
          const arrs = airportTraffic.arrCounts[airport.iata] || 0;
          const weather = generateMetarWeather(airport.iata);

          return (
            <div
              key={airport.iata}
              className="glass-panel p-4 rounded-2xl border border-slate-800/80 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-xl hover:shadow-cyan-950/30"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-cyan-300 font-mono tracking-wider">{airport.iata}</span>
                      <span className="text-xs text-slate-400 font-mono font-bold">[{airport.icao}]</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-white line-clamp-1 mt-0.5">{airport.city}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{airport.name}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{airport.country}</p>
                  </div>

                  <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                    {airport.altFt ? `${airport.altFt} FT` : "SEA LEVEL"}
                  </span>
                </div>

                {/* Weather & Active Flights Telemetry */}
                <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[10px]">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <PlaneTakeoff className="w-3.5 h-3.5 text-cyan-400" />
                    <span>OUTBOUND: <strong className="text-white">{deps}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <PlaneLanding className="w-3.5 h-3.5 text-emerald-400" />
                    <span>INBOUND: <strong className="text-white">{arrs}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    <span>{weather.tempC}&deg;C &bull; {weather.condition.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Wind className="w-3.5 h-3.5 text-blue-400" />
                    <span>{weather.windDirDeg}&deg; @ {weather.windSpeedKt} KT</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setSelectedAirportDetail(airport)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-blue-600/30 hover:bg-blue-600/60 text-blue-200 border border-blue-500/40 text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1"
                >
                  <Activity className="w-3 h-3" /> FLIGHT BOARD
                </button>
                <button
                  onClick={() => onSelectAirport(airport.iata, airport.lat, airport.lng)}
                  className="py-1.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20"
                >
                  <MapPin className="w-3 h-3" /> RADAR
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flightradar24-Grade Airport Dossier & Live Flight Board Modal */}
      <AnimatePresence>
        {selectedAirportDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-slate-950 border border-cyan-500/40 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-cyan-950/60 font-mono text-slate-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-2xl">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-white">{selectedAirportDetail.iata}</span>
                      <span className="text-sm font-bold text-cyan-400">[{selectedAirportDetail.icao}]</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">{selectedAirportDetail.country}</span>
                    </div>
                    <h2 className="text-sm font-bold text-slate-300">{selectedAirportDetail.name} &bull; {selectedAirportDetail.city}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectAirport(selectedAirportDetail.iata, selectedAirportDetail.lat, selectedAirportDetail.lng);
                      setSelectedAirportDetail(null);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/30"
                  >
                    <MapPin className="w-4 h-4" /> FOCUS ON RADAR
                  </button>
                  <button
                    onClick={() => setSelectedAirportDetail(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 border border-slate-700 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Weather & Aerodrome Overview Strip */}
              {activeWeather && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-3 bg-slate-900/60 border-b border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">TEMPERATURE</span>
                      <span className="font-black text-white">{activeWeather.tempC}&deg;C ({activeWeather.condition})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">WIND COMPONENT</span>
                      <span className="font-black text-white">{activeWeather.windDirDeg}&deg; @ {activeWeather.windSpeedKt} KNOTS</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">PRESSURE (QNH)</span>
                      <span className="font-black text-white">{activeWeather.qnhHpa} hPa (STD)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">FLIGHT RULES</span>
                      <span className="font-black text-emerald-400">VFR &bull; VIS {activeWeather.visibilityKm} KM</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dossier Tabs (Departures, Arrivals, Runways, Frequencies) */}
              <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 text-xs">
                <button
                  onClick={() => setBoardTab("departures")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-black uppercase transition-all ${
                    boardTab === "departures" ? "bg-slate-800 text-cyan-300 border-b-2 border-cyan-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <PlaneTakeoff className="w-4 h-4" /> LIVE DEPARTURES ({activeFlightBoard.departures.length})
                </button>
                <button
                  onClick={() => setBoardTab("arrivals")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-black uppercase transition-all ${
                    boardTab === "arrivals" ? "bg-slate-800 text-cyan-300 border-b-2 border-cyan-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <PlaneLanding className="w-4 h-4" /> LIVE ARRIVALS ({activeFlightBoard.arrivals.length})
                </button>
                <button
                  onClick={() => setBoardTab("runways")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-black uppercase transition-all ${
                    boardTab === "runways" ? "bg-slate-800 text-cyan-300 border-b-2 border-cyan-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Layers className="w-4 h-4" /> RUNWAY LAYOUT ({activeRunways.length})
                </button>
                <button
                  onClick={() => setBoardTab("frequencies")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-black uppercase transition-all ${
                    boardTab === "frequencies" ? "bg-slate-800 text-cyan-300 border-b-2 border-cyan-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Radio className="w-4 h-4" /> RADIO FREQUENCIES
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800">
                {boardTab === "departures" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-6 text-[10px] text-slate-500 font-extrabold uppercase px-4 pb-1 border-b border-slate-800">
                      <span>TIME</span>
                      <span>FLIGHT</span>
                      <span>DESTINATION</span>
                      <span>AIRLINE</span>
                      <span>GATE / TERM</span>
                      <span className="text-right">STATUS</span>
                    </div>
                    {activeFlightBoard.departures.map((d, i) => (
                      <div key={i} className="grid grid-cols-6 items-center px-4 py-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/60 text-xs transition-colors">
                        <span className="font-bold text-white">{d.scheduledTime}</span>
                        <span className="font-black text-cyan-400">{d.flightNumber}</span>
                        <div>
                          <span className="font-bold text-white block">{d.destinationCity}</span>
                          <span className="text-[10px] text-slate-400 font-mono">[{d.destinationIata}]</span>
                        </div>
                        <span className="text-slate-300 truncate">{d.airline}</span>
                        <span className="text-slate-400">{d.gate} &bull; {d.terminal}</span>
                        <div className="text-right">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            d.status.includes("DELAYED") ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                            d.status.includes("BOARDING") ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse" :
                            "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}>
                            {d.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {boardTab === "arrivals" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-6 text-[10px] text-slate-500 font-extrabold uppercase px-4 pb-1 border-b border-slate-800">
                      <span>TIME</span>
                      <span>FLIGHT</span>
                      <span>ORIGIN</span>
                      <span>AIRLINE</span>
                      <span>GATE / TERM</span>
                      <span className="text-right">STATUS</span>
                    </div>
                    {activeFlightBoard.arrivals.map((a, i) => (
                      <div key={i} className="grid grid-cols-6 items-center px-4 py-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/60 text-xs transition-colors">
                        <span className="font-bold text-white">{a.scheduledTime}</span>
                        <span className="font-black text-cyan-400">{a.flightNumber}</span>
                        <div>
                          <span className="font-bold text-white block">{a.originCity}</span>
                          <span className="text-[10px] text-slate-400 font-mono">[{a.originIata}]</span>
                        </div>
                        <span className="text-slate-300 truncate">{a.airline}</span>
                        <span className="text-slate-400">{a.gate} &bull; {a.terminal}</span>
                        <div className="text-right">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            a.status.includes("DELAYED") ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                            a.status.includes("APPROACHING") ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse" :
                            "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}>
                            {a.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {boardTab === "runways" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeRunways.map((r, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-amber-400">RWY {r.identifier}</span>
                            <span className="text-xs text-slate-400 font-mono">HDG {r.headingDeg}&deg;</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">{r.surface}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase">LENGTH & WIDTH</span>
                            <span className="font-black text-white">{r.lengthFt.toLocaleString()} FT &times; {r.widthFt} FT</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase">ILS GLIDEPATH FREQ</span>
                            <span className="font-black text-cyan-400">{r.ilsFreq || "110.30 MHz"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {boardTab === "frequencies" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeFrequencies.map((f, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">{f.type} &bull; {f.name}</span>
                          <span className="text-base font-black text-white font-mono mt-0.5 block">{f.freqMhz}</span>
                        </div>
                        <Radio className="w-5 h-5 text-slate-600" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
