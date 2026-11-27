"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { AirportCard } from "./AirportCard"
import { AirportMap } from "./AirportMap"
import type { Airport } from "./airport-data"
import { fetchMetarData, type MetarData } from "../lib/weather-utils"

// Card + live METAR + map for one airport (looked up on the server).
export function AirportResult({ airport }: { airport: Airport }) {
  const [metar, setMetar] = useState<MetarData | null>(null)
  const [isLoadingMetar, setIsLoadingMetar] = useState(false)

  useEffect(() => {
    const icao = airport.icao
    if (!icao) return
    let cancelled = false
    setMetar(null)
    setIsLoadingMetar(true)
    fetchMetarData({ icao })
      .then((data) => {
        if (!cancelled) setMetar(data)
      })
      .finally(() => {
        if (!cancelled) setIsLoadingMetar(false)
      })
    return () => {
      cancelled = true
    }
  }, [airport.icao])

  return (
    <div className="w-full max-w-4xl space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <AirportCard airport={{ ...airport, metar }} />
      {isLoadingMetar && (
        <div className="flex items-center justify-center text-white/60">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Loading weather data...</span>
        </div>
      )}
      <AirportMap airport={airport} />
    </div>
  )
}
