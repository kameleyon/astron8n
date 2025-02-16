"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function BillingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateSubscriptionStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/auth');
        return;
      }

      try {
        // Update user credits for subscription
        const { error: creditsError } = await supabase
          .from('user_credits')
          .update({
            total_credits: 5000,
            is_subscriber: true,
            subscription_start_date: new Date().toISOString()
          })
          .eq('user_id', session.user.id);

        if (creditsError) {
          throw creditsError;
        }

        setLoading(false);
      } catch (err) {
        console.error('Error updating subscription:', err);
        setError(err instanceof Error ? err.message : 'Failed to update subscription status');
        setLoading(false);
      }
    };

    updateSubscriptionStatus();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-secondary to-accent p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Activating Your Subscription</h1>
              <p className="text-gray-600">Please wait while we set up your subscription...</p>
            </>
          ) : error ? (
            <>
              <div className="text-red-500 mb-4">
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
              <p className="text-gray-600">{error}</p>
            </>
          ) : (
            <>
              <div className="text-green-500 mb-4">
                <CheckCircle className="h-12 w-12 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription Activated!</h1>
              <p className="text-gray-600 mb-4">Your subscription has been successfully activated. You now have access to 17,000 credits per month.</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 px-6 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-all duration-300"
              >
                Go to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
