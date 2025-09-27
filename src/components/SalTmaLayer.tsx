"use client"

import React, { useMemo } from 'react'
import { Polygon, useMap } from 'react-leaflet'

// Utility to convert degrees to radians
function toRad(deg: number) { return (deg * Math.PI) / 180 }
function toDeg(rad: number) { return (rad * 180) / Math.PI }

// Convert lat/lon (deg) to local planar coordinates in kilometers relative to origin latitude
function latLonToLocalKM(lat: number, lon: number, lat0: number) {
  const R_km_per_deg = 111 // approx
  const x = (lon) * Math.cos(toRad(lat0)) * R_km_per_deg
  const y = (lat) * R_km_per_deg
  return { x, y }
}

function localKMToLatLon(x: number, y: number, lat0: number) {
  const R_km_per_deg = 111
  const lat = y / R_km_per_deg
  const lon = x / (Math.cos(toRad(lat0)) * R_km_per_deg)
  return { lat, lon }
}

// Compute outward external tangent points for two equal-radius circles, choosing the tangent side away from the centroid
function externalTangentPoints(
  c1: { x: number, y: number },
  c2: { x: number, y: number },
  r: number,
  centroid: { x: number, y: number }
) {
  const dx = c2.x - c1.x
  const dy = c2.y - c1.y
  const d = Math.hypot(dx, dy)
  if (d === 0) {
    // degenerate: same center, return arbitrary
    return {
      p1: { x: c1.x, y: c1.y + r },
      p2: { x: c2.x, y: c2.y + r },
    }
  }
  // Unit direction from c1 to c2
  const ux = dx / d
  const uy = dy / d
  // Perpendicular unit normals
  const nx = -uy
  const ny = ux

  // Two possible external tangents: +/- n
  const cand1_p1 = { x: c1.x + r * nx, y: c1.y + r * ny }
  const cand1_p2 = { x: c2.x + r * nx, y: c2.y + r * ny }

  const cand2_p1 = { x: c1.x - r * nx, y: c1.y - r * ny }
  const cand2_p2 = { x: c2.x - r * nx, y: c2.y - r * ny }

  // Choose the pair that is farther from centroid on average ("outside" of triangle)
  const avg1 = { x: (cand1_p1.x + cand1_p2.x) / 2, y: (cand1_p1.y + cand1_p2.y) / 2 }
  const avg2 = { x: (cand2_p1.x + cand2_p2.x) / 2, y: (cand2_p1.y + cand2_p2.y) / 2 }
  const dist1 = Math.hypot(avg1.x - centroid.x, avg1.y - centroid.y)
  const dist2 = Math.hypot(avg2.x - centroid.x, avg2.y - centroid.y)

  return dist1 >= dist2
    ? { p1: cand1_p1, p2: cand1_p2 }
    : { p1: cand2_p1, p2: cand2_p2 }
}

// Generate arc points along a circle between two points, choosing the arc side away from centroid
function arcPoints(
  center: { x: number, y: number },
  r: number,
  start: { x: number, y: number },
  end: { x: number, y: number },
  centroid: { x: number, y: number },
  segments = 60
) {
  const a1 = Math.atan2(start.y - center.y, start.x - center.x)
  const a2 = Math.atan2(end.y - center.y, end.x - center.x)

  // Two possible arcs: Short (ccw) and long; determine which has midpoint farther from centroid
  function sampleArc(isCCW: boolean) {
    // normalize delta
    let delta = a2 - a1
    if (isCCW) {
      if (delta <= 0) delta += 2 * Math.PI
    } else {
      if (delta >= 0) delta -= 2 * Math.PI
    }
    const mid = a1 + delta / 2
    const midPt = { x: center.x + r * Math.cos(mid), y: center.y + r * Math.sin(mid) }
    const dist = Math.hypot(midPt.x - centroid.x, midPt.y - centroid.y)
    return { delta, dist }
  }

  const ccw = sampleArc(true)
  const cw = sampleArc(false)
  const useCCW = ccw.dist >= cw.dist
  let delta = useCCW ? ccw.delta : cw.delta

  const pts: { x: number, y: number }[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const ang = a1 + delta * t
    pts.push({ x: center.x + r * Math.cos(ang), y: center.y + r * Math.sin(ang) })
  }
  return pts
}

interface SalTmaLayerProps {
  color?: string
}

export function SalTmaLayer({ color = '#22d3ee' }: SalTmaLayerProps) {
  const map = useMap()

  // Constants
  const R_km = 80 * 1.852 // 80 NM to km

  // Hard-coded decimal coordinates for navaids (parsed from DMS)
  const CVS = { lat: 16.736672, lon: -22.95085 } // VOR/DME CVS
  const SNT = { lat: 14.939094, lon: -23.482123 } // VOR/DME SNT
  const SVT = { lat: 16.829139, lon: -25.064611 } // NDB SVT

  const paths = useMemo(() => {
    // Reference latitude for scaling
    const lat0 = (CVS.lat + SNT.lat + SVT.lat) / 3
    // Centers in local km coordinates
    const C1 = latLonToLocalKM(CVS.lat, CVS.lon, lat0)
    const C2 = latLonToLocalKM(SNT.lat, SNT.lon, lat0)
    const C3 = latLonToLocalKM(SVT.lat, SVT.lon, lat0)

    // Centroid of triangle of centers
    const centroid = { x: (C1.x + C2.x + C3.x) / 3, y: (C1.y + C2.y + C3.y) / 3 }

    // External tangents for each pair (in a cycle forming rounded triangle):
    const t12 = externalTangentPoints(C1, C2, R_km, centroid)
    const t23 = externalTangentPoints(C2, C3, R_km, centroid)
    const t31 = externalTangentPoints(C3, C1, R_km, centroid)

    // Build boundary: arc on circle 1 from t31.p2 to t12.p1, straight to circle 2, arc on 2 from t12.p2 to t23.p1, straight to circle 3, arc on 3 from t23.p2 to t31.p1, close
    const arc1 = arcPoints(C1, R_km, t31.p2, t12.p1, centroid, 48)
    const seg12 = [t12.p1, t12.p2]
    const arc2 = arcPoints(C2, R_km, t12.p2, t23.p1, centroid, 48)
    const seg23 = [t23.p1, t23.p2]
    const arc3 = arcPoints(C3, R_km, t23.p2, t31.p1, centroid, 48)
    const seg31 = [t31.p1, t31.p2]

    // Combine into one closed path
    const outline = [
      ...arc1,
      ...seg12,
      ...arc2,
      ...seg23,
      ...arc3,
      ...seg31,
    ]

    // Convert back to lat/lon
    const outlineLatLng = outline.map((p) => {
      const { lat, lon } = localKMToLatLon(p.x, p.y, lat0)
      return [lat, lon] as [number, number]
    })

    return outlineLatLng
  }, [])

  // Also compute a simple center for annotation from map if needed (not used now)
  void map

  return (
    <>
      {/* Sal TMA boundary */}
      <Polygon positions={paths} pathOptions={{ color, weight: 2, opacity: 0.95, fillOpacity: 0.08, fillColor: color }} />
    </>
  )
}

export default SalTmaLayer
