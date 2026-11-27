// Weather utilities for fetching METAR data
// Proxied through our own API route (app/api/metar/route.ts) to avoid CORS
const METAR_PROXY_URL = '/api/metar'

// Retry utility for API calls
async function fetchWithRetry(url: string, maxRetries: number = 3): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return response
      }
      if (attempt === maxRetries) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
  throw new Error('Max retries exceeded')
}

// METAR data interface
export interface MetarData {
  icao: string
  type: 'METAR'
  rawText: string
  reportTime: Date
}

// Parse the observation time from a METAR's DDHHMMZ group (e.g. "271530Z").
// The report only carries day/hour/minute, so the month/year are inferred:
// a day later than today means the report is from the previous month.
export function parseMetarTime(rawText: string, now: Date = new Date()): Date | null {
  const match = rawText.match(/\b(\d{2})(\d{2})(\d{2})Z\b/)
  if (!match) return null

  const [day, hour, minute] = match.slice(1).map(Number)
  if (day < 1 || day > 31 || hour > 23 || minute > 59) return null

  let year = now.getUTCFullYear()
  let month = now.getUTCMonth()
  if (day > now.getUTCDate()) {
    month -= 1
    if (month < 0) {
      month = 11
      year -= 1
    }
  }

  return new Date(Date.UTC(year, month, day, hour, minute))
}

// Fetch METAR data for an airport
export const fetchMetarData = async (airport: { icao: string }): Promise<MetarData | null> => {
  try {
    console.log(`Fetching METAR for ${airport.icao}...`)

    const url = `${METAR_PROXY_URL}?ids=${encodeURIComponent(airport.icao)}`
    const response = await fetchWithRetry(url)
    // Keep only the most recent report (first line)
    const data = (await response.text()).trim().split('\n')[0]

    if (!data || data.trim() === '') {
      console.log(`No METAR data available for ${airport.icao}`)
      return null
    }

    console.log(`✓ Successfully fetched METAR for ${airport.icao}`)

    return {
      icao: airport.icao,
      type: 'METAR',
      rawText: data.trim(),
      reportTime: parseMetarTime(data) ?? new Date(),
    }

  } catch (error: any) {
    console.error(`❌ Error fetching METAR for ${airport.icao}:`, error.message)
    return null
  }
}
