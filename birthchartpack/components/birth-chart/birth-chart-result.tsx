"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { InteractiveWheel } from './interactive-wheel'
import { PlanetsSection } from './planets-section'
import { HousesSection } from './houses-section'
import type { 
  BirthChartData, 
  PlanetPosition, 
  HouseData 
} from '@/lib/types/birth-chart'

interface BirthChartResultProps {
  data: BirthChartData
  onBack: () => void
}

export function BirthChartResult({ data, onBack }: BirthChartResultProps) {
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
        .filter((aspect) => aspect.planet1 === planet.name || aspect.planet2 === planet.name)
        .map((aspect) => ({
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
          {/* Birth Chart Wheel */}
          <div className="shadow-lg shadow-black/20 rounded-xl bg-[#0B1121]">
            <InteractiveWheel
              houses={wheelHouses}
              planets={wheelPlanets}
            />
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
