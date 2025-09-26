import { X, Thermometer, Droplets, Wind, Eye, Cloud, Gauge } from 'lucide-react'
import { DecodedMetar, formatWind, formatVisibility } from '../lib/metar-decoder'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

interface MetarModalProps {
  isOpen: boolean
  onClose: () => void
  decodedMetar: DecodedMetar
}

export function MetarModal({ isOpen, onClose, decodedMetar }: MetarModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] overflow-y-auto">
        <div className="relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl">
          {/* Gradient overlay for extra glass effect */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Decoded METAR</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-3 sm:p-4 md:p-6">
            {/* Raw METAR */}
            <div className="bg-black/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <h3 className="text-xs sm:text-sm font-medium text-white/60 mb-2">Raw METAR</h3>
              <p className="text-white font-mono text-xs sm:text-sm break-all">
                {decodedMetar.rawText}
              </p>
            </div>
            
            {/* Weather Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {/* Temperature */}
              <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                  <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                  <div>
                    <div className="text-xs text-white/60">Temperature</div>
                    <div className="text-sm sm:text-lg font-semibold text-white">
                      {decodedMetar.temperature !== null 
                        ? `${decodedMetar.temperature}°C` 
                        : 'N/A'
                      }
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Dew Point */}
              <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                  <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  <div>
                    <div className="text-xs text-white/60">Dew Point</div>
                    <div className="text-sm sm:text-lg font-semibold text-white">
                      {decodedMetar.dewPoint !== null 
                        ? `${decodedMetar.dewPoint}°C` 
                        : 'N/A'
                      }
                    </div>
                  </div>
                </div>
              </div>
              
              
              {/* Visibility */}
              <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  <div>
                    <div className="text-xs text-white/60">Visibility</div>
                    <div className="text-sm sm:text-lg font-semibold text-white">
                      {formatVisibility(decodedMetar.visibility, decodedMetar.visibilityUnit)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pressure */}
              <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                  <Gauge className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  <div>
                    <div className="text-xs text-white/60">Pressure</div>
                    <div className="text-sm sm:text-lg font-semibold text-white">
                      {decodedMetar.pressure !== null 
                        ? `${decodedMetar.pressure} ${decodedMetar.pressureUnit || 'hPa'}` 
                        : 'N/A'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Wind Information */}
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
              <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <h3 className="text-sm sm:text-base font-semibold text-white">Wind</h3>
              </div>
              <div className="grid grid-cols-1 gap-1 sm:gap-2">
                {decodedMetar.windDirection !== null && (
                  <div className="flex justify-between items-center text-white">
                    <span className="font-medium text-xs sm:text-sm">Direction</span>
                    <span className="text-white/60 text-xs sm:text-sm">
                      {decodedMetar.windDirection}°
                    </span>
                  </div>
                )}
                {decodedMetar.windSpeed !== null && (
                  <div className="flex justify-between items-center text-white">
                    <span className="font-medium text-xs sm:text-sm">Speed</span>
                    <span className="text-white/60 text-xs sm:text-sm">
                      {decodedMetar.windSpeed} kt
                    </span>
                  </div>
                )}
                {decodedMetar.windGusts !== null && (
                  <div className="flex justify-between items-center text-white bg-black/20 rounded p-1.5 sm:p-2">
                    <span className="font-medium text-xs sm:text-sm">Gusts</span>
                    <span className="text-white/60 text-xs sm:text-sm">
                      {decodedMetar.windGusts} kt
                    </span>
                  </div>
                )}
                {decodedMetar.windDirection === null && decodedMetar.windSpeed === null && (
                  <div className="text-white/60 text-xs sm:text-sm text-center">No wind data</div>
                )}
              </div>
            </div>
            
            {/* Cloud Cover */}
            {decodedMetar.cloudCover.length > 0 && (
              <div className="bg-white/5 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  <h3 className="text-sm sm:text-lg font-semibold text-white">Cloud Cover</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                  {decodedMetar.cloudCover.map((cloud, index) => (
                    <div key={index} className="flex flex-col items-center text-center bg-black/20 rounded-lg p-2 sm:p-3">
                      <span className="font-medium text-white text-xs sm:text-sm">{cloud.coverage}</span>
                      <span className="text-white/60 text-xs">
                        {cloud.altitude > 0 ? `${cloud.altitude} ft` : 'Surface'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-3xl shadow-inner shadow-white/5 pointer-events-none" />
        </div>
      </div>
    </div>,
    document.body
  )
}
