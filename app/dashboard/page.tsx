"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import ChatInterface from "@/components/ChatInterface";
import LoadingState from "@/components/dashboard/LoadingState";
import ErrorState from "@/components/dashboard/ErrorState";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SessionProvider from "@/components/SessionProvider";
import AcknowledgmentModal from "@/components/AcknowledgmentModal";
import BirthChartModal from "@/components/BirthChartModal";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAckModal, setShowAckModal] = useState(false);
  const [showBirthChartModal, setShowBirthChartModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
          error: authError
        } = await supabase.auth.getUser();

        // If not logged in redirect to /auth
        if (authError || !user) {
          router.push("/auth");
          return;
        }

        // Check user metadata to see if they've acknowledged
        const hasAccepted = (user.user_metadata as any)?.acceptedAck;

        // Check if user has a birth chart profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!hasAccepted) {
          // Show acknowledgment modal first
          setShowAckModal(true);
        } else if (!profile) {
          // If they've acknowledged but don't have a profile, show birth chart modal
          setShowBirthChartModal(true);
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Error in dashboard:", err);
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  async function handleAccept() {
    // Mark user as having acknowledged in user_metadata
    const { data, error: updateError } = await supabase.auth.updateUser({
      data: {
        acceptedAck: true
      }
    });
    if (updateError) {
      console.error(updateError);
      setError(updateError.message);
      return;
    }
    setShowAckModal(false);
    
    // After acknowledgment, check if they need to fill birth chart
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user?.id)
      .single();
      
    if (!profile) {
      setShowBirthChartModal(true);
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <SessionProvider requireAuth>
      <DashboardLayout>
        <div className="w-full">
          {/* Show AcknowledgmentModal if user hasn't accepted */}
          <AcknowledgmentModal
            isOpen={showAckModal}
            onClose={() => setShowAckModal(false)}
            onAccept={handleAccept}
          />
          {/* Show BirthChartModal if user needs to fill it out */}
          <BirthChartModal
            isOpen={showBirthChartModal}
            onClose={() => setShowBirthChartModal(false)}
            onSubmit={async (data) => {
              try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Save birth chart data to user_profiles
                const { error: profileError } = await supabase
                  .from('user_profiles')
                  .insert({
                    id: user.id,
                    full_name: data.name,
                    birth_date: data.date,
                    birth_time: data.time,
                    birth_location: data.location,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    has_unknown_birth_time: data.hasUnknownBirthTime
                  });

                if (profileError) throw profileError;
                setShowBirthChartModal(false);
              } catch (err) {
                console.error('Error saving birth chart:', err);
                setError('Failed to save birth chart data');
              }
            }}
          />
          {/* Main Dashboard Content */}
          <ChatInterface />
        </div>
      </DashboardLayout>
    </SessionProvider>
  );
}
