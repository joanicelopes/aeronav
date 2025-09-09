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
      {/* Navigation */}
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Page content */}
      {renderPage()}
    </div>
  );
}