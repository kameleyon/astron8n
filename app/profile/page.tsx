"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/dashboard/LoadingState";
import ErrorState from "@/components/dashboard/ErrorState";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { User, FileText, Edit, AlertCircle } from "lucide-react";
import BirthChartModal from "@/components/BirthChartModal";
import type { BirthChartData } from "@/lib/types/birth-chart";
import { BirthChartResult } from "../../birthchartpack/components/birth-chart/birth-chart-result";
import { calculateLifePath, getBirthCard } from "@/lib/utils/calculations";

// This type is for the data we pass to the BirthChartModal form
interface BirthChartFormData {
  name: string;
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
  hasUnknownBirthTime: boolean;
}

interface UserProfile {
  id: string;
  full_name: string;
  birth_date: string;
  birth_time: string | null;
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

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [birthChartData, setBirthChartData] = useState<BirthChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth");
          return;
        }

        setEmail(user.email || null);

        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        // Only throw error if it's not a "no rows returned" error
        if (error && error.code !== 'PGRST116') throw error;

        // Even if there's no data, we should show the profile page with a warning
        if (!data) {
          // Create an empty profile to show the warning message
          setProfile({
            id: user.id,
            full_name: '',
            birth_date: '',
            birth_time: null,
            birth_location: '',
            latitude: 0,
            longitude: 0,
            has_unknown_birth_time: true
          });
          return;
        }

        setProfile(data);

        // Calculate birth chart data
        if (data) {
          try {
            const birthTime = standardizeTime(data.birth_time);

            const requestData = {
              name: data.full_name,
              date: data.birth_date,
              time: birthTime,
              location: data.birth_location,
              latitude: data.latitude,
              longitude: data.longitude,
            };

            console.log("Sending birth chart request:", requestData);

            const response = await fetch("/api/calculate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error("Birth chart API error:", errorData);
              throw new Error(errorData.error || "Failed to fetch birth chart data");
            }

            const chartData = await response.json();
            console.log("Birth chart data received:", chartData);
            setBirthChartData(chartData);
          } catch (err) {
            console.error("Error calculating birth chart:", err);
            setError(err instanceof Error ? err.message : "Failed to calculate birth chart");
          }
        }
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!profile) return <LoadingState />;

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      return `${month}/${day}/${year}`;
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateStr;
    }
  };

  // Called when the user clicks "Save" in the birth chart modal
  const handleBirthChartUpdate = async (data: BirthChartFormData) => {
    try {
      const has_unknown_birth_time = data.hasUnknownBirthTime;
      // If user left time blank or unknown, set to 12:00 by default
      const timeValue = has_unknown_birth_time && !data.time ? "12:00" : data.time;

      // Update user in supabase
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          full_name: data.name,
          birth_date: data.date,
          birth_time: timeValue,
          birth_location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          has_unknown_birth_time,
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      // Refresh local state
      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          full_name: data.name,
          birth_date: data.date,
          birth_time: timeValue,
          birth_location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          has_unknown_birth_time,
        };
      });

      // Refresh the chart data
      const requestData = {
        name: data.name,
        date: data.date,
        time: timeValue || "12:00",
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
      };
      console.log("Sending birth chart update request:", requestData);

      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Birth chart API error:", errorData);
        throw new Error(errorData.error || "Failed to fetch birth chart data");
      }

      const chartData = await response.json();
      console.log("Updated birth chart data received:", chartData);
      setBirthChartData(chartData);

      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating birth chart:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update birth chart");
      }
    }
  };

  const isBirthDataIncomplete = !profile.birth_date || !profile.birth_location;

  return (
    <SessionProvider requireAuth>
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-secondary to-accent">
        <div className="absolute inset-0 dot-pattern"></div>

        <Header onAuth={() => {}} />

        <main className="flex-grow relative z-10 py-12 mb-8">
          <div className="w-full max-w-5xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-white text-left mb-4 pl-8">
              My profile
            </h1>

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-3 bg-white/20 backdrop-blur-sm rounded-xl p-1 mb-8">
                <TabsTrigger
                  value="personal"
                  className="text-white data-[state=active]:bg-white/50 data-[state=active]:text-primary"
                >
                  <User className="h-4 w-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger
                  value="birthchart"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Birth Chart
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="bg-white/95 backdrop-blur-sm rounded-3xl mb-6 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Personal Information Section */}
                    <div className="p-8 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">
                            {profile.full_name}
                          </h2>
                          <p className="text-gray-500 mt-1">{email}</p>
                        </div>
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors text-sm"
                        >
                          <Edit className="h-4 w-4" />
                          Edit Profile
                        </button>
                      </div>

                      {isBirthDataIncomplete && (
                        <div className="bg-yellow-50/50 border border-yellow-200 rounded-xl p-4 mb-6">
                          <p className="text-yellow-800 flex items-center gap-2 text-sm">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            Please complete your birth information to get accurate readings
                          </p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Birth Details</h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500">Birth Date</p>
                              <p className="text-gray-900 mt-0.5">
                                {profile.birth_date ? formatDate(profile.birth_date) : "Not provided"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Birth Time</p>
                              <p className="text-gray-900 mt-0.5">
                                {profile.has_unknown_birth_time ? "Not provided" : profile.birth_time}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Birth Location</p>
                              <p className="text-gray-900 mt-0.5">
                                {profile.birth_location || "Not provided"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Astrological Profile</h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500">Sun Sign</p>
                              <p className="text-gray-900 mt-0.5">
                                {birthChartData?.planets.find(p => p.name === "Sun")?.sign || "Not available"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Moon Sign</p>
                              <p className="text-gray-900 mt-0.5">
                                {birthChartData?.planets.find(p => p.name === "Moon")?.sign || "Not available"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Ascendant</p>
                              <p className="text-gray-900 mt-0.5">
                                {birthChartData?.ascendant?.sign || "Not available"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spiritual Profile Section */}
                    <div className="p-8 bg-gray-50/50">
                      <h3 className="text-lg font-medium text-gray-900 mb-6">Spiritual Profile</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">Human Design</p>
                          <p className="text-gray-900 font-medium">Coming soon</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">Life Path Number</p>
                          <p className="text-gray-900 font-medium">
                            {profile.birth_date ? calculateLifePath(profile.birth_date) : "Not available"}
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">Birth Card</p>
                          <p className="text-gray-900 font-medium">
                            {profile.birth_date ? getBirthCard(profile.birth_date) : "Not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="birthchart">
                <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-primary">Birth Chart</h2>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    </div>
                    {isBirthDataIncomplete ? (
                      <div className="text-gray-600">
                        Please complete your birth information to view your birth chart.
                      </div>
                    ) : birthChartData ? (
                      <BirthChartResult
                        data={birthChartData}
                        onBack={() => {}}
                      />
                    ) : (
                      <div className="text-gray-600">
                        Loading birth chart data...
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">
                      Reports
                    </h2>
                    <p className="text-gray-600">
                      Here you can find all your downloaded reports.
                    </p>
                    {/* Add logic to display reports */}
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>
        </main>

        <Footer />
      </div>

      {/* The BirthChartModal replaces the old embedded form */}
      <BirthChartModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        // We cast the function to match the signature (data: BirthChartFormData) => void
        onSubmit={(data) => void handleBirthChartUpdate(data)}
      />
    </SessionProvider>
  );
}
