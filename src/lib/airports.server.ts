// Server-only airport lookup. The dataset (~3.7 MB) is bundled into the
// server, so browsers never download it. Do not import this from client code.
import airportsData from "../data/airports.json"
import type { Airport } from "../components/airport-data"

const airports = airportsData as Airport[]

// Index by ICAO (4 letters) and IATA (3 letters) code, uppercase.
// The first entry wins for duplicates, matching the old client-side find().
const byCode = new Map<string, Airport>()
for (const airport of airports) {
  for (const code of [airport.icao, airport.code]) {
    const key = code?.toUpperCase()
    if (key && !byCode.has(key)) byCode.set(key, airport)
  }
}

export function findAirportByCode(code: string): Airport | null {
  return byCode.get(code.trim().toUpperCase()) ?? null
}
