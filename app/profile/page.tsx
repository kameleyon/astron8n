"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/dashboard/LoadingState";
import ErrorState from "@/components/dashboard/ErrorState";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";
import { User, FileText, Edit, AlertCircle } from "lucide-react";
import { ProfileBento } from "@/components/profile/bento/ProfileBento";
import BirthChartModalProfile from "@/components/BirthChartModalprofile";
import type { BirthChartData } from "@/lib/types/birth-chart";
import { BirthChartResult } from "../../birthchartpack/components/birth-chart/birth-chart-result";
import { calculateLifePath, getBirthCard } from "@/lib/utils/calculations";
import { HumanDesignProfile } from "@/lib/utils/humanDesign";

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

interface Report {
  id: string;
  user_id: string;
  report_type: string;
  file_name: string;
  content: string;
  created_at: string;
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
  const [humanDesignData, setHumanDesignData] = useState<HumanDesignProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 7;

  // Calculate pagination
  const totalPages = Math.ceil((reports?.length || 0) / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;
  const currentReports = reports.slice(startIndex, endIndex);

  // Function to handle report downloads
  const handleDownloadReport = async (fileName: string): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }

      const response = await fetch('/api/reports/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const data = await response.json();
      
      // Convert base64 to blob and download
      const pdfBytes = atob(data.pdfBytes);
      const pdfBlob = new Blob(
        [new Uint8Array(pdfBytes.split('').map(char => char.charCodeAt(0)))],
        { type: 'application/pdf' }
      );
      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error downloading report:', err);
      setError(err instanceof Error ? err.message : 'Failed to download report');
    }
  };

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

        // Fetch reports
        const { data: reportsData, error: reportsError } = await supabase
          .from('user_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (reportsError) {
          console.error('Error fetching reports:', reportsError);
        } else {
          setReports(reportsData || []);
        }

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

            const calculateResponse = await fetch("/api/calculate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            });

            if (!calculateResponse.ok) {
              const errorData = await calculateResponse.json();
              console.error("Birth chart API error:", errorData);
              throw new Error(errorData.error || "Failed to fetch birth chart data");
            }

            const chartData = await calculateResponse.json();
            console.log("Birth chart data received:", chartData);
            setBirthChartData(chartData);

            // Fetch Human Design data
            const hdResponse = await fetch("/api/human-design", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                birthDate: data.birth_date,
                birthTime: birthTime,
                latitude: data.latitude,
                longitude: data.longitude,
              }),
            });

            if (!hdResponse.ok) {
              const errorData = await hdResponse.json();
              console.error("Human Design API error:", errorData);
              throw new Error(errorData.error || "Failed to fetch Human Design data");
            }

            const hdData = await hdResponse.json();
            console.log("Human Design data received:", hdData);
            setHumanDesignData(hdData);
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

      // Use the new API endpoint instead of direct Supabase interaction
      const updateResponse = await fetch('/api/update-birth-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: profile.id,
          full_name: data.name,
          birth_date: data.date,
          birth_time: timeValue,
          birth_location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          hasUnknownBirthTime: has_unknown_birth_time,
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || 'Failed to update birth chart profile');
      }

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
      // Ensure time is in 24-hour format (HH:MM)
      const formattedTime = standardizeTime(timeValue || "12:00");
      
      const requestData = {
        name: data.name,
        date: data.date,
        time: formattedTime,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
      };
      console.log("Sending birth chart update request:", requestData);

      const chartResponse = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!chartResponse.ok) {
        const errorData = await chartResponse.json();
        console.error("Birth chart API error:", errorData);
        throw new Error(errorData.error || "Failed to fetch birth chart data");
      }

      const chartData = await chartResponse.json();
      console.log("Updated birth chart data received:", chartData);
      setBirthChartData(chartData);

      // Update Human Design data
      // Ensure time is in 24-hour format (HH:MM) for Human Design API
      const formattedTimeHD = standardizeTime(timeValue || "12:00");
      
      const hdResponse = await fetch("/api/human-design", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birthDate: data.date,
          birthTime: formattedTimeHD,
          latitude: data.latitude,
          longitude: data.longitude,
        }),
      });

      if (!hdResponse.ok) {
        const errorData = await hdResponse.json();
        console.error("Human Design API error:", errorData);
        throw new Error(errorData.error || "Failed to fetch Human Design data");
      }

      const hdData = await hdResponse.json();
      console.log("Updated Human Design data received:", hdData);
      setHumanDesignData(hdData);

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

        <main className="flex-grow relative z-10 py-6 sm:py-8 md:py-12 mb-4 sm:mb-6 md:mb-8">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4">
            {isBirthDataIncomplete && (
              <div className="bg-yellow-50/80 border border-yellow-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 max-w-5xl mx-auto">
                <p className="text-yellow-800 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Please complete your birth information to get accurate readings
                </p>
              </div>
            )}

            <ProfileBento
              profile={profile}
              email={email}
              birthChartData={birthChartData}
              humanDesignData={humanDesignData}
              lifePathNumber={profile.birth_date ? calculateLifePath(profile.birth_date) : null}
              birthCard={profile.birth_date ? getBirthCard(profile.birth_date) : null}
              reports={reports}
              isLoading={loading}
              onEdit={() => setShowEditModal(true)}
              onDownloadReport={handleDownloadReport}
            />
          </div>
        </main>

        <Footer />
      </div>

      {/* The BirthChartModal replaces the old embedded form */}
      <BirthChartModalProfile
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        // We cast the function to match the signature (data: BirthChartFormData) => void
        onSubmit={(data) => void handleBirthChartUpdate(data)}
      />
    </SessionProvider>
  );
}
