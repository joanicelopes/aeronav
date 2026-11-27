// Parser for ICAO-format NOTAMs:
//
//   A0123/26 NOTAMN
//   Q) GVSC/QMRLC/IV/NBO/A/000/999/1644N02257W005
//   A) GVAC B) 2612010800 C) 2612011600
//   D) DLY 0800-1600
//   E) RWY 01/19 CLSD DUE WIP.
//   F) SFC G) FL150

import { findContraction, type Contraction } from "./notam-contractions"

export type NotamItemKey = "Q" | "A" | "B" | "C" | "D" | "E" | "F" | "G"

export interface NotamField {
  key: NotamItemKey
  label: string
  raw: string
  meaning: string
}

export interface QLine {
  fir: string
  code: string
  subject: string
  condition: string
  traffic: string
  purpose: string
  scope: string
  lower: string
  upper: string
  coordinates: string
  radius: string
}

export interface DecodedNotam {
  raw: string
  id?: string
  type?: string
  typeMeaning?: string
  replaces?: string
  qLine?: QLine
  fields: NotamField[]
}

export const ITEM_LABELS: Record<NotamItemKey, string> = {
  Q: "Qualifier line",
  A: "Location",
  B: "Valid from",
  C: "Valid until",
  D: "Schedule",
  E: "Message",
  F: "Lower limit",
  G: "Upper limit",
}

const NOTAM_TYPES: Record<string, string> = {
  NOTAMN: "New NOTAM",
  NOTAMR: "Replaces an earlier NOTAM",
  NOTAMC: "Cancels an earlier NOTAM",
}

// Q-code letters 2-3: what the NOTAM is about
export const Q_SUBJECTS: Record<string, string> = {
  FA: "Aerodrome",
  FF: "Fire fighting and rescue",
  FU: "Fuel availability",
  MR: "Runway",
  MX: "Taxiway",
  MA: "Movement area",
  MN: "Apron",
  MP: "Aircraft stands",
  MT: "Threshold",
  MD: "Declared distances",
  IC: "Instrument landing system (ILS)",
  IL: "ILS localizer",
  IG: "ILS glide path",
  ID: "DME associated with ILS",
  NV: "VOR",
  ND: "DME",
  NB: "Non-directional beacon (NDB)",
  NM: "VOR/DME",
  GA: "GNSS airfield-specific operations",
  LP: "Precision approach path indicator (PAPI)",
  LA: "Approach lighting system",
  LE: "Runway edge lights",
  LC: "Runway centre line lights",
  LX: "Taxiway centre line lights",
  LB: "Aerodrome beacon",
  LR: "All landing area lighting",
  OB: "Obstacle",
  OL: "Obstacle lights",
  PI: "Instrument approach procedure",
  PD: "Standard instrument departure (SID)",
  PA: "Standard instrument arrival (STAR)",
  RD: "Danger area",
  RR: "Restricted area",
  RP: "Prohibited area",
  RT: "Temporary restricted area",
  RA: "Airspace reservation",
  WE: "Exercises",
  WM: "Missile, gun or rocket firing",
  WU: "Unmanned aircraft",
  WP: "Parachute jumping exercise",
  AC: "Control zone (CTR)",
  AT: "Terminal control area (TMA)",
  AF: "Flight information region (FIR)",
  CA: "Air/ground radio facility",
  ST: "Aerodrome control tower",
  SA: "Automatic terminal information service (ATIS)",
  XX: "Plain language (see item E)",
}

// Q-code letters 4-5: what happened to it
export const Q_CONDITIONS: Record<string, string> = {
  LC: "Closed",
  AS: "Unserviceable",
  AU: "Not available",
  AO: "Operational",
  AK: "Resumed normal operation",
  CA: "Activated",
  CD: "Deactivated",
  CH: "Changed",
  CN: "Cancelled",
  CE: "Erected",
  CS: "Installed",
  CM: "Displaced",
  HW: "Work in progress",
  LT: "Limited to",
  AH: "Hours of service changed",
  XX: "Plain language (see item E)",
}

const TRAFFIC: Record<string, string> = {
  I: "IFR traffic",
  V: "VFR traffic",
  IV: "IFR and VFR traffic",
  K: "Checklist",
}

