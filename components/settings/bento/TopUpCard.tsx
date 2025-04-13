"use client";

import { BentoGridItem } from "@/components/profile/bento/BentoGrid";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Coins, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TopUpCardProps {
  isLoading: boolean;
  className?: string;
}

interface PackageOption {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
}

export function TopUpCard({ 
  isLoading,
  className 
}: TopUpCardProps) {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const packages: PackageOption[] = [
    {
      id: 'basic',
      name: 'Basic',
      credits: 5000,
      price: 2.99
    },
    {
      id: 'pro',
      name: 'Pro',
      credits: 9000,
      price: 3.99,
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      credits: 17000,
      price: 5.99
    }
  ];

  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast({
        title: "Error",
        description: "Please select a package first",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
      if (!selectedPkg) {
        throw new Error('Invalid package selected');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          packageId: selectedPackage,
          credits: selectedPkg.credits,
          amount: selectedPkg.price
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error purchasing credits:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to process purchase',
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <BentoGridItem className={className}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </BentoGridItem>
    );
  }

  return (
    <BentoGridItem
      className={`overflow-hidden flex flex-col ${className || ''}`}
      colSpan={2}
    >
      {/* Header with gradient - matching profile card */}
      
      
      {/* Content - matching profile card background */}
      <div className="p-4 sm:p-5 md:p-6 bg-accent/70 flex-1 rounded-2xl space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
          <Coins className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Top Up Credits
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`
                relative bg-white/80 rounded-lg p-3 cursor-pointer transition-all
                ${selectedPackage === pkg.id ? 'border-2 border-secondary' : 'border border-white/50 hover:border-secondary/50'}
              `}
            >
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-secondary text-white text-xs px-2 py-0.5 rounded-full">Popular</span>
                </div>
              )}
              <div className="text-center mb-2">
                <h4 className="text-base font-semibold text-brown">{pkg.name}</h4>
                <div className="mt-1">
                  <span className="text-xl font-bold text-secondary">${pkg.price}</span>
                </div>
              </div>
              <div className="space-y-1 mb-3">
                <p className="text-center text-[#645b4b]">{pkg.credits.toLocaleString()} credits</p>
              </div>
              {selectedPackage === pkg.id && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-secondary" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={handlePurchase}
          disabled={!selectedPackage || processing}
          className="w-full py-2 px-4 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
        >
          {processing ? "Processing..." : "Purchase Credits"}
        </button>
        
        <p className="text-xs text-center text-[#645b4b]">
          Credits will be added to your account immediately after purchase
        </p>
      </div>
    </BentoGridItem>
  );
}
