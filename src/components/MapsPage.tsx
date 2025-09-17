"use client"

import { useState, useEffect } from 'react'
import { FirMap } from './FirMap'
import { parseFirPoints, type FirPoint } from '../lib/fir-utils'
import { Loader2 } from 'lucide-react'

export function MapsPage() {
  const [firPoints, setFirPoints] = useState<FirPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFirPoints = async () => {
      try {
        const response = await fetch('/fir_points.csv')
        if (!response.ok) {
          throw new Error('Failed to load FIR points data')
        }
        const csvData = await response.text()
        const points = parseFirPoints(csvData)
        setFirPoints(points)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load FIR points')
        console.error('Error loading FIR points:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadFirPoints()
  }, [])

  if (isLoading) {
    return (
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 pt-32">
        <div className="flex items-center space-x-3 text-white/70">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading Sal Oceanic FIR map...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 pt-32">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-light text-white tracking-tight">
            Interactive <span className="text-red-400">Maps</span>
          </h1>
          <p className="text-red-400 text-lg max-w-md">
            Error loading map data: {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 pt-32">
      {/* Header */}
      {/* <div className="text-center space-y-4 mb-8">
        <h1 className="text-5xl font-light text-white tracking-tight">
          Sal Oceanic <span className="text-blue-400">FIR</span>
        </h1>
        <p className="text-white/70 text-lg max-w-2xl">
          Flight Information Region points covering the Sal Oceanic area. 
          Click on markers to view detailed information about each FIR point.
        </p>
      </div> */}

      {/* FIR Map */}
      <div className="w-full h-full">
        <FirMap firPoints={firPoints} />
      </div>
    </div>
  );
}
