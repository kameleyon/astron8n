"use client";

import { BentoGridItem } from "@/components/profile/bento/BentoGrid";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { BillingInfo } from "@/types/credits";
import { CreditCard, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentInfoCardProps {
  billingInfo: BillingInfo;
  isLoading: boolean;
  className?: string;
}

export function PaymentInfoCard({ 
  billingInfo, 
  isLoading,
  className 
}: PaymentInfoCardProps) {
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  const handleUpdatePayment = async () => {
    setUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch('/api/stripe/update-payment-method', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update payment method');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error updating payment method:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to update payment method',
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleAddPayment = async () => {
    setUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch('/api/stripe/add-payment-method', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add payment method');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error adding payment method:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to add payment method',
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
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
      className={className}
      title="Payment Information"
      icon={<CreditCard className="h-5 w-5 text-primary" />}
    >
      <div className="mt-4 space-y-4">
        <div className="bg-white/90 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[#cd6301] mb-1">
                {billingInfo.is_trial ? 'Trial Plan' : 'Premium Plan'}
              </p>
              <p className="text-sm text-[#645b4b]">
                {billingInfo.is_trial 
                  ? `Trial ends: ${billingInfo.trial_end_date 
                      ? new Date(billingInfo.trial_end_date).toLocaleDateString() 
                      : 'Not available'}`
                  : `Next payment: ${billingInfo.next_payment_date 
                      ? new Date(billingInfo.next_payment_date).toLocaleDateString()
                      : 'Not available'}`
                }
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${
              billingInfo.is_trial 
                ? 'bg-primary/10 text-primary'
                : 'bg-secondary/10 text-secondary'
            }`}>
              {billingInfo.is_trial ? 'Trial' : 'Active'}
            </div>
          </div>
          
          {billingInfo.payment_method ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-sm text-[#645b4b]">
                  {billingInfo.payment_method.brand.charAt(0).toUpperCase() + billingInfo.payment_method.brand.slice(1)} •••• {billingInfo.payment_method.last4}
                </div>
                <div className="text-sm text-[#645b4b]">
                  Expires {billingInfo.payment_method.exp_month}/{billingInfo.payment_method.exp_year}
                </div>
              </div>
              <button 
                onClick={handleUpdatePayment}
                disabled={updating}
                className="text-secondary hover:underline text-sm flex items-center"
              >
                <Edit className="h-3 w-3 mr-1" />
                Update
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2">
              <p className="text-sm text-[#645b4b] mb-2">No payment method on file</p>
              <button 
                onClick={handleAddPayment}
                disabled={updating}
                className="text-white bg-secondary px-3 py-1 rounded-lg text-sm hover:bg-secondary/90 transition-colors"
              >
                Add Payment Method
              </button>
            </div>
          )}
        </div>
        
        <div className="text-xs px-2 text-[#645b4b]/75">
          <p>Your payment information is securely stored with Stripe.</p>
          <p className="mt-1">You can update or remove your payment method at any time.</p>
        </div>
      </div>
    </BentoGridItem>
  );
}
