import { MetarData } from '../lib/weather-utils'

export interface Airport {
  code: string
  icao: string
  name: string
  latitude: number
  longitude: number
  elevation: number
  url: string
  time_zone: string
  city_code: string
  country: string
  city: string
  state: string
  county: string
  type: string
  country_name: string
  metar?: MetarData | null
}
