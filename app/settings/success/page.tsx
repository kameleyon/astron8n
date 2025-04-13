"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText, CheckCircle, Coins } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function CreditsSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creditsAdded, setCreditsAdded] = useState<number>(0);

  useEffect(() => {
    const addCreditsToAccount = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/auth');
        return;
      }

      try {
        // Get package ID from URL
        const packageId = searchParams.get('package_id') || 'basic';
        
        // Determine credits to add based on package ID
        let creditsToAdd: number;
        switch (packageId) {
          case 'basic':
            creditsToAdd = 5000; // Basic: $2.99 for 5000 credits
            break;
          case 'pro':
            creditsToAdd = 9000; // Pro: $3.99 for 9000 credits
            break;
          case 'premium':
            creditsToAdd = 17000; // Premium: $5.99 for 17000 credits
            break;
          default:
            creditsToAdd = 5000; // Default to basic package
        }
        
        // Get current user credits
        const { data: userData, error: userError } = await supabase
          .from('user_credits')
          .select('total_credits, used_credits')
          .eq('user_id', session.user.id)
          .single();
        
        if (userError) {
          throw userError;
        }
        
        // Calculate new total credits
        const currentTotalCredits = userData?.total_credits || 0;
        const newTotalCredits = currentTotalCredits + creditsToAdd;
        
        // Update user credits
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ total_credits: newTotalCredits })
          .eq('user_id', session.user.id);
        
        if (updateError) {
          throw updateError;
        }
        
        // Record the transaction in billing_activities
        const { error: activityError } = await supabase
          .from('billing_activities')
          .insert([{
            user_id: session.user.id,
            type: 'token_purchase',
            amount: packageId === 'basic' ? 2.99 : packageId === 'pro' ? 3.99 : 5.99,
            date: new Date().toISOString(),
            status: 'completed',
            tokens: creditsToAdd,
            description: `Purchase of ${packageId} credit package`
          }]);
        
        if (activityError) {
          console.error('Error recording billing activity:', activityError);
          // Continue even if billing activity recording fails
        }
        
        setCreditsAdded(creditsToAdd);
        setLoading(false);
      } catch (err) {
        console.error('Error adding credits:', err);
        setError(err instanceof Error ? err.message : 'Failed to add credits to your account');
        setLoading(false);
      }
    };

    addCreditsToAccount();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-secondary to-accent p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Purchase</h1>
              <p className="text-[#645b4b]">Please wait while we add credits to your account...</p>
            </>
          ) : error ? (
            <>
              <div className="text-red-500 mb-4">
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
              <p className="text-[#645b4b]">{error}</p>
              <button
                onClick={() => router.push('/settings')}
                className="mt-6 w-full py-3 px-6 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-all duration-300"
              >
                Go to Settings
              </button>
            </>
          ) : (
            <>
              <div className="text-green-500 mb-4">
                <CheckCircle className="h-12 w-12 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h1>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Coins className="h-5 w-5 text-secondary" />
                <p className="text-lg font-semibold text-secondary">{creditsAdded.toLocaleString()} credits added</p>
              </div>
              <p className="text-[#645b4b] mb-4">Your credits have been successfully added to your account and are ready to use.</p>
              <button
                onClick={() => router.push('/settings')}
                className="w-full py-3 px-6 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-all duration-300"
              >
                Go to Settings
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreditsSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-secondary to-accent p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
              <p className="text-[#645b4b]">Please wait while we check your purchase status...</p>
            </div>
          </div>
        </div>
      }
    >
      <CreditsSuccessContent />
    </Suspense>
  );
}
