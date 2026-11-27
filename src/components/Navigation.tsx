"use client"

import { Map, Search, Menu, X, FileText } from 'lucide-react';
import { Plane } from "@/components/ui/plane";
import { Globe } from "@/components/ui/Globe";
import { Compass } from "@/components/ui/Compass";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Hide the bar when scrolling down, bring it back when scrolling up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      if (Math.abs(delta) < 8) return; // ignore tiny jitters
      setIsHidden(delta > 0 && y > 80);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Always show it again when changing page
  useEffect(() => {
    setIsHidden(false);
  }, [pathname]);

  const navItems = [
    { href: '/', label: 'Airport Finder', icon: Compass },
    { href: '/map', label: 'Map', icon: Globe },
    { href: '/notam', label: 'NOTAM', icon: FileText }
  ];

  // "/" and "/airport/..." both belong to the finder
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' || pathname.startsWith('/airport') : pathname.startsWith(href);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 p-3 sm:p-6 transition-transform duration-300 ${
        isHidden && !isMobileMenuOpen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Glass navigation bar */}
        <nav className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link
              href="/"
              aria-label="AeroNav home"
              className="text-white font-medium tracking-tight hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image
                src="/icon-b.svg"
                alt="Plane"
                width={40}
                height={40}
                className="sm:w-[50px] sm:h-[50px]"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${isActive(item.href)
                      ? 'bg-orange-600 text-orange-100 border border-orange-400/30 shadow-lg backdrop-blur-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  <span>{item.label}</span>
                </Link>
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
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${isActive(item.href)
                        ? 'bg-orange-600 text-orange-100 border border-orange-400/30 shadow-lg backdrop-blur-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="text-base">{item.label}</span>
                  </Link>
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
