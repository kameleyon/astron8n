"use client";

import { BentoGridItem } from "@/components/profile/bento/BentoGrid";
import { CreditInfo, RolloverCredit } from "@/types/credits";
import { Calendar } from "lucide-react";

interface RolloverCreditsCardProps {
  creditInfo: CreditInfo;
  isLoading: boolean;
  className?: string;
}

export function RolloverCreditsCard({ 
  creditInfo, 
  isLoading,
  className 
}: RolloverCreditsCardProps) {
  if (isLoading) {
    return (
      <BentoGridItem className={className}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </BentoGridItem>
    );
  }

  // Calculate days until expiry for each rollover credit
  const calculateDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <BentoGridItem
      className={className}
      title="Rollover Credits"
      icon={<Calendar className="h-5 w-5 text-primary" />}
    >
      <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {creditInfo.rollover_credits.length > 0 ? (
          creditInfo.rollover_credits.map((credit: RolloverCredit, index: number) => (
            <div 
              key={index}
              className="bg-white/80 rounded-lg p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-brown">
                  {credit.amount.toLocaleString()} credits
                </p>
                <p className="text-sm text-gray">
                  Expires on {new Date(credit.expiry_date).toLocaleDateString()}
                </p>
              </div>
              <div className={`text-sm px-2 py-1 rounded-full ${
                calculateDaysUntilExpiry(credit.expiry_date) < 7 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-secondary/20 text-secondary'
              }`}>
                {calculateDaysUntilExpiry(credit.expiry_date)} days left
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/90 rounded-lg p-4 text-center text-[#645b4b]">
            No rollover credits available
          </div>
        )}
        
        <div className="text-xs text-[#645b4b]/80 mt-2 italic p-3">
          Unused credits roll over for up to 30 days when your subscription renews
        </div>
      </div>
    </BentoGridItem>
  );
}
