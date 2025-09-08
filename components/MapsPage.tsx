export function MapsPage() {
  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 pt-32">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-light text-white tracking-tight">
          Interactive <span className="text-blue-400">Maps</span>
        </h1>
        <p className="text-white/70 text-lg max-w-md">
          Coming soon - Explore airports on an interactive world map
        </p>
      </div>

      {/* Placeholder content with glassmorphism card */}
      <div className="mt-12 backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl max-w-md">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-500/20 border border-blue-400/30 rounded-full flex items-center justify-center">
            <span className="text-blue-200 text-2xl">🗺️</span>
          </div>
          <h3 className="text-xl text-white">Maps Feature</h3>
          <p className="text-white/60 text-sm">
            This section will feature an interactive world map with airport locations, flight paths, and detailed geographic information.
          </p>
        </div>
      </div>
    </div>
  );
}
