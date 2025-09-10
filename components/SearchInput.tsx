"use client"

import type React from "react"

import { Search, X } from "lucide-react"
import { useState } from "react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  placeholder?: string
}

export function SearchInput({ value, onChange, onSearch, placeholder = "Enter ICAO code..." }: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  const clearInput = () => {
    onChange("")
  }

  return (
    <div className="relative max-w-md w-full">
      {/* Glass container */}
      <div
        className={`relative backdrop-blur-lg bg-white/10 border rounded-2xl transition-all duration-300 ${
          isFocused ? "border-black dark:border-orange-500/50 shadow-lg shadow-orange-400/20" : "border-white/20"
        }`}
      >
        {/* Search icon - now clickable */}
        <button
          onClick={onSearch}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 hover:text-orange-400 transition-colors"
        >
          <Search className="w-5 h-5 text-white/60" />
        </button>

        {/* Input field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-white/50 outline-none font-mono tracking-wider"
          maxLength={4}
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={clearInput}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="text-center mt-2 text-white/40 text-sm">Press Enter or click the search icon to search</div>

      {/* Subtle glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-400/10 blur-lg transition-opacity duration-300 -z-10 ${
          isFocused ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}
