import React, { useState, useRef, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string; sublabel?: string }[];
  icon?: React.ReactNode;
}

export function SearchableSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  icon
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value.toUpperCase() === value.toUpperCase());
  const displayValue = selectedOption ? `${selectedOption.value} - ${selectedOption.label}` : value;

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return options;
    return options.filter(
      (opt) =>
        opt.value.toLowerCase().includes(q) ||
        opt.label.toLowerCase().includes(q) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(q))
    );
  }, [searchTerm, options]);

  return (
    <div ref={dropdownRef} className="flex flex-col gap-1.5 relative w-full text-left">
      <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-black/60 border border-white/10 hover:border-white/10 focus-within:border-blue-500/50 rounded px-3 py-2.5 text-xs text-white font-mono cursor-pointer transition-all h-[42px]"
      >
        <span className="shrink-0">{icon}</span>
        <input
          type="text"
          placeholder={placeholder}
          value={isOpen ? searchTerm : displayValue}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="bg-transparent focus:outline-none w-full text-white placeholder-slate-500 text-xs font-mono"
        />
        {value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setSearchTerm("");
              setIsOpen(false);
            }}
            className="text-slate-500 hover:text-white shrink-0 p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 bg-[#0F1117] border border-white/10 rounded shadow-2xl z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
          >
            {filtered.length === 0 ? (
              <div className="p-3 text-xs text-slate-500 text-center font-mono">No matching results</div>
            ) : (
              filtered.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setSearchTerm("");
                    setIsOpen(false);
                  }}
                  className={`p-3 text-xs font-mono border-b border-white/5 hover:bg-blue-600/20 hover:text-white cursor-pointer transition-colors ${
                    value.toUpperCase() === opt.value.toUpperCase() ? "bg-blue-600/30 text-blue-400 font-bold" : "text-slate-300"
                  }`}
                >
                  <div className="font-bold flex justify-between">
                    <span>{opt.value}</span>
                    {opt.sublabel && <span className="opacity-60 text-[9px] bg-slate-800/60 px-1 py-0.5 rounded text-slate-400">{opt.sublabel}</span>}
                  </div>
                  <div className="text-[10px] opacity-80 mt-1 truncate">{opt.label}</div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
