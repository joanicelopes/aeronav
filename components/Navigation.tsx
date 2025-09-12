import { Map, Search, Menu, X } from 'lucide-react';
import { Plane } from "@/components/ui/plane";
import { Globe } from "@/components/ui/Globe";
import { Compass } from "@/components/ui/Compass";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";
import { useState } from "react";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'airport-finder', label: 'Airport Finder', icon: Compass },
    { id: 'maps', label: 'Maps', icon: Globe }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (pageId: string) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Glass navigation bar */}
        <nav className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <button 
              onClick={() => window.location.reload()}
              className="text-white font-medium tracking-tight hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image
                src="/icon-b.svg"
                alt="Plane"
                width={40}
                height={40}
                className="sm:w-[50px] sm:h-[50px]"
              />
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${currentPage === item.id
                      ? 'bg-orange-600 text-orange-100 border border-orange-400/30 shadow-lg backdrop-blur-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  <span>{item.label}</span>
                </button>
              ))}
              
              {/* Theme Toggle */}
              <div className="ml-4">
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/20">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${currentPage === item.id
                        ? 'bg-orange-600 text-orange-100 border border-orange-400/30 shadow-lg backdrop-blur-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="text-base">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-2xl shadow-inner shadow-white/5 pointer-events-none" />
        </nav>

        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl -z-10 opacity-50" />
      </div>
    </div>
  );
}
