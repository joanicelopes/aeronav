// FIR (Flight Information Region) utilities

export interface FirPoint {
  name: string
  latitude: number
  longitude: number
}

/**
 * Convert degrees/minutes/seconds format to decimal degrees
 * @param coord - Coordinate string like "160755N" or "0261600W"
 * @returns Decimal degrees
 */
function convertCoordinate(coord: string): number {
  // Remove any whitespace
  const cleanCoord = coord.trim()
  
  // Extract the direction (N, S, E, W)
  const direction = cleanCoord.slice(-1)
  const numericPart = cleanCoord.slice(0, -1)
  
  // Parse degrees, minutes, seconds
  let degrees: number, minutes: number, seconds: number
  
  if (numericPart.length === 6) {
    // Format: DDMMSS (e.g., "160755")
    degrees = parseInt(numericPart.slice(0, 2))
    minutes = parseInt(numericPart.slice(2, 4))
    seconds = parseInt(numericPart.slice(4, 6))
  } else if (numericPart.length === 7) {
    // Format: DDDMMSS (e.g., "0261600")
    degrees = parseInt(numericPart.slice(0, 3))
    minutes = parseInt(numericPart.slice(3, 5))
    seconds = parseInt(numericPart.slice(5, 7))
  } else {
    throw new Error(`Invalid coordinate format: ${coord}`)
  }
  
  // Convert to decimal degrees
  let decimalDegrees = degrees + (minutes / 60) + (seconds / 3600)
  
  // Apply direction (negative for South and West)
  if (direction === 'S' || direction === 'W') {
    decimalDegrees = -decimalDegrees
  }
  
  return decimalDegrees
}

/**
 * Parse FIR points from CSV data
 * @param csvData - Raw CSV string
 * @returns Array of FIR points with converted coordinates
 */
export function parseFirPoints(csvData: string): FirPoint[] {
  const lines = csvData.trim().split('\n')
  const firPoints: FirPoint[] = []
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const parts = line.split(';')
    if (parts.length < 3) continue
    
    const name = parts[0].trim()
    const latitudeStr = parts[1].trim()
    const longitudeStr = parts[2].trim()
    const remark = (parts[3] || '').trim()
    
    if (!name || !latitudeStr || !longitudeStr) continue
    
    try {
      const latitude = convertCoordinate(latitudeStr)
      const longitude = convertCoordinate(longitudeStr)
      
      firPoints.push({
        name,
        latitude,
        longitude,
        remark
      })
    } catch (error) {
      console.warn(`Failed to parse FIR point ${name}:`, error)
    }
  }
  
  return firPoints
}

/**
 * Calculate the center point of FIR points for map centering
 * @param firPoints - Array of FIR points
 * @returns Center coordinates [latitude, longitude]
 */
export function calculateFirCenter(firPoints: FirPoint[]): [number, number] {
  if (firPoints.length === 0) {
    return [0, 0]
  }
  
  const totalLat = firPoints.reduce((sum, point) => sum + point.latitude, 0)
  const totalLon = firPoints.reduce((sum, point) => sum + point.longitude, 0)
  
  return [
    totalLat / firPoints.length,
    totalLon / firPoints.length
  ]
}

/**
 * Calculate bounds for map fitting
 * @param firPoints - Array of FIR points
 * @returns Bounds object for Leaflet
 */
export function calculateFirBounds(firPoints: FirPoint[]) {
  if (firPoints.length === 0) {
    return [[0, 0], [0, 0]]
  }
  
  const lats = firPoints.map(p => p.latitude)
  const lons = firPoints.map(p => p.longitude)
  
  return [
    [Math.min(...lats), Math.min(...lons)], // Southwest corner
    [Math.max(...lats), Math.max(...lons)]  // Northeast corner
  ]
}

