"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import type { Airport } from './airport-data'
import ReactCountryFlag from 'react-country-flag'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
// This must run on the client only, which is why this file is client-only and dynamically loaded
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface AirportMapInnerProps {
  airport: Airport
}

export function AirportMapInner({ airport }: AirportMapInnerProps) {
  const position: [number, number] = [airport.latitude, airport.longitude]

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
      <MapContainer
        key={airport.icao}
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position}>
          <Popup className="custom-popup">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              {/* Gradient overlay for extra glass effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
              
              {/* Content */}
              <div className="relative space-y-4">
                {/* Airport Name */}
                <div>
                  <ReactCountryFlag 
                      countryCode={airport.country} 
                      svg 
                      style={{ width: "2em", height: "2em" }} 
                    />
                  <h3 className="text-xl font-semibold text-white mb-2">{airport.name}</h3>
                  <div className="flex items-center gap-3 text-white/70 text-sm">
                    <span className="font-mono tracking-wider bg-orange-500/20 px-3 py-1 rounded-full border border-orange-400/30">
                      {airport.icao}/{airport.code}
                    </span>
                  </div>
                </div>
                
                {/* Details Grid */}
                {/* <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center text-white">
                    <span className="text-white/60 text-sm">Location</span>
                    <span className="text-white text-sm">
                      {airport.city ? `${airport.city}, ` : ''}{airport.country_name}
                    </span>
                  </div>
                   <div className="flex justify-between items-center text-white">
                    <span className="text-white/60 text-sm">Elevation</span>
                    <span className="text-white text-sm">{airport.elevation} ft</span>
                  </div>
                   <div className="flex justify-between items-center text-white">
                    <span className="text-white/60 text-sm">Coordinates</span>
                    <span className="text-white text-sm font-mono">
                      {airport.latitude.toFixed(4)}°, {airport.longitude.toFixed(4)}°
                    </span>
                  </div> 
                </div>*/}
              </div>
              
              {/* Subtle inner glow */}
              <div className="absolute inset-0 rounded-2xl shadow-inner shadow-white/5 pointer-events-none" />
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

