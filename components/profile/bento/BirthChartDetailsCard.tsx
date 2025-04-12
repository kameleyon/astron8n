"use client";

import { useState } from "react";
import { BentoGridItem } from "./BentoGrid";
import { BirthChartData } from "@/lib/types/birth-chart";
import { Compass, Eye } from "lucide-react";
import { BirthChartModal } from "./BirthChartModal";

interface BirthChartDetailsCardProps {
  data: BirthChartData | null;
  isLoading?: boolean;
  className?: string;
}

export function BirthChartDetailsCard({ data, isLoading = false, className }: BirthChartDetailsCardProps) {
  const [showModal, setShowModal] = useState(false);
  // Function to render all planets
  const renderPlanets = (data: BirthChartData) => {
    return (
      
      <div className="space-y-2">
        
        <h3 className="text-base sm:text-lg font-semibold text-primary">Planets</h3>
        <div className="space-y-1">
          {data.planets.map((planet) => (
            <div key={planet.name} className="flex justify-between text-sm">
              <span className="text-primary font-medium">{planet.name}</span>
              <span className="text-[#645b4b]">
                {planet.sign} {planet.formatted}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-sm">
            <span className="text-primary font-medium">ASC</span>
            <span className="text-[#645b4b]">
              {data.ascendant?.sign} {data.ascendant?.formatted}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-primary font-medium">MC</span>
            <span className="text-[#645b4b]">
              {data.midheaven?.sign} {data.midheaven?.formatted}
            </span>
          </div>
        </div>
      </div>
      
    );
  };
  
  // Function to render houses
  const renderHouses = (data: BirthChartData) => {
    // Function to get planets in a specific house
    const getPlanetsInHouse = (houseNumber: number) => {
      return data.planets.filter(planet => {
        const houseKey = `House_${houseNumber}`;
        const nextHouseKey = `House_${(houseNumber % 12) + 1}`;
        
        const houseCusp = data.houses[houseKey]?.cusp || 0;
        const nextHouseCusp = data.houses[nextHouseKey]?.cusp || 0;
        
        if (nextHouseCusp > houseCusp) {
          return planet.longitude >= houseCusp && planet.longitude < nextHouseCusp;
        } else {
          return planet.longitude >= houseCusp || planet.longitude < nextHouseCusp;
        }
      }).map(planet => planet.name);
    };

    // Get only the 12 standard houses
    const standardHouses = Object.entries(data.houses)
      .filter(([key]) => key.startsWith('House_') && !isNaN(parseInt(key.split('_')[1])) && parseInt(key.split('_')[1]) >= 1 && parseInt(key.split('_')[1]) <= 12);

    return (
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-semibold text-primary">Houses</h3>
        <div className="space-y-1">
          {standardHouses.map(([house, houseData]) => {
            const houseNumber = parseInt(house.split('_')[1]);
            const planetsInHouse = getPlanetsInHouse(houseNumber);
            
            return (
              <div key={house} className="text-sm">
                <div className="flex justify-between">
                  <span className="text-primary font-medium">
                    {houseNumber}{houseNumber === 1 ? 'st' : houseNumber === 2 ? 'nd' : houseNumber === 3 ? 'rd' : 'th'} House
                  </span>
                  <span className="text-[#645b4b]">
                    {houseData.sign} {houseData.formatted}
                  </span>
                </div>
                {planetsInHouse.length > 0 && (
                  <div className="mt-0.5 text-xs text-gray-600">
                    {planetsInHouse.join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Function to render aspects
  const renderAspects = (data: BirthChartData) => {
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

    // Nature abbreviations
    const natureAbbr: { [key: string]: string } = {
      'harmonious': 'H',
      'challenging': 'C',
      'neutral': 'N'
    };

    // Combine all aspects
    const allAspects = data.aspects.slice(0, 15); // Limit to 15 aspects for space

    return (
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-semibold text-primary">Aspects</h3>
        <div className="space-y-1">
          {allAspects.map((aspect, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div className="text-primary font-medium">
                <span className="mr-1">{aspectSymbols[aspect.aspect] || aspect.aspect}</span>
                {aspect.planet1} {aspect.planet2}
              </div>
              <div className="text-[#645b4b]">
                ({natureAbbr[aspect.nature] || aspect.nature.charAt(0)})
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-2 pt-2 border-t border-primary/10 text-xs text-[#645b4b]">
          <div className="flex justify-between">
            <div>H: Harmonious</div>
            <div>C: Challenging</div>
            <div>N: Neutral</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BentoGridItem className={className || ''}>
      {/* Header with gradient - matching profile card */}
      <div className="p-3 sm:p-4 md:p-5 border-b border-secondary/90 bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-md rounded-t-2xl flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          About My Birth Chart
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-white hover:text-white/80 flex items-center gap-1 sm:gap-1.5 transition-colors text-xs sm:text-sm"
          disabled={!data}
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          View My Birth Chart
        </button>
      </div>
      
      <div className="p-4 bg-accent/70 rounded-b-3xl h-full">
        {data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {renderPlanets(data)}
            {renderHouses(data)}
            {renderAspects(data)}
          </div>
        ) : isLoading ? (
          <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-primary/20 rounded w-1/2"></div>
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="h-3 bg-primary/10 rounded w-full"></div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-[#645b4b]">
            <Compass className="h-10 w-10 sm:h-12 sm:w-12 text-primary/40 mb-3 sm:mb-4" />
            <p className="text-center">
              Complete your birth details to view your detailed birth chart
            </p>
          </div>
        )}
      </div>
      
      {/* Birth Chart Modal */}
      {data && (
        <BirthChartModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          data={data} 
        />
      )}
    </BentoGridItem>
  );
}
