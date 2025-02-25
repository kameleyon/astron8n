"use client";

import { useState } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSubscriptionComplete?: () => void;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  userId,
  onSubscriptionComplete,
}: SubscriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleStartTrial = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const { id: sessionId, error } = await response.json();
      
      if (error) throw new Error(error.message);

      // Load Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) throw new Error('Failed to load Stripe');

      // Redirect to checkout
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      if (stripeError) throw stripeError;
      
      // Call onSubscriptionComplete if provided
      if (onSubscriptionComplete) {
        onSubscriptionComplete();
      }
    } catch (err: any) {
      console.error('Error starting trial:', err);
      setError(err.message || 'Failed to start trial');
      setLoading(false);
    }
  };

  // Check if birth chart data exists
  const hasPendingBirthChart = sessionStorage.getItem('pendingBirthChart') !== null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in slide-in-from-bottom duration-300">
        <button
          onClick={() => {
            // Only allow closing if there's no pending birth chart data
            if (!hasPendingBirthChart) {
              onClose();
              return;
            }
            // Otherwise show error - they must complete the subscription
            setError("Please complete the subscription process to continue.");
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Start Your Journey
          </h2>
          <p className="text-sm text-gray-600">
            Begin with a 3-day free trial
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-800 p-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Premium Access</h3>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              3 Days Free
            </span>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>3,500 monthly credits</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Unlimited birth chart readings</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Advanced astrological insights</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Priority support</span>
            </li>
          </ul>

          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 mb-1">After trial ends</div>
            <div className="text-2xl font-bold text-gray-900">$7.99/month</div>
          </div>

          <button
            onClick={handleStartTrial}
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Starting trial..." : "Start Free Trial"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Cancel anytime during your trial. No commitment required.
          </p>
        </div>
      </div>
    </div>
  );
}
