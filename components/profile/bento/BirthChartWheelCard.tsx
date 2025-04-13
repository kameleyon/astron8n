"use client";

import Image from "next/image";
import { FlipCard } from "./FlipCard";
import { BentoGridItem } from "./BentoGrid";
import { BirthChartData } from "@/lib/types/birth-chart";
import { Compass, Sun, Moon, Asterisk } from "lucide-react";


interface BirthChartWheelCardProps {
  data: BirthChartData | null;
  isLoading?: boolean;
  className?: string;
}

export function BirthChartWheelCard({ data, isLoading = false, className }: BirthChartWheelCardProps) {
  // Generate a simplified chart data display for the back of the card
  const generateChartDataDisplay = (data: BirthChartData) => {
    const sunSign = data.planets.find(p => p.name === "Sun");
    const moonSign = data.planets.find(p => p.name === "Moon");
    const ascendant = data.ascendant;
    
    return (
      <div className="space-y-3 text-xl mt-8 md:mt-0">
        <div>
         
          <p className="font-regular text-2xl md:text-xl text-primary"><Sun  className="h-12 w-12 sm:h-10 sm:w-10 md:h-10 md:w-10 text-white font-light mb-1 sm:mb-2" />Sun in {sunSign?.sign}</p>
          <p className="text-[#645b4b]">{sunSign?.formatted}</p>
        </div>
        <div>
        <p className="font-regular text-2xl md:text-xl text-primary"><Moon  className="h-12 w-12 sm:h-10 sm:w-10 md:h-10 md:w-10 text-white font-light mb-1 sm:mb-2" />Moon in {moonSign?.sign}</p>
          <p className="text-[#645b4b]">{moonSign?.formatted}</p>
        </div>
        <div>
        <p className="font-regular text-2xl md:text-xl text-primary"><Asterisk  className="h-14 w-14 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white font-light mb-1 sm:mb-2" />Ascendant in {ascendant?.sign}</p>
          <p className="text-[#645b4b]">{ascendant?.formatted}</p>
        </div>
      </div>
    );
  };

  const frontContent = (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {data ? (
        <div className="w-full h-full flex overflow-hidden ">
          <Image 
            src="/astrology/zodiac.png" 
            alt="Zodiac Wheel" 
            fill
            className="object-cover rounded-2xl"
            priority
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <Compass className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary mb-1 sm:mb-2" />
          <h3 className="text-base sm:text-lg font-semibold text-primary">Birth Chart</h3>
          {isLoading ? (
            <p className="text-xs sm:text-sm text-[#645b4b] mt-1 sm:mt-2">Loading chart data...</p>
          ) : (
            <p className="text-xs sm:text-sm text-[#645b4b] mt-1 sm:mt-2">Complete your birth details to view</p>
          )}
        </div>
      )}
    </div>
  );

  const backContent = (
    <div className="w-full h-full p-2">
      {data ? (
        <div className="space-y-3 sm:space-y-4">
          
          {generateChartDataDisplay(data)}
        </div>
      ) : isLoading ? (
        <div className="animate-pulse space-y-3 sm:space-y-4">
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-2 sm:h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="space-y-2 mt-3 sm:mt-4">
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-[#645b4b]">Chart data not available</p>
          <p className="text-xs text-gray-400 mt-1">Complete your birth details to view</p>
        </div>
      )}
    </div>
  );

  return (
    <BentoGridItem colSpan={1} rowSpan={1} className={className}>
      <FlipCard
        frontContent={frontContent}
        backContent={backContent}
      />
    </BentoGridItem>
  );
}