const PURPOSE: Record<string, string> = {
  N: "Immediate attention of crews",
  B: "Pre-flight information bulletin",
  O: "Flight operations",
  M: "Miscellaneous",
  K: "Checklist",
}

const SCOPE: Record<string, string> = {
  A: "Aerodrome",
  E: "En-route",
  W: "Navigation warning",
  AE: "Aerodrome and en-route",
  AW: "Aerodrome and navigation warning",
  K: "Checklist",
}

function describeLetters(value: string, table: Record<string, string>): string {
  if (table[value]) return table[value]
  // e.g. purpose "NBO" -> each letter on its own
  return value
    .split("")
    .map((ch) => table[ch] ?? ch)
    .join(" + ")
}

/** "2612010800" -> "01 Dec 2026, 08:00 UTC" */
export function formatNotamDate(raw: string): string {
  const value = raw.trim().toUpperCase()
  if (value === "PERM") return "Permanent"
  const match = value.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\s*EST)?$/)
  if (!match) return value
  const [, yy, mm, dd, hh, min, est] = match
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = months[Number(mm) - 1] ?? mm
  const text = `${dd} ${month} 20${yy}, ${hh}:${min} UTC`
  return est ? `${text} (estimated)` : text
}

function formatLevel(value: string): string {
  const v = value.trim().toUpperCase()
  if (v === "SFC" || v === "GND") return "Surface"
  if (v === "UNL") return "Unlimited"
  if (/^FL\d+$/.test(v)) return `Flight level ${Number(v.slice(2))} (about ${Number(v.slice(2)) * 100} ft)`
  const ft = v.match(/^(\d+)\s*FT\s*(AMSL|AGL)?$/)
  if (ft) return `${Number(ft[1]).toLocaleString("en-US")} ft${ft[2] ? ` ${ft[2]}` : ""}`
  return v
}

/** "1644N02257W" -> "16°44'N 022°57'W" */
function formatCoordinates(value: string): string {
  const m = value.match(/^(\d{2})(\d{2})([NS])(\d{3})(\d{2})([EW])$/)
  if (!m) return value
  return `${m[1]}°${m[2]}'${m[3]} ${m[4]}°${m[5]}'${m[6]}`
}

function parseQLine(raw: string): QLine | undefined {
  const parts = raw.trim().split("/")
  if (parts.length < 8) return undefined
  const [fir, code, traffic, purpose, scope, lower, upper, geo] = parts
  const subjectCode = code.slice(1, 3)
  const conditionCode = code.slice(3, 5)
  const geoMatch = geo.match(/^(\d{4}[NS]\d{5}[EW])(\d{3})?$/)
  // Q-line levels are flight levels in hundreds of feet: "003" = 300 ft
  const toFl = (v: string) =>
    v === "999" ? "Unlimited" : v === "000" ? "Surface" : `FL${v} (${(Number(v) * 100).toLocaleString("en-US")} ft)`

  return {
    fir,
    code,
    subject: `${subjectCode}: ${Q_SUBJECTS[subjectCode] ?? "Unknown subject"}`,
    condition: `${conditionCode}: ${Q_CONDITIONS[conditionCode] ?? "Unknown condition"}`,
    traffic: describeLetters(traffic, TRAFFIC),
    purpose: describeLetters(purpose, PURPOSE),
    scope: describeLetters(scope, SCOPE),
    lower: toFl(lower),
    upper: toFl(upper),
    coordinates: geoMatch ? formatCoordinates(geoMatch[1]) : geo,
    radius: geoMatch?.[2] ? `${Number(geoMatch[2])} NM` : "",
  }
}

