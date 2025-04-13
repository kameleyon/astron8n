"use client";

import { useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/profile/bento/BentoGrid";
import { CreditStatusCard } from "./CreditStatusCard";
import { RolloverCreditsCard } from "./RolloverCreditsCard";
import { TopUpCard } from "./TopUpCard";
import { PaymentInfoCard } from "./PaymentInfoCard";
import { BillingHistoryCard } from "./BillingHistoryCard";
import { AccountSecurityCard } from "./AccountSecurityCard";
import { DangerZoneCard } from "./DangerZoneCard";
import { CreditInfo, BillingInfo } from "@/types/credits";

interface SettingsBentoProps {
  creditInfo: CreditInfo;
  billingInfo: BillingInfo;
  isLoading: boolean;
}

export function SettingsBento({
  creditInfo,
  billingInfo,
  isLoading,
}: SettingsBentoProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <BentoGrid className="gap-4 sm:gap-5 md:gap-6">
        {/* Top Row - Credit Status Card with My Settings header */}
        <CreditStatusCard 
          creditInfo={creditInfo} 
          isLoading={isLoading} 
          className="sm:col-span-2 md:col-span-2"
        />
        
        {/* Top Row - Right Side - Payment Info Card */}
        <PaymentInfoCard 
          billingInfo={billingInfo} 
          isLoading={isLoading} 
          className="sm:col-span-1"
        />
        
        {/* Middle Row */}
        {/* Rollover Credits Card - Left */}
        <RolloverCreditsCard 
          creditInfo={creditInfo} 
          isLoading={isLoading} 
          className="sm:col-span-1"
        />
        
        {/* Top Up Card - Right */}
        <TopUpCard 
          isLoading={isLoading} 
          className="sm:col-span-1 md:col-span-2"
        />
        
        
        
        {/* Bottom Row */}
        <div className="col-span-1 sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Billing History Card - Left */}
          <div className="col-span-1">
            <BillingHistoryCard 
              billingInfo={billingInfo} 
              isLoading={isLoading}
            />
          </div>
          
          {/* Account Security Card - Middle */}
          <div className="col-span-1">
            <AccountSecurityCard 
              isLoading={isLoading}
            />
          </div>
          
          {/* Danger Zone Card - Right */}
          <div className="col-span-1">
            <DangerZoneCard 
              isLoading={isLoading}
            />
          </div>
        </div>
      </BentoGrid>
    </div>
  );
}
