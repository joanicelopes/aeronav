// Weather utilities for fetching METAR data
const AVIATION_WEATHER_BASE_URL = 'https://aviationweather.gov/api/data'

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

// Fetch METAR data for an airport
export const fetchMetarData = async (airport: { icao: string }): Promise<MetarData | null> => {
  try {
    console.log(`Fetching METAR for ${airport.icao}...`)

    const url = `${AVIATION_WEATHER_BASE_URL}/metar?ids=${airport.icao}&format=raw&taf=false&hours=2`
    const response = await fetchWithRetry(url)
    const data = await response.text()

    if (!data || data.trim() === '') {
      console.log(`No METAR data available for ${airport.icao}`)
      return null
    }

    console.log(`✓ Successfully fetched METAR for ${airport.icao}`)

    return {
      icao: airport.icao,
      type: 'METAR',
      rawText: data.trim(),
      reportTime: new Date(),
    }

  } catch (error: any) {
    console.error(`❌ Error fetching METAR for ${airport.icao}:`, error.message)
    return null
  }
}
