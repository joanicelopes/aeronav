import { NextResponse } from "next/server"

// Server-side proxy: aviationweather.gov sends no CORS headers,
// so browsers block direct requests from the client.
export async function GET(request: Request) {
  const icao = new URL(request.url).searchParams.get("ids")?.trim().toUpperCase()

  if (!icao || !/^[A-Z0-9]{3,4}$/.test(icao)) {
    return NextResponse.json({ error: "Invalid ICAO code" }, { status: 400 })
  }

  try {
    const upstream = await fetch(
      `https://aviationweather.gov/api/data/metar?ids=${icao}&format=raw&taf=false`,
      { next: { revalidate: 300 } },
    )

    if (!upstream.ok) {
      return NextResponse.json({ error: `Upstream error ${upstream.status}` }, { status: 502 })
    }

    const text = await upstream.text()
    return new NextResponse(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  } catch {
    return NextResponse.json({ error: "Failed to reach weather service" }, { status: 502 })
  }
}
