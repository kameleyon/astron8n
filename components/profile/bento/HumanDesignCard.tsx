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
          <p className="text-xs sm:text-sm text-[#645b4b] text-left">Authority: {data.authority}</p>
          <p className="text-xs sm:text-sm text-[#645b4b] text-left">Profile: {data.profile}</p>
          <p className="text-xs sm:text-sm text-[#645b4b] text-left">Definition: {data.definition}</p>
          
          {/* Display activated centers for debugging */}
          <div className="mt-2 text-sm text-left border-t pt-2 border-white/80">
            <p className=" mb-1 mt-2">Activated Centers:</p>
            <div className="grid grid-cols-2 gap-x-2 mb-2">
              <p className={data.centers.sacral ? "text-[#645b4b]" : "text-[#cd6301]"}>
                Sacral: {data.centers.sacral ? "Yes" : "No"}
              </p>
              <p className={data.centers.heart ? "text-[#645b4b]" : "text-[#cd6301]"}>
                Heart: {data.centers.heart ? "Yes" : "No"}
              </p>
              <p className={data.centers.solar ? "text-[#645b4b]" : "text-[#cd6301]"}>
                Solar: {data.centers.solar ? "Yes" : "No"}
              </p>
              <p className={data.centers.root ? "text-[#645b4b]" : "text-[#cd6301]"}>
                Root: {data.centers.root ? "Yes" : "No"}
              </p>
            </div>
          </div>
          <div className="mt-3 text-sm text-left border-t pt-2 border-white/80">
            <p className="mb-1 mt-2 ">What This Means:</p>
            {data.type === 'Generator' && (
              <p className="text-[#645b4b]">
                As a Generator, you have sustainable life force energy. Your strategy is to wait to respond before taking action. Your {data.authority} authority guides your decisions through {data.authority === 'Sacral' ? 'gut feelings' : data.authority === 'Emotional' ? 'emotional clarity over time' : 'inner knowing'}.
              </p>
            )}
            {data.type === 'Manifesting Generator' && (
              <p className="text-[#645b4b]">
                As a Manifesting Generator, you have sustainable energy with the ability to manifest quickly. Wait to respond, then move fast. Your {data.authority} authority helps you make authentic decisions through {data.authority === 'Sacral' ? 'gut responses' : data.authority === 'Emotional' ? 'emotional waves' : 'intuitive signals'}.
              </p>
            )}
            {data.type === 'Projector' && (
              <p className="text-[#645b4b]">
                As a Projector, you have focused but not sustainable energy. Wait for recognition and invitation before taking action. Your {data.authority} guides your decisions through {data.authority === 'Emotional' ? 'emotional clarity' : data.authority === 'Self' ? 'inner truth' : 'intuitive awareness'}.
              </p>
            )}
            {data.type === 'Manifestor' && (
              <p className="text-[#645b4b]">
                As a Manifestor, you initiate and have independent energy. Your strategy is to inform others before taking action. Your {data.authority} helps you make decisions through {data.authority === 'Emotional' ? 'emotional clarity' : 'inner guidance'}.
              </p>
            )}
            {data.type === 'Reflector' && (
              <p className="text-[#645b4b]">
                As a Reflector, you reflect the energy around you. Wait a full lunar cycle (28 days) before making major decisions. You're sensitive to environments and serve as a mirror for your community.
              </p>
            )}
          </div>
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
