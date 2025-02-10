"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";
import { handleSubscriptionStatus } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export default function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSubscription = async () => {
      try {
        const sessionId = searchParams?.get('session_id');
        if (!sessionId) {
          throw new Error('No session ID found');
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('No user found');
        }

        // Update subscription status
        await handleSubscriptionStatus(user.id, 'active');

        // Save birth chart data if it exists in session storage
        const birthChartData = sessionStorage.getItem('pendingBirthChart');
        if (birthChartData) {
          const parsedData = JSON.parse(birthChartData);
          
          const now = new Date();
          const trialEnd = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days trial
          
          // Save to user_profiles
          const { error: profileError } = await supabase.from('user_profiles').insert({
            id: user.id,
            full_name: parsedData.name,
            birth_date: parsedData.date,
            birth_time: parsedData.time || null,
            birth_location: parsedData.location,
            latitude: parsedData.latitude,
            longitude: parsedData.longitude,
            has_unknown_birth_time: parsedData.hasUnknownBirthTime,
            timezone: parsedData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            acknowledged: true,
            subscription_start_date: now.toISOString(),
            subscription_end_date: null, // Will be updated by webhook
            trial_expires_at: trialEnd.toISOString(),
            next_payment_date: trialEnd.toISOString(),
            created_at: now.toISOString(),
            updated_at: now.toISOString()
          });

          if (profileError) {
            console.error('Error saving profile:', profileError);
            throw new Error('Failed to save birth chart profile');
          }

          // Create initial user credits
          const { error: creditsError } = await supabase.from('user_credits').insert({
            user_id: user.id,
            total_credits: 3500, // Monthly credit allowance
            used_credits: 0,
            rollover_credits: 0,
            is_subscriber: true,
            subscription_start_date: now.toISOString(),
            subscription_end_date: null, // Will be updated by webhook
            trial_end_date: trialEnd.toISOString(),
            next_payment_date: trialEnd.toISOString(),
            trial_expires_at: trialEnd.toISOString(),
            stripe_subscription_id: null, // Will be updated by webhook
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
            subscription_status: 'active',
            rollover_expiration_date: new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString(), // 30 days from now
            trial_and_date: trialEnd.toISOString()
          });

          if (creditsError) {
            console.error('Error creating user credits:', creditsError);
            throw new Error('Failed to create user credits');
          }

          // Clear the stored data
          sessionStorage.removeItem('pendingBirthChart');
        }

        // Delay to show success message
        setTimeout(() => {
          setLoading(false);
          // Redirect to dashboard after showing success
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }, 1500);

      } catch (err: any) {
        console.error('Error initializing subscription:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initializeSubscription();
  }, [router, searchParams]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <Card className="w-full max-w-md p-6 bg-white/90 backdrop-blur-sm">
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Setting Up Your Subscription
            </h2>
            <p className="text-gray-600">
              Please wait while we activate your account...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Subscription Error
            </h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Subscription Activated!
            </h2>
            <p className="text-gray-600">
              Your 3-day trial has started. Enjoy full access to all features!
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
