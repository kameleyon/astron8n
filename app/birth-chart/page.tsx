"use client";

import BirthChartForm from "@/components/BirthChartForm";
import { Suspense } from "react";

// Loading component for Suspense
function BirthChartLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
      <div className="absolute inset-0 dot-pattern"></div>
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Birth Chart
          </h2>
          <p className="text-sm text-gray-600">
            Please wait while we prepare your chart...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
}

export default function BirthChartPage() {
  return (
    <Suspense fallback={<BirthChartLoading />}>
      <div className="min-h-screen bg-gradient-to-r from-secondary to-accent">
        <div className="absolute inset-0 dot-pattern"></div>
        <BirthChartForm />
      </div>
    </Suspense>
  );
}
