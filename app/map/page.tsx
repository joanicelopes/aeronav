import type { Metadata } from "next"
import { MapsPage } from "../../src/components/MapsPage"

export const metadata: Metadata = {
  title: "Map | AeroNav",
}

export default function MapPage() {
  return <MapsPage />
}
