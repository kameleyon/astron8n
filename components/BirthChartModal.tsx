"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { LocationSearch } from "@/components/LocationSearch";
import { addDays } from "date-fns";
import { supabase } from "@/lib/supabase";

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
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const saveUserProfile = async (userId: string) => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', userId)
        .single();

      const profileData = {
        id: userId,
        full_name: formData.name,
        birth_date: formData.date,
        birth_time: formData.hasUnknownBirthTime ? null : formData.time,
        birth_location: selectedLocation?.name,
        latitude: selectedLocation?.lat,
        longitude: selectedLocation?.lng,
        has_unknown_birth_time: formData.hasUnknownBirthTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        has_accepted_terms: true,
        acknowledged: true
      };

      let error;
      if (existingProfile) {
        // Update existing profile
        ({ error } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('id', userId));
      } else {
        // Insert new profile
        ({ error } = await supabase
          .from('user_profiles')
          .insert(profileData));
      }

      if (error) throw error;
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  };

  const saveUserCredits = async (userId: string) => {
    try {
      // Check if credits exist
      const { data: existingCredits } = await supabase
        .from('user_credits')
        .select()
        .eq('user_id', userId)
        .single();

      if (existingCredits) {
        // Credits already exist, no need to create trial
        return;
      }

      const trialEndDate = addDays(new Date(), 3);
      
      const { error } = await supabase.from('user_credits').insert({
        user_id: userId,
        total_credits: 5000,
        used_credits: 0,
        is_subscriber: false,
        trial_end_date: trialEndDate.toISOString(),
        trial_expiration_date: trialEndDate.toISOString()
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving user credits:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!selectedLocation) {
      setError("Please select a valid location");
      setIsLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      // Save data to both tables
      await Promise.all([
        saveUserProfile(user.id),
        saveUserCredits(user.id)
      ]);

      // Continue with the original onSubmit
      onSubmit({
        name: formData.name,
        date: formData.date,
        time: formData.hasUnknownBirthTime ? "" : formData.time,
        location: selectedLocation.name,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        hasUnknownBirthTime: formData.hasUnknownBirthTime,
      });
    } catch (error) {
      console.error('Error saving user data:', error);
      setError('Failed to save user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Update Birth Details</h2>
          
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
            disabled={isLoading}
            className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
