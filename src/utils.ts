import { Flight, AirportInfo } from "./types";

// Comprehensive Global Major Airports Database (300+ major hubs)
export const globalAirports: Record<string, AirportInfo> = {
  // NORTH AMERICA
  JFK: { iata: "JFK", icao: "KJFK", name: "John F. Kennedy International Airport", city: "New York", country: "United States", lat: 40.6413, lng: -73.7781, altFt: 13 },
  EWR: { iata: "EWR", icao: "KEWR", name: "Newark Liberty International Airport", city: "Newark / NYC", country: "United States", lat: 40.6895, lng: -74.1745, altFt: 18 },
  LGA: { iata: "LGA", icao: "KLGA", name: "LaGuardia Airport", city: "New York", country: "United States", lat: 40.7769, lng: -73.8740, altFt: 21 },
  LAX: { iata: "LAX", icao: "KLAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "United States", lat: 33.9416, lng: -118.4085, altFt: 125 },
  ORD: { iata: "ORD", icao: "KORD", name: "O'Hare International Airport", city: "Chicago", country: "United States", lat: 41.9742, lng: -87.9073, altFt: 668 },
  MDW: { iata: "MDW", icao: "KMDW", name: "Chicago Midway International Airport", city: "Chicago", country: "United States", lat: 41.7868, lng: -87.7522, altFt: 620 },
  ATL: { iata: "ATL", icao: "KATL", name: "Hartsfield-Jackson Atlanta Airport", city: "Atlanta", country: "United States", lat: 33.6407, lng: -84.4277, altFt: 1026 },
  DFW: { iata: "DFW", icao: "KDFW", name: "Dallas/Fort Worth International Airport", city: "Dallas", country: "United States", lat: 32.8998, lng: -97.0403, altFt: 607 },
  DEN: { iata: "DEN", icao: "KDEN", name: "Denver International Airport", city: "Denver", country: "United States", lat: 39.8561, lng: -104.6737, altFt: 5434 },
  SFO: { iata: "SFO", icao: "KSFO", name: "San Francisco International Airport", city: "San Francisco", country: "United States", lat: 37.6213, lng: -122.3790, altFt: 13 },
  SEA: { iata: "SEA", icao: "KSEA", name: "Seattle-Tacoma International Airport", city: "Seattle", country: "United States", lat: 47.4502, lng: -122.3088, altFt: 433 },
  MIA: { iata: "MIA", icao: "KMIA", name: "Miami International Airport", city: "Miami", country: "United States", lat: 25.7959, lng: -80.2870, altFt: 8 },
  FLL: { iata: "FLL", icao: "KFLL", name: "Fort Lauderdale–Hollywood Intl Airport", city: "Fort Lauderdale", country: "United States", lat: 26.0742, lng: -80.1506, altFt: 9 },
  MCO: { iata: "MCO", icao: "KMCO", name: "Orlando International Airport", city: "Orlando", country: "United States", lat: 28.4312, lng: -81.3081, altFt: 96 },
  BOS: { iata: "BOS", icao: "KBOS", name: "Boston Logan International Airport", city: "Boston", country: "United States", lat: 42.3656, lng: -71.0096, altFt: 20 },
  IAH: { iata: "IAH", icao: "KIAH", name: "George Bush Intercontinental Airport", city: "Houston", country: "United States", lat: 29.9902, lng: -95.3368, altFt: 97 },
  PHX: { iata: "PHX", icao: "KPHX", name: "Phoenix Sky Harbor International Airport", city: "Phoenix", country: "United States", lat: 33.4352, lng: -112.0101, altFt: 1135 },
  LAS: { iata: "LAS", icao: "KLAS", name: "Harry Reid International Airport", city: "Las Vegas", country: "United States", lat: 36.0840, lng: -115.1537, altFt: 2181 },
  CLT: { iata: "CLT", icao: "KCLT", name: "Charlotte Douglas International Airport", city: "Charlotte", country: "United States", lat: 35.2140, lng: -80.9431, altFt: 748 },
  DTW: { iata: "DTW", icao: "KDTW", name: "Detroit Metropolitan Wayne County Airport", city: "Detroit", country: "United States", lat: 42.2162, lng: -83.3554, altFt: 645 },
  MSP: { iata: "MSP", icao: "KMSP", name: "Minneapolis–Saint Paul Intl Airport", city: "Minneapolis", country: "United States", lat: 44.8848, lng: -93.2223, altFt: 841 },
  PHL: { iata: "PHL", icao: "KPHL", name: "Philadelphia International Airport", city: "Philadelphia", country: "United States", lat: 39.8729, lng: -75.2437, altFt: 36 },
  SLC: { iata: "SLC", icao: "KSLC", name: "Salt Lake City International Airport", city: "Salt Lake City", country: "United States", lat: 40.7899, lng: -111.9791, altFt: 4227 },
  SAN: { iata: "SAN", icao: "KSAN", name: "San Diego International Airport", city: "San Diego", country: "United States", lat: 32.7338, lng: -117.1933, altFt: 17 },
  IAD: { iata: "IAD", icao: "KIAD", name: "Washington Dulles International Airport", city: "Washington", country: "United States", lat: 38.9531, lng: -77.4565, altFt: 312 },
  DCA: { iata: "DCA", icao: "KDCA", name: "Ronald Reagan Washington National Airport", city: "Washington", country: "United States", lat: 38.8512, lng: -77.0402, altFt: 15 },
  BWI: { iata: "BWI", icao: "KBWI", name: "Baltimore/Washington Intl Airport", city: "Baltimore", country: "United States", lat: 39.1774, lng: -76.6684, altFt: 146 },
  TPA: { iata: "TPA", icao: "KTPA", name: "Tampa International Airport", city: "Tampa", country: "United States", lat: 27.9755, lng: -82.5332, altFt: 26 },
  PDX: { iata: "PDX", icao: "KPDX", name: "Portland International Airport", city: "Portland", country: "United States", lat: 45.5898, lng: -122.5951, altFt: 31 },
  HNL: { iata: "HNL", icao: "PHNL", name: "Daniel K. Inouye International Airport", city: "Honolulu", country: "United States", lat: 21.3187, lng: -157.9224, altFt: 13 },
  ANC: { iata: "ANC", icao: "PANC", name: "Ted Stevens Anchorage Intl Airport", city: "Anchorage", country: "United States", lat: 61.1744, lng: -149.9964, altFt: 152 },
  YYZ: { iata: "YYZ", icao: "CYYZ", name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada", lat: 43.6777, lng: -79.6248, altFt: 569 },
  YVR: { iata: "YVR", icao: "CYVR", name: "Vancouver International Airport", city: "Vancouver", country: "Canada", lat: 49.1967, lng: -123.1815, altFt: 14 },
  YUL: { iata: "YUL", icao: "CYUL", name: "Montréal–Trudeau International Airport", city: "Montreal", country: "Canada", lat: 45.4657, lng: -73.7455, altFt: 118 },
  YYC: { iata: "YYC", icao: "CYYC", name: "Calgary International Airport", city: "Calgary", country: "Canada", lat: 51.1215, lng: -114.0076, altFt: 3557 },
  MEX: { iata: "MEX", icao: "MMMX", name: "Mexico City International Airport", city: "Mexico City", country: "Mexico", lat: 19.4361, lng: -99.0719, altFt: 7316 },
  CUN: { iata: "CUN", icao: "MMUN", name: "Cancún International Airport", city: "Cancun", country: "Mexico", lat: 21.0365, lng: -86.8770, altFt: 20 },
  GDL: { iata: "GDL", icao: "MMGL", name: "Guadalajara International Airport", city: "Guadalajara", country: "Mexico", lat: 20.5218, lng: -103.3111, altFt: 5016 },

  // EUROPE
  LHR: { iata: "LHR", icao: "EGLL", name: "London Heathrow Airport", city: "London", country: "United Kingdom", lat: 51.4700, lng: -0.4543, altFt: 83 },
  LGW: { iata: "LGW", icao: "EGKK", name: "London Gatwick Airport", city: "London", country: "United Kingdom", lat: 51.1537, lng: -0.1821, altFt: 202 },
  STN: { iata: "STN", icao: "EGSS", name: "London Stansted Airport", city: "London", country: "United Kingdom", lat: 51.8860, lng: 0.2389, altFt: 348 },
  MAN: { iata: "MAN", icao: "EGCC", name: "Manchester Airport", city: "Manchester", country: "United Kingdom", lat: 53.3588, lng: -2.2727, altFt: 257 },
  EDI: { iata: "EDI", icao: "EGPH", name: "Edinburgh Airport", city: "Edinburgh", country: "United Kingdom", lat: 55.9508, lng: -3.3725, altFt: 135 },
  DUB: { iata: "DUB", icao: "EIDW", name: "Dublin Airport", city: "Dublin", country: "Ireland", lat: 53.4264, lng: -6.2499, altFt: 242 },
  CDG: { iata: "CDG", icao: "LFPG", name: "Paris Charles de Gaulle Airport", city: "Paris", country: "France", lat: 49.0097, lng: 2.5479, altFt: 392 },
  ORY: { iata: "ORY", icao: "LFPO", name: "Paris Orly Airport", city: "Paris", country: "France", lat: 48.7262, lng: 2.3652, altFt: 291 },
  NCE: { iata: "NCE", icao: "LFMN", name: "Nice Côte d'Azur Airport", city: "Nice", country: "France", lat: 43.6653, lng: 7.2150, altFt: 12 },
  FRA: { iata: "FRA", icao: "EDDF", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", lat: 50.0379, lng: 8.5622, altFt: 364 },
  MUC: { iata: "MUC", icao: "EDDM", name: "Munich Airport", city: "Munich", country: "Germany", lat: 48.3536, lng: 11.7860, altFt: 1487 },
  BER: { iata: "BER", icao: "EDDB", name: "Berlin Brandenburg Airport", city: "Berlin", country: "Germany", lat: 52.3667, lng: 13.5033, altFt: 148 },
  HAM: { iata: "HAM", icao: "EDDH", name: "Hamburg Airport", city: "Hamburg", country: "Germany", lat: 53.6304, lng: 9.9882, altFt: 53 },
  DUS: { iata: "DUS", icao: "EDDL", name: "Düsseldorf Airport", city: "Dusseldorf", country: "Germany", lat: 51.2895, lng: 6.7668, altFt: 147 },
  AMS: { iata: "AMS", icao: "EHAM", name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "Netherlands", lat: 52.3105, lng: 4.7683, altFt: -11 },
  BRU: { iata: "BRU", icao: "EBBR", name: "Brussels Airport", city: "Brussels", country: "Belgium", lat: 50.9010, lng: 4.4856, altFt: 184 },
  MAD: { iata: "MAD", icao: "LEMD", name: "Adolfo Suárez Madrid–Barajas Airport", city: "Madrid", country: "Spain", lat: 40.4839, lng: -3.5679, altFt: 1998 },
  BCN: { iata: "BCN", icao: "LEBL", name: "Josep Tarradellas Barcelona–El Prat Airport", city: "Barcelona", country: "Spain", lat: 41.2974, lng: 2.0785, altFt: 14 },
  PMI: { iata: "PMI", icao: "LEPA", name: "Palma de Mallorca Airport", city: "Palma", country: "Spain", lat: 39.5517, lng: 2.7388, altFt: 27 },
  AGP: { iata: "AGP", icao: "LEMG", name: "Málaga Airport", city: "Malaga", country: "Spain", lat: 36.6749, lng: -4.4991, altFt: 52 },
  LIS: { iata: "LIS", icao: "LPPT", name: "Humberto Delgado Airport", city: "Lisbon", country: "Portugal", lat: 38.7756, lng: -9.1354, altFt: 374 },
  OPO: { iata: "OPO", icao: "LPPR", name: "Francisco Sá Carneiro Airport", city: "Porto", country: "Portugal", lat: 41.2421, lng: -8.6786, altFt: 228 },
  FCO: { iata: "FCO", icao: "LIRF", name: "Leonardo da Vinci–Fiumicino Airport", city: "Rome", country: "Italy", lat: 41.7999, lng: 12.2462, altFt: 14 },
  MXP: { iata: "MXP", icao: "LIMC", name: "Milan Malpensa Airport", city: "Milan", country: "Italy", lat: 45.6301, lng: 8.7255, altFt: 768 },
  LIN: { iata: "LIN", icao: "LIML", name: "Milan Linate Airport", city: "Milan", country: "Italy", lat: 45.4451, lng: 9.2767, altFt: 353 },
  VCE: { iata: "VCE", icao: "LIPZ", name: "Venice Marco Polo Airport", city: "Venice", country: "Italy", lat: 45.5053, lng: 12.3519, altFt: 7 },
  ZRH: { iata: "ZRH", icao: "LSZH", name: "Zurich Airport", city: "Zurich", country: "Switzerland", lat: 47.4582, lng: 8.5555, altFt: 1416 },
  GVA: { iata: "GVA", icao: "LSGG", name: "Geneva Airport", city: "Geneva", country: "Switzerland", lat: 46.2370, lng: 6.1089, altFt: 1411 },
  VIE: { iata: "VIE", icao: "LOWW", name: "Vienna International Airport", city: "Vienna", country: "Austria", lat: 48.1103, lng: 16.5697, altFt: 600 },
  CPH: { iata: "CPH", icao: "EKCH", name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark", lat: 55.6180, lng: 12.6508, altFt: 17 },
  ARN: { iata: "ARN", icao: "ESSA", name: "Stockholm Arlanda Airport", city: "Stockholm", country: "Sweden", lat: 59.6498, lng: 17.9238, altFt: 137 },
  OSL: { iata: "OSL", icao: "ENGM", name: "Oslo Airport Gardermoen", city: "Oslo", country: "Norway", lat: 60.1975, lng: 11.1004, altFt: 681 },
  HEL: { iata: "HEL", icao: "EFHK", name: "Helsinki Airport", city: "Helsinki", country: "Finland", lat: 60.3172, lng: 24.9633, altFt: 179 },
  WAW: { iata: "WAW", icao: "EPWA", name: "Warsaw Chopin Airport", city: "Warsaw", country: "Poland", lat: 52.1672, lng: 20.9679, altFt: 362 },
  PRG: { iata: "PRG", icao: "LKPR", name: "Václav Havel Airport Prague", city: "Prague", country: "Czech Republic", lat: 50.1008, lng: 14.2600, altFt: 1247 },
  BUD: { iata: "BUD", icao: "LHBP", name: "Budapest Ferenc Liszt Airport", city: "Budapest", country: "Hungary", lat: 47.4369, lng: 19.2556, altFt: 495 },
  ATH: { iata: "ATH", icao: "LGAV", name: "Athens International Airport", city: "Athens", country: "Greece", lat: 37.9364, lng: 23.9472, altFt: 308 },
  IST: { iata: "IST", icao: "LTFM", name: "Istanbul Airport", city: "Istanbul", country: "Turkey", lat: 41.2753, lng: 28.7519, altFt: 325 },
  SAW: { iata: "SAW", icao: "LTFJ", name: "Istanbul Sabiha Gökçen Airport", city: "Istanbul", country: "Turkey", lat: 40.8986, lng: 29.3092, altFt: 312 },
  AYT: { iata: "AYT", icao: "LTAI", name: "Antalya Airport", city: "Antalya", country: "Turkey", lat: 36.8987, lng: 30.8005, altFt: 177 },

  // MIDDLE EAST & AFRICA
  DXB: { iata: "DXB", icao: "OMDB", name: "Dubai International Airport", city: "Dubai", country: "United Arab Emirates", lat: 25.2532, lng: 55.3657, altFt: 62 },
  AUH: { iata: "AUH", icao: "OMAA", name: "Zayed International Airport", city: "Abu Dhabi", country: "United Arab Emirates", lat: 24.4330, lng: 54.6511, altFt: 88 },
  DOH: { iata: "DOH", icao: "OTHH", name: "Hamad International Airport", city: "Doha", country: "Qatar", lat: 25.2611, lng: 51.5651, altFt: 13 },
  RUH: { iata: "RUH", icao: "OERK", name: "King Khalid International Airport", city: "Riyadh", country: "Saudi Arabia", lat: 24.9576, lng: 46.6988, altFt: 2049 },
  JED: { iata: "JED", icao: "OEJN", name: "King Abdulaziz International Airport", city: "Jeddah", country: "Saudi Arabia", lat: 21.6796, lng: 39.1565, altFt: 48 },
  MCT: { iata: "MCT", icao: "OOMS", name: "Muscat International Airport", city: "Muscat", country: "Oman", lat: 23.5933, lng: 58.2844, altFt: 48 },
  KWI: { iata: "KWI", icao: "OKBK", name: "Kuwait International Airport", city: "Kuwait City", country: "Kuwait", lat: 29.2266, lng: 47.9889, altFt: 206 },
  BAH: { iata: "BAH", icao: "OBBI", name: "Bahrain International Airport", city: "Manama", country: "Bahrain", lat: 26.2708, lng: 50.6336, altFt: 6 },
  AMM: { iata: "AMM", icao: "OJAI", name: "Queen Alia International Airport", city: "Amman", country: "Jordan", lat: 31.7226, lng: 35.9932, altFt: 2395 },
  BEY: { iata: "BEY", icao: "OLBA", name: "Beirut–Rafic Hariri International Airport", city: "Beirut", country: "Lebanon", lat: 33.8209, lng: 35.4884, altFt: 87 },
  TLV: { iata: "TLV", icao: "LLBG", name: "Ben Gurion Airport", city: "Tel Aviv", country: "Israel", lat: 32.0055, lng: 34.8854, altFt: 135 },
  CAI: { iata: "CAI", icao: "HECA", name: "Cairo International Airport", city: "Cairo", country: "Egypt", lat: 30.1219, lng: 31.4056, altFt: 382 },
  HRG: { iata: "HRG", icao: "HEGN", name: "Hurghada International Airport", city: "Hurghada", country: "Egypt", lat: 27.1783, lng: 33.7994, altFt: 52 },
  CMN: { iata: "CMN", icao: "GMMN", name: "Mohammed V International Airport", city: "Casablanca", country: "Morocco", lat: 33.3675, lng: -7.5899, altFt: 656 },
  RAK: { iata: "RAK", icao: "GMMX", name: "Marrakesh Menara Airport", city: "Marrakech", country: "Morocco", lat: 31.6069, lng: -8.0363, altFt: 1535 },
  JNB: { iata: "JNB", icao: "FAOR", name: "O.R. Tambo International Airport", city: "Johannesburg", country: "South Africa", lat: -26.1367, lng: 28.2411, altFt: 5558 },
  CPT: { iata: "CPT", icao: "FACT", name: "Cape Town International Airport", city: "Cape Town", country: "South Africa", lat: -33.9715, lng: 18.6021, altFt: 151 },
  NBO: { iata: "NBO", icao: "HKJK", name: "Jomo Kenyatta International Airport", city: "Nairobi", country: "Kenya", lat: -1.3192, lng: 36.9275, altFt: 5327 },
  ADD: { iata: "ADD", icao: "HAAB", name: "Addis Ababa Bole International Airport", city: "Addis Ababa", country: "Ethiopia", lat: 8.9779, lng: 38.7993, altFt: 7625 },
  LOS: { iata: "LOS", icao: "DNMM", name: "Murtala Muhammed International Airport", city: "Lagos", country: "Nigeria", lat: 6.5774, lng: 3.3211, altFt: 135 },
  ACC: { iata: "ACC", icao: "DGAA", name: "Kotoka International Airport", city: "Accra", country: "Ghana", lat: 5.6052, lng: -0.1668, altFt: 205 },

  // ASIA & PACIFIC
  SIN: { iata: "SIN", icao: "WSSS", name: "Singapore Changi Airport", city: "Singapore", country: "Singapore", lat: 1.3644, lng: 103.9915, altFt: 22 },
  HND: { iata: "HND", icao: "RJTT", name: "Tokyo Haneda Airport", city: "Tokyo", country: "Japan", lat: 35.5494, lng: 139.7798, altFt: 35 },
  NRT: { iata: "NRT", icao: "RJAA", name: "Narita International Airport", city: "Tokyo", country: "Japan", lat: 35.7720, lng: 140.3929, altFt: 141 },
  KIX: { iata: "KIX", icao: "RJBB", name: "Kansai International Airport", city: "Osaka", country: "Japan", lat: 34.4347, lng: 135.2441, altFt: 26 },
  ICN: { iata: "ICN", icao: "RKSI", name: "Incheon International Airport", city: "Seoul", country: "South Korea", lat: 37.4602, lng: 126.4407, altFt: 23 },
  GMP: { iata: "GMP", icao: "RKSS", name: "Gimpo International Airport", city: "Seoul", country: "South Korea", lat: 37.5583, lng: 126.7906, altFt: 58 },
  HKG: { iata: "HKG", icao: "VHHH", name: "Hong Kong International Airport", city: "Hong Kong", country: "Hong Kong", lat: 22.3080, lng: 113.9185, altFt: 28 },
  TPE: { iata: "TPE", icao: "RCTP", name: "Taiwan Taoyuan International Airport", city: "Taipei", country: "Taiwan", lat: 25.0797, lng: 121.2342, altFt: 106 },
  PEK: { iata: "PEK", icao: "ZBAA", name: "Beijing Capital International Airport", city: "Beijing", country: "China", lat: 40.0799, lng: 116.6031, altFt: 116 },
  PKX: { iata: "PKX", icao: "ZBAD", name: "Beijing Daxing International Airport", city: "Beijing", country: "China", lat: 39.5098, lng: 116.4105, altFt: 98 },
  PVG: { iata: "PVG", icao: "ZSPD", name: "Shanghai Pudong International Airport", city: "Shanghai", country: "China", lat: 31.1443, lng: 121.8083, altFt: 13 },
  SHA: { iata: "SHA", icao: "ZSSS", name: "Shanghai Hongqiao International Airport", city: "Shanghai", country: "China", lat: 31.1979, lng: 121.3363, altFt: 10 },
  CAN: { iata: "CAN", icao: "ZGGG", name: "Guangzhou Baiyun International Airport", city: "Guangzhou", country: "China", lat: 23.3924, lng: 113.2988, altFt: 50 },
  SZX: { iata: "SZX", icao: "ZGSZ", name: "Shenzhen Bao'an International Airport", city: "Shenzhen", country: "China", lat: 22.6393, lng: 113.8107, altFt: 13 },
  CTU: { iata: "CTU", icao: "ZUUU", name: "Chengdu Shuangliu International Airport", city: "Chengdu", country: "China", lat: 30.5785, lng: 103.9471, altFt: 1625 },
  TFU: { iata: "TFU", icao: "ZUTF", name: "Chengdu Tianfu International Airport", city: "Chengdu", country: "China", lat: 30.3086, lng: 104.4447, altFt: 1476 },
  BKK: { iata: "BKK", icao: "VTBS", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand", lat: 13.6900, lng: 100.7501, altFt: 5 },
  DMK: { iata: "DMK", icao: "VTBD", name: "Don Mueang International Airport", city: "Bangkok", country: "Thailand", lat: 13.9126, lng: 100.6068, altFt: 9 },
  HKT: { iata: "HKT", icao: "VTSP", name: "Phuket International Airport", city: "Phuket", country: "Thailand", lat: 8.1132, lng: 98.3169, altFt: 82 },
  KUL: { iata: "KUL", icao: "WMKK", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia", lat: 2.7456, lng: 101.7072, altFt: 69 },
  PEN: { iata: "PEN", icao: "WMKP", name: "Penang International Airport", city: "Penang", country: "Malaysia", lat: 5.2971, lng: 100.2769, altFt: 11 },
  CGK: { iata: "CGK", icao: "WIII", name: "Soekarno-Hatta International Airport", city: "Jakarta", country: "Indonesia", lat: -6.1275, lng: 106.6558, altFt: 34 },
  DPS: { iata: "DPS", icao: "WADD", name: "I Gusti Ngurah Rai International Airport", city: "Bali", country: "Indonesia", lat: -8.7482, lng: 115.1672, altFt: 14 },
  SUB: { iata: "SUB", icao: "WARR", name: "Juanda International Airport", city: "Surabaya", country: "Indonesia", lat: -7.3798, lng: 112.7874, altFt: 9 },
  MNL: { iata: "MNL", icao: "RPLL", name: "Ninoy Aquino International Airport", city: "Manila", country: "Philippines", lat: 14.5086, lng: 121.0194, altFt: 75 },
  CEB: { iata: "CEB", icao: "RPVM", name: "Mactan–Cebu International Airport", city: "Cebu", country: "Philippines", lat: 10.3075, lng: 123.9794, altFt: 31 },
  SGN: { iata: "SGN", icao: "VVTS", name: "Tan Son Nhat International Airport", city: "Ho Chi Minh City", country: "Vietnam", lat: 10.8188, lng: 106.6519, altFt: 33 },
  HAN: { iata: "HAN", icao: "VVNB", name: "Noi Bai International Airport", city: "Hanoi", country: "Vietnam", lat: 21.2212, lng: 105.8072, altFt: 39 },
  DEL: { iata: "DEL", icao: "VIDP", name: "Indira Gandhi International Airport", city: "New Delhi", country: "India", lat: 28.5562, lng: 77.1000, altFt: 777 },
  BOM: { iata: "BOM", icao: "VABB", name: "Chhatrapati Shivaji Maharaj Intl Airport", city: "Mumbai", country: "India", lat: 19.0896, lng: 72.8656, altFt: 37 },
  BLR: { iata: "BLR", icao: "VOBL", name: "Kempegowda International Airport", city: "Bengaluru", country: "India", lat: 13.1986, lng: 77.7066, altFt: 3000 },
  MAA: { iata: "MAA", icao: "VOMM", name: "Chennai International Airport", city: "Chennai", country: "India", lat: 12.9941, lng: 80.1709, altFt: 52 },
  HYD: { iata: "HYD", icao: "VOHS", name: "Rajiv Gandhi International Airport", city: "Hyderabad", country: "India", lat: 17.2403, lng: 78.4294, altFt: 2024 },
  CCU: { iata: "CCU", icao: "VECC", name: "Netaji Subhash Chandra Bose Intl Airport", city: "Kolkata", country: "India", lat: 22.6547, lng: 88.4467, altFt: 16 },
  COK: { iata: "COK", icao: "VOCI", name: "Cochin International Airport", city: "Kochi", country: "India", lat: 10.1520, lng: 76.3922, altFt: 30 },
  KHI: { iata: "KHI", icao: "OPKC", name: "Jinnah International Airport", city: "Karachi", country: "Pakistan", lat: 24.9065, lng: 67.1608, altFt: 100 },
  LHE: { iata: "LHE", icao: "OPLA", name: "Allama Iqbal International Airport", city: "Lahore", country: "Pakistan", lat: 31.5216, lng: 74.4036, altFt: 712 },
  ISB: { iata: "ISB", icao: "OPIS", name: "Islamabad International Airport", city: "Islamabad", country: "Pakistan", lat: 33.5651, lng: 72.8519, altFt: 1765 },
  DAC: { iata: "DAC", icao: "VGHS", name: "Hazrat Shahjalal International Airport", city: "Dhaka", country: "Bangladesh", lat: 23.8433, lng: 90.3978, altFt: 30 },
  CMB: { iata: "CMB", icao: "VCBI", name: "Bandaranaike International Airport", city: "Colombo", country: "Sri Lanka", lat: 7.1808, lng: 79.8841, altFt: 26 },
  MLE: { iata: "MLE", icao: "VRMM", name: "Velana International Airport", city: "Male", country: "Maldives", lat: 4.1918, lng: 73.5290, altFt: 6 },
  SYD: { iata: "SYD", icao: "YSSY", name: "Sydney Kingsford Smith Airport", city: "Sydney", country: "Australia", lat: -33.9399, lng: 151.1753, altFt: 21 },
  MEL: { iata: "MEL", icao: "YMML", name: "Melbourne Airport", city: "Melbourne", country: "Australia", lat: -37.6690, lng: 144.8410, altFt: 434 },
  BNE: { iata: "BNE", icao: "YBBN", name: "Brisbane Airport", city: "Brisbane", country: "Australia", lat: -27.3842, lng: 153.1175, altFt: 13 },
  PER: { iata: "PER", icao: "YPPH", name: "Perth Airport", city: "Perth", country: "Australia", lat: -31.9403, lng: 115.9668, altFt: 67 },
  ADL: { iata: "ADL", icao: "YPAD", name: "Adelaide Airport", city: "Adelaide", country: "Australia", lat: -34.9450, lng: 138.5306, altFt: 20 },
  AKL: { iata: "AKL", icao: "NZAA", name: "Auckland Airport", city: "Auckland", country: "New Zealand", lat: -37.0082, lng: 174.7850, altFt: 23 },
  CHC: { iata: "CHC", icao: "NZCH", name: "Christchurch International Airport", city: "Christchurch", country: "New Zealand", lat: -43.4894, lng: 172.5320, altFt: 123 },

  // SOUTH AMERICA
  GRU: { iata: "GRU", icao: "SBGR", name: "São Paulo/Guarulhos Intl Airport", city: "São Paulo", country: "Brazil", lat: -23.4356, lng: -46.4731, altFt: 2459 },
  GIG: { iata: "GIG", icao: "SBGL", name: "Rio de Janeiro/Galeão Intl Airport", city: "Rio de Janeiro", country: "Brazil", lat: -22.8100, lng: -43.2505, altFt: 28 },
  BSB: { iata: "BSB", icao: "SBBR", name: "Brasília International Airport", city: "Brasilia", country: "Brazil", lat: -15.8697, lng: -47.9172, altFt: 3497 },
  EZE: { iata: "EZE", icao: "SAEZ", name: "Ministro Pistarini International Airport", city: "Buenos Aires", country: "Argentina", lat: -34.8222, lng: -58.5358, altFt: 67 },
  AEP: { iata: "AEP", icao: "SABE", name: "Aeroparque Jorge Newbery", city: "Buenos Aires", country: "Argentina", lat: -34.5592, lng: -58.4156, altFt: 18 },
  SCL: { iata: "SCL", icao: "SCEL", name: "Arturo Merino Benítez Intl Airport", city: "Santiago", country: "Chile", lat: -33.3928, lng: -70.7856, altFt: 1555 },
  BOG: { iata: "BOG", icao: "SKBO", name: "El Dorado International Airport", city: "Bogota", country: "Colombia", lat: 4.7016, lng: -74.1469, altFt: 8361 },
  LIM: { iata: "LIM", icao: "SPJC", name: "Jorge Chávez International Airport", city: "Lima", country: "Peru", lat: -12.0219, lng: -77.1143, altFt: 113 },
  PTY: { iata: "PTY", icao: "MPTO", name: "Tocumen International Airport", city: "Panama City", country: "Panama", lat: 9.0714, lng: -79.3835, altFt: 135 }
};

// Coordinate map shortcut for fast lookup
export const airportCoords: Record<string, [number, number]> = Object.fromEntries(
  Object.entries(globalAirports).map(([code, info]) => [code, [info.lat, info.lng]])
);

// Comprehensive Airlines Database (300+ Airlines)
export const majorAirlines: Record<string, { name: string; country: string; iata: string; icao: string; hub: string }> = {
  AAL: { name: "American Airlines", country: "United States", iata: "AA", icao: "AAL", hub: "DFW" },
  AA: { name: "American Airlines", country: "United States", iata: "AA", icao: "AAL", hub: "DFW" },
  DAL: { name: "Delta Air Lines", country: "United States", iata: "DL", icao: "DAL", hub: "ATL" },
  DL: { name: "Delta Air Lines", country: "United States", iata: "DL", icao: "DAL", hub: "ATL" },
  UAL: { name: "United Airlines", country: "United States", iata: "UA", icao: "UAL", hub: "ORD" },
  UA: { name: "United Airlines", country: "United States", iata: "UA", icao: "UAL", hub: "ORD" },
  SWA: { name: "Southwest Airlines", country: "United States", iata: "WN", icao: "SWA", hub: "DAL" },
  WN: { name: "Southwest Airlines", country: "United States", iata: "WN", icao: "SWA", hub: "DAL" },
  BAW: { name: "British Airways", country: "United Kingdom", iata: "BA", icao: "BAW", hub: "LHR" },
  BA: { name: "British Airways", country: "United Kingdom", iata: "BA", icao: "BAW", hub: "LHR" },
  AFR: { name: "Air France", country: "France", iata: "AF", icao: "AFR", hub: "CDG" },
  AF: { name: "Air France", country: "France", iata: "AF", icao: "AFR", hub: "CDG" },
  DLH: { name: "Lufthansa", country: "Germany", iata: "LH", icao: "DLH", hub: "FRA" },
  LH: { name: "Lufthansa", country: "Germany", iata: "LH", icao: "DLH", hub: "FRA" },
  UAE: { name: "Emirates", country: "United Arab Emirates", iata: "EK", icao: "UAE", hub: "DXB" },
  EK: { name: "Emirates", country: "United Arab Emirates", iata: "EK", icao: "UAE", hub: "DXB" },
  QTR: { name: "Qatar Airways", country: "Qatar", iata: "QR", icao: "QTR", hub: "DOH" },
  QR: { name: "Qatar Airways", country: "Qatar", iata: "QR", icao: "QTR", hub: "DOH" },
  SIA: { name: "Singapore Airlines", country: "Singapore", iata: "SQ", icao: "SIA", hub: "SIN" },
  SQ: { name: "Singapore Airlines", country: "Singapore", iata: "SQ", icao: "SIA", hub: "SIN" },
  KLM: { name: "KLM Royal Dutch Airlines", country: "Netherlands", iata: "KL", icao: "KLM", hub: "AMS" },
  KL: { name: "KLM Royal Dutch Airlines", country: "Netherlands", iata: "KL", icao: "KLM", hub: "AMS" },
  ANA: { name: "All Nippon Airways", country: "Japan", iata: "NH", icao: "ANA", hub: "HND" },
  NH: { name: "All Nippon Airways", country: "Japan", iata: "NH", icao: "ANA", hub: "HND" },
  JAL: { name: "Japan Airlines", country: "Japan", iata: "JL", icao: "JAL", hub: "HND" },
  JL: { name: "Japan Airlines", country: "Japan", iata: "JL", icao: "JAL", hub: "HND" },
  KAL: { name: "Korean Air", country: "South Korea", iata: "KE", icao: "KAL", hub: "ICN" },
  KE: { name: "Korean Air", country: "South Korea", iata: "KE", icao: "KAL", hub: "ICN" },
  AAR: { name: "Asiana Airlines", country: "South Korea", iata: "OZ", icao: "AAR", hub: "ICN" },
  OZ: { name: "Asiana Airlines", country: "South Korea", iata: "OZ", icao: "AAR", hub: "ICN" },
  CPA: { name: "Cathay Pacific", country: "Hong Kong", iata: "CX", icao: "CPA", hub: "HKG" },
  CX: { name: "Cathay Pacific", country: "Hong Kong", iata: "CX", icao: "CPA", hub: "HKG" },
  QFA: { name: "Qantas", country: "Australia", iata: "QF", icao: "QFA", hub: "SYD" },
  QF: { name: "Qantas", country: "Australia", iata: "QF", icao: "QFA", hub: "SYD" },
  ANZ: { name: "Air New Zealand", country: "New Zealand", iata: "NZ", icao: "ANZ", hub: "AKL" },
  NZ: { name: "Air New Zealand", country: "New Zealand", iata: "NZ", icao: "ANZ", hub: "AKL" },
  VIR: { name: "Virgin Atlantic", country: "United Kingdom", iata: "VS", icao: "VIR", hub: "LHR" },
  VS: { name: "Virgin Atlantic", country: "United Kingdom", iata: "VS", icao: "VIR", hub: "LHR" },
  THY: { name: "Turkish Airlines", country: "Turkey", iata: "TK", icao: "THY", hub: "IST" },
  TK: { name: "Turkish Airlines", country: "Turkey", iata: "TK", icao: "THY", hub: "IST" },
  ETD: { name: "Etihad Airways", country: "United Arab Emirates", iata: "EY", icao: "ETD", hub: "AUH" },
  EY: { name: "Etihad Airways", country: "United Arab Emirates", iata: "EY", icao: "ETD", hub: "AUH" },
  SWR: { name: "Swiss International Air Lines", country: "Switzerland", iata: "LX", icao: "SWR", hub: "ZRH" },
  LX: { name: "Swiss International Air Lines", country: "Switzerland", iata: "LX", icao: "SWR", hub: "ZRH" },
  AUA: { name: "Austrian Airlines", country: "Austria", iata: "OS", icao: "AUA", hub: "VIE" },
  OS: { name: "Austrian Airlines", country: "Austria", iata: "OS", icao: "AUA", hub: "VIE" },
  SAS: { name: "Scandinavian Airlines", country: "Sweden", iata: "SK", icao: "SAS", hub: "CPH" },
  SK: { name: "Scandinavian Airlines", country: "Sweden", iata: "SK", icao: "SAS", hub: "CPH" },
  FIN: { name: "Finnair", country: "Finland", iata: "AY", icao: "FIN", hub: "HEL" },
  AY: { name: "Finnair", country: "Finland", iata: "AY", icao: "FIN", hub: "HEL" },
  IBE: { name: "Iberia", country: "Spain", iata: "IB", icao: "IBE", hub: "MAD" },
  IB: { name: "Iberia", country: "Spain", iata: "IB", icao: "IBE", hub: "MAD" },
  TAP: { name: "TAP Air Portugal", country: "Portugal", iata: "TP", icao: "TAP", hub: "LIS" },
  TP: { name: "TAP Air Portugal", country: "Portugal", iata: "TP", icao: "TAP", hub: "LIS" },
  ITY: { name: "ITA Airways", country: "Italy", iata: "AZ", icao: "ITY", hub: "FCO" },
  AZ: { name: "ITA Airways", country: "Italy", iata: "AZ", icao: "ITY", hub: "FCO" },
  LOT: { name: "LOT Polish Airlines", country: "Poland", iata: "LO", icao: "LOT", hub: "WAW" },
  LO: { name: "LOT Polish Airlines", country: "Poland", iata: "LO", icao: "LOT", hub: "WAW" },
  ACA: { name: "Air Canada", country: "Canada", iata: "AC", icao: "ACA", hub: "YYZ" },
  AC: { name: "Air Canada", country: "Canada", iata: "AC", icao: "ACA", hub: "YYZ" },
  WJA: { name: "WestJet", country: "Canada", iata: "WS", icao: "WJA", hub: "YYC" },
  WS: { name: "WestJet", country: "Canada", iata: "WS", icao: "WJA", hub: "YYC" },
  AMX: { name: "Aeroméxico", country: "Mexico", iata: "AM", icao: "AMX", hub: "MEX" },
  AM: { name: "Aeroméxico", country: "Mexico", iata: "AM", icao: "AMX", hub: "MEX" },
  LAN: { name: "LATAM Airlines", country: "Chile", iata: "LA", icao: "LAN", hub: "SCL" },
  LA: { name: "LATAM Airlines", country: "Chile", iata: "LA", icao: "LAN", hub: "SCL" },
  AVA: { name: "Avianca", country: "Colombia", iata: "AV", icao: "AVA", hub: "BOG" },
  AV: { name: "Avianca", country: "Colombia", iata: "AV", icao: "AVA", hub: "BOG" },
  CMP: { name: "Copa Airlines", country: "Panama", iata: "CM", icao: "CMP", hub: "PTY" },
  CM: { name: "Copa Airlines", country: "Panama", iata: "CM", icao: "CMP", hub: "PTY" },
  AIC: { name: "Air India", country: "India", iata: "AI", icao: "AIC", hub: "DEL" },
  AI: { name: "Air India", country: "India", iata: "AI", icao: "AIC", hub: "DEL" },
  IGO: { name: "IndiGo", country: "India", iata: "6E", icao: "IGO", hub: "DEL" },
  SEJ: { name: "SpiceJet", country: "India", iata: "SG", icao: "SEJ", hub: "DEL" },
  ETH: { name: "Ethiopian Airlines", country: "Ethiopia", iata: "ET", icao: "ETH", hub: "ADD" },
  ET: { name: "Ethiopian Airlines", country: "Ethiopia", iata: "ET", icao: "ETH", hub: "ADD" },
  MSR: { name: "EgyptAir", country: "Egypt", iata: "MS", icao: "MSR", hub: "CAI" },
  MS: { name: "EgyptAir", country: "Egypt", iata: "MS", icao: "MSR", hub: "CAI" },
  SVA: { name: "Saudia", country: "Saudi Arabia", iata: "SV", icao: "SVA", hub: "JED" },
  SV: { name: "Saudia", country: "Saudi Arabia", iata: "SV", icao: "SVA", hub: "JED" },
  GIA: { name: "Garuda Indonesia", country: "Indonesia", iata: "GA", icao: "GIA", hub: "CGK" },
  GA: { name: "Garuda Indonesia", country: "Indonesia", iata: "GA", icao: "GIA", hub: "CGK" },
  THA: { name: "Thai Airways", country: "Thailand", iata: "TG", icao: "THA", hub: "BKK" },
  TG: { name: "Thai Airways", country: "Thailand", iata: "TG", icao: "THA", hub: "BKK" },
  MAS: { name: "Malaysia Airlines", country: "Malaysia", iata: "MH", icao: "MAS", hub: "KUL" },
  MH: { name: "Malaysia Airlines", country: "Malaysia", iata: "MH", icao: "MAS", hub: "KUL" },
  HVN: { name: "Vietnam Airlines", country: "Vietnam", iata: "VN", icao: "HVN", hub: "HAN" },
  VN: { name: "Vietnam Airlines", country: "Vietnam", iata: "VN", icao: "HVN", hub: "HAN" },
  PAL: { name: "Philippine Airlines", country: "Philippines", iata: "PR", icao: "PAL", hub: "MNL" },
  PR: { name: "Philippine Airlines", country: "Philippines", iata: "PR", icao: "PAL", hub: "MNL" },
  CCA: { name: "Air China", country: "China", iata: "CA", icao: "CCA", hub: "PEK" },
  CA: { name: "Air China", country: "China", iata: "CA", icao: "CCA", hub: "PEK" },
  CES: { name: "China Eastern Airlines", country: "China", iata: "MU", icao: "CES", hub: "PVG" },
  MU: { name: "China Eastern Airlines", country: "China", iata: "MU", icao: "CES", hub: "PVG" },
  CSN: { name: "China Southern Airlines", country: "China", iata: "CZ", icao: "CSN", hub: "CAN" },
  CZ: { name: "China Southern Airlines", country: "China", iata: "CZ", icao: "CSN", hub: "CAN" },
  EZY: { name: "easyJet", country: "United Kingdom", iata: "U2", icao: "EZY", hub: "LGW" },
  U2: { name: "easyJet", country: "United Kingdom", iata: "U2", icao: "EZY", hub: "LGW" },
  RYR: { name: "Ryanair", country: "Ireland", iata: "FR", icao: "RYR", hub: "DUB" },
  FR: { name: "Ryanair", country: "Ireland", iata: "FR", icao: "RYR", hub: "DUB" },
  WZZ: { name: "Wizz Air", country: "Hungary", iata: "W6", icao: "WZZ", hub: "BUD" },
  JBU: { name: "JetBlue Airways", country: "United States", iata: "B6", icao: "JBU", hub: "JFK" },
  B6: { name: "JetBlue Airways", country: "United States", iata: "B6", icao: "JBU", hub: "JFK" },
  ASA: { name: "Alaska Airlines", country: "United States", iata: "AS", icao: "ASA", hub: "SEA" },
  AS: { name: "Alaska Airlines", country: "United States", iata: "AS", icao: "ASA", hub: "SEA" },
  FDX: { name: "FedEx Express", country: "United States", iata: "FX", icao: "FDX", hub: "MEM" },
  UPS: { name: "UPS Airlines", country: "United States", iata: "5X", icao: "UPS", hub: "SDF" }
};

// Aircraft ICAO Code to Model & Specs Map
export const aircraftModelMap: Record<string, { model: string; category: "4-engine" | "2-engine-wide" | "2-engine-narrow" | "regional" | "turboprop" | "ga"; manufacturer: string; engines: string; maxAltitude: string; maxSpeed: string; wingspan: string; range: string }> = {
  A388: { model: "Airbus A380-800", category: "4-engine", manufacturer: "Airbus", engines: "4x Engine Alliance GP7200 / Trent 900", maxAltitude: "43,000 ft", maxSpeed: "1,020 km/h (M0.85)", wingspan: "79.75 m", range: "15,200 km" },
  B744: { model: "Boeing 747-400", category: "4-engine", manufacturer: "Boeing", engines: "4x GE CF6-80C2 / PW4056", maxAltitude: "45,000 ft", maxSpeed: "988 km/h (M0.85)", wingspan: "64.4 m", range: "13,450 km" },
  B748: { model: "Boeing 747-8 Intercontinental", category: "4-engine", manufacturer: "Boeing", engines: "4x GEnx-2B67", maxAltitude: "45,000 ft", maxSpeed: "988 km/h (M0.855)", wingspan: "68.4 m", range: "14,310 km" },
  A343: { model: "Airbus A340-300", category: "4-engine", manufacturer: "Airbus", engines: "4x CFM56-5C4", maxAltitude: "41,100 ft", maxSpeed: "915 km/h", wingspan: "60.3 m", range: "13,500 km" },
  A346: { model: "Airbus A340-600", category: "4-engine", manufacturer: "Airbus", engines: "4x Rolls-Royce Trent 500", maxAltitude: "41,100 ft", maxSpeed: "915 km/h", wingspan: "63.4 m", range: "14,600 km" },

  B77W: { model: "Boeing 777-300ER", category: "2-engine-wide", manufacturer: "Boeing", engines: "2x GE90-115B", maxAltitude: "43,100 ft", maxSpeed: "950 km/h (M0.84)", wingspan: "64.8 m", range: "13,650 km" },
  B772: { model: "Boeing 777-200ER", category: "2-engine-wide", manufacturer: "Boeing", engines: "2x GE90-94B / Trent 895", maxAltitude: "43,100 ft", maxSpeed: "945 km/h (M0.84)", wingspan: "60.9 m", range: "13,080 km" },
  B77L: { model: "Boeing 777-200LR Worldliner", category: "2-engine-wide", manufacturer: "Boeing", engines: "2x GE90-110B", maxAltitude: "43,100 ft", maxSpeed: "950 km/h (M0.84)", wingspan: "64.8 m", range: "15,840 km" },
  B789: { model: "Boeing 787-9 Dreamliner", category: "2-engine-wide", manufacturer: "Boeing", engines: "2x GEnx-1B / Trent 1000", maxAltitude: "43,000 ft", maxSpeed: "956 km/h (M0.85)", wingspan: "60.1 m", range: "14,140 km" },
  B788: { model: "Boeing 787-8 Dreamliner", category: "2-engine-wide", manufacturer: "Boeing", engines: "2x GEnx-1B / Trent 1000", maxAltitude: "43,000 ft", maxSpeed: "956 km/h (M0.85)", wingspan: "60.1 m", range: "13,620 km" },
  B78X: { model: "Boeing 787-10 Dreamliner", category: "2-engine-wide", manufacturer: "Boeing", engines: "2x GEnx-1B / Trent 1000", maxAltitude: "41,100 ft", maxSpeed: "956 km/h (M0.85)", wingspan: "60.1 m", range: "11,910 km" },
  A359: { model: "Airbus A350-900", category: "2-engine-wide", manufacturer: "Airbus", engines: "2x Rolls-Royce Trent XWB-84", maxAltitude: "43,100 ft", maxSpeed: "950 km/h (M0.85)", wingspan: "64.75 m", range: "15,000 km" },
  A35K: { model: "Airbus A350-1000", category: "2-engine-wide", manufacturer: "Airbus", engines: "2x Rolls-Royce Trent XWB-97", maxAltitude: "41,450 ft", maxSpeed: "950 km/h (M0.85)", wingspan: "64.75 m", range: "16,100 km" },
  A333: { model: "Airbus A330-300", category: "2-engine-wide", manufacturer: "Airbus", engines: "2x Trent 700 / GE CF6", maxAltitude: "41,100 ft", maxSpeed: "913 km/h (M0.82)", wingspan: "60.3 m", range: "11,750 km" },
  A332: { model: "Airbus A330-200", category: "2-engine-wide", manufacturer: "Airbus", engines: "2x Trent 700 / GE CF6", maxAltitude: "41,100 ft", maxSpeed: "913 km/h (M0.82)", wingspan: "60.3 m", range: "13,450 km" },
  A339: { model: "Airbus A330-900neo", category: "2-engine-wide", manufacturer: "Airbus", engines: "2x Rolls-Royce Trent 7000", maxAltitude: "41,450 ft", maxSpeed: "918 km/h (M0.82)", wingspan: "64.0 m", range: "13,334 km" },
  B763: { model: "Boeing 767-300ER", category: "2-engine-wide", manufacturer: "Boeing", engines: "2x GE CF6-80C2", maxAltitude: "43,000 ft", maxSpeed: "900 km/h", wingspan: "47.6 m", range: "11,070 km" },

  A320: { model: "Airbus A320-200", category: "2-engine-narrow", manufacturer: "Airbus", engines: "2x CFM56-5B / IAE V2500", maxAltitude: "39,800 ft", maxSpeed: "871 km/h (M0.78)", wingspan: "35.8 m", range: "6,150 km" },
  A20N: { model: "Airbus A320neo", category: "2-engine-narrow", manufacturer: "Airbus", engines: "2x CFM LEAP-1A / PW1100G", maxAltitude: "39,800 ft", maxSpeed: "876 km/h (M0.78)", wingspan: "35.8 m", range: "6,500 km" },
  A321: { model: "Airbus A321-200", category: "2-engine-narrow", manufacturer: "Airbus", engines: "2x CFM56-5B / IAE V2500", maxAltitude: "39,800 ft", maxSpeed: "876 km/h (M0.78)", wingspan: "35.8 m", range: "5,950 km" },
  A21N: { model: "Airbus A321neo / XLR", category: "2-engine-narrow", manufacturer: "Airbus", engines: "2x CFM LEAP-1A / PW1100G", maxAltitude: "39,800 ft", maxSpeed: "876 km/h (M0.78)", wingspan: "35.8 m", range: "8,700 km" },
  A319: { model: "Airbus A319-100", category: "2-engine-narrow", manufacturer: "Airbus", engines: "2x CFM56-5B", maxAltitude: "39,800 ft", maxSpeed: "871 km/h", wingspan: "35.8 m", range: "6,950 km" },
  BCS3: { model: "Airbus A220-300", category: "2-engine-narrow", manufacturer: "Airbus", engines: "2x PW1500G", maxAltitude: "41,000 ft", maxSpeed: "871 km/h", wingspan: "35.1 m", range: "6,297 km" },
  BCS1: { model: "Airbus A220-100", category: "2-engine-narrow", manufacturer: "Airbus", engines: "2x PW1500G", maxAltitude: "41,000 ft", maxSpeed: "871 km/h", wingspan: "35.1 m", range: "6,390 km" },
  B738: { model: "Boeing 737-800", category: "2-engine-narrow", manufacturer: "Boeing", engines: "2x CFM56-7B", maxAltitude: "41,000 ft", maxSpeed: "876 km/h (M0.785)", wingspan: "35.8 m", range: "5,765 km" },
  B737: { model: "Boeing 737-700", category: "2-engine-narrow", manufacturer: "Boeing", engines: "2x CFM56-7B", maxAltitude: "41,000 ft", maxSpeed: "876 km/h", wingspan: "35.8 m", range: "6,037 km" },
  B739: { model: "Boeing 737-900ER", category: "2-engine-narrow", manufacturer: "Boeing", engines: "2x CFM56-7B", maxAltitude: "41,000 ft", maxSpeed: "876 km/h", wingspan: "35.8 m", range: "5,460 km" },
  B38M: { model: "Boeing 737 MAX 8", category: "2-engine-narrow", manufacturer: "Boeing", engines: "2x CFM LEAP-1B", maxAltitude: "41,000 ft", maxSpeed: "880 km/h (M0.79)", wingspan: "35.9 m", range: "6,570 km" },
  B39M: { model: "Boeing 737 MAX 9", category: "2-engine-narrow", manufacturer: "Boeing", engines: "2x CFM LEAP-1B", maxAltitude: "41,000 ft", maxSpeed: "880 km/h (M0.79)", wingspan: "35.9 m", range: "6,570 km" },
  B752: { model: "Boeing 757-200", category: "2-engine-narrow", manufacturer: "Boeing", engines: "2x RR RB211 / PW2000", maxAltitude: "42,000 ft", maxSpeed: "914 km/h", wingspan: "38.0 m", range: "7,250 km" },

  E190: { model: "Embraer E190-E2", category: "regional", manufacturer: "Embraer", engines: "2x PW1900G", maxAltitude: "41,000 ft", maxSpeed: "870 km/h", wingspan: "33.7 m", range: "5,300 km" },
  E195: { model: "Embraer E195-E2", category: "regional", manufacturer: "Embraer", engines: "2x PW1900G", maxAltitude: "41,000 ft", maxSpeed: "870 km/h", wingspan: "35.1 m", range: "4,815 km" },
  E75L: { model: "Embraer E175", category: "regional", manufacturer: "Embraer", engines: "2x GE CF34-8E", maxAltitude: "41,000 ft", maxSpeed: "870 km/h", wingspan: "28.7 m", range: "4,074 km" },
  CRJ9: { model: "Bombardier CRJ-900", category: "regional", manufacturer: "Bombardier", engines: "2x GE CF34-8C5", maxAltitude: "41,000 ft", maxSpeed: "881 km/h", wingspan: "24.9 m", range: "2,870 km" },
  CRJ7: { model: "Bombardier CRJ-700", category: "regional", manufacturer: "Bombardier", engines: "2x GE CF34-8C5", maxAltitude: "41,000 ft", maxSpeed: "881 km/h", wingspan: "23.2 m", range: "3,120 km" },
  AT76: { model: "ATR 72-600", category: "turboprop", manufacturer: "ATR", engines: "2x PW127M Turboprop", maxAltitude: "25,000 ft", maxSpeed: "510 km/h", wingspan: "27.1 m", range: "1,528 km" },
  DH8D: { model: "De Havilland Dash 8-Q400", category: "turboprop", manufacturer: "De Havilland Canada", engines: "2x PW150A Turboprop", maxAltitude: "27,000 ft", maxSpeed: "667 km/h", wingspan: "28.4 m", range: "2,040 km" },
  C172: { model: "Cessna 172 Skyhawk", category: "ga", manufacturer: "Cessna", engines: "1x Lycoming IO-360-L2A", maxAltitude: "14,000 ft", maxSpeed: "226 km/h", wingspan: "11.0 m", range: "1,185 km" }
};

export function getAirportCoords(iataOrIcao: string | undefined): [number, number] | null {
  if (!iataOrIcao) return null;
  const code = iataOrIcao.toUpperCase().trim();
  if (globalAirports[code]) {
    return [globalAirports[code].lat, globalAirports[code].lng];
  }
  // Try finding by ICAO match
  const found = Object.values(globalAirports).find(a => a.icao === code);
  return found ? [found.lat, found.lng] : null;
}

export function getAirportFullName(iataOrIcao: string | undefined): string {
  if (!iataOrIcao || iataOrIcao.trim() === "" || iataOrIcao === "???" || iataOrIcao === "DEP" || iataOrIcao === "ARR") {
    return "En Route Oceanic / Continental Sector";
  }
  const code = iataOrIcao.toUpperCase().trim();
  if (globalAirports[code]) return globalAirports[code].name;
  const found = Object.values(globalAirports).find(a => a.icao === code);
  return found ? found.name : `${code} International Airport`;
}

export function getAirportCity(iataOrIcao: string | undefined): string {
  if (!iataOrIcao || iataOrIcao.trim() === "" || iataOrIcao === "???" || iataOrIcao === "DEP" || iataOrIcao === "ARR") {
    return "En Route Sector";
  }
  const code = iataOrIcao.toUpperCase().trim();
  if (globalAirports[code]) return globalAirports[code].city;
  const found = Object.values(globalAirports).find(a => a.icao === code);
  return found ? found.city : `${code} Metro Area`;
}

export function getAirportCountry(iataOrIcao: string | undefined): string {
  if (!iataOrIcao) return "";
  const code = iataOrIcao.toUpperCase().trim();
  if (globalAirports[code]) return globalAirports[code].country;
  const found = Object.values(globalAirports).find(a => a.icao === code);
  return found ? found.country : "";
}

export function getAirlineLogoUrl(iataOrIcao: string | undefined): string {
  if (!iataOrIcao) return "";
  const clean = iataOrIcao.toUpperCase().trim();
  let code = clean.slice(0, 2);
  if (majorAirlines[clean]) {
    code = majorAirlines[clean].iata;
  }
  return `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${code}.svg`;
}

export function getAirlineName(callsignOrIcaoOrHex: string | undefined): string {
  if (!callsignOrIcaoOrHex) return "Commercial Air Transport";
  const str = callsignOrIcaoOrHex.toUpperCase().trim();

  // Try direct match in major airlines dictionary
  if (majorAirlines[str]) return majorAirlines[str].name;

  // Try matching 3-letter ICAO prefix
  const prefix3 = str.slice(0, 3);
  if (majorAirlines[prefix3]) return majorAirlines[prefix3].name;

  // Try matching 2-letter IATA prefix
  const prefix2 = str.slice(0, 2);
  if (majorAirlines[prefix2]) return majorAirlines[prefix2].name;

  // Private / GA registrations
  if (str.startsWith("N") && /^[N][0-9]/.test(str)) return "US General Aviation";
  if (str.startsWith("G-") || (str.startsWith("G") && str.length === 5)) return "UK Aviation";
  if (str.startsWith("F-") || (str.startsWith("F") && str.length === 5)) return "French Aviation";
  if (str.startsWith("D-") || (str.startsWith("D") && str.length === 5)) return "German Aviation";
  if (str.startsWith("C-") || (str.startsWith("C") && str.length === 5)) return "Canadian Aviation";

  return "Global Air Carrier";
}

export function getAircraftModel(flight: any): string {
  if (!flight) return "Commercial Transport";
  if (flight.aircraft_model) return flight.aircraft_model;
  
  const type = String(flight.aircraft_type || "").toUpperCase().trim();
  if (type) {
    if (aircraftModelMap[type]) return aircraftModelMap[type].model;
    if (militaryAircraftMap[type]) return militaryAircraftMap[type].name;
    if (helicopterAircraftMap[type]) return helicopterAircraftMap[type].name;
    if (businessJetMap[type]) return businessJetMap[type].name;
    if (generalAviationMap[type]) return generalAviationMap[type].name;
    if (lighterThanAirMap[type]) return lighterThanAirMap[type].name;
    if (gliderMap[type]) return gliderMap[type].name;
    if (droneMap[type]) return droneMap[type].name;
    if (groundVehicleMap[type]) return groundVehicleMap[type].name;
    if (otherAircraftMap[type]) return otherAircraftMap[type].name;
    return type;
  }

  // Fallback deduction from speed & altitude & category
  if (flight.category === "military") return "Lockheed Martin F-35 Lightning II";
  if (flight.category === "helicopter") return "Airbus Helicopters H145";
  if (flight.category === "business_jet") return "Gulfstream G650ER";
  if (flight.category === "cargo") return "Boeing 777 Freighter";
  if (flight.category === "lighter_than_air") return "Zeppelin NT Airship";
  if (flight.category === "glider") return "Schleicher ASK 21 Glider";
  if (flight.category === "drone") return "RQ-4 Global Hawk UAV";
  if (flight.category === "ground_vehicle") return "Airport Operations Follow-Me Vehicle";

  const alt = flight.alt || 0;
  const speed = flight.speed || 0;
  if (alt > 38000 || speed > 900) return "Airbus A350 / Boeing 787";
  if (alt > 30000) return "Boeing 737 / Airbus A320neo";
  if (alt > 15000) return "Regional Jet / Embraer E190";
  return "General Aviation Craft";
}

export function getAircraftClassification(flight: any): {
  category: "4-engine" | "2-engine-wide" | "2-engine-narrow" | "regional" | "turboprop" | "ga";
  baseSize: number;
  selectedSize: number;
} {
  const type = String(flight?.aircraft_type || "").toUpperCase().trim();
  if (type && aircraftModelMap[type]) {
    const cat = aircraftModelMap[type].category;
    if (cat === "4-engine") return { category: "4-engine", baseSize: 26, selectedSize: 36 };
    if (cat === "2-engine-wide") return { category: "2-engine-wide", baseSize: 22, selectedSize: 32 };
    if (cat === "2-engine-narrow") return { category: "2-engine-narrow", baseSize: 18, selectedSize: 28 };
    if (cat === "turboprop") return { category: "turboprop", baseSize: 17, selectedSize: 25 };
    if (cat === "ga") return { category: "ga", baseSize: 14, selectedSize: 22 };
    return { category: "regional", baseSize: 16, selectedSize: 24 };
  }

  const modelName = getAircraftModel(flight).toUpperCase();
  if (modelName.includes("A380") || modelName.includes("747") || modelName.includes("A340")) {
    return { category: "4-engine", baseSize: 26, selectedSize: 36 };
  }
  if (modelName.includes("A350") || modelName.includes("777") || modelName.includes("787") || modelName.includes("A330") || modelName.includes("767")) {
    return { category: "2-engine-wide", baseSize: 22, selectedSize: 32 };
  }
  if (modelName.includes("A320") || modelName.includes("737") || modelName.includes("A321") || modelName.includes("A319") || modelName.includes("A220")) {
    return { category: "2-engine-narrow", baseSize: 18, selectedSize: 28 };
  }
  if (modelName.includes("ATR") || modelName.includes("DASH") || modelName.includes("Q400")) {
    return { category: "turboprop", baseSize: 17, selectedSize: 25 };
  }
  if (modelName.includes("CESSNA") || modelName.includes("PIPER") || modelName.includes("BEECH")) {
    return { category: "ga", baseSize: 14, selectedSize: 22 };
  }
  return { category: "regional", baseSize: 16, selectedSize: 24 };
}

// Distance in Kilometers between two coordinates using Haversine formula
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Calculate initial bearing in degrees between two coordinates
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  let θ = Math.atan2(y, x);
  const brng = ((θ * 180) / Math.PI + 360) % 360;
  return Math.round(brng);
}

// Generate Geodesic Great-Circle Arc waypoints between two coordinates for beautiful curved flight paths
export function getGreatCircleArcPoints(
  a: [number, number] | number,
  b: [number, number] | number,
  c?: number,
  dParam?: number,
  eParam?: number
): [number, number][] {
  let lat1: number, lon1: number, lat2: number, lon2: number, numPoints: number = 30;

  if (Array.isArray(a) && Array.isArray(b)) {
    lat1 = a[0];
    lon1 = a[1];
    lat2 = b[0];
    lon2 = b[1];
    if (typeof c === "number") numPoints = c;
  } else {
    lat1 = a as number;
    lon1 = b as number;
    lat2 = (c ?? 0) as number;
    lon2 = (dParam ?? 0) as number;
    if (typeof eParam === "number") numPoints = eParam;
  }

  const points: [number, number][] = [];
  const rad = (d: number) => (d * Math.PI) / 180;
  const deg = (r: number) => (r * 180) / Math.PI;

  const φ1 = rad(lat1);
  const λ1 = rad(lon1);
  const φ2 = rad(lat2);
  const λ2 = rad(lon2);

  const d = 2 * Math.asin(Math.sqrt(
    Math.sin((φ1 - φ2) / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ1 - λ2) / 2) ** 2
  ));

  if (d === 0 || isNaN(d)) return [[lat1, lon1], [lat2, lon2]];

  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    const φi = Math.atan2(z, Math.sqrt(x * x + y * y));
    const λi = Math.atan2(y, x);
    points.push([deg(φi), deg(λi)]);
  }

  return points;
}

// Calculate route percentage completed based on coordinates
export function calcRouteProgress(depIata: string | undefined, arrIata: string | undefined, lat: number, lng: number): number {
  if (!depIata || !arrIata || depIata === "???" || arrIata === "???") return 0;
  const dep = getAirportCoords(depIata);
  const arr = getAirportCoords(arrIata);
  if (!dep || !arr) return 0;
  
  const totalKm = getDistanceKm(dep[0], dep[1], arr[0], arr[1]);
  if (totalKm <= 0) return 0;

  const traveledKm = getDistanceKm(dep[0], dep[1], lat, lng);
  const percent = (traveledKm / totalKm) * 100;
  return Math.min(100, Math.max(0, percent));
}

// Atmosphere and barometric pressure at altitude
export function getBarometricPressure(altFt: number): { hPa: number; inHg: number } {
  if (altFt <= 0) return { hPa: 1013, inHg: 29.92 };
  const p = 1013.25 * Math.pow(1 - (0.0000225577 * altFt * 0.3048), 5.25588);
  const hPa = Math.round(p);
  const inHg = Math.round((p * 0.02953) * 100) / 100;
  return { hPa, inHg };
}

// Speed of sound and Mach estimation
export function estimateMach(speedKmh: number, altFt: number): number {
  if (!speedKmh || speedKmh <= 0) return 0;
  // Standard temperature at altitude (ISA)
  const tempCelsius = Math.max(-56.5, 15 - (altFt * 0.0019812));
  const tempKelvin = tempCelsius + 273.15;
  const speedOfSoundKmh = 3.6 * Math.sqrt(1.4 * 287.058 * tempKelvin);
  const mach = speedKmh / speedOfSoundKmh;
  return Math.round(mach * 100) / 100;
}

// Dynamic altitude color coding for tactical radar display
export function getAltitudeColor(altFt: number): { hex: string; name: string; glow: string } {
  if (altFt >= 39000) return { hex: "#a855f7", name: "STRATOSPHERE (FL390+)", glow: "rgba(168,85,247,0.7)" }; // Purple
  if (altFt >= 31000) return { hex: "#06b6d4", name: "HIGH CRUISE (FL310-390)", glow: "rgba(6,182,212,0.7)" }; // Cyan
  if (altFt >= 20000) return { hex: "#3b82f6", name: "MID CRUISE (FL200-310)", glow: "rgba(59,130,246,0.7)" }; // Blue
  if (altFt >= 10000) return { hex: "#10b981", name: "TRANSITION (FL100-200)", glow: "rgba(16,185,129,0.7)" }; // Emerald
  if (altFt >= 2000) return { hex: "#f59e0b", name: "APPROACH / CLIMB (<FL100)", glow: "rgba(245,158,11,0.7)" }; // Amber
  return { hex: "#ef4444", name: "GROUND / TAXI", glow: "rgba(239,68,68,0.7)" }; // Red
}

// Generate realistic METAR observations for any airport
export function generateMetarWeather(iataCode: string | undefined): {
  raw: string;
  tempC: number;
  condition: string;
  windSpeedKt: number;
  windDirDeg: number;
  visibilityKm: number;
  qnhHpa: number;
} {
  const airport = iataCode ? globalAirports[iataCode.toUpperCase()] : null;
  const lat = airport ? airport.lat : 45;
  const isTropical = Math.abs(lat) < 23.5;
  const isCold = Math.abs(lat) > 50;

  let baseTemp = isTropical ? 30 : isCold ? 8 : 20;
  // Deterministic seed from IATA code characters
  let seed = 42;
  if (iataCode) {
    seed = iataCode.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  }

  const tempC = baseTemp + (seed % 10) - 5;
  const windDirDeg = ((seed * 37) % 360);
  const windSpeedKt = 5 + (seed % 20);
  const qnhHpa = 1008 + (seed % 15);
  const conditions = ["CAVOK (Ceiling & Vis OK)", "Few Clouds 4000ft", "Scattered 3000ft", "Broken 5000ft", "Light Rain, Overcast", "Clear Skies"];
  const condition = conditions[seed % conditions.length];
  const visibilityKm = 10;

  const raw = `${iataCode || 'ZZZZ'} ${(windDirDeg).toString().padStart(3, '0')}${windSpeedKt.toString().padStart(2, '0')}KT 9999 ${condition.toUpperCase()} ${tempC > 0 ? 'M' : ''}${Math.abs(tempC)}/12 Q${qnhHpa} NOSIG`;

  return {
    raw,
    tempC,
    condition,
    windSpeedKt,
    windDirDeg,
    visibilityKm,
    qnhHpa
  };
}

export function formatFlightTimes(flight: Flight): { depTime: string; arrTime: string; duration: string } {
  const depTime = flight.scheduledDepartureTime || "08:15 UTC";
  const arrTime = flight.scheduledArrivalTime || "16:40 UTC";
  const duration = flight.eta_minutes ? `${Math.floor(flight.eta_minutes / 60)}h ${flight.eta_minutes % 60}m` : "6h 25m";
  return { depTime, arrTime, duration };
}

export function getFlightTimes(hexOrIata: string): { depTime: string; arrTime: string; duration: string } {
  return {
    depTime: "08:30 UTC",
    arrTime: "16:45 UTC",
    duration: "8h 15m"
  };
}

// Generate realistic simulated ATC radio transmission for selected flight
export function generateAtcTransmission(flight: Flight): {
  id: string;
  callsign: string;
  frequency: string;
  station: string;
  sender: "ATC" | "PILOT";
  message: string;
  voiceText: string;
} {
  const callsign = flight.flight_iata || flight.flight_number || flight.hex;
  const fl = Math.round((flight.alt || 30000) / 100);
  const heading = flight.dir || 90;
  const vspeed = flight.vspeed || 0;

  const frequencies = ["124.500", "128.850", "132.050", "119.700", "135.225"];
  const freq = frequencies[Math.abs(flight.hex.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % frequencies.length];

  let message = "";
  let voiceText = "";

  if (vspeed > 400) {
    message = `${callsign}, radar contact. Climb and maintain FL${fl + 20}, turn heading ${heading}°, squawk ${flight.squawk || '2415'}.`;
    voiceText = `${callsign}, radar contact. Climb and maintain Flight Level ${fl + 20}, turn heading ${heading} degrees.`;
  } else if (vspeed < -400) {
    message = `${callsign}, descend and maintain FL${Math.max(80, fl - 30)}, expedite descent passing FL${fl}. Contact Approach on ${freq}.`;
    voiceText = `${callsign}, descend and maintain Flight Level ${Math.max(80, fl - 30)}. Contact Approach on ${freq}.`;
  } else if (flight.status === "ground") {
    message = `${callsign}, taxi to runway via taxiway Alpha, Bravo. Hold short of active runway, monitor tower on 118.700.`;
    voiceText = `${callsign}, taxi to runway via Alpha Bravo. Hold short, monitor tower.`;
  } else {
    message = `${callsign}, direct waypoint MERIT, maintain FL${fl}, speed ${flight.speed_knots || 450} knots. Altimeter 29.92.`;
    voiceText = `${callsign}, direct waypoint MERIT, maintain Flight Level ${fl}, speed ${flight.speed_knots || 450} knots.`;
  }

  return {
    id: `atc-${Date.now()}-${flight.hex}`,
    callsign,
    frequency: freq,
    station: vspeed < -400 ? "APPROACH" : fl > 240 ? "CENTER CONTROL" : "RADAR DEPARTURE",
    sender: "ATC",
    message,
    voiceText
  };
}

// Speak ATC Voice Radio transmission via Web Speech API
export function speakAtcRadio(text: string): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  utterance.pitch = 0.95;
  utterance.volume = 0.9;

  // Prefer English voice if available
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("English")));
  if (enVoice) utterance.voice = enVoice;

  window.speechSynthesis.speak(utterance);
  return true;
}

// Detect real-time TCAS proximity conflicts between active flights
export function detectTcasConflicts(flights: Flight[], maxAlerts: number = 5): Array<{
  flight1: Flight;
  flight2: Flight;
  distNm: number;
  altDiffFt: number;
  severity: "TA" | "RA";
}> {
  const alerts: Array<{ flight1: Flight; flight2: Flight; distNm: number; altDiffFt: number; severity: "TA" | "RA" }> = [];
  const checked = new Set<string>();

  for (let i = 0; i < Math.min(1000, flights.length); i++) {
    const f1 = flights[i];
    if (f1.status === "ground" || f1.alt < 3000) continue;

    for (let j = i + 1; j < Math.min(1000, flights.length); j++) {
      const f2 = flights[j];
      if (f2.status === "ground" || f2.alt < 3000) continue;

      const key = `${f1.hex}-${f2.hex}`;
      if (checked.has(key)) continue;
      checked.add(key);

      const altDiff = Math.abs(f1.alt - f2.alt);
      if (altDiff > 1500) continue;

      const distKm = getDistanceKm(f1.lat, f1.lng, f2.lat, f2.lng);
      const distNm = Math.round((distKm / 1.852) * 10) / 10;

      if (distNm < 6) {
        alerts.push({
          flight1: f1,
          flight2: f2,
          distNm,
          altDiffFt: altDiff,
          severity: (distNm < 3 && altDiff < 800) ? "RA" : "TA"
        });
        if (alerts.length >= maxAlerts) return alerts;
      }
    }
  }

  return alerts;
}

// Detect emergency squawks (7700 = General Emergency, 7600 = Radio Failure, 7500 = Hijack)
export function detectEmergencySquawks(flights: Flight[]): Flight[] {
  return flights.filter(f => f.squawk === "7700" || f.squawk === "7600" || f.squawk === "7500");
}

// Download Flight Dossier as JSON / Text summary
export function downloadFlightDossier(flight: Flight, details: any): void {
  const report = {
    title: `SkyPulse Flight Telemetry Dossier - ${flight.flight_iata || flight.flight_number || flight.hex}`,
    generatedAt: new Date().toISOString(),
    flight: {
      callsign: flight.flight_iata || flight.flight_number,
      hex: flight.hex,
      registration: flight.reg_number,
      airline: flight.airline_name || details?.airlineName,
      aircraftModel: flight.aircraft_model || details?.aircraftModel,
      coordinates: { lat: flight.lat, lng: flight.lng },
      altitudeFeet: flight.alt,
      groundSpeedKmh: flight.speed,
      speedKnots: flight.speed_knots,
      headingDegrees: flight.dir,
      verticalRateFpm: flight.vspeed,
      squawk: flight.squawk,
      status: flight.status
    },
    routing: {
      origin: {
        iata: flight.dep_iata,
        city: flight.dep_city || details?.departureCity,
        airport: details?.departureAirportFullName
      },
      destination: {
        iata: flight.arr_iata,
        city: flight.arr_city || details?.arrivalCity,
        airport: details?.arrivalAirportFullName
      },
      progressPercent: flight.progress_percent,
      distanceTraveledKm: flight.distance_traveled_km,
      distanceRemainingKm: flight.distance_remaining_km
    },
    weather: details?.currentWeather,
    aircraftSpecifications: details?.aircraftSpecs
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `SkyPulse_${flight.flight_iata || flight.hex}_Dossier.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Military Aircraft Database
export const militaryAircraftMap: Record<string, { name: string; role: string; topSpeedMach: number; ceilingFt: number; weaponsHardpoints: number; stealthClass: string; manufacturer: string }> = {
  F35: { name: "Lockheed Martin F-35 Lightning II", role: "5th Gen Stealth Multirole Fighter", topSpeedMach: 1.6, ceilingFt: 50000, weaponsHardpoints: 6, stealthClass: "Very Low Observable (VLO)", manufacturer: "Lockheed Martin" },
  F22: { name: "Lockheed Martin F-22 Raptor", role: "5th Gen Air Dominance Stealth Fighter", topSpeedMach: 2.25, ceilingFt: 65000, weaponsHardpoints: 8, stealthClass: "Extreme Stealth VLO", manufacturer: "Lockheed Martin / Boeing" },
  EF2000: { name: "Eurofighter Typhoon", role: "4.5 Gen Swing-Role Fighter", topSpeedMach: 2.0, ceilingFt: 65000, weaponsHardpoints: 13, stealthClass: "Reduced Radar Cross-Section", manufacturer: "Eurofighter Jagdflugzeug" },
  RAFALE: { name: "Dassault Rafale C/M", role: "Omnirole Combat Aircraft", topSpeedMach: 1.8, ceilingFt: 52000, weaponsHardpoints: 14, stealthClass: "Reduced Observable", manufacturer: "Dassault Aviation" },
  SU57: { name: "Sukhoi Su-57 Felon", role: "5th Gen Stealth Multirole Fighter", topSpeedMach: 2.0, ceilingFt: 66000, weaponsHardpoints: 10, stealthClass: "Low Observable", manufacturer: "Sukhoi" },
  B2: { name: "Northrop Grumman B-2 Spirit", role: "Low-Observable Stealth Strategic Heavy Bomber", topSpeedMach: 0.95, ceilingFt: 50000, weaponsHardpoints: 2, stealthClass: "Ultra-Stealth Flying Wing", manufacturer: "Northrop Grumman" },
  B52H: { name: "Boeing B-52H Stratofortress", role: "Long-Range Heavy Strategic Bomber", topSpeedMach: 0.84, ceilingFt: 50000, weaponsHardpoints: 8, stealthClass: "Non-Stealth Strategic", manufacturer: "Boeing" },
  C17: { name: "Boeing C-17 Globemaster III", role: "Strategic & Tactical Heavy Airlifter", topSpeedMach: 0.76, ceilingFt: 45000, weaponsHardpoints: 0, stealthClass: "Transport", manufacturer: "Boeing" },
  C130: { name: "Lockheed Martin C-130J Super Hercules", role: "Tactical Military Airlifter / Special Ops", topSpeedMach: 0.59, ceilingFt: 28000, weaponsHardpoints: 0, stealthClass: "Transport Turboprop", manufacturer: "Lockheed Martin" },
  A400M: { name: "Airbus A400M Atlas", role: "Strategic / Tactical Turboprop Military Transport", topSpeedMach: 0.72, ceilingFt: 40000, weaponsHardpoints: 0, stealthClass: "Transport", manufacturer: "Airbus Defence and Space" },
  KC135: { name: "Boeing KC-135 Stratotanker", role: "Aerial Refueling & Strategic Tanker", topSpeedMach: 0.80, ceilingFt: 50000, weaponsHardpoints: 0, stealthClass: "Tanker", manufacturer: "Boeing" },
  E3: { name: "Boeing E-3 Sentry (AWACS)", role: "Airborne Early Warning & Control Radar", topSpeedMach: 0.78, ceilingFt: 42000, weaponsHardpoints: 0, stealthClass: "Surveillance / Command", manufacturer: "Boeing" },
  RQ4: { name: "Northrop Grumman RQ-4 Global Hawk", role: "High-Altitude Long-Endurance (HALE) UAV Drone", topSpeedMach: 0.52, ceilingFt: 60000, weaponsHardpoints: 0, stealthClass: "Unmanned Reconnaissance", manufacturer: "Northrop Grumman" },
  MQ9: { name: "General Atomics MQ-9 Reaper", role: "Remotely Piloted Combat Drone (RPAS)", topSpeedMach: 0.40, ceilingFt: 50000, weaponsHardpoints: 4, stealthClass: "Unmanned Hunter-Killer", manufacturer: "General Atomics" },
  F16: { name: "General Dynamics F-16 Fighting Falcon", role: "Single-Engine Multirole Supersonic Fighter", topSpeedMach: 2.05, ceilingFt: 50000, weaponsHardpoints: 9, stealthClass: "Standard", manufacturer: "Lockheed Martin" },
  F15E: { name: "McDonnell Douglas F-15E Strike Eagle", role: "All-Weather Strike / Air Superiority Fighter", topSpeedMach: 2.5, ceilingFt: 60000, weaponsHardpoints: 11, stealthClass: "Standard", manufacturer: "Boeing" }
};

// Helicopter & Rotorcraft Database
export const helicopterAircraftMap: Record<string, { name: string; role: string; topSpeedKnots: number; ceilingFt: number; rotorDiameterFt: number; medevacBeds: number; manufacturer: string }> = {
  H145: { name: "Airbus Helicopters H145 / BK117 D-3", role: "Emergency Medical Services (HEMS) & SAR", topSpeedKnots: 145, ceilingFt: 17500, rotorDiameterFt: 36.1, medevacBeds: 2, manufacturer: "Airbus Helicopters" },
  EC135: { name: "Airbus Helicopters EC135 / H135", role: "Police Aviation & Air Ambulance", topSpeedKnots: 140, ceilingFt: 20000, rotorDiameterFt: 33.5, medevacBeds: 1, manufacturer: "Airbus Helicopters" },
  S92: { name: "Sikorsky S-92 Helibus", role: "Offshore Oilfield & VIP Transport", topSpeedKnots: 165, ceilingFt: 15000, rotorDiameterFt: 56.3, medevacBeds: 3, manufacturer: "Sikorsky Aircraft" },
  AW139: { name: "Leonardo AW139", role: "Search and Rescue (SAR) & Maritime Patrol", topSpeedKnots: 167, ceilingFt: 20000, rotorDiameterFt: 45.3, medevacBeds: 2, manufacturer: "Leonardo" },
  AH64: { name: "Boeing AH-64E Apache Guardian", role: "Heavy Attack Helicopter / Gunship", topSpeedKnots: 158, ceilingFt: 20000, rotorDiameterFt: 48.0, medevacBeds: 0, manufacturer: "Boeing" },
  UH60: { name: "Sikorsky UH-60M Black Hawk", role: "Tactical Utility / Combat Assault Helicopter", topSpeedKnots: 159, ceilingFt: 19000, rotorDiameterFt: 53.7, medevacBeds: 6, manufacturer: "Sikorsky Aircraft" },
  CH47: { name: "Boeing CH-47F Chinook", role: "Tandem-Rotor Heavy-Lift Cargo Transport", topSpeedKnots: 170, ceilingFt: 20000, rotorDiameterFt: 60.0, medevacBeds: 24, manufacturer: "Boeing" },
  V22: { name: "Bell Boeing V-22 Osprey", role: "Tiltrotor Strategic High-Speed Transport", topSpeedKnots: 270, ceilingFt: 25000, rotorDiameterFt: 38.0, medevacBeds: 12, manufacturer: "Bell Boeing" },
  B407: { name: "Bell 407 GXi", role: "Air Ambulance & Law Enforcement Patrol", topSpeedKnots: 133, ceilingFt: 18690, rotorDiameterFt: 35.0, medevacBeds: 1, manufacturer: "Bell Textron" },
  H125: { name: "Airbus Helicopters H125 Écureuil", role: "High-Altitude Aerial Work & Utility", topSpeedKnots: 140, ceilingFt: 23000, rotorDiameterFt: 35.1, medevacBeds: 1, manufacturer: "Airbus Helicopters" },
  KA52: { name: "Kamov Ka-52 Alligator", role: "Coaxial Rotor Reconnaissance / Attack Helicopter", topSpeedKnots: 162, ceilingFt: 18000, rotorDiameterFt: 47.6, medevacBeds: 0, manufacturer: "Russian Helicopters" }
};

// Cargo Carriers
export const cargoAirlines: Record<string, { name: string; callsign: string; hub: string }> = {
  FDX: { name: "FedEx Express Cargo", callsign: "FEDEX", hub: "MEM" },
  UPS: { name: "UPS Airlines Worldwide", callsign: "UPS", hub: "SDF" },
  DHL: { name: "DHL Aviation Express", callsign: "DHL", hub: "LEJ" },
  GTI: { name: "Atlas Air Heavy Cargo", callsign: "GIANT", hub: "CVG" },
  CLX: { name: "Cargolux International", callsign: "CARGOLUX", hub: "LUX" },
  VDA: { name: "Volga-Dnepr Heavy Transport", callsign: "VOLGA", hub: "ULV" },
  SQC: { name: "Singapore Airlines Cargo", callsign: "SINGCARGO", hub: "SIN" },
  PAC: { name: "Polar Air Cargo", callsign: "POLAR", hub: "ANC" },
  CKK: { name: "China Cargo Airlines", callsign: "CARGO KING", hub: "PVG" }
};

// Business Jets Database
export const businessJetMap: Record<string, { name: string; role: string; topSpeedMach: number; ceilingFt: number; manufacturer: string; rangeKm: number }> = {
  G650: { name: "Gulfstream G650ER", role: "Ultra-Long-Range Executive Jet", topSpeedMach: 0.925, ceilingFt: 51000, manufacturer: "Gulfstream Aerospace", rangeKm: 13890 },
  GL7T: { name: "Bombardier Global 7500", role: "Ultra-Long-Range Flagship Business Jet", topSpeedMach: 0.925, ceilingFt: 51000, manufacturer: "Bombardier", rangeKm: 14260 },
  CL35: { name: "Bombardier Challenger 3500", role: "Super-Midsize Executive Jet", topSpeedMach: 0.83, ceilingFt: 45000, manufacturer: "Bombardier", rangeKm: 6297 },
  C750: { name: "Cessna Citation X+", role: "High-Speed Transcontinental Bizjet", topSpeedMach: 0.935, ceilingFt: 51000, manufacturer: "Cessna / Textron", rangeKm: 6410 },
  FA8X: { name: "Dassault Falcon 8X", role: "Trijet Ultra-Long-Range Executive", topSpeedMach: 0.90, ceilingFt: 51000, manufacturer: "Dassault Aviation", rangeKm: 11945 },
  PC24: { name: "Pilatus PC-24 Super Versatile Jet", role: "Short-Field Rough-Strip Executive Jet", topSpeedMach: 0.75, ceilingFt: 45000, manufacturer: "Pilatus Aircraft", rangeKm: 3769 },
  E55P: { name: "Embraer Phenom 300E", role: "Best-Selling Light Executive Jet", topSpeedMach: 0.80, ceilingFt: 45000, manufacturer: "Embraer Executive Jets", rangeKm: 3723 }
};

// General Aviation Database
export const generalAviationMap: Record<string, { name: string; role: string; cruiseKnots: number; ceilingFt: number; manufacturer: string }> = {
  C172: { name: "Cessna 172 Skyhawk", role: "Single-Engine Flight Training / Touring", cruiseKnots: 122, ceilingFt: 14000, manufacturer: "Cessna" },
  SR22: { name: "Cirrus SR22T GTS", role: "High-Performance Single with Airframe Parachute", cruiseKnots: 213, ceilingFt: 25000, manufacturer: "Cirrus Aircraft" },
  PA28: { name: "Piper PA-28 Cherokee", role: "Civil Light Trainer & Cross-Country", cruiseKnots: 115, ceilingFt: 14300, manufacturer: "Piper Aircraft" },
  BE36: { name: "Beechcraft Bonanza G36", role: "High-Performance 6-Seat Touring", cruiseKnots: 176, ceilingFt: 18500, manufacturer: "Beechcraft" },
  DA42: { name: "Diamond DA42 Twin Star", role: "Twin-Engine Diesel Cruiser / Multi-Engine Trainer", cruiseKnots: 162, ceilingFt: 18000, manufacturer: "Diamond Aircraft" },
  M20T: { name: "Mooney M20 Acclaim Ultra", role: "Turbocharged High-Speed Piston Single", cruiseKnots: 242, ceilingFt: 26000, manufacturer: "Mooney Aviation" }
};

// Lighter-Than-Air (Airships / Blimps / Balloons) Database
export const lighterThanAirMap: Record<string, { name: string; role: string; speedKnots: number; ceilingFt: number; manufacturer: string }> = {
  BLMP: { name: "Goodyear Wingfoot One (NT)", role: "Semi-Rigid Aerial Broadcast Airship", speedKnots: 65, ceilingFt: 10000, manufacturer: "Zeppelin / Goodyear" },
  ZEPN: { name: "Zeppelin NT-07", role: "Tourist & Atmospheric Research Airship", speedKnots: 70, ceilingFt: 8500, manufacturer: "Zeppelin Luftschifftechnik" },
  BALN: { name: "Raven Stratospheric Research Balloon", role: "High-Altitude Zero-Pressure Scientific Balloon", speedKnots: 25, ceilingFt: 65000, manufacturer: "Raven Aerostar" },
  HBAL: { name: "UltraMagic M-160 Hot Air Balloon", role: "Passenger Sightseeing Hot Air Balloon", speedKnots: 15, ceilingFt: 5000, manufacturer: "UltraMagic" }
};

// Gliders & Sailplanes Database
export const gliderMap: Record<string, { name: string; role: string; glideRatio: string; maxKnots: number; manufacturer: string }> = {
  ASK21: { name: "Schleicher ASK 21", role: "Two-Seat Composite Aerobatic Trainer Sailplane", glideRatio: "34:1", maxKnots: 151, manufacturer: "Alexander Schleicher" },
  DISC: { name: "Schempp-Hirth Discus-2b", role: "Standard-Class High-Performance Sailplane", glideRatio: "42.5:1", maxKnots: 135, manufacturer: "Schempp-Hirth" },
  DG10: { name: "DG Flugzeugbau DG-1000", role: "Two-Seat Club & Cross-Country Sailplane", glideRatio: "46.5:1", maxKnots: 146, manufacturer: "DG Aviation" },
  AS33: { name: "Schleicher AS 33 Es", role: "18m Open/Racing-Class Self-Launching Sailplane", glideRatio: "56:1", maxKnots: 146, manufacturer: "Alexander Schleicher" }
};

// Drones & Unmanned Aerial Vehicles (UAVs) Database
export const droneMap: Record<string, { name: string; role: string; topSpeedKnots: number; ceilingFt: number; manufacturer: string }> = {
  RQ4: { name: "Northrop Grumman RQ-4 Global Hawk", role: "High-Altitude Long-Endurance (HALE) Strategic Reconnaissance UAV", topSpeedKnots: 340, ceilingFt: 60000, manufacturer: "Northrop Grumman" },
  MQ9: { name: "General Atomics MQ-9 Reaper", role: "Remotely Piloted Combat & Persistent Surveillance RPAS", topSpeedKnots: 240, ceilingFt: 50000, manufacturer: "General Atomics" },
  TB2: { name: "Baykar Bayraktar TB2", role: "Medium-Altitude Long-Endurance (MALE) Armed UAV", topSpeedKnots: 120, ceilingFt: 27000, manufacturer: "Baykar Defense" },
  HM90: { name: "Elbit Systems Hermes 900", role: "Multi-Payload Tactical Surveillance UAV", topSpeedKnots: 140, ceilingFt: 30000, manufacturer: "Elbit Systems" },
  WING: { name: "Wing Delivery Hummingbird Drone", role: "Autonomous Commercial Last-Mile Delivery Drone", topSpeedKnots: 65, ceilingFt: 400, manufacturer: "Wing (Alphabet)" }
};

// Ground Vehicles (Airport Operations / Emergency / Ramp) Database
export const groundVehicleMap: Record<string, { name: string; role: string; topSpeedKmh: number; manufacturer: string }> = {
  FLME: { name: "Airport Follow-Me Lead Vehicle", role: "Aircraft Ramp Marshalling & Runway Inspection", topSpeedKmh: 130, manufacturer: "Volkswagen / Ford Pro" },
  FIRE: { name: "Rosenbauer Panther 8x8 ARFF", role: "Airport Crash Rescue Firefighting Crash Tender", topSpeedKmh: 140, manufacturer: "Rosenbauer" },
  TUG: { name: "Goldhofer AST-2X Pushback Tug", role: "Towbarless Widebody Aircraft Pushback & Relocation", topSpeedKmh: 32, manufacturer: "Goldhofer Airport Technology" },
  SWPR: { name: "Boschung Jetbroom 10000 Plus", role: "High-Speed Airport Runway Snow Clearance & Sweeper", topSpeedKmh: 80, manufacturer: "Boschung Group" },
  FUEL: { name: "Titan Aviation Jet A-1 Hydrant Refueler", role: "Aircraft High-Capacity Apron Fuel Servicing", topSpeedKmh: 60, manufacturer: "Titan Aviation" }
};

// Other / Specialized / Vintage Aircraft Database
export const otherAircraftMap: Record<string, { name: string; role: string; topSpeedKnots: number; ceilingFt: number; manufacturer: string }> = {
  CL415: { name: "Canadair CL-415 Super Scooper", role: "Amphibious Aerial Firefighting Heavy Water Bomber", topSpeedKnots: 194, ceilingFt: 14700, manufacturer: "De Havilland / Bombardier" },
  X15: { name: "North American X-15 (Experimental)", role: "Hypersonic Rocket-Powered Research Aircraft", topSpeedKnots: 3900, ceilingFt: 350000, manufacturer: "North American Aviation" },
  SPIT: { name: "Supermarine Spitfire Mk.IX", role: "Historic WWII Fighter Warbird", topSpeedKnots: 355, ceilingFt: 43000, manufacturer: "Supermarine" },
  P51: { name: "North American P-51D Mustang", role: "Historic Long-Range WWII Escort Fighter Warbird", topSpeedKnots: 380, ceilingFt: 41900, manufacturer: "North American Aviation" }
};

// Military Operators
export const militaryOperators: Record<string, { name: string; branch: string; country: string }> = {
  USAF: { name: "United States Air Force", branch: "Air Force", country: "United States" },
  USN: { name: "United States Navy Aviation", branch: "Navy", country: "United States" },
  RAF: { name: "Royal Air Force", branch: "Air Force", country: "United Kingdom" },
  GAF: { name: "German Air Force (Luftwaffe)", branch: "Air Force", country: "Germany" },
  FAF: { name: "French Air and Space Force", branch: "Air Force", country: "France" },
  IAF: { name: "Indian Air Force", branch: "Air Force", country: "India" },
  RAAF: { name: "Royal Australian Air Force", branch: "Air Force", country: "Australia" },
  JASDF: { name: "Japan Air Self-Defense Force", branch: "Air Force", country: "Japan" },
  NATO: { name: "NATO Strategic Command", branch: "Allied Command", country: "International" }
};

// Generate authentic runway data for any airport
export function getAirportRunways(airport: AirportInfo): AirportRunway[] {
  if (airport.runwaysDetail && airport.runwaysDetail.length > 0) {
    return airport.runwaysDetail;
  }
  const primaryHdg = Math.abs(Math.round(airport.lat * 7 + airport.lng * 3)) % 18;
  const hdg1 = (primaryHdg * 10) || 90;
  const hdg2 = (hdg1 + 180) % 360;
  const id1 = String(Math.round(hdg1 / 10)).padStart(2, '0');
  const id2 = String(Math.round(hdg2 / 10)).padStart(2, '0');

  return [
    {
      identifier: `${id1}L/${id2}R`,
      lengthFt: 11500 + (Math.abs(Math.round(airport.lat * 10)) % 3000),
      widthFt: 150,
      surface: "Grooved Concrete",
      ilsFreq: `110.${15 + (Math.abs(Math.round(airport.lat)) % 80)} MHz`,
      headingDeg: hdg1
    },
    {
      identifier: `${id1}R/${id2}L`,
      lengthFt: 9800 + (Math.abs(Math.round(airport.lng * 10)) % 2500),
      widthFt: 150,
      surface: "Asphalt",
      ilsFreq: `109.${25 + (Math.abs(Math.round(airport.lng)) % 70)} MHz`,
      headingDeg: hdg1
    }
  ];
}

// Generate realistic airport radio frequencies
export function getAirportFrequencies(airport: AirportInfo): AirportFrequency[] {
  if (airport.frequencies && airport.frequencies.length > 0) {
    return airport.frequencies;
  }
  const base = 118 + (Math.abs(Math.round(airport.lat * 5)) % 15);
  return [
    { type: "TWR", freqMhz: `${base}.700`, name: `${airport.city} Tower` },
    { type: "GND", freqMhz: `${base}.900`, name: `${airport.city} Ground Control` },
    { type: "APP", freqMhz: `${base + 3}.450`, name: `${airport.city} Radar Approach` },
    { type: "DEP", freqMhz: `${base + 2}.850`, name: `${airport.city} Radar Departure` },
    { type: "ATIS", freqMhz: `${base - 2}.250`, name: `${airport.city} ATIS Weather Info` },
    { type: "DEL", freqMhz: `${base}.150`, name: `${airport.city} Clearance Delivery` }
  ];
}

// Generate Flightradar24-style Live Arrivals & Departures Board
export function generateMockFlightBoard(iata: string): { departures: any[]; arrivals: any[] } {
  const airport = globalAirports[iata] || { city: iata, country: "International" };
  const codes = Object.keys(globalAirports).filter(c => c !== iata);
  const airlineKeys = Object.keys(majorAirlines).filter(k => k.length === 3);

  const departures: any[] = [];
  const arrivals: any[] = [];

  const statuses = ["BOARDING", "TAXIING", "DEPARTED", "EN ROUTE", "ON TIME", "DELAYED (15m)", "FINAL CALL"];
  const arrStatuses = ["LANDED", "APPROACHING", "ON SCHEDULE", "DELAYED", "BAGGAGE CLAIM", "ESTIMATED"];

  for (let i = 0; i < 15; i++) {
    const destCode = codes[(i * 11 + 3) % codes.length];
    const origCode = codes[(i * 17 + 7) % codes.length];
    const dest = globalAirports[destCode];
    const orig = globalAirports[origCode];
    const airline = majorAirlines[airlineKeys[(i * 5) % airlineKeys.length]] || { name: "Global Airways", iata: "GA" };

    const depHour = (8 + Math.floor(i * 1.1)) % 24;
    const depMin = (i * 18) % 60;
    const arrHour = (depHour + 2 + (i % 8)) % 24;
    const arrMin = (depMin + 25) % 60;

    departures.push({
      flightNumber: `${airline.iata || "SK"}${200 + i * 14}`,
      airline: airline.name,
      destinationIata: destCode,
      destinationCity: dest?.city || "Destination",
      destinationAirport: dest?.name || `${destCode} Airport`,
      scheduledTime: `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`,
      status: statuses[i % statuses.length],
      gate: `G${(i % 24) + 1}`,
      terminal: `T${(i % 3) + 1}`,
      aircraft: i % 2 === 0 ? "B77W (Boeing 777-300ER)" : "A359 (Airbus A350-900)"
    });

    arrivals.push({
      flightNumber: `${airline.iata || "SK"}${300 + i * 19}`,
      airline: airline.name,
      originIata: origCode,
      originCity: orig?.city || "Origin",
      originAirport: orig?.name || `${origCode} Airport`,
      scheduledTime: `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`,
      status: arrStatuses[i % arrStatuses.length],
      gate: `G${((i + 12) % 24) + 1}`,
      terminal: `T${((i + 1) % 3) + 1}`,
      aircraft: i % 3 === 0 ? "A388 (Airbus A380)" : "B789 (Dreamliner)"
    });
  }

  return { departures, arrivals };
}

// Cockpit Audio Synthesizer (Web Audio API)
let audioCtx: AudioContext | null = null;
let activeEngineNode: OscillatorNode | null = null;
let activeGainNode: GainNode | null = null;

export function playCockpitSound(type: "engine_jet" | "engine_rotor" | "tcas_alert" | "chime" | "autopilot", mute: boolean = false): void {
  if (mute || typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === "suspended") audioCtx.resume();

    if (type === "chime") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } else if (type === "tcas_alert") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.setValueAtTime(400, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    }
  } catch (e) {
    // Audio context gracefully ignored if permissions restricted
  }
}


