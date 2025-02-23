"use client";
import { Card, CardContent } from "@/components/ui/card";
import ProgressBar from "@/components/ui/ProgressBar";
import { CreditInfo, RolloverCredit } from "../../types/credits";
interface UsageTabProps {
  loading: boolean;
  creditInfo: CreditInfo;
}
export function UsageTab({ loading, creditInfo }: UsageTabProps) {
  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Credit Status Section */}
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4">
              Credit Status
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Available Credits</span>
                <span className="text-2xl font-bold text-primary">
                              {creditInfo.total_credits - creditInfo.used_credits}
                </span>
              </div>
              <ProgressBar 
                            value={(creditInfo.used_credits / creditInfo.total_credits) * 100} 
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>{creditInfo.used_credits} used</span>
                            <span>{creditInfo.total_credits} total</span>
              </div>
            </div>
          </div>
          {/* Plan Details */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">
              Plan Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                                {creditInfo.is_subscriber ? 'Premium Plan' : 'Trial Plan'}
                  </p>
                  <p className="text-sm text-gray-500">
                                {creditInfo.is_subscriber 
                      ? '3,500 credits per month' 
                      : '1,500 credits for 3 days'}
                  </p>
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                              {creditInfo.is_subscriber ? 'Active' : 'Trial'}
                </div>
              </div>
            </div>
          </div>
          {/* Rollover Credits */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">
              Rollover Credits
            </h3>
                        {creditInfo.rollover_credits.length > 0 ? (
                          <div className="space-y-3">
                            {creditInfo.rollover_credits.map((credit: RolloverCredit, index: number) => (
                  <div 
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {credit.amount} credits
                      </p>
                      <p className="text-sm text-gray-500">
                                    Expires on {new Date(credit.expiry_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm">
                                  {Math.ceil((new Date(credit.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                No rollover credits available
              </div>
            )}
          </div>
          {/* Usage Tips */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-[#0d0630] mb-2">
              Credit Usage Tips
            </h4>
            <ul className="text-sm text-[#0d0630] space-y-1">
              <li>• Credits are used for generating birth charts and reports</li>
              <li>• Unused credits roll over for up to 30 days</li>
              <li>• Premium plan includes 3,500 credits monthly</li>
              <li>• Trial plan includes 1,500 credits for 3 days</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
