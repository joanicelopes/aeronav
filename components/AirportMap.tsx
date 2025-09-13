'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { Airport } from './airport-data'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface AirportMapProps {
  airport: Airport
}

export function AirportMap({ airport }: AirportMapProps) {
  const position: [number, number] = [airport.latitude, airport.longitude]

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
      <MapContainer
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
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg text-gray-800">{airport.name}</h3>
              <p className="text-sm text-gray-600">
                <strong>ICAO:</strong> {airport.icao}
              </p>
              <p className="text-sm text-gray-600">
                <strong>IATA:</strong> {airport.code}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Location:</strong> {airport.city ? `${airport.city}, ` : ''}{airport.country_name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Elevation:</strong> {airport.elevation} ft
              </p>
              <p className="text-sm text-gray-600">
                <strong>Coordinates:</strong> {airport.latitude.toFixed(4)}°, {airport.longitude.toFixed(4)}°
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
