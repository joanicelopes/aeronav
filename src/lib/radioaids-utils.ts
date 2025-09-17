// Radio Aids utilities

export interface RadioAid {
  name: string
  type: string
  frequency: string
  latitude: number
  longitude: number
  magneticVariation?: string
}

// Convert coordinates in formats like 160803.39N or 0225317.06W
function convertCoordinate(coord: string): number {
  const clean = coord.trim().toUpperCase()
  const dir = clean.slice(-1)
  const numeric = clean.slice(0, -1)

  // Match DDMMSS(.ss) or DDDMMSS(.ss)
  const match = numeric.match(/^(\d{2,3})(\d{2})(\d{2}(?:\.\d+)?)$/)
  if (!match) {
    throw new Error(`Invalid coordinate format: ${coord}`)
  }

  const degrees = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const seconds = parseFloat(match[3])

  let decimal = degrees + minutes / 60 + seconds / 3600
  if (dir === 'S' || dir === 'W') decimal = -decimal
  return decimal
}

export function parseRadioAids(csvData: string): RadioAid[] {
  const lines = csvData.trim().split('\n')
  const aids: RadioAid[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const parts = line.split(';')
    if (parts.length < 6) continue

    const name = parts[0].trim()
    const type = parts[1].trim()
    const frequency = parts[2].trim()
    const latStr = parts[3].trim()
    const lonStr = parts[4].trim()
    const magVar = parts[5]?.trim()

    try {
      const latitude = convertCoordinate(latStr)
      const longitude = convertCoordinate(lonStr)
      aids.push({ name, type, frequency, latitude, longitude, magneticVariation: magVar })
    } catch (e) {
      console.warn(`Failed to parse RadioAid ${name}:`, e)
    }
  }
  return aids
}


