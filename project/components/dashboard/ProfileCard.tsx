"use client";

import { PenSquare, User, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseISO } from "date-fns";
import { useState } from "react";

interface ProfileCardProps {
  profile: {
    full_name: string;
    birth_date: string;
    birth_time: string | null;
    birth_location: string;
    has_unknown_birth_time: boolean;
  };
  email: string | null;
}

export default function ProfileCard({ profile, email }: ProfileCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (time: string | null) => {
    if (!time) return "Not provided";
    try {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      });
    } catch (err) {
      return time;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      }).format(date);
    } catch (err) {
      return dateStr;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary p-3 rounded-full">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-primary">{profile.full_name}</h2>
                <button 
                  onClick={() => router.push("/birth-chart")}
                  className="md:hidden p-1 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <PenSquare size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => router.push("/birth-chart")}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
        >
          <PenSquare size={16} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Mobile Collapsible Section */}
      <div className="md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full py-2 text-primary"
        >
          <h3 className="text-lg font-semibold">Birth Information</h3>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <div className={`space-y-4 overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Birth Date</label>
            <p className="mt-1 text-gray-900">{formatDate(profile.birth_date)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Birth Time</label>
            <p className="mt-1 text-gray-900">
              {profile.has_unknown_birth_time ? "Not provided" : formatTime(profile.birth_time)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Birth Place</label>
            <p className="mt-1 text-gray-900">{profile.birth_location}</p>
          </div>
        </div>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <h3 className="text-lg font-semibold text-primary mb-4">Birth Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Birth Date</label>
            <p className="mt-1 text-gray-900">{formatDate(profile.birth_date)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Birth Time</label>
            <p className="mt-1 text-gray-900">
              {profile.has_unknown_birth_time ? "Not provided" : formatTime(profile.birth_time)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Birth Place</label>
            <p className="mt-1 text-gray-900">{profile.birth_location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}