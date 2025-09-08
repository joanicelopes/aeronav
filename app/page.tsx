"use client"

import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { AirportFinderPage } from '../components/AirportFinderPage';
import { MapsPage } from '../components/MapsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('airport-finder');

  const renderPage = () => {
    switch (currentPage) {
      case 'airport-finder':
        return <AirportFinderPage />;
      case 'maps':
        return <MapsPage />;
      default:
        return <AirportFinderPage />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-[url(/airplane-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
      </div>

      {/* Navigation */}
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Page content */}
      {renderPage()}
    </div>
  );
}