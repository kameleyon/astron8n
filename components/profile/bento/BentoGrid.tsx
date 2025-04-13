"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  className?: string;
  children: ReactNode;
}

interface BentoGridItemProps {
  className?: string;
  title?: string;
  description?: string;
  header?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  colSpan?: number;
  rowSpan?: number;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto", className)}>
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
  children,
  colSpan = 1,
  rowSpan = 1,
}: BentoGridItemProps) {
  return (
    <div
      className={cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input shadow-black/5 bg-white/90 backdrop-blur-md border border-white/30 overflow-hidden",
        className,
        colSpan === 2 && "sm:col-span-2 md:col-span-2",
        rowSpan === 2 && "sm:row-span-2 md:row-span-2"
      )}
    >
      <div className="relative h-full w-full p-4">
        {header && <div className="mb-2">{header}</div>}
        
        {(title || description) && (
          <div className="flex flex-col h-full justify-between">
            <div>
              {icon && <div className="mb-2">{icon}</div>}
              {title && <h3 className="font-semibold text-primary mb-1 tracking-tight">{title}</h3>}
              {description && <p className="text-sm text-[#645b4b]">{description}</p>}


            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
