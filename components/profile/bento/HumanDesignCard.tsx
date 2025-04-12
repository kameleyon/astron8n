"use client";

import { Codesandbox } from "lucide-react";
import { FlipCard } from "./FlipCard";
import { BentoGridItem } from "./BentoGrid";
import { HumanDesignProfile } from "@/lib/utils/humanDesign";

interface HumanDesignCardProps {
  data: HumanDesignProfile | null;
  isLoading?: boolean;
  className?: string;
}

export function HumanDesignCard({ data, isLoading = false, className }: HumanDesignCardProps) {
  const frontContent = (
    <div className="flex flex-col items-center justify-center text-center ">
     <Codesandbox  className="h-8 w-8 sm:h-9 sm:w-9 md:h-9 md:w-9 text-white font-light mb-1 sm:mb-2" />
      <h3 className="text-base sm:text-2xl font-regular text-white">Human Design</h3>
    </div>
  );

  const backContent = (
    <div className="text-center ">
      {data ? (
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-base sm:text-lg font-semibold text-primary">{data.type}</h3>
          <p className="text-xs sm:text-sm text-gray-700">Authority: {data.authority}</p>
          <p className="text-xs sm:text-sm text-gray-700">Profile: {data.profile}</p>
          <p className="text-xs sm:text-sm text-gray-700">Definition: {data.definition}</p>
        </div>
      ) : isLoading ? (
        <div className="animate-pulse space-y-1 sm:space-y-2">
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
      ) : (
        <div className="text-gray-500">
          <p className="text-sm">Human Design data not available</p>
          <p className="text-xs mt-1">Complete your birth details to view</p>
        </div>
      )}
    </div>
  );

  return (
    <BentoGridItem className={className}>
      <FlipCard
        frontContent={frontContent}
        backContent={backContent}
      />
    </BentoGridItem>
  );
}
