import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Building2, Search, MapPin, Wind, Thermometer, 
  PlaneTakeoff, PlaneLanding, Compass, ExternalLink, 
  Globe, X, ChevronRight, CloudRain 
} from "lucide-react";
import { globalAirports, generateMetarWeather } from "../utils";
import { Flight } from "../types";

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
              International aerodrome operations, runway layouts, live traffic, and METAR weather
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
              className="w-full bg-black/60 border border-white/12 focus:border-cyan-400 rounded-xl py-2 pl-9 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none tracking-wide"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Region Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-extrabold">
        {[
          { id: "ALL", label: "ALL WORLDWIDE" },
          { id: "NA", label: "NORTH AMERICA" },
          { id: "EU", label: "EUROPE" },
          { id: "ASIA", label: "ASIA-PACIFIC" },
          { id: "ME", label: "MIDDLE EAST" },
          { id: "LATAM", label: "LATIN AMERICA" },
          { id: "OCEANIA", label: "OCEANIA" }
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => setRegionFilter(r.id)}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
              regionFilter === r.id
                ? "bg-cyan-500 text-black border-cyan-400 font-black shadow-md shadow-cyan-500/20"
                : "bg-black/50 border-white/8 text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Airports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAirports.map((airport) => {
          const metar = generateMetarWeather(airport.iata);
          const activeDep = airportTraffic.depCounts[airport.iata] || 0;
          const activeArr = airportTraffic.arrCounts[airport.iata] || 0;

          return (
            <div
              key={airport.iata}
              className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all space-y-3 shadow-xl hover:shadow-cyan-500/10 group flex flex-col justify-between"
            >
              <div>
                {/* Header: IATA & ICAO + Country */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-cyan-400 tracking-wider group-hover:glow-cyan transition-all">
                      {airport.iata}
                    </span>
                    <span className="px-1.5 py-0.5 bg-black/60 border border-white/10 text-slate-300 rounded text-[10px] font-bold">
                      {airport.icao}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {airport.country}
                  </span>
                </div>

                {/* Airport Full Name & City */}
                <div className="mt-1">
                  <h3 className="text-xs font-bold text-white leading-tight truncate" title={airport.name}>
                    {airport.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {airport.city} • {airport.altFt ? `${airport.altFt.toLocaleString()} ft MSL` : "Sea Level"}
                  </span>
                </div>

                {/* Real-Time Live Traffic Badges */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-white/8 text-[10px]">
                  <div className="p-2 bg-black/50 rounded-xl border border-white/6 flex items-center gap-2">
                    <PlaneTakeoff className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold block uppercase">DEPARTURES</span>
                      <span className="text-xs font-extrabold text-emerald-300">{activeDep} Active</span>
                    </div>
                  </div>

                  <div className="p-2 bg-black/50 rounded-xl border border-white/6 flex items-center gap-2">
                    <PlaneLanding className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold block uppercase">ARRIVALS</span>
                      <span className="text-xs font-extrabold text-cyan-300">{activeArr} Inbound</span>
                    </div>
                  </div>
                </div>

                {/* METAR Weather Snippet */}
                <div className="p-2.5 bg-blue-950/20 rounded-xl border border-blue-500/20 mt-2.5 text-[10px] flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-bold text-white">{metar.tempC}°C</span>
                    <span className="text-slate-400">({metar.condition})</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <Wind className="w-3.5 h-3.5 text-blue-400" />
                    <span>{metar.windSpeedKt} kts @ {metar.windDirDeg}°</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Jump to Radar */}
              <button
                onClick={() => {
                  onSelectAirport(airport.iata, airport.lat, airport.lng);
                  setActiveTab("radar");
                }}
                className="w-full mt-3 py-2 bg-blue-600/30 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>CENTER RADAR ON {airport.iata}</span>
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
