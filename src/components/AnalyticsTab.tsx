import React from "react";
import { motion } from "motion/react";
import { BarChart2, Radio, Activity, Zap, ShieldCheck, TrendingUp, Plane, Compass, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from "recharts";

export function AnalyticsTab({
  activeTab,
  airlineChartData,
  altitudeChartData,
  speedChartData,
  flights = []
}: {
  activeTab: string;
  airlineChartData: any[];
  altitudeChartData: any[];
  speedChartData: any[];
  flights?: any[];
}) {
  if (activeTab !== "analytics") return null;

  // Calculate high-level airspace KPI metrics
  const totalFlights = flights.length;
  const avgAltitude = totalFlights > 0 ? Math.round(flights.reduce((acc, f) => acc + (f.alt || 0), 0) / totalFlights) : 32000;
  const maxSpeed = totalFlights > 0 ? Math.max(...flights.map(f => f.speed || 0)) : 950;
  const topAirline = airlineChartData.length > 0 ? airlineChartData[0]?.name : "Global Fleet";

  return (
    <motion.div
      key="analytics-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-full w-full space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent text-left font-mono"
    >
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl border border-white/10">
        <div>
          <h2 className="text-xl font-black tracking-wide text-white flex items-center gap-2.5">
            <BarChart2 className="w-6 h-6 text-cyan-400" />
            <span>GLOBAL AIRSPACE TELEMETRY ANALYTICS</span>
          </h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mt-1">
            Real-time multi-dimensional telemetry spectrum analysis from {totalFlights.toLocaleString()} live ADS-B Mode-S transponders.
          </p>
        </div>
        <div className="px-3.5 py-2 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold tracking-wider self-start md:self-auto flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>DIAGNOSTIC MATRIX ACTIVE</span>
        </div>
      </div>

      {/* Airspace KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/8 shadow-xl">
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">ACTIVE TRANSPONDERS</span>
          <span className="text-2xl font-black text-white block mt-1">{totalFlights.toLocaleString()}</span>
          <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 100% REAL-TIME ADS-B
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/8 shadow-xl">
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">AVG CRUISE LEVEL</span>
          <span className="text-2xl font-black text-cyan-400 block mt-1">FL{Math.round(avgAltitude / 100)}</span>
          <span className="text-[9px] text-slate-400 font-bold mt-0.5 block">{avgAltitude.toLocaleString()} FT MSL</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/8 shadow-xl">
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">PEAK GROUND VELOCITY</span>
          <span className="text-2xl font-black text-amber-400 block mt-1">{maxSpeed} <span className="text-xs text-slate-400">KM/H</span></span>
          <span className="text-[9px] text-slate-400 font-bold mt-0.5 block">{Math.round(maxSpeed / 1.852)} KNOTS</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/8 shadow-xl">
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">DOMINANT CARRIER</span>
          <span className="text-2xl font-black text-purple-400 block mt-1 truncate">{topAirline}</span>
          <span className="text-[9px] text-slate-400 font-bold mt-0.5 block">MAX TRANSIT CONCURRENCY</span>
        </div>
      </div>

      {/* Telemetry Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-12">
        {/* 1st Graph: Airline Carrier Distribution */}
        <div className="glass-panel p-5 rounded-3xl flex flex-col space-y-4 shadow-2xl min-h-[380px] border border-white/10">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-400" />
              <span>Airliner Fleet Density by Carrier</span>
            </h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">
              Top global commercial airlines currently operating transponders.
            </p>
          </div>
          <div className="flex-1 w-full relative min-h-[250px] overflow-x-auto scrollbar-none">
            <div className="min-w-[450px] md:min-w-0 h-full">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={airlineChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0e17", border: "1px solid rgba(56,189,248,0.3)", borderRadius: "12px", fontFamily: "monospace", fontSize: "11px" }}
                    itemStyle={{ color: "#ffffff" }}
                    labelStyle={{ color: "#38bdf8", fontWeight: "bold" }}
                  />
                  <Bar dataKey="Flights" fill="#2563eb" radius={[6, 6, 0, 0]}>
                    {airlineChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#00f0ff" : index === 1 ? "#38bdf8" : index === 2 ? "#2563eb" : "#1d4ed8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 2nd Graph: Altitude Distribution Density */}
        <div className="glass-panel p-5 rounded-3xl flex flex-col space-y-4 shadow-2xl min-h-[380px] border border-white/10">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Altitude Band Layering (FL Bands)</span>
            </h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">
              Active aircraft count across vertical airspace slices.
            </p>
          </div>
          <div className="flex-1 w-full relative min-h-[250px] overflow-x-auto scrollbar-none">
            <div className="min-w-[450px] md:min-w-0 h-full">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={altitudeChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0e17", border: "1px solid rgba(0,255,157,0.3)", borderRadius: "12px", fontFamily: "monospace", fontSize: "11px" }}
                    itemStyle={{ color: "#ffffff" }}
                    labelStyle={{ color: "#00ff9d", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="Airplanes" stroke="#00ff9d" fillOpacity={1} fill="url(#colorAlt)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3rd Graph: Velocity Speeds Bands */}
        <div className="glass-panel p-5 rounded-3xl flex flex-col space-y-4 shadow-2xl min-h-[380px] lg:col-span-2 border border-white/10">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Ground Speed Spectrum Bandwidth</span>
            </h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">
              Distribution of airplane velocities from approach holding speeds to high cruise.
            </p>
          </div>
          <div className="flex-1 w-full relative min-h-[250px] overflow-x-auto scrollbar-none">
            <div className="min-w-[450px] md:min-w-0 h-full">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={speedChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0e17", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "12px", fontFamily: "monospace", fontSize: "11px" }}
                    itemStyle={{ color: "#ffffff" }}
                    labelStyle={{ color: "#f59e0b", fontWeight: "bold" }}
                  />
                  <Line type="monotone" dataKey="Airplanes" stroke="#f59e0b" strokeWidth={3} dot={{ stroke: '#f59e0b', strokeWidth: 2, r: 4, fill: '#0b0e17' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

