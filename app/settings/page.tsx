"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";
import { SettingsBento } from "@/components/settings/bento/SettingsBento";
import type { CreditInfo, BillingInfo, RolloverCredit } from "@/types/credits";
export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [creditInfo, setCreditInfo] = useState<CreditInfo>({
    total_credits: 1500,
    used_credits: 0,
    rollover_credits: [],
    is_subscriber: false,
    subscription_start_date: null
  });
  
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({ 
    next_payment_date: null,
    trial_end_date: null,
    is_trial: false,
    activities: [],
    payment_method: null
  });
  useEffect(() => {
    const initializeUserData = async () => {
      setLoading(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!user) {
          router.push("/auth");
          return;
        }
        
        // Check if this is a return from a successful purchase
        if (typeof window !== 'undefined') {
          const searchParams = new URLSearchParams(window.location.search);
          const purchaseSuccess = searchParams.get('purchase_success');
          
          if (purchaseSuccess === 'true') {
            // Clear the query parameter to prevent multiple credit additions on refresh
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
            
            // Get the latest session ID from Stripe
            const sessionId = searchParams.get('session_id');
            
            if (sessionId) {
              try {
                // Call an API to verify the payment and add credits
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                  const response = await fetch('/api/verify-payment', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({ sessionId })
                  });
                  
                  if (response.ok) {
                    const result = await response.json();
                    console.log(`Payment verified and ${result.creditsAdded} credits added`);
                  } else {
                    console.error('Failed to verify payment');
                  }
                }
              } catch (err) {
                console.error('Error verifying payment:', err);
              }
            }
          }
        }
        // Get user's credit info from database
        const { data: creditData, error: creditError } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (creditError && creditError.code !== 'PGRST116') {
          throw creditError;
        }
        // Initialize new user or update existing user
        const initialCreditInfo = creditData ? {
          total_credits: creditData.total_credits,
          used_credits: creditData.used_credits,
          rollover_credits: creditData.rollover_credits,
          is_subscriber: creditData.is_subscriber,
          subscription_start_date: creditData.subscription_start_date
        } : {
          total_credits: 1500,
          used_credits: 0,
          rollover_credits: [],
          is_subscriber: false,
          subscription_start_date: null
        };
        if (!creditData) {
          await supabase
            .from('user_credits')
            .insert([{ user_id: user.id, ...initialCreditInfo }]);
        }
        // Check subscription status
        const signUpDate = new Date(user.created_at);
        const now = new Date();
        const daysSinceSignUp = Math.ceil((now.getTime() - signUpDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceSignUp > 3 && !initialCreditInfo.is_subscriber) {
          const updatedCreditInfo = {
            ...initialCreditInfo,
            is_subscriber: true,
            total_credits: 3500,
            subscription_start_date: now.toISOString(),
            rollover_credits: [
              ...initialCreditInfo.rollover_credits,
              {
                amount: initialCreditInfo.total_credits - initialCreditInfo.used_credits,
                expiry_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
              }
            ]
          };
          setCreditInfo(updatedCreditInfo);
          // Update subscription status in database
          await supabase
            .from('user_credits')
            .update({
              is_subscriber: true,
              total_credits: 3500,
              subscription_start_date: now.toISOString(),
              rollover_credits: updatedCreditInfo.rollover_credits
            })
            .eq('user_id', user.id);
        } else {
          setCreditInfo(initialCreditInfo);
        }
        // Clean up expired rollover credits
        const calculateDaysUntilExpiry = (expiryDate: string) => {
          const expiry = new Date(expiryDate);
          const diffTime = expiry.getTime() - now.getTime();
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        };
        const validRolloverCredits = initialCreditInfo.rollover_credits.filter((credit: RolloverCredit) => 
          calculateDaysUntilExpiry(credit.expiry_date) > 0
        );
        if (validRolloverCredits.length !== initialCreditInfo.rollover_credits.length) {
          const finalCreditInfo = {
            ...initialCreditInfo,
            rollover_credits: validRolloverCredits
          };
          setCreditInfo(finalCreditInfo);
          // Update rollover credits in database
          await supabase
            .from('user_credits')
            .update({ rollover_credits: validRolloverCredits })
            .eq('user_id', user.id);
        }
        
        // Fetch billing information with proper error handling
        try {
          // Get subscription information from subscription_history table
          try {
            const { data: subscriptionData, error: subscriptionError } = await supabase
              .from('subscription_history')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(1);
            
            if (subscriptionError) {
              console.log('Error fetching subscription data:', subscriptionError.message);
            } else if (subscriptionData && subscriptionData.length > 0) {
              // Use the first (most recent) subscription record
              const latestSubscription = subscriptionData[0];
              
              // Update billing info with subscription data
              setBillingInfo(prevInfo => ({
                ...prevInfo,
                next_payment_date: latestSubscription.next_payment_date || null,
                trial_end_date: latestSubscription.trial_end_date || null,
                is_trial: latestSubscription.is_trial || false
              }));
            }
          } catch (subscriptionError) {
            console.error('Error accessing subscription_history table:', subscriptionError);
          }
          
          // Get payment methods
          try {
            const { data: paymentMethodData, error: paymentMethodError } = await supabase
              .from('payment_methods')
              .select('*')
              .eq('user_id', user.id)
              .eq('is_default', true)
              .limit(1)
              .maybeSingle();
            
            if (paymentMethodError) {
              console.log('Error fetching payment method data:', paymentMethodError.message);
            } else if (paymentMethodData) {
              // Update billing info with payment method data
              setBillingInfo(prevInfo => ({
                ...prevInfo,
                payment_method: {
                  brand: paymentMethodData.brand || '',
                  last4: paymentMethodData.last4 || '',
                  exp_month: paymentMethodData.exp_month || 0,
                  exp_year: paymentMethodData.exp_year || 0
                }
              }));
            }
          } catch (paymentMethodError) {
            console.error('Error accessing payment_methods table:', paymentMethodError);
          }
          
          // Try to get billing activities from both billing_activities and api_usage tables
          try {
            // First try billing_activities table
            const { data: billingActivitiesData, error: billingActivitiesError } = await supabase
              .from('billing_activities')
              .select('*')
              .eq('user_id', user.id)
              .order('date', { ascending: false })
              .limit(10);
            
            // Then try api_usage table
            const { data: apiUsageData, error: apiUsageError } = await supabase
              .from('api_usage')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(10);
            
            // Define the activity type
            type BillingActivity = {
              type: 'subscription_payment' | 'token_purchase';
              amount: number;
              date: string;
              status: 'completed' | 'pending' | 'failed';
              tokens: number;
            };
            
            // Combine the results
            let combinedActivities: BillingActivity[] = [];
            
            if (!billingActivitiesError && billingActivitiesData && billingActivitiesData.length > 0) {
              // Map billing activities data
              const formattedBillingActivities: BillingActivity[] = billingActivitiesData.map(activity => ({
                type: activity.type as 'subscription_payment' | 'token_purchase',
                amount: activity.amount,
                date: activity.date,
                status: activity.status as 'completed' | 'pending' | 'failed',
                tokens: activity.tokens
              }));
              
              combinedActivities = [...combinedActivities, ...formattedBillingActivities];
            }
            
            if (!apiUsageError && apiUsageData && apiUsageData.length > 0) {
              // Map api_usage data to billing activities format
              const formattedApiUsage: BillingActivity[] = apiUsageData.map(usage => ({
                type: 'token_purchase' as 'subscription_payment' | 'token_purchase',
                amount: usage.cost || 0,
                date: usage.created_at,
                status: 'completed' as 'completed' | 'pending' | 'failed',
                tokens: usage.tokens_used || 0
              }));
              
              combinedActivities = [...combinedActivities, ...formattedApiUsage];
            }
            
            // Sort by date (newest first)
            combinedActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            // Limit to 10 activities
            combinedActivities = combinedActivities.slice(0, 10);
            
            // Update billing info with activities data
            if (combinedActivities.length > 0) {
              setBillingInfo(prevInfo => ({
                ...prevInfo,
                activities: combinedActivities
              }));
            }
          } catch (activitiesError) {
            console.error('Error accessing activities tables:', activitiesError);
          }
        } catch (err) {
          console.error('Error fetching billing information:', err);
          // Keep using the default billing info set in useState
        }
      } catch (err) {
        console.error('Error initializing user data:', err);
      } finally {
        setLoading(false);
      }
    };
    initializeUserData();
  }, [router]);
  return (
    <SessionProvider requireAuth>
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-secondary to-accent">
        <div className="absolute inset-0 dot-pattern"></div>
        <Header onAuth={() => {}} />
        <main className="flex-grow relative z-10 py-12 mb-8">
          <div className="w-full max-w-5xl mx-auto px-4">
            <SettingsBento 
              creditInfo={creditInfo}
              billingInfo={billingInfo}
              isLoading={loading}
            />
          </div>
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
