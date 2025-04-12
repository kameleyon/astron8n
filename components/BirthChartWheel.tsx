"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { BirthChartData } from "@/lib/types/birth-chart";
import { useState } from "react";

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

// Aspect symbols
const aspectSymbols: { [key: string]: string } = {
  'Conjunction': '☌',
  'Opposition': '☍',
  'Trine': '△',
  'Square': '□',
  'Sextile': '⚹',
  'Quincunx': '⚻',
  'Semisextile': '⚺'
};

export function BirthChartWheel({ data }: BirthChartWheelProps): JSX.Element {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: React.ReactNode;
    x: number;
    y: number;
  }>({
    visible: false,
    content: null,
    x: 0,
    y: 0
  });

  // Calculate positions based on actual longitudes
  const getPosition = (longitude: number, radius: number) => {
    const angle = ((longitude + 90) * Math.PI) / 180;
    return {
      x: 200 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle)
    };
  };

  const showTooltip = (content: React.ReactNode, e: React.MouseEvent) => {
    // Get position relative to the SVG
    const svg = e.currentTarget.closest('svg');
    if (!svg) return;
    
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top - 10; // Offset to show above cursor
    
    setTooltip({
      visible: true,
      content,
      x,
      y
    });
  };

  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <Card className="relative aspect-square bg-transparent shadow-none border-none">
      <div className="relative w-full h-full">
        <svg
          viewBox="-100 -100 600 600"
          className="w-full h-full"
          style={{ transform: 'scale(1)', transformOrigin: 'center' }}
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
          {Object.entries(data.houses)
            .filter(([key]) => key.startsWith('House_') && !isNaN(parseInt(key.split('_')[1])) && parseInt(key.split('_')[1]) >= 1 && parseInt(key.split('_')[1]) <= 12)
            .map(([house, houseData], i) => {
              const houseNumber = parseInt(house.split('_')[1]);
              const startAngle = houseData.cusp;
              const nextHouseKey = `House_${(houseNumber % 12) + 1}`;
              const nextHouse = data.houses[nextHouseKey];
              const endAngle = nextHouse?.cusp || 0;
              
              // Ensure angles are properly normalized
              const normalizedStart = ((startAngle % 360) + 360) % 360;
              const normalizedEnd = ((endAngle % 360) + 360) % 360;
              
              // Calculate mid angle considering the case where the angle crosses 0/360
              const midAngle = normalizedStart > normalizedEnd 
                ? (normalizedStart + (normalizedEnd + 360)) / 2 % 360
                : (normalizedStart + normalizedEnd) / 2;
              
              const textPoint = getPosition(midAngle, 188);
              
              // Get planets in this house
              const planetsInHouse = data.planets.filter(planet => {
                if (normalizedEnd > normalizedStart) {
                  return planet.longitude >= normalizedStart && planet.longitude < normalizedEnd;
                } else {
                  return planet.longitude >= normalizedStart || planet.longitude < normalizedEnd;
                }
              }).map(planet => planet.name);

              // House tooltip content
              const houseTooltipContent = (
                <>
                  <div className="font-medium">
                    {houseNumber}{houseNumber === 1 ? 'st' : houseNumber === 2 ? 'nd' : houseNumber === 3 ? 'rd' : 'th'} House
                  </div>
                  <div>{houseData.sign} {houseData.formatted}</div>
                  {planetsInHouse.length > 0 && (
                    <div className="mt-1 text-xs text-gray-300">
                      Planets: {planetsInHouse.join(', ')}
                    </div>
                  )}
                </>
              );

              return (
                <g 
                  key={house}
                  onMouseEnter={(e) => showTooltip(houseTooltipContent, e)}
                  onMouseLeave={hideTooltip}
                >
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
                  
                  {/* Invisible arc for better tooltip targeting */}
                  <path
                    d={`M 200 200 L ${getPosition(startAngle, 180).x} ${getPosition(startAngle, 180).y} A 180 180 0 ${
                      normalizedEnd < normalizedStart ? 1 : 0
                    } 1 ${getPosition(endAngle, 180).x} ${getPosition(endAngle, 180).y} Z`}
                    fill="transparent"
                    stroke="transparent"
                  />
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
            let natureLabel;
            switch (aspect.nature) {
              case 'harmonious':
                strokeColor = '#4CAF50';
                natureLabel = 'Harmonious';
                break;
              case 'challenging':
                strokeColor = '#f44336';
                natureLabel = 'Challenging';
                break;
              default:
                strokeColor = '#9E9E9E';
                natureLabel = 'Neutral';
            }

            // Get aspect symbol
            const aspectSymbol = aspectSymbols[aspect.aspect] || aspect.aspect;

            // Aspect tooltip content
            const aspectTooltipContent = (
              <>
                <div className="flex items-center gap-1 font-medium">
                  <span className="text-lg">{aspectSymbol}</span>
                  <span>{aspect.aspect}</span>
                </div>
                <div>{aspect.planet1} - {aspect.planet2}</div>
                <div className={`text-xs ${
                  aspect.nature === 'harmonious' ? 'text-green-400' : 
                  aspect.nature === 'challenging' ? 'text-red-400' : 
                  'text-gray-400'
                }`}>
                  {natureLabel} ({aspect.angle.toFixed(1)}°)
                </div>
              </>
            );

            return (
              <g 
                key={i}
                onMouseEnter={(e) => showTooltip(aspectTooltipContent, e)}
                onMouseLeave={hideTooltip}
              >
                <motion.line
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 1 + i * 0.05 }}
                  x1={point1.x}
                  y1={point1.y}
                  x2={point2.x}
                  y2={point2.y}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Invisible wider line for better tooltip targeting */}
                <line
                  x1={point1.x}
                  y1={point1.y}
                  x2={point2.x}
                  y2={point2.y}
                  stroke="transparent"
                  strokeWidth="10"
                />
              </g>
            );
          })}

          {/* Planet markers */}
          {data.planets.map((planet, index) => {
            const point = getPosition(planet.longitude, 130);

            // Planet tooltip content
            const planetTooltipContent = (
              <>
                <div className="font-medium">{planet.name}</div>
                <div>{planet.sign} {planet.formatted}</div>
                {planet.retrograde && <div>Retrograde</div>}
              </>
            );

            return (
              <g 
                key={planet.name}
                onMouseEnter={(e) => showTooltip(planetTooltipContent, e)}
                onMouseLeave={hideTooltip}
              >
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
              </g>
            );
          })}

          {/* Ascendant and Midheaven lines */}
          <motion.g
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {/* Ascendant line */}
            <g
              onMouseEnter={(e) => showTooltip(
                <>
                  <div className="font-medium">Ascendant (ASC)</div>
                  <div>{data.ascendant.sign} {data.ascendant.formatted}</div>
                </>, 
                e
              )}
              onMouseLeave={hideTooltip}
            >
              <line
                x1="200"
                y1="200"
                x2={getPosition(data.ascendant.longitude, 180).x}
                y2={getPosition(data.ascendant.longitude, 180).y}
                stroke="#FFBA44"
                strokeWidth="1.5"
              />
            </g>
            
            {/* Midheaven line */}
            <g
              onMouseEnter={(e) => showTooltip(
                <>
                  <div className="font-medium">Midheaven (MC)</div>
                  <div>{data.midheaven.sign} {data.midheaven.formatted}</div>
                </>, 
                e
              )}
              onMouseLeave={hideTooltip}
            >
              <line
                x1="200"
                y1="200"
                x2={getPosition(data.midheaven.longitude, 180).x}
                y2={getPosition(data.midheaven.longitude, 180).y}
                stroke="#FFBA44"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
            </g>
          </motion.g>
        </svg>

        {/* Custom tooltip */}
        {tooltip.visible && (
          <div 
            className="absolute pointer-events-none bg-black/80 text-white border-none px-3 py-2 text-sm rounded-md z-10"
            style={{ 
              left: `${tooltip.x}px`, 
              top: `${tooltip.y}px`,
              transform: 'translateY(-100%)',
              maxWidth: '200px'
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
    </Card>
  );
}
