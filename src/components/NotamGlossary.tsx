"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { CONTRACTIONS, CONTRACTION_CATEGORIES, type ContractionCategory } from "../lib/notam-contractions"

export function NotamGlossary() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<ContractionCategory | "All">("All")
  const [showAll, setShowAll] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CONTRACTIONS.filter(
      (c) =>
        (category === "All" || c.category === category) &&
        (!q || c.code.toLowerCase().includes(q) || c.meaning.toLowerCase().includes(q)),
    ).sort((a, b) => a.code.localeCompare(b.code))
  }, [query, category])

  // Keep the page short until the user asks for everything (searching always shows all matches)
  const PREVIEW = 24
  const visible = showAll || query.trim() ? results : results.slice(0, PREVIEW)

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a contraction or meaning (e.g. CLSD, runway)"
          className="w-full bg-transparent pl-12 pr-10 py-3 text-white placeholder-white/50 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {(["All", ...CONTRACTION_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
              category === c
                ? "bg-orange-600 text-orange-50 border border-orange-400/30"
                : "text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results */}
      <p className="text-white/60 text-sm">
        {results.length} contraction{results.length === 1 ? "" : "s"}
      </p>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {visible.map((c) => (
            <div
              key={c.code}
              className="flex items-baseline gap-3 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            >
              <span className="text-white font-semibold min-w-20 shrink-0">{c.code}</span>
              <span className="text-white/80 text-sm">{c.meaning}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/70 text-center py-6">No contractions match &quot;{query}&quot;.</p>
      )}

      {visible.length < results.length && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(true)}
            className="px-4 py-2 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/10 border border-white/20 transition-colors"
          >
            Show all {results.length}
          </button>
        </div>
      )}
    </div>
  )
}
