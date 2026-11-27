import type { Metadata } from "next"
import { NotamPage } from "../../src/components/NotamPage"

export const metadata: Metadata = {
  title: "NOTAM | AeroNav",
}

export default function Notam() {
  return <NotamPage />
}
