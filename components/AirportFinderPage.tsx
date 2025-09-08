"use client"

import { useState, useEffect } from "react"
import { SearchInput } from "./SearchInput"
import { AirportCard } from "./AirportCard"
import { WorldMap } from "./WorldMap"
import { AlertCircle } from "lucide-react"
import type { Airport } from "./airport-data"

export function AirportFinderPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [airports, setAirports] = useState<Airport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        console.log("[v0] Fetching airports from /airports.json")
        const response = await fetch("/airports.json")
        if (!response.ok) {
          throw new Error("Failed to load airports data")
        }
        const airportsData = await response.json()
        console.log("[v0] Loaded airports data:", airportsData.length, "airports")
        setAirports(airportsData)
      } catch (err) {
        setError("Failed to load airports data")
        console.error("Error loading airports:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAirports()
  }, [])

  const handleSearch = () => {
    console.log("[v0] Search triggered with term:", searchTerm)
    console.log("[v0] Available airports:", airports.length)

    if (!searchTerm.trim()) {
      setError("Please enter an IATA or ICAO code")
      return
    }

    const airport = airports.find(
      (airport) =>
        (airport.icao && airport.icao.toLowerCase() === searchTerm.toLowerCase()) ||
        (airport.code && airport.code.toLowerCase() === searchTerm.toLowerCase()),
    )
    console.log("[v0] Found airport:", airport)

    if (airport) {
      setSelectedAirport(airport)
      setError(null)
    } else {
      setSelectedAirport(null)
      setError(`Airport with code "${searchTerm}" not found`)
    }
  }

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    if (error) setError(null)
  }

  if (isLoading) {
    return (
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-white text-lg">Loading airports data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 space-y-8 pt-32">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-5xl font-light text-white tracking-tight">
            Airport <span className="text-blue-400">Finder</span>
          </h1>
        </div>

        {/* Search input */}
        <SearchInput
          value={searchTerm}
          onChange={handleInputChange}
          onSearch={handleSearch}
          placeholder="Enter IATA or ICAO code"
        />

        {/* Error message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 backdrop-blur-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Airport card */}
        {selectedAirport && (
          <div className="w-full max-w-lg animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <AirportCard airport={selectedAirport} />
          </div>
        )}
      </div>
    </div>
  )
}
