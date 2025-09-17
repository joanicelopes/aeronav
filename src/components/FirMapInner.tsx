"use client"

import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet'
import { Icon, DivIcon } from 'leaflet'
import type { FirPoint } from '../lib/fir-utils'
import { calculateFirCenter, calculateFirBounds } from '../lib/fir-utils'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface FirMapInnerProps {
  firPoints: FirPoint[]
}

// Component to fit map bounds to FIR points
function MapBounds({ firPoints }: { firPoints: FirPoint[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (firPoints.length > 0) {
      const bounds = calculateFirBounds(firPoints)
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [map, firPoints])
  
  return null
}

// Create custom text icon for FIR points
function createTextIcon(text: string) {
  return new DivIcon({
    html: `<div style="
      
      color: #fcae8f;
      font-family: 'jetbrainsMono', sans-serif;
      font-size: 11px;
      font-weight: bold;
      padding: 2px 6px;
      
      white-space: nowrap;
      text-align: center;
    ">${text}</div>`,
    className: 'custom-text-icon',
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  })
}

export function FirMapInner({ firPoints }: FirMapInnerProps) {
  const center = calculateFirCenter(firPoints)

  return (
    <div className="w-full h-200 rounded-2xl overflow-hidden shadow-2xl">
      <MapContainer
        center={center}
        zoom={1}
        style={{ height: '100%', width: '100%' }}
        className="rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Fit bounds to FIR points */}
        <MapBounds firPoints={firPoints} />
        
        {/* FIR Point Text Labels */}
        {firPoints.map((point, index) => (
          <Marker 
            key={`${point.name}-${index}`} 
            position={[point.latitude, point.longitude]}
            icon={createTextIcon(point.name)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{point.name}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Type:</strong> FIR Point
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Coordinates:</strong> {point.latitude.toFixed(4)}°, {point.longitude.toFixed(4)}°
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Region:</strong> Sal Oceanic FIR
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
