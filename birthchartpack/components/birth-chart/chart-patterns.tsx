"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { type ZodiacSign } from './zodiac-icon'
import type { PatternData, SpecialFeature, PatternPlanetData } from '../../lib/types/birth-chart'

interface ChartPatternsProps {
  patterns: PatternData[]
  features: SpecialFeature[]
}

export function ChartPatterns({ patterns, features }: ChartPatternsProps) {
  // Helper function to get pattern badge
  const getPatternBadge = (pattern: PatternData) => {
    const isMajor = pattern.planets.length > 3
    return (
      <span className={`px-2 py-0.5 rounded text-xs ${
        isMajor 
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      }`}>
        {isMajor ? 'Major' : 'Minor'}
      </span>
    )
  }

  // Helper function to get pattern symbol
  const getPatternSymbol = (name: string) => {
    const symbols: Record<string, string> = {
      // Distribution Patterns
      'Bucket': '⚏',      // Handle with planets
      'Bowl': '◗',        // Half circle
      'Bundle': '◎',      // Concentrated circle
      'Locomotive': '🚂',  // Moving train
      'Splash': '✺',      // Scattered stars
      'Seesaw': '⚖',      // Balance scales
      
      // Major Patterns
      'Grand Cross': '⊞',    // Cross shape
      'Grand Trine': '△',    // Triangle
      'Mystic Rectangle': '▭', // Rectangle with mystical properties
      'Yod': '⚹',            // Finger of God
      'Star of David': '✡',   // Two interlocking triangles
      'Grand Sextile': '⬡',   // Hexagon
      'Kite': '⟁',           // Kite shape
      'T-Square': '⊥',       // T shape
      'Thor\'s Hammer': '⚒',  // Hammer symbol
      
      // Minor Patterns
      'Cradle': '⚐',         // Flag or cradle shape
      'Rectangle': '▭',       // Basic rectangle
      'Stellium': '⭐',       // Star cluster
      'Double T-Square': '⫛',  // Double T shape
      'Wedge': '⊿',          // Triangle pointing up
      'Castle': '⚔',         // Crossed swords
      'Trapezoid': '⏢',      // Trapezoid shape
      'Pentagram': '⭐',      // Five-pointed star
      'Grand Quintile': '⭔',  // Five-pointed shape
      'Rosetta': '❀',        // Flower pattern
      'Boomerang Yod': '↺',   // Curved arrow
      'Arrowhead': '▲',      // Pointing triangle
      'Star': '★',           // Basic star
      'Crossbow': '⚹',       // Bow and arrow
      'Butterfly': '⋈',      // Butterfly shape
      'Basket': '⌒',         // Curved bottom
      'Diamond': '◇',        // Diamond shape
      'Hexagon': '⬢',        // Six-sided
      'Shield': '⛨',         // Protection symbol
      'Arrow': '→',          // Direction
      'Hourglass': '⧗'       // Time symbol
    }
    return symbols[name] || '•'
  }

  // Helper function to format planet position
  const formatPlanetPosition = (planet: PatternPlanetData) => {
    return `${planet.name} in ${planet.degree} ${planet.sign}`
  }

  // Helper function to render planets list
  const renderPlanets = (planets: PatternPlanetData[]) => {
    return (
      <div className="space-y-1 text-sm text-[#645b4b] dark:text-gray-400">
        {planets.map((planet, i) => (
          <div key={i}>{formatPlanetPosition(planet)}</div>
        ))}
      </div>
    )
  }

  // Split patterns into two columns
  const halfLength = Math.ceil(patterns.length / 2)
  const leftColumnPatterns = patterns.slice(0, halfLength)
  const rightColumnPatterns = patterns.slice(halfLength)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 space-y-6"
    >
      <h2 className="text-lg font-futura text-gray-900 dark:text-white">Chart Patterns</h2>
      
      {/* Pattern Sections in Two Columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {leftColumnPatterns.map((pattern, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-[#D15200] dark:text-[#FFA600] text-sm">
                  {getPatternSymbol(pattern.name)} {pattern.name}
                </span>
                {getPatternBadge(pattern)}
              </div>
              <div className="pl-4 space-y-2">
                {renderPlanets(pattern.planets)}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {rightColumnPatterns.map((pattern, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-[#D15200] dark:text-[#FFA600] text-sm">
                  {getPatternSymbol(pattern.name)} {pattern.name}
                </span>
                {getPatternBadge(pattern)}
              </div>
              <div className="pl-4 space-y-2">
                {renderPlanets(pattern.planets)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Features */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Special Features</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {features.slice(0, Math.ceil(features.length / 2)).map((feature, index) => (
              <div key={index} className="text-sm text-[#645b4b] dark:text-gray-300">
                • {feature.description}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {features.slice(Math.ceil(features.length / 2)).map((feature, index) => (
              <div key={index} className="text-sm text-[#645b4b] dark:text-gray-300">
                • {feature.description}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
