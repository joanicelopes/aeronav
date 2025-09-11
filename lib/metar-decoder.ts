// METAR decoding utilities
export interface DecodedMetar {
  temperature: number | null
  dewPoint: number | null
  windDirection: number | null
  windSpeed: number | null
  windGusts: number | null
  visibility: number | null
  visibilityUnit: 'm' | 'km' | null
  cloudCover: Array<{
    type: string
    altitude: number
    coverage: string
  }>
  pressure: number | null
  pressureUnit: 'hPa' | 'inHg' | null
  rawText: string
}

export function decodeMetar(rawText: string): DecodedMetar {
  const decoded: DecodedMetar = {
    temperature: null,
    dewPoint: null,
    windDirection: null,
    windSpeed: null,
    windGusts: null,
    visibility: null,
    visibilityUnit: null,
    cloudCover: [],
    pressure: null,
    pressureUnit: null,
    rawText
  }

  // Split METAR into parts
  const parts = rawText.split(/\s+/)
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    
    // Temperature and dew point (e.g., "12/08" or "M05/M10")
    if (/^[M]?[0-9]{2}\/[M]?[0-9]{2}$/.test(part)) {
      const tempParts = part.split('/')
      decoded.temperature = tempParts[0].startsWith('M') 
        ? -parseInt(tempParts[0].substring(1)) 
        : parseInt(tempParts[0])
      decoded.dewPoint = tempParts[1].startsWith('M') 
        ? -parseInt(tempParts[1].substring(1)) 
        : parseInt(tempParts[1])
    }
    
    // Wind (e.g., "27015G25KT" or "VRB05KT" or "03011KT")
    if (/^[0-9]{3}[0-9]{2,3}(?:G[0-9]{2})?KT$/.test(part) || /^VRB[0-9]{2}KT$/.test(part)) {
      if (part.startsWith('VRB')) {
        decoded.windDirection = null // Variable wind
        decoded.windSpeed = parseInt(part.substring(3, 5))
      } else {
        decoded.windDirection = parseInt(part.substring(0, 3))
        const windMatch = part.match(/^[0-9]{3}([0-9]{2,3})(?:G([0-9]{2}))?KT$/)
        if (windMatch) {
          decoded.windSpeed = parseInt(windMatch[1])
          if (windMatch[2]) {
            decoded.windGusts = parseInt(windMatch[2])
          }
        }
      }
    }
    
    // Visibility (e.g., "10SM" or "9999")
    if (/^[0-9]{1,4}(SM)?$/.test(part)) {
      if (part.endsWith('SM')) {
        // Convert statute miles to kilometers
        decoded.visibility = parseInt(part.substring(0, part.length - 2)) * 1.60934
        decoded.visibilityUnit = 'km'
      } else {
        // Keep meters as meters
        decoded.visibility = parseInt(part)
        decoded.visibilityUnit = 'm'
      }
    }
    
    // Cloud cover (e.g., "FEW020", "SCT030", "BKN040", "OVC050", "CLR")
    if (/^(FEW|SCT|BKN|OVC|CLR)[0-9]{3}$/.test(part) || part === 'CLR') {
      if (part === 'CLR') {
        decoded.cloudCover.push({
          type: 'Clear',
          altitude: 0,
          coverage: 'Clear'
        })
      } else {
        const cloudMatch = part.match(/^(FEW|SCT|BKN|OVC)([0-9]{3})$/)
        if (cloudMatch) {
          const coverage = cloudMatch[1]
          const altitude = parseInt(cloudMatch[2]) * 100 // Convert to feet
          decoded.cloudCover.push({
            type: coverage,
            altitude,
            coverage: getCloudCoverageDescription(coverage)
          })
        }
      }
    }
    
    // Pressure (e.g., "A2992" or "Q1013")
    if (/^A[0-9]{4}$/.test(part)) {
      decoded.pressure = parseInt(part.substring(1)) / 100 // Convert to inches of mercury for A format
      decoded.pressureUnit = 'inHg'
    } else if (/^Q[0-9]{4}$/.test(part)) {
      decoded.pressure = parseInt(part.substring(1)) // Keep as hPa for Q format
      decoded.pressureUnit = 'hPa'
    }
  }
  
  return decoded
}

function getCloudCoverageDescription(code: string): string {
  const coverageMap: { [key: string]: string } = {
    'FEW': 'Few (1/8 to 2/8)',
    'SCT': 'Scattered (3/8 to 4/8)',
    'BKN': 'Broken (5/8 to 7/8)',
    'OVC': 'Overcast (8/8)',
    'CLR': 'Clear'
  }
  return coverageMap[code] || code
}

export function formatWind(wind: DecodedMetar): string {
  if (!wind.windDirection && !wind.windSpeed) return 'No wind data'
  
  if (wind.windDirection === null) {
    return `Variable at ${wind.windSpeed} kt${wind.windGusts ? `, gusts ${wind.windGusts} kt` : ''}`
  }
  
  const direction = wind.windDirection.toString().padStart(3, '0')
  let result = `${direction}° at ${wind.windSpeed} kt`
  if (wind.windGusts) {
    result += `, gusts ${wind.windGusts} kt`
  }
  return result
}

export function formatVisibility(visibility: number | null, unit: 'm' | 'km' | null = null): string {
  if (visibility === null) return 'No visibility data'
  
  if (unit === 'km') {
    if (visibility >= 10) return '10+ km'
    return `${visibility.toFixed(1)} km`
  } else if (unit === 'm') {
    if (visibility >= 10000) return '10+ km'
    return `${visibility} m`
  } else {
    // Fallback for backward compatibility
    if (visibility >= 10) return '10+ km'
    return `${visibility.toFixed(1)} km`
  }
}
