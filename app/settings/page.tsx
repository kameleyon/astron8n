"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, CreditCard, Settings } from "lucide-react";
import { UsageTab } from "@/components/settings/UsageTab";
import { BillingTab } from "@/components/settings/BillingTab";
import { OperationsTab } from "@/components/settings/OperationsTab";
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
    activities: []
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
            <h1 className="text-3xl font-bold text-white text-left mb-4 pl-8">
              Settings
            </h1>
            <Tabs defaultValue="usage" className="w-full">
              <TabsList className="grid grid-cols-3 bg-white/20 backdrop-blur-sm shadow-sm shadow-black/40  rounded-xl p-1 mb-8">
                <TabsTrigger
                  value="usage"
                  className="text-white data-[state=active]:bg-white/80 rounded-lg data-[state=active]:text-primary"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Usage
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="text-white data-[state=active]:bg-white/80 rounded-lg data-[state=active]:text-primary"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="text-white data-[state=active]:bg-white/80 rounded-lg data-[state=active]:text-primary"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="usage">
                <UsageTab loading={loading} creditInfo={creditInfo} />
              </TabsContent>
              <TabsContent value="billing">
                <div>
                  <BillingTab billingInfo={billingInfo} />
                </div>
              </TabsContent>
              <TabsContent value="settings">
                <OperationsTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
