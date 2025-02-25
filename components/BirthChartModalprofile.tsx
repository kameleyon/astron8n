"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { LocationSearch } from "@/components/LocationSearch";
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
  initialData?: {
    name?: string;
    date?: string;
    time?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    hasUnknownBirthTime?: boolean;
  };
}

export default function BirthChartModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: BirthChartModalProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    hasUnknownBirthTime: initialData?.hasUnknownBirthTime || false,
  });
  
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    initialData?.location && initialData?.latitude && initialData?.longitude
      ? {
          name: initialData.location,
          lat: initialData.latitude,
          lng: initialData.longitude,
        }
      : null
  );
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user profile data when modal opens
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isOpen) return;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setError("User not authenticated");
          return;
        }
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFormData({
            name: data.full_name || "",
            date: data.birth_date || "",
            time: data.birth_time || "",
            hasUnknownBirthTime: data.has_unknown_birth_time || false,
          });
          
          if (data.birth_location && data.latitude && data.longitude) {
            setSelectedLocation({
              name: data.birth_location,
              lat: data.latitude,
              lng: data.longitude,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user data. Please try again.');
      }
    };
    
    fetchUserProfile();
  }, [isOpen]);

  if (!isOpen) return null;

  const updateUserProfile = async (userId: string) => {
    try {
      // Use the new API endpoint instead of direct Supabase interaction
      const response = await fetch('/api/update-birth-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          full_name: formData.name,
          birth_date: formData.date,
          birth_time: formData.time,
          birth_location: selectedLocation?.name,
          latitude: selectedLocation?.lat,
          longitude: selectedLocation?.lng,
          hasUnknownBirthTime: formData.hasUnknownBirthTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update birth chart profile');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error("Error updating user profile");
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
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      // Update user profile
      await updateUserProfile(session.user.id);

      // Continue with the original onSubmit
      onSubmit({
        name: formData.name,
        date: formData.date,
        time: formData.hasUnknownBirthTime ? "12:00" : formData.time, // Default to noon if time unknown
        location: selectedLocation.name,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        hasUnknownBirthTime: formData.hasUnknownBirthTime,
      });
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to update user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Update Birth Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
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

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
