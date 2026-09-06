export type AircraftCategory = 
  | "all"
  | "passenger" 
  | "cargo" 
  | "military" 
  | "business_jet" 
  | "general_aviation" 
  | "helicopter" 
  | "lighter_than_air" 
  | "glider" 
  | "drone" 
  | "ground_vehicle" 
  | "other" 
  | "non_categorized"
  | "commercial"; // alias for passenger

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
  status: "en-route" | "climbing" | "descending" | "ground" | "landed" | "holding" | "combat_air_patrol" | "tactical_refueling" | "medevac" | "sar" | string;
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
  category?: AircraftCategory;
  aircraft_category?: "4-engine" | "2-engine-wide" | "2-engine-narrow" | "regional" | "turboprop" | "ga" | "fighter" | "bomber" | "rotorcraft" | "tanker";
  progress_percent?: number;
  dist_traveled_km?: number;
  dist_remaining_km?: number;
  dist_total_km?: number;
  distance_traveled_km?: number;
  distance_remaining_km?: number;
  distance_total_km?: number;
  eta_minutes?: number;
  mach?: number;
  g_force?: number;
  rotor_rpm?: number;
  mission_type?: string;
  operator_country?: string;
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
  militarySpecs?: {
    squadron?: string;
    missionRole?: string;
    weaponsHardpoints?: number;
    stealthClass?: string;
    radarType?: string;
  };
  helicopterSpecs?: {
    rotorDiameterFt?: number;
    hoistEquipped?: boolean;
    medevacBeds?: number;
    maxHoverCeilingFt?: number;
  };
  copilotAnalysis?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp?: string;
}

export interface AirportRunway {
  identifier: string; // e.g. "09L/27R"
  lengthFt: number;
  widthFt: number;
  surface: "Asphalt" | "Concrete" | "Grooved Concrete" | "Grass";
  ilsFreq?: string;
  headingDeg: number;
}

export interface AirportFrequency {
  type: "TWR" | "GND" | "APP" | "DEP" | "ATIS" | "DEL" | "UNICOM";
  freqMhz: string;
  name: string;
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
  runways?: string[];
  runwaysDetail?: AirportRunway[];
  frequencies?: AirportFrequency[];
  timezone?: string;
  hubFor?: string[];
  delayIndex?: number; // 0 to 5 (0 = No delays, 5 = Severe delay)
  terminals?: number;
  category?: "international" | "regional" | "military_base" | "heliport";
}

export interface AtcTransmission {
  id: string;
  timestamp: string;
  callsign: string;
  frequency: string;
  station: "TOWER" | "GROUND" | "APPROACH" | "CENTER" | "OCEANIC" | "RADAR";
  sender: "ATC" | "PILOT";
  message: string;
  flightLevel?: number;
  heading?: number;
  squawk?: string;
  isEmergency?: boolean;
}

export interface EmergencyAlert {
  hex: string;
  callsign: string;
  squawk: "7700" | "7600" | "7500" | string;
  type: "GENERAL_EMERGENCY" | "RADIO_FAILURE" | "HIJACK_UNLAWFUL" | string;
  lat: number;
  lng: number;
  alt: number;
  timestamp: number;
  airline: string;
  route: string;
}

export interface TcasWarning {
  flight1: Flight;
  flight2: Flight;
  horizontalDistanceNm: number;
  verticalDistanceFt: number;
  severity: "TA" | "RA"; // Traffic Advisory vs Resolution Advisory
  advisoryText: string;
}

export type WeatherLayerType = "none" | "radar" | "clouds" | "wind";

export interface FlightFilterState {
  categories: AircraftCategory[];
  minAlt: number;
  maxAlt: number;
  minSpeed: number;
  maxSpeed: number;
  squawkOnly: boolean;
  searchQuery: string;
}
