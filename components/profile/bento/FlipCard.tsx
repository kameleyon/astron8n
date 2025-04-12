"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  frontContent: ReactNode;
  backContent: ReactNode;
  className?: string;
  title?: string;
}

export function FlipCard({ frontContent, backContent, className, title }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={cn(
        "relative w-full h-full min-h-[180px] sm:min-h-[200px] perspective-1000 cursor-pointer",
        className
      )}
      onClick={handleFlip}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-3d",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front side */}
        <div
          className="absolute w-full h-full backface-hidden rounded-2xl p-3 sm:p-4 flex flex-col justify-center items-center bg-secondary/90 shadow-md shadow-black/30 border-2 border-white"
        >
          {title && (
            <h3 className="text-lg text-white mb-2">{title}</h3>
          )}
          {frontContent}
        </div>

        {/* Back side */}
        <div
          className="absolute w-full h-full backface-hidden rounded-2xl p-4 flex flex-col justify-center items-center bg-accent/70 border-white rotate-y-180"
        >
          {backContent}
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
      `}</style>
    </div>
  );
}
