// Use Next.js client rendering and framer-motion
"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { BirthChartData } from "@/lib/types/birth-chart";

interface BirthChartWheelProps {
  data: BirthChartData;
}

export function BirthChartWheel({ data }: BirthChartWheelProps) {
  return (
    <Card className="p-6 relative aspect-square">
      {/* Main container for the chart */}
      <div className="relative w-full h-full">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full transform -rotate-90"
        >
          {/* Outer circle */}
          <circle
            cx="200"
            cy="200"
            r="190"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
          />

          {/* 12 House divisions */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.path
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              d={`M 200 200 L ${
                200 + 190 * Math.cos((i * Math.PI) / 6)
              } ${
                200 + 190 * Math.sin((i * Math.PI) / 6)
              }`}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
            />
          ))}

          {/* Center point */}
          <circle cx="200" cy="200" r="4" className="fill-primary" />
        </svg>

        {/* Planet markers (no tooltip) */}
        {data.planets.map((planet, index) => (
          <motion.div
            key={planet.name}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="absolute w-6 h-6 -mt-3 -ml-3 flex items-center justify-center"
            style={{
              left: `${50 + 40 * Math.cos((index * Math.PI) / 6)}%`,
              top: `${50 + 40 * Math.sin((index * Math.PI) / 6)}%`,
            }}
            title={`${planet.name} in ${planet.sign} (House ${planet.house})`}
          >
            <div className="w-3 h-3 rounded-full bg-primary" />
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
