"use client";

import { useState, useEffect } from "react";
import { Codesandbox } from "lucide-react";
import { FlipCard } from "./FlipCard";
import { BentoGridItem } from "./BentoGrid";
import { HumanDesignProfile } from "@/lib/utils/humanDesign";
import { generateWithOpenRouter } from "@/lib/services/openrouter";

interface HumanDesignCardProps {
  data: HumanDesignProfile | null;
  isLoading?: boolean;
  className?: string;
  userName?: string;
}

export function HumanDesignCard({ data, isLoading = false, className, userName = "there" }: HumanDesignCardProps) {
  const [personalizedMessage, setPersonalizedMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generatePersonalizedMessage() {
      if (!data) {
        setLoading(false);
        return;
      }
      
      try {
        // Count active centers
        const activeCenters = Object.entries(data.centers)
          .filter(([_, isActive]) => isActive)
          .map(([center]) => center);
        
        // Count undefined centers
        const undefinedCenters = Object.entries(data.centers)
          .filter(([_, isActive]) => !isActive)
          .map(([center]) => center);

        const prompt = `Write a personalized Human Design interpretation for ${userName} with:
- Type: ${data.type}
- Authority: ${data.authority}
- Profile: ${data.profile}
- Definition: ${data.definition}
- Active Centers: ${activeCenters.join(', ')}
- Undefined Centers: ${undefinedCenters.join(', ')}
- Channels: ${data.channels.join(', ')}

Create a warm, welcoming and casual personal message that:
1. Addresses ${userName} directly by name in a warm and welcoming way
2. Explains what their Human Design Type (${data.type}) means for them personally
3. Describes how their Authority (${data.authority}) guides their decision-making process
4. Mentions the significance of their Profile (${data.profile})
5. Highlights 1-2 key insights about their active centers and what strengths they provide
6. Mentions 1-2 key insights about their undefined centers and what this means for them
7. Makes them feel seen and understood
8. Is VERY CONCISE - no more than 3-4 short sentences total
9. Avoids technical jargon
10. DO NOT WRITE YOUR THOUGHT PROCESS OR PLANS, JUST START THE MESSAGE DIRECTLY
11. Sign as AstroGenie

Format as a single, flowing paragraph that captures their unique Human Design essence and makes them feel like you're speaking directly to them about their personal energetic blueprint.`;

        const message = await generateWithOpenRouter(prompt);
        setPersonalizedMessage(message);
      } catch (error) {
        console.error('Error generating personalized message:', error);
        // Fallback message if generation fails
        setPersonalizedMessage(`Hey ${userName}! As a ${data.type} with ${data.authority} authority and a ${data.profile} profile, you have a unique energetic blueprint that shapes how you interact with the world. Your ${data.definition} definition creates a specific pattern of energy flow through your design.`);
      } finally {
        setLoading(false);
      }
    }

    generatePersonalizedMessage();
  }, [data, userName]);
  const frontContent = (
    <div className="flex flex-col items-center justify-center text-center ">
     <Codesandbox  className="h-10 w-10 sm:h-9 sm:w-9 md:h-9 md:w-9 text-white font-light mb-1 sm:mb-2" />
      <h3 className="text-2xl sm:text-2xl font-regular text-white">Human Design</h3>
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
              <p className={data.centers.head ? "text-[#645b4b]" : "text-[#cd6301]"}>
                Head: {data.centers.head ? "Yes" : "No"}
              </p>
              <p className={data.centers.ajna ? "text-[#645b4b]" : "text-[#cd6301]"}>
                Ajna: {data.centers.ajna ? "Yes" : "No"}
              </p>
              <p className={data.centers.throat ? "text-[#645b4b]" : "text-[#cd6301]"}>
                Throat: {data.centers.throat ? "Yes" : "No"}
              </p>
              <p className={data.centers.gCenter ? "text-[#645b4b]" : "text-[#cd6301]"}>
                G Center: {data.centers.gCenter ? "Yes" : "No"}
              </p>
              <p className={data.centers.spleen ? "text-[#645b4b]" : "text-[#cd6301]"}>
                Spleen: {data.centers.spleen ? "Yes" : "No"}
              </p>
            </div>
          </div>
          <div className="mt-3 text-sm text-left border-t pt-2 border-white/80">
          {/* Display a text to explain what his means*/}
            <p className="mb-1 mt-2 ">What This Means:</p>
            <div className="max-h-52 overflow-y-auto pr-1 custom-scrollbar ">
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-3 bg-white/20 rounded w-full"></div>
                  <div className="h-3 bg-white/20 rounded w-5/6"></div>
                  <div className="h-3 bg-white/20 rounded w-full"></div>
                  <div className="h-3 bg-white/20 rounded w-4/5"></div>
                </div>
              ) : (
                <p className="text-[#645b4b]">{personalizedMessage}</p>
              )}
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="animate-pulse space-y-1 sm:space-y-2">
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
      ) : (
        <div className="text-[#645b4b]">
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
