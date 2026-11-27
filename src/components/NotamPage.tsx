"use client"

import { useMemo, useState } from "react"
import { NOTAM_EXAMPLES } from "../data/notam-examples"
import { decodeNotam } from "../lib/notam-decoder"
import { NotamDecoder } from "./NotamDecoder"
import { NotamGlossary } from "./NotamGlossary"

export function NotamPage() {
  const [selectedId, setSelectedId] = useState<string | null>(NOTAM_EXAMPLES[0].id)
  const [text, setText] = useState(NOTAM_EXAMPLES[0].text)
  const decoded = useMemo(() => decodeNotam(text), [text])
  const selected = NOTAM_EXAMPLES.find((e) => e.id === selectedId)

  const pickExample = (id: string) => {
    const example = NOTAM_EXAMPLES.find((e) => e.id === id)
    if (!example) return
    setSelectedId(id)
    setText(example.text)
  }

  return (
    <div className="relative z-10 min-h-screen px-4 sm:px-6 pt-32 pb-16">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl sm:text-6xl font-light tracking-tight">
            <span className="text-black dark:text-orange-500 font-montserrat">NOTAMs</span>
          </h1>
          <p className="text-white/80 max-w-xl mx-auto">
            A NOTAM (Notice to Air Missions) warns pilots about changes along their route, such as closed runways,
            broken navaids or active military areas. Pick an example or paste your own to decode it.
          </p>
        </div>

        {/* Decoder */}
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {NOTAM_EXAMPLES.map((example) => (
              <button
                key={example.id}
                onClick={() => pickExample(example.id)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                  selectedId === example.id
                    ? "bg-orange-600 text-orange-50 border border-orange-400/30 shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/10 border border-white/20"
                }`}
              >
                {example.title}
              </button>
            ))}
          </div>

          {selected && <p className="text-white/70 text-sm">{selected.description}</p>}

          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setSelectedId(null)
            }}
            rows={6}
            spellCheck={false}
            aria-label="NOTAM text"
            placeholder="Paste a NOTAM here"
            className="w-full resize-y backdrop-blur-lg bg-black/20 border border-white/20 focus:border-black dark:focus:border-orange-500/50 rounded-2xl p-4 text-white text-sm placeholder-white/50 outline-none uppercase"
          />

          <NotamDecoder notam={decoded} />

          <p className="text-white/50 text-xs">
            Examples are made up for learning and are not real NOTAMs. Always check official sources before flying.
          </p>
        </section>

        {/* Glossary */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl text-white font-light">Contractions</h2>
            <p className="text-white/70 text-sm">
              Common abbreviations used in NOTAM text, based on ICAO Doc 8400 and FAA JO 7930.2 Appendix B.
            </p>
          </div>
          <NotamGlossary />
        </section>
      </div>
    </div>
  )
}
