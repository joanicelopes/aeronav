"use client"

import React from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { Marker, Popup, GeoJSON, CircleMarker } from 'react-leaflet'
import { Icon, DivIcon } from 'leaflet'
import type { FirPoint } from '../lib/fir-utils'
import { parseRadioAids, type RadioAid } from '../lib/radioaids-utils'
import { calculateFirCenter, calculateFirBounds } from '../lib/fir-utils'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useState } from 'react'
import { feature } from 'topojson-client'

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
    iconSize: [1, 1],
    iconAnchor: [0, 0]
  })
}

export function FirMapInner({ firPoints }: FirMapInnerProps) {
  const center = calculateFirCenter(firPoints)
  const [worldFirs, setWorldFirs] = useState<any | null>(null)
  const [radioAids, setRadioAids] = useState<RadioAid[]>([])
  const [cvAirports, setCvAirports] = useState<any[]>([])
  const [showFirPoints, setShowFirPoints] = useState(true)
  const [showTmaPoints, setShowTmaPoints] = useState(false)
  const [showAirports, setShowAirports] = useState(true)
  const [showRadioAids, setShowRadioAids] = useState(false)

  // Base style for world FIR boundaries
  const baseFirStyle = () => ({ color: '#f44900', weight: 1, opacity: 0.6, fillOpacity: 0.03 })

  useEffect(() => {
    let isMounted = true
    const loadWorldFirs = async () => {
      try {
        const res = await fetch('/worldfirs.json')
        if (!res.ok) return
        const topo = await res.json()
        const geo = feature(topo, topo.objects.data)
        if (isMounted) setWorldFirs(geo)
      } catch (e) {
        console.error('Failed to load worldfirs.json', e)
      }
    }
    const loadRadioAids = async () => {
      try {
        const res = await fetch('/RadioAids.csv')
        if (!res.ok) return
        const text = await res.text()
        const aids = parseRadioAids(text)
        if (isMounted) setRadioAids(aids)
      } catch (e) {
        console.error('Failed to load RadioAids.csv', e)
      }
    }
    const loadCvAirports = async () => {
      try {
        const res = await fetch('/airports_cv.json')
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data) && isMounted) setCvAirports(data)
      } catch (e) {
        console.error('Failed to load airports_cv.json', e)
      }
    }
    loadWorldFirs()
    loadRadioAids()
    loadCvAirports()
    return () => { isMounted = false }
  }, [])

  return (
    <div className="w-full h-200 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Layer toggles */}
      <div className="absolute z-[1000] top-3 right-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white space-y-2">
        <div className="flex items-center gap-2">
          <input id="toggle-airports" type="checkbox" checked={showAirports} onChange={(e) => setShowAirports(e.target.checked)} />
          <label htmlFor="toggle-airports">Airports</label>
        </div>
        <div className="flex items-center gap-2">
          <input id="toggle-fir" type="checkbox" checked={showFirPoints} onChange={(e) => setShowFirPoints(e.target.checked)} />
          <label htmlFor="toggle-fir">FIR points</label>
        </div>
        <div className="flex items-center gap-2">
          <input id="toggle-tma" type="checkbox" checked={showTmaPoints} onChange={(e) => setShowTmaPoints(e.target.checked)} />
          <label htmlFor="toggle-tma">TMA points</label>
        </div>
        <div className="flex items-center gap-2">
          <input id="toggle-radioaids" type="checkbox" checked={showRadioAids} onChange={(e) => setShowRadioAids(e.target.checked)} />
          <label htmlFor="toggle-radioaids">Radio Aids</label>
        </div>
      </div>
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
        
        {/* Global FIR boundaries overlay */}
        {worldFirs && (
          <GeoJSON
            data={worldFirs as any}
            style={baseFirStyle}
            onEachFeature={(feat: any, layer: any) => {
              const p = feat.properties || {}
              const label = `${p.name || ''}${p.designator ? ` (${p.designator})` : ''}`.trim()
              if (label) {
                layer.bindPopup(label, { className: 'world-fir-popup' })
              }
              // Hover highlight
              layer.on('mouseover', () => {
                layer.setStyle({ color: '#60a5fa', weight: 2.5, opacity: 0.9, fillOpacity: 0.08 })
                if (layer.bringToFront) layer.bringToFront()
                const el = (layer as any).getElement?.()
                if (el) el.style.cursor = 'pointer'
              })
              layer.on('mouseout', () => {
                layer.setStyle(baseFirStyle() as any)
              })
            }}
          />
        )}

        {/* Fit bounds to FIR points */}
        <MapBounds firPoints={firPoints} />
        
        {/* FIR Point Markers with toggles */}
        {firPoints.map((point, index) => {
          const isTma = (point as any).remark ? String((point as any).remark).toUpperCase().includes('TMA') : false
          if ((isTma && !showTmaPoints) || (!isTma && !showFirPoints)) return null
          return (
            <React.Fragment key={`${point.name}-${index}`}>
              {/* Small circle marker */}
              <CircleMarker
                center={[point.latitude, point.longitude]}
                radius={3}
                pathOptions={{ color: '#fcae8f', fillColor: '#fcae8f', fillOpacity: 0.9, weight: 1 }}
              >
                <Popup maxWidth={420} minWidth={240} maxHeight={260}>
                  <div className="p-2">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{point.name}</h3>
                    <p className="text-sm text-gray-600"><strong>Type:</strong> {isTma ? 'TMA Point' : 'FIR Point'}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Coordinates:</strong> {point.latitude.toFixed(4)}°, {point.longitude.toFixed(4)}°
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Region:</strong> Sal Oceanic FIR
                    </p>
                  </div>
                </Popup>
              </CircleMarker>

              {/* Text label overlay */}
              <Marker
                position={[point.latitude, point.longitude]}
                icon={createTextIcon(point.name)}
                zIndexOffset={1000}
              />
            </React.Fragment>
          )
        })}

        {/* Cape Verde Airports */}
        {showAirports && cvAirports.map((ap, idx) => (
          <React.Fragment key={`${ap.icao || ap.code}-${idx}`}>
            <CircleMarker
              center={[ap.latitude, ap.longitude]}
              radius={4}
              pathOptions={{ color: '#ffffff', fillColor: '#ffffff', fillOpacity: 0.95, weight: 1 }}
            >
              <Popup maxWidth={420} minWidth={240}>
                <div className="p-2">
                  <h3 className="text-base font-semibold mb-1">{ap.name}</h3>
                  <div className="text-sm">
                    <div><strong>Code:</strong> {ap.icao}/{ap.code}</div>
                    {ap.city && (
                      <div><strong>City:</strong> {ap.city}</div>
                    )}
                    {ap.elevation !== undefined && (
                      <div><strong>Elevation:</strong> {ap.elevation} ft</div>
                    )}
                    <div className="text-xs opacity-70 mt-1">{ap.latitude.toFixed(4)}°, {ap.longitude.toFixed(4)}°</div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
            <Marker
              position={[ap.latitude, ap.longitude]}
              icon={createTextIcon(ap.icao || '')}
              zIndexOffset={1000}
            />
          </React.Fragment>
        ))}

        {/* Radio Aids: different colors/sizes by type */}
        {showRadioAids && radioAids.map((aid, idx) => {
          // Different styling based on type
          let color = '#60a5fa' // default blue
          let radius = 3
          let icon = '📡' // default antenna
          
          if (aid.type.includes('VOR/DME')) {
            color = '#e84b13' // green
            radius = 4
            icon = '🟠'
          } else if (aid.type.includes('VOR')) {
            color = '#f59e0b' // amber
            radius = 3
            icon = '🟡'
          } else if (aid.type.includes('NDB')) {
            color = '#aec4c1' // red
            radius = 3
            icon = '⚪️'
          }
          
          return (
            <React.Fragment key={`${aid.name}-${idx}`}>
              {/* Circle marker */}
              <CircleMarker
                center={[aid.latitude, aid.longitude]}
                radius={radius}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.9, weight: 1 }}
              >
                <Popup maxWidth={380} minWidth={220}>
                  <div className="p-2">
                    <h3 className="text-base font-semibold mb-1">{icon} {aid.name}</h3>
                    <div className="text-sm">
                      <div><strong>Type:</strong> {aid.type}</div>
                      <div><strong>Freq:</strong> {aid.frequency}</div>
                      {aid.magneticVariation && (
                        <div><strong>Mag Var:</strong> {aid.magneticVariation}</div>
                      )}
                      <div className="text-xs opacity-70 mt-1">{aid.latitude.toFixed(4)}°, {aid.longitude.toFixed(4)}°</div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
              
              {/* Text label */}
              <Marker
                position={[aid.latitude, aid.longitude]}
                icon={createTextIcon(aid.name)}
                zIndexOffset={1000}
              />
            </React.Fragment>
          )
        })}
      </MapContainer>
    </div>
  )
}
