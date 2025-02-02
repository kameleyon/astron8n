"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { LocationSearch } from "@/app/birth-chart/location-search";

interface BirthChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BirthChartData) => void;
}

interface BirthChartData {
  name: string;
  birthDate: string;
  birthTime: string;
  location: string;
  latitude: number;
  longitude: number;
  hasUnknownBirthTime: boolean;
}

export default function BirthChartModal({ isOpen, onClose, onSubmit }: BirthChartModalProps) {
  const [formData, setFormData] = useState<BirthChartData>({
    name: "",
    birthDate: "",
    birthTime: "",
    location: "",
    latitude: 0,
    longitude: 0,
    hasUnknownBirthTime: false
  });

  const handleLocationSelect = (location: { name: string; lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      location: location.name,
      latitude: location.lat,
      longitude: location.lng
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.hasUnknownBirthTime) {
      formData.birthTime = "12:00"; // Set to noon for unknown birth times
    }
    onSubmit(formData);
  };

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Enter Your Birth Details
          </h2>
          <p className="text-sm text-gray-600">
            This information will be used to generate your personalized astrological insights
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Birth Date
            </label>
            <input
              type="date"
              required
              value={formData.birthDate}
              onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Birth Time
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="unknownTime"
                  checked={formData.hasUnknownBirthTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasUnknownBirthTime: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="unknownTime" className="text-sm text-gray-600">
                  Unknown birth time
                </label>
              </div>
            </div>
            <input
              type="time"
              required={!formData.hasUnknownBirthTime}
              disabled={formData.hasUnknownBirthTime}
              value={formData.birthTime}
              onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Birth Location
            </label>
            <LocationSearch onSelect={handleLocationSelect} />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
