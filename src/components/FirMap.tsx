'use client'

import dynamic from 'next/dynamic'
import type { FirPoint } from '../lib/fir-utils'

const DynamicFirMapInner = dynamic(
  () => import('./FirMapInner').then((m) => m.FirMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center text-sm text-gray-500">
        Loading FIR map…
      </div>
    ),
  }
)

interface FirMapProps {
  firPoints: FirPoint[]
}

export function FirMap({ firPoints }: FirMapProps) {
  return <DynamicFirMapInner firPoints={firPoints} />
}

