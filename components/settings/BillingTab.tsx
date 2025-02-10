"use client";
import { Card, CardContent } from "@/components/ui/card";
import { BillingInfo } from "../../types/credits";
interface BillingTabProps {
  billingInfo: BillingInfo;
}
export function BillingTab({ billingInfo }: BillingTabProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
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
                    <span className="text-3xl font-bold text-primary">$9.99</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-center text-gray-600">1,000 Credits</p>
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
                    <span className="text-3xl font-bold text-primary">$24.99</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-center text-gray-600">3,000 Credits</p>
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
                    <span className="text-3xl font-bold text-primary">$49.99</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-center text-gray-600">7,000 Credits</p>
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
              <p className="text-gray-600 mb-2">
                Next payment date: {billingInfo.next_payment_date || 'Not available'}
              </p>
              <button className="text-primary hover:underline text-sm">
                Update payment method
              </button>
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
                    className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                  >
                    <span className="text-gray-600">{activity}</span>
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
          <div>
            <h3 className="text-lg font-medium text-red-600 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Danger Zone
            </h3>
            <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
              <div className="mb-4">
                <h4 className="text-base font-medium text-red-800">Subscription Management</h4>
                <p className="text-sm text-red-600 mt-1">
                  Warning: Changes to your subscription may affect your access to premium features and monthly credit allowance.
                </p>
              </div>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
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