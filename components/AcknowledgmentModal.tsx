"use client";

import { useState } from "react";
import { Shield, X } from "lucide-react";

interface AcknowledgmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function AcknowledgmentModal({ isOpen, onClose, onAccept }: AcknowledgmentModalProps) {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in slide-in-from-bottom duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to AstroGenie 🌟
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Please accept our terms and complete your birth chart profile to get started.
          </p>
          
          <div className="space-y-6">
            <div className="text-left text-sm text-gray-600 mb-4 bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
            <p className="mb-4">By using AstroGenie, you acknowledge and agree that:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The astrological insights provided are for entertainment and self-reflection purposes only</li>
              <li>Your birth data will be used to generate personalized astrological readings</li>
              <li>You can update or delete your data at any time through your profile settings</li>
            </ul>
          </div>

          </div>
          
          <div className="flex items-center justify-center mb-6">
            <input
              type="checkbox"
              id="accept"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="accept" className="text-sm text-gray-600">
              I accept the terms of service
            </label>
          </div>

        </div>

        <button
          onClick={onAccept}
          disabled={!accepted}
          className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
