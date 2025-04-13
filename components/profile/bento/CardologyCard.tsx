"use client";

import { Spade, Heart, Diamond, Club } from "lucide-react";
import { FlipCard } from "./FlipCard";
import { BentoGridItem } from "./BentoGrid";

interface CardologyCardProps {
  birthCard: string | null;
  isLoading?: boolean;
  className?: string;
}

// Helper function to get card suit icon
const getSuitIcon = (card: string) => {
  if (card.includes('♠') || card.includes('Spades')) return <Spade className="h-5 w-5 text-primary" />;
  if (card.includes('♥') || card.includes('Hearts')) return <Heart className="h-5 w-5 text-red-500" fill="currentColor" />;
  if (card.includes('♦') || card.includes('Diamonds')) return <Diamond className="h-5 w-5 text-red-500" fill="currentColor" />;
  if (card.includes('♣') || card.includes('Clubs')) return <Club className="h-5 w-5 text-primary" />;
  return null;
};

// Card descriptions (simplified)
const cardDescriptions: Record<string, string> = {
  "A♠": "Spiritual transformation, mastery of self, leadership",
  "2♠": "Cooperation through separation, diplomacy, balance",
  "3♠": "Work and health, creative expression, communication",
  "4♠": "Foundation, stability, order, practicality",
  "5♠": "Change, freedom, adventure, versatility",
  "6♠": "Harmony, responsibility, balance, nurturing",
  "7♠": "Spirituality, wisdom, introspection, analysis",
  "8♠": "Power, authority, success, material achievement",
  "9♠": "Completion, humanitarianism, compassion, wisdom",
  "10♠": "Mastery, success, accomplishment, culmination",
  "J♠": "Idealistic, creative, spiritual messenger, justice",
  "Q♠": "Wisdom, intelligence, transformation, intuition",
  "K♠": "Mastery of mind, wisdom, authority, leadership",
  // Add more cards as needed
};

export function CardologyCard({ birthCard, isLoading = false, className }: CardologyCardProps) {
  const suitIcon = birthCard ? getSuitIcon(birthCard) : null;
  const description = birthCard ? cardDescriptions[birthCard] || "Your unique card energy" : "";

  const frontContent = (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center justify-center mb-2">
        <Diamond className="h-6 w-6 text-white mr-1" />
        <Club className="h-6 w-6 text-white/80 mr-1" />
        <Heart className="h-6 w-6 text-white/80 mr-1" />
        <Spade className="h-6 w-6 text-white/80 mr-1" />
      </div>
      <h3 className="text-2xl font-semibold text-white">Cardology</h3>
    </div>
  );

  const backContent = (
    <div className="text-center">
      {birthCard ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center">
            <h3 className="text-7xl font-bold text-primary mr-2">{birthCard}</h3>
            {/*{suitIcon}*/}
          </div>
          <p className="text-sm text-[#645b4b]">{description}</p>
        </div>
      ) : isLoading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-gray-200 rounded w-16 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      ) : (
        <div className="text-[#645b4b]">
          <p>Birth Card not available</p>
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
