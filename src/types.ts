export interface Flight {
  hex: string;
  reg_number?: string;
  flag?: string;
  flight_number?: string;
  flight_icao?: string;
  flight_iata?: string;
  dep_icao?: string;
  dep_iata?: string;
  dep_city?: string;
  dep_name?: string;
  arr_icao?: string;
  arr_iata?: string;
  arr_city?: string;
  arr_name?: string;
  airline_icao?: string;
  airline_iata?: string;
  airline_name?: string;
  status: "en-route" | "climbing" | "descending" | "ground" | "landed" | "holding" | string;
  lat: number;
  lng: number;
  alt: number; // altitude in feet
  dir: number; // heading in degrees (0-360)
  speed: number; // ground speed in km/h
  speed_knots?: number;
  vspeed?: number; // vertical speed in feet/minute
  squawk?: string;
  aircraft_type?: string;
  aircraft_model?: string;
  aircraft_category?: "4-engine" | "2-engine-wide" | "2-engine-narrow" | "regional" | "turboprop" | "ga";
  progress_percent?: number;
  dist_traveled_km?: number;
  dist_remaining_km?: number;
  dist_total_km?: number;
  distance_traveled_km?: number;
  distance_remaining_km?: number;
  distance_total_km?: number;
  eta_minutes?: number;
  mach?: number;
  isScheduled?: boolean;
  scheduledDepartureTime?: string;
  scheduledArrivalTime?: string;
  gate?: string;
  terminal?: string;
}

export interface FlightDetailed {
  aircraftModel: string;
  airlineName: string;
  flightDuration: string;
  departureAirportFullName: string;
  departureCity: string;
  departureIata?: string;
  departureIcao?: string;
  departureTime: string;
  actualDepartureTime?: string | null;
  departureDelayMin?: number | null;
  departureTerminal?: string;
  departureGate?: string;
  arrivalAirportFullName: string;
  arrivalCity: string;
  arrivalIata?: string;
  arrivalIcao?: string;
  arrivalTime: string;
  actualArrivalTime?: string | null;
  arrivalDelayMin?: number | null;
  arrivalTerminal?: string;
  arrivalGate?: string;
  routeFunFact?: string;
  passengerLoadEstimates?: string;
  currentWeather?: {
    departure: string;
    arrival: string;
    depTemp?: string;
    depWind?: string;
    depCondition?: string;
    arrTemp?: string;
    arrWind?: string;
    arrCondition?: string;
  };
  aircraftSpecs?: {
    manufacturer: string;
    engines: string;
    maxAltitude: string;
    maxSpeed: string;
    wingspan: string;
    range: string;
  };
  copilotAnalysis?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp?: string;
}

export interface AirportInfo {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  altFt?: number;
}
