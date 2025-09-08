import { Airport } from './airport-data';
import { MapPin, Plane, Mountain } from 'lucide-react';

interface AirportCardProps {
  airport: Airport;
}

export function AirportCard({ airport }: AirportCardProps) {
  return (
    <div className="relative">
      {/* Glass card with backdrop blur */}
      <div className="relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        {/* Gradient overlay for extra glass effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative space-y-6">
          {/* ICAO Code Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 backdrop-blur-sm">
            <Plane className="w-4 h-4 mr-2" />
            <span className="font-mono tracking-wider">{`${airport.icao}/${airport.code}`}</span>

          </div>
          
          {/* Airport Name */}
          <div>
            <h2 className="text-3xl font-medium text-white mb-2">
              {airport.name}
            </h2>
            <div className="flex items-center text-white/70">
              <MapPin className="w-4 h-4 mr-2" />
              <span>
                {airport.city 
                ? `${airport.city}, ` 
                : ''}{airport.country_name || ''}
              </span>
            </div>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <div className="text-white/60 text-sm">Coordinates</div>
              <div className="text-white font-mono text-sm">
                {airport.latitude.toFixed(4)}°, {airport.longitude.toFixed(4)}°
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-white/60 text-sm flex items-center">
                <Mountain className="w-3 h-3 mr-1" />
                Elevation
              </div>
              <div className="text-white font-mono text-sm">
                {airport.elevation} ft
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-3xl shadow-inner shadow-white/5 pointer-events-none" />
      </div>
      
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl -z-10 opacity-50" />
    </div>
  );
}
