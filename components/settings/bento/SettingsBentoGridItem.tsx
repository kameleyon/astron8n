"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SettingsBentoGridItemProps {
  className?: string;
  title?: string;
  description?: string;
  header?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  colSpan?: number;
  rowSpan?: number;
}

export function SettingsBentoGridItem({
  className,
  title,
  description,
  header,
  icon,
  children,
  colSpan = 1,
  rowSpan = 1,
}: SettingsBentoGridItemProps) {
  return (
    <div
      className={cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input shadow-black/5 bg-white/90 backdrop-blur-md border border-white/30 overflow-hidden relative",
        className,
        colSpan === 2 && "sm:col-span-2 md:col-span-2",
        rowSpan === 2 && "sm:row-span-2 md:row-span-2"
      )}
    >
      <div className="relative h-full w-full p-4 z-0">
        {header && <div className="mb-2">{header}</div>}
        
        <div>
          {(title || description) && (
            <div className="mb-4">
              <div className="flex items-center">
                {icon && <div className="mr-2">{icon}</div>}
                {title && <h3 className="font-semibold text-primary mb-1 tracking-tight">{title}</h3>}
              </div>
              {description && <p className="text-sm text-[#645b4b] mt-1">{description}</p>}
            </div>
          )}
          <div className="bento-grid-fix">{children}</div>
        </div>
      </div>
    </div>
  );
}
