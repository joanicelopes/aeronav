export interface Airport {
  country_code: string
  region_name: string
  iata: string | null
  icao: string | null
  airport: string
  latitude: number
  longitude: number
}

export function findAirportByCode(code: string): Airport | undefined {
  // This function is now handled in the component since we load data dynamically
  return undefined
}
