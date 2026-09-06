import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Plane, Search, Radio, X, LayoutGrid, List, 
  ArrowUpRight, ArrowDownRight, ArrowRight, Gauge, 
  Navigation, Compass, Activity, ShieldCheck, Filter, 
  SlidersHorizontal, ChevronDown, CheckCircle2 
} from "lucide-react";
import { Flight } from "../types";
import { getAirlineName, getAirlineLogoUrl, getAltitudeColor, getAirportCity } from "../utils";

export function SearchTab({
  activeTab,
  visibleFlightsCount,
  setVisibleFlightsCount,
  loadMoreIncrement,
  searchQuery,
  setSearchQuery,
  searchFlightNumOnly,
  setSearchFlightNumOnly,
  statusFilter,
  setStatusFilter,
  loadingFlights,
  filteredFlights,
  flights,
  selectedFlight,
  setSelectedFlight,
  fetchFlightDetails,
  setActiveTabMain
}: any) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<"alt" | "speed" | "progress" | "flight">("alt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (activeTab !== "search") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingFlights) {
          setVisibleFlightsCount((prev: number) => prev + (loadMoreIncrement || 50));
        }
      },
      { threshold: 0.15 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [activeTab, loadingFlights, loadMoreIncrement, setVisibleFlightsCount]);

  // Sort and filter displayed list
  const sortedList = useMemo(() => {
    const list = [...filteredFlights];
    list.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "alt") comparison = (b.alt || 0) - (a.alt || 0);
      else if (sortBy === "speed") comparison = (b.speed || 0) - (a.speed || 0);
      else if (sortBy === "progress") comparison = (b.progress_percent || 0) - (a.progress_percent || 0);
      else if (sortBy === "flight") comparison = (a.flight_iata || a.flight_number || "").localeCompare(b.flight_iata || b.flight_number || "");
      return sortOrder === "desc" ? comparison : -comparison;
    });
    return list;
  }, [filteredFlights, sortBy, sortOrder]);

  if (activeTab !== "search") return null;

  return (
    <motion.div
      key="search-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 overflow-y-auto px-4 md:px-6 py-5 max-w-full w-full space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
    >
      {/* Tactical Top Command Header */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-2xl">
        
        {/* Left: Live Ingestion Status & Counter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-black/60 border border-blue-500/30 rounded-xl font-mono text-xs shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
              LIVE RADAR FEED: <strong className="text-white text-xs">{flights.length.toLocaleString()}</strong> TRANSPONDERS
            </span>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-1 font-mono text-[10px] font-bold overflow-x-auto gap-1">
            {[
              { id: "all", label: "ALL ACTIVE" },
              { id: "high", label: "FL350+ CRUISE" },
              { id: "climbing", label: "CLIMBING" },
              { id: "descending", label: "DESCENDING" },
              { id: "ground", label: "ON GROUND" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap font-extrabold ${
                  statusFilter === f.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Region Quick Filters */}
          <div className="hidden xl:flex items-center bg-black/40 border border-white/8 rounded-xl p-1 font-mono text-[9px] font-extrabold gap-1 text-slate-400">
            {[
              { id: "", label: "ALL REGIONS" },
              { id: "na", label: "NORTH AMERICA" },
              { id: "eu", label: "EUROPE" },
              { id: "me_asia", label: "ASIA / ME" },
              { id: "latam", label: "LATIN AMERICA" }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  if (r.id === "na") setSearchQuery("United States");
                  else if (r.id === "eu") setSearchQuery("Europe");
                  else if (r.id === "me_asia") setSearchQuery("Emirates");
                  else if (r.id === "latam") setSearchQuery("Brazil");
                  else setSearchQuery("");
                }}
                className="px-2.5 py-1 rounded-lg hover:text-cyan-300 hover:bg-white/5 transition-colors cursor-pointer"
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Search, Sorting & View Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-grow sm:flex-grow-0 sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4 text-cyan-400" />
            </span>
            <input
              type="text"
              placeholder="Search Flight #, Airline, City, Hex..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-white/12 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-xl py-2 pl-9 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none font-mono tracking-wide"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-1 text-[10px] font-mono font-bold">
            <button
              onClick={() => {
                if (sortBy === "alt") setSortOrder(prev => prev === "desc" ? "asc" : "desc");
                else { setSortBy("alt"); setSortOrder("desc"); }
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${sortBy === "alt" ? "bg-white/15 text-cyan-300 font-black" : "text-slate-400 hover:text-white"}`}
              title="Sort by Altitude"
            >
              ALT {sortBy === "alt" && (sortOrder === "desc" ? "↓" : "↑")}
            </button>
            <button
              onClick={() => {
                if (sortBy === "speed") setSortOrder(prev => prev === "desc" ? "asc" : "desc");
                else { setSortBy("speed"); setSortOrder("desc"); }
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${sortBy === "speed" ? "bg-white/15 text-cyan-300 font-black" : "text-slate-400 hover:text-white"}`}
              title="Sort by Speed"
            >
              SPD {sortBy === "speed" && (sortOrder === "desc" ? "↓" : "↑")}
            </button>
            <button
              onClick={() => {
                if (sortBy === "progress") setSortOrder(prev => prev === "desc" ? "asc" : "desc");
                else { setSortBy("progress"); setSortOrder("desc"); }
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${sortBy === "progress" ? "bg-white/15 text-cyan-300 font-black" : "text-slate-400 hover:text-white"}`}
              title="Sort by Route Progress"
            >
              ROUTE {sortBy === "progress" && (sortOrder === "desc" ? "↓" : "↑")}
            </button>
          </div>

          {/* Grid / Table Toggle */}
          <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "table" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Grid or Table Display */}
      {loadingFlights && flights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 gap-4">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-300 font-mono text-xs font-bold uppercase tracking-widest animate-pulse">
            Establishing High-Speed Satellite Telemetry Link...
          </span>
        </div>
      ) : sortedList.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center text-slate-500 flex flex-col items-center justify-center">
          <Plane className="w-12 h-12 opacity-20 rotate-45 mb-3 text-blue-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
            No active flight transponders matching filter criteria
          </span>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID CARD VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedList.slice(0, visibleFlightsCount).map((flight: Flight) => {
            const isSelected = selectedFlight?.hex === flight.hex;
            const logoUrl = getAirlineLogoUrl(flight.airline_iata || flight.flight_iata?.substring(0, 2) || "");
            const altColor = getAltitudeColor(flight.alt);
            const isClimbing = (flight.vspeed || 0) > 300;
            const isDescending = (flight.vspeed || 0) < -300;

            return (
              <div
                key={flight.hex}
                onClick={() => {
                  setSelectedFlight(flight);
                  fetchFlightDetails(flight);
                  setActiveTabMain("briefing");
                }}
                className={`group glass-panel rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? "glass-panel-active ring-1 ring-blue-400"
                    : "hover:border-blue-500/50 hover:bg-white/[0.04] hover:-translate-y-0.5"
                }`}
              >
                <div>
                  {/* Top Bar: Airline Logo / Flight # / Status Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/8 gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Airline Logo"
                          className="w-7 h-7 rounded-lg bg-white/10 object-contain p-1 shrink-0 border border-white/15"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-[10px] font-mono font-black text-blue-300 shrink-0">
                          {(flight.airline_iata || flight.flight_iata || "FL").substring(0, 2)}
                        </div>
                      )}

                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-mono font-extrabold text-sm text-white tracking-wide truncate">
                            {flight.flight_iata || flight.flight_number || "BLIP"}
                          </h3>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-white/10 text-slate-300 rounded font-semibold">
                            {flight.aircraft_type || "JET"}
                          </span>
                        </div>
                        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest truncate">
                          {flight.airline_name || getAirlineName(flight.airline_iata || flight.flight_iata?.substring(0, 2))}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isClimbing ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3 text-emerald-400" /> CLIMB
                        </span>
                      ) : isDescending ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <ArrowDownRight className="w-3 h-3 text-amber-400" /> DESC
                        </span>
                      ) : flight.status === "ground" ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold bg-red-500/15 text-red-300 border border-red-500/30">
                          GROUND
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                          CRUISE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Route City Nodes */}
                  <div className="flex items-center justify-between my-3.5 font-mono px-1">
                    <div className="text-left">
                      <span className="text-xl font-black text-white tracking-wide">{flight.dep_iata || "DEP"}</span>
                      <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider truncate max-w-[90px]">
                        {flight.dep_city || getAirportCity(flight.dep_iata)}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center px-2">
                      <div className="p-1 bg-white/5 rounded-full border border-white/10">
                        <Plane className="w-3.5 h-3.5 text-blue-400 rotate-90" />
                      </div>
                      <span className="text-[9px] text-blue-400 font-extrabold mt-1">
                        {flight.progress_percent || 50}%
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-cyan-400 tracking-wide">{flight.arr_iata || "ARR"}</span>
                      <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider truncate max-w-[90px]">
                        {flight.arr_city || getAirportCity(flight.arr_iata)}
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Dials / Gauges */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-2.5 bg-black/50 rounded-xl border border-white/6 font-mono text-center">
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">ALTITUDE</span>
                      <span className="text-xs font-black block mt-0.5" style={{ color: altColor.hex }}>
                        FL{Math.round(flight.alt / 100)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">SPEED</span>
                      <span className="text-xs font-black text-white block mt-0.5">
                        {flight.speed} <span className="text-[8px] text-slate-400">km/h</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">HEADING</span>
                      <span className="text-xs font-black text-slate-200 block mt-0.5">
                        {flight.dir}°
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Route Progress Bar */}
                <div className="mt-3 pt-2 border-t border-white/6">
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(3, Math.min(100, flight.progress_percent || 50))}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-black/60 border-b border-white/10 text-[10px] text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="py-3 px-4">Flight</th>
                  <th className="py-3 px-4">Airline</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Altitude</th>
                  <th className="py-3 px-4">Ground Speed</th>
                  <th className="py-3 px-4">Heading</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedList.slice(0, visibleFlightsCount).map((flight: Flight) => {
                  const altColor = getAltitudeColor(flight.alt);
                  const isSelected = selectedFlight?.hex === flight.hex;

                  return (
                    <tr
                      key={flight.hex}
                      onClick={() => {
                        setSelectedFlight(flight);
                        fetchFlightDetails(flight);
                        setActiveTabMain("briefing");
                      }}
                      className={`hover:bg-blue-600/10 cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-600/20 font-bold" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-black text-white">
                        {flight.flight_iata || flight.flight_number}
                        <span className="text-[9px] text-slate-400 ml-2 font-normal">{flight.aircraft_type}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 truncate max-w-[160px]">
                        {flight.airline_name || getAirlineName(flight.airline_iata)}
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        <span className="font-bold text-white">{flight.dep_iata}</span>
                        <span className="mx-1 text-slate-500">➔</span>
                        <span className="font-bold text-cyan-400">{flight.arr_iata}</span>
                      </td>
                      <td className="py-3 px-4 font-black" style={{ color: altColor.hex }}>
                        FL{Math.round(flight.alt / 100)} ({flight.alt.toLocaleString()} ft)
                      </td>
                      <td className="py-3 px-4 text-white">
                        {flight.speed} km/h <span className="text-slate-400 text-[10px]">({flight.speed_knots || Math.round(flight.speed / 1.852)} kts)</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {flight.dir}°
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-white/10 text-slate-300 border border-white/10">
                          {flight.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-blue-400">
                        {flight.progress_percent || 50}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Load More & Total Count Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 pb-6 font-mono text-xs text-slate-400 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>
            Displaying <strong className="text-white">{Math.min(visibleFlightsCount, sortedList.length).toLocaleString()}</strong> of <strong className="text-cyan-400">{sortedList.length.toLocaleString()}</strong> matched transponders
          </span>
        </div>

        <div className="flex items-center gap-2">
          {visibleFlightsCount < sortedList.length && (
            <>
              <button
                onClick={() => setVisibleFlightsCount((prev: number) => prev + 100)}
                className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 rounded-xl font-bold transition-all cursor-pointer shadow-lg shadow-blue-500/10 text-xs"
              >
                + LOAD 100 MORE
              </button>
              <button
                onClick={() => setVisibleFlightsCount(sortedList.length)}
                className="px-4 py-2 bg-black/60 hover:bg-white/10 border border-white/15 text-slate-300 rounded-xl font-bold transition-all cursor-pointer text-xs"
              >
                SHOW ALL ({sortedList.length.toLocaleString()})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="h-4 flex items-center justify-center opacity-0" />
    </motion.div>
  );
}

