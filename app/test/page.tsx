// Use Next.js "use client" + supabase to fetch user birth chart from the database
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { BirthChartData } from "@/lib/types/birth-chart";
import { BirthChartResult } from "@/app/birth-chart/birth-chart-result";

// Optional loading/error states if you have them, else create placeholders
import LoadingState from "@/components/dashboard/LoadingState";
import ErrorState from "@/components/dashboard/ErrorState";

interface UserProfile {
  id: string;
  full_name: string;
  birth_date: string;         // e.g. "2008-11-17"
  birth_time: string | null;  // e.g. "09:54:00"
  birth_location: string;
  latitude: number;
  longitude: number;
  has_unknown_birth_time: boolean;
}

/**
 * Convert a time string (possibly including seconds, e.g. "09:54:00") 
 * into a "HH:MM" 24-hour format. 
 * If the string can't be parsed, we default to noon ("12:00").
 */
function standardizeTime(originalTime: string | null): string {
  if (!originalTime || !originalTime.trim()) {
    return "12:00"; 
  }

  // If it has seconds, strip them off: e.g. "09:54:00" -> "09:54"
  // e.g. "HH:MM:SS"
  const parts = originalTime.trim().split(":");
  if (parts.length === 3) {
    // Keep only [HH, MM]
    originalTime = `${parts[0]}:${parts[1]}`;
  }

  // Check if it's already valid 24-hour HH:MM
  const hhmm24 = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (hhmm24.test(originalTime)) {
    return originalTime;
  }

  // If not valid, fallback to noon
  return "12:00";
}

export default function TestPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [birthChartData, setBirthChartData] = useState<BirthChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfileAndChart = async () => {
      try {
        // Check if user is logged in
        const {
          data: { user },
          error: authError
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push("/auth");
          return;
        }

        // Fetch the user's profile
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError || !profileData) {
          setError(profileError?.message || "Profile not found");
          return;
        }

        setProfile(profileData);

        // Convert birth_time from e.g. "09:54:00" -> "09:54"
        // If not recognized, fallback "12:00"
        const birthTime = standardizeTime(profileData.birth_time);

        const requestData = {
          name: profileData.full_name,
          date: profileData.birth_date, 
          time: birthTime, 
          location: profileData.birth_location,
          latitude: profileData.latitude,
          longitude: profileData.longitude,
        };

        // Call our /api/calculate route
        const response = await fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to calculate birth chart");
        }

        const chartData = await response.json();
        setBirthChartData(chartData);
      } catch (err) {
        console.error("Error fetching birth chart data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch birth chart");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileAndChart();
  }, [router]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!profile || !birthChartData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <p>No birth chart data available.</p>
      </div>
    );
  }

  // Render the birth chart
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-white">
          {profile.full_name}'s Birth Chart
        </h1>
        <BirthChartResult
          data={birthChartData}
          onBack={() => {}}
        />
      </div>
    </div>
  );
}
