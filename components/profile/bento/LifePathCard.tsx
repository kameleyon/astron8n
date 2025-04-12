"use client";

import { Split } from "lucide-react";
import { FlipCard } from "./FlipCard";
import { BentoGridItem } from "./BentoGrid";

interface LifePathCardProps {
  lifePathNumber: string | null;
  isLoading?: boolean;
  className?: string;
}

// Life path number descriptions
const lifePathDescriptions: Record<string, string> = {
  "1": "Independent, leader, pioneering, ambitious, courageous",
  "2": "Cooperative, diplomatic, sensitive, peacemaker, intuitive",
  "3": "Creative, expressive, optimistic, social, communicative",
  "4": "Practical, organized, reliable, disciplined, hardworking",
  "5": "Adventurous, versatile, freedom-loving, adaptable, curious",
  "6": "Responsible, nurturing, supportive, harmonious, compassionate",
  "7": "Analytical, introspective, spiritual, perfectionist, wisdom-seeker",
  "8": "Ambitious, authoritative, goal-oriented, material success, power",
  "9": "Humanitarian, compassionate, selfless, idealistic, global perspective",
  "11": "Intuitive, inspirational, idealistic, visionary, spiritual messenger",
  "22": "Master builder, practical visionary, powerful manifester, achiever",
  "33": "Master teacher, nurturing, selfless service, compassionate, spiritual",
};

export function LifePathCard({ lifePathNumber, isLoading = false, className }: LifePathCardProps) {
  const description = lifePathNumber ? lifePathDescriptions[lifePathNumber] || "Unique path and purpose" : "";

  const frontContent = (
    <div className="flex flex-col items-center justify-center text-center">
      <Split className="h-10 w-10 text-white/80 mb-2" />
      <h3 className="text-2xl font-semibold text-white">Life Path</h3>
    </div>
  );

  const backContent = (
    <div className="text-center">
      {lifePathNumber ? (
        <div className="space-y-2">
          <h3 className="text-8xl font-bold text-primary">{lifePathNumber}</h3>
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      ) : isLoading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-gray-200 rounded-full w-8 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      ) : (
        <div className="text-gray-500">
          <p>Life Path not available</p>
          <p className="text-xs mt-1">Complete your birth date to view</p>
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
