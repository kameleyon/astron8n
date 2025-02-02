"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerificationCard() {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    if (agreed) {
      router.push("/birth-chart");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in slide-in-from-bottom duration-300">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Email Verified Successfully!
          </h2>
          <p className="text-sm text-gray-600">
            Before we continue, please read and agree to our terms.
          </p>
        </div>

        <div className="bg-white/70 p-4 rounded-lg mb-6 text-sm text-gray-700">
          <p className="mb-4">By using AstroGenie, you acknowledge and agree that:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The information provided is for entertainment purposes only</li>
            <li>Astrological readings are not a substitute for professional advice</li>
            <li>Your data will be protected and used in accordance with our privacy policy</li>
            <li>You are at least 18 years of age or have parental consent</li>
          </ul>
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="ml-2 text-sm text-gray-700">
              I agree to the terms and conditions
            </span>
          </label>
        </div>

        <button
          onClick={handleContinue}
          disabled={!agreed}
          className={`w-full py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-white transition-all duration-300 ${
            agreed
              ? "bg-primary hover:bg-opacity-90"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Continue to Birth Chart
        </button>
      </div>
    </div>
  );
}