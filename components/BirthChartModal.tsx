"use client";

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { LocationSearch } from "@/components/LocationSearch";

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface BirthChartData {
  name: string;
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
  hasUnknownBirthTime: boolean;
}

interface BirthChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BirthChartData) => void;
}

export default function BirthChartModal({
  isOpen,
  onClose,
  onSubmit,
}: BirthChartModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    hasUnknownBirthTime: false,
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedLocation) {
      setError("Please select a valid location");
      return;
    }

    onSubmit({
      name: formData.name,
      date: formData.date,
      time: formData.hasUnknownBirthTime ? "" : formData.time,
      location: selectedLocation.name,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      hasUnknownBirthTime: formData.hasUnknownBirthTime,
    });
  };

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
            Provide your birth info for accurate readings
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
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
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasUnknownBirthTime: e.target.checked,
                    }))
                  }
                  className="mr-2"
                />
                <label htmlFor="unknownTime" className="text-sm text-gray-600">
                  Unknown
                </label>
              </div>
            </div>
            <input
              type="time"
              required={!formData.hasUnknownBirthTime}
              disabled={formData.hasUnknownBirthTime}
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, time: e.target.value }))
              }
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Place of Birth
            </label>
            <LocationSearch
              value={selectedLocation?.name}
              onSelect={setSelectedLocation}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
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
