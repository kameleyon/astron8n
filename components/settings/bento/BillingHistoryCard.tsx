"use client";

import { BentoGridItem } from "@/components/profile/bento/BentoGrid";
import { BillingInfo, BillingActivity } from "@/types/credits";
import { Receipt } from "lucide-react";

interface BillingHistoryCardProps {
  billingInfo: BillingInfo;
  isLoading: boolean;
}

export function BillingHistoryCard({ 
  billingInfo, 
  isLoading 
}: BillingHistoryCardProps) {
  if (isLoading) {
    return (
      <BentoGridItem>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </BentoGridItem>
    );
  }

  return (
    <BentoGridItem
      title="Billing History"
      icon={<Receipt className="h-5 w-5 text-primary" />}
    >
      <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {billingInfo.activities.length > 0 ? (
          billingInfo.activities.map((activity: BillingActivity, index: number) => (
            <div 
              key={index}
              className="bg-white/80 rounded-lg p-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-brown">
                    {activity.type === 'token_purchase' ? 'Token Purchase' : 'Subscription Payment'}
                  </p>
                  {activity.tokens && (
                    <p className="text-sm text-[#645b4b]">{activity.tokens.toLocaleString()} tokens</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-secondary">${activity.amount.toFixed(2)}</p>
                  <p className="text-sm text-[#645b4b]">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {activity.status !== 'completed' && (
                <div className={`mt-2 text-sm ${
                  activity.status === 'pending' 
                    ? 'text-secondary'
                    : 'text-primary'
                }`}>
                  Status: {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white/80 rounded-lg p-4 text-center text-[#645b4b]">
            No billing activities to display
          </div>
        )}
      </div>
    </BentoGridItem>
  );
}
