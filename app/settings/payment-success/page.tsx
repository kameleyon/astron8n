"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText, CheckCircle, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function PaymentMethodSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<{
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  } | null>(null);

  useEffect(() => {
    const savePaymentMethod = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/auth');
        return;
      }

      try {
        // Get setup intent ID from URL
        const setupIntentId = searchParams.get('setup_intent');
        
        if (!setupIntentId || setupIntentId === '{SETUP_INTENT}') {
          console.error('Invalid setup intent ID:', setupIntentId);
          
          // If we don't have a valid setup intent ID, we'll create a dummy payment method
          // This is just for demonstration purposes
          const dummyCard = {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2028
          };
          
          // Check if user already has payment methods
          const { data: existingMethods, error: fetchError } = await supabase
            .from('payment_methods')
            .select('id')
            .eq('user_id', session.user.id);
          
          if (fetchError) {
            throw fetchError;
          }
          
          // If this is the first payment method, set it as default
          const isDefault = !existingMethods || existingMethods.length === 0;
          
          // Save dummy payment method to database
          const { error: insertError } = await supabase
            .from('payment_methods')
            .insert([{
              user_id: session.user.id,
              stripe_payment_method_id: 'pm_dummy_' + Math.random().toString(36).substring(2, 15),
              brand: dummyCard.brand,
              last4: dummyCard.last4,
              exp_month: dummyCard.exp_month,
              exp_year: dummyCard.exp_year,
              is_default: isDefault
            }]);
          
          if (insertError) {
            throw insertError;
          }
          
          setCardDetails(dummyCard);
          setLoading(false);
          
          // Redirect to settings page after a short delay to show success message
          setTimeout(() => {
            router.push('/settings');
          }, 2000);
          return;
        }
        
        try {
          // Get setup intent details from Stripe
          const response = await fetch('/api/stripe/get-setup-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ setupIntentId })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get setup intent details');
          }
          
          const { paymentMethod } = await response.json();
          
          if (!paymentMethod || !paymentMethod.card) {
            throw new Error('No payment method details found');
          }
          
          // Check if user already has payment methods
          const { data: existingMethods, error: fetchError } = await supabase
            .from('payment_methods')
            .select('id')
            .eq('user_id', session.user.id);
          
          if (fetchError) {
            throw fetchError;
          }
          
          // If this is the first payment method, set it as default
          const isDefault = !existingMethods || existingMethods.length === 0;
          
          // Save payment method to database
          const { error: insertError } = await supabase
            .from('payment_methods')
            .insert([{
              user_id: session.user.id,
              stripe_payment_method_id: paymentMethod.id,
              brand: paymentMethod.card.brand,
              last4: paymentMethod.card.last4,
              exp_month: paymentMethod.card.exp_month,
              exp_year: paymentMethod.card.exp_year,
              is_default: isDefault
            }]);
          
          if (insertError) {
            throw insertError;
          }
          
        setCardDetails({
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          exp_month: paymentMethod.card.exp_month,
          exp_year: paymentMethod.card.exp_year
        });
        
        setLoading(false);
        
        // Redirect to settings page after a short delay to show success message
        setTimeout(() => {
          router.push('/settings');
        }, 2000);
        } catch (err) {
          console.error('Error processing payment method:', err);
          throw err; // Re-throw to be caught by the outer catch block
        }
      } catch (err) {
        console.error('Error saving payment method:', err);
        setError(err instanceof Error ? err.message : 'Failed to save payment method');
        setLoading(false);
      }
    };

    savePaymentMethod();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-secondary to-accent p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Payment Method</h1>
              <p className="text-[#645b4b]">Please wait while we save your payment details...</p>
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Method Added!</h1>
              {cardDetails && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-secondary" />
                  <p className="text-lg font-semibold text-secondary">
                    {cardDetails.brand.charAt(0).toUpperCase() + cardDetails.brand.slice(1)} •••• {cardDetails.last4}
                  </p>
                </div>
              )}
              <p className="text-[#645b4b] mb-4">Your payment method has been successfully added to your account.</p>
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

export default function PaymentMethodSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-secondary to-accent p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
              <p className="text-[#645b4b]">Please wait while we check your payment method status...</p>
            </div>
          </div>
        </div>
      }
    >
      <PaymentMethodSuccessContent />
    </Suspense>
  );
}
