"use client";

import { useState } from "react";
import { BentoGrid } from "./BentoGrid";
import { ProfileCard } from "./ProfileCard";
import { HumanDesignCard } from "./HumanDesignCard";
import { LifePathCard } from "./LifePathCard";
import { CardologyCard } from "./CardologyCard";
import { AstroBlueprintCard } from "./AstroBlueprintCard";
import { BirthChartWheelCard } from "./BirthChartWheelCard";
import { BirthChartDetailsCard } from "./BirthChartDetailsCard";
import { ReportsCard } from "./ReportsCard";
import { BirthChartData } from "@/lib/types/birth-chart";
import { HumanDesignProfile } from "@/lib/utils/humanDesign";

interface ProfileBentoProps {
  profile: {
    id: string;
    full_name: string;
    birth_date: string;
    birth_time: string | null;
    birth_location: string;
    latitude: number;
    longitude: number;
    has_unknown_birth_time: boolean;
  };
  email: string | null;
  birthChartData: BirthChartData | null;
  humanDesignData: HumanDesignProfile | null;
  lifePathNumber: string | null;
  birthCard: string | null;
  reports: Array<{
    id: string;
    user_id: string;
    report_type: string;
    file_name: string;
    content: string;
    created_at: string;
  }>;
  isLoading: boolean;
  onEdit: () => void;
  onDownloadReport: (fileName: string) => Promise<void>;
}

export function ProfileBento({
  profile,
  email,
  birthChartData,
  humanDesignData,
  lifePathNumber,
  birthCard,
  reports,
  isLoading,
  onEdit,
  onDownloadReport,
}: ProfileBentoProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 7; // Changed from 6 to 4 reports per page
  
  // Calculate pagination
  const totalPages = Math.ceil((reports?.length || 0) / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;
  const currentReports = reports.slice(startIndex, endIndex);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <BentoGrid className="gap-4 sm:gap-5 md:gap-6">
        {/* Top Row */}
        {/* Profile Card - Top Left */}
        <ProfileCard 
          profile={profile} 
          email={email} 
          onEdit={onEdit} 
          className="sm:col-span-1"
        />
        
        {/* Birth Chart Wheel Card - Top Right */}
        <BirthChartWheelCard 
          data={birthChartData} 
          isLoading={isLoading} 
          className="sm:col-span-1 h-[550px] sm:h-auto"
        />
        
        {/* Middle Row */}
        {/* Human Design Card - Left Column */}
        <HumanDesignCard 
          data={humanDesignData} 
          isLoading={isLoading} 
          className="row-span-2 sm:row-span-2 h-[550px] sm:h-auto" // Make it taller
        />
        
        {/* Life Path Card - Middle Column */}
        <LifePathCard 
          lifePathNumber={lifePathNumber} 
          isLoading={isLoading} 
          className="sm:col-span-1"
        />
        
        {/* Cardology Card - Right Column */}
        <CardologyCard 
          birthCard={birthCard} 
          isLoading={isLoading} 
          className="sm:col-span-1"
        />
        
        {/* Astro Blueprint Card - Middle-Right Columns */}
        <AstroBlueprintCard 
          data={birthChartData} 
          isLoading={isLoading} 
          className="sm:col-span-2" // Span across middle and right columns
        />
        
        {/* Bottom Row */}
        <div className="col-span-1 sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Birth Chart Details Card - Left */}
          <div className="col-span-1 sm:col-span-1 md:col-span-2">
            <BirthChartDetailsCard 
              data={birthChartData} 
              isLoading={isLoading}
            />
          </div>
          
          {/* Reports Card - Right */}
          <div className="col-span-1">
            <ReportsCard 
              reports={currentReports}
              onDownload={onDownloadReport}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </BentoGrid>
    </div>
  );
}
