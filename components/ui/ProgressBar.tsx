"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export default function ProgressBar({ 
  value, 
  max = 100, 
  className 
}: ProgressBarProps) {
  // Ensure value is between 0 and max
  const clampedValue = Math.min(Math.max(0, value), max);
  const percentage = (clampedValue / max) * 100;
  
  return (
    <div className={`w-full h-1 bg-white/80 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