export function decodeNotam(input: string): DecodedNotam {
  const raw = input.trim().toUpperCase()
  const result: DecodedNotam = { raw, fields: [] }

  // Header, e.g. "A0123/26 NOTAMR A0101/26"
  const header = raw.match(/^\(?\s*([A-Z]\d{4}\/\d{2})\s+(NOTAM[NRC])(?:\s+([A-Z]\d{4}\/\d{2}))?/)
  if (header) {
    result.id = header[1]
    result.type = header[2]
    result.typeMeaning = NOTAM_TYPES[header[2]]
    result.replaces = header[3]
  }

  // Split into "Q) ..." "A) ..." items
  const itemRegex = /(?:^|\s)([QABCDEFG])\)\s*/g
  const marks: { key: NotamItemKey; start: number; end: number }[] = []
  let m: RegExpExecArray | null
  while ((m = itemRegex.exec(raw))) {
    marks.push({ key: m[1] as NotamItemKey, start: m.index, end: itemRegex.lastIndex })
  }

  marks.forEach((mark, i) => {
    const next = marks[i + 1]
    const value = raw
      .slice(mark.end, next ? next.start : raw.length)
      .replace(/\)\s*$/, "")
      .trim()
    result.fields.push({
      key: mark.key,
      label: ITEM_LABELS[mark.key],
      raw: value,
      meaning: describeField(mark.key, value),
    })
    if (mark.key === "Q") result.qLine = parseQLine(value)
  })

  return result
}

function describeField(key: NotamItemKey, value: string): string {
  switch (key) {
    case "Q":
      return "Coded summary: FIR, subject, condition, traffic, purpose, scope, levels and area."
    case "A":
      return `ICAO location indicator${value.includes(" ") ? "s" : ""}: ${value}`
    case "B":
    case "C":
      return formatNotamDate(value)
    case "D":
      return expandText(value)
    case "E":
      return expandText(value)
    case "F":
    case "G":
      return formatLevel(value)
  }
}

export interface TextToken {
  text: string
  contraction?: Contraction
}

/** Split free text into tokens, tagging any known contraction. Whitespace is kept as its own tokens. */
export function tokenizeText(text: string): TextToken[] {
  const tokens: TextToken[] = []
  const parts = text.split(/(\s+)/)
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (!part) continue
    if (/^\s+$/.test(part)) {
      tokens.push({ text: part })
      continue
    }
    // "NOT AVBL" is two words but one contraction
    if (part.toUpperCase() === "NOT" && parts[i + 2]?.replace(/[.,;:]+$/, "").toUpperCase() === "AVBL") {
      const trailing = parts[i + 2].slice(4)
      tokens.push({ text: `NOT${parts[i + 1]}AVBL`, contraction: findContraction("NOT AVBL") })
      if (trailing) tokens.push({ text: trailing })
      i += 2
      continue
    }
    const core = part.replace(/^[(]+/, "").replace(/[.,;:)]+$/, "")
    const lead = part.slice(0, part.indexOf(core))
    const trail = part.slice(part.indexOf(core) + core.length)
    const contraction = core ? findContraction(core) : undefined
    if (contraction) {
      if (lead) tokens.push({ text: lead })
      tokens.push({ text: core, contraction })
      if (trail) tokens.push({ text: trail })
    } else {
      tokens.push({ text: part })
    }
  }
  return tokens
}

export interface PlainToken {
  text: string
  expanded: boolean
}

/**
 * Rewrite NOTAM text as readable sentences: contractions become their meaning,
 * other plain words are lowercased, and each sentence starts with a capital.
 * Codes like "01/19", "345KHZ" or "'PR'" are left alone.
 */
export function plainTokens(text: string): PlainToken[] {
  let sentenceStart = true
  return tokenizeText(text).map((t) => {
    if (/^\s+$/.test(t.text)) return { text: t.text, expanded: false }

    let word = t.contraction
      ? t.contraction.meaning.replace(/\s*\(.*\)$/, "").toLowerCase()
      : // plain words like "AVOID" or "AREA." get lowercased; single letters are names ("TWY B")
        t.text.replace(/^[A-Z]{2,}(?=[.,;:)]*$)/, (w) => w.toLowerCase())
    if (sentenceStart && /^[a-z]/.test(word)) word = word[0].toUpperCase() + word.slice(1)
    sentenceStart = /\.$/.test(t.text)
    return { text: word, expanded: Boolean(t.contraction) }
  })
}

/** Replace contractions with their plain-English meaning. */
export function expandText(text: string): string {
  return plainTokens(text)
    .map((t) => t.text)
    .join("")
}
