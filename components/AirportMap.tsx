'use client'

import dynamic from 'next/dynamic'
import type { Airport } from './airport-data'

const DynamicAirportMap = dynamic(
  () => import('./AirportMapInner').then((m) => m.AirportMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center text-sm text-gray-500">
        Loading map…
      </div>
    ),
  }
)

interface AirportMapProps {
  airport: Airport
}

export function AirportMap({ airport }: AirportMapProps) {
  return <DynamicAirportMap airport={airport} />
}
