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
import { Separator } from "@/components/ui/separator";
import { User, Settings, FileText, Activity, CreditCard, Edit } from "lucide-react";
import ProgressBar from "../../components/ui/ProgressBar";
import BirthChartModal from "@/components/BirthChartModal";
import type { BirthChartData } from "../../birthchartpack/lib/types/birth-chart";
import { BirthChartResult } from "../../birthchartpack/components/birth-chart/birth-chart-result";

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
  const [credits, setCredits] = useState(100); // Initial credits
  const [billingInfo, setBillingInfo] = useState({ nextPaymentDate: "", activities: [] });
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
          .single();

        if (error) throw error;

        if (!data) {
          router.push("/birth-chart");
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
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 bg-white/20 backdrop-blur-sm rounded-xl p-1 mb-8">
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
                <TabsTrigger
                  value="usage"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Usage
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-primary mb-4">
                          Personal Information
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Full Name
                            </label>
                            <p className="mt-1 text-gray-900">
                              {profile.full_name}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Email
                            </label>
                            <p className="mt-1 text-gray-900">{email}</p>
                          </div>
                        </div>

                        <button
                          className="mt-4 text-primary hover:underline flex items-center"
                          onClick={() => setShowEditModal(true)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-4">
                          Birth Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Birth Date
                            </label>
                            <p className="mt-1 text-gray-900">
                              {formatDate(profile.birth_date)}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Birth Time
                            </label>
                            <p className="mt-1 text-gray-900">
                              {profile.has_unknown_birth_time
                                ? "Not provided"
                                : profile.birth_time}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600">
                              Birth Location
                            </label>
                            <p className="mt-1 text-gray-900">
                              {profile.birth_location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="birthchart">
                <Card className="bg-white/70 backdrop-blur-sm rounded-3xl">
                  <CardContent className="p-6">
                    {birthChartData ? (
                      <BirthChartResult
                        data={birthChartData}
                        onBack={() => {}}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-16" />
                        <p className="text-gray-600">Loading birth chart data...</p>
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

              <TabsContent value="usage">
                <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">
                      Usage
                    </h2>
                    <p className="text-gray-600">
                      You have {credits} credits remaining.
                    </p>
                    <ProgressBar value={((100 - credits) / 100) * 100} />
                    {/* Add logic for credit management */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing">
                <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">
                      Billing
                    </h2>
                    <p className="text-gray-600">
                      Next payment date: {billingInfo.nextPaymentDate}
                    </p>
                    <p className="text-gray-600">Billing activities:</p>
                    <ul className="list-disc list-inside">
                      {billingInfo.activities.map((activity, index) => (
                        <li key={index} className="text-gray-600">
                          {activity}
                        </li>
                      ))}
                    </ul>
                    {/* Add logic for billing activities */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">
                      Settings
                    </h2>
                    <p className="text-gray-600">
                      Manage your account settings here.
                    </p>
                    {/* Add settings options */}
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
