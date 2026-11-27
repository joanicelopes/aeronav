"use client"

import { useEffect, useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"
import { ReactTyped } from "react-typed"
import { SearchInput } from "./SearchInput"

// Persistent header + search box shared by "/" and "/airport/[code]".
// Rendered from a layout, so it stays mounted while results change.
export function AirportFinderShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const params = useParams<{ code?: string }>()
  const currentCode = params.code ? decodeURIComponent(params.code).toUpperCase() : ""

  const [searchTerm, setSearchTerm] = useState(currentCode)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Keep the input in sync when the URL changes (back/forward, links)
  useEffect(() => {
    setSearchTerm(currentCode)
  }, [currentCode])

  const handleSearch = () => {
    const code = searchTerm.trim().toUpperCase()
    if (!code) {
      setError("Please enter an IATA or ICAO code")
      return
    }
    setError(null)
    startTransition(() => {
      router.push(`/airport/${encodeURIComponent(code)}`)
    })
  }

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    if (error) setError(null)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 space-y-8 pt-32">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-6xl font-light text-foreground tracking-tight">
            <span className="text-black dark:text-orange-500 font-montserrat">
              <ReactTyped strings={["Find Airports"]} typeSpeed={40} showCursor={false} />
            </span>
          </h1>
        </div>

        <SearchInput
          value={searchTerm}
          onChange={handleInputChange}
          onSearch={handleSearch}
          placeholder="Enter IATA or ICAO code"
        />

        {error && <FinderError message={error} />}

        {isPending ? (
          <Loader2 className="h-6 w-6 animate-spin text-white/70" />
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export function FinderError({ message }: { message: string }) {
  return (
    <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 backdrop-blur-sm">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  )
}
