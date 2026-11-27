import { AirportFinderShell } from "../../src/components/AirportFinderPage"

// Shared by "/" and "/airport/[code]" so the header and search box
// stay mounted (no re-animation) while the result below changes.
export default function FinderLayout({ children }: { children: React.ReactNode }) {
  return <AirportFinderShell>{children}</AirportFinderShell>
}
