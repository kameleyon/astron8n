"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BillingActivity, BillingInfo } from "@/types/credits";

interface PaymentMethod {
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

// Extend BillingInfo to include payment method
interface ExtendedBillingInfo extends BillingInfo {
  payment_method: PaymentMethod | null;
}

interface BillingTabProps {
  billingInfo: BillingInfo;
}

export function BillingTab(props: BillingTabProps) {
  const [billingInfo, setBillingInfo] = useState<ExtendedBillingInfo>({
    ...props.billingInfo,
    payment_method: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No active session');
        }

        const response = await fetch('/api/billing/get-info', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch billing information');
        }

        const data = await response.json();
        setBillingInfo(data);
      } catch (err) {
        console.error('Error fetching billing info:', err);
        setError(err instanceof Error ? err.message : 'Failed to load billing information');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingInfo();
  }, []);

  if (loading) {
    return (
      <Card className="bg-white/70 border border-white shadow-md shadow-black/40 backdrop-blur-sm rounded-3xl mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !billingInfo) {
    return (
      <Card className="bg-white/70 border border-white shadow-md shadow-black/40 backdrop-blur-sm rounded-3xl mb-6">
        <CardContent className="p-6">
          <div className="text-center text-red-600 p-4">
            {error || 'Unable to load billing information'}
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="bg-white/70 border border-white shadow-md shadow-black/40 backdrop-blur-sm rounded-3xl mb-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Billing
        </h2>
        <div className="space-y-8">
          {/* Credit Top-up Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase Additional Credits</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Basic Package */}
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 hover:border-primary transition-colors">
                <div className="text-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-900">Basic</h4>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-primary">$2.99</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-center text-gray-600">5,000 tokens</p>
                  <p className="text-sm text-center text-gray-500">Perfect for casual users</p>
                </div>
                <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Purchase
                </button>
              </div>
              {/* Pro Package */}
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-primary relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">Most Popular</span>
                </div>
                <div className="text-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-900">Pro</h4>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-primary">$3.99</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-center text-gray-600">9,000 tokens</p>
                  <p className="text-sm text-center text-gray-500">Best value for regular users</p>
                </div>
                <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Purchase
                </button>
              </div>
              {/* Premium Package */}
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 hover:border-primary transition-colors">
                <div className="text-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-900">Premium</h4>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-primary">$5.99</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-center text-gray-600">17,000 tokens</p>
                  <p className="text-sm text-center text-gray-500">Ideal for power users</p>
                </div>
                <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Purchase
                </button>
              </div>
            </div>
          </div>
          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 mb-1">
                    {billingInfo.is_trial ? 'Trial Plan' : 'Premium Plan'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {billingInfo.is_trial 
                      ? `Trial ends: ${new Date(billingInfo.trial_end_date!).toLocaleDateString()}`
                      : `Next payment: ${billingInfo.next_payment_date 
                          ? new Date(billingInfo.next_payment_date).toLocaleDateString()
                          : 'Not available'}`
                    }
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  billingInfo.is_trial 
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {billingInfo.is_trial ? 'Trial' : 'Active'}
                </div>
              </div>
              {billingInfo.payment_method ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600">
                      {billingInfo.payment_method.brand.charAt(0).toUpperCase() + billingInfo.payment_method.brand.slice(1)} •••• {billingInfo.payment_method.last4}
                    </div>
                    <div className="text-sm text-gray-500">
                      Expires {billingInfo.payment_method.exp_month}/{billingInfo.payment_method.exp_year}
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        const { data: { session } } = await supabase.auth.getSession();
                        if (!session) throw new Error('No active session');

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
                        setError(err instanceof Error ? err.message : 'Failed to update payment method');
                      }
                    }}
                    className="text-primary hover:underline text-sm"
                  >
                    Update
                  </button>
                </div>
              ) : (
                <button 
                  onClick={async () => {
                    try {
                      const { data: { session } } = await supabase.auth.getSession();
                      if (!session) throw new Error('No active session');

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
                      setError(err instanceof Error ? err.message : 'Failed to add payment method');
                    }
                  }}
                  className="text-primary hover:underline text-sm"
                >
                  Add payment method
                </button>
              )}
            </div>
          </div>
          {/* Billing History */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Billing History</h3>
            {billingInfo.activities.length > 0 ? (
              <div className="space-y-2">
                {billingInfo.activities.map((activity, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {activity.type === 'token_purchase' ? 'Token Purchase' : 'Subscription Payment'}
                        </p>
                        {activity.tokens && (
                          <p className="text-sm text-gray-500">{activity.tokens.toLocaleString()} tokens</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${activity.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {activity.status !== 'completed' && (
                      <div className={`mt-2 text-sm ${
                        activity.status === 'pending' 
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        Status: {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                No billing activities to display
              </div>
            )}
          </div>
          {/* Danger Zone - Subscription Management */}
          <div className="bg-red-700 border border-white  backdrop-blur-sm p-4 rounded-3xl">
            <h3 className="text-lg font-medium pl-4 text-white  mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Danger Zone
            </h3>
            <div className="p-4">
              <div className="mb-4">
                <h4 className="text-base font-medium text-white/80">Subscription Management</h4>
                <p className="text-sm text-white/80 mt-1">
                  Warning: Changes to your subscription may affect your access to premium features and monthly credit allowance.
                </p>
              </div>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-white/80 text-red-700 rounded-lg hover:bg-white transition-colors text-sm font-medium">
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
