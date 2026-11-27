import type { Metadata } from "next"
import { findAirportByCode } from "../../../../src/lib/airports.server"
import { AirportResult } from "../../../../src/components/AirportResult"
import { FinderError } from "../../../../src/components/AirportFinderPage"

interface Props {
  params: { code: string }
}

export function generateMetadata({ params }: Props): Metadata {
  const code = decodeURIComponent(params.code).toUpperCase()
  const airport = findAirportByCode(code)
  return {
    title: airport ? `${airport.icao || airport.code} – ${airport.name} | AeroNav` : `${code} not found | AeroNav`,
  }
}

export default function AirportPage({ params }: Props) {
  const code = decodeURIComponent(params.code).toUpperCase()
  const airport = findAirportByCode(code)

  if (!airport) {
    return <FinderError message={`Airport with code "${code}" not found`} />
  }

  return <AirportResult airport={airport} />
}
