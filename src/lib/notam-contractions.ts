// Common contractions used in NOTAM text (ICAO Doc 8400 / FAA JO 7930.2 Appendix B).
// A curated subset: the ones you actually meet when reading NOTAMs.

export type ContractionCategory =
  | "Aerodrome"
  | "Navigation"
  | "Lighting"
  | "Airspace"
  | "Time"
  | "Status"
  | "General"

export interface Contraction {
  code: string
  meaning: string
  category: ContractionCategory
}

export const CONTRACTION_CATEGORIES: ContractionCategory[] = [
  "Aerodrome",
  "Navigation",
  "Lighting",
  "Airspace",
  "Time",
  "Status",
  "General",
]

export const CONTRACTIONS: Contraction[] = [
  // Aerodrome
  { code: "AD", meaning: "Aerodrome", category: "Aerodrome" },
  { code: "AP", meaning: "Airport", category: "Aerodrome" },
  { code: "APRON", meaning: "Apron", category: "Aerodrome" },
  { code: "APN", meaning: "Apron", category: "Aerodrome" },
  { code: "ARP", meaning: "Aerodrome reference point", category: "Aerodrome" },
  { code: "RWY", meaning: "Runway", category: "Aerodrome" },
  { code: "TWY", meaning: "Taxiway", category: "Aerodrome" },
  { code: "TWYL", meaning: "Taxiway link", category: "Aerodrome" },
  { code: "THR", meaning: "Threshold", category: "Aerodrome" },
  { code: "DTHR", meaning: "Displaced threshold", category: "Aerodrome" },
  { code: "TDZ", meaning: "Touchdown zone", category: "Aerodrome" },
  { code: "TORA", meaning: "Take-off run available", category: "Aerodrome" },
  { code: "TODA", meaning: "Take-off distance available", category: "Aerodrome" },
  { code: "ASDA", meaning: "Accelerate-stop distance available", category: "Aerodrome" },
  { code: "LDA", meaning: "Landing distance available", category: "Aerodrome" },
  { code: "SWY", meaning: "Stopway", category: "Aerodrome" },
  { code: "CWY", meaning: "Clearway", category: "Aerodrome" },
  { code: "RESA", meaning: "Runway end safety area", category: "Aerodrome" },
  { code: "STAND", meaning: "Aircraft stand", category: "Aerodrome" },
  { code: "ACFT", meaning: "Aircraft", category: "Aerodrome" },
  { code: "TWR", meaning: "Aerodrome control tower", category: "Aerodrome" },
  { code: "FUEL", meaning: "Fuel", category: "Aerodrome" },
  { code: "RFF", meaning: "Rescue and fire fighting", category: "Aerodrome" },
  { code: "CAT", meaning: "Category", category: "Aerodrome" },
  { code: "PCN", meaning: "Pavement classification number", category: "Aerodrome" },
  { code: "WIP", meaning: "Work in progress", category: "Aerodrome" },
  { code: "OBST", meaning: "Obstacle", category: "Aerodrome" },
  { code: "CRANE", meaning: "Crane", category: "Aerodrome" },

  // Navigation
  { code: "ILS", meaning: "Instrument landing system", category: "Navigation" },
  { code: "LOC", meaning: "Localizer", category: "Navigation" },
  { code: "GP", meaning: "Glide path", category: "Navigation" },
  { code: "GS", meaning: "Glide slope", category: "Navigation" },
  { code: "DME", meaning: "Distance measuring equipment", category: "Navigation" },
  { code: "VOR", meaning: "VHF omnidirectional radio range", category: "Navigation" },
  { code: "DVOR", meaning: "Doppler VOR", category: "Navigation" },
  { code: "NDB", meaning: "Non-directional radio beacon", category: "Navigation" },
  { code: "GNSS", meaning: "Global navigation satellite system", category: "Navigation" },
  { code: "GPS", meaning: "Global positioning system", category: "Navigation" },
  { code: "RNAV", meaning: "Area navigation", category: "Navigation" },
  { code: "RNP", meaning: "Required navigation performance", category: "Navigation" },
  { code: "IAP", meaning: "Instrument approach procedure", category: "Navigation" },
  { code: "APCH", meaning: "Approach", category: "Navigation" },
  { code: "SID", meaning: "Standard instrument departure", category: "Navigation" },
  { code: "STAR", meaning: "Standard instrument arrival", category: "Navigation" },
  { code: "IFR", meaning: "Instrument flight rules", category: "Navigation" },
  { code: "VFR", meaning: "Visual flight rules", category: "Navigation" },
  { code: "FREQ", meaning: "Frequency", category: "Navigation" },
  { code: "MHZ", meaning: "Megahertz", category: "Navigation" },
  { code: "KHZ", meaning: "Kilohertz", category: "Navigation" },
  { code: "NAV", meaning: "Navigation", category: "Navigation" },
  { code: "MIN", meaning: "Minimums", category: "Navigation" },
  { code: "MDA", meaning: "Minimum descent altitude", category: "Navigation" },
  { code: "DA", meaning: "Decision altitude", category: "Navigation" },

  // Lighting
  { code: "LGT", meaning: "Lighting", category: "Lighting" },
  { code: "LGTD", meaning: "Lighted", category: "Lighting" },
  { code: "ALS", meaning: "Approach lighting system", category: "Lighting" },
  { code: "PAPI", meaning: "Precision approach path indicator", category: "Lighting" },
  { code: "VASIS", meaning: "Visual approach slope indicator system", category: "Lighting" },
  { code: "REDL", meaning: "Runway edge lights", category: "Lighting" },
  { code: "RCLL", meaning: "Runway centre line lights", category: "Lighting" },
  { code: "RENL", meaning: "Runway end lights", category: "Lighting" },
  { code: "ABN", meaning: "Aerodrome beacon", category: "Lighting" },
  { code: "BCN", meaning: "Beacon", category: "Lighting" },
  { code: "FLG", meaning: "Flashing", category: "Lighting" },

  // Airspace
  { code: "FIR", meaning: "Flight information region", category: "Airspace" },
  { code: "UIR", meaning: "Upper flight information region", category: "Airspace" },
  { code: "TMA", meaning: "Terminal control area", category: "Airspace" },
  { code: "CTR", meaning: "Control zone", category: "Airspace" },
  { code: "CTA", meaning: "Control area", category: "Airspace" },
  { code: "ATZ", meaning: "Aerodrome traffic zone", category: "Airspace" },
  { code: "TRA", meaning: "Temporary reserved airspace", category: "Airspace" },
  { code: "TSA", meaning: "Temporary segregated area", category: "Airspace" },
  { code: "ATS", meaning: "Air traffic services", category: "Airspace" },
  { code: "ATC", meaning: "Air traffic control", category: "Airspace" },
  { code: "FL", meaning: "Flight level", category: "Airspace" },
  { code: "SFC", meaning: "Surface", category: "Airspace" },
  { code: "GND", meaning: "Ground", category: "Airspace" },
  { code: "AGL", meaning: "Above ground level", category: "Airspace" },
  { code: "AMSL", meaning: "Above mean sea level", category: "Airspace" },
  { code: "MSL", meaning: "Mean sea level", category: "Airspace" },
  { code: "ELEV", meaning: "Elevation", category: "Airspace" },
  { code: "HGT", meaning: "Height", category: "Airspace" },
  { code: "UNL", meaning: "Unlimited", category: "Airspace" },
  { code: "RADIUS", meaning: "Radius", category: "Airspace" },
  { code: "NM", meaning: "Nautical miles", category: "Airspace" },
  { code: "FT", meaning: "Feet", category: "Airspace" },
  { code: "UAS", meaning: "Unmanned aircraft system (drone)", category: "Airspace" },

  // Time
  { code: "UTC", meaning: "Coordinated universal time", category: "Time" },
  { code: "DLY", meaning: "Daily", category: "Time" },
  { code: "H24", meaning: "Continuous day and night service", category: "Time" },
  { code: "HR", meaning: "Hours", category: "Time" },
  { code: "SR", meaning: "Sunrise", category: "Time" },
  { code: "SS", meaning: "Sunset", category: "Time" },
  { code: "MON", meaning: "Monday", category: "Time" },
  { code: "TUE", meaning: "Tuesday", category: "Time" },
  { code: "WED", meaning: "Wednesday", category: "Time" },
  { code: "THU", meaning: "Thursday", category: "Time" },
  { code: "FRI", meaning: "Friday", category: "Time" },
  { code: "SAT", meaning: "Saturday", category: "Time" },
  { code: "SUN", meaning: "Sunday", category: "Time" },
  { code: "EST", meaning: "Estimated (end time is not certain)", category: "Time" },
  { code: "PERM", meaning: "Permanent", category: "Time" },
  { code: "TIL", meaning: "Until", category: "Time" },
  { code: "WEF", meaning: "With effect from", category: "Time" },
  { code: "TEMPO", meaning: "Temporarily", category: "Time" },

  // Status
  { code: "CLSD", meaning: "Closed", category: "Status" },
  { code: "U/S", meaning: "Unserviceable", category: "Status" },
  { code: "OTS", meaning: "Out of service", category: "Status" },
  { code: "AVBL", meaning: "Available", category: "Status" },
  { code: "NOT AVBL", meaning: "Not available", category: "Status" },
  { code: "OPN", meaning: "Open", category: "Status" },
  { code: "OPR", meaning: "Operator", category: "Status" },
  { code: "ACT", meaning: "Active", category: "Status" },
  { code: "INOP", meaning: "Inoperative", category: "Status" },
  { code: "LTD", meaning: "Limited", category: "Status" },
  { code: "RSTD", meaning: "Restricted", category: "Status" },
  { code: "PROHIBITED", meaning: "Prohibited", category: "Status" },
  { code: "MAINT", meaning: "Maintenance", category: "Status" },
  { code: "CTN", meaning: "Caution", category: "Status" },
  { code: "CHG", meaning: "Changed", category: "Status" },
  { code: "CNL", meaning: "Cancelled", category: "Status" },
  { code: "RESUMED", meaning: "Resumed", category: "Status" },

  // General
  { code: "NOTAM", meaning: "Notice to air missions", category: "General" },
  { code: "AIP", meaning: "Aeronautical information publication", category: "General" },
  { code: "AIRAC", meaning: "Aeronautical information regulation and control", category: "General" },
  { code: "AMDT", meaning: "Amendment", category: "General" },
  { code: "SUP", meaning: "Supplement", category: "General" },
  { code: "ARR", meaning: "Arrival", category: "General" },
  { code: "DEP", meaning: "Departure", category: "General" },
  { code: "BTN", meaning: "Between", category: "General" },
  { code: "WI", meaning: "Within", category: "General" },
  { code: "EXC", meaning: "Except", category: "General" },
  { code: "DUE", meaning: "Due to", category: "General" },
  { code: "ADJ", meaning: "Adjacent", category: "General" },
  { code: "APRX", meaning: "Approximately", category: "General" },
  { code: "BLW", meaning: "Below", category: "General" },
  { code: "ABV", meaning: "Above", category: "General" },
  { code: "BFR", meaning: "Before", category: "General" },
  { code: "PPR", meaning: "Prior permission required", category: "General" },
  { code: "REF", meaning: "Reference to", category: "General" },
  { code: "REQ", meaning: "Requested", category: "General" },
  { code: "OPS", meaning: "Operations", category: "General" },
  { code: "PSN", meaning: "Position", category: "General" },
  { code: "FLW", meaning: "Following", category: "General" },
  { code: "INFO", meaning: "Information", category: "General" },
  { code: "TFC", meaning: "Traffic", category: "General" },
  { code: "TKOF", meaning: "Take-off", category: "General" },
  { code: "LDG", meaning: "Landing", category: "General" },
  { code: "MIL", meaning: "Military", category: "General" },
  { code: "NE", meaning: "Northeast", category: "General" },
  { code: "NW", meaning: "Northwest", category: "General" },
  { code: "SE", meaning: "Southeast", category: "General" },
  { code: "SW", meaning: "Southwest", category: "General" },
  { code: "DEG", meaning: "Degrees", category: "General" },
]

// Lookup by code. If a code is ever listed twice, the first entry wins.
const LOOKUP = new Map<string, Contraction>()
for (const c of CONTRACTIONS) {
  if (!LOOKUP.has(c.code)) LOOKUP.set(c.code, c)
}

export function findContraction(token: string): Contraction | undefined {
  return LOOKUP.get(token.toUpperCase())
}
