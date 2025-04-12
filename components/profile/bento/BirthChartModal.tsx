"use client";

import { useState, useEffect } from "react";
import { BirthChartData } from "@/lib/types/birth-chart";
import { BirthChartWheel } from "@/components/BirthChartWheel";
import { X, Info } from "lucide-react";

interface BirthChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BirthChartData | null;
}

// Aspect symbols
const aspectSymbols: { [key: string]: string } = {
  'Conjunction': '☌',
  'Opposition': '☍',
  'Trine': '△',
  'Square': '□',
  'Sextile': '⚹',
  'Quincunx': '⚻',
  'Semisextile': '⚺'
};

// Planet symbols
const planetSymbols: { [key: string]: string } = {
  'Sun': '☉',
  'Moon': '☽',
  'Mercury': '☿',
  'Venus': '♀',
  'Mars': '♂',
  'Jupiter': '♃',
  'Saturn': '♄',
  'Uranus': '⛢',
  'Neptune': '♆',
  'Pluto': '♇',
  'NorthNode': '☊',
  'Chiron': '⚷'
};

export function BirthChartModal({ isOpen, onClose, data }: BirthChartModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div 
      className="fixed inset-0 bg-accent/20 backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl aspect-square p-4"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the chart from closing the modal
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-16 right-4 z-10 text-white hover:text-white/80 transition-colors bg-accent/50 hover:bg-accent/70 rounded-full p-2 flex items-center justify-center shadow-md"
          aria-label="Close birth chart"
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* Close text */}
        <div className="absolute top-4 left-4 z-10 text-white/90 text-sm font-medium bg-accent/50 rounded-lg px-3 py-1.5">
          Click anywhere to close
        </div>
        
        {/* Birth Chart Wheel */}
        <div className="w-full h-full">
          <BirthChartWheel data={data} />
        </div>
      </div>
    </div>
  );
}
