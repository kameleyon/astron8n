"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlowingCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  glowColor?: string;
}

export function GlowingCard({ 
  children, 
  className, 
  title,
  glowColor = "rgba(239, 133, 53, 0.4)" // Default to secondary color
}: GlowingCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({ x, y });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d0630] to-[#1a0c4a] text-white border border-white/10 p-4",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glow effect */}
      <div
        className="absolute pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          opacity: opacity,
          transition: "opacity 0.3s ease",
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {title && (
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">{title}</h3>
        )}
        {children}
      </div>
    </motion.div>
  );
}
