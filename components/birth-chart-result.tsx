"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { InteractiveWheel } from './interactive-wheel'
import { PlanetsSection } from './planets-section'
import { HousesSection } from './houses-section'
import { supabase } from '@/lib/supabase/client'
import { generateWithOpenRouter } from '@/lib/services/openrouter'
import type { 
  BirthChartData, 
  PlanetPosition, 
  AspectData, 
  HouseData, 
  PatternData 
} from '@/lib/types/birth-chart'

interface BirthChartResultProps {
  data: BirthChartData
  onBack: () => void
}

// ... (keep all the existing functions and transformations)

export function BirthChartResult({ data, onBack }: BirthChartResultProps) {
  const [personalizedMessage, setPersonalizedMessage] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPersonalizedMessage() {
      try {
        const sunPlanet = data.planets.find((p: PlanetPosition & { name: string }) => p.name === 'Sun')
        const moonPlanet = data.planets.find((p: PlanetPosition & { name: string }) => p.name === 'Moon')
        
        // Find any stelliums (3 or more planets in a sign)
        const planetsBySign = data.planets.reduce((acc: Record<string, string[]>, planet: PlanetPosition & { name: string }) => {
          acc[planet.sign] = (acc[planet.sign] || []).concat(planet.name)
          return acc
        }, {} as Record<string, string[]>)
        
        const stelliums = Object.entries(planetsBySign)
          .filter(([_, planets]) => planets.length >= 3)
          .map(([sign, planets]) => ({
            sign,
            planets: planets.join(', ')
          }))

        // Find significant aspects
        const significantAspects = data.aspects
          .filter((aspect: AspectData) => {
            const majorAspects = ['Conjunction', 'Trine', 'Square', 'Opposition']
            return majorAspects.includes(aspect.aspect) && aspect.orb <= 3
          })
          .slice(0, 2)

        const prompt = `Write a personalized birth chart interpretation for ${data.name} with:
- ${sunPlanet?.sign} Sun
- ${moonPlanet?.sign} Moon
- ${data.ascendant.sign} Ascendant
${stelliums.length > 0 ? `\nNotable stelliums:\n${stelliums.map(s => `- ${s.planets} in ${s.sign}`).join('\n')}` : ''}
${significantAspects.length > 0 ? `\nSignificant aspects:\n${significantAspects.map(a => `- ${a.planet1} ${a.aspect.toLowerCase()} ${a.planet2}`).join('\n')}` : ''}
${data.patterns.length > 0 ? `\nNotable patterns:\n${data.patterns.map((p: PatternData) => `- ${p.name}: ${p.planets.join(', ')}`).join('\n')}` : ''}

Create a warm, personal message that:
1. Addresses ${data.name} directly by name
2. Describes how their Sun, Moon, and Ascendant work together to create their unique personality
3. Highlights the most significant features found in their chart (stelliums, aspects, or patterns)
4. Explains what these placements mean specifically for them
5. Focuses on their natural strengths and special qualities
6. Makes them feel seen and understood
7. Is about 4-5 sentences long
8. Avoids technical jargon

Format as a single, flowing paragraph that captures ${data.name}'s unique essence and makes them feel like you're speaking directly to them about their personal cosmic blueprint.`

        const message = await generateWithOpenRouter(prompt)
        setPersonalizedMessage(message)
      } catch (error) {
        console.error('Error generating personalized message:', error)
        setPersonalizedMessage(`${data.name}, your ${data.ascendant.sign} Ascendant, ${data.planets.find((p: PlanetPosition & { name: string }) => p.name === 'Sun')?.sign} Sun, and ${data.planets.find((p: PlanetPosition & { name: string }) => p.name === 'Moon')?.sign} Moon create a unique cosmic signature that shapes your approach to life.`)
      } finally {
        setLoading(false)
      }
    }

    loadPersonalizedMessage()
  }, [data])

  // Transform planets data into the format expected by components
  const transformPlanets = () => {
    const planetData = data.planets.map((planet: PlanetPosition & { name: string }) => {
      // Find which house contains this planet
      const house = Object.entries(data.houses).find(([key, houseData]: [string, HouseData]) => {
        if (!key.startsWith('House_')) return false
        
        const houseNumber = parseInt(key.split('_')[1])
        const nextHouseNumber = (houseNumber % 12) + 1
        const nextHouseKey = `House_${nextHouseNumber}`
        
        const houseCusp = houseData.cusp
        const nextHouseCusp = data.houses[nextHouseKey].cusp
        
        if (nextHouseCusp > houseCusp) {
          return planet.longitude >= houseCusp && planet.longitude < nextHouseCusp
        } else {
          return planet.longitude >= houseCusp || planet.longitude < nextHouseCusp
        }
      })

      const houseNumber = house ? parseInt(house[0].split('_')[1]) : 1

      // Find aspects for this planet
      const planetAspects = data.aspects
        .filter((aspect: AspectData) => aspect.planet1 === planet.name || aspect.planet2 === planet.name)
        .map((aspect: AspectData) => ({
          planet: aspect.planet1 === planet.name ? aspect.planet2 : aspect.planet1,
          type: aspect.aspect.toLowerCase(),
          degree: aspect.angle.toString()
        }))

      return {
        name: planet.name,
        sign: planet.sign,
        degree: planet.formatted,
        house: houseNumber,
        retrograde: planet.retrograde,
        aspects: planetAspects
      }
    })

    // Add Ascendant and Midheaven
    const ascendant = {
      name: 'ASC',
      sign: data.ascendant.sign,
      degree: data.ascendant.formatted,
      house: 1,
      retrograde: false
    }

    const midheaven = {
      name: 'MC',
      sign: data.midheaven.sign,
      degree: data.midheaven.formatted,
      house: 10,
      retrograde: false
    }

    return [...planetData, ascendant, midheaven]
  }

  // Transform houses data into the format expected by components
  const transformHouses = () => {
    const houseNumbers = Array.from({ length: 12 }, (_, i) => i + 1)
    return houseNumbers.map(number => {
      const houseKey = `House_${number}`
      const houseData = data.houses[houseKey]
      return {
        number,
        sign: houseData.sign,
        degree: houseData.formatted,
        startDegree: houseData.cusp,
        containingPlanets: data.planets
          .filter((planet: PlanetPosition & { name: string }) => {
            const planetDegree = planet.longitude
            const nextHouseKey = `House_${(number % 12) + 1}`
            const nextHouseCusp = data.houses[nextHouseKey].cusp
            const houseCusp = houseData.cusp
            
            if (nextHouseCusp > houseCusp) {
              return planetDegree >= houseCusp && planetDegree < nextHouseCusp
            } else {
              return planetDegree >= houseCusp || planetDegree < nextHouseCusp
            }
          })
          .map((planet: PlanetPosition & { name: string }) => planet.name)
      }
    })
  }

  const wheelHouses = transformHouses()
  const wheelPlanets = transformPlanets()

  // Split planets into two columns
  const midPoint = Math.ceil(wheelPlanets.length / 2)
  const firstColumnPlanets = wheelPlanets.slice(0, midPoint)
  const secondColumnPlanets = wheelPlanets.slice(midPoint)

  return (
    <div className="min-h-screen bg-background text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 mt-14">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg md:text-2xl font-futura mb-1 text-white/80"
            >
              {data.name}&apos;s Birth Chart
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-sm"
            >
              {data.location}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/60 text-sm"
            >
              {data.date} at {data.time}
            </motion.p>
          </div>
          <Button 
            onClick={onBack}
            variant="outline"
            className="text-sm text-white/80"
          >
            Back to Form
          </Button>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Wheel and Blueprint Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Personalized Message - Left Column */}
            <div className="md:col-span-4">
              <div className="shadow-lg shadow-black/20 rounded-xl bg-[#0B1121]">
                <div className="p-6">
                  <h2 className="text-lg font-futura text-white/80 mb-2">Your Cosmic Blueprint</h2>
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                    </div>
                  ) : (
                    <p className="text-sm text-white/60">
                      {personalizedMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Birth Chart Wheel - Right Column */}
            <div className="md:col-span-8">
              <div className="shadow-lg shadow-black/20 rounded-xl bg-[#0B1121]">
                <InteractiveWheel
                  houses={wheelHouses}
                  planets={wheelPlanets}
                />
              </div>
            </div>
          </div>

          {/* Planets and Houses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Planets */}
            <div className="shadow-lg shadow-black/20 rounded-xl bg-[#0B1121]">
              <div className="p-6">
                <h2 className="text-lg font-futura text-white/80 mb-4">Planetary Positions</h2>
                <div className="grid grid-cols-2 gap-0">
                  <div>
                    <PlanetsSection planets={firstColumnPlanets} hideTitle />
                  </div>
                  <div>
                    <PlanetsSection planets={secondColumnPlanets} hideTitle />
                  </div>
                </div>
              </div>
            </div>

            {/* Houses */}
            <div className="shadow-lg shadow-black/20 rounded-xl bg-[#0B1121]">
              <div className="p-6">
                <h2 className="text-lg font-futura text-white/80 mb-4">Houses</h2>
                <div className="grid grid-cols-2 gap-0">
                  <div>
                    <HousesSection houses={wheelHouses.slice(0, 6)} hideTitle />
                  </div>
                  <div>
                    <HousesSection houses={wheelHouses.slice(6)} hideTitle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
