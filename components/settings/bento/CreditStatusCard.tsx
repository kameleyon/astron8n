"use client";

import { SettingsBentoGridItem } from "@/components/settings/bento/SettingsBentoGridItem";
import ProgressBar from "@/components/ui/ProgressBar";
import { CreditInfo, RolloverCredit } from "@/types/credits";
import { CreditCard, Calendar, Cog } from "lucide-react";

interface CreditStatusCardProps {
  creditInfo: CreditInfo;
  isLoading: boolean;
  className?: string;
}

export function CreditStatusCard({ 
  creditInfo, 
  isLoading,
  className 
}: CreditStatusCardProps) {
  if (isLoading) {
    return (
      <SettingsBentoGridItem className={className}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SettingsBentoGridItem>
    );
  }

  const availableCredits = creditInfo.total_credits - creditInfo.used_credits;
  const percentUsed = (creditInfo.used_credits / creditInfo.total_credits) * 100;
  
  // Calculate days until expiry for each rollover credit
  const calculateDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <SettingsBentoGridItem
      className={`overflow-hidden flex flex-col ${className || ''}`}
      colSpan={2}
    >
      {/* Header with gradient - matching profile card */}
      <div className="p-3 sm:p-4 md:p-5 border-b border-secondary/90 bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-md rounded-t-2xl flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
          <Cog className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          My Settings
        </h2>
      </div>
      
      {/* Content - matching profile card background */}
      <div className="p-4 sm:p-5 md:p-6 bg-accent/70 flex-1 rounded-b-3xl">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-primary flex items-center">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Credit Status
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[#763c00]">Available Credits</span>
            <span className="text-2xl font-bold text-primary">
              {availableCredits.toLocaleString()}
            </span>
          </div>
          
          <ProgressBar value={percentUsed} />
          
          <div className="flex justify-between text-sm text-[#763c00]">
            <span>{creditInfo.used_credits.toLocaleString()} used</span>
            <span>{creditInfo.total_credits.toLocaleString()} total</span>
          </div>
          
          <div className="bg-[#ef8535]/50 rounded-xl p-3 mt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-brown">
                  {creditInfo.is_subscriber ? 'Premium Plan' : 'Trial Plan'}
                </p>
                <p className="text-sm text-white">
                  {creditInfo.is_subscriber 
                    ? `${creditInfo.total_credits.toLocaleString()} credits per month` 
                    : '1,500 credits for 3 days'}
                </p>
              </div>
              <div className="bg-white/50 text-secondary px-3 py-1 rounded-full text-sm">
                {creditInfo.is_subscriber ? 'Active' : 'Trial'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsBentoGridItem>
  );
}
