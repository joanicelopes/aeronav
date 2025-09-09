import { Map, Search } from 'lucide-react';
import { Plane } from "@/components/ui/plane";
import { Globe } from "@/components/ui/Globe";
import { Compass } from "@/components/ui/Compass";
import { ThemeToggle } from "./theme-toggle";


interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: 'airport-finder', label: 'Airport Finder', icon: Compass },
    { id: 'maps', label: 'Maps', icon: Globe }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Glass navigation bar */}
        <nav className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="text-white font-medium tracking-tight">
              <Plane className="w-2 h-2 text-orange-200 animate-bounce" />
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
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
          </div>

          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-2xl shadow-inner shadow-white/5 pointer-events-none" />
        </nav>

        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl -z-10 opacity-50" />
      </div>
    </div>
  );
}
