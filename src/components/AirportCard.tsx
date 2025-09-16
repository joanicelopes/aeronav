import { Airport } from './airport-data';
import { MapPin, Plane, Mountain, Cloud, Clock } from 'lucide-react';
import { useState } from 'react';
import { MetarModal } from './MetarModal';
import { decodeMetar } from '../lib/metar-decoder';

interface AirportCardProps {
  airport: Airport;
}

function feetToMeters(feet: number): number {
  const metersPerFoot = 0.3048;
  return Number((feet * metersPerFoot).toFixed(2));
}

export function AirportCard({ airport }: AirportCardProps) {
  const [isMetarModalOpen, setIsMetarModalOpen] = useState(false)
  
  const handleMetarClick = () => {
    if (airport.metar) {
      setIsMetarModalOpen(true)
    }
  }
  
  const decodedMetar = airport.metar ? decodeMetar(airport.metar.rawText) : null

  return (
    <div className="relative">
      {/* Glass card with backdrop blur */}
      <div className="relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        {/* Gradient overlay for extra glass effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative space-y-6">
          {/* Code Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500 border border-orange-400/30 text-orange-200 backdrop-blur-sm">
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
                {`${airport.elevation} ft / ${feetToMeters(airport.elevation)} m`}
              </div>
            </div>
          </div>

          {/* METAR Information */}
          {airport.metar && (
            <div className="pt-4 border-t border-white/20">
              <div className="space-y-3">
                <div className="flex items-center text-white/60 text-sm">
                  <Cloud className="w-4 h-4 mr-2" />
                  <span>Current Weather (METAR)</span>
                </div>
                <div 
                  className="bg-black/20 rounded-lg p-3 backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-colors group"
                  onClick={handleMetarClick}
                >
                  <div className="text-white font-mono text-sm break-all group-hover:text-orange-300 transition-colors">
                    {airport.metar.rawText}
                  </div>
                  <div className="flex items-center justify-between text-white/50 text-xs mt-2">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>
                        Updated: {airport.metar.reportTime.toUTCString()}
                      </span>
                    </div>
                    <span className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to decode →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-3xl shadow-inner shadow-white/5 pointer-events-none" />
      </div>
      
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-600/30 to-black/20 blur-xl -z-10 opacity-70" />
      
      {/* METAR Modal */}
      {decodedMetar && (
        <MetarModal
          isOpen={isMetarModalOpen}
          onClose={() => setIsMetarModalOpen(false)}
          decodedMetar={decodedMetar}
        />
      )}
    </div>
  );
}
