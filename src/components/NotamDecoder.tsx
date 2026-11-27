"use client"

import { useState } from "react"
import { Languages, Code2 } from "lucide-react"
import { plainTokens, tokenizeText, type DecodedNotam, type QLine } from "../lib/notam-decoder"

const glass = "backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl"

// Q-line segments in the order they appear in "FIR/QCODE/TRAFFIC/PURPOSE/SCOPE/LOWER/UPPER/AREA"
const Q_SEGMENTS: { label: string; values: (q: QLine) => string }[] = [
  { label: "FIR", values: (q) => q.fir },
  { label: "NOTAM code", values: (q) => `${q.subject} · ${q.condition}` },
  { label: "Traffic", values: (q) => q.traffic },
  { label: "Purpose", values: (q) => q.purpose },
  { label: "Scope", values: (q) => q.scope },
  { label: "Lower limit", values: (q) => q.lower },
  { label: "Upper limit", values: (q) => q.upper },
  { label: "Area", values: (q) => (q.radius ? `${q.coordinates}, radius ${q.radius}` : q.coordinates) },
]

export function NotamDecoder({ notam }: { notam: DecodedNotam }) {
  if (!notam.raw) {
    return <p className="text-white/70 text-center">Paste a NOTAM above or pick an example.</p>
  }

  if (notam.fields.length === 0) {
    return (
      <p className="text-white/80 text-center">
        No NOTAM items found. Items start with a letter and a bracket, like <code>A)</code> or <code>E)</code>.
      </p>
    )
  }

  const message = notam.fields.find((f) => f.key === "E")
  const others = notam.fields.filter((f) => f.key !== "E" && f.key !== "Q")
  const qRaw = notam.fields.find((f) => f.key === "Q")?.raw

  return (
    <div className="space-y-4">
      {/* Header: number and type */}
      {notam.id && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-black/30 text-white text-sm">{notam.id}</span>
          <span className="px-3 py-1 rounded-full bg-orange-600 text-orange-50 text-sm">
            {notam.type} · {notam.typeMeaning}
          </span>
          {notam.replaces && (
            <span className="text-white/80 text-sm">
              {notam.type === "NOTAMC" ? "cancels" : "replaces"} {notam.replaces}
            </span>
          )}
        </div>
      )}

      {message && <MessageCard text={message.raw} />}

      {/* Items A-D, F, G */}
      {others.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {others.map((field) => (
            <div key={field.key} className={`${glass} p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <ItemBadge letter={field.key} />
                <span className="text-white/70 text-xs uppercase tracking-wider">{field.label}</span>
              </div>
              <p className="text-white/60 text-xs break-all">{field.raw}</p>
              <p className="text-white mt-1">{field.meaning}</p>
            </div>
          ))}
        </div>
      )}

      {notam.qLine && qRaw && <QLineCard raw={qRaw} q={notam.qLine} />}
    </div>
  )
}

function ItemBadge({ letter }: { letter: string }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-black/30 text-orange-300 text-sm font-semibold">
      {letter})
    </span>
  )
}

// Item E with clickable contractions and a plain-English toggle
function MessageCard({ text }: { text: string }) {
  const [plain, setPlain] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const tokens = tokenizeText(text)
  const activeToken = active !== null ? tokens[active] : undefined

  return (
    <div className={`${glass} p-4 sm:p-5`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <ItemBadge letter="E" />
          <span className="text-white/70 text-xs uppercase tracking-wider">Message</span>
        </div>
        <button
          onClick={() => setPlain(!plain)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          {plain ? <Code2 className="w-4 h-4" /> : <Languages className="w-4 h-4" />}
          {plain ? "Show original" : "Plain English"}
        </button>
      </div>

      <p className="text-white text-lg leading-relaxed break-words">
        {plain
          ? plainTokens(text).map((token, i) => (
              <span key={i} className={token.expanded ? "text-orange-200" : undefined}>
                {token.text}
              </span>
            ))
          : tokens.map((token, i) => {
          if (!token.contraction) return <span key={i}>{token.text}</span>
          const isActive = active === i
          return (
            <button
              key={i}
              onClick={() => setActive(isActive ? null : i)}
              onMouseEnter={() => setActive(i)}
              title={token.contraction.meaning}
              className={`rounded px-0.5 underline decoration-dotted underline-offset-4 transition-colors ${
                isActive ? "bg-orange-500 text-white decoration-transparent" : "decoration-orange-300 hover:bg-white/10"
              }`}
            >
              {token.text}
            </button>
          )
        })}
      </p>

      {!plain && (
        <p className="mt-3 min-h-6 text-sm text-white/80">
          {activeToken?.contraction ? (
            <>
              <span className="font-semibold text-white">{activeToken.text}</span> means{" "}
              <span className="text-orange-200">{activeToken.contraction.meaning}</span>
              <span className="text-white/50"> · {activeToken.contraction.category}</span>
            </>
          ) : (
            "Hover or tap an underlined word to see what it means."
          )}
        </p>
      )}
    </div>
  )
}

// Q-line: hover a segment to see what it means
function QLineCard({ raw, q }: { raw: string; q: QLine }) {
  const [active, setActive] = useState<number | null>(null)
  const parts = raw.split("/")

  return (
    <div className={`${glass} p-4 sm:p-5`}>
      <div className="flex items-center gap-2 mb-3">
        <ItemBadge letter="Q" />
        <span className="text-white/70 text-xs uppercase tracking-wider">Qualifier line</span>
      </div>

      <p className="text-white text-sm sm:text-base break-all mb-4">
        {parts.map((part, i) => (
          <span key={i}>
            <span
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === i ? null : i)}
              className={`cursor-pointer rounded px-0.5 transition-colors ${
                active === i ? "bg-orange-500 text-white" : "hover:bg-white/10"
              }`}
            >
              {part}
            </span>
            {i < parts.length - 1 && <span className="text-white/40">/</span>}
          </span>
        ))}
      </p>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
        {Q_SEGMENTS.map((segment, i) => (
          <div
            key={segment.label}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={`flex gap-3 rounded-lg px-2 py-1.5 transition-colors ${active === i ? "bg-white/15" : ""}`}
          >
            <dt className="text-white/60 text-sm w-28 shrink-0">{segment.label}</dt>
            <dd className="text-white text-sm">{segment.values(q)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
