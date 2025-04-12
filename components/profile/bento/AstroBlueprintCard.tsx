"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { GlowingCard } from "./GlowingCard";
import { BentoGridItem } from "./BentoGrid";
import { BirthChartData } from "@/lib/types/birth-chart";
import { generateWithOpenRouter } from "@/lib/services/openrouter";

interface AstroBlueprintCardProps {
  data: BirthChartData | null;
  isLoading?: boolean;
  className?: string;
}

export function AstroBlueprintCard({ data, isLoading = false, className }: AstroBlueprintCardProps) {
  const [personalizedMessage, setPersonalizedMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPersonalizedMessage() {
      if (!data) {
        setLoading(false);
        return;
      }
      
      try {
        const sunPlanet = data.planets.find(p => p.name === 'Sun');
        const moonPlanet = data.planets.find(p => p.name === 'Moon');
        
        // Find any stelliums (3 or more planets in a sign)
        const planetsBySign = data.planets.reduce((acc: Record<string, string[]>, planet) => {
          acc[planet.sign] = (acc[planet.sign] || []).concat(planet.name);
          return acc;
        }, {} as Record<string, string[]>);
        
        const stelliums = Object.entries(planetsBySign)
          .filter(([_, planets]) => planets.length >= 3)
          .map(([sign, planets]) => ({
            sign,
            planets: planets.join(', ')
          }));

        // Find significant aspects
        const significantAspects = data.aspects
          .filter(aspect => {
            const majorAspects = ['Conjunction', 'Trine', 'Square', 'Opposition'];
            return majorAspects.includes(aspect.aspect) && aspect.orb <= 3;
          })
          .slice(0, 2);

        const prompt = `Write a personalized birth chart interpretation for ${data.name} with:
- ${sunPlanet?.sign} Sun
- ${moonPlanet?.sign} Moon
- ${data.ascendant.sign} Ascendant
${stelliums.length > 0 ? `\nNotable stelliums:\n${stelliums.map(s => `- ${s.planets} in ${s.sign}`).join('\n')}` : ''}
${significantAspects.length > 0 ? `\nSignificant aspects:\n${significantAspects.map(a => `- ${a.planet1} ${a.aspect.toLowerCase()} ${a.planet2}`).join('\n')}` : ''}
${data.patterns && data.patterns.length > 0 ? `\nNotable patterns:\n${data.patterns.map(p => `- ${p.name}: ${p.planets.join(', ')}`).join('\n')}` : ''}

Create a warm, welcoming and casual personal message that:
1. Addresses ${data.name} directly by name in a warmed and welcoming way
2. Describes how their Sun, Moon, and Ascendant work together to create their unique personality
3. Highlights the most significant features found in their chart (stelliums, aspects, or patterns)
4. Explains what these placements mean specifically for them
5. Focuses on their natural strengths and special qualities
6. Makes them feel seen and understood
7. Is about 4-5 sentences long
8. Avoids technical jargon
9. DO NOT WRIGHT YOUR THOUGHT PROCESS, YOUR PLANS, JUST START THE MESSAGE DIRECTLY
10. Sign as AstroGenie

Format as a single, flowing paragraph that captures ${data.name}'s unique essence and makes them feel like you're speaking directly to them about their personal cosmic blueprint.`;

        const message = await generateWithOpenRouter(prompt);
        setPersonalizedMessage(message);
      } catch (error) {
        console.error('Error generating personalized message:', error);
        setPersonalizedMessage(`${data.name}, your ${data.ascendant.sign} Ascendant, ${data.planets.find(p => p.name === 'Sun')?.sign} Sun, and ${data.planets.find(p => p.name === 'Moon')?.sign} Moon create a unique cosmic signature that shapes your approach to life.`);
      } finally {
        setLoading(false);
      }
    }

    loadPersonalizedMessage();
  }, [data]);

  return (
    <BentoGridItem colSpan={2} rowSpan={1} className={className}>
      <GlowingCard 
        title="Your Astro Blueprint"
        glowColor="rgba(196, 60, 30, 0.4)"
        className="bg-gradient-to-br from-[#c43c1e] to-[#e85c2c]"
      >
        {data ? (
          loading ? (
            <div className="animate-pulse space-y-2 sm:space-y-3 md:space-y-4">
              <div className="h-3 sm:h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-3 sm:h-4 bg-white/20 rounded w-full"></div>
              <div className="h-3 sm:h-4 bg-white/20 rounded w-5/6"></div>
              <div className="h-3 sm:h-4 bg-white/20 rounded w-4/5"></div>
              <div className="h-3 sm:h-4 bg-white/20 rounded w-full"></div>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-white/90 text-sm sm:text-sm">
              <p>{personalizedMessage}</p>
            </div>
          )
        ) : isLoading ? (
          <div className="animate-pulse space-y-2 sm:space-y-3 md:space-y-4">
            <div className="h-3 sm:h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-3 sm:h-4 bg-white/20 rounded w-full"></div>
            <div className="h-3 sm:h-4 bg-white/20 rounded w-5/6"></div>
            <div className="h-3 sm:h-4 bg-white/20 rounded w-4/5"></div>
            <div className="h-3 sm:h-4 bg-white/20 rounded w-full"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/70">
            <Star className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mb-2 sm:mb-3 md:mb-4 text-white/40" />
            <p className="text-center text-sm sm:text-base">
              Complete your birth details to view your personalized Astro Blueprint
            </p>
          </div>
        )}
      </GlowingCard>
    </BentoGridItem>
  );
}
