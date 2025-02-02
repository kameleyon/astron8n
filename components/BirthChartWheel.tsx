"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { BirthChartData } from "@/lib/types/birth-chart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BirthChartWheelProps {
  data: BirthChartData;
}

const planetSymbols: { [key: string]: string } = {
  'Sun': '☉',
  'Moon': '☽',
  'Mercury': '☿',
  'Venus': '♀',
  'Mars': '♂',
  'Jupiter': '♃',
  'Saturn': '♄',
  'Uranus': '⛢',
  'Neptune': '♆',
  'Pluto': '♇',
  'NorthNode': '☊',
  'Chiron': '⚷'
};

export function BirthChartWheel({ data }: BirthChartWheelProps) {
  // Calculate positions based on actual longitudes
  const getPosition = (longitude: number, radius: number) => {
    const angle = ((longitude + 90) * Math.PI) / 180;
    return {
      x: 200 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle)
    };
  };

  // Format planet info for tooltip
  const formatPlanetInfo = (planet: any) => {
    return `${planet.name}\n${planet.formatted}${planet.retrograde ? ' ℞' : ''}\nHouse ${planet.house}`;
  };

  return (
    <Card className="relative aspect-square bg-transparent shadow-none border-none">
      <TooltipProvider>
        <div className="relative w-full h-full">
          <svg
            viewBox="-100 -100 600 600"
            className="w-full h-full"
            style={{ transform: 'scale(3.5)', transformOrigin: 'center' }}
          >
            {/* Orange outer ring */}
            <circle
              cx="200"
              cy="200"
              r="200"
              fill="#d15200"
              stroke="rgba(255,255,255,1)"
              strokeWidth="0.8"
              
            />

            {/* Dark blue inner circle */}
            <circle
              cx="200"
              cy="200"
              r="180"
              fill="#0d0630"
              stroke="rgba(255,255,255,1)"
              strokeWidth="0.8"
            />

            {/* Inner circle */}
            <circle
              cx="200"
              cy="200"
              r="160"
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="0.8"
            />

            {/* Houses - 12 segments */}
            {Object.entries(data.houses).map(([house, houseData], i) => {
              const startAngle = houseData.cusp;
              const nextHouse = Object.values(data.houses)[(i + 1) % 12];
              const endAngle = nextHouse.cusp;
              // Ensure angles are properly normalized
              const normalizedStart = ((startAngle % 360) + 360) % 360;
              const normalizedEnd = ((endAngle % 360) + 360) % 360;
              // Calculate mid angle considering the case where the angle crosses 0/360
              const midAngle = normalizedStart > normalizedEnd 
                ? (normalizedStart + (normalizedEnd + 360)) / 2 % 360
                : (normalizedStart + normalizedEnd) / 2;
              const textPoint = getPosition(midAngle, 188);

              return (
                <g key={i}>
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    d={`M 200 200 L ${getPosition(startAngle, 180).x} ${getPosition(startAngle, 180).y}`}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="0.5"
                  />
                  <motion.text
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    x={textPoint.x}
                    y={textPoint.y}
                    fill="white"
                    fontSize="10"
                    fontWeight="300"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle}, ${textPoint.x}, ${textPoint.y})`}
                  >
                    {houseData.sign}
                  </motion.text>
                </g>
              );
            })}

            {/* Aspect lines */}
            {data.aspects.map((aspect, i) => {
              const planet1 = data.planets.find(p => p.name === aspect.planet1);
              const planet2 = data.planets.find(p => p.name === aspect.planet2);

              if (!planet1 || !planet2) return null;

              const point1 = getPosition(planet1.longitude, 130);
              const point2 = getPosition(planet2.longitude, 130);

              let strokeColor;
              switch (aspect.nature) {
                case 'harmonious':
                  strokeColor = '#4CAF50';
                  break;
                case 'challenging':
                  strokeColor = '#f44336';
                  break;
                default:
                  strokeColor = '#9E9E9E';
              }

              return (
                <motion.line
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 1 + i * 0.05 }}
                  x1={point1.x}
                  y1={point1.y}
                  x2={point2.x}
                  y2={point2.y}
                  stroke={strokeColor}
                  strokeWidth="1"
                />
              );
            })}

            {/* Planet markers */}
            {data.planets.map((planet, index) => {
              const point = getPosition(planet.longitude, 130);

              return (
                <g key={planet.name}>
                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    cx={point.x}
                    cy={point.y}
                    r="12"
                    fill="#0c062b"
                    stroke={planet.retrograde ? "#FF5D01" : "white"}
                    strokeWidth="1"
                  />
                  <motion.text
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    x={point.x}
                    y={point.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="500"
                  >
                    {planetSymbols[planet.name]}
                  </motion.text>
                  <title>
                    {planet.name} {planet.formatted}
                    {planet.retrograde ? ' ℞' : ''}
                  </title>
                </g>
              );
            })}

            {/* Ascendant and Midheaven lines */}
            <motion.g
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <line
                x1="200"
                y1="200"
                x2={getPosition(data.ascendant.longitude, 180).x}
                y2={getPosition(data.ascendant.longitude, 180).y}
                stroke="#FFBA44"
                strokeWidth="1"
              />
              <line
                x1="200"
                y1="200"
                x2={getPosition(data.midheaven.longitude, 180).x}
                y2={getPosition(data.midheaven.longitude, 180).y}
                stroke="#FFBA44"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            </motion.g>
          </svg>
        </div>
      </TooltipProvider>
    </Card>
  );
}
