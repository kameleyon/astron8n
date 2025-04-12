"use client";

import { useState } from "react";
import { Edit, User } from "lucide-react";
import { BentoGridItem } from "./BentoGrid";

interface ProfileCardProps {
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
  onEdit: () => void;
  className?: string;
}

export function ProfileCard({ profile, email, onEdit, className }: ProfileCardProps) {
  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      return `${month}/${day}/${year}`;
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateStr;
    }
  };

  return (
    <BentoGridItem
      colSpan={2}
      className={`overflow-hidden flex flex-col ${className || ''}`}
    >
      {/* Header with gradient - matching chat interface */}
      <div className="p-3 sm:p-4 md:p-5 border-b border-secondary/90 bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-md rounded-t-2xl flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          My Profile
        </h2>
        <button
          onClick={onEdit}
          className="text-white hover:text-white/80 flex items-center gap-1 sm:gap-1.5 transition-colors text-xs sm:text-sm"
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          Edit Profile
        </button>
      </div>
      
      {/* Profile content - matching chat interface background */}
      <div className="p-3 sm:p-4 md:p-6 message-container bg-accent/70 flex-1 rounded-b-3xl">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/40 flex items-center justify-center">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-primary">
              {profile.full_name || "Your Profile"}
            </h2>
            <p className="text-sm sm:text-base text-[#645b4b]">{email}</p>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-4 sm:gap-y-6">
          <div>
            {/*<h3 className="text-lg font-medium bg-white/10 p-3 rounded-xl  text-gray-900 mb-4">Birth Details</h3>*/}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-sm sm:text-md text-primary/70">Birth Date</p>
                <p className="text-[#645b4b] text-base sm:text-lg mt-0.5">
                  {profile.birth_date ? formatDate(profile.birth_date) : "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm sm:text-md text-primary/70">Birth Time</p>
                <p className="text-[#645b4b] text-base sm:text-lg mt-0.5">
                  {profile.has_unknown_birth_time ? "Not provided" : profile.birth_time}
                </p>
              </div>
              <div>
                <p className="text-sm sm:text-md text-primary/70">Birth Location</p>
                <p className="text-[#645b4b] text-base sm:text-lg mt-0.5">
                  {profile.birth_location || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BentoGridItem>
  );
}
