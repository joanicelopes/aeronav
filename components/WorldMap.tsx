import { Airport } from './airport-data';

interface WorldMapProps {
  airport?: Airport;
}

export function WorldMap({ airport }: WorldMapProps) {
  // Convert lat/lng to SVG coordinates (simplified projection)
  const getMapPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  const markerPosition = airport ? getMapPosition(airport.latitude, airport.longitude) : null;

  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-10">
      <svg
        width="800"
        height="400"
        viewBox="0 0 800 400"
        className="w-full h-full max-w-4xl"
      >
        {/* Simplified world map outline */}
        <g fill="currentColor" stroke="currentColor" strokeWidth="1">
          {/* North America */}
          <path d="M120 80 L180 70 L220 90 L200 140 L160 160 L120 140 Z" />
          <path d="M140 160 L180 150 L200 180 L160 200 L120 190 Z" />
          
          {/* South America */}
          <path d="M180 200 L220 190 L240 250 L220 320 L180 300 L160 240 Z" />
          
          {/* Europe */}
          <path d="M360 60 L420 50 L440 80 L420 120 L360 110 Z" />
          
          {/* Africa */}
          <path d="M380 120 L440 110 L460 200 L440 280 L400 300 L380 220 Z" />
          
          {/* Asia */}
          <path d="M440 40 L580 30 L620 70 L600 140 L550 160 L440 140 Z" />
          <path d="M500 160 L580 150 L620 200 L580 240 L520 220 Z" />
          
          {/* Australia */}
          <path d="M580 280 L640 270 L660 300 L640 320 L580 310 Z" />
        </g>
        
        {/* Airport marker */}
        {markerPosition && (
          <g>
            {/* Pulsing circle animation */}
            <circle
              cx={markerPosition.x}
              cy={markerPosition.y}
              r="8"
              fill="rgba(59, 130, 246, 0.3)"
              className="animate-ping"
            />
            <circle
              cx={markerPosition.x}
              cy={markerPosition.y}
              r="6"
              fill="rgb(59, 130, 246)"
              stroke="white"
              strokeWidth="2"
            />
            {/* Connection line from center */}
            <line
              x1="400"
              y1="200"
              x2={markerPosition.x}
              y2={markerPosition.y}
              stroke="rgb(59, 130, 246)"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.5"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
